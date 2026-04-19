import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutAuth } from "@/components/layouts";

export default function ForgotPasswordPage() {
  return (
    <LayoutAuth
      title="Lupa Password"
      description="Masukkan email untuk reset password"
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Kembali ke halaman login
        </Link>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
          />
        </div>
        <Button className="w-full" type="submit">
          Kirim Link Reset
        </Button>
      </form>
    </LayoutAuth>
  );
}