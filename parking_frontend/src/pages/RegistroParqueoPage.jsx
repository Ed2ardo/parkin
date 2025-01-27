import React, { useEffect, useState } from "react";
import RegistroParqueoList from "../components/RegistroParqueo/RegistroParqueoList";
import RegistroParqueoForm from "../components/RegistroParqueo/RegistroParqueoForm";
import axiosInstance from "../api/axiosInstance";

function RegistroParqueoPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarActivos, setMostrarActivos] = useState(true) //Alternar entre activos e historicos
  const [searchQuery, setSearchQuery] = useState("");


  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("parqueo/registro-parqueo/");
      setRegistros(response.data);
    } catch (error) {
      console.error("Error al obtener los registros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);



  const registrosFiltrados = (
    mostrarActivos
      ? registros.filter((registro) => registro.estado === "activo") // Activos
      : registros.filter(
        (registro) => registro.estado === "facturado" || registro.estado === "baja"
      ) // Históricos
  ).filter(
    // Filtro adicional para buscar por placa, fecha o cliente
    (registro) =>
      registro.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (registro.fecha_entrada &&
        new Date(registro.fecha_entrada)
          .toLocaleDateString("es-ES")
          .includes(searchQuery)) ||
      (registro.cliente &&
        registro.cliente.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <h1>Gestión de Parqueo</h1>

      {/* Botones para alternar entre activos e históricos */}
      <button onClick={() => setMostrarActivos(true)}>Registros Activos</button>
      <button onClick={() => setMostrarActivos(false)}>Histórico</button>

      {/* Campo de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar por placa, fecha o cliente"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Mostrar formulario solo en registros activos */}
      {mostrarActivos && (
        <div>
          <RegistroParqueoForm fetchRegistros={fetchRegistros} />
        </div>
      )}

      {/* Lista de registros */}
      <RegistroParqueoList
        registros={registrosFiltrados}
        loading={loading}
        fetchRegistros={fetchRegistros}
      />
    </div>
  );
}

export default RegistroParqueoPage;
