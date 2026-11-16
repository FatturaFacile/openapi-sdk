package com.fatturafacile.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class FatturaFacileClient {
    private final String baseUrl;
    private final String accessToken;
    private final String apiKey;
    private final String tenantId;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public FatturaFacileClient(String baseUrl, String accessToken, String apiKey, String tenantId) {
        this.baseUrl = (baseUrl != null ? baseUrl : "https://api.fatturafacile.com").replaceAll("/$", "");
        this.accessToken = accessToken;
        this.apiKey = apiKey;
        this.tenantId = tenantId;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public <T> T send(String method, String path, Object body, Class<T> responseType) throws IOException, InterruptedException {
        String url = this.baseUrl + (path.startsWith("/") ? path : "/" + path);
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Accept", "application/json")
                .timeout(Duration.ofSeconds(30));

        if (this.accessToken != null) {
            builder.header("Authorization", "Bearer " + this.accessToken);
        } else if (this.apiKey != null) {
            builder.header("X-API-Key", this.apiKey);
        }

        if (this.tenantId != null) {
            builder.header("X-Tenant-ID", this.tenantId);
        }

        if (body != null) {
            builder.header("Content-Type", "application/json");
            builder.method(method, HttpRequest.BodyPublishers.ofString(this.objectMapper.writeValueAsString(body)));
        } else {
            builder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        HttpResponse<String> response = this.httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException("API error [" + response.statusCode() + "]: " + response.body());
        }

        if (response.statusCode() == 204 || responseType == Void.class) {
            return null;
        }

        return this.objectMapper.readValue(response.body(), responseType);
    }
}
