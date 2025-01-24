import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroParqueoPage from "./pages/RegistroParqueoPage";
import RegistroParqueoDetallePage from "./pages/RegistroParqueoDetallePage";
import TicketPage from "./pages/TicketPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistroParqueoPage />} />
        <Route path="/registro/:id" element={<RegistroParqueoDetallePage />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
      </Routes>
    </Router>
  );
}

export default App;
