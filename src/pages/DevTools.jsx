import React, { useState } from "react";
import { devTools } from "../data/devtools";

export default function DevTools() {
    const [activeToolId, setActiveToolId] = useState(devTools[0].id);
    const activeTool = devTools.find((tool) => tool.id === activeToolId);

    return (
        <div id="dev-tools" className="container mx-auto px-6 md:px-20 max-w-8xl pt-32 pb-12">
            {/* Barra de Navegación de Herramientas */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-8">
                {devTools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                        className={`
                            flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200
                            ${
                                activeToolId === tool.id
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }
                        `}
                    >
                        <tool.icon className="h-5 w-5" />
                        <span>{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Contenido de la Herramienta Activa */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{activeTool.label}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{activeTool.description}</p>

                {/* Renderiza el componente de la herramienta seleccionada */}
                <activeTool.component />
            </div>
        </div>
    );
}
