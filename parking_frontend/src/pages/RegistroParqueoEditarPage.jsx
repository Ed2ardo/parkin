import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function RegistroParqueoEditarPage() {
  const { id } = useParams();
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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


  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Editar Registro de Parqueo</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Placa:</label>
          <input
            type="text"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Cliente:</label>
          <input
            type="text"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Tipo de Vehículo:</label>
          <select
            name="tipo_vehiculo"
            value={form.tipo_vehiculo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
            <option value="bicicleta">Bicicleta</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Fecha de Entrada:</label>
          <input
            type="datetime-local"
            name="fecha_entrada"
            value={form.fecha_entrada ? form.fecha_entrada.slice(0, 16) : ""}
            onChange={(e) => setForm({ ...form, fecha_entrada: e.target.value })}
            className="w-full border p-2 rounded"
            disabled={registro.estado === "facturado"}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default RegistroParqueoEditarPage;
