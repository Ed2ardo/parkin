import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function CobrarButton({ registroId, onCobrado }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  const handleCobrar = async () => {
    if (!window.confirm("¿Estás seguro de que deseas cobrar este registro?")) {
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.patch(`parqueo/registro-parqueo/${registroId}/`, {
        estado: "facturado", // Cambiamos el estado del registro
      });
      alert("Cobro realizado exitosamente.");
      if (onCobrado) onCobrado(); // Refresca la lista después de cobrar

      // Redirige a la página del ticket
      navigate(`/ticket/${registroId}`);
    } catch (error) {
      console.error("Error al cobrar:", error);
      alert("Ocurrió un error al realizar el cobro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCobrar} disabled={loading}>
      {loading ? "Cobrando..." : "Cobrar"}
    </button>
  );
}

export default CobrarButton;
