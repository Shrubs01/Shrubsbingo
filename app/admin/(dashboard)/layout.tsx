"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminLogoutAction, getAdminSessionAction } from "@/app/actions";

const navItems = [
  { href: "/admin",            label: "Sessions",  icon: "📋" },
  { href: "/admin/payments",   label: "Payments",  icon: "💳" },
  { href: "/admin/plants",     label: "Plants",    icon: "🌿" },
  { href: "/admin/venues",     label: "Venues",    icon: "📍" },
  { href: "/admin/hosts",      label: "Hosts",     icon: "🎙️" },
  { href: "/admin/faqs",       label: "FAQs",      icon: "❓" },
  { href: "/admin/quiz",       label: "Quiz",      icon: "🧩" },
  { href: "/admin/legal",      label: "Policies",  icon: "📜" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("shrubsbingo@gmail.com");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getAdminSessionAction().then((session) => {
      if (session?.email) {
        setAdminEmail(session.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of the admin panel?")) {
      setIsLoggingOut(true);
      await adminLogoutAction();
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--border)] flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen z-40">
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
          <Link href="/admin" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/meenu-logo.png"
              alt="Shrubs Bingo Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[var(--orange-100)] text-[var(--orange-800)] px-2 py-0.5 rounded-full border border-[var(--orange-200)]">
              Admin
            </span>
          </Link>
          <Link 
            href="/" 
            className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--ink)]" 
            title="View Public Site"
          >
            Site ↗
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2.5 rounded-[8px] text-[0.8125rem] font-semibold tracking-wider uppercase transition-colors flex items-center gap-3",
                  isActive 
                    ? "bg-[var(--green-50)] text-[var(--green-800)] border border-[var(--green-200)]" 
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink)] border border-transparent"
                )}
              >
                <span className="text-[1rem]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[var(--border)] mt-auto bg-[var(--bg-subtle)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--green-100)] text-[var(--green-800)] flex items-center justify-center font-bold text-xs shrink-0">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--ink)] truncate">
                  Admin User
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate" title={adminEmail}>
                  {adminEmail}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-xs font-semibold uppercase tracking-wider text-[var(--error)] hover:bg-red-50 py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-1.5 border border-red-200"
          >
            <span>🚪</span> {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white border-b border-[var(--border)] shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/meenu-logo.png"
              alt="Shrubs Bingo Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[var(--orange-100)] text-[var(--orange-800)] px-2 py-0.5 rounded-full border border-[var(--orange-200)]">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link href="/" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--ink)]">
              Site →
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors flex items-center gap-1"
            >
              <span>🚪</span> {isLoggingOut ? "..." : "Sign Out"}
            </button>
          </div>
        </div>

        {/* Desktop Top Header Bar (Fixed & Always Visible) */}
        <header className="hidden md:flex h-16 bg-white border-b border-[var(--border)] items-center justify-between px-8 shrink-0 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Portal</span>
            <span className="text-[var(--border-control)]">/</span>
            <span className="text-sm font-bold text-[var(--ink)] capitalize">
              {pathname === "/admin" ? "Dashboard & Sessions" : pathname.replace("/admin/", "").replace(/-/g, " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--ink)] bg-[var(--bg-subtle)] hover:bg-gray-100 px-3 py-1.5 rounded-md border border-[var(--border-control)] transition-colors flex items-center gap-1.5"
            >
              <span>🌐</span> Public Site ↗
            </Link>

            <div className="h-5 w-[1px] bg-[var(--border-control)]" />

            {/* Admin Email Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--green-50)] border border-[var(--green-200)] text-xs text-[var(--green-800)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--green-500)] animate-pulse" />
              <span className="font-semibold">{adminEmail}</span>
            </div>

            {/* Very Prominent Desktop Sign Out Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 px-4 py-2 rounded-lg border border-red-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              title="Click to sign out of the admin panel"
            >
              <span className="text-sm">🚪</span>
              <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 min-h-screen overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
