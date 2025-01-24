import React from "react";
import { format } from "date-fns";
import CobrarButton from "./CobrarButton";
import { Link } from "react-router-dom";

function RegistroParqueoList({ registros, loading, fetchRegistros }) {
  if (loading) return <p>Cargando registros...</p>;

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  const registrosActivos = registros.filter((registro) => !registro.fecha_salida) // Listar solo los registros activos

  return (
    <div>
      <h2>Registros de Parqueo</h2>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Fecha Entrada</th>
            <th>Cliente</th>
            <th>Salida</th>
          </tr>
        </thead>
        <tbody>
          {registrosActivos.map((registro) => (
            <tr key={registro.id}>
              <td>
                {/* Enlace a la página de detalles */}
                <Link to={`/registro/${registro.id}`}>{registro.placa}</Link>
              </td>
              <td>{registro.tipo_nombre}</td>
              <td>{formatearFecha(registro.fecha_entrada)}</td>
              <td>{registro.cliente}</td>
              <td>
                {/* Botón de cobrar */}
                {registro.estado !== "facturado" && (
                  <CobrarButton
                    registroId={registro.id}
                    onCobrado={fetchRegistros} // Refresca la lista después de cobrar
                  />
                )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

export default RegistroParqueoList;
