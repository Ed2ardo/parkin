import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

function ConfiguracionGeneralPage() {
  const [empresa, setEmpresa] = useState({
    nombre: "Parqueadero Ejemplo",
    nit: "123456789",
    direccion: "Calle Falsa 123",
    contacto: "info@parqueadero.com",
  });

  const [tarifas, setTarifas] = useState([]); // Inicializamos como un arreglo vacío
  const [espacios, setEspacios] = useState([]); // Igual aquí
  const [loading, setLoading] = useState(true);

  const fetchConfiguracion = async () => {
    try {
      setLoading(true);
      const [tarifasRes, espaciosRes] = await Promise.all([
        axiosInstance.get("tarifas/"),
        axiosInstance.get("core/espacios-parqueo/"),
      ]);
      setTarifas(Array.isArray(tarifasRes.data) ? tarifasRes.data : []); // Validar que sea un arreglo
      setEspacios(Array.isArray(espaciosRes.data) ? espaciosRes.data : []); // Validar que sea un arreglo
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

  const handleGuardarTarifas = async () => {
    try {
      await axiosInstance.put("tarifas/", tarifas);
      console.log(tarifas)
      toast.success("Tarifas actualizadas con éxito");
    } catch (error) {
      console.error("Error al guardar tarifas:", error);
      toast.error("Error al actualizar las tarifas");
    }
  };

  const handleGuardarEspacios = async () => {
    try {
      await axiosInstance.put("core/espacios-parqueo/", espacios);
      console.log(espacios)
      toast.success("Espacios actualizados con éxito");
    } catch (error) {
      console.error("Error al guardar espacios:", error);
      toast.error("Error al actualizar los espacios");
    }
  };

  const handleGuardarEmpresa = () => {
    localStorage.setItem("config_empresa", JSON.stringify(empresa));
    toast.success("Datos de la empresa guardados localmente");
  };

  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div>
      <h1>Configuración General</h1>

      {/* Datos de la empresa */}
      <section>
        <h2>Datos de la Empresa</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={empresa.nombre}
          onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="NIT"
          value={empresa.nit}
          onChange={(e) => setEmpresa({ ...empresa, nit: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={empresa.direccion}
          onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contacto"
          value={empresa.contacto}
          onChange={(e) => setEmpresa({ ...empresa, contacto: e.target.value })}
        />
        <button onClick={handleGuardarEmpresa}>Guardar Empresa</button>
      </section>

      {/* Tarifas */}
      <section>
        <h2>Tarifas</h2>
        {tarifas.map((tarifa, index) => (
          <div key={index}>
            <span>{tarifa.tipo_vehiculo_nombre}: </span>
            <input
              type="number"
              step="0.01" // Permite valores decimales
              value={tarifa.costo_por_minuto !== undefined ? tarifa.costo_por_minuto : ""}
              onChange={(e) => {
                const updatedTarifas = [...tarifas];
                updatedTarifas[index].costo_por_minuto = parseFloat(e.target.value) || 0; // Manejar valores vacíos
                setTarifas(updatedTarifas);
              }}
            />
          </div>
        ))}
        <button onClick={handleGuardarTarifas}>Guardar Tarifas</button>
      </section>

      {/* Espacios Disponibles */}
      <section>
        <h2>Espacios Disponibles</h2>
        {espacios.map((espacio, index) => (
          <div key={index}>
            <span>{espacio.tipo_espacio_nombre}: </span>
            <input
              type="number"
              value={espacio.total_espacios || ""}
              onChange={(e) => {
                const updatedEspacios = [...espacios];
                updatedEspacios[index].total_espacios = parseInt(e.target.value, 10);
                setEspacios(updatedEspacios);
              }}
            />
          </div>
        ))}
        <button onClick={handleGuardarEspacios}>Guardar Espacios</button>
      </section>
    </div>
  );
}

export default ConfiguracionGeneralPage;
