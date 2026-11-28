# Versioning & Backward Compatibility Policy

Fattura Facile ERP contracts and multi-language SDKs strictly adhere to **Semantic Versioning (SemVer 2.0.0)**.

---

## 1. URI Versioning Strategy

All public API endpoints are prefixed with the major contract version:

```
https://api.fatturafacile.eu/v1/...
```

A major version bump (`/v2/`) is only introduced when backward-incompatible modifications cannot be avoided.

---

## 2. Change Classification

### Patch Releases (`1.0.X`)

- Bug fixes in generator tooling.
- Typo corrections in descriptions or parameter documentation.
- Non-functional changes to internal validation routines.

### Minor Releases (`1.X.0`) - Backward Compatible

- Adding new endpoints (e.g. `/v1/delivery-notes`).
- Adding optional query parameters.
- Adding optional request body properties.
- Adding new properties to response payloads.

### Major Releases (`X.0.0`) - Breaking Changes

- Removing or renaming endpoints.
- Renaming fields in request or response schemas.
- Adding new mandatory request parameters or body fields.
- Changing data types or tightening enum restrictions.
- Modifying security scheme requirements.

---

## 3. Automated OASDiff CI Gate

Every pull request modifying `openapi/` triggers an automated `oasdiff` execution comparing the working branch against the base branch. If any unflagged breaking change is detected, the pull request check fails immediately.
