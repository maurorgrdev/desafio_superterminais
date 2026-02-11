import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EmpresaDetalhes } from './pages/EmpresaDetalhes'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { NovaEmpresa } from './pages/NovaEmpresa'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/nova-empresa" element={<NovaEmpresa />} />
        <Route path="/empresa/:id" element={<EmpresaDetalhes />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
