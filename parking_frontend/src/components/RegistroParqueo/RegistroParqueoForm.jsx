import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

function RegistroParqueoForm({ fetchRegistros }) {
  const [formData, setFormData] = useState({
    placa: "",
    tipo: "",
    cliente: "",
  });
  const [loading, setLoading] = useState(false);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      try {
        const response = await axiosInstance.get("core/tipos-vehiculos/");
        setTiposVehiculo(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de vehículo:", error);
        setError("Error al cargar los tipos de vehículos");
      }
    };
    fetchTiposVehiculo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("parqueo/registro-parqueo/", formData);
      fetchRegistros();
      setFormData({ placa: "", tipo: "", cliente: "" });
    } catch (error) {
      console.log(formData);
      console.error("Error al crear el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Registrar Nuevo Vehículo</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-light">
        <div className="mb-3">
          <label className="form-label">Placa:</label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Vehículo:</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona un tipo</option>
            {tiposVehiculo.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cliente:</label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Guardando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default RegistroParqueoForm;
