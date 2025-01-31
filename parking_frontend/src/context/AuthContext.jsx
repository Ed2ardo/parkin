// Para manejar la sesión del usuario en toda la aplicación.
import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Verifica si hay una sesión al cargar la app
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser({ username: "Usuario Autenticado" });
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("token/", credentials);
      const { access } = response.data;

      // Guardar en estado y localStorage
      setToken(access);
      localStorage.setItem("token", access);

      setUser({ username: credentials.username });

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${access}`;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    axiosInstance.defaults.headers["Authorization"] = "";
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);