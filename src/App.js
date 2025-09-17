import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white">
            <Header />
            <main className="flex-grow px-6 md:px-20 max-w-5xl mx-auto space-y-32 pt-20"></main>
            <Footer />
        </div>
    );
}
