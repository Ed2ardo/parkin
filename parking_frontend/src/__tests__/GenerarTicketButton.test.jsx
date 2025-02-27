import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import GenerarTicketButton from "../components/GenerarTicketButton";
import axiosInstance from "../api/axiosInstance";
import { BrowserRouter } from "react-router-dom";

vi.stubGlobal("confirm", vi.fn(() => true));

// Mock de axiosInstance
vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: { ticket: { id: 1, url: "/ticket/1" } }, // Simulamos una respuesta exitosa
      })
    ),
    patch: vi.fn(() =>
      Promise.resolve({
        data: { estado: "facturado", generar_ticket: true },
      })
    ),
  },
}));

describe("GenerarTicketButton", () => {
  test("Muestra 'Generar Ticket' cuando no hay ticket", async () => {
    render(
      <BrowserRouter>
        <GenerarTicketButton registroId={1} onCobrado={vi.fn()} />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /Generar Ticket/i })
    ).toBeInTheDocument();
  });

  test("Genera un ticket al hacer clic en el botón", async () => {
    render(
      <BrowserRouter>
        <GenerarTicketButton registroId={1} onCobrado={vi.fn()} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Generar Ticket/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/parqueo/registro-parqueo/1/",
        {
          estado: "facturado",
          generar_ticket: true,
        }
      );
    });

    // Validamos que el botón "Ver Ticket" aparezca
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Ver Ticket/i }) // Quitamos las comillas de más
      ).toBeInTheDocument();
    });
  });
});




