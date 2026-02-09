# Specification

## Summary
**Goal:** Replace the landing page header branding so it shows only the Butterfly Wellness wordmark (no SHAMMAH text).

**Planned changes:**
- In `frontend/src/pages/LandingPage.tsx`, update the header logo `<img>` to use the uploaded Butterfly Wellness wordmark image as its `src`.
- Remove the SHAMMAH header `<h1>` element so no "SHAMMAH" text renders in the landing page header.
- Add the uploaded wordmark image to `frontend/public` (e.g., under `frontend/public/assets/`) using a filename without spaces/special characters, and set appropriate `alt` text and sizing to avoid overflow/distortion.

**User-visible outcome:** The landing page header displays only the Butterfly Wellness wordmark logo with clean sizing and no SHAMMAH text.
