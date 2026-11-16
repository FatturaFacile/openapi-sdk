# Pagination, Filtering, Sorting, and Search Guide

Fattura Facile APIs provide uniform query controls across all collection endpoints.

---

## 1. Pagination

We support both offset-based and cursor-based pagination.

### Offset-Based

```http
GET /v1/invoices?page=2&limit=25
```

- `page`: 1-indexed page number (default: `1`).
- `limit`: Number of records per page (minimum: `1`, maximum: `100`, default: `25`).

### Cursor-Based (High Throughput & Stream Navigation)

```http
GET /v1/invoices?cursor=eyJpZCI6MTI1fQ==&limit=50
```

- `cursor`: Opaque base64 string provided in previous response's `meta.nextCursor`.

---

## 2. Sorting

Sort by single or multiple fields using comma separation. Prefix with `-` for descending order:

```http
GET /v1/invoices?sort=-date,number
```

---

## 3. Full-Text Search

Use the `q` parameter to execute fast full-text searches across searchable fields (e.g. invoice numbers, customer names, SKUs):

```http
GET /v1/customers?q=Acme
```
