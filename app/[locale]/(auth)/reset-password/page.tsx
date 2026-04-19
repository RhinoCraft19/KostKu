import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutAuth } from "@/components/layouts";
import { Link } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  return (
    <LayoutAuth
      title="Reset Password"
      description="Masukkan password baru Anda"
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Kembali ke halaman login
        </Link>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">Password Baru</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <Button className="w-full" type="submit">
          Reset Password
        </Button>
      </form>
    </LayoutAuth>
  );
}