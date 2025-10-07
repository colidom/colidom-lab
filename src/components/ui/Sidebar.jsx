import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ navItems, activeToolId, basePath, isOpen, onClose }) {
    return (
        <>
            {/* Overlay para móviles */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside 
                className={`
                    w-72 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl 
                    border-r border-gray-200 dark:border-gray-700 shadow-xl
                    fixed top-28 left-0 bottom-0
                    z-40 overflow-hidden
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Header del sidebar */}
                    <div className="mb-6 flex-shrink-0">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Herramientas
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {navItems.length} disponibles
                        </p>
                    </div>

                    {/* Lista de herramientas - scrolleable */}
                    <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = activeToolId === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    to={`${basePath}/${item.id}`}
                                    onClick={() => {
                                        // Cerrar sidebar en móviles al hacer clic
                                        if (window.innerWidth < 768) {
                                            onClose();
                                        }
                                    }}
                                    className={`
                                        group relative flex items-center gap-3 px-4 py-3 rounded-xl
                                        transition-all duration-300 text-left overflow-hidden flex-shrink-0
                                        ${isActive
                                            ? `${item.colorClasses.button} text-white shadow-lg`
                                            : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                        }
                                    `}
                                >
                                    {/* Efecto de brillo en hover */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    )}
                                    
                                    {/* Icono */}
                                    <item.icon className={`text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : item.colorClasses.icon}`} />
                                    
                                    {/* Texto */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-semibold block truncate">
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <span className="text-xs opacity-90 block truncate">
                                                {item.shortDescription}
                                            </span>
                                        )}
                                    </div>

                                    {/* Indicador activo */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Separador decorativo */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            <p className="mb-2">¿Tienes ideas?</p>
                            <a 
                                href="mailto:colidom@outlook.com"
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <span>Sugiere una herramienta</span>
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
