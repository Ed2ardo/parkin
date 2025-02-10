import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ConfiguracionGeneralPage() {
  const [empresa, setEmpresa] = useState({
    nombre: "Parqueadero Ejemplo",
    nit: "123456789",
    direccion: "Calle Falsa 123",
    contacto: "info@parqueadero.com",
  });

  const [tarifas, setTarifas] = useState([]); // Lista de tarifas
  const [espacios, setEspacios] = useState([]); // Lista de espacios
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Obtener tarifas y espacios desde el backend
  const fetchConfiguracion = async () => {
    try {
      setLoading(true);
      const [tarifasRes, espaciosRes] = await Promise.all([
        axiosInstance.get("tarifas/"),
        axiosInstance.get("core/espacios-parqueo/"),
      ]);
      setTarifas(Array.isArray(tarifasRes.data) ? tarifasRes.data : []);
      setEspacios(Array.isArray(espaciosRes.data) ? espaciosRes.data : []);
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  // Guardar tarifas en el backend
  const handleGuardarTarifas = async () => {
    try {
      await Promise.all(
        tarifas.map((tarifa) =>
          axiosInstance.put(`tarifas/${tarifa.id}/`, {
            costo_por_minuto: tarifa.costo_por_minuto,
          })
        )
      );
      toast.success("Tarifas actualizadas con éxito");
    } catch (error) {
      console.error("Error al guardar tarifas:", error);
      toast.error("Error al actualizar las tarifas");
    }
  };

  // Guardar espacios en el backend
  const handleGuardarEspacios = async () => {
    try {
      await Promise.all(
        espacios.map((espacio) =>
          axiosInstance.put(`core/espacios-parqueo/${espacio.id}/`, {
            tipo_espacio: espacio.tipo_espacio,
            total_espacios: espacio.total_espacios,
          })
        )
      );
      toast.success("Espacios actualizados con éxito");
    } catch (error) {
      console.error("Error al guardar espacios:", error);
      toast.error("Error al actualizar los espacios");
    }
  };

  // Guardar datos de la empresa en el localStorage
  const handleGuardarEmpresa = () => {
    localStorage.setItem("config_empresa", JSON.stringify(empresa));
    toast.success("Datos de la empresa guardados localmente");
  };

  if (loading) return <p className="text-center mt-4">Cargando configuración...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Configuración General</h1>

      {/* Datos de la empresa */}
      <div className="card shadow p-4 mb-4">
        <h2 className="h5 mb-3">Datos de la Empresa</h2>
        <div className="row">
          {["nombre", "nit", "direccion", "contacto"].map((campo, index) => (
            <div key={index} className="col-md-6 mb-3">
              <label className="form-label">{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
              <input
                type="text"
                className="form-control"
                value={empresa[campo]}
                onChange={(e) => setEmpresa({ ...empresa, [campo]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-success" onClick={handleGuardarEmpresa}>
          Guardar Empresa
        </button>
      </div>

      {/* Tarifas */}
      <div className="card shadow p-4 mb-4">
        <h2 className="h5 mb-3">Tarifas</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tipo de Vehículo</th>
              <th>Costo por Minuto</th>
            </tr>
          </thead>
          <tbody>
            {tarifas.map((tarifa, index) => (
              <tr key={index}>
                <td>{tarifa.tipo_vehiculo_nombre}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={tarifa.costo_por_minuto || ""}
                    onChange={(e) => {
                      const updatedTarifas = [...tarifas];
                      updatedTarifas[index].costo_por_minuto = parseFloat(e.target.value) || 0;
                      setTarifas(updatedTarifas);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleGuardarTarifas}>
          Guardar Tarifas
        </button>
      </div>

      {/* Espacios Disponibles */}
      <div className="card shadow p-4 mb-4">
        <h2 className="h5 mb-3">Espacios Disponibles</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tipo de Espacio</th>
              <th>Total de Espacios</th>
            </tr>
          </thead>
          <tbody>
            {espacios.map((espacio, index) => (
              <tr key={index}>
                <td>{espacio.tipo_espacio_nombre}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={espacio.total_espacios || ""}
                    onChange={(e) => {
                      const updatedEspacios = [...espacios];
                      updatedEspacios[index].total_espacios = parseInt(e.target.value, 10) || 0;
                      setEspacios(updatedEspacios);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleGuardarEspacios}>
          Guardar Espacios
        </button>
      </div>

      {/* Botón de regreso */}
      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        Regresar al Inicio
      </button>
    </div>
  );
}

export default ConfiguracionGeneralPage;
