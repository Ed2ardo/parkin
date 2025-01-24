import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

function RegistroParqueoForm({ fetchRegistros }) {
  const [formData, setFormData] = useState({
    placa: "",
    tipo: "",
    cliente: "",
  });
  const [loading, setLoading] = useState(false);
  const [tiposVehiculo, setTiposVehiculo] = useState([]); // estado para los tipos de vehículo


  const fetchTiposVehiculo = async () => {
    try {
      const response = await axiosInstance.get("core/tipos-vehiculos/");
      setTiposVehiculo(response.data);
    } catch (error) {
      console.error("Error al obtener tipos de vehículo:", error);
      setError("Error al cargar los tipos de vehiculos")
    }
  }


  useEffect(() => {
    fetchTiposVehiculo();
  }, []);

  //Actualiza el estado formData mientras el usuario escribe en los campos del formulario.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    /*e.target.name: Corresponde al atributo name del campo que cambió.
      e.target.value: El nuevo valor del campo.
      setFormData({ ...formData, [e.target.name]: e.target.value }):
        Copia el estado actual de formData usando el operador de propagación (...formData).
        Actualiza solo la propiedad específica ([e.target.name]) con el nuevo valor (e.target.value). */
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene que la página se recargue al enviar el formulario.
    setLoading(true); // Activa el indicador de carga.
    try {
      await axiosInstance.post("parqueo/registro-parqueo/", formData);
      fetchRegistros();  // Recarga la lista de registros llamando a la función pasada como prop.
      setFormData({ placa: "", tipo: "", cliente: "" }); // Limpiar formulario
    } catch (error) {
      console.log(formData)
      console.error("Error al crear el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Placa:
        <input
          type="text"
          name="placa"
          value={formData.placa}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="tipo"> {/* Cambiado el htmlFor */}
        Tipo de Vehículo:
        <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required> {/* Cambiado el name y añadido value */}
          <option value="">Selecciona un tipo</option>
          {tiposVehiculo.map((tipo) => (
            <option key={tipo.id} value={tipo.id}> {/* El value es el ID */}
              {tipo.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Cliente:
        <input
          type="text"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form >
  );
}

export default RegistroParqueoForm;
