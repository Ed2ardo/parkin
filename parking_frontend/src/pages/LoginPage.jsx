import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("token/", credentials);
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${response.data.access}`;
      console.log("Respuesta del servidor:", response.data); // Ver si llega el token
      console.log("Redirigiendo...");
      navigate("/");
    } catch (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="w-80 p-4 border rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium">Usuario</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;