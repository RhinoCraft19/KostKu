import midtransClient from 'midtrans-client';

// Inisialisasi Snap client
export const snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true jika sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});
