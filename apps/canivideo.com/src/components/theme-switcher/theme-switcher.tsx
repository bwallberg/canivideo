import { useState, useEffect } from "preact/hooks";
import styles from "./theme-switcher.module.css";

const THEMES = [
  { value: "", label: "Nord Dark (Default)" },
  { value: "theme-dark", label: "Dark" },
  { value: "theme-dracula", label: "Dracula" },
  { value: "theme-solarized-dark", label: "Solarized Dark" },
  { value: "theme-monokai", label: "Monokai" },
  { value: "theme-catppuccin-mocha", label: "Catppuccin Mocha" },
  { value: "theme-catppuccin-macchiato", label: "Catppuccin Macchiato" },
  { value: "theme-catppuccin-frappe", label: "Catppuccin Frappé" },
  { value: "theme-light", label: "Light" },
  { value: "theme-solarized-light", label: "Solarized Light" },
  { value: "theme-github-light", label: "GitHub Light" },
  { value: "theme-catppuccin-latte", label: "Catppuccin Latte" },
];

const THEME_CLASSES = [
  "theme-nord-dark",
  "theme-dark",
  "theme-dracula",
  "theme-solarized-dark",
  "theme-solarized-light",
  "theme-monokai",
  "theme-light",
  "theme-github-light",
  "theme-catppuccin-latte",
  "theme-catppuccin-frappe",
  "theme-catppuccin-macchiato",
  "theme-catppuccin-mocha",
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    // Load saved theme from localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "";
      setCurrentTheme(savedTheme);
      if (savedTheme) {
        document.body.classList.add(savedTheme);
      }
    }
  }, []);

  const handleThemeChange = (event: Event) => {
    const newTheme = (event.target as HTMLSelectElement).value;

    // Remove all theme classes
    THEME_CLASSES.forEach((themeClass) => {
      document.body.classList.remove(themeClass);
    });

    // Add new theme class if not default
    if (newTheme) {
      document.body.classList.add(newTheme);
    }

    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <div class={styles.themeSwitcher}>
      <label htmlFor="theme-select" class={styles.label}>
        Theme:
      </label>
      <select
        id="theme-select"
        class={styles.select}
        value={currentTheme}
        onChange={handleThemeChange}
      >
        {THEMES.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}