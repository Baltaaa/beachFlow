import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { 
  LogOut, Settings, Printer, X, User, Building2, 
  Phone, Mail, Calendar, FileText, Save, Trash2,
  Search, TrendingUp, Umbrella, Home, Plus, Check,
  Menu, ChevronRight
} from "lucide-react"

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
    <div className="fixed inset-0 bg-prius-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline" onClick={e => e.stopPropagation()}>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-prius-background border border-hairline rounded-sm">
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
              className="w-4 h-4 accent-gold"
            />
            <label htmlFor="isTemporada" className="text-xs font-bold uppercase tracking-widest">
              Temporada Completa (T)
            </label>
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-hairline rounded-sm focus:border-gold outline-none resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { handleClear(); onSave({ ...unit, status: STATUS.LIBRE, clientName: "", clientPhone: "", clientEmail: "", startDate: "", endDate: "", notes: "", isPaid: false, isTemporada: false }) }}
              className="flex-1 py-3 border border-hairline hover:bg-red-50 hover:text-red-600 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              Liberar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gold hover:bg-gold-hover text-prius-black rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
            >
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
    <div className="fixed inset-0 bg-prius-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md border border-hairline" onClick={e => e.stopPropagation()}>
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
              <p className="text-xs font-bold uppercase tracking-widest">Usuario</p>
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

function Cell({ number, unit, onClick }) {
  const status = unit?.status || STATUS.LIBRE
  const isTemporada = status === STATUS.TEMPORADA
  const isPeriodo = status === STATUS.PERIODO
  
  const getBgColor = () => {
    if (isTemporada) return "bg-prius-black text-white"
    if (isPeriodo) return "bg-gold text-prius-black"
    return "bg-white text-prius-black/20"
  }
  
  return (
    <div className="flex items-center">
      <span className="w-6 md:w-8 text-[9px] font-bold text-prius-black/40 text-right pr-1">{number}</span>
      <button
        onClick={() => onClick(unit)}
        className={`w-7 h-6 md:w-9 md:h-7 text-[9px] font-bold flex items-center justify-center border border-hairline cursor-pointer hover:border-gold transition-all ${getBgColor()}`}
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

  const getCarpa = (num) => units[`C${num}`]
  const getSombrilla = (num) => units[`S${num}`]

  const stats = {
    carpasLibres: Object.values(units).filter(u => u.type === "carpa" && u.status === STATUS.LIBRE).length,
    carpasOcupadas: Object.values(units).filter(u => u.type === "carpa" && u.status !== STATUS.LIBRE).length,
    sombrillasLibres: Object.values(units).filter(u => u.type === "sombrilla" && u.status === STATUS.LIBRE).length,
    sombrillasOcupadas: Object.values(units).filter(u => u.type === "sombrilla" && u.status !== STATUS.LIBRE).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-prius-background font-sans">
      {/* Header */}
      <header className="bg-white border-b border-hairline sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img src="/logo-prius.png" alt="Prius" className="h-8" />
            <span className="font-bold text-lg tracking-tighter uppercase">Prius</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="p-2 hover:bg-prius-background rounded-full transition-colors">
              <Printer size={20} />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-prius-background rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-hairline min-h-[calc(100vh-64px)] p-6 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prius-black/40" />
            <input
              type="text"
              placeholder="Buscar unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-hairline rounded-sm text-sm focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-prius-black text-white rounded-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Carpas</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-normal">{stats.carpasOcupadas}</p>
                  <p className="text-[9px] uppercase tracking-widest opacity-60">Ocupadas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-normal">{stats.carpasLibres}</p>
                  <p className="text-[9px] uppercase tracking-widest opacity-60">Libres</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-hairline rounded-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Sombrillas</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-normal">{stats.sombrillasOcupadas}</p>
                  <p className="text-[9px] uppercase tracking-widest text-prius-black/40">Ocupadas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-normal">{stats.sombrillasLibres}</p>
                  <p className="text-[9px] uppercase tracking-widest text-prius-black/40">Libres</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-hairline">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 mb-4">Leyenda</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-5 bg-prius-black border border-hairline flex items-center justify-center text-white text-[9px] font-bold">T</div>
                <span className="text-[11px] uppercase tracking-wider">Temporada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-5 bg-gold border border-hairline flex items-center justify-center text-prius-black text-[9px] font-bold">P</div>
                <span className="text-[11px] uppercase tracking-wider">Periodo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-5 bg-white border border-hairline"></div>
                <span className="text-[11px] uppercase tracking-wider">Disponible</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="bg-white border border-hairline p-12 min-w-[800px]">
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
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 25 }, (_, i) => i + 26).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
              </div>

              <div className="w-px bg-hairline mx-4" />

              {/* Pasillo B */}
              <div className="flex gap-12">
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 25 }, (_, i) => i + 51).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[31px]" /><div className="h-[31px]" />
                  {Array.from({ length: 23 }, (_, i) => i + 76).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
              </div>

              <div className="w-px bg-hairline mx-4" />

              {/* Pasillo C */}
              <div className="flex gap-12">
                <div className="flex flex-col gap-1">
                  <div className="h-[31px]" /><div className="h-[31px]" />
                  {Array.from({ length: 23 }, (_, i) => i + 99).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[31px]" /><div className="h-[31px]" />
                  {Array.from({ length: 23 }, (_, i) => i + 122).map(num => (
                    <Cell key={num} number={num} unit={getCarpa(num)} onClick={handleUnitClick} />
                  ))}
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
                      return <Cell key={num} number={num} unit={getSombrilla(num)} onClick={handleUnitClick} />
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