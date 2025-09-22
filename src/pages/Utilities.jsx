import React, { useEffect } from "react";
import { utilityTools } from "../data/utilities";
import { useParams, useNavigate } from "react-router-dom";

export default function Utilities({ onScrollToSection, sectionToScroll }) {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const activeTool = utilityTools.find((tool) => tool.id === toolId);

    useEffect(() => {
        if (!activeTool && utilityTools.length > 0) {
            navigate(`/utilities/${utilityTools[0].id}`, { replace: true });
        }
    }, [activeTool, navigate]);

    return (
        <div id="utilidades" className="flex flex-col md:flex-row min-h-screen">
            {/* Barra de Navegación de Herramientas Lateral */}
            <div className="md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-start gap-4 shadow-md md:fixed md:top-0 md:left-0 md:bottom-0 z-10">
                <div className="flex flex-col gap-2 w-full">
                    {utilityTools.map((tool) => (
                        <button
                            key={tool.id}
                            id={tool.id}
                            onClick={() => navigate(`/utilities/${tool.id}`)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left
                                ${
                                    toolId === tool.id
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            <tool.icon className="text-xl" />
                            <span className="text-base font-semibold">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido de la Herramienta Activa */}
            <div className="flex-1 md:ml-64 p-6 md:p-12 mt-20 transition-all duration-300">
                {activeTool && (
                    <div className="container mx-auto max-w-7xl">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{activeTool.name}</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{activeTool.description}</p>
                            <activeTool.component />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
