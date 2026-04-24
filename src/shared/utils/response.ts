/**
 * Unified API response helpers.
 * The captureError function sends 500-class errors to Sentry
 * (only when @sentry/nextjs is installed and SENTRY_DSN is set).
 */

export const successResponse = (data: any, meta?: any) => ({
  success: true,
  data,
  error: null,
  meta: meta ?? null,
});

export const errorResponse = (error: string, meta?: any) => ({
  success: false,
  data: null,
  error,
  meta: meta ?? null,
});

/**
 * Capture an error to Sentry (if available) and return a formatted 500 body.
 * Use this in catch blocks instead of bare errorResponse() for server errors.
 * Sentry is optional — if not installed, errors are silently swallowed.
 */
export async function captureError(error: unknown): Promise<{ success: false; data: null; error: string; meta: null }> {
  const message = error instanceof Error ? error.message : String(error);

  // Optionally send to Sentry without hard dependency
  try {
    // Use a dynamic string to prevent TypeScript from resolving the module at compile time
    const sentryModule = '@sentry/nextjs';
    const Sentry = await import(/* webpackIgnore: true */ sentryModule).catch(() => null);
    if (Sentry && typeof Sentry.captureException === 'function') {
      Sentry.captureException(error);
    }
  } catch {
    // Sentry not available — fail silently
  }

  return { success: false as const, data: null, error: message, meta: null };
}
