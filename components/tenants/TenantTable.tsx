"use client";

import { Tenant } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TenantTableProps {
  tenants: Tenant[];
  onViewDetails: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, onViewDetails }: TenantTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Nama Tenant</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>No. HP</TableHead>
            <TableHead>Masa Sewa</TableHead>
            <TableHead>Status Kontrak</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const isActive = new Date(tenant.endDate) > new Date();
            
            return (
              <TableRow key={tenant.id} className="cursor-pointer group" onClick={() => onViewDetails(tenant)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(tenant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{tenant.name}</span>
                      <span className="text-xs text-muted-foreground">{tenant.idNumber}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-primary">
                    {tenant.room?.roomNumber || "-"}
                  </span>
                </TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span>{format(new Date(tenant.startDate), "dd MMM yyyy", { locale: id })}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{format(new Date(tenant.endDate), "dd MMM yyyy", { locale: id })}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={isActive ? "PAID" : "UNPAID"} /> 
                  {/* Note: In actual usage, we might have a specific CONTRACT_STATUS */}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " h-8 w-8"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(tenant)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
