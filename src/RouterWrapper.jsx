// src/RouterWrapper.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const RouterWrapper = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
};

export default RouterWrapper;
