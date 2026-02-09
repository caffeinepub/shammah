# Specification

## Summary
**Goal:** Restore the Landing page header branding to the previous SHAMMAH text-based version by removing the broken Butterfly Wellness wordmark image.

**Planned changes:**
- Update `frontend/src/pages/LandingPage.tsx` to remove the header `<img>` that references `/assets/branding/butterfly-wellness-wordmark.png`.
- Restore the previous SHAMMAH header branding as text-based content while preserving the existing header layout (left branding, right Sign In button).

**User-visible outcome:** The Landing page header no longer shows a broken image; SHAMMAH branding displays reliably as text, and the Sign In button remains visible and works as before.
