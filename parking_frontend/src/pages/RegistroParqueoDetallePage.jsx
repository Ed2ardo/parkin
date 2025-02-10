import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import GenerarTicketButton from "../components/GenerarTicketButton";
import EliminarButton from "../components/EliminarButton";
import { format } from "date-fns";

function RegistroParqueoDetallePage() {
  const { id } = useParams(); // Obtiene el ID del registro desde la URL
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los detalles del registro
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

  // Formatear fechas para visualización
  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  useEffect(() => {
    fetchRegistro();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando detalles...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="h4 text-primary mb-3">Detalles del Registro</h1>

        {registro && (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Placa</th>
                  <td>{registro.placa}</td>
                </tr>
                <tr>
                  <th>Tipo</th>
                  <td>{registro.tipo_nombre}</td>
                </tr>
                <tr>
                  <th>Cliente</th>
                  <td>{registro.cliente || "No registrado"}</td>
                </tr>
                <tr>
                  <th>Fecha de Entrada</th>
                  <td>{formatearFecha(registro.fecha_entrada)}</td>
                </tr>
                <tr>
                  <th>Fecha de Salida</th>
                  <td>{formatearFecha(registro.fecha_salida)}</td>
                </tr>
                <tr>
                  <th>Estado</th>
                  <td>
                    <span className={`badge bg-${registro.estado === "activo" ? "success" : "secondary"}`}>
                      {registro.estado}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Total Cobrado</th>
                  <td>${registro.total_cobro}</td>
                </tr>
              </tbody>
            </table>

            {/* Botones de acciones */}
            <div className="d-flex justify-content-between mt-3">
              <div>
                {registro.estado === "activo" && (
                  <GenerarTicketButton
                    registroId={registro.id}
                    onCobrado={fetchRegistro} // Refresca los datos tras generar el ticket
                  />
                )}
                <button
                  onClick={() => navigate(`/registro/${registro.id}/editar`)}
                  className="btn btn-warning ms-2"
                  disabled={registro.estado === "facturado"} // Deshabilitar si ya está facturado
                >
                  Editar
                </button>
                <EliminarButton registroId={registro.id} onEliminado={() => navigate("/")} />
              </div>
              <button onClick={() => navigate("/")} className="btn btn-secondary">
                Regresar al Inicio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegistroParqueoDetallePage;
