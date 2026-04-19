import { routing } from "@/i18n/routing";

export default function NotFoundPage() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Page not found
          </p>
          <a
            href={`/${routing.defaultLocale}`}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}