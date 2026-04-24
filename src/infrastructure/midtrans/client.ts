import midtransClient from 'midtrans-client';

/**
 * Midtrans Snap client for creating payment pages.
 * Uses Server Key from environment variables.
 */
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

/**
 * Midtrans Core API client for server-to-server calls.
 */
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});
