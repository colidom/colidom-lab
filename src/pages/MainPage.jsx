import React, { useState } from "react";
import ToolCard from "../components/ui/ToolCard";
import { allTools, categories } from "../data/allTools";
import { MdSearch } from "react-icons/md";

const MainPage = ({ onPageChange }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTools = allTools.filter(
        (tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedTools = categories.map((category) => {
        const toolsInSection = filteredTools.filter((tool) => tool.category === category.id);
        return { ...category, tools: toolsInSection };
    });

    return (
        <div
            id="inicio"
            className="container mx-auto px-6 md:px-20 max-w-7xl pt-20 pb-12 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center"
        >
            {/* Hero Section */}
            <div className="w-full max-w-3xl mb-16 text-center animate-slide-in">
                {/* Logo o icono decorativo - PADDING TOP AUMENTADO */}
                <div className="inline-block mb-6 mt-12 p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm animate-float">
                    <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Colidom-Lab
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light">
                    Tu laboratorio de herramientas para <span className="font-semibold text-blue-600 dark:text-blue-400">desarrolladores</span> e{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">ingenieros IT</span>
                </p>

                {/* Barra de búsqueda mejorada */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                    <div className="relative flex items-center">
                        <MdSearch className="absolute left-4 text-2xl text-gray-400 dark:text-gray-500 z-10" />
                        <input
                            type="text"
                            placeholder="Buscar herramientas..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 
                                bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-xl
                                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500
                                transition-all duration-300 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="flex justify-center gap-8 mt-8 flex-wrap">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{allTools.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Herramientas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Categorías</div>
                    </div>
                </div>
            </div>

            {/* Herramientas por categoría */}
            <div className="w-full space-y-16">
                {groupedTools.map((group, index) => {
                    if (group.tools.length === 0) return null;
                    return (
                        <div 
                            key={group.id} 
                            className="text-left w-full animate-slide-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Header de categoría mejorado */}
                            <div className="relative mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                        {group.label}
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
                                </div>
                                <p className="mt-2 ml-16 text-gray-600 dark:text-gray-400">
                                    {group.tools.length} herramienta{group.tools.length !== 1 ? 's' : ''} disponible{group.tools.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Grid de herramientas */}
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {group.tools.map((tool, toolIndex) => (
                                    <div 
                                        key={tool.id}
                                        style={{ animationDelay: `${(index * 0.1) + (toolIndex * 0.05)}s` }}
                                    >
                                        <ToolCard tool={tool} onPageChange={onPageChange} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                
                {filteredTools.length === 0 && (
                    <div className="text-center py-16 animate-scale-in">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-500 dark:text-gray-400">No se encontraron herramientas.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Intenta con otros términos de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
