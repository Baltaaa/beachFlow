import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { 
  LogOut, Settings, Printer, X, User, Phone, Mail, 
  Calendar, FileText, Save, Trash2, Search, Umbrella, 
  Home, Plus, Check, Menu, ChevronRight, List, Map, 
  DollarSign, MessageSquare, CheckSquare, Square, AlertCircle
} from "lucide-react"

// Estados posibles de reserva
const STATUS = {
  LIBRE: "libre",
  TEMPORADA: "temporada",
  PERIODO: "periodo"
}

// Modal de edición de unidad
function UnitModal({ unit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: unit?.status || STATUS.LIBRE,
    clientName: unit?.clientName || "",
    clientPhone: unit?.clientPhone || "",
    clientEmail: unit?.clientEmail || "",
    startDate: unit?.startDate || "",
    endDate: unit?.endDate || "",
    notes: unit?.notes || "",
    isPaid: unit?.isPaid ?? false,
    isTemporada: unit?.isTemporada ?? false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStatus = formData.isTemporada 
      ? STATUS.TEMPORADA 
      : (formData.startDate ? STATUS.PERIODO : STATUS.LIBRE)
    
    onSave({ 
      ...unit, 
      ...formData, 
      status: newStatus 
    })
  }

  const handleClear = () => {
    const cleared = {
      status: STATUS.LIBRE,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      startDate: "",
      endDate: "",
      notes: "",
      isPaid: false,
      isTemporada: false
    }
    setFormData(cleared)
    onSave({ ...unit, ...cleared })
  }

  const handleWhatsAppShare = () => {
    const text = `Hola ${formData.clientName || "Cliente"}, te confirmamos tu reserva en Prius Playa Grande:\n\n` +
      `📍 Unidad: ${unit?.type === "sombrilla" ? "Sombrilla" : "Carpa"} #${unit?.number}\n` +
      `📅 Tipo: ${formData.isTemporada ? "Temporada Completa" : `Desde ${formData.startDate} hasta ${formData.endDate}`}\n` +
      `💳 Estado de Pago: ${formData.isPaid ? "PAGADO" : "PENDIENTE"}\n\n` +
      `¡Te esperamos para disfrutar de la mejor experiencia de costa! 🌊☀️`
    
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/${formData.clientPhone.replace(/\D/g, "")}?text=${encodedText}`, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-prius-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-hairline bg-prius-black">
          <div className="text-white">
            <h2 className="text-lg font-normal flex items-center gap-2 uppercase tracking-tight">
              {unit?.type === "sombrilla" ? <Umbrella className="w-5 h-5 text-gold" /> : <Home className="w-5 h-5 text-gold" />}
              {unit?.type === "sombrilla" ? "Sombrilla" : "Carpa"} #{unit?.number}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Nombre del Cliente</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value.toUpperCase() }))}
              className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
              placeholder="NOMBRE COMPLETO"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
                placeholder="+54 9..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
                placeholder="ejemplo@mail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-prius-background border border-hairline rounded-sm">
              <input
                type="checkbox"
                id="isTemporada"
                checked={formData.isTemporada}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isTemporada: e.target.checked,
                  startDate: e.target.checked ? "" : prev.startDate,
                  endDate: e.target.checked ? "" : prev.endDate
                }))}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
              <label htmlFor="isTemporada" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none">
                Temporada (T)
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-prius-background border border-hairline rounded-sm">
              <input
                type="checkbox"
                id="isPaid"
                checked={formData.isPaid}
                onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
              <label htmlFor="isPaid" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-green-600" /> Pagado
              </label>
            </div>
          </div>

          {!formData.isTemporada && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Desde</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Hasta</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Notas / Observaciones</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none resize-none text-sm"
              placeholder="Detalles adicionales..."
            />
          </div>

          {formData.clientName && formData.clientPhone && (
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Enviar Confirmación WhatsApp
            </button>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 border border-hairline hover:bg-red-50 hover:text-red-600 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              Liberar Unidad
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gold hover:bg-gold-hover text-prius-black rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Panel de Configuración
function SettingsPanel({ user, onClose, onLogout }) {
  return (
    <div className="fixed inset-0 bg-prius-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md border border-hairline shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <h2 className="text-lg font-normal uppercase tracking-tight">Configuración</h2>
          <button onClick={onClose} className="p-2 hover:bg-prius-background rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-prius-background border border-hairline rounded-sm">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
              <User className="w-5 h-5 text-prius-black" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">Usuario Administrador</p>
              <p className="text-sm text-prius-black/60">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-4 bg-prius-black text-white rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-prius-black/90 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

// Celda del Mapa de Playa con Tooltip Integrado
function Cell({ number, unit, onClick, isHighlighted, isDimmed }) {
  const status = unit?.status || STATUS.LIBRE
  const isTemporada = status === STATUS.TEMPORADA
  const isPeriodo = status === STATUS.PERIODO
  const [showTooltip, setShowTooltip] = useState(false)
  
  const getBgColor = () => {
    if (isTemporada) return "bg-prius-black text-white"
    if (isPeriodo) return "bg-gold text-prius-black"
    return "bg-white text-prius-black/20"
  }

  const opacityClass = isDimmed ? "opacity-20" : "opacity-100"
  const highlightClass = isHighlighted ? "ring-2 ring-offset-1 ring-gold scale-105 z-10" : ""
  
  return (
    <div 
      className="flex items-center relative"
      onMouseEnter={() => unit?.clientName && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="w-6 md:w-8 text-[9px] font-bold text-prius-black/40 text-right pr-1">{number}</span>
      <button
        onClick={() => onClick(unit)}
        className={`w-7 h-6 md:w-9 md:h-7 text-[9px] font-bold flex flex-col items-center justify-center border border-hairline cursor-pointer hover:border-gold transition-all relative ${getBgColor()} ${opacityClass} ${highlightClass}`}
      >
        <span className="leading-none">
          {isTemporada && "T"}
          {isPeriodo && "P"}
        </span>
        {unit?.isPaid && (status === STATUS.TEMPORADA || status === STATUS.PERIODO) && (
          <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-green-500" />
        )}
        {!unit?.isPaid && (status === STATUS.TEMPORADA || status === STATUS.PERIODO) && (
          <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-red-500" />
        )}
      </button>

      {/* Tooltip Flotante */}
      {showTooltip && unit?.clientName && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-prius-black text-white text-[10px] p-3 rounded-sm shadow-lg z-50 pointer-events-none border border-hairline">
          <p className="font-bold uppercase tracking-wider text-gold mb-1">{unit.clientName}</p>
          {unit.isTemporada ? (
            <p className="opacity-80">Temporada Completa</p>
          ) : (
            <p className="opacity-80">{unit.startDate} al {unit.endDate}</p>
          )}
          {unit.notes && <p className="mt-1 border-t border-white/10 pt-1 italic opacity-60 truncate">{unit.notes}</p>}
          <p className={`mt-1 font-bold ${unit.isPaid ? 'text-green-400' : 'text-red-400'}`}>
            {unit.isPaid ? "PAGADO" : "PAGO PENDIENTE"}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [units, setUnits] = useState({})
  const [viewMode, setViewMode] = useState("map") // "map" o "list"
  
  // Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // "all", "libre", "temporada", "periodo"
  const [paymentFilter, setPaymentFilter] = useState("all") // "all", "paid", "unpaid"
  const [typeFilter, setTypeFilter] = useState("all") // "all", "carpa", "sombrilla"

  // Tareas del Día (To-Do List)
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("prius_todos")
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Revisar carpa #12 (mantenimiento lona)", completed: false },
      { id: 2, text: "Cobrar saldo pendiente sombrilla #5", completed: false }
    ]
  })
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    checkUser()
    initializeUnits()
  }, [])

  useEffect(() => {
    localStorage.setItem("prius_todos", JSON.stringify(todos))
  }, [todos])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate("/login")
      return
    }
    setUser(session.user)
    setLoading(false)
  }

  const initializeUnits = () => {
    // Intentar cargar desde localStorage para persistencia local de demostración
    const savedUnits = localStorage.getItem("prius_beach_units")
    if (savedUnits) {
      setUnits(JSON.parse(savedUnits))
      return
    }

    const initialUnits = {}
    for (let i = 1; i <= 144; i++) {
      initialUnits[`C${i}`] = {
        id: `C${i}`, number: i, type: "carpa", status: STATUS.LIBRE,
        clientName: "", clientPhone: "", clientEmail: "",
        startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false
      }
    }
    // Algunas unidades de ejemplo pre-cargadas para dar vida al dashboard
    initialUnits[`C12`] = {
      id: `C12`, number: 12, type: "carpa", status: STATUS.TEMPORADA,
      clientName: "CARLOS PÉREZ", clientPhone: "+542235551234", clientEmail: "carlos@perez.com",
      startDate: "", endDate: "", notes: "Solicitó reposeras extra", isPaid: true, isTemporada: true
    }
    initialUnits[`C25`] = {
      id: `C25`, number: 25, type: "carpa", status: STATUS.PERIODO,
      clientName: "MARÍA GONZÁLEZ", clientPhone: "+542235559876", clientEmail: "maria@gonzalez.com",
      startDate: "2025-01-15", endDate: "2025-01-30", notes: "Frente a pasillo principal", isPaid: false, isTemporada: false
    }
    initialUnits[`S5`] = {
      id: `S5`, number: 5, type: "sombrilla", status: STATUS.PERIODO,
      clientName: "JUAN RODRÍGUEZ", clientPhone: "+541144445555", clientEmail: "juan@rodriguez.com",
      startDate: "2025-01-10", endDate: "2025-01-20", notes: "Cerca de la piscina", isPaid: false, isTemporada: false
    }

    for (let i = 1; i <= 40; i++) {
      if (!initialUnits[`S${i}`]) {
        initialUnits[`S${i}`] = {
          id: `S${i}`, number: i, type: "sombrilla", status: STATUS.LIBRE,
          clientName: "", clientPhone: "", clientEmail: "",
          startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false
        }
      }
    }
    setUnits(initialUnits)
    localStorage.setItem("prius_beach_units", JSON.stringify(initialUnits))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const handleUnitClick = (unit) => {
    if (unit) setSelectedUnit(unit)
  }

  const handleSaveUnit = (updatedUnit) => {
    const newUnits = { ...units, [updatedUnit.id]: updatedUnit }
    setUnits(newUnits)
    localStorage.setItem("prius_beach_units", JSON.stringify(newUnits))
    setSelectedUnit(null)
  }

  const getCarpa = (num) => units[`C${num}`]
  const getSombrilla = (num) => units[`S${num}`]

  // Lógica de búsqueda y filtrado inteligente
  const isUnitMatchingSearch = (unit) => {
    if (!unit) return false
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true

    // Buscar por ID exacto o número (ej. "C12", "12")
    if (unit.id.toLowerCase().includes(term) || unit.number.toString() === term) return true
    
    // Buscar por datos del cliente
    if (unit.clientName?.toLowerCase().includes(term)) return true
    if (unit.clientPhone?.includes(term)) return true
    if (unit.clientEmail?.toLowerCase().includes(term)) return true
    if (unit.notes?.toLowerCase().includes(term)) return true

    return false
  }

  const isUnitMatchingFilters = (unit) => {
    if (!unit) return false

    // Filtro de Tipo
    if (typeFilter !== "all" && unit.type !== typeFilter) return false

    // Filtro de Estado
    if (statusFilter !== "all" && unit.status !== statusFilter) return false

    // Filtro de Pago
    if (paymentFilter !== "all") {
      if (paymentFilter === "paid" && !unit.isPaid) return false
      if (paymentFilter === "unpaid" && unit.isPaid) return false
      if (paymentFilter === "unpaid" && unit.status === STATUS.LIBRE) return false // Libres no cuentan como impagos
    }

    return true
  }

  // Tareas (To-Do List)
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), completed: false }])
    setNewTodo("")
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // Estadísticas dinámicas basadas en filtros actuales
  const stats = {
    carpasLibres: Object.values(units).filter(u => u.type === "carpa" && u.status === STATUS.LIBRE).length,
    carpasOcupadas: Object.values(units).filter(u => u.type === "carpa" && u.status !== STATUS.LIBRE).length,
    sombrillasLibres: Object.values(units).filter(u => u.type === "sombrilla" && u.status === STATUS.LIBRE).length,
    sombrillasOcupadas: Object.values(units).filter(u => u.type === "sombrilla" && u.status !== STATUS.LIBRE).length,
  }

  // Lista de unidades filtradas para la vista de tabla
  const filteredUnitsList = Object.values(units).filter(u => isUnitMatchingSearch(u) && isUnitMatchingFilters(u))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-prius-background font-sans text-prius-black">
      {/* Header */}
      <header className="bg-white border-b border-hairline sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img src="/logo-prius.png" alt="Prius" className="h-8" />
            <span className="font-bold text-lg tracking-tighter uppercase">Prius Playa Grande</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="p-2 hover:bg-prius-background rounded-full transition-colors" title="Imprimir Plano">
              <Printer size={20} />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-prius-background rounded-full transition-colors" title="Configuración">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-hairline p-6 space-y-6 shrink-0">
          {/* Buscador */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block">Buscador Inteligente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prius-black/40" />
              <input
                type="text"
                placeholder="Buscar por nro, cliente, tel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-hairline rounded-sm text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="space-y-4 pt-4 border-t border-hairline">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40">Filtros de Vista</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-prius-black/60 block mb-1">Tipo de Unidad</label>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-hairline rounded-sm py-1.5 px-2 text-xs outline-none focus:border-gold bg-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="carpa">Carpas</option>
                  <option value="sombrilla">Sombrillas</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-prius-black/60 block mb-1">Estado de Reserva</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-hairline rounded-sm py-1.5 px-2 text-xs outline-none focus:border-gold bg-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="libre">Disponibles</option>
                  <option value="temporada">Temporada Completa</option>
                  <option value="periodo">Por Período</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-prius-black/60 block mb-1">Estado de Pago</label>
                <select 
                  value={paymentFilter} 
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full border border-hairline rounded-sm py-1.5 px-2 text-xs outline-none focus:border-gold bg-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="paid">Pagados</option>
                  <option value="unpaid">Pendientes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="space-y-3 pt-4 border-t border-hairline">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40">Ocupación Actual</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-prius-black text-white rounded-sm">
                <p className="text-xl font-normal">{stats.carpasOcupadas}</p>
                <p className="text-[8px] uppercase tracking-widest opacity-60">Carpas Ocupadas</p>
              </div>
              <div className="p-3 bg-white border border-hairline rounded-sm">
                <p className="text-xl font-normal">{stats.carpasLibres}</p>
                <p className="text-[8px] uppercase tracking-widest text-prius-black/40">Carpas Libres</p>
              </div>
              <div className="p-3 bg-gold text-prius-black rounded-sm">
                <p className="text-xl font-normal">{stats.sombrillasOcupadas}</p>
                <p className="text-[8px] uppercase tracking-widest opacity-80">Sombrillas Ocupadas</p>
              </div>
              <div className="p-3 bg-white border border-hairline rounded-sm">
                <p className="text-xl font-normal">{stats.sombrillasLibres}</p>
                <p className="text-[8px] uppercase tracking-widest text-prius-black/40">Sombrillas Libres</p>
              </div>
            </div>
          </div>

          {/* Tareas del Día (To-Do List) */}
          <div className="pt-4 border-t border-hairline space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 flex items-center justify-between">
              <span>Tareas del Día</span>
              <span className="bg-gold/20 text-prius-black px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                {todos.filter(t => !t.completed).length}
              </span>
            </h3>
            
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input
                type="text"
                placeholder="Nueva tarea..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-hairline rounded-sm text-xs focus:border-gold outline-none"
              />
              <button type="submit" className="p-1.5 bg-gold hover:bg-gold-hover rounded-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-start justify-between gap-2 p-2 bg-prius-background border border-hairline rounded-sm text-xs">
                  <button 
                    type="button" 
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-0.5 text-prius-black/60 hover:text-prius-black transition-colors shrink-0"
                  >
                    {todo.completed ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4" />}
                  </button>
                  <span className={`flex-1 leading-tight ${todo.completed ? 'line-through opacity-40' : ''}`}>
                    {todo.text}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-prius-black/40 hover:text-red-600 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {todos.length === 0 && (
                <p className="text-[10px] text-prius-black/40 text-center py-2">No hay tareas pendientes.</p>
              )}
            </div>
          </div>

          {/* Leyenda */}
          <div className="pt-4 border-t border-hairline">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 mb-3">Leyenda</h3>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-prius-black border border-hairline flex items-center justify-center text-white text-[8px] font-bold">T</div>
                <span className="uppercase tracking-wider text-prius-black/60">Temporada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-gold border border-hairline flex items-center justify-center text-prius-black text-[8px] font-bold">P</div>
                <span className="uppercase tracking-wider text-prius-black/60">Período</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-white border border-hairline"></div>
                <span className="uppercase tracking-wider text-prius-black/60">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-white border border-hairline flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
                <span className="uppercase tracking-wider text-prius-black/60">Pagado</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
          {/* Selector de Vista */}
          <div className="flex items-center justify-between mb-6 bg-white border border-hairline p-3 rounded-sm">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "map" ? 'bg-gold text-prius-black' : 'hover:bg-prius-background'}`}
              >
                <Map className="w-4 h-4" />
                Mapa de Playa
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "list" ? 'bg-gold text-prius-black' : 'hover:bg-prius-background'}`}
              >
                <List className="w-4 h-4" />
                Lista de Unidades ({filteredUnitsList.length})
              </button>
            </div>

            {searchTerm && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-gold bg-prius-black px-3 py-1.5 rounded-sm flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                Búsqueda Activa: "{searchTerm}"
              </div>
            )}
          </div>

          {viewMode === "map" ? (
            /* VISTA DE MAPA */
            <div className="bg-white border border-hairline p-6 md:p-12 min-w-[850px] rounded-sm shadow-sm">
              <div className="flex justify-center mb-8">
                <div className="flex text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-[280px] bg-prius-background py-2 text-center border border-hairline">Recreación</div>
                  <div className="w-[140px] bg-white py-2 text-center border-y border-hairline">Acceso</div>
                  <div className="w-[280px] bg-gold/10 py-2 text-center border border-hairline">Piscina</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {/* Pasillo A */}
                <div className="flex gap-12">
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 25 }, (_, i) => i + 1).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 25 }, (_, i) => i + 26).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="w-px bg-hairline mx-4" />

                {/* Pasillo B */}
                <div className="flex gap-12">
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 25 }, (_, i) => i + 51).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-[31px]" /><div className="h-[31px]" />
                    {Array.from({ length: 23 }, (_, i) => i + 76).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="w-px bg-hairline mx-4" />

                {/* Pasillo C */}
                <div className="flex gap-12">
                  <div className="flex flex-col gap-1">
                    <div className="h-[31px]" /><div className="h-[31px]" />
                    {Array.from({ length: 23 }, (_, i) => i + 99).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-[31px]" /><div className="h-[31px]" />
                    {Array.from({ length: 23 }, (_, i) => i + 122).map(num => {
                      const unit = getCarpa(num)
                      const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                      return (
                        <Cell 
                          key={num} 
                          number={num} 
                          unit={unit} 
                          onClick={handleUnitClick} 
                          isHighlighted={searchTerm && isMatch}
                          isDimmed={searchTerm && !isMatch}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Sombrillas */}
              <div className="mt-12 flex justify-center">
                <div className="flex gap-4">
                  {Array.from({ length: 8 }, (_, groupIdx) => (
                    <div key={groupIdx} className="flex flex-col gap-1">
                      {Array.from({ length: 5 }, (_, rowIdx) => {
                        const num = groupIdx * 5 + rowIdx + 1
                        const unit = getSombrilla(num)
                        const isMatch = isUnitMatchingSearch(unit) && isUnitMatchingFilters(unit)
                        return (
                          <Cell 
                            key={num} 
                            number={num} 
                            unit={unit} 
                            onClick={handleUnitClick} 
                            isHighlighted={searchTerm && isMatch}
                            isDimmed={searchTerm && !isMatch}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <div className="w-full max-w-[600px] bg-prius-black py-3 text-center text-white font-bold text-xs tracking-[0.3em] uppercase">
                  Mar Argentino
                </div>
              </div>
            </div>
          ) : (
            /* VISTA DE LISTA / TABLA */
            <div className="bg-white border border-hairline rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-prius-black text-white text-[10px] font-bold uppercase tracking-widest">
                    <th className="p-4 border-b border-hairline">Unidad</th>
                    <th className="p-4 border-b border-hairline">Cliente</th>
                    <th className="p-4 border-b border-hairline">Contacto</th>
                    <th className="p-4 border-b border-hairline">Estadía</th>
                    <th className="p-4 border-b border-hairline">Estado Pago</th>
                    <th className="p-4 border-b border-hairline text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-xs">
                  {filteredUnitsList.map((unit) => (
                    <tr key={unit.id} className="hover:bg-prius-background transition-colors">
                      <td className="p-4 font-bold flex items-center gap-2">
                        {unit.type === "sombrilla" ? <Umbrella className="w-4 h-4 text-gold" /> : <Home className="w-4 h-4 text-gold" />}
                        <span className="uppercase">{unit.type} #{unit.number}</span>
                      </td>
                      <td className="p-4">
                        {unit.clientName ? (
                          <span className="font-medium uppercase">{unit.clientName}</span>
                        ) : (
                          <span className="text-prius-black/30 italic">Disponible</span>
                        )}
                      </td>
                      <td className="p-4">
                        {unit.clientPhone || unit.clientEmail ? (
                          <div className="space-y-0.5">
                            {unit.clientPhone && <p className="text-prius-black/60">{unit.clientPhone}</p>}
                            {unit.clientEmail && <p className="text-prius-black/40 text-[10px]">{unit.clientEmail}</p>}
                          </div>
                        ) : (
                          <span className="text-prius-black/30">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {unit.status === STATUS.LIBRE ? (
                          <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">Libre</span>
                        ) : unit.isTemporada ? (
                          <span className="bg-prius-black text-white px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">Temporada</span>
                        ) : (
                          <span className="bg-gold/20 text-prius-black px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">
                            {unit.startDate} al {unit.endDate}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {unit.status === STATUS.LIBRE ? (
                          <span className="text-prius-black/30">-</span>
                        ) : unit.isPaid ? (
                          <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Pagado
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleUnitClick(unit)}
                          className="px-3 py-1.5 bg-prius-black text-white hover:bg-gold hover:text-prius-black rounded-sm font-bold text-[9px] uppercase tracking-wider transition-all"
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUnitsList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-prius-black/40 italic">
                        No se encontraron unidades que coincidan con los filtros o la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onSave={handleSaveUnit}
        />
      )}

      {showSettings && (
        <SettingsPanel
          user={user}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}