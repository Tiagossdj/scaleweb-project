"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FlaskConical, LayoutDashboard, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lci", label: "Gestão LCI", icon: FlaskConical },
  { href: "/results", label: "Resultados", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          SCALE-Web
        </p>
        <p className="text-lg font-semibold">Emergy Calculator</p>
      </div>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        {nav}
      </aside>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card lg:hidden">
            {nav}
          </aside>
        </>
      )}
    </>
  );
}
