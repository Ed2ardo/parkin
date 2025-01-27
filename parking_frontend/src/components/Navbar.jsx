import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Gestión de Parqueadero</h1>
      <ul style={styles.navList}>
        <li>
          <Link to="/" style={styles.link}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/config" style={styles.link}>
            Configuración
          </Link>
        </li>
        {/* agregar más enlaces aquí */}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#0044cc",
    color: "#fff",
  },
  title: {
    fontSize: "1.5rem",
    margin: 0,
  },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "15px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
