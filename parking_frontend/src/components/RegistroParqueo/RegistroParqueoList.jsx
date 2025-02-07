import React from "react";
import { format } from "date-fns";
import GenerarTicketButton from "../GenerarTicketButton";
import { Link } from "react-router-dom";

function RegistroParqueoList({ registros, loading, fetchRegistros }) {
  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yyyy, hh:mm a") : "Pendiente";

  if (loading) return <p className="text-center text-primary">Cargando registros...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Registros de Parqueo</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
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
                  <Link to={`/registro/${registro.id}`} className="text-decoration-none">
                    {registro.placa}
                  </Link>
                </td>
                <td>{registro.tipo_nombre}</td>
                <td>{formatearFecha(registro.fecha_entrada)}</td>
                <td>{formatearFecha(registro.fecha_salida)}</td>
                <td>{registro.cliente || "N/A"}</td>
                <td>
                  <span className={`badge ${registro.estado === "activo" ? "bg-success" : "bg-secondary"}`}>
                    {registro.estado}
                  </span>
                </td>
                <td>${registro.total_cobro}</td>
                <td>
                  {registro.ticket ? (
                    <Link to={`/tickets/${registro.ticket}`} className="btn btn-primary btn-sm">
                      Ver Ticket
                    </Link>
                  ) : (
                    registro.estado === "activo" && (
                      <GenerarTicketButton registroId={registro.id} onCobrado={fetchRegistros} />
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegistroParqueoList;
