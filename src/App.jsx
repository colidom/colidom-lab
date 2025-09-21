import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import DevTools from "./pages/DevTools";
import Utilities from "./pages/Utilities";

export default function App() {
    const [activePage, setActivePage] = useState("inicio");

    const handlePageChange = (pageId, sectionId = null) => {
        setActivePage(pageId);
        // Desplazarse a la sección si se proporciona un ID
        if (sectionId) {
            // Se puede implementar lógica de desplazamiento si es necesario, pero el estado es suficiente por ahora
        }
    };

    const renderContent = () => {
        switch (activePage) {
            case "dev-tools":
                return <DevTools />;
            case "utilidades":
                return <Utilities />;
            case "inicio":
            default:
                return <MainPage onPageChange={handlePageChange} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white">
            <Header activePage={activePage} onPageChange={handlePageChange} />
            <main className="flex-grow">{renderContent()}</main>
            <Footer />
        </div>
    );
}
