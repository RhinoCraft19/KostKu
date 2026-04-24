import prisma from '@/src/shared/db';
import { addDays } from 'date-fns';

export const BillingService = {
  /**
   * Generate invoices for all active tenants whose billingDay matches today.
   * Called from a daily cron job / Edge Function.
   */
  async generateDailyInvoices() {
    const today = new Date();
    const todayDay = today.getDate(); // day of month: 1–31

    // Calculate date range for this billing period
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Find all active tenants with billingDay == today
    const tenants = await prisma.tenant.findMany({
      where: {
        isActive: true,
        billingDay: todayDay,
      },
      include: {
        room: true,
      },
    });

    const results: { tenantId: string; invoiceId: string }[] = [];

    for (const tenant of tenants) {
      // Check if invoice already exists for this billing period
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          tenantId: tenant.id,
          dueDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      if (existingInvoice) {
        // Skip if invoice already generated for this period
        continue;
      }

      // Due date: 7 days from now (configurable)
      const dueDate = addDays(today, 7);

      const invoice = await prisma.invoice.create({
        data: {
          tenantId: tenant.id,
          amount: tenant.room.price,
          dueDate,
          status: 'UNPAID',
        },
      });

      results.push({ tenantId: tenant.id, invoiceId: invoice.id });
    }

    return results;
  },

  /** List all invoices for a specific tenant */
  async getInvoicesByTenant(tenantId: string) {
    return prisma.invoice.findMany({
      where: { tenantId },
      include: { paymentTransactions: true },
      orderBy: { dueDate: 'desc' },
    });
  },

  /** Get a single invoice by ID */
  async getInvoiceById(invoiceId: string) {
    return prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        tenant: { include: { room: { include: { property: true } } } },
        paymentTransactions: true,
      },
    });
  },
};
