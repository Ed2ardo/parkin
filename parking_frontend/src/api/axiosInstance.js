import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // La base para todas las rutas
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Interceptor para agregar el token a cada solicitud automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

//  Interceptor para manejar errores y renovar el token automáticamente
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token ha expirado (401) y no se ha intentado renovar aún
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken)
          throw new Error("No hay refresh token, redirigiendo al login...");

        //  Intentar renovar el token
        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("token", newAccessToken);
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // Reintentar la solicitud original con el nuevo token
      } catch (refreshError) {
        console.error("Error al refrescar el token:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirigir al login si el refresh falla
      }
    }

    console.error("Error en la solicitud:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
