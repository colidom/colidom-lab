// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import DevTools from "./pages/DevTools";
import Utilities from "./pages/Utilities";
import { devTools } from "./data/devtools";
import { utilityTools } from "./data/utilities";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white">
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/dev-tools" element={<Navigate to={`/dev-tools/${devTools[0].id}`} replace />} />
                    <Route path="/dev-tools/:toolId" element={<DevTools />} />
                    <Route path="/utilities" element={<Navigate to={`/utilities/${utilityTools[0].id}`} replace />} />
                    <Route path="/utilities/:toolId" element={<Utilities />} />
                    <Route path="*" element={<div>Página no encontrada</div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
