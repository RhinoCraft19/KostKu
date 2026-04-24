"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { RoomStatusFilter } from "@/components/rooms/RoomStatusFilter";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomForm } from "@/components/rooms/RoomForm";
import { useRooms, useDeleteRoom } from "@/hooks/useRooms";
import { useAppStore } from "@/store/useAppStore";
import { Room, RoomStatus } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function RoomsPage() {
  const activePropertyId = useAppStore((state) => state.activePropertyId);
  const { data: rooms, isLoading } = useRooms(activePropertyId);
  const deleteRoom = useDeleteRoom();
  
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const filteredRooms = rooms?.filter((r) => 
    statusFilter === "ALL" ? true : r.status === statusFilter
  ) || [];

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoomToDelete(id);
  };

  const confirmDelete = async () => {
    if (roomToDelete) {
      await deleteRoom.mutateAsync(roomToDelete);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Kamar" 
        description="Kelola unit kamar, tipe, dan status ketersediaan properti Anda."
        action={
          <Button onClick={() => { setSelectedRoom(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kamar
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <RoomStatusFilter 
          activeStatus={statusFilter} 
          onStatusChange={setStatusFilter} 
        />
        
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg self-start">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background shadow-sm">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="Kamar tidak ditemukan"
          description={
            statusFilter === "ALL" 
              ? "Anda belum memiliki data kamar. Klik tombol di bawah untuk menambahkan." 
              : `Tidak ada kamar dengan status ${statusFilter.toLowerCase()}.`
          }
          action={statusFilter === "ALL" ? {
            label: "Tambah Kamar",
            onClick: () => { setSelectedRoom(null); setIsFormOpen(true); }
          } : undefined}
        />
      )}

      <RoomForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        room={selectedRoom}
      />

      <ConfirmDialog
        open={!!roomToDelete}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
        onConfirm={confirmDelete}
        title="Hapus Kamar?"
        description="Tindakan ini tidak dapat dibatalkan. Data kamar akan dihapus secara permanen."
      />
    </div>
  );
}
