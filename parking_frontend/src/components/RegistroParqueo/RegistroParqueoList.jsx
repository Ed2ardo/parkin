import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import GenerarTicketButton from "../GenerarTicketButton";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function RegistroParqueoList({ registros, loading, fetchRegistros }) {
  const [tickets, setTickets] = useState({}); // Debe ser un objeto, no un array

  useEffect(() => {
    const verificarTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/");
        const ticketMap = response.data.reduce((acc, ticket) => {
          acc[ticket.registro_parqueo] = ticket.id;
          return acc;
        }, {});
        setTickets(ticketMap);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      }
    };

    verificarTickets();
  }, [registros]); // Se actualiza si cambian los registros

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yyyy, hh:mm a") : "Pendiente";

  if (loading) return <p>Cargando registros...</p>;

  return (
    <div>
      <h2>Registros de Parqueo</h2>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Fecha Entrada</th>
            <th>Fecha Salida</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Facturado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>
                <Link to={`/registro/${registro.id}`}>{registro.placa}</Link>
              </td>
              <td>{registro.tipo_nombre}</td>
              <td>{formatearFecha(registro.fecha_entrada)}</td>
              <td>{formatearFecha(registro.fecha_salida)}</td>
              <td>{registro.cliente}</td>
              <td>{registro.estado}</td>
              <td>${registro.total_cobro}</td>
              <td>
                {tickets[registro.id] ? (
                  <Link
                    to={`/tickets/${tickets[registro.id]}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    Ver Ticket
                  </Link>
                ) : (
                  registro.estado === "activo" && (
                    <GenerarTicketButton
                      registroId={registro.id}
                      onCobrado={fetchRegistros}
                    />
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistroParqueoList;
