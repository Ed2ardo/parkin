import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

function TicketPage() {
  const { id } = useParams(); // Obtiene el ID del ticket desde la URL
  const navigate = useNavigate();
  const [data, setData] = useState(null); // Contendrá la información del ticket
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/tickets/${id}/`);
        setData(response.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudo cargar la información del ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatearFecha = (fecha) =>
    fecha ? format(new Date(fecha), "dd/MM/yy, hh:mm a") : "Pendiente";

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando detalles del ticket...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card className="shadow-lg p-4" style={{ width: "28rem" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Ticket #{data.numero_ticket}</h2>
          </Card.Title>
          <Card.Text>
            <strong>Placa:</strong> {data.placa} <br />
            <strong>Tipo de Vehículo:</strong> {data.tipo_vehiculo} <br />
            <strong>Fecha de Entrada:</strong> {formatearFecha(data.fecha_entrada)} <br />
            <strong>Fecha de Salida:</strong> {formatearFecha(data.fecha_salida)} <br />
            <strong>Total Cobrado:</strong> ${data.total} <br />
            <strong>Estado:</strong> {data.estado} <br />
            <strong>Notas Legales:</strong> {data.notas_legales || "No disponibles"}
          </Card.Text>
          <div className="d-flex justify-content-between mt-4">
            <Button variant="success" onClick={() => window.print()}>
              Imprimir Ticket
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Regresar al Inicio
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TicketPage;
