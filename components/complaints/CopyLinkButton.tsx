"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Copy } from "lucide-react";

export function CopyLinkButton() {
  const { activePropertyId } = useAppStore();

  const handleCopyLink = () => {
    if (!activePropertyId) {
      toast.error("Pilih properti terlebih dahulu.");
      return;
    }

    // Gunakan dummy token yang berakhiran dengan propertyId
    const dummyToken = `dummy-token-${activePropertyId}`;
    const url = `${window.location.origin}/complaint/${dummyToken}`;
    
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link keluhan berhasil disalin!");
    }).catch(() => {
      toast.error("Gagal menyalin link.");
    });
  };

  return (
    <Button onClick={handleCopyLink} variant="outline" className="gap-2">
      <Copy className="h-4 w-4" />
      Salin Link Public
    </Button>
  );
}
