import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import DevTools from "./pages/DevTools";

export default function App() {
    // El estado 'activePage' ahora controla qué componente se renderiza.
    const [activePage, setActivePage] = useState("inicio");

    // Esta función se pasará al Header para cambiar la página.
    const handlePageChange = (pageId) => {
        setActivePage(pageId);
    };

    const renderContent = () => {
        switch (activePage) {
            case "dev-tools":
                return <DevTools />;
            case "inicio":
            default:
                return <MainPage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white">
            {/* Pasamos 'activePage' y 'handlePageChange' al Header */}
            <Header activePage={activePage} onPageChange={handlePageChange} />
            <main className="flex-grow">{renderContent()}</main>
            <Footer />
        </div>
    );
}
