"use client";

import { Room } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  BedDouble, 
  Banknote 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted relative">
        {room.photoUrl ? (
          <img 
            src={room.photoUrl} 
            alt={`Kamar ${room.roomNumber}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <BedDouble className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={room.status} />
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div>
          <h3 className="font-bold text-lg">Kamar {room.roomNumber}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
            {room.type}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " h-8 w-8"}>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(room)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-danger focus:text-danger" 
              onClick={() => onDelete(room.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex items-center text-primary font-bold">
          <Banknote className="w-4 h-4 mr-2" />
          <span>{formatCurrency(room.price)}</span>
          <span className="text-xs font-normal text-muted-foreground ml-1">/bulan</span>
        </div>
        
        {room.facilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {room.facilities.slice(0, 3).map((f, i) => (
              <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {f}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{room.facilities.length - 3} lagi
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
