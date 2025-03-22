import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import GenerarTicketButton from "../components/GenerarTicketButton";
import axiosInstance from "../api/axiosInstance";
import { BrowserRouter } from "react-router-dom";

vi.stubGlobal("confirm", vi.fn(() => true));

// Mock de axiosInstance con un control de llamadas
let getCallCount = 0;

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(() => {
      getCallCount++;
      console.log(`Interceptando GET (llamada #${getCallCount})`);
      return Promise.resolve({
        data: getCallCount === 1 ? {} : { ticket: { id: 1, url: "/ticket/1" } },
      });
    }),
    patch: vi.fn(() => {
      console.log("Interceptando PATCH");
      return Promise.resolve({
        data: { ticket: { id: 1, url: "/ticket/1" } },
      });
    }),
  },
}));

describe("GenerarTicketButton", () => {
  beforeEach(() => {
    getCallCount = 0; // Reiniciar el contador antes de cada prueba
  });

  test("Muestra 'Generar Ticket' cuando no hay ticket", async () => {
    render(
      <BrowserRouter>
        <GenerarTicketButton registroId={1} onCobrado={vi.fn()} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Generar Ticket/i })
      ).toBeInTheDocument();
    });
  });

  test("Genera un ticket al hacer clic en el botón", async () => {
    render(
      <BrowserRouter>
        <GenerarTicketButton registroId={1} onCobrado={vi.fn()} />
      </BrowserRouter>
    );

    // Esperar a que el botón "Generar Ticket" se muestre
    const button = await screen.findByRole("button", { name: /Generar Ticket/i });

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

    // Esperar a que el botón cambie a "Ver Ticket"
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Ver Ticket/i })
      ).toBeInTheDocument();
    });
  });
});
