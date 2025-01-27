import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CobrarButton from "../components/RegistroParqueo/CobrarButton";
import EliminarButton from "../components/EliminarButton";
import { format } from "date-fns";

function RegistroParqueoDetallePage() {
  const { id } = useParams(); // Obtiene el ID del registro desde la URL
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegistro = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`parqueo/registro-parqueo/${id}/`);
      setRegistro(response.data);
    } catch (error) {
      console.error("Error al obtener el registro:", error);
      alert("No se pudo cargar el registro.");
      navigate("/"); // Redirigir al listado si hay un error
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  useEffect(() => {
    fetchRegistro();
  }, []);

  if (loading) return <p>Cargando detalles...</p>;

  return (
    <div>
      <h1>Detalles del Registro</h1>
      {registro && (
        <div>
          <p>Placa: {registro.placa}</p>
          <p>Tipo: {registro.tipo_nombre}</p>
          <p>Cliente: {registro.cliente}</p>
          <p>Fecha de Entrada: {formatearFecha(registro.fecha_entrada)}</p>
          <p>Fecha Salida: {formatearFecha(registro.fecha_salida)}</p>
          <p>Estado: {registro.estado}</p>
          {registro.estado === "activo" && (
            <CobrarButton
              registroId={registro.id}
              onCobrado={registros} // Refresca la lista después de cobrar
            />
          )}
          {/* <CobrarButton registroId={registro.id} onCobrado={fetchRegistro} /> */}
          <EliminarButton registroId={registro.id} onEliminado={() => navigate("/")} />
        </div>
      )}
    </div>
  );
}

export default RegistroParqueoDetallePage;
