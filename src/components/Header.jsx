import React, { useState } from "react";
import ThemeIcon from "./ThemeIcon";
import { useTheme } from "../hooks/useTheme";
import { useScrollEffects } from "../hooks/useScrollEffects";
import { MdMenu, MdClose } from "react-icons/md";

const navItems = [
    { id: "inicio", label: "Inicio", type: "internal" },
    { id: "generador-qr", label: "Generador QR", type: "internal" },
    { id: "formateador-json", label: "Formateador JSON", type: "internal" },
    { id: "codificador-b64", label: "Codificador B64", type: "internal" },
    { id: "contacto", label: "Contacto", type: "external", href: "mailto:colidom@outlook.com" },
];

export default function Header() {
    const { theme, menuOpen, setMenuOpen, handleChange, themeTranslations } = useTheme();
    const { activeSection, handleNavClick } = useScrollEffects();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMobileNavClick = (e, sectionId) => {
        handleNavClick(e, sectionId);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 z-10 w-full flex justify-center py-6">
            <nav className="flex items-center px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
                {/* Mobile Menu Button - visible on small screens */}
                <div className="flex items-center md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-200">
                        {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                    <span className="ml-2 font-bold text-lg">Colidom-Lab</span>
                </div>

                {/* Desktop Navigation - hidden on small screens */}
                <div className="hidden md:flex items-center">
                    {navItems.map((item) => {
                        if (item.type === "internal") {
                            return (
                                <button
                                    key={item.id}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                    className={`px-4 py-2 transition-colors duration-200 rounded-full
                                        ${
                                            activeSection === item.id
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                    aria-label={`Ir a la herramienta de ${item.label}`}
                                >
                                    {item.label}
                                </button>
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
                className={`fixed top-0 left-0 w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 transition-transform duration-300
                ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"} md:hidden`}
            >
                <div className="container mx-auto px-4 py-6 flex flex-col items-center">
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-2xl">colidom-Lab</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-200">
                            <MdClose size={32} />
                        </button>
                    </div>
                    <ul className="flex flex-col items-center mt-8 space-y-4 text-xl">
                        {navItems.map((item) => {
                            if (item.type === "internal") {
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={(e) => handleMobileNavClick(e, item.id)}
                                            className={`px-4 py-2 transition-colors duration-200 rounded-full
                                                ${
                                                    activeSection === item.id
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
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
                        <select onChange={(e) => handleChange(e.target.value)} value={theme} className="rounded-md border p-2 bg-transparent">
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
