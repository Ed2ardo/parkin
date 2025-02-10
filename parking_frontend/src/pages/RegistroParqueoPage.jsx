import React, { useEffect, useState } from "react";
import RegistroParqueoList from "../components/RegistroParqueo/RegistroParqueoList";
import RegistroParqueoForm from "../components/RegistroParqueo/RegistroParqueoForm";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";

function RegistroParqueoPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarActivos, setMostrarActivos] = useState(true);
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

  const registrosFiltrados = registros
    .filter((registro) =>
      mostrarActivos
        ? registro.estado === "activo"
        : ["facturado", "baja"].includes(registro.estado)
    )
    .filter(
      (registro) =>
        registro.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (registro.fecha_entrada &&
          format(new Date(registro.fecha_entrada), "dd/MM/yyyy").includes(
            searchQuery
          )) ||
        (registro.cliente &&
          registro.cliente.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Gestión de Parqueo</h1>

      {/* Botones de filtro */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-center">
          <Button
            variant={mostrarActivos ? "primary" : "outline-primary"}
            onClick={() => setMostrarActivos(true)}
            className="me-2"
          >
            Registros Activos
          </Button>
          <Button
            variant={!mostrarActivos ? "primary" : "outline-primary"}
            onClick={() => setMostrarActivos(false)}
          >
            Histórico
          </Button>
        </Col>
      </Row>

      {/* Campo de búsqueda */}
      <Row className="mb-3">
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Control
            type="text"
            placeholder="Buscar por placa, fecha o cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

      {/* Formulario de registro (solo si está en "Activos") */}
      {mostrarActivos && (
        <Row className="mb-4">
          <Col>
            <RegistroParqueoForm fetchRegistros={fetchRegistros} />
          </Col>
        </Row>
      )}

      {/* Lista de registros */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando registros...</p>
            </div>
          ) : (
            <RegistroParqueoList
              registros={registrosFiltrados}
              loading={loading}
              fetchRegistros={fetchRegistros}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RegistroParqueoPage;
