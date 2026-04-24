interface ReminderData {
  tenantName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  propertyName: string;
  paymentLink?: string | null;
}

export const generateWAReminder = (data: ReminderData): string => {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(data.amount);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(data.dueDate));

  let message = `Halo ${data.tenantName} 👋

Kami ingin mengingatkan bahwa tagihan sewa kamar *No. ${data.roomNumber}* di *${data.propertyName}* untuk bulan ini sebesar *${formattedAmount}* jatuh tempo pada *${formattedDate}*.`;

  if (data.paymentLink) {
    message += `\n\nAnda dapat melakukan pembayaran praktis melalui link berikut:\n${data.paymentLink}`;
  }

  message += `\n\nMohon segera lakukan pembayaran agar tidak terlambat. Terima kasih 🙏`;

  return message;
};
