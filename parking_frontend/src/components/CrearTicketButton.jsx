import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function CrearTicketButton({ registroId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const crearTicket = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        registro_parqueo: registroId,
        numero: "000001", // Puedes generar este número en el backend o calcularlo dinámicamente
        informacion_legal: "Resolución DIAN 1234567890 - Facturación Electrónica",
      };

      const response = await axiosInstance.post("/tickets/", payload);

      // Redirige a la página de detalles del ticket creado
      navigate(`/tickets/${response.data.id}`);
    } catch (err) {
      console.error("Error al crear el ticket:", err);
      setError("No se pudo generar el ticket. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={crearTicket}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Generando..." : "Generar Ticket"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default CrearTicketButton;
