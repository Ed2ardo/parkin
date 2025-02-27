import axiosInstance from "../api/axiosInstance";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistroParqueoForm from "../components/RegistroParqueo/RegistroParqueoForm";

// Mock de axiosInstance
vi.mock("../api/axiosInstance", () => ({
  default: {
    post: vi.fn(() =>
      Promise.resolve({
        data: { id: 1, placa: "ABC123", tipo: "1", cliente: "Juan Pérez", estado: "activo" }, // Respuesta simulada
      })
    ),
    get: vi.fn(() =>
      Promise.resolve({
        data: [{ id: "1", nombre: "Motocicleta" }], // Simulamos una opción válida en el select
      })
    ),
  },
}));

describe("RegistroParqueoForm", () => {
  test("Permite ingresar una placa y enviar el formulario", async () => {
    const fetchRegistrosMock = vi.fn();

    render(<RegistroParqueoForm fetchRegistros={fetchRegistrosMock} />);

    // Esperamos que los tipos de vehículo se carguen antes de continuar
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("core/tipos-vehiculos/");
    });

    const inputPlaca = screen.getByLabelText(/placa/i);
    const inputCliente = screen.getByLabelText(/cliente/i);
    const selectTipo = screen.getByLabelText(/tipo de vehículo/i);
    const submitButton = screen.getByRole("button", { name: /registrar/i });

    // Simular ingreso de datos
    fireEvent.change(inputPlaca, { target: { value: "ABC123" } });
    fireEvent.change(inputCliente, { target: { value: "Juan Pérez" } });
    fireEvent.change(selectTipo, { target: { value: "1" } }); // Seleccionamos el tipo de vehículo

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("parqueo/registro-parqueo/", {
        placa: "ABC123",
        tipo: expect.any(String), // Aceptamos que `tipo` puede ser un string
        cliente: "Juan Pérez",
      });
    });

    await waitFor(() => {
      expect(fetchRegistrosMock).toHaveBeenCalled(); // Verificamos que se llame al callback
    });
  });
});
