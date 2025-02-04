import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // console.log("Usuario autenticado:", user);

  // 🔥 Consultar el usuario autenticado si hay un token
  useEffect(() => {
    if (token && !user) {
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
      axiosInstance.get("core/me/")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token, user]); // Se ejecuta solo si el token cambia o el usuario no está definido

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("token/", credentials);
      const { access, refresh } = response.data;

      // Guardar en estado y localStorage
      setToken(access);
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      axiosInstance.defaults.headers["Authorization"] = `Bearer ${access}`;

      // 🔥 Consultar información del usuario tras autenticarse
      const userResponse = await axiosInstance.get("core/me/");
      setUser(userResponse.data);

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
