"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BedDouble, label: "Kamar", href: "/rooms" },
  { icon: Users, label: "Tenant", href: "/tenants" },
  { icon: CreditCard, label: "Pembayaran", href: "/payments" },
  { icon: MessageSquare, label: "Keluhan", href: "/complaints", badge: true },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openComplaintsCount } = useAppStore();

  return (
    <div className="flex flex-col h-full w-64 border-r bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            K
          </div>
          KostOS
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
            {item.badge && openComplaintsCount > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-5 min-w-5 justify-center">
                {openComplaintsCount}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-danger hover:bg-danger/10">
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
