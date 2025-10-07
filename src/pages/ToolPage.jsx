import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { allTools } from "../data/allTools";

export default function ToolPage() {
    const { toolId, categoryId } = useParams();
    const navigate = useNavigate();

    const toolsInCategory = allTools.filter((tool) => tool.category === categoryId);
    const activeTool = toolsInCategory.find((tool) => tool.id === toolId);

    useEffect(() => {
        if (!activeTool) {
            const firstToolId = toolsInCategory[0]?.id;
            if (firstToolId) {
                navigate(`/${categoryId}/${firstToolId}`, { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [activeTool, navigate, categoryId, toolsInCategory]);

    if (!activeTool) {
        return null;
    }

    const ActiveToolComponent = activeTool.component;

    return (
        <div id={categoryId} className="flex flex-col md:flex-row min-h-screen">
            <Sidebar navItems={toolsInCategory} activeToolId={toolId} basePath={`/${categoryId}`} />

            <div className="flex-1 md:ml-64 p-6 md:p-12 mt-20 transition-all duration-300">
                <div className="container mx-auto max-w-7xl animate-slide-in">
                    {/* Header de la herramienta */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${activeTool.colorClasses.border.replace('border-', 'from-')}-500/20 ${activeTool.colorClasses.border.replace('border-', 'to-')}-600/20 backdrop-blur-sm`}>
                                <activeTool.icon className={`text-4xl ${activeTool.colorClasses.icon}`} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                                    {activeTool.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {activeTool.description}
                                </p>
                            </div>
                        </div>

                        {/* Features */}
                        {activeTool.features && activeTool.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {activeTool.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm rounded-full bg-white/50 dark:bg-gray-700/50 
                                            backdrop-blur-sm border border-gray-200 dark:border-gray-600
                                            text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        ✓ {feature}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contenido de la herramienta */}
                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                        <ActiveToolComponent />
                    </div>

                    {/* Tips o información adicional */}
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                    Tip: Atajo de teclado
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    Usa <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700 font-mono text-xs">Ctrl/Cmd + K</kbd> para buscar herramientas rápidamente
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
