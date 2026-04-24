import { create } from "zustand";

interface AppStore {
  activePropertyId: string | null;
  setActivePropertyId: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openComplaintsCount: number;
  setOpenComplaintsCount: (count: number) => void;
  paymentFilter: { month: number; year: number; status: "ALL" | "UNPAID" | "PARTIAL" | "PAID" };
  setPaymentFilter: (filter: Partial<{ month: number; year: number; status: "ALL" | "UNPAID" | "PARTIAL" | "PAID" }>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activePropertyId: null,
  setActivePropertyId: (id) => set({ activePropertyId: id }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openComplaintsCount: 0,
  setOpenComplaintsCount: (count) => set({ openComplaintsCount: count }),
  paymentFilter: { month: new Date().getMonth() + 1, year: new Date().getFullYear(), status: "ALL" },
  setPaymentFilter: (filter) => set((state) => ({ paymentFilter: { ...state.paymentFilter, ...filter } })),
}));
