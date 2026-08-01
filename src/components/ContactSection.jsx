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
    <section id="contacto" className="min-h-screen flex flex-col justify-center bg-neutral-950 py-20 2xl:py-32 px-margin-mobile md:px-margin-desktop relative overflow-hidden text-white">
      
      {/* Fondo fotográfico de costa de alta calidad con overlay de luz y filtros */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/images/playa-grande-aerea.webp" 
          alt="Costa Prius Playa Grande" 
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-neutral-950" />
        <div className="absolute top-1/4 left-1/4 w-[600px] 2xl:w-[900px] h-[600px] 2xl:h-[900px] bg-gold/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] 2xl:w-[1000px] h-[700px] 2xl:h-[1000px] bg-gold/10 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1240px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto w-full relative z-10">
        
        {/* Header de Sección para 4K con Títulos Grandes */}
        <div className="mb-12 2xl:mb-16 text-center">
          <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.35em] text-gold block mb-2 font-display">
            Cotizador Interactivo & Atención Directa
          </span>
          <h2 className="text-3xl md:text-5xl 2xl:text-6xl 3xl:text-7xl font-normal tracking-tight text-white uppercase font-display leading-tight">
            Diseñá tu <span className="text-gold font-bold">Experiencia</span>
          </h2>
          <p className="text-white/60 text-xs md:text-sm 2xl:text-base max-w-2xl mx-auto font-light mt-3">
            Elegí el servicio de tu interés y recibí asesoramiento inmediato de nuestro equipo de atención en Playa Grande.
          </p>

          {/* Badges de Garantía de Servicio (Aporta riqueza visual a los lados) */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/80">
              <Zap size={14} className="text-gold" />
              <span>Respuesta en menos de 2 horas</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/80">
              <Clock size={14} className="text-gold" />
              <span>Atención 9:00 a 19:00 hs</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/80">
              <Award size={14} className="text-gold" />
              <span>Reserva Directa Sin Intermediarios</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Estructura Bento Integrada y Escalada para 4K */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/15 rounded-3xl overflow-hidden bg-neutral-900/90 backdrop-blur-2xl shadow-2xl">
          
          {/* Bloque Izquierdo: Información de Contacto */}
          <div className="lg:col-span-4 relative text-white p-8 2xl:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden min-h-[380px] lg:min-h-[580px] 2xl:min-h-[640px]">
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/prius-home-desktop.jpg" 
                alt="Costa Prius" 
                className="w-full h-full object-cover opacity-30 filter brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/95 via-neutral-900/90 to-neutral-950/95" />
            </div>

            <div className="relative z-10 space-y-3">
              <span className="text-[9px] 2xl:text-xs font-bold uppercase tracking-widest text-gold block font-display">
                Atención Exclusiva
              </span>
              <h3 className="text-2xl 2xl:text-3xl 3xl:text-4xl font-light uppercase tracking-tight leading-snug font-display">
                Tu próximo descanso<br /><span className="font-bold text-gold">comienza acá</span>
              </h3>
              <p className="text-white/70 text-xs 2xl:text-sm leading-relaxed font-light">
                Completá el cotizador paso a paso para recibir una propuesta a medida con beneficios especiales.
              </p>
            </div>

            {/* Datos de Contacto */}
            <div className="mt-8 pt-8 border-t border-white/15 space-y-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full border border-gold/30 text-gold shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5 font-display">WhatsApp Directo</p>
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-sm 2xl:text-base font-medium text-white hover:text-gold transition-colors tracking-wide">
                    +54 223 576 5482
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full border border-gold/30 text-gold shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5 font-display">Correo Electrónico</p>
                  <a href="mailto:reservas@priusplayagrande.com.ar"
                    className="text-sm 2xl:text-base font-medium text-white hover:text-gold transition-colors tracking-wide">
                    reservas@priusplayagrande.com.ar
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full border border-gold/30 text-gold shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5 font-display">Ubicación</p>
                  <p className="text-xs 2xl:text-sm font-light text-white/90 tracking-wide leading-relaxed">
                    Balneario 7, Playa Grande, Mar del Plata
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario Interactivo Step-by-Step */}
          <div className="lg:col-span-8 p-8 2xl:p-14 bg-neutral-950/60 flex flex-col justify-between min-h-[480px] lg:min-h-[580px] 2xl:min-h-[640px]">
            
            {/* Barra de Progreso Minimalista */}
            {status !== "success" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-white/50 font-display">
                    Paso {step} de 3
                  </span>
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-gold font-display">
                    {step === 1 ? "Selección de Servicio" : step === 2 ? "Datos Personales" : "Confirmación"}
                  </span>
                </div>
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
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
                <div className="flex flex-col items-center justify-center text-center py-10 animate-premium-fade">
                  <div className="w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-6 text-gold">
                    <Check size={32} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-xl 2xl:text-3xl font-bold uppercase tracking-wider text-white mb-3 font-display">
                    ¡Solicitud Recibida!
                  </h4>
                  <p className="text-white/70 text-xs 2xl:text-sm max-w-md leading-relaxed font-light mb-8">
                    Tu consulta ha sido procesada con éxito. Un asesor de nuestro equipo se pondrá en contacto con vos a la brevedad a través de WhatsApp o correo electrónico.
                  </p>
                  <button 
                    onClick={() => {
                      setStatus("idle");
                      setStep(1);
                    }}
                    className="text-xs 2xl:text-sm font-bold tracking-widest uppercase text-gold hover:text-white transition-colors font-display cursor-pointer"
                  >
                    Realizar otra consulta →
                  </button>
                </div>
              ) : (
                <div className="animate-premium-fade">
                  
                  {/* PASO 1: Selección de Servicio */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-base md:text-lg 2xl:text-xl font-bold uppercase tracking-wider text-white font-display mb-1.5">
                          ¿Qué servicio te interesa cotizar?
                        </h3>
                        <p className="text-white/50 text-xs 2xl:text-sm font-light">
                          Seleccioná una de las opciones para personalizar tu presupuesto.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 2xl:gap-4">
                        {ASUNTO_OPTIONS.map((opt) => {
                          const IconComponent = opt.icon;
                          const isSelected = form.asunto === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectAsunto(opt.id)}
                              className={`p-4 2xl:p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer w-full ${
                                isSelected
                                  ? "border-gold bg-gold/15 text-white shadow-lg shadow-gold/10"
                                  : "border-white/10 bg-white/5 hover:border-gold/50 hover:bg-white/10 text-white/80"
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs 2xl:text-sm font-bold uppercase tracking-tight font-display leading-tight truncate text-white">
                                  {opt.label}
                                </h4>
                                <p className="text-[10px] 2xl:text-xs text-white/50 font-light mt-1 leading-tight truncate">
                                  {opt.desc}
                                </p>
                              </div>
                              
                              <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? "bg-gold text-prius-black" : "bg-white/10 text-gold"}`}>
                                <IconComponent size={16} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {fieldErrors.asunto && (
                        <p className="text-xs text-red-400 text-center md:text-left font-light">
                          {fieldErrors.asunto}
                        </p>
                      )}
                    </div>
                  )}

                  {/* PASO 2: Datos Personales */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-base md:text-lg 2xl:text-xl font-bold uppercase tracking-wider text-white font-display mb-1.5">
                          Tus datos de contacto
                        </h3>
                        <p className="text-white/50 text-xs 2xl:text-sm font-light">
                          Completá tus datos para que podamos enviarte la cotización detallada.
                        </p>
                      </div>

                      <div className="space-y-5">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <div className="space-y-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-base md:text-lg 2xl:text-xl font-bold uppercase tracking-wider text-white font-display mb-1.5">
                          Detalles adicionales
                        </h3>
                        <p className="text-white/50 text-xs 2xl:text-sm font-light">
                          Agregá cualquier detalle o requerimiento especial para tu reserva.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                          <span className="text-[9px] 2xl:text-xs font-bold uppercase tracking-wider text-gold font-display">Resumen de solicitud</span>
                          <div className="grid grid-cols-2 gap-3 text-xs 2xl:text-sm">
                            <div>
                              <p className="text-white/40 font-light">Servicio:</p>
                              <p className="font-bold text-white uppercase font-display">{form.asunto}</p>
                            </div>
                            <div>
                              <p className="text-white/40 font-light">Contacto:</p>
                              <p className="font-medium text-white">{form.nombre}</p>
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
                        <div className="bg-red-900/30 border border-red-500/40 text-red-200 rounded-xl p-4 text-xs 2xl:text-sm leading-relaxed">
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
              <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors font-display cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Volver
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-11 2xl:h-12 items-center justify-center rounded-full bg-gold px-8 2xl:px-10 text-xs 2xl:text-sm font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer gap-2 shadow-lg shadow-gold/20"
                  >
                    Siguiente <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="inline-flex h-11 2xl:h-12 items-center justify-center rounded-full bg-gold px-8 2xl:px-10 text-xs 2xl:text-sm font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-2 shadow-lg shadow-gold/20"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-prius-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Solicitud <Check size={16} />
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] 2xl:text-xs tracking-wider text-white/50 uppercase font-bold font-display">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-400 font-light mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-2 py-2.5 bg-transparent border-b text-xs 2xl:text-sm text-white placeholder-white/30 font-light",
    "focus:outline-none focus:border-gold transition-colors duration-300",
    hasError ? "border-red-400" : "border-white/20",
  ].join(" ");
}