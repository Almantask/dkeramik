# Changelog

## 0.1.1 — 2026-08-23

Deploy and ops follow-up after the first public shop release.

### Changed

- GitHub Pages build reads `NEXT_PUBLIC_API_URL` from a repository secret (not a variable)
- Cloud Run deploy applies `ADMIN_PASSWORD` from a GitHub Actions secret on each API deploy

### Added

- Admin panel is linked from the private shop-management guide, not the public README.

## 0.1.0 — 2026-08-23

First public shop release. Live site: [https://almantask.github.io/dkeramik/](https://almantask.github.io/dkeramik/).

### Added

- Static Next.js shop on GitHub Pages (collection, cart, checkout, admin UI)
- Cloud Run API for stock, orders, invoices, and owner admin
- Lithuanian and English shop copy, plus owner guides
- SEPA bank-transfer checkout when Paysera secrets are not configured
- GitHub Actions: CI, Pages deploy, and Cloud Run deploy via Workload Identity Federation
