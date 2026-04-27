# Passive Analytics for Binff

This repo now includes a passive analytics pipeline for public pages.

## What is tracked

- Page path and canonical path
- Page title and page type
- Locale
- Session and visitor IDs
- Time on page
- Scroll depth
- Referrer URL and category
- Device category
- UTM parameters

## Endpoints

- `POST /api/analytics/track`
- `GET /api/analytics/report?month=YYYY-MM&format=json|html`
- `GET /api/cron/monthly-analytics`

## Monthly email flow

1. The tracker sends anonymous page data on `pagehide` and `visibilitychange`.
2. The track endpoint stores each event.
3. The report endpoint aggregates the month into tables and SVG charts.
4. The cron endpoint prepares the email payload and sends it through the webhook you configure later.

## Environment variables

- `CRON_SECRET`
- `ANALYTICS_STORAGE_PATH`
- `ANALYTICS_EMAIL_TO`
- `ANALYTICS_EMAIL_WEBHOOK_URL`
- `ANALYTICS_EMAIL_WEBHOOK_SECRET`

## Notes

- The storage layer is file-backed by default.
- For production durability, replace the storage adapter with your preferred backend when you connect the email provider.

