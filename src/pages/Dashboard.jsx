import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { 
  LogOut, Settings, Printer, X, User, Building2, 
  Phone, Mail, Calendar, FileText, Save, Trash2,
  Search, TrendingUp, Umbrella, Home, Plus, Check,
  Menu, ChevronRight
} from "lucide-react"
import BeachFlowLogo from "../components/ui/BeachFlowLogo"

// Estados posibles
const STATUS = {
  LIBRE: "libre",
  TEMPORADA: "temporada",
  PERIODO: "periodo"
}

// Modal de edicion
function UnitModal({ unit, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    status: unit?.status || STATUS.LIBRE,
    clientName: unit?.clientName || "",
    clientPhone: unit?.clientPhone || "",
    clientEmail: unit?.clientEmail || "",
    startDate: unit?.startDate || "",
    endDate: unit?.endDate || "",
    notes: unit?.notes || "",
    isPaid: unit?.isPaid || false,
    isTemporada: unit?.isTemporada || false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStatus = formData.isTemporada ? STATUS.TEMPORADA : (formData.startDate ? STATUS.PERIODO : STATUS.LIBRE)
    onSave({ ...unit, ...formData, status: newStatus })
  }

  const handleClear = () => {
    setFormData({
      status: STATUS.LIBRE,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      startDate: "",
      endDate: "",
      notes: "",
      isPaid: false,
      isTemporada: false
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-sky-600 to-sky-500 rounded-t-2xl">
          <div className="text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {unit?.type === "sombrilla" ? <Umbrella className="w-5 h-5" /> : <Home className="w-5 h-5" />}
              {unit?.type === "sombrilla" ? "Sombrilla" : "Carpa"} #{unit?.number}
            </h2>
            <p className="text-sm text-white/80">
              {formData.status === STATUS.TEMPORADA ? "Temporada Completa" : 
               formData.status === STATUS.PERIODO ? "Periodo" : "Libre"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Nombre del Cliente
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
              placeholder="NOMBRE COMPLETO"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefono
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
              />
            </div>
          </div>

          {/* Temporada Completa Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
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
              className="w-5 h-5 rounded accent-white"
            />
            <label htmlFor="isTemporada" className="text-sm font-bold text-white">
              TEMPORADA COMPLETA (T)
            </label>
          </div>

          {!formData.isTemporada && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Desde
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Hasta
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <FileText className="w-4 h-4 inline mr-2" />
              Notas / Observaciones
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none text-sm"
              placeholder="Ej: SIN CARGO TEMPORADA 2026/2027..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { handleClear(); onSave({ ...unit, status: STATUS.LIBRE, clientName: "", clientPhone: "", clientEmail: "", startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false }) }}
              className="flex-1 py-2.5 px-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 flex items-center justify-center gap-2 border-2 border-red-200 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Liberar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-sky-600 flex items-center justify-center gap-2 shadow-lg text-sm"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Settings Panel
function SettingsPanel({ user, onClose, onLogout }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Configuracion</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
              <User className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="font-semibold">Usuario</p>
              <p className="text-sm text-gray-500">{user?.email || "No disponible"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold">Balneario</p>
              <p className="text-sm text-gray-500">Prius Playa Grande</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 flex items-center justify-center gap-2 mt-2"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  )
}

// Celda individual del plano - numero afuera, letra adentro
function Cell({ number, unit, onClick, type = "carpa" }) {
  const status = unit?.status || STATUS.LIBRE
  const isTemporada = status === STATUS.TEMPORADA
  const isPeriodo = status === STATUS.PERIODO
  
  const getBgColor = () => {
    if (isTemporada) return "bg-gray-800 text-white"
    if (isPeriodo) return "bg-gray-300 text-gray-800"
    return "bg-white text-gray-400"
  }
  
  return (
    <div className="flex items-center">
      <span className="w-6 md:w-8 text-[10px] md:text-xs font-medium text-gray-600 text-right pr-1">{number}</span>
      <button
        onClick={() => onClick(unit)}
        className={`w-7 h-6 md:w-9 md:h-7 text-[10px] md:text-xs font-bold flex items-center justify-center border border-gray-400 cursor-pointer hover:ring-2 hover:ring-sky-400 transition-all ${getBgColor()}`}
        title={unit?.clientName || "Libre"}
      >
        {isTemporada && "T"}
        {isPeriodo && "P"}
      </button>
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
  const [searchTerm, setSearchTerm] = useState("")
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    checkUser()
    initializeUnits()
  }, [])

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
    const initialUnits = {}
    for (let i = 1; i <= 144; i++) {
      initialUnits[`C${i}`] = {
        id: `C${i}`, number: i, type: "carpa", status: STATUS.LIBRE,
        clientName: "", clientPhone: "", clientEmail: "",
        startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false
      }
    }
    for (let i = 1; i <= 40; i++) {
      initialUnits[`S${i}`] = {
        id: `S${i}`, number: i, type: "sombrilla", status: STATUS.LIBRE,
        clientName: "", clientPhone: "", clientEmail: "",
        startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false
      }
    }
    // Datos de ejemplo basados en la imagen
    const ejemplos = [
      { id: "C2", status: STATUS.PERIODO },
      { id: "C5", status: STATUS.PERIODO },
      { id: "C61", clientName: "HUGO REINOSO", startDate: "2026-02-14", endDate: "2026-02-28", status: STATUS.PERIODO },
      { id: "C99", clientName: "MANUEL PUIG", notes: "19/02 + 5 DIAS", status: STATUS.PERIODO },
      { id: "C118", clientName: "MYRIAN REINA", startDate: "2026-02-21", endDate: "2026-02-23", status: STATUS.PERIODO },
      { id: "S4", clientName: "DIEGO", notes: "SIN CARGO TEMPORADA 2026/2027", isTemporada: true, status: STATUS.TEMPORADA },
      { id: "S22", clientName: "MIRTA", startDate: "2026-02-21", endDate: "2026-03-01", status: STATUS.PERIODO },
      { id: "S39", clientName: "SOLEDAD", startDate: "2026-02-14", endDate: "2026-02-24", status: STATUS.PERIODO },
    ]
    ejemplos.forEach(e => {
      if (initialUnits[e.id]) {
        initialUnits[e.id] = { ...initialUnits[e.id], ...e }
      }
    })
    setUnits(initialUnits)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const handleUnitClick = (unit) => {
    if (unit) setSelectedUnit(unit)
  }

  const handleSaveUnit = (updatedUnit) => {
    setUnits(prev => ({ ...prev, [updatedUnit.id]: updatedUnit }))
    setSelectedUnit(null)
  }

  const handlePrint = () => window.print()

  const getCarpa = (num) => units[`C${num}`]
  const getSombrilla = (num) => units[`S${num}`]

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, done: false }])
      setNewTodo("")
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  // Estadisticas
  const stats = {
    carpasLibres: Object.values(units).filter(u => u.type === "carpa" && u.status === STATUS.LIBRE).length,
    carpasOcupadas: Object.values(units).filter(u => u.type === "carpa" && u.status !== STATUS.LIBRE).length,
    sombrillasLibres: Object.values(units).filter(u => u.type === "sombrilla" && u.status === STATUS.LIBRE).length,
    sombrillasOcupadas: Object.values(units).filter(u => u.type === "sombrilla" && u.status !== STATUS.LIBRE).length,
  }

  // Lista de ocupados para imprimir
  const occupiedCarpas = Object.values(units).filter(u => u.type === "carpa" && u.status !== STATUS.LIBRE).sort((a, b) => a.number - b.number)
  const occupiedSombrillas = Object.values(units).filter(u => u.type === "sombrilla" && u.status !== STATUS.LIBRE).sort((a, b) => a.number - b.number)

  const formatDateRange = (unit) => {
    if (unit.isTemporada) return ""
    if (!unit.startDate && !unit.endDate && unit.notes) return ""
    const formatD = (d) => {
      if (!d) return ""
      const date = new Date(d)
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    }
    if (unit.startDate && unit.endDate) return `${formatD(unit.startDate)} AL ${formatD(unit.endDate)}`
    return ""
  }

  const formatUnitLegend = (unit, prefix) => {
    let text = `${prefix}.${unit.number}`
    if (unit.clientName) text += ` ${unit.clientName}`
    if (unit.notes) text += ` (${unit.notes})`
    const dateRange = formatDateRange(unit)
    if (dateRange) text += ` ${dateRange}`
    return text
  }

  // Busqueda
  const searchResults = searchTerm 
    ? Object.values(units).filter(u => 
        u.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.number.toString().includes(searchTerm)
      )
    : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 print:static print:border-0">
        <div className="px-3 md:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden print:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <BeachFlowLogo />
            </div>
            <div className="hidden md:block text-center print:block">
              <h1 className="text-lg font-bold text-gray-900">Balneario Prius Playa Grande</h1>
              <p className="text-xs text-gray-500">Plano General Temporada 25/26</p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button onClick={handlePrint} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Imprimir plano">
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Configuracion">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile title */}
        <div className="md:hidden text-center pb-2 border-t pt-2 print:hidden">
          <h1 className="text-sm font-bold text-gray-900">Balneario Prius Playa Grande</h1>
          <p className="text-[10px] text-gray-500">Plano General Temporada 25/26</p>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden print:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="w-72 bg-white h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <button onClick={() => setShowMobileMenu(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="bg-sky-50 rounded-xl p-3">
                <h3 className="font-bold text-sm mb-2">Estadisticas Carpas</h3>
                <div className="flex justify-between text-xs">
                  <span>Libres: {stats.carpasLibres}</span>
                  <span>Ocupadas: {stats.carpasOcupadas}</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <h3 className="font-bold text-sm mb-2">Estadisticas Sombrillas</h3>
                <div className="flex justify-between text-xs">
                  <span>Libres: {stats.sombrillasLibres}</span>
                  <span>Ocupadas: {stats.sombrillasOcupadas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Izquierda - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-56px)] p-4 space-y-4 print:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o numero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="bg-sky-50 rounded-xl p-3 border border-sky-200">
              <p className="text-xs font-semibold text-sky-800 mb-2">Resultados ({searchResults.length})</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {searchResults.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUnit(u)}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-sky-100"
                  >
                    <span className="font-bold">{u.type === "sombrilla" ? "S" : "C"}.{u.number}</span>
                    {u.clientName && <span className="ml-2 text-gray-600">{u.clientName}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Carpas (144)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-xl font-bold">{stats.carpasLibres}</p>
                <p className="text-[10px]">Libres</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-xl font-bold">{stats.carpasOcupadas}</p>
                <p className="text-[10px]">Ocupadas</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
              <Umbrella className="w-4 h-4" />
              Sombrillas (40)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-xl font-bold">{stats.sombrillasLibres}</p>
                <p className="text-[10px]">Libres</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-xl font-bold">{stats.sombrillasOcupadas}</p>
                <p className="text-[10px]">Ocupadas</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border">
            <h3 className="font-bold text-sm mb-2">Leyenda</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-5 bg-gray-800 border flex items-center justify-center text-white text-[10px] font-bold">T</div>
                <span>Temporada Completa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-5 bg-gray-300 border flex items-center justify-center text-gray-800 text-[10px] font-bold">P</div>
                <span>Periodo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-5 bg-white border"></div>
                <span>Libre</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Plano */}
        <main className="flex-1 p-2 md:p-4 overflow-x-auto">
          <div className="bg-white rounded-xl shadow-sm border p-3 md:p-6 min-w-[700px] print:shadow-none print:border-0 print:p-0 print:min-w-0">
            
            {/* Header zones - RECREACION, ACCESO, PISCINA */}
            <div className="flex justify-center mb-4 print:mb-2">
              <div className="flex text-[10px] md:text-xs font-bold">
                {/* RECREACION - sobre columnas 1-50 */}
                <div className="w-[200px] md:w-[280px] bg-gray-200 py-1 text-center border border-gray-400 rounded-l">
                  RECREACION
                </div>
                {/* ACCESO - sobre columna 51-75 */}
                <div className="w-[100px] md:w-[140px] bg-gray-300 py-1 text-center border-y border-gray-400">
                  ACCESO
                </div>
                {/* PISCINA - sobre columnas 76-144 */}
                <div className="w-[200px] md:w-[280px] bg-sky-200 py-1 text-center border border-gray-400 rounded-r flex items-center justify-center gap-1">
                  <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2"/>
                    <rect x="4" y="4" width="16" height="12" rx="2"/>
                  </svg>
                  PISCINA
                </div>
              </div>
            </div>

            {/* Plano de carpas - Layout exacto de la imagen */}
            <div className="flex justify-center gap-1 md:gap-2">
              
              {/* PASILLO A: Columnas 1-25 y 26-50 */}
              <div className="flex gap-0.5 md:gap-[4rem]">
                {/* Columna 1-25 */}
                <div className="flex flex-col gap-0.5">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                {/* Columna 26-50 (doble: 26/27, 28/29, etc pero en el plano es secuencial) */}
                <div className="flex gap-0.5">
                  <div className="flex flex-col gap-0.5">
                    {Array.from({ length: 25 }, (_, i) => i + 26).map(num => (
                      <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Separador Pasillo A */}
              <div className="w-2 md:w-4 flex items-center justify-center">
                <div className="w-px h-full bg-gray-300"></div>
              </div>

              {/* PASILLO B: Columnas 51-75 y 76-98 */}
              <div className="flex gap-0.5 md:gap-[4rem]">
                {/* Columna 51-75 */}
                <div className="flex flex-col gap-0.5">
                  {Array.from({ length: 25 }, (_, i) => i + 51).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                {/* Columna 76-98 - empieza en fila 3 por la piscina */}
                <div className="flex flex-col gap-0.5">
                  {/* Espacio vacio por piscina (2 filas) */}
                  <div className="h-[26px] md:h-[30px]"></div>
                  <div className="h-[26px] md:h-[30px]"></div>
                  {Array.from({ length: 23 }, (_, i) => i + 76).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
              </div>

              {/* Separador Pasillo B */}
              <div className="w-2 md:w-4 flex items-center justify-center">
                <div className="w-px h-full bg-gray-300"></div>
              </div>

              {/* PASILLO C: Columnas 99-121 y 122-144 */}
              <div className="flex gap-0.5 md:gap-[4rem]">
                {/* Columna 99-121 - empieza en fila 3 por la piscina */}
                <div className="flex flex-col gap-0.5">
                  {/* Espacio vacio por piscina (2 filas) */}
                  <div className="h-[26px] md:h-[30px]"></div>
                  <div className="h-[26px] md:h-[30px]"></div>
                  {Array.from({ length: 23 }, (_, i) => i + 99).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                {/* Columna 122-144 - empieza en fila 3 por la piscina */}
                <div className="flex flex-col gap-0.5">
                  {/* Espacio vacio por piscina (2 filas) */}
                  <div className="h-[26px] md:h-[30px]"></div>
                  <div className="h-[26px] md:h-[30px]"></div>
                  {Array.from({ length: 23 }, (_, i) => i + 122).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sombrillas */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-1 md:gap-2">
                {/* 8 grupos de 5 sombrillas */}
                {Array.from({ length: 8 }, (_, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col gap-0.5">
                    {Array.from({ length: 5 }, (_, rowIdx) => {
                      const num = groupIdx * 5 + rowIdx + 1
                      return <Cell key={num} number={num} unit={getSombrilla(num)} onClick={handleUnitClick} type="sombrilla" />
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* MAR */}
            <div className="mt-4 flex justify-center print:mt-2">
              <div className="w-full max-w-[600px] bg-gray-400 py-1.5 text-center text-white font-bold text-xs md:text-sm rounded">
                MAR
              </div>
            </div>

            {/* Leyenda de ocupados - para impresion */}
            <div className="mt-6 pt-4 border-t print:mt-4 print:pt-2">
              <div className="grid grid-cols-2 gap-4 md:gap-8 text-[9px] md:text-[10px]">
                {/* Carpas ocupadas */}
                <div>
                  {occupiedCarpas.map(unit => (
                    <div key={unit.id} className="mb-0.5">
                      {formatUnitLegend(unit, "C")}
                    </div>
                  ))}
                </div>
                {/* Sombrillas ocupadas */}
                <div>
                  {occupiedSombrillas.map(unit => (
                    <div key={unit.id} className="mb-0.5">
                      {formatUnitLegend(unit, "S")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Derecha - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-l min-h-[calc(100vh-56px)] p-4 space-y-4 print:hidden">
          {/* To-Do List */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notas / To-Do
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Nueva tarea..."
                className="flex-1 px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                onClick={addTodo}
                className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">No hay tareas</p>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                    <button onClick={() => toggleTodo(todo.id)}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${todo.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {todo.done && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                    <span className={`flex-1 text-xs ${todo.done ? 'line-through text-gray-400' : ''}`}>{todo.text}</span>
                    <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Acciones rapidas */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-bold text-sm mb-3">Acciones Rapidas</h3>
            <div className="space-y-2">
              <button 
                onClick={handlePrint}
                className="w-full py-2 px-3 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-600 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Plano
              </button>
              <button className="w-full py-2 px-3 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 flex items-center gap-2 justify-between">
                Exportar datos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Proximas features */}
          <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
            <h3 className="font-bold text-sm mb-2 text-sky-800">Proximamente</h3>
            <ul className="text-xs text-sky-700 space-y-1">
              <li>- Historial de reservas</li>
              <li>- Reportes de ocupacion</li>
              <li>- Notificaciones</li>
              <li>- App movil</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Modals */}
      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onSave={handleSaveUnit}
          onDelete={(unit) => handleSaveUnit({ ...unit, status: STATUS.LIBRE, clientName: "", clientPhone: "", clientEmail: "", startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false })}
        />
      )}

      {showSettings && (
        <SettingsPanel
          user={user}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  )
}
