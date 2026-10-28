"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "omnext-theme";
const THEMES = new Set(["system", "light", "dark"]);

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.has(savedTheme) ? savedTheme : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const resolvedTheme = theme === "system" ? (systemPreference.matches ? "dark" : "light") : theme;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    typeof window === "undefined" ? "system" : readSavedTheme(),
  );

  useEffect(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => applyTheme(theme);

    syncTheme();
    systemPreference.addEventListener("change", syncTheme);
    return () => systemPreference.removeEventListener("change", syncTheme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    if (!THEMES.has(nextTheme)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The in-memory theme still works when browser storage is unavailable.
    }
    applyTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
  return context;
}
