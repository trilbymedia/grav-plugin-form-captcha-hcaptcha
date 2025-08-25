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