import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">


      {/* Sección de usuario */}
      <div>
        {/* Si hay usuario autenticado, mostrar su nombre y el botón de cerrar sesión */}
        {user ? (
          <>
            <span className="mr-4">Bienvenido, {user.username}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Salir</button>
            <div>
              <Link to="/" className="mr-4">Inicio</Link>

              {/* Mostrar la opción de Configuración solo si el usuario es administrador */}
              {user?.is_admin && <Link to="/config" className="mr-4">Configuración</Link>}
            </div>
          </>
        ) : (
          /* Si no hay usuario autenticado, mostrar el enlace para iniciar sesión */
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
