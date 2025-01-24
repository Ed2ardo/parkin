//  archivo ajustado para usar el proxy de Vite:
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // La base para todas las rutas (usará el proxy de Vite)
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    // El token puede configurarse dinámicamente si es necesario:
    // Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    // Devuelve la respuesta directamente si no hay errores
    return response;
  },
  (error) => {
    // Muestra un mensaje de error global si ocurre un fallo
    console.error("Error en la solicitud:", error.response || error.message);
    // Puedes agregar lógica para redireccionar si hay un error 401 (no autorizado):
    if (error.response && error.response.status === 401) {
      console.log("Redirigiendo al login...");
      // Ejemplo de redirección: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
