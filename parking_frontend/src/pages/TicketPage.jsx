import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";

function TicketPage() {
  const { id } = useParams(); // Obtiene el ID desde la URL
  const navigate = useNavigate();
  const [data, setData] = useState(null); // Puede ser un registro o un ticket
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/tickets/${id}/`);
        setData(response.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudo cargar la información del ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  if (loading) return <p>Cargando detalles del ticket...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Ticket #{data.numero_ticket}</h1>
      <p><strong>Placa:</strong> {data.placa}</p>
      <p><strong>Tipo de Vehículo:</strong> {data.tipo_vehiculo}</p>
      <p><strong>Fecha de Entrada:</strong> {formatearFecha(data.fecha_entrada)}</p>
      <p><strong>Fecha de Salida:</strong> {formatearFecha(data.fecha_salida)}</p>
      <p><strong>Total Cobrado:</strong> ${data.total}</p>
      <p><strong>Estado:</strong> {data.estado}</p>
      <p><strong>Notas Legales:</strong> {data.notas_legales || "No disponibles"}</p>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => window.print()}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Imprimir Ticket
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Regresar al Inicio
        </button>
      </div>
    </div>
  );
}

export default TicketPage;
