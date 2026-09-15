# v1.0.4
## 09/15/2026

1. [](#bugfix)
    * The hCaptcha box now appears on themes that write their scripts into the page head. The field registered its two scripts outside the form's script group, so on those themes they were never written to the page and the box stayed blank [grav-plugin-form#653](https://github.com/getgrav/grav-plugin-form/issues/653)
    * Stopped the hCaptcha box being set up more than once, which logged "Only one captcha is permitted per parent container" in the browser console on every page with a form

# v1.0.3
## 09/09/2026

1. [](#bugfix)
    * Removed the placeholder `demo` URL from the plugin manifest, so the download page no longer shows a Demo button pointing at a parked domain

# v1.0.2
## 05/01/2026

1. [](#improved)
    * Added 1.7|2.0 compatibility flags

# v1.0.1
## 08/25/2025

1. [](#bugfix)
    * Fix indent issue in hcaptcha blueprint

# v1.0.0
## 08/25/2025

1. [](#new)
    * ChangeLog started...
