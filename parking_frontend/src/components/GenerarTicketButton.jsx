import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function GenerarTicketButton({ registroId, onCobrado }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔍 Verificar si el registro ya tiene un ticket asociado
    const verificarTicket = async () => {
      try {
        const response = await axiosInstance.get(`/parqueo/registro-parqueo/${registroId}/`);

        if (response.data.ticket) {
          setTicketId(response.data.ticket); // Ahora el ID correcto del ticket
        }
      } catch (err) {
        console.error("Error al verificar el ticket:", err);
      }
    };

    verificarTicket();
  }, [registroId]);

  const handleGenerarTicket = async () => {
    if (!window.confirm("¿Confirmas el cobro y generación del ticket?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
        return;
      }

      // 🔥 Enviamos el `PATCH` con `generar_ticket: true` y el estado `facturado`
      const response = await axiosInstance.patch(`/parqueo/registro-parqueo/${registroId}/`, {
        estado: "facturado",
        generar_ticket: true,
      });

      // ✅ Extraer el ID del ticket generado
      if (response.data.ticket) {
        setTicketId(response.data.ticket);
        navigate(`/tickets/${response.data.ticket}`);
      } else {
        throw new Error("El ticket no fue generado correctamente.");
      }

      // 🔄 Actualizar la lista de registros en la página principal
      if (onCobrado) onCobrado();

    } catch (err) {
      console.error("Error en el proceso:", err);
      setError("No se pudo completar la operación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerarTicket}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Procesando..." : ticketId ? "Ver Ticket" : "Generar Ticket"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default GenerarTicketButton;
