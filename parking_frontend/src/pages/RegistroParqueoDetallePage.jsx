import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CobrarButton from "../components/RegistroParqueo/CobrarButton";
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

  const handleEliminar = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;

    try {
      await axiosInstance.delete(`parqueo/registro-parqueo/${id}/`);
      alert("Registro eliminado.");
      navigate("/parqueo"); // Redirigir al listado
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
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
          {/* <p>Fecha Salida: {!registro.fecha_salida }</p> */}
          <p>Estado: {registro.estado}</p>
          <CobrarButton registroId={registro.id} onCobrado={fetchRegistro} />
          <button onClick={handleEliminar}>Eliminar</button>
        </div>
      )}
    </div>
  );
}

export default RegistroParqueoDetallePage;
