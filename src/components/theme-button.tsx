"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    setIsRotating(true);
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className={`cursor-pointer transition-transform duration-500 ${
        isRotating ? "rotate-[360deg]" : ""
      }`}
    >
      {!mounted ? (
        <Sun className="h-5 w-5 opacity-0" aria-hidden />
      ) : isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
