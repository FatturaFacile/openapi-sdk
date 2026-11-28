<?php
/**
 * Plugin Name: WooCommerce to Fattura Facile Sync
 * Description: Automatically generates electronic invoices upon WooCommerce order completion.
 * Version: 1.0.0
 * Author: Fattura Facile Platform Team
 */

if (!defined('ABSPATH')) exit;

add_action('woocommerce_order_status_completed', 'fatturafacile_sync_completed_order');

function fatturafacile_sync_completed_order($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $api_key = get_option('fatturafacile_api_key');
    $tenant_id = get_option('fatturafacile_tenant_id');
    if (!$api_key || !$tenant_id) return;

    $payload = [
        'customerId' => $order->get_meta('_fatturafacile_customer_id') ?: 'c1000000-0000-0000-0000-000000000001',
        'documentType' => 'TD01',
        'date' => date('Y-m-d'),
        'dueDate' => date('Y-m-d'),
        'autoTransmitSdi' => true,
        'lines' => []
    ];

    foreach ($order->get_items() as $item) {
        $payload['lines'][] = [
            'description' => $item->get_name(),
            'quantity' => (float) $item->get_quantity(),
            'unitPrice' => [
                'amount' => (float) $order->get_item_subtotal($item, false),
                'currency' => $order->get_currency()
            ],
            'vatRate' => 22.0,
            'totalNet' => [
                'amount' => (float) $item->get_total(),
                'currency' => $order->get_currency()
            ]
        ];
    }

    $response = wp_remote_post('https://api.fatturafacile.eu/v1/invoices', [
        'headers' => [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'X-API-Key' => $api_key,
            'X-Tenant-ID' => $tenant_id
        ],
        'body' => json_encode($payload),
        'timeout' => 30
    ]);

    if (is_wp_error($response)) {
        error_log('Fattura Facile Sync Error: ' . $response->get_error_message());
        return;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (!empty($body['id'])) {
        $order->update_meta_data('_fatturafacile_invoice_id', $body['id']);
        $order->add_order_note('Fattura Facile Invoice Created: ' . $body['number']);
        $order->save();
    }
}
