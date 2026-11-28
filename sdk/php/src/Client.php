<?php

declare(strict_types=1);

namespace FatturaFacile\Sdk;

use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use RuntimeException;

class Client
{
    private string $baseUrl;
    private ?string $accessToken;
    private ?string $apiKey;
    private ?string $tenantId;
    private ?ClientInterface $httpClient;
    private ?RequestFactoryInterface $requestFactory;
    private ?StreamFactoryInterface $streamFactory;

    public function __construct(
        string $baseUrl = 'https://api.fatturafacile.eu',
        ?string $accessToken = null,
        ?string $apiKey = null,
        ?string $tenantId = null,
        ?ClientInterface $httpClient = null,
        ?RequestFactoryInterface $requestFactory = null,
        ?StreamFactoryInterface $streamFactory = null
    ) {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->accessToken = $accessToken;
        $this->apiKey = $apiKey;
        $this->tenantId = $tenantId;
        $this->httpClient = $httpClient;
        $this->requestFactory = $requestFactory;
        $this->streamFactory = $streamFactory;
    }

    public function setTenantId(string $tenantId): self
    {
        $this->tenantId = $tenantId;
        return $this;
    }

    public function setAccessToken(string $token): self
    {
        $this->accessToken = $token;
        return $this;
    }

    public function request(string $method, string $path, array $data = []): array
    {
        if ($this->httpClient === null || $this->requestFactory === null) {
            // Fallback curl implementation when PSR-18 client is not injected
            return $this->curlRequest($method, $path, $data);
        }

        $url = $this->baseUrl . '/' . ltrim($path, '/');
        $request = $this->requestFactory->createRequest($method, $url)
            ->withHeader('Accept', 'application/json');

        if ($this->accessToken) {
            $request = $request->withHeader('Authorization', 'Bearer ' . $this->accessToken);
        } elseif ($this->apiKey) {
            $request = $request->withHeader('X-API-Key', $this->apiKey);
        }

        if ($this->tenantId) {
            $request = $request->withHeader('X-Tenant-ID', $this->tenantId);
        }

        if (!empty($data)) {
            $request = $request->withHeader('Content-Type', 'application/json');
            if ($this->streamFactory) {
                $body = $this->streamFactory->createStream(json_encode($data, JSON_THROW_ON_ERROR));
                $request = $request->withBody($body);
            }
        }

        $response = $this->httpClient->sendRequest($request);
        return $this->handleResponse($response);
    }

    private function curlRequest(string $method, string $path, array $data = []): array
    {
        $url = $this->baseUrl . '/' . ltrim($path, '/');
        $ch = curl_init($url);

        $headers = [
            'Accept: application/json',
        ];

        if ($this->accessToken) {
            $headers[] = 'Authorization: Bearer ' . $this->accessToken;
        } elseif ($this->apiKey) {
            $headers[] = 'X-API-Key: ' . $this->apiKey;
        }

        if ($this->tenantId) {
            $headers[] = 'X-Tenant-ID: ' . $this->tenantId;
        }

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if (!empty($data)) {
            $headers[] = 'Content-Type: application/json';
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($result === false || $httpCode >= 400) {
            throw new RuntimeException("API error with HTTP status {$httpCode}: {$result}");
        }

        return json_decode((string)$result, true) ?? [];
    }

    private function handleResponse(ResponseInterface $response): array
    {
        $statusCode = $response->getStatusCode();
        $body = (string) $response->getBody();

        if ($statusCode >= 400) {
            throw new RuntimeException("Fattura Facile API error [{$statusCode}]: {$body}");
        }

        if ($statusCode === 204 || empty($body)) {
            return [];
        }

        return json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    }
}
