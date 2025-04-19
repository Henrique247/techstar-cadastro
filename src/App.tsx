
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Eventos from "./pages/Eventos";
import Recursos from "./pages/Recursos";
import Membros from "./pages/Membros";
import Calendario from "./pages/Calendario";
import Presencas from "./pages/Presencas";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="eventos" element={<Eventos />} />
            <Route path="recursos" element={<Recursos />} />
            <Route path="membros" element={<Membros />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="presencas" element={<Presencas />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" closeButton richColors />
    </QueryClientProvider>
  );
}

export default App;
