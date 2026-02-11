/**
 * Build marker utility that provides a version identifier for the current deployment.
 * Uses build-time environment variables when available, with fallback for local development.
 */

// Try to get build marker from environment variables injected at build time
const getBuildMarker = (): string => {
  // Check for common build-time environment variables
  const gitSha = import.meta.env.VITE_GIT_SHA;
  const buildId = import.meta.env.VITE_BUILD_ID;
  const buildMarker = import.meta.env.VITE_BUILD_MARKER;
  const buildTime = import.meta.env.VITE_BUILD_TIME;
  
  // Return the first available marker
  if (gitSha) return gitSha.substring(0, 8); // Short SHA
  if (buildId) return buildId;
  if (buildMarker) return buildMarker;
  if (buildTime) return buildTime;
  
  // Fallback: use a timestamp-based marker for local development
  // This ensures the marker changes between builds even in dev
  return `dev-${Date.now()}`;
};

export const buildMarker = getBuildMarker();
