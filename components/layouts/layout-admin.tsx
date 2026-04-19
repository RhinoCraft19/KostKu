import { LayoutDashboard, type NavItem } from "./layout-dashboard";
import {
  Home,
  Users,
  CreditCard,
  Wrench,
  Megaphone,
} from "lucide-react";

const adminNavItems: NavItem[] = [
  { icon: Home, label: "navigation.dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "navigation.tenants", href: "/admin/tenants" },
  { icon: CreditCard, label: "navigation.payments", href: "/admin/payments" },
  { icon: Wrench, label: "navigation.maintenance", href: "/admin/maintenance" },
  { icon: Megaphone, label: "navigation.announcements", href: "/admin/announcements" },
];

interface LayoutAdminProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function LayoutAdmin({ children, userName, userEmail }: LayoutAdminProps) {
  return (
    <LayoutDashboard
      navItems={adminNavItems}
      userRole="admin"
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </LayoutDashboard>
  );
}