This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where content has been compressed (code blocks are separated by ⋮---- delimiter).

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
- Content has been compressed - code blocks are separated by ⋮---- delimiter
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
// Function to initialize hCaptcha without XHR
⋮----
console.log('Initializing standard hCaptcha (non-XHR mode)');
⋮----
// Find all hCaptcha containers
const containers = document.querySelectorAll('[data-captcha-provider="hcaptcha"]');
⋮----
containers.forEach(function(container) {
⋮----
const widgetContainer = document.getElementById(containerId);
⋮----
console.warn('Cannot initialize hCaptcha - missing sitekey attribute');
⋮----
// Get the form element
const form = document.getElementById(formId);
⋮----
console.warn(`Form #${formId} not found for hCaptcha widget`);
⋮----
// Check if we have a render function from the template
const funcName = `renderHCaptcha_${formId.replace(/-/g, '_')}`;
⋮----
console.log(`Using template-provided render function: ${funcName}`);
⋮----
// Define the callback function name, replacing hyphens with underscores
const callbackName = `hCaptchaCallback_${formId.replace(/-/g, '_')}`;
const expiredCallbackName = `hCaptchaExpiredCallback_${formId.replace(/-/g, '_')}`;
⋮----
// Define the callback functions if they don't exist
⋮----
console.log(`hCaptcha token received for form: ${formId}`);
⋮----
// Set the token in the hidden field
let hiddenInput = form.querySelector('input[name="h-captcha-response"]');
⋮----
hiddenInput = document.createElement('input');
⋮----
form.appendChild(hiddenInput);
⋮----
console.log(`hCaptcha token expired for form: ${formId}`);
⋮----
// Clear the token
const hiddenInput = form.querySelector('input[name="h-captcha-response"]');
⋮----
hcaptcha.render(containerId, {
⋮----
console.log(`hCaptcha rendered for form: ${formId}`);
⋮----
console.error('Error rendering hCaptcha widget:', e.message);
⋮----
console.warn('hCaptcha API not available, will try again when API loads');
⋮----
// Function to register with XHR system when available
⋮----
// First check if XHR system is available
⋮----
// No XHR system, just initialize standard captcha
console.log('GravFormXHR not available, using standard hCaptcha initialization');
initializeStandardHCaptcha();
⋮----
console.log('Registering hCaptcha with GravFormXHR');
⋮----
// XHR system is available, register handler
window.GravFormXHR.captcha.register('hcaptcha', {
⋮----
console.warn('Cannot reset hCaptcha: invalid form');
⋮----
console.log(`XHR reset requested for hCaptcha in form: ${formId}`);
⋮----
// Check if we have a custom reset function from the template
const resetFuncName = `resetHCaptcha_${formId.replace(/-/g, '_')}`;
⋮----
console.log(`Using template-provided reset function: ${resetFuncName}`);
⋮----
const renderFuncName = `renderHCaptcha_${formId.replace(/-/g, '_')}`;
⋮----
console.log(`Using template-provided render function: ${renderFuncName}`);
⋮----
const widgetContainer = document.getElementById(hcaptchaId);
⋮----
console.warn(`hCaptcha container #${hcaptchaId} not found.`);
⋮----
// Get configuration from data attributes
const parentContainer = container.closest('[data-captcha-provider="hcaptcha"]');
⋮----
console.warn('Cannot reinitialize hCaptcha - missing sitekey attribute');
⋮----
// Store widget instance to allow resets
⋮----
// Clear the container to ensure fresh rendering
⋮----
// Clear any existing token
⋮----
console.log(`Re-rendering hCaptcha widget for form: ${formId}`);
⋮----
// Check if hCaptcha API is available
⋮----
// If we have an existing widget ID, reset it
⋮----
console.log('Resetting existing hCaptcha widget');
⋮----
hcaptcha.reset(window[instanceKey].widgetId);
⋮----
console.warn('Error resetting hCaptcha, will re-render', e);
⋮----
// Render with a slight delay to ensure DOM is settled
setTimeout(() => {
⋮----
window[instanceKey].widgetId = hcaptcha.render(hcaptchaId, {
⋮----
console.error(`hCaptcha error for form ${formId}: ${error}`);
⋮----
console.log(`hCaptcha widget rendered for form: ${formId} with ID:`, window[instanceKey].widgetId);
⋮----
console.error(`Error rendering hCaptcha widget: ${e.message}`);
⋮----
console.error(`Error with hCaptcha widget: ${e.message}`);
⋮----
console.warn('hCaptcha API not available. Attempting to reload...');
⋮----
// Remove existing script if any
const existingScript = document.querySelector('script[src*="js.hcaptcha.com/1/api.js"]');
⋮----
existingScript.parentNode.removeChild(existingScript);
⋮----
// Create new script element
const script = document.createElement('script');
⋮----
console.log('hCaptcha API loaded, retrying widget render...');
⋮----
const retryContainer = document.querySelector(`[data-captcha-provider="hcaptcha"]`);
⋮----
window.GravFormXHR.captcha.getProvider('hcaptcha').reset(retryContainer, form);
⋮----
// Fallback for non-XHR mode
⋮----
document.head.appendChild(script);
⋮----
console.log('hCaptcha XHR handler registered successfully');
⋮----
// Check if hCaptcha API is already loaded
⋮----
console.log('hCaptcha API already available, initializing now');
⋮----
} else if (document.querySelector('script[src*="js.hcaptcha.com/1/api.js"]')) {
console.log('hCaptcha API script found but not loaded yet, waiting...');
// API script is there but not loaded yet, we'll let the onload handle it
⋮----
console.log('No hCaptcha API script found, will register handlers for later initialization');
⋮----
// Wait for DOM to be fully loaded
⋮----
document.addEventListener('DOMContentLoaded', function() {
// Small delay to allow potential XHR system to initialize
setTimeout(registerHCaptchaHandler, 100);
setTimeout(checkAndInitialize, 200);
⋮----
// DOM already loaded
```

## File: classes/HCaptchaProvider.php
```php
namespace Grav\Plugin\FormCaptchaHCaptcha;
⋮----
use Grav\Common\Grav;
use Grav\Common\Uri;
use Grav\Common\HTTP\Client;
use Grav\Plugin\Form\Captcha\CaptchaProviderInterface;
⋮----
/**
 * hCaptcha provider implementation
 */
class HCaptchaProvider implements CaptchaProviderInterface
⋮----
/** @var array */
protected $config;
⋮----
public function __construct()
⋮----
$this->config = Grav::instance()['config']->get('plugins.form-captcha-hcaptcha.hcaptcha', []);
⋮----
/**
     * {@inheritdoc}
     */
public function validate(array $form, array $params = []): array
⋮----
$grav = Grav::instance();
⋮----
$hostname = $uri->host();
⋮----
throw new \RuntimeException("hCaptcha secret key not configured.");
⋮----
// Try to find the token in multiple possible locations
⋮----
// Check standard field
⋮----
// Check in data array
⋮----
// Check with hyphen replacement (some systems convert hyphens to underscores)
⋮----
// Check in data array with hyphen replacement
⋮----
// Check in nested data structure
⋮----
// Check in direct POST data
⋮----
// Check in nested POST data
⋮----
$httpClient = Client::getClient();
⋮----
$response = $httpClient->request('POST', $validationUrl, [
⋮----
$statusCode = $response->getStatusCode();
⋮----
throw new \RuntimeException("hCaptcha verification request failed with status code: ".$statusCode);
⋮----
$responseBody = $response->getContent();
⋮----
throw new \RuntimeException("Invalid JSON received from hCaptcha: ".json_last_error_msg());
⋮----
throw new \RuntimeException("Invalid response format from hCaptcha verification (missing 'success' key).");
⋮----
$grav['log']->error('hCaptcha validation error: ' . $e->getMessage());
⋮----
'error' => $e->getMessage(),
⋮----
public function getClientProperties(string $formId, array $field): array
⋮----
public function getTemplateName(): string
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
namespace Grav\Plugin;
⋮----
use Composer\Autoload\ClassLoader;
use Grav\Common\Plugin;
use Grav\Plugin\Form\Captcha\CaptchaFactory;
use Grav\Plugin\FormCaptchaHCaptcha\HCaptchaProvider;
use RocketTheme\Toolbox\Event\Event;
⋮----
/**
 * Class FormCaptchaHCaptchaPlugin
 * @package Grav\Plugin
 */
class FormCaptchaHCaptchaPlugin extends Plugin
⋮----
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
⋮----
/**
     * Composer autoload
     *
     * @return ClassLoader
     */
public function autoload(): ClassLoader
⋮----
/**
     * Initialize the plugin
     */
public function onPluginsInitialized(): void
⋮----
// Check if Form plugin is enabled
if (!$this->grav['config']->get('plugins.form.enabled')) {
⋮----
// Don't proceed if we are in the admin plugin
if ($this->isAdmin()) {
⋮----
// Add assets
$this->enable([
⋮----
public function onTwigTemplatePaths(): void
⋮----
/**
     * Register the hCaptcha provider
     */
public function onFormRegisterCaptchaProviders(Event $event): void
⋮----
// Register as both 'hcaptcha' (for modern approach) and 'hcaptcha' (for legacy field type approach)
CaptchaFactory::registerProvider('hcaptcha', new HCaptchaProvider());
⋮----
/**
     * Provide custom error messages for hCaptcha
     */
public function onCaptchaErrorMessage(Event $event): void
⋮----
// Only handle our provider
⋮----
// Set custom error messages for specific error codes
⋮----
$event['message'] = $this->grav['language']->translate('PLUGIN_FORM.ERROR_CAPTCHA_NOT_COMPLETED');
⋮----
$event['message'] = $this->grav['language']->translate('PLUGIN_FORM.ERROR_VALIDATING_CAPTCHA');
⋮----
/**
     * Add assets
     */
public function onAssetsInitialized(): void
⋮----
// Register XHR handler
$this->grav['assets']->addJs('plugin://form-captcha-hcaptcha/assets/js/hcaptcha-handler.js');
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
    "filePath": "grav-form-captcha-hcaptcha-plugin.md",
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
