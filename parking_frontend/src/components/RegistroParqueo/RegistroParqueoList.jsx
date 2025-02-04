import React from "react";
import { format } from "date-fns";
import GenerarTicketButton from "../GenerarTicketButton";
import { Link } from "react-router-dom";

function RegistroParqueoList({ registros, loading, fetchRegistros }) {
  // Formatear fecha para mostrarla correctamente
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
              <td>{registro.cliente || "N/A"}</td>
              <td>{registro.estado}</td>
              <td>${registro.total_cobro}</td>
              <td>
                {registro.ticket ? (
                  <Link
                    to={`/tickets/${registro.ticket}`}
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
