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
            $event['message'] = $this->grav['language']->translate('PLUGIN_FORM.ERROR_CAPTCHA_NOT_COMPLETED');
        } else {
            $event['message'] = $this->grav['language']->translate('PLUGIN_FORM.ERROR_VALIDATING_CAPTCHA');
        }
    }
}