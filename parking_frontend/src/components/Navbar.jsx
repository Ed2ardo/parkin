import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Parqueadero</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">Bienvenido, {user.username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger me-2" onClick={logout}>Salir</button>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              {user?.is_admin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/config">Configuración</Link>
                </li>
              )}
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
