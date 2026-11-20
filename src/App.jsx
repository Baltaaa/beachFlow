import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ReservaPublica from './pages/ReservaPublica'
import MiCuenta from './pages/MiCuenta'
import {
  DetalleReserva,
  TabActividades,
  TabHoy,
  TabPedidos,
  TabReservas,
  TabUnidad,
} from './features/cuenta/pagina/TabsCuenta'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/r/:codigo" element={<ReservaPublica />} />
        <Route path="/mi-cuenta" element={<MiCuenta />}>
          <Route index element={<Navigate to="hoy" replace />} />
          <Route path="hoy" element={<TabHoy />} />
          <Route path="unidad" element={<TabUnidad />} />
          <Route path="reservas" element={<TabReservas />} />
          <Route path="reservas/:codigo" element={<DetalleReserva />} />
          <Route path="pedidos" element={<TabPedidos />} />
          <Route path="actividades" element={<TabActividades />} />
          <Route path="*" element={<Navigate to="/mi-cuenta/hoy" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
