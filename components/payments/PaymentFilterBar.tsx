"use client";

import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PaymentFilterBar() {
  const { paymentFilter, setPaymentFilter } = useAppStore();
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center p-4 bg-card border rounded-lg">
      <div className="flex-1 flex gap-2">
        <Select
          value={paymentFilter.month.toString()}
          onValueChange={(val) => val && setPaymentFilter({ month: parseInt(val) })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bulan" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {format(new Date(2020, m - 1, 1), "MMMM", { locale: id })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter.year.toString()}
          onValueChange={(val) => val && setPaymentFilter({ year: parseInt(val) })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter.status ?? "ALL"}
          onValueChange={(val: string) => setPaymentFilter({ status: val })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="UNPAID">Belum Bayar</SelectItem>
            <SelectItem value="PARTIAL">Sebagian</SelectItem>
            <SelectItem value="PAID">Lunas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          const now = new Date();
          setPaymentFilter({
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            status: "ALL",
          });
        }}
      >
        Reset Filter
      </Button>
    </div>
  );
}
