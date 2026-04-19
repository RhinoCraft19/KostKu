import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LayoutAuth } from "@/components/layouts";

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <LayoutAuth
      title={t("auth.register")}
      description="KostKu"
      footer={
        <>
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup defaultValue="owner" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="owner" id="owner" />
              <Label htmlFor="owner">Owner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tenant" id="tenant" />
              <Label htmlFor="tenant">Tenant</Label>
            </div>
          </RadioGroup>
        </div>
        <Button className="w-full" type="submit">
          {t("auth.register")}
        </Button>
      </form>
    </LayoutAuth>
  );
}