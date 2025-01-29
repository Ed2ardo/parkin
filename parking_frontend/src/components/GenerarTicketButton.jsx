import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function GenerarTicketButton({ registroId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Consultar si ya existe un ticket asociado al registro
    const verificarTicket = async () => {
      try {
        const response = await axiosInstance.get(`/tickets/?registro_parqueo=${registroId}`);
        if (response.data.length > 0) {
          setTicketId(response.data[0].id); // Guardar el ID del ticket encontrado
        }
      } catch (err) {
        console.error("Error al verificar ticket:", err);
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
      // Si ya hay un ticket, solo redirigir a su página
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
        return;
      }

      // 1️⃣ Cambiar el estado del registro a "facturado"
      await axiosInstance.patch(`parqueo/registro-parqueo/${registroId}/`, {
        estado: "facturado",
      });

      // 2️⃣ Crear el ticket correspondiente
      const payload = {
        registro_parqueo: registroId,
        informacion_legal: "Resolución DIAN 1234567890 - Facturación Electrónica",
      };
      const response = await axiosInstance.post("/tickets/", payload);

      // 3️⃣ Guardar el ticketID y redirigir
      setTicketId(response.data.id);
      navigate(`/tickets/${response.data.id}`);
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
        {loading ? "Procesando..." : ticketId ? "Generar Ticket" : "Ver Ticket"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default GenerarTicketButton;
