import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import FloatingWorkTimer from "./components/FloatingWorkTimer";
import MainPage from "./pages/MainPage";
import ToolPage from "./pages/ToolPage";
import { allTools } from "./data/allTools";

export default function App() {
    return (
        <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white overflow-hidden">
            {/* Efectos de fondo decorativos */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Círculos decorativos */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-float" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
                
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 dark:opacity-20" />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col min-h-screen">
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
                        <Route
                            path="/security"
                            element={<Navigate to={`/security/${allTools.find((tool) => tool.category === "security")?.id}`} replace />}
                        />

                        {/* Ruta genérica y dinámica para todas las herramientas */}
                        <Route path="/:categoryId/:toolId" element={<ToolPage />} />

                        {/* Ruta de fallback para URLs no encontradas */}
                        <Route path="*" element={
                            <div className="flex items-center justify-center min-h-[60vh]">
                                <div className="text-center p-8 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Página no encontrada
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        La página que buscas no existe o ha sido movida
                                    </p>
                                    <a 
                                        href="/"
                                        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Volver al inicio
                                    </a>
                                </div>
                            </div>
                        } />
                    </Routes>
                </main>
                <Footer />
                
                {/* Widget Flotante de Seguimiento de Jornada */}
                <FloatingWorkTimer />
            </div>
        </div>
    );
}
