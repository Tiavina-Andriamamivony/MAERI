"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"





import { useEffect, useState } from "react";

export function ModeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}