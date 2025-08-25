(function() {
    'use strict';

    // Function to initialize hCaptcha without XHR
    const initializeStandardHCaptcha = function() {
        console.log('Initializing standard hCaptcha (non-XHR mode)');

        // Find all hCaptcha containers
        const containers = document.querySelectorAll('[data-captcha-provider="hcaptcha"]');

        containers.forEach(function(container) {
            const formId = container.dataset.formId;
            const containerId = `h-captcha-${formId}`;
            const widgetContainer = document.getElementById(containerId);

            if (!widgetContainer) return;

            const sitekey = container.dataset.sitekey;
            const theme = container.dataset.theme || 'light';
            const size = container.dataset.size || 'normal';

            if (!sitekey) {
                console.warn('Cannot initialize hCaptcha - missing sitekey attribute');
                return;
            }

            // Get the form element
            const form = document.getElementById(formId);
            if (!form) {
                console.warn(`Form #${formId} not found for hCaptcha widget`);
                return;
            }

            // Check if we have a render function from the template
            const funcName = `renderHCaptcha_${formId.replace(/-/g, '_')}`;
            if (typeof window[funcName] === 'function') {
                console.log(`Using template-provided render function: ${funcName}`);
                window[funcName]();
                return;
            }

            // Define the callback function name, replacing hyphens with underscores
            const callbackName = `hCaptchaCallback_${formId.replace(/-/g, '_')}`;
            const expiredCallbackName = `hCaptchaExpiredCallback_${formId.replace(/-/g, '_')}`;

            // Define the callback functions if they don't exist
            if (typeof window[callbackName] !== 'function') {
                window[callbackName] = function(token) {
                    console.log(`hCaptcha token received for form: ${formId}`);

                    // Set the token in the hidden field
                    let hiddenInput = form.querySelector('input[name="h-captcha-response"]');
                    if (!hiddenInput) {
                        hiddenInput = document.createElement('input');
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = 'h-captcha-response';
                        form.appendChild(hiddenInput);
                    }
                    hiddenInput.value = token;
                };
            }

            if (typeof window[expiredCallbackName] !== 'function') {
                window[expiredCallbackName] = function() {
                    console.log(`hCaptcha token expired for form: ${formId}`);

                    // Clear the token
                    const hiddenInput = form.querySelector('input[name="h-captcha-response"]');
                    if (hiddenInput) {
                        hiddenInput.value = '';
                    }
                };
            }

            if (typeof hcaptcha !== 'undefined') {
                try {
                    hcaptcha.render(containerId, {
                        sitekey: sitekey,
                        theme: theme,
                        size: size,
                        callback: window[callbackName],
                        'expired-callback': window[expiredCallbackName]
                    });
                    console.log(`hCaptcha rendered for form: ${formId}`);
                } catch (e) {
                    console.error('Error rendering hCaptcha widget:', e.message);
                }
            } else {
                console.warn('hCaptcha API not available, will try again when API loads');
            }
        });
    };

    // Function to register with XHR system when available
    const registerHCaptchaHandler = function() {
        // First check if XHR system is available
        if (typeof window.GravFormXHR === 'undefined' || !window.GravFormXHR.captcha) {
            // No XHR system, just initialize standard captcha
            console.log('GravFormXHR not available, using standard hCaptcha initialization');
            initializeStandardHCaptcha();
            return;
        }

        console.log('Registering hCaptcha with GravFormXHR');

        // XHR system is available, register handler
        window.GravFormXHR.captcha.register('hcaptcha', {
            reset: function(container, form) {
                if (!form || !form.id) {
                    console.warn('Cannot reset hCaptcha: invalid form');
                    return;
                }

                const formId = form.id;
                const hcaptchaId = `h-captcha-${formId}`;

                console.log(`XHR reset requested for hCaptcha in form: ${formId}`);

                // Check if we have a custom reset function from the template
                const resetFuncName = `resetHCaptcha_${formId.replace(/-/g, '_')}`;
                if (typeof window[resetFuncName] === 'function') {
                    console.log(`Using template-provided reset function: ${resetFuncName}`);
                    window[resetFuncName]();
                    return;
                }

                // Check if we have a render function from the template
                const renderFuncName = `renderHCaptcha_${formId.replace(/-/g, '_')}`;
                if (typeof window[renderFuncName] === 'function') {
                    console.log(`Using template-provided render function: ${renderFuncName}`);
                    window[renderFuncName]();
                    return;
                }

                const widgetContainer = document.getElementById(hcaptchaId);
                if (!widgetContainer) {
                    console.warn(`hCaptcha container #${hcaptchaId} not found.`);
                    return;
                }

                // Get configuration from data attributes
                const parentContainer = container.closest('[data-captcha-provider="hcaptcha"]');
                const sitekey = parentContainer ? parentContainer.dataset.sitekey : null;

                if (!sitekey) {
                    console.warn('Cannot reinitialize hCaptcha - missing sitekey attribute');
                    return;
                }

                // Define the callback function name, replacing hyphens with underscores
                const callbackName = `hCaptchaCallback_${formId.replace(/-/g, '_')}`;
                const expiredCallbackName = `hCaptchaExpiredCallback_${formId.replace(/-/g, '_')}`;

                // Define the callback functions if they don't exist
                if (typeof window[callbackName] !== 'function') {
                    window[callbackName] = function(token) {
                        console.log(`hCaptcha token received for form: ${formId}`);

                        // Set the token in the hidden field
                        let hiddenInput = form.querySelector('input[name="h-captcha-response"]');
                        if (!hiddenInput) {
                            hiddenInput = document.createElement('input');
                            hiddenInput.type = 'hidden';
                            hiddenInput.name = 'h-captcha-response';
                            form.appendChild(hiddenInput);
                        }
                        hiddenInput.value = token;
                    };
                }

                if (typeof window[expiredCallbackName] !== 'function') {
                    window[expiredCallbackName] = function() {
                        console.log(`hCaptcha token expired for form: ${formId}`);

                        // Clear the token
                        const hiddenInput = form.querySelector('input[name="h-captcha-response"]');
                        if (hiddenInput) {
                            hiddenInput.value = '';
                        }
                    };
                }

                // Store widget instance to allow resets
                const instanceKey = `hcaptcha_instance_${formId}`;
                window[instanceKey] = window[instanceKey] || { widgetId: null, rendered: false };

                // Clear the container to ensure fresh rendering
                widgetContainer.innerHTML = '';

                // Clear any existing token
                const hiddenInput = form.querySelector('input[name="h-captcha-response"]');
                if (hiddenInput) {
                    hiddenInput.value = '';
                }

                console.log(`Re-rendering hCaptcha widget for form: ${formId}`);

                // Check if hCaptcha API is available
                if (typeof hcaptcha !== 'undefined') {
                    try {
                        // If we have an existing widget ID, reset it
                        if (window[instanceKey].rendered && window[instanceKey].widgetId !== null) {
                            console.log('Resetting existing hCaptcha widget');
                            try {
                                hcaptcha.reset(window[instanceKey].widgetId);
                                return;
                            } catch (e) {
                                console.warn('Error resetting hCaptcha, will re-render', e);
                            }
                        }

                        // Render with a slight delay to ensure DOM is settled
                        setTimeout(() => {
                            try {
                                window[instanceKey].widgetId = hcaptcha.render(hcaptchaId, {
                                    sitekey: sitekey,
                                    theme: parentContainer ? (parentContainer.dataset.theme || 'light') : 'light',
                                    size: parentContainer ? (parentContainer.dataset.size || 'normal') : 'normal',
                                    callback: window[callbackName],
                                    'expired-callback': window[expiredCallbackName],
                                    'error-callback': function(error) {
                                        console.error(`hCaptcha error for form ${formId}: ${error}`);
                                    }
                                });
                                window[instanceKey].rendered = true;
                                console.log(`hCaptcha widget rendered for form: ${formId} with ID:`, window[instanceKey].widgetId);
                            } catch (e) {
                                console.error(`Error rendering hCaptcha widget: ${e.message}`);
                                widgetContainer.innerHTML = '<p style="color:red;">Error initializing hCaptcha.</p>';
                            }
                        }, 100);
                    } catch (e) {
                        console.error(`Error with hCaptcha widget: ${e.message}`);
                        widgetContainer.innerHTML = '<p style="color:red;">Error initializing hCaptcha.</p>';
                    }
                } else {
                    console.warn('hCaptcha API not available. Attempting to reload...');

                    // Remove existing script if any
                    const existingScript = document.querySelector('script[src*="js.hcaptcha.com/1/api.js"]');
                    if (existingScript) {
                        existingScript.parentNode.removeChild(existingScript);
                    }

                    // Create new script element
                    const script = document.createElement('script');
                    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
                    script.async = true;
                    script.defer = true;
                    script.onload = function() {
                        console.log('hCaptcha API loaded, retrying widget render...');
                        setTimeout(() => {
                            const retryContainer = document.querySelector(`[data-captcha-provider="hcaptcha"]`);
                            if (retryContainer && form) {
                                if (window.GravFormXHR && window.GravFormXHR.captcha) {
                                    window.GravFormXHR.captcha.getProvider('hcaptcha').reset(retryContainer, form);
                                } else {
                                    // Fallback for non-XHR mode
                                    initializeStandardHCaptcha();
                                }
                            }
                        }, 200);
                    };
                    document.head.appendChild(script);
                }
            }
        });

        console.log('hCaptcha XHR handler registered successfully');
    };

    // Check if hCaptcha API is already loaded
    const checkAndInitialize = function() {
        if (typeof hcaptcha !== 'undefined') {
            console.log('hCaptcha API already available, initializing now');
            initializeStandardHCaptcha();
        } else if (document.querySelector('script[src*="js.hcaptcha.com/1/api.js"]')) {
            console.log('hCaptcha API script found but not loaded yet, waiting...');
            // API script is there but not loaded yet, we'll let the onload handle it
        } else {
            console.log('No hCaptcha API script found, will register handlers for later initialization');
        }
    };

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Small delay to allow potential XHR system to initialize
            setTimeout(registerHCaptchaHandler, 100);
            setTimeout(checkAndInitialize, 200);
        });
    } else {
        // DOM already loaded
        setTimeout(registerHCaptchaHandler, 100);
        setTimeout(checkAndInitialize, 200);
    }
})();