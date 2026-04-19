import { LayoutDashboard, type NavItem } from "./layout-dashboard";
import {
  Home,
  CreditCard,
  History,
  Wrench,
} from "lucide-react";

const tenantNavItems: NavItem[] = [
  { icon: Home, label: "navigation.dashboard", href: "/tenant/dashboard" },
  { icon: CreditCard, label: "navigation.payments", href: "/tenant/payments" },
  { icon: History, label: "navigation.history", href: "/tenant/history" },
  { icon: Wrench, label: "navigation.maintenance", href: "/tenant/maintenance" },
];

interface LayoutTenantProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function LayoutTenant({ children, userName, userEmail }: LayoutTenantProps) {
  return (
    <LayoutDashboard
      navItems={tenantNavItems}
      userRole="tenant"
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </LayoutDashboard>
  );
}