// Función para validar el JSON y parsearlo
export const validateJson = (jsonString) => {
    if (!jsonString.trim()) {
        return null;
    }
    return JSON.parse(jsonString);
};

// Función para formatear el JSON con una indentación legible
export const formatJson = (jsonObj) => {
    return JSON.stringify(jsonObj, null, 2);
};
