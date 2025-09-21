// src/pages/MainPage.jsx
import React, { useState } from "react";
import ToolCard from "../components/ToolCard";
import { allTools, categories } from "../data/allTools"; // 💡 Importamos los datos unificados

// 💡 El componente ahora recibe 'onPageChange' como prop
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
            className="container mx-auto px-6 md:px-20 max-w-7xl pt-20 pb-12 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center"
        >
            {/* ... (Sección de Bienvenida y Buscador - sin cambios) */}
            <div className="w-full max-w-2xl mb-12">
                <h1 className="text-4xl mt-12 sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Colidom-Lab</h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">Un laboratorio de herramientas para desarrolladores.</p>
                <input
                    type="text"
                    placeholder="Buscar herramientas..."
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 💡 Agrupamos las herramientas por categoría */}
            <div className="w-full space-y-12">
                {groupedTools.map((group) => {
                    if (group.tools.length === 0) return null;
                    return (
                        <div key={group.id} className="text-left w-full">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
                                {group.label}
                            </h2>
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.tools.map((tool) => (
                                    // 💡 Pasamos 'onPageChange' al ToolCard
                                    <ToolCard key={tool.id} tool={tool} onPageChange={onPageChange} />
                                ))}
                            </div>
                        </div>
                    );
                })}
                {filteredTools.length === 0 && <p className="text-center text-gray-500 col-span-full">No se encontraron herramientas.</p>}
            </div>
        </div>
    );
};

export default MainPage;
