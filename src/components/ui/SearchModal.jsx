import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdClose } from "react-icons/md";
import { allTools } from "../../data/allTools";

export default function SearchModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const selectedItemRef = useRef(null);

    const filteredTools = allTools.filter(
        (tool) =>
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hacer foco en el input cuando se abre el modal y resetear estado
    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setSelectedIndex(0);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isOpen]);

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => 
                        prev < filteredTools.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredTools[selectedIndex]) {
                        handleToolClick(filteredTools[selectedIndex]);
                    }
                    break;
                default:
                    break;
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, filteredTools, selectedIndex]);

    // Cerrar al hacer clic fuera del modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Resetear índice cuando cambia el término de búsqueda
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchTerm]);

    // Scroll automático al elemento seleccionado
    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [selectedIndex]);

    const handleToolClick = (tool) => {
        navigate(`/${tool.category}/${tool.id}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20 px-4 animate-fade-in">
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in"
            >
                {/* Header con buscador */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                    <MdSearch className="text-2xl text-gray-400 dark:text-gray-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar herramientas..."
                        className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Cerrar búsqueda"
                    >
                        <MdClose className="text-xl text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Resultados */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredTools.length > 0 ? (
                        <div className="space-y-1">
                            {filteredTools.map((tool, index) => (
                                <button
                                    key={tool.id}
                                    ref={index === selectedIndex ? selectedItemRef : null}
                                    onClick={() => handleToolClick(tool)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left group ${
                                        index === selectedIndex
                                            ? "bg-blue-100 dark:bg-blue-900/50"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {/* Icono */}
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.colorClasses.border.replace('border-', 'from-')}-500/20 ${tool.colorClasses.border.replace('border-', 'to-')}-600/20 group-hover:scale-110 transition-transform`}>
                                        <tool.icon className={`text-2xl ${tool.colorClasses.icon}`} />
                                    </div>

                                    {/* Información */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* Badge de categoría */}
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                                        {tool.category}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-2">🔍</div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm ? "No se encontraron herramientas" : "Escribe para buscar herramientas"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer con atajos */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">
                                ↑↓
                            </kbd>
                            <span>Navegar</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">
                                ↵
                            </kbd>
                            <span>Abrir</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">
                                Esc
                            </kbd>
                            <span>Cerrar</span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {filteredTools.length} resultado{filteredTools.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>
        </div>
    );
}
