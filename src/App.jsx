import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import DevTools from "./pages/DevTools";
import Utilities from "./pages/Utilities";

export default function App() {
    const [activePage, setActivePage] = useState("inicio");
    const [sectionToScroll, setSectionToScroll] = useState(null);

    const handlePageChange = (pageId, sectionId = null) => {
        setSectionToScroll(sectionId);
        setActivePage(pageId);
    };

    const handleScrollToSection = () => {
        if (sectionToScroll) {
            const element = document.getElementById(sectionToScroll);
            if (element) {
                // Desplazamiento suave hacia el elemento
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                // Limpiamos el estado para evitar desplazamientos repetidos
                setSectionToScroll(null);
            }
        }
    };

    const renderContent = () => {
        switch (activePage) {
            case "dev-tools":
                return <DevTools onScrollToSection={handleScrollToSection} sectionToScroll={sectionToScroll} />;
            case "utilidades":
                return <Utilities onScrollToSection={handleScrollToSection} sectionToScroll={sectionToScroll} />;
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
