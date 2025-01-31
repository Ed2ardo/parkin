// Un wrapper para restringir el acceso a ciertas páginas.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  // Si no hay token, redirigir al login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
