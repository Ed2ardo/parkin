import React from "react";
import { format } from "date-fns";
import CobrarButton from "./CobrarButton";
import { Link } from "react-router-dom";

function RegistroParqueoList({ registros, loading, fetchRegistros }) {
  if (loading) return <p>Cargando registros...</p>;

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

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
                {/* Enlace a la página de detalles */}
                <Link to={`/registro/${registro.id}`}>{registro.placa}</Link>
              </td>
              <td>{registro.tipo_nombre}</td>
              <td>{formatearFecha(registro.fecha_entrada)}</td>
              <td>{formatearFecha(registro.fecha_salida)}</td>
              <td>{registro.cliente}</td>
              <td>{registro.estado}</td>
              <td>${registro.total_cobro}</td>
              <td>
                {/* Botón de cobrar */}
                {registro.estado === "activo" && (
                  <CobrarButton
                    registroId={registro.id}
                    onCobrado={fetchRegistros} // Refresca la lista después de cobrar
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

export default RegistroParqueoList;
