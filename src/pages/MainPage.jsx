import React, { useState } from "react";
import ToolCard from "../components/ToolCard";
import { tools } from "../data/tools";

const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTools = tools.filter(
        (tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            id="inicio"
            className="container mx-auto px-6 md:px-20 max-w-5xl pt-20 pb-12 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center"
        >
            {/* Sección de Bienvenida y Buscador */}
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

            {/* Cuadrícula de Herramientas */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No se encontraron herramientas.</p>
                )}
            </div>
        </div>
    );
};

export default MainPage;
