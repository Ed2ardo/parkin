import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function GenerarTicketButton({ registroId, onCobrado }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarTicket = async () => {
      try {
        const response = await axiosInstance.get(`/parqueo/registro-parqueo/${registroId}/`);
        if (response.data.ticket) {
          setTicketId(response.data.ticket);
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

      const response = await axiosInstance.patch(`/parqueo/registro-parqueo/${registroId}/`, {
        estado: "facturado",
        generar_ticket: true,
      });

      if (response.data.ticket) {
        setTicketId(response.data.ticket);
        navigate(`/tickets/${response.data.ticket}`);
      } else {
        throw new Error("El ticket no fue generado correctamente.");
      }

      if (onCobrado) onCobrado();
    } catch (err) {
      console.error("Error en el proceso:", err);
      setError("No se pudo completar la operación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <button
        onClick={handleGenerarTicket}
        disabled={loading}
        className={`btn ${ticketId ? "btn-primary" : "btn-success"} w-100`}
      >
        {loading ? "Procesando..." : ticketId ? "Ver Ticket" : "Generar Ticket"}
      </button>
      {error && <p className="alert alert-danger mt-2">{error}</p>}
    </div>
  );
}

export default GenerarTicketButton;
