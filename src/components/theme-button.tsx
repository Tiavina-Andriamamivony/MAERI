"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react";

export function ModeToggle() {
  const [theme, setTheme] = useState("light");
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    setIsRotating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
    
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <button 
      className={`cursor-pointer transition-transform duration-500 ${
        isRotating ? 'rotate-[360deg]' : ''
      }`} 
      onClick={toggleTheme}
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}