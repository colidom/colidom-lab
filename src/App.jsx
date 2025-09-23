import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import ToolPage from "./pages/ToolPage";
import { allTools } from "./data/allTools";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white">
            <Header />
            <main className="flex-grow">
                <Routes>
                    {/* Ruta de la página principal */}
                    <Route path="/" element={<MainPage />} />

                    {/* Rutas de redirección para las páginas base de cada categoría */}
                    <Route
                        path="/dev-tools"
                        element={<Navigate to={`/dev-tools/${allTools.find((tool) => tool.category === "dev-tools")?.id}`} replace />}
                    />
                    <Route
                        path="/utilities"
                        element={<Navigate to={`/utilities/${allTools.find((tool) => tool.category === "utilities")?.id}`} replace />}
                    />

                    {/* Ruta genérica y dinámica para todas las herramientas */}
                    <Route path="/:categoryId/:toolId" element={<ToolPage />} />

                    {/* Ruta de fallback para URLs no encontradas */}
                    <Route path="*" element={<div>Página no encontrada</div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
