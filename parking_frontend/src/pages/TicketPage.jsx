import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function TicketPage() {
  const { id } = useParams(); // Obtiene el ID del registro desde la URL
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const response = await axiosInstance.get(`parqueo/registro-parqueo/${id}/`);
        setRegistro(response.data);
      } catch (error) {
        console.error("Error al obtener el registro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistro();
  }, [id]);

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  if (loading) return <p>Cargando detalles del ticket...</p>;
  if (!registro) return <p>No se encontró el registro.</p>;

  return (
    <div>
      <h1>Ticket de Facturación</h1>
      <p><strong>Placa:</strong> {registro.placa}</p>
      <p><strong>Tipo de Vehículo:</strong> {registro.tipo_nombre}</p>
      <p><strong>Cliente:</strong> {registro.cliente || "N/A"}</p>
      <p><strong>Fecha de Entrada:</strong> {formatearFecha(registro.fecha_entrada)}</p>
      <p><strong>Fecha de Salida:</strong> {registro.fecha_salida || "N/A"}</p>
      <p><strong>Total Cobrado:</strong> ${registro.total_cobro}</p>
      <p><strong>Estado:</strong> {registro.estado}</p>
      <p><Link to={`/`}>Inicio</Link></p>
    </div>
  );
}

export default TicketPage;
