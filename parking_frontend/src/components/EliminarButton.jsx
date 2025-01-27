import React from "react";
import axiosInstance from "../api/axiosInstance";

function EliminarButton({ registroId, onEliminado }) {
  const handleEliminar = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas marcar este registro como eliminado?"
    );
    if (!confirmacion) return;

    try {
      await axiosInstance.delete(`parqueo/registro-parqueo/${registroId}/`);
      alert("El registro ha sido marcado como eliminado.");
      if (onEliminado) onEliminado(); // Refresca la lista o los datos
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      alert("No se pudo marcar el registro como eliminado.");
    }
  };

  return (
    <button onClick={handleEliminar} className="btn-eliminar">
      Eliminar
    </button>
  );
}

export default EliminarButton;
