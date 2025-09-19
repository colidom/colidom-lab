import { useState } from "react";
import { formatJson, validateJson } from "../utils/jsonSyntaxHighlighter";

export const useJsonFormatter = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [error, setError] = useState(null);

    const handleFormat = () => {
        try {
            const parsed = validateJson(jsonInput);
            const formatted = formatJson(parsed);
            setJsonInput(formatted);
            setError(null);
        } catch (e) {
            setError("JSON inválido. Por favor, revisa la sintaxis.");
        }
    };

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
        if (error) {
            setError(null);
        }
    };

    return {
        jsonInput,
        error,
        handleInputChange,
        handleFormat,
    };
};
