import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { 
  Printer, Settings, Search, Plus, Trash2, CheckSquare, Square, 
  Map, List, AlertCircle, Umbrella, Home, Check
} from "lucide-react"

import { STATUS } from "../components/dashboard/constants"
import UnitModal from "../components/dashboard/UnitModal"
import SettingsPanel from "../components/dashboard/SettingsPanel"
import Cell from "../components/dashboard/Cell"

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
    
    // Unidades de ejemplo pre-cargadas
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

  const isUnitMatchingSearch = (unit) => {
    if (!unit) return false
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true

    if (unit.id.toLowerCase().includes(term) || unit.number.toString() === term) return true
    if (unit.clientName?.toLowerCase().includes(term)) return true
    if (unit.clientPhone?.includes(term)) return true
    if (unit.clientEmail?.toLowerCase().includes(term)) return true
    if (unit.notes?.toLowerCase().includes(term)) return true

    return false
  }

  const isUnitMatchingFilters = (unit) => {
    if (!unit) return false

    if (typeFilter !== "all" && unit.type !== typeFilter) return false
    if (statusFilter !== "all" && unit.status !== statusFilter) return false

    if (paymentFilter !== "all") {
      if (paymentFilter === "paid" && !unit.isPaid) return false
      if (paymentFilter === "unpaid" && unit.isPaid) return false
      if (paymentFilter === "unpaid" && unit.status === STATUS.LIBRE) return false
    }

    return true
  }

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

  const stats = {
    carpasLibres: Object.values(units).filter(u => u.type === "carpa" && u.status === STATUS.LIBRE).length,
    carpasOcupadas: Object.values(units).filter(u => u.type === "carpa" && u.status !== STATUS.LIBRE).length,
    sombrillasLibres: Object.values(units).filter(u => u.type === "sombrilla" && u.status === STATUS.LIBRE).length,
    sombrillasOcupadas: Object.values(units).filter(u => u.type === "sombrilla" && u.status !== STATUS.LIBRE).length,
  }

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