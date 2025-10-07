import React from "react";
import { Link } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Sidebar({ navItems, activeToolId, basePath, isOpen, onClose, onToggle }) {
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
                    fixed top-0 left-0 bottom-0
                    z-40 overflow-hidden
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Botón de toggle integrado en el borde */}
                <button
                    onClick={onToggle}
                    className={`
                        absolute top-1/2 -translate-y-1/2 -right-4
                        w-8 h-16 
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
                        border border-gray-200 dark:border-gray-700
                        rounded-r-xl shadow-lg
                        flex items-center justify-center
                        hover:w-10 hover:-right-5
                        transition-all duration-300 ease-in-out
                        group z-50
                        ${!isOpen && 'hidden md:flex'}
                    `}
                    aria-label={isOpen ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                    title={isOpen ? "Ocultar menú (⌘+B)" : "Mostrar menú (⌘+B)"}
                >
                    <div className="relative flex items-center justify-center">
                        <MdChevronLeft 
                            className={`
                                text-2xl text-gray-600 dark:text-gray-300
                                transition-all duration-300
                                ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}
                            `}
                        />
                        <MdChevronRight 
                            className={`
                                text-2xl text-gray-600 dark:text-gray-300
                                absolute transition-all duration-300
                                ${!isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'}
                            `}
                        />
                    </div>
                </button>

                {/* Botón flotante para móviles cuando el sidebar está cerrado */}
                {!isOpen && (
                    <button
                        onClick={onToggle}
                        className="md:hidden fixed top-24 left-4 z-50 p-3 rounded-xl 
                            bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl 
                            shadow-lg border border-gray-200 dark:border-gray-700
                            hover:scale-110 transition-all duration-200"
                        aria-label="Mostrar menú"
                    >
                        <MdChevronRight className="text-2xl text-gray-700 dark:text-gray-300" />
                    </button>
                )}

                <div className="h-full flex flex-col pt-28 pb-6 px-6">
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

            {/* Botón minimalista cuando el sidebar está cerrado (desktop) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0
                        w-8 h-16 
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
                        border-r border-t border-b border-gray-200 dark:border-gray-700
                        rounded-r-xl shadow-lg
                        items-center justify-center
                        hover:w-10 hover:left-0
                        transition-all duration-300 ease-in-out
                        group z-50"
                    aria-label="Mostrar menú lateral"
                    title="Mostrar menú (⌘+B)"
                >
                    <MdChevronRight className="text-2xl text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                </button>
            )}
        </>
    );
}
