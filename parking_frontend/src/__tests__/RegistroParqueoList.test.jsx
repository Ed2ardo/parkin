import React from "react";
import { render, screen } from "@testing-library/react";
import RegistroParqueoList from "../components/RegistroParqueo/RegistroParqueoList";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest"; // Si usas Vitest en lugar de Jest

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            id: 1,
            placa: "ABC123",
            tipo_nombre: "Motocicleta",
            fecha_entrada: "2025-02-27T14:00:00Z",
            fecha_salida: null,
            cliente: "Juan Pérez",
            estado: "activo",
            total_cobro: "5000",
            ticket: null,
          },
        ],
      })
    ),
  },
}));

describe("RegistroParqueoList", () => {
  test("muestra el mensaje de carga cuando loading es true", () => {
    render(
      <RegistroParqueoList registros={[]} loading={true} fetchRegistros={vi.fn()} />
    );

    expect(screen.getByText(/cargando registros.../i)).toBeInTheDocument();
  });

  test("muestra los registros correctamente cuando loading es false", () => {
    const registrosMock = [
      {
        id: 1,
        placa: "ABC123",
        tipo_nombre: "Motocicleta",
        fecha_entrada: "2025-02-27T14:00:00Z",
        fecha_salida: null,
        cliente: "Juan Pérez",
        estado: "activo",
        total_cobro: "5000",
        ticket: null,
      },
    ];

    render(
      <MemoryRouter>
        <RegistroParqueoList registros={registrosMock} loading={false} fetchRegistros={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Motocicleta")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("$5000")).toBeInTheDocument();
    expect(screen.getByText(/activo/i)).toBeInTheDocument();
  });
});
