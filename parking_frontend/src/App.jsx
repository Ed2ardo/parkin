import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroParqueoPage from "./pages/RegistroParqueoPage";
import RegistroParqueoDetallePage from "./pages/RegistroParqueoDetallePage";
import TicketPage from "./pages/TicketPage";
import Navbar from "./components/Navbar";
import ConfiguracionGeneralPage from "./pages/ConfiguraciónGeneralPage";
import RegistroParqueoEditarPage from "./pages/RegistroParqueoEditarPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RegistroParqueoPage />} />
        <Route path="/registro/:id" element={<RegistroParqueoDetallePage />} />
        <Route path="/tickets/:id" element={<TicketPage />} />
        <Route path="/config" element={<ConfiguracionGeneralPage />} />
        <Route path="/registro/:id/editar" element={<RegistroParqueoEditarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
