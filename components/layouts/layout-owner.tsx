import { LayoutDashboard, type NavItem } from "./layout-dashboard";
import {
  Home,
  Building,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const ownerNavItems: NavItem[] = [
  { icon: Home, label: "navigation.dashboard", href: "/owner/dashboard" },
  { icon: Building, label: "navigation.kosts", href: "/owner/kosts" },
  { icon: Users, label: "navigation.tenants", href: "/owner/tenants" },
  { icon: CreditCard, label: "navigation.payments", href: "/owner/payments" },
  { icon: BarChart3, label: "navigation.reports", href: "/owner/reports" },
  { icon: Settings, label: "navigation.settings", href: "/owner/settings" },
];

interface LayoutOwnerProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function LayoutOwner({ children, userName, userEmail }: LayoutOwnerProps) {
  return (
    <LayoutDashboard
      navItems={ownerNavItems}
      userRole="owner"
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </LayoutDashboard>
  );
}