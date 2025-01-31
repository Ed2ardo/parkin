import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroParqueoPage from "./pages/RegistroParqueoPage";
import RegistroParqueoDetallePage from "./pages/RegistroParqueoDetallePage";
import TicketPage from "./pages/TicketPage"
import Navbar from "./components/Navbar";
import ConfiguracionGeneralPage from "./pages/ConfiguraciónGeneralPage";
import RegistroParqueoEditarPage from "./pages/RegistroParqueoEditarPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RegistroParqueoPage />} />
            <Route path="/registro/:id" element={<RegistroParqueoDetallePage />} />
            <Route path="/tickets/:id" element={<TicketPage />} />
            <Route path="/config" element={<ConfiguracionGeneralPage />} />
            <Route path="/registro/:id/editar" element={<RegistroParqueoEditarPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
