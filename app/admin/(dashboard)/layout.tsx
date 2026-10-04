import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs tracking-widest2 text-stone-light">Admin dashboard</p>
            <p className="font-display text-lg text-ivory">Sactoria Fashion Institute</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="focus-ring rounded-sm px-3 py-2 text-sm text-ivory hover:text-wine"
            >
              Catalogue
            </Link>
            <Link
              href="/admin/items/new"
              className="focus-ring rounded-sm px-3 py-2 text-sm text-ivory hover:text-wine"
            >
              Add item
            </Link>
            <Link
              href="/admin/settings"
              className="focus-ring rounded-sm px-3 py-2 text-sm text-ivory hover:text-wine"
            >
              Settings
            </Link>
            <Link
              href="/"
              target="_blank"
              className="focus-ring rounded-sm px-3 py-2 text-sm text-stone-light hover:text-ivory"
            >
              View site ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
