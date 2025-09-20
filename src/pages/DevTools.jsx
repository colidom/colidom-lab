import React, { useState } from "react";
import { devTools } from "../data/devtools";

export default function DevTools() {
    const [activeToolId, setActiveToolId] = useState(devTools[0].id);
    const activeTool = devTools.find((tool) => tool.id === activeToolId);

    return (
        <div id="dev-tools" className="flex flex-col md:flex-row min-h-screen">
            {/* Barra de Navegación de Herramientas Lateral */}
            <div className="md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-start gap-4 shadow-md md:fixed md:top-0 md:left-0 md:bottom-0 z-10">
                <div className="flex flex-col gap-2 w-full">
                    {devTools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveToolId(tool.id)}
                            className={`
                                flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                                ${
                                    activeToolId === tool.id
                                        ? "bg-blue-600 text-white font-semibold transform scale-105 shadow-lg"
                                        : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                                }
                            `}
                        >
                            <tool.icon className="h-6 w-6" />
                            <span className="text-lg">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido de la Herramienta Activa */}
            <div className="flex-1 md:ml-64 p-6 md:p-12 mt-20 transition-all duration-300">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{activeTool.label}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{activeTool.description}</p>
                        <activeTool.component />
                    </div>
                </div>
            </div>
        </div>
    );
}
