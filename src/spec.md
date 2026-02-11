# Specification

## Summary
**Goal:** Make it obvious when the latest frontend Landing page changes are deployed by ensuring the correct SHAMMAH text header branding is live, adding a build marker, and preventing stale cached assets.

**Planned changes:**
- Ensure the Landing page header uses SHAMMAH text-based branding (no Butterfly Wellness wordmark `<img>`) and remove any remaining header-branding references to `/assets/branding/butterfly-wellness-wordmark.png`.
- Add a user-visible build marker to an always-visible Landing page area (e.g., footer) that is derived from the build so it changes each deployment.
- Implement cache-busting for critical Landing page static assets (e.g., append the build marker as a query parameter to the hero image URL) so updated UI appears without requiring hard refreshes.

**User-visible outcome:** In production, the Landing page shows SHAMMAH text branding in the header, displays a visible “Build: …” marker that changes on each deployment, and refreshes key assets (like the hero image) automatically after redeploys to avoid stale cached content.
