# Grav Form Captcha hCaptcha Plugin

This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
assets/
  js/
    hcaptcha-handler.js
classes/
  HCaptchaProvider.php
templates/
  forms/
    fields/
      hcaptcha/
        hcaptcha.html.twig
.repomixignore
blueprints.yaml
composer.json
form-captcha-hcaptcha.php
form-captcha-hcaptcha.yaml
LICENSE
repomix.config.json
```

# Files

## File: assets/js/hcaptcha-handler.js
```javascript
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
```

## File: classes/HCaptchaProvider.php
```php
<?php
namespace Grav\Plugin\FormCaptchaHCaptcha;

use Grav\Common\Grav;
use Grav\Common\Uri;
use Grav\Common\HTTP\Client;
use Grav\Plugin\Form\Captcha\CaptchaProviderInterface;

/**
 * hCaptcha provider implementation
 */
class HCaptchaProvider implements CaptchaProviderInterface
{
    /** @var array */
    protected $config;

    public function __construct()
    {
        $this->config = Grav::instance()['config']->get('plugins.form-captcha-hcaptcha.hcaptcha', []);
    }

    /**
     * {@inheritdoc}
     */
    public function validate(array $form, array $params = []): array
    {
        $grav = Grav::instance();
        $uri = $grav['uri'];
        $hostname = $uri->host();

        try {
            $secretKey = $params['hcaptcha_secret'] ?? $this->config['secret_key'] ?? null;

            if (!$secretKey) {
                throw new \RuntimeException("hCaptcha secret key not configured.");
            }

            // Try to find the token in multiple possible locations
            $token = null;

            // Check standard field
            if (isset($form['h-captcha-response']) && !empty($form['h-captcha-response'])) {
                $token = $form['h-captcha-response'];
            }
            // Check in data array
            elseif (isset($form['data']['h-captcha-response']) && !empty($form['data']['h-captcha-response'])) {
                $token = $form['data']['h-captcha-response'];
            }
            // Check with hyphen replacement (some systems convert hyphens to underscores)
            elseif (isset($form['h_captcha_response']) && !empty($form['h_captcha_response'])) {
                $token = $form['h_captcha_response'];
            }
            // Check in data array with hyphen replacement
            elseif (isset($form['data']['h_captcha_response']) && !empty($form['data']['h_captcha_response'])) {
                $token = $form['data']['h_captcha_response'];
            }
            // Check in nested data structure
            elseif (isset($form['data']['data']['h-captcha-response']) && !empty($form['data']['data']['h-captcha-response'])) {
                $token = $form['data']['data']['h-captcha-response'];
            }
            // Check in direct POST data
            elseif (isset($_POST['h-captcha-response']) && !empty($_POST['h-captcha-response'])) {
                $token = $_POST['h-captcha-response'];
            }
            // Check in nested POST data
            elseif (isset($_POST['data']) && is_array($_POST['data']) &&
                  isset($_POST['data']['h-captcha-response']) &&
                  !empty($_POST['data']['h-captcha-response'])) {
                $token = $_POST['data']['h-captcha-response'];
            }

            if (!$token) {
                return [
                    'success' => false,
                    'error' => 'missing-input-response',
                    'details' => ['error' => 'missing-input-response']
                ];
            }

            $postData = [
                'secret' => $secretKey,
                'response' => $token,
                'hostname' => $hostname,
            ];

            $validationUrl = 'https://hcaptcha.com/siteverify';
            $httpClient = Client::getClient();

            $response = $httpClient->request('POST', $validationUrl, [
                'body' => $postData,
            ]);

            $statusCode = $response->getStatusCode();
            if ($statusCode < 200 || $statusCode >= 300) {
                throw new \RuntimeException("hCaptcha verification request failed with status code: ".$statusCode);
            }

            $responseBody = $response->getContent();
            $validationResponseData = json_decode($responseBody, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException("Invalid JSON received from hCaptcha: ".json_last_error_msg());
            }

            if (!isset($validationResponseData['success'])) {
                throw new \RuntimeException("Invalid response format from hCaptcha verification (missing 'success' key).");
            }

            $isValid = $validationResponseData['success'];

            if (!$isValid) {
                $errorCodes = $validationResponseData['error-codes'] ?? ['validation-failed'];

                return [
                    'success' => false,
                    'error' => 'validation-failed',
                    'details' => ['error-codes' => $errorCodes]
                ];
            }

            return [
                'success' => true
            ];
        } catch (\Exception $e) {
            $grav['log']->error('hCaptcha validation error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'details' => ['exception' => get_class($e)]
            ];
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getClientProperties(string $formId, array $field): array
    {
        $siteKey = $field['hcaptcha_site_key'] ?? $this->config['site_key'] ?? null;
        $theme = $field['hcaptcha_theme'] ?? $this->config['theme'] ?? 'light';
        $size = $field['hcaptcha_size'] ?? $this->config['size'] ?? 'normal';

        return [
            'provider' => 'hcaptcha',
            'siteKey' => $siteKey,
            'theme' => $theme,
            'size' => $size,
            'containerId' => "h-captcha-{$formId}",
            'scriptUrl' => "https://js.hcaptcha.com/1/api.js",
            'initFunctionName' => "initHCaptcha_{$formId}"
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getTemplateName(): string
    {
        return "forms/fields/hcaptcha/hcaptcha.html.twig";
    }
}
```

## File: templates/forms/fields/hcaptcha/hcaptcha.html.twig
```
{% extends "forms/field.html.twig" %}

{% block label %}{% endblock %}

{% block input %}
    {% set config = grav.config.plugins['form-captcha-hcaptcha'].hcaptcha %}
    {% set formId = form.id ?: form.name %}
    {% set lang = grav.language.language %}

    {# Get configuration values with fallbacks #}
    {% set site_key = field.hcaptcha_site_key ?? config.site_key ?? '' %}
    {% set theme = field.hcaptcha_theme ?? config.theme ?? 'light' %}
    {% set size = field.hcaptcha_size ?? config.size ?? 'normal' %}
    {% set container_id = 'h-captcha-' ~ formId %}

    {% if not site_key %}
        <div class="form-error">hCaptcha site key is not set. Please set it in the form field or plugin configuration.</div>
    {% else %}
        <div class="h-captcha-container"
             data-form-id="{{ formId }}"
             data-captcha-provider="hcaptcha"
             data-sitekey="{{ site_key }}"
             data-theme="{{ theme }}"
             data-size="{{ size }}">

            {# Standard hCaptcha div which creates the widget #}
            <div id="{{ container_id }}" class="h-captcha" data-sitekey="{{ site_key }}" data-theme="{{ theme }}" data-size="{{ size }}"></div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Get references to form and container
                var form = document.getElementById('{{ formId }}');
                var container = document.getElementById('{{ container_id }}');

                if (!form || !container) return;

                // This function checks for hCaptcha response and copies it to our field
                function checkForToken() {
                    // Check for hCaptcha's generated response
                    var hcaptchaResponse = document.querySelector('textarea[name="h-captcha-response"]');

                    if (hcaptchaResponse && hcaptchaResponse.value) {
                        // Add a direct field to the form if it doesn't exist
                        if (!form.querySelector('input[name="h-captcha-response"]')) {
                            var hiddenInput = document.createElement('input');
                            hiddenInput.type = 'hidden';
                            hiddenInput.name = 'h-captcha-response';
                            hiddenInput.value = hcaptchaResponse.value;
                            form.appendChild(hiddenInput);
                        }
                    }
                }

                // Check for token every 500ms
                setInterval(checkForToken, 500);

                // Add submit handler to ensure token is present
                if (!form.dataset.hcaptchaListenerAttached) {
                    form.dataset.hcaptchaListenerAttached = 'true';

                    form.addEventListener('submit', function(event) {
                        checkForToken(); // Check one last time before submission

                        var hcaptchaResponse = document.querySelector('textarea[name="h-captcha-response"]');
                        var hiddenInput = form.querySelector('input[name="h-captcha-response"]');

                        // Check for the token and prevent submission if missing
                        var hasToken = (hcaptchaResponse && hcaptchaResponse.value) ||
                                      (hiddenInput && hiddenInput.value);

                        if (!hasToken) {
                            event.preventDefault();
                            alert('Please complete the hCaptcha challenge');
                            return false;
                        }
                    });
                }
            });
        </script>

        {% do assets.addJs('https://js.hcaptcha.com/1/api.js', { 'loading': 'async', 'defer': 'defer' }) %}
    {% endif %}
{% endblock %}
```

## File: .repomixignore
```
assets/form.vendor.js
assets/form.min.js
assets/signature_pad.js
languages.yaml
CHANGELOG.md
README.md
```

## File: blueprints.yaml
```yaml
name: Form Captcha hCaptcha
slug: form-captcha-hcaptcha
type: plugin
version: 0.1.0
description: Provides hCaptcha support for Grav Form plugin
icon: plug
author:
  name: Trilby Media
  email: hello@trilby.media
homepage: https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha
demo: http://demo.yoursite.com
keywords: grav, plugin, etc
bugs: https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha/issues
docs: https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha/blob/develop/README.md
license: MIT

dependencies:
  - { name: grav, version: '>=1.6.0' }

form:
  validation: loose
  fields:
    enabled:
      type: toggle
      label: PLUGIN_ADMIN.PLUGIN_STATUS
      highlight: 1
      default: 0
      options:
        1: PLUGIN_ADMIN.ENABLED
        0: PLUGIN_ADMIN.DISABLED
      validate:
        type: bool

      form:
        validation: strict
        fields:
          enabled:
            type: toggle
            label: Plugin Status
            highlight: 1
            default: 0
            options:
              1: Enabled
              0: Disabled
            validate:
              type: bool

          hcaptcha:
            type: section
            title: hCaptcha Configuration
            underline: true
            fields:
              hcaptcha.site_key:
                type: text
                label: Site Key
                help: The site key provided by hCaptcha
                placeholder: Enter your hCaptcha site key

              hcaptcha.secret_key:
                type: text
                label: Secret Key
                help: The secret key provided by hCaptcha
                placeholder: Enter your hCaptcha secret key

              hcaptcha.theme:
                type: select
                label: Theme
                help: Select the theme for the hCaptcha widget
                default: light
                options:
                  light: Light
                  dark: Dark

              hcaptcha.size:
                type: select
                label: Size
                help: Select the size for the hCaptcha widget
                default: normal
                options:
                  normal: Normal
                  compact: Compact
                  invisible: Invisible
```

## File: composer.json
```json
{
  "name": "trilbymedia/form-captcha-hcaptcha",
  "type": "grav-plugin",
  "description": "Provides hCaptcha support for Grav Form plugin",
  "keywords": ["plugin"],
  "homepage": "https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha",
  "license": "MIT",
  "authors": [
    {
      "name": "Trilby Media",
      "email": "hello@trilby.media",
      "role": "Developer"
    }
  ],
  "require": {
    "php": ">=7.1.3"
  },
  "autoload": {
    "psr-4": {
      "Grav\\Plugin\\FormCaptchaHCaptcha\\": "classes/"
    },
    "classmap":  ["form-captcha-hcaptcha.php"]
  }
}
```

## File: form-captcha-hcaptcha.php
```php
<?php
namespace Grav\Plugin;

use Composer\Autoload\ClassLoader;
use Grav\Common\Plugin;
use Grav\Plugin\Form\Captcha\CaptchaFactory;
use Grav\Plugin\FormCaptchaHCaptcha\HCaptchaProvider;
use RocketTheme\Toolbox\Event\Event;

/**
 * Class FormCaptchaHCaptchaPlugin
 * @package Grav\Plugin
 */
class FormCaptchaHCaptchaPlugin extends Plugin
{
    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
            'onFormRegisterCaptchaProviders' => ['onFormRegisterCaptchaProviders', 0],
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onCaptchaErrorMessage' => ['onCaptchaErrorMessage', 0]
        ];
    }

    /**
     * Composer autoload
     *
     * @return ClassLoader
     */
    public function autoload(): ClassLoader
    {
        return require __DIR__ . '/vendor/autoload.php';
    }

    /**
     * Initialize the plugin
     */
    public function onPluginsInitialized(): void
    {
        // Check if Form plugin is enabled
        if (!$this->grav['config']->get('plugins.form.enabled')) {
            return;
        }

        // Don't proceed if we are in the admin plugin
        if ($this->isAdmin()) {
            return;
        }

        // Add assets
        $this->enable([
            'onAssetsInitialized' => ['onAssetsInitialized', 0]
        ]);
    }

    public function onTwigTemplatePaths(): void
    {
        $this->grav['twig']->twig_paths[] = __DIR__.'/templates';
    }

    /**
     * Register the hCaptcha provider
     */
    public function onFormRegisterCaptchaProviders(Event $event): void
    {
        // Register as both 'hcaptcha' (for modern approach) and 'hcaptcha' (for legacy field type approach)
        CaptchaFactory::registerProvider('hcaptcha', new HCaptchaProvider());
    }

    /**
     * Provide custom error messages for hCaptcha
     */
    public function onCaptchaErrorMessage(Event $event): void
    {
        $provider = $event['provider'] ?? '';

        // Only handle our provider
        if ($provider !== 'hcaptcha') {
            return;
        }

        $errorCode = $event['errorCode'] ?? '';

        // Set custom error messages for specific error codes
        if ($errorCode === 'missing-input-response') {
            $event['message'] = $this->grav['language']->translate('PLUGIN_FORM_CAPTCHA_HCAPTCHA.ERROR_CAPTCHA_NOT_COMPLETED');
        } else {
            $event['message'] = $this->grav['language']->translate('PLUGIN_FORM_CAPTCHA_HCAPTCHA.ERROR_VALIDATING');
        }
    }

    /**
     * Add assets
     */
    public function onAssetsInitialized(): void
    {
        // Register XHR handler
        $this->grav['assets']->addJs('plugin://form-captcha-hcaptcha/assets/js/hcaptcha-handler.js');
    }
}
```

## File: form-captcha-hcaptcha.yaml
```yaml
enabled: true
hcaptcha:
  theme: light            # options: [light | dark]
  site_key: ''            # Your hCaptcha site key
  secret_key: ''          # Your hCaptcha secret key
  size: normal            # options: [normal | compact | invisible]
```

## File: LICENSE
```
The MIT License (MIT)

Copyright (c) 2025 Trilby Media

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## File: repomix.config.json
```json
{
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```
