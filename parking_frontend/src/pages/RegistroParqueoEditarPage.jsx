import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function RegistroParqueoEditarPage() {
  const { id } = useParams(); // Obtiene el ID del registro desde la URL
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [form, setForm] = useState({
    placa: "",
    cliente: "",
    tipo_vehiculo: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const response = await axiosInstance.get(`/parqueo/registro-parqueo/${id}/`);
        setRegistro(response.data);

        // Establecer valores iniciales del formulario con los datos del registro
        setForm({
          placa: response.data.placa,
          cliente: response.data.cliente || "",
          tipo_vehiculo: response.data.tipo_vehiculo,
          fecha_entrada: response.data.fecha_entrada,
        });
      } catch (err) {
        setError("No se pudo cargar el registro.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistro();
  }, [id]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envía el formulario con los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/parqueo/registro-parqueo/${id}/`, {
        ...form,
        fecha_entrada: form.fecha_entrada ? new Date(form.fecha_entrada).toISOString() : null, // Convertir a formato ISO
      });
      alert("Registro actualizado con éxito");
      navigate(`/registro/${id}`);
    } catch (err) {
      setError("Error al actualizar el registro.");
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="h4 mb-3 text-primary">Editar Registro de Parqueo</h1>

        <form onSubmit={handleSubmit}>
          {/* Campo para la placa del vehículo */}
          <div className="mb-3">
            <label className="form-label">Placa:</label>
            <input
              type="text"
              name="placa"
              value={form.placa}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Campo para el nombre del cliente */}
          <div className="mb-3">
            <label className="form-label">Cliente:</label>
            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Selección del tipo de vehículo */}
          <div className="mb-3">
            <label className="form-label">Tipo de Vehículo:</label>
            <select
              name="tipo_vehiculo"
              value={form.tipo_vehiculo}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="bicicleta">Bicicleta</option>
            </select>
          </div>

          {/* Campo para la fecha de entrada */}
          <div className="mb-3">
            <label className="form-label">Fecha de Entrada:</label>
            <input
              type="datetime-local"
              name="fecha_entrada"
              value={form.fecha_entrada ? form.fecha_entrada.slice(0, 16) : ""}
              onChange={(e) => setForm({ ...form, fecha_entrada: e.target.value })}
              className="form-control"
              disabled={registro.estado === "facturado"} // Deshabilitar si ya está facturado
            />
          </div>

          {/* Botón para guardar cambios */}
          <button type="submit" className="btn btn-primary w-100">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroParqueoEditarPage;
