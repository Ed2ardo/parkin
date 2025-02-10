import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-4">
      <p className="mb-0">© {new Date().getFullYear()} Parqueadero. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
