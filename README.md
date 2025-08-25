# Form Captcha hCaptcha Plugin

The **Form Captcha hCaptcha** Plugin is an extension for [Grav CMS](https://github.com/getgrav/grav) that provides [hCaptcha](https://www.hcaptcha.com/) support for the Grav Form plugin v8.0.0+. hCaptcha is a privacy-focused CAPTCHA service that helps protect your forms from spam and abuse while respecting user privacy.

## Installation

Installing the Form Captcha hCaptcha plugin can be done in one of three ways: The GPM (Grav Package Manager) installation method lets you quickly install the plugin with a simple terminal command, the manual method lets you do so via a zip file, and the admin method lets you do so via the Admin Plugin.

### GPM Installation (Preferred)

To install the plugin via the [GPM](https://learn.getgrav.org/cli-console/grav-cli-gpm), through your system's terminal (also called the command line), navigate to the root of your Grav-installation, and enter:

    bin/gpm install form-captcha-hcaptcha

This will install the Form Captcha hCaptcha plugin into your `/user/plugins`-directory within Grav. Its files can be found under `/your/site/grav/user/plugins/form-captcha-hcaptcha`.

### Manual Installation

To install the plugin manually, download the zip-version of this repository and unzip it under `/your/site/grav/user/plugins`. Then rename the folder to `form-captcha-hcaptcha`. You can find these files on [GitHub](https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha) or via [GetGrav.org](https://getgrav.org/downloads/plugins).

You should now have all the plugin files under

    /your/site/grav/user/plugins/form-captcha-hcaptcha
	
> NOTE: This plugin is a modular component for Grav which may require other plugins to operate, please see its [blueprints.yaml-file on GitHub](https://github.com/trilbymedia/grav-plugin-form-captcha-hcaptcha/blob/main/blueprints.yaml).

### Admin Plugin

If you use the Admin Plugin, you can install the plugin directly by browsing the `Plugins`-menu and clicking on the `Add` button.

## Requirements

- Grav v1.7.0 or higher
- Form Plugin v8.0.0 or higher

## Configuration

Before configuring this plugin, you should copy the `user/plugins/form-captcha-hcaptcha/form-captcha-hcaptcha.yaml` to `user/config/plugins/form-captcha-hcaptcha.yaml` and only edit that copy.

### Getting hCaptcha Keys

1. Sign up for a free account at [hCaptcha.com](https://www.hcaptcha.com/)
2. Add your site to your hCaptcha dashboard
3. Copy your **Site Key** and **Secret Key**

### Plugin Configuration

Here is the default configuration and an explanation of available options:

```yaml
enabled: true
hcaptcha:
  site_key: ''      # Your hCaptcha site key (required)
  secret_key: ''    # Your hCaptcha secret key (required)
  theme: light      # Widget theme: light or dark
  size: normal      # Widget size: normal, compact, or invisible
```

#### Configuration Options

- **enabled**: Enable or disable the plugin
- **site_key**: Your hCaptcha site key obtained from the hCaptcha dashboard
- **secret_key**: Your hCaptcha secret key for server-side validation
- **theme**: Visual theme of the widget (`light` or `dark`)
- **size**: Size of the widget:
  - `normal`: Standard size widget
  - `compact`: Smaller widget for space-constrained layouts
  - `invisible`: Hidden widget that triggers on form submission

Note that if you use the Admin Plugin, a file with your configuration named form-captcha-hcaptcha.yaml will be saved in the `user/config/plugins/`-folder once the configuration is saved in the Admin.

## Usage

Once the plugin is installed and configured with your hCaptcha keys, you can add hCaptcha to any form by including a captcha field in your form definition.

### Basic Example

Add the following field to your form:

```yaml
fields:
    # ... other form fields ...
    
    hcaptcha:
        label: hCaptcha
        type: captcha
        provider: hcaptcha
        captcha_not_validated: 'Captcha not valid!'
```

And include `captcha: true` in your form's process section:

```yaml
process:
    captcha: true
    # ... other processes ...
```

### Complete Form Example

Here's a complete example of a contact form with hCaptcha:

```yaml
---
title: Contact Form
forms:
    contact:
        fields:
            name:
                label: Name
                type: text
                validate:
                    required: true
            
            email:
                label: Email
                type: email
                validate:
                    required: true
            
            message:
                label: Message
                type: textarea
                rows: 5
                validate:
                    required: true
            
            hcaptcha:
                label: Security Check
                type: captcha
                provider: hcaptcha
                captcha_not_validated: 'Please complete the captcha validation!'
        
        buttons:
            submit:
                type: submit
                value: Send Message
        
        process:
            captcha: true
            email:
                subject: '[Contact Form] {{ form.value.name|e }}'
                body: '{% include ''forms/data.html.twig'' %}'
            message: 'Thank you for your message!'
            reset: true
---
```

### AJAX Form Support

The plugin fully supports AJAX form submissions. Simply add `xhr_submit: true` to your form configuration:

```yaml
forms:
    myform:
        xhr_submit: true
        fields:
            # ... your fields ...
            hcaptcha:
                type: captcha
                provider: hcaptcha
        # ... rest of configuration ...
```

### Customization Options

You can override the global theme and size settings per form:

```yaml
hcaptcha:
    type: captcha
    provider: hcaptcha
    theme: dark        # Override global theme
    size: compact      # Override global size
```

## Troubleshooting

### Common Issues

1. **"Captcha not valid!" error**
   - Ensure your site key and secret key are correctly configured
   - Verify your domain is added to your hCaptcha account
   - Check that JavaScript is enabled in the browser

2. **Widget not appearing**
   - Confirm the plugin is enabled
   - Check browser console for JavaScript errors
   - Ensure the hCaptcha script is not blocked by ad blockers

3. **AJAX forms not working**
   - Make sure `xhr_submit: true` is set in your form configuration
   - Verify that the Form plugin is v8.0.0 or higher

## Credits

- [hCaptcha](https://www.hcaptcha.com/) for providing the privacy-focused CAPTCHA service
- [Grav CMS](https://getgrav.org/) team for the extensible plugin architecture

## License

MIT License - See [LICENSE](LICENSE) file for details

