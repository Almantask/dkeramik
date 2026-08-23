#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID="${GCP_PROJECT_ID:-dkeramik-fullstack}"
REGION="${GCP_REGION:-europe-central2}"
AR_REPO="${AR_REPO:-dkeramik}"
SERVICE="${SERVICE:-dkeramik-api}"
BUCKET="${GCS_BUCKET:-dkeramik-fullstack-invoices}"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com firestore.googleapis.com storage.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com

gcloud artifacts repositories create "$AR_REPO" --repository-format=docker --location="$REGION" || true
gcloud firestore databases create --location="$REGION" || true
gcloud storage buckets create "gs://$BUCKET" --location="$REGION" --uniform-bucket-level-access || true

gcloud secrets create ADMIN_PASSWORD --data-file=- <<<"${ADMIN_PASSWORD:-change-me}" || true
gcloud secrets create SESSION_SECRET --data-file=- <<<"${SESSION_SECRET:-change-me-session}" || true
gcloud secrets create WEBHOOK_SECRET --data-file=- <<<"${WEBHOOK_SECRET:-change-me-webhook}" || true
gcloud secrets create PAYSERA_PROJECT_ID --data-file=- <<<"${PAYSERA_PROJECT_ID:-}" || true
gcloud secrets create PAYSERA_PASSWORD --data-file=- <<<"${PAYSERA_PASSWORD:-}" || true
gcloud secrets create SMTP_HOST --data-file=- <<<"${SMTP_HOST:-}" || true
gcloud secrets create SMTP_USER --data-file=- <<<"${SMTP_USER:-}" || true
gcloud secrets create SMTP_PASS --data-file=- <<<"${SMTP_PASS:-}" || true
gcloud secrets create SMTP_FROM --data-file=- <<<"${SMTP_FROM:-DKeramik <info@dkeramik.lt>}" || true
gcloud secrets create SMTP_PORT --data-file=- <<<"${SMTP_PORT:-587}" || true

echo "Project $PROJECT_ID ready. Build and deploy with .github/workflows/deploy-api.yml"
