import React, { useEffect, useState } from "react";
import RegistroParqueoList from "../components/RegistroParqueo/RegistroParqueoList";
import RegistroParqueoForm from "../components/RegistroParqueo/RegistroParqueoForm";
import axiosInstance from "../api/axiosInstance";

function RegistroParqueoPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>Gestión de Parqueo</h1>
      <RegistroParqueoForm fetchRegistros={fetchRegistros} />
      <RegistroParqueoList registros={registros} loading={loading} fetchRegistros={fetchRegistros} />
    </div>
  );
}

export default RegistroParqueoPage;
