import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { devTools } from "../data/devtools";

export default function DevTools() {
    const { toolId } = useParams();
    const navigate = useNavigate();

    const [activeToolId, setActiveToolId] = useState(toolId || devTools[0].id);
    const activeTool = devTools.find((tool) => tool.id === activeToolId);

    useEffect(() => {
        if (!activeTool) {
            navigate("/dev-tools/json-formatter");
        }
    }, [activeTool, navigate]);

    useEffect(() => {
        if (toolId) {
            setActiveToolId(toolId);
        }
    }, [toolId]);

    return (
        <div id="dev-tools" className="flex flex-col md:flex-row min-h-screen">
            <Sidebar navItems={devTools} activeToolId={activeToolId} basePath="/dev-tools" />

            {/* Contenedor principal del contenido de la herramienta */}
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
