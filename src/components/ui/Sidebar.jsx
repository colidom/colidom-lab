import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ navItems, activeToolId, basePath }) {
    return (
        <aside className="w-full md:w-72 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 
            md:fixed md:top-0 md:left-0 md:bottom-0 z-20 pt-24 md:pt-28 shadow-xl">
            
            <div className="p-6 overflow-y-auto h-full">
                {/* Header del sidebar */}
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Herramientas
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {navItems.length} disponibles
                    </p>
                </div>

                {/* Lista de herramientas */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = activeToolId === item.id;
                        return (
                            <Link
                                key={item.id}
                                to={`${basePath}/${item.id}`}
                                className={`
                                    group relative flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-300 text-left overflow-hidden
                                    ${isActive
                                        ? `${item.colorClasses.button} text-white shadow-lg transform scale-105`
                                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-102'
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
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
    );
}
