"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Navbar({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 lg:px-8">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <Button
        variant="outline"
        size="sm"
        className="relative"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Alternar tema"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    </header>
  );
}
