import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeIcon from "./ThemeIcon";
import { useTheme } from "../../hooks/useTheme";
import { MdMenu, MdClose } from "react-icons/md";
// Importamos directamente las categorías y herramientas desde el archivo principal
import { categories, allTools } from "../../data/allTools";

// Generamos los navItems dinámicamente
const navItems = categories.map((cat) => {
    // Busca la primera herramienta para esa categoría para crear la URL
    const firstToolId = allTools.find((tool) => tool.category === cat.id)?.id;
    return {
        id: cat.id,
        label: cat.label,
        to: `/${cat.id}/${firstToolId}`,
        basePath: `/${cat.id}`,
        type: "internal",
    };
});

// Añadimos los elementos estáticos al principio y al final
const finalNavItems = [
    { id: "inicio", label: "Inicio", to: "/", basePath: "/", type: "internal" },
    ...navItems,
    { id: "contacto", label: "Contacto", type: "external", href: "mailto:colidom@outlook.com" },
];

export default function Header() {
    const location = useLocation();
    const { theme, menuOpen, setMenuOpen, handleChange, themeTranslations } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const getIsActive = (basePath) => {
        if (basePath === "/") {
            return location.pathname === basePath;
        }
        return location.pathname.startsWith(basePath);
    };

    useEffect(() => {
        const applyTheme = () => {
            if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };
        applyTheme();
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className="fixed top-0 w-full flex justify-center py-6 z-[999]">
            <nav
                className={`
                    flex items-center px-4 py-2 text-sm font-semibold rounded-full border 
                    transition-all duration-300 ease-in-out z-50
                    ${
                        isScrolled
                            ? "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg"
                            : "border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md"
                    }
                `}
            >
                {/* Mobile Menu Button - visible on small screens */}
                <div className="flex items-center md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-200">
                        {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                    <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">Colidom-Lab</span>
                </div>

                {/* Desktop Navigation - hidden on small screens */}
                <div className="hidden md:flex items-center space-x-4">
                    {finalNavItems.map((item) => {
                        if (item.type === "internal") {
                            return (
                                <Link
                                    key={item.id}
                                    to={item.to}
                                    className={`px-4 py-2 transition-colors duration-200 rounded-full
                                        ${
                                            getIsActive(item.basePath)
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                    aria-label={`Ir a la herramienta de ${item.label}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        } else if (item.type === "external") {
                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className="px-4 py-2 transition-colors duration-200 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                >
                                    {item.label}
                                </a>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Separator and Theme Toggle - visible on desktop */}
                <div className="hidden md:flex items-center">
                    <span className="mx-2 w-[1px] h-6 bg-gray-300 dark:bg-gray-700"></span>
                    <div className="relative">
                        <button
                            id="theme-toggle-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 transition-transform duration-200 hover:scale-110"
                            aria-label="Elige el tema"
                        >
                            <ThemeIcon selected={theme} />
                        </button>
                        {menuOpen && (
                            <div
                                id="theme-menu"
                                className="absolute top-10 right-0 text-sm p-1 min-w-[6rem] rounded-lg border border-gray-200 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 shadow-xl backdrop-blur-md"
                            >
                                <ul>
                                    {["light", "dark", "system"].map((option) => (
                                        <li
                                            key={option}
                                            onClick={() => handleChange(option)}
                                            className={`px-3 py-1.5 cursor-pointer rounded-md ${
                                                theme === option ? "bg-blue-600 text-white" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {themeTranslations[option]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 left-0 w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-[50] transition-transform duration-300
                ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"} md:hidden`}
            >
                <div className="container mx-auto px-4 py-6 flex flex-col items-center">
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-2xl text-gray-900 dark:text-white">Colidom-Lab</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-200">
                            <MdClose size={32} />
                        </button>
                    </div>
                    <ul className="flex flex-col items-center mt-8 space-y-4 text-xl">
                        {finalNavItems.map((item) => {
                            if (item.type === "internal") {
                                return (
                                    <li key={item.id}>
                                        <Link
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            to={item.to}
                                            className={`px-4 py-2 transition-colors duration-200 rounded-full
                                                ${
                                                    getIsActive(item.basePath)
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            } else if (item.type === "external") {
                                return (
                                    <li key={item.id}>
                                        <a
                                            href={item.href}
                                            className="px-4 py-2 transition-colors duration-200 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                    <div className="mt-8">
                        <label className="text-gray-600 dark:text-gray-200 mr-2">Tema:</label>
                        <select
                            onChange={(e) => handleChange(e.target.value)}
                            value={theme}
                            className="rounded-md border p-2 bg-transparent text-gray-900 dark:text-white"
                        >
                            {["light", "dark", "system"].map((option) => (
                                <option key={option} value={option}>
                                    {themeTranslations[option]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
}
