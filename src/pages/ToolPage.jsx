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
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{activeTool.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{activeTool.description}</p>
                        <ActiveToolComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
