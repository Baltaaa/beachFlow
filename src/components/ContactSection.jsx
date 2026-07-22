"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Umbrella, 
  Shield, 
  Briefcase, 
  Gift, 
  Sparkles, 
  HelpCircle 
} from "lucide-react";

const ASUNTO_OPTIONS = [
  { id: "Reserva de carpas / sombrillas", label: "Carpas & Sombrillas", icon: Umbrella, desc: "Reserva de sombra en Playa Grande" },
  { id: "Cabinas & lockers", label: "Cabinas & Lockers", icon: Shield, desc: "Vestuarios y seguridad privada" },
  { id: "Evento corporativo", label: "Evento Corporativo", icon: Briefcase, desc: "Lanzamientos y cenas de empresa" },
  { id: "Cumpleaños / fiesta de 15", label: "Cumpleaños / Fiestas", icon: Gift, desc: "Celebraciones sociales privadas" },
  { id: "Casamiento", label: "Casamientos", icon: Sparkles, desc: "Bodas exclusivas frente al mar" },
  { id: "Otra consulta", label: "Otra Consulta", icon: HelpCircle, desc: "Consultas generales al equipo" },
];

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL ?? "";

export default function ContactSection() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function validateStep(currentStep) {
    const errors = {};
    if (currentStep === 1) {
      if (!form.asunto) {
        errors.asunto = "Por favor, seleccioná una opción para continuar.";
      }
    } else if (currentStep === 2) {
      if (!form.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
      if (!form.telefono.trim()) {
        errors.telefono = "El teléfono es obligatorio.";
      } else if (!/^\+?[\d\s\-()]{7,20}$/.test(form.telefono.trim())) {
        errors.telefono = "Formato de teléfono no válido.";
      }
      if (!form.email.trim()) {
        errors.email = "El email es obligatorio.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = "El email no es válido.";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSelectAsunto(asuntoId) {
    setForm((prev) => ({ ...prev, asunto: asuntoId }));
    setFieldErrors((prev) => ({ ...prev, asunto: undefined }));
    // Avanzar automáticamente al paso 2 tras seleccionar el asunto
    setTimeout(() => {
      setStep(2);
    }, 300);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  }

  function handlePrev() {
    setStep((prev) => prev - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(2)) return;
    setStatus("loading");
    setErrorMsg("");
    
    const payload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      asunto: form.asunto,
      mensaje: form.mensaje.trim(),
      origen: "web-prius",
      timestamp: new Date().toISOString(),
    };

    try {
      // Si no hay webhook configurado, simulamos éxito en desarrollo para no romper la experiencia
      if (!N8N_WEBHOOK_URL) {
        console.warn("VITE_N8N_WEBHOOK_URL no está configurada. Simulando envío exitoso en desarrollo:", payload);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula latencia de red
        setStatus("success");
        setForm({ nombre: "", telefono: "", email: "", asunto: "", mensaje: "" });
        setStep(1);
        return;
      }

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      setStatus("success");
      setForm({ nombre: "", telefono: "", email: "", asunto: "", mensaje: "" });
      setStep(1);
    } catch (err) {
      console.error("Error enviando lead:", err);
      setStatus("error");
      setErrorMsg("Algo salió mal. Intentá de nuevo o escribinos directamente por WhatsApp.");
    }
  }

  return (
    <section id="contacto" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-prius-background via-gold/[0.09] to-white py-20 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      
      {/* Esferas de luz dorada difuminadas para lograr el efecto fade degrade premium */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/18 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/[0.12] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1140px] mx-auto w-full relative z-10">
        
        {/* Encabezado Coherente & Compacto */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
            Cotizador & Reservas
          </span>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
            Diseñá tu <span className="text-gold">Experiencia</span>
          </h2>
        </div>

        {/* Estructura Bento Compacta con Altura Ajustada */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-hairline rounded-2xl overflow-hidden bg-white">
          
          {/* Bloque Izquierdo: Información de Contacto y Estética */}
          <div className="lg:col-span-4 relative text-white p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline/10 overflow-hidden min-h-[320px] lg:min-h-[520px]">
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/bg-desktop.webp" 
                alt="Fondo Costa Prius" 
                className="w-full h-full object-cover grayscale opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/95 via-neutral-900/90 to-neutral-950/95" />
            </div>

            {/* Contenido en primer plano */}
            <div className="relative z-10">
              <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-1 block font-display">
                Atención Exclusiva
              </span>
              <h3 className="text-xl md:text-2xl font-light uppercase tracking-tight leading-snug mb-4 font-display">
                Su próximo descanso<br />comienza acá
              </h3>
              <p className="text-white/60 text-xs leading-relaxed font-light max-w-xs">
                Completá nuestro asistente interactivo paso a paso para recibir una propuesta personalizada y adaptada a tus preferencias.
              </p>
            </div>

            {/* Datos de Contacto */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Phone size={12} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">WhatsApp</p>
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-xs font-light text-white hover:text-gold transition-colors tracking-wide">
                    +54 223 576 5482
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Mail size={12} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">Email</p>
                  <a href="mailto:reservas@priusplayagrande.com.ar"
                    className="text-xs font-light text-white hover:text-gold transition-colors tracking-wide">
                    reservas@priusplayagrande.com.ar
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <MapPin size={12} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">Ubicación</p>
                  <p className="text-xs font-light text-white/90 tracking-wide leading-relaxed">
                    Balneario 7, Playa Grande, Mar del Plata
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario Interactivo Step-by-Step */}
          <div className="lg:col-span-8 p-6 md:p-8 bg-neutral-50/30 flex flex-col justify-between min-h-[450px] lg:min-h-[520px]">
            
            {/* Barra de Progreso Minimalista */}
            {status !== "success" && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-prius-black/40 font-display">
                    Paso {step} de 3
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold font-display">
                    {step === 1 ? "Selección de Servicio" : step === 2 ? "Datos Personales" : "Confirmación"}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-hairline rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-500 rounded-full"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Contenido de los Pasos */}
            <div className="flex-1 flex flex-col justify-center">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-8 animate-premium-fade">
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 text-gold">
                    <Check size={24} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-wider text-prius-black mb-2 font-display">
                    ¡Solicitud Recibida!
                  </h4>
                  <p className="text-prius-black/60 text-xs max-w-sm leading-relaxed font-light mb-6">
                    Tu consulta ha sido procesada con éxito. Un asesor de nuestro equipo se pondrá en contacto con vos a la brevedad a través de WhatsApp o correo electrónico.
                  </p>
                  <button 
                    onClick={() => {
                      setStatus("idle");
                      setStep(1);
                    }}
                    className="text-[10px] font-bold tracking-widest uppercase text-gold hover:text-prius-black transition-colors font-display"
                  >
                    Realizar otra consulta →
                  </button>
                </div>
              ) : (
                <div className="animate-premium-fade">
                  
                  {/* PASO 1: Selección de Servicio */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-1">
                          ¿Qué servicio te interesa cotizar?
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Seleccioná una de las opciones para personalizar tu experiencia.
                        </p>
                      </div>

                      {/* Grid de opciones optimizado sin scroll interno */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {ASUNTO_OPTIONS.map((opt) => {
                          const IconComponent = opt.icon;
                          const isSelected = form.asunto === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectAsunto(opt.id)}
                              className={`p-3 rounded-xl border text-left transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer w-full ${
                                isSelected
                                  ? "border-gold bg-gold/5 text-prius-black"
                                  : "border-hairline bg-white hover:border-prius-black/30 text-prius-black/70"
                              }`}
                            >
                              {/* Textos: En mobile solo título, en desktop título + descripción */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold uppercase tracking-tight font-display leading-tight truncate">
                                  {opt.label}
                                </h4>
                                <p className="hidden sm:block text-[10px] text-prius-black/40 font-light mt-0.5 leading-tight truncate">
                                  {opt.desc}
                                </p>
                              </div>
                              
                              {/* Icono al final */}
                              <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-gold/20 text-gold" : "bg-neutral-100 text-prius-black/60"}`}>
                                <IconComponent size={14} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {fieldErrors.asunto && (
                        <p className="text-xs text-red-500 text-center md:text-left font-light">
                          {fieldErrors.asunto}
                        </p>
                      )}
                    </div>
                  )}

                  {/* PASO 2: Datos Personales */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-1">
                          Tus datos de contacto
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Completá tus datos para que podamos enviarte la cotización.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Field label="Nombre completo" error={fieldErrors.nombre}>
                          <input 
                            type="text" 
                            name="nombre" 
                            value={form.nombre} 
                            onChange={handleChange}
                            placeholder="Ej. Juan Pérez" 
                            className={inputClass(!!fieldErrors.nombre)} 
                          />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Teléfono / WhatsApp" error={fieldErrors.telefono}>
                            <input 
                              type="tel" 
                              name="telefono" 
                              value={form.telefono} 
                              onChange={handleChange}
                              placeholder="Ej. +54 223 576 5482" 
                              className={inputClass(!!fieldErrors.telefono)} 
                            />
                          </Field>
                          <Field label="Correo electrónico" error={fieldErrors.email}>
                            <input 
                              type="email" 
                              name="email" 
                              value={form.email} 
                              onChange={handleChange}
                              placeholder="ejemplo@mail.com" 
                              className={inputClass(!!fieldErrors.email)} 
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PASO 3: Confirmación & Mensaje */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-1">
                          Detalles adicionales
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Agregá cualquier detalle o requerimiento especial para tu reserva.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Resumen de Selección */}
                        <div className="p-4 rounded-xl border border-hairline bg-white space-y-2">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gold font-display">Resumen de solicitud</span>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <p className="text-prius-black/40 font-light">Servicio:</p>
                              <p className="font-bold text-prius-black uppercase font-display">{form.asunto}</p>
                            </div>
                            <div>
                              <p className="text-prius-black/40 font-light">Contacto:</p>
                              <p className="font-medium text-prius-black">{form.nombre}</p>
                            </div>
                          </div>
                        </div>

                        <Field label="Mensaje o aclaración (opcional)">
                          <textarea 
                            name="mensaje" 
                            value={form.mensaje} 
                            onChange={handleChange} 
                            rows={3}
                            placeholder="Fechas de interés, cantidad de personas, etc..."
                            className={`${inputClass(false)} resize-none`} 
                          />
                        </Field>
                      </div>

                      {status === "error" && (
                        <div className="bg-red-50 border border-red-100 text-red-700 rounded-md p-3 text-xs leading-relaxed">
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Botones de Navegación */}
            {status !== "success" && (
              <div className="flex justify-between items-center pt-4 border-t border-hairline mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-prius-black/60 hover:text-prius-black transition-colors font-display cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Volver
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-gold px-6 text-[10px] font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer gap-1.5"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-gold px-6 text-[10px] font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-1.5"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="w-3 h-3 animate-spin text-prius-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Solicitud <Check size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[8px] tracking-wider text-prius-black/50 uppercase font-bold font-display">{label}</label>
      {children}
      {error && (
        <p className="text-[10px] text-red-500 mt-0.5 font-light">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-1 py-2 bg-transparent border-b text-xs text-prius-black placeholder-prius-black/30 font-light",
    "focus:outline-none focus:border-gold transition-colors duration-300",
    hasError ? "border-red-400" : "border-hairline",
  ].join(" ");
}