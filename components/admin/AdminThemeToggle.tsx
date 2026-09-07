"use client";

import { useEffect, useState } from "react";

export default function AdminThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");

    if (savedTheme === "light") {
      document.documentElement.classList.add("admin-light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("admin-light");
      setIsDark(true);
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    setIsDark(nextIsDark);

    if (nextIsDark) {
      document.documentElement.classList.remove("admin-light");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.classList.add("admin-light");
      localStorage.setItem("admin-theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="theme-toggle">
        <span className="theme-toggle-option active">☾</span>
        <span className="theme-toggle-option">☀</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle light and dark mode"
    >
      <span
        className={`theme-toggle-option ${
          isDark ? "active" : ""
        }`}
      >
        ☾
      </span>

      <span
        className={`theme-toggle-option ${
          !isDark ? "active" : ""
        }`}
      >
        ☀
      </span>
    </button>
  );
}