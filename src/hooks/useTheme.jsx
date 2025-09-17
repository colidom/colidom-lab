import { useState, useEffect } from "react";

const getSystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
};

const applyTheme = (theme) => {
    const isDark = theme === "dark" || (theme === "system" && getSystemTheme() === "dark");
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

export const useTheme = () => {
    const [theme, setTheme] = useState("system");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const initialTheme = storedTheme || "system";
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [theme]);

    useEffect(() => {
        const listener = (e) => {
            if (!e.target.closest("#theme-toggle-btn") && !e.target.closest("#theme-menu")) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    }, []);

    const handleChange = (newTheme) => {
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
        applyTheme(newTheme);
        setMenuOpen(false);
    };

    const themeTranslations = {
        light: "Claro",
        dark: "Oscuro",
        system: "Sistema",
    };

    return { theme, menuOpen, setMenuOpen, handleChange, themeTranslations };
};
