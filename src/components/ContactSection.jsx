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
  HelpCircle,
  Clock,
  Zap,
  Award
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
    setTimeout(() => {
      setStep(2);
    }, 280);
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
      if (!N8N_WEBHOOK_URL) {
        console.warn("VITE_N8N_WEBHOOK_URL no está configurada. Simulando éxito en desarrollo:", payload);
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <section id="contacto" className="pt-12 md:pt-16 pb-0 -mb-32 sm:-mb-44 lg:-mb-56 relative z-30 px-margin-mobile md:px-margin-desktop text-prius-black">
      
      {/* Fondo Fotográfico de sección */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img 
          src="/images/playa-grande-aerea.webp" 
          alt="Costa Prius Playa Grande" 
          className="w-full h-full object-cover object-center opacity-10 filter grayscale mix-blend-multiply scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1240px] 2xl:max-w-[1450px] mx-auto w-full relative z-10">
        
        {/* Header de Sección Compacto */}
        <div className="mb-8 md:mb-10 text-center">
          <span className="text-[9px] 2xl:text-xs font-bold uppercase tracking-[0.3em] text-prius-black/50 block mb-1 font-display">
            Cotizador Interactivo & Atención Directa
          </span>
          <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-normal tracking-tight text-prius-black uppercase font-display leading-tight">
            Diseñá tu <span className="text-gold font-bold">Experiencia</span>
          </h2>

          {/* Badges de Garantía Compactos */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 md:gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-white/90 border border-hairline shadow-sm backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-prius-black/80 font-medium">
              <Zap size={12} className="text-gold fill-gold" />
              <span>Respuesta en menos de 2 horas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 border border-hairline shadow-sm backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-prius-black/80 font-medium">
              <Clock size={12} className="text-gold" />
              <span>Atención 9:00 a 19:00 hs</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 border border-hairline shadow-sm backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-prius-black/80 font-medium">
              <Award size={12} className="text-gold" />
              <span>Reserva Directa Sin Intermediarios</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Estructura Bento Flotante con Superposición Profunda y Sombra Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-hairline/80 rounded-3xl overflow-hidden bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.20)] hover:shadow-[0_30px_70px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 relative z-30">
          
          {/* Bloque Izquierdo: Información de Contacto */}
          <div className="lg:col-span-4 relative text-prius-black p-6 md:p-8 2xl:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline bg-neutral-50/90 overflow-hidden min-h-[320px] lg:min-h-[440px]">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
              <img 
                src="/images/prius-home-desktop.jpg" 
                alt="Costa Prius" 
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-50/90 to-neutral-50" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-widest text-prius-black/50 block font-display">
                Atención Exclusiva
              </span>
              <h3 className="text-xl 2xl:text-2xl font-light uppercase tracking-tight leading-snug font-display text-prius-black">
                Tu próximo descanso<br /><span className="font-bold text-gold">comienza acá</span>
              </h3>
              <p className="text-prius-black/70 text-xs leading-relaxed font-light">
                Completá el cotizador paso a paso para recibir una propuesta a medida.
              </p>
            </div>

            {/* Datos de Contacto */}
            <div className="mt-6 pt-6 border-t border-hairline space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gold/15 rounded-full border border-gold/40 text-prius-black shrink-0">
                  <Phone size={14} className="text-prius-black" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-prius-black/50 mb-0.5 font-display">WhatsApp Directo</p>
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-xs 2xl:text-sm font-bold text-prius-black hover:text-gold transition-colors tracking-wide">
                    +54 223 576 5482
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gold/15 rounded-full border border-gold/40 text-prius-black shrink-0">
                  <Mail size={14} className="text-prius-black" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-prius-black/50 mb-0.5 font-display">Correo Electrónico</p>
                  <a href="mailto:reservas@priusplayagrande.com.ar"
                    className="text-xs 2xl:text-sm font-bold text-prius-black hover:text-gold transition-colors tracking-wide">
                    reservas@priusplayagrande.com.ar
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gold/15 rounded-full border border-gold/40 text-prius-black shrink-0">
                  <MapPin size={14} className="text-prius-black" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-prius-black/50 mb-0.5 font-display">Ubicación</p>
                  <p className="text-xs font-medium text-prius-black/80 tracking-wide leading-relaxed">
                    Balneario 7, Playa Grande, Mar del Plata
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario Interactivo Paso a Paso */}
          <div className="lg:col-span-8 p-6 md:p-8 2xl:p-10 bg-white flex flex-col justify-between min-h-[420px] lg:min-h-[440px]">
            
            {/* Barra de Progreso */}
            {status !== "success" && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider text-prius-black/40 font-display">
                    Paso {step} de 3
                  </span>
                  <span className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider text-prius-black font-display">
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
                <div className="flex flex-col items-center justify-center text-center py-6 animate-premium-fade">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold flex items-center justify-center mb-4 text-prius-black">
                    <Check size={24} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-wider text-prius-black mb-2 font-display">
                    ¡Solicitud Recibida!
                  </h4>
                  <p className="text-prius-black/70 text-xs max-w-md leading-relaxed font-light mb-6">
                    Tu consulta ha sido procesada con éxito. Un asesor de nuestro equipo se pondrá en contacto con vos a la brevedad.
                  </p>
                  <button 
                    onClick={() => {
                      setStatus("idle");
                      setStep(1);
                    }}
                    className="text-xs font-bold tracking-widest uppercase text-prius-black hover:text-gold transition-colors font-display cursor-pointer"
                  >
                    Realizar otra consulta →
                  </button>
                </div>
              ) : (
                <div className="animate-premium-fade">
                  
                  {/* PASO 1: Selección de Servicio */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
                          ¿Qué servicio te interesa cotizar?
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Seleccioná una de las opciones para personalizar tu presupuesto.
                        </p>
                      </div>

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
                                  ? "border-gold bg-gold/15 text-prius-black shadow-sm"
                                  : "border-hairline bg-white hover:border-gold/60 hover:bg-gold/5 text-prius-black/80"
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold uppercase tracking-tight font-display leading-tight truncate text-prius-black">
                                  {opt.label}
                                </h4>
                                <p className="text-[10px] text-prius-black/50 font-light mt-0.5 leading-tight truncate">
                                  {opt.desc}
                                </p>
                              </div>
                              
                              <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-gold text-prius-black" : "bg-neutral-100 text-prius-black/60"}`}>
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
                    <div className="space-y-4">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
                          Tus datos de contacto
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Completá tus datos para que podamos enviarte la cotización detallada.
                        </p>
                      </div>

                      <div className="space-y-3.5">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    <div className="space-y-4">
                      <div className="text-center md:text-left">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
                          Detalles adicionales
                        </h3>
                        <p className="text-prius-black/50 text-xs font-light">
                          Agregá cualquier detalle o requerimiento especial para tu reserva.
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        <div className="p-4 rounded-xl border border-hairline bg-neutral-50 space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gold font-display">Resumen de solicitud</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-prius-black/50 font-light">Servicio:</p>
                              <p className="font-bold text-prius-black uppercase font-display">{form.asunto}</p>
                            </div>
                            <div>
                              <p className="text-prius-black/50 font-light">Contacto:</p>
                              <p className="font-medium text-prius-black">{form.nombre}</p>
                            </div>
                          </div>
                        </div>

                        <Field label="Mensaje o aclaración (opcional)">
                          <textarea 
                            name="mensaje" 
                            value={form.mensaje} 
                            onChange={handleChange} 
                            rows={2}
                            placeholder="Fechas de interés, cantidad de personas, etc..."
                            className={`${inputClass(false)} resize-none`} 
                          />
                        </Field>
                      </div>

                      {status === "error" && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs leading-relaxed">
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Botones de Navegación Compactos */}
            {status !== "success" && (
              <div className="flex justify-between items-center pt-4 border-t border-hairline mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-prius-black/60 hover:text-prius-black transition-colors font-display cursor-pointer"
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
                    className="inline-flex h-9 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer gap-1.5 shadow-md"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="inline-flex h-9 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-1.5 shadow-md"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin text-prius-black" fill="none" viewBox="0 0 24 24">
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
      <label className="text-[9px] tracking-wider text-prius-black/60 uppercase font-bold font-display">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-light mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-2 py-2 bg-transparent border-b text-xs text-prius-black placeholder-prius-black/30 font-light",
    "focus:outline-none focus:border-gold transition-colors duration-300",
    hasError ? "border-red-400" : "border-hairline",
  ].join(" ");
}