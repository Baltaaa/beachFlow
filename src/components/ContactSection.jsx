"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Check, ChevronDown } from "lucide-react";

const ASUNTO_OPTIONS = [
  "Reserva de carpas / sombrillas",
  "Pileta & solárium",
  "Masajes & wellness",
  "Cabinas & lockers",
  "Evento corporativo",
  "Cumpleaños / fiesta de 15",
  "Casamiento",
  "Prius Club",
  "Otra consulta",
];

const N8N_WEBHOOK_URL = 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) || 
  (import.meta.env && import.meta.env.VITE_N8N_WEBHOOK_URL) || 
  "";

export default function ContactSection() {
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

  function validate() {
    const errors = {};
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
    if (!form.asunto) errors.asunto = "Seleccioná un asunto.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
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
        throw new Error("Webhook URL no configurada. Definí NEXT_PUBLIC_N8N_WEBHOOK_URL en .env.");
      }
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setForm({ nombre: "", telefono: "", email: "", asunto: "", mensaje: "" });
    } catch (err) {
      console.error("Error enviando lead:", err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message.includes("Webhook")
          ? err.message
          : "Algo salió mal. Intentá de nuevo o escribinos directamente por WhatsApp."
      );
    }
  }

  return (
    <section id="contacto" className="bg-white py-24 px-margin-mobile md:px-margin-desktop border-t border-hairline">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado Coherente con Services y Events */}
        <div className="mb-12 max-w-xl">
          <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
            Reservas & Consultas
          </span>
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
            Contactate con <span className="text-gold">Nuestro Equipo</span>
          </h2>
        </div>

        {/* Estructura Cohesiva Tipo Bento - Sin Sombras y con Bordes Hairline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-hairline rounded-lg overflow-hidden bg-white">
          
          {/* Bloque Izquierdo: Información Minimalista Premium */}
          <div className="lg:col-span-5 bg-prius-black text-white p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-2 block font-display">
                Contacto Privado
              </span>
              <h3 className="text-xl md:text-2xl font-light uppercase tracking-tight leading-tight mb-4 font-display">
                Hablemos de su<br />Próxima Estadía
              </h3>
              <p className="text-white/60 text-xs leading-relaxed font-light max-w-sm">
                Nuestro equipo de atención personalizada está listo para diseñar su experiencia perfecta en Playa Grande.
              </p>
            </div>

            <div className="mt-12 space-y-6 border-t border-white/10 pt-8 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Phone size={13} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 mb-0.5">WhatsApp Directo</p>
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-xs font-light text-white hover:text-gold transition-colors tracking-wide">
                    +54 223 576 5482
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Mail size={13} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 mb-0.5">Correo Electrónico</p>
                  <a href="mailto:info@priusplayagrande.com"
                    className="text-xs font-light text-white hover:text-gold transition-colors tracking-wide">
                    info@priusplayagrande.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <MapPin size={13} />
                </div>
                <div>
                  <p className="text-[8px] font-normal uppercase tracking-widest text-white/40 mb-0.5">Ubicación</p>
                  <p className="text-xs font-light text-white/90 tracking-wide">
                    Paseo Victoria Ocampo, Playa Grande
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario de Diseño Limpio y Refinado */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-white flex flex-col justify-center">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-premium-fade">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 text-gold">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-prius-black mb-1.5 font-display">
                  Solicitud Enviada
                </h4>
                <p className="text-prius-black/60 text-xs max-w-xs leading-relaxed font-light">
                  Recibimos tu consulta. Nuestro equipo se va a comunicar con vos por WhatsApp a la brevedad.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-[9px] font-bold tracking-widest uppercase text-gold hover:text-prius-black transition-colors font-display"
                >
                  Enviar otra consulta →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Nombre completo" error={fieldErrors.nombre}>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                      placeholder="Ej. Juan Pérez" className={inputClass(!!fieldErrors.nombre)} />
                  </Field>
                  <Field label="Teléfono / WhatsApp" error={fieldErrors.telefono}>
                    <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                      placeholder="+54 223 000 0000" className={inputClass(!!fieldErrors.telefono)} />
                  </Field>
                </div>

                <Field label="Correo electrónico" error={fieldErrors.email}>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="ejemplo@mail.com" className={inputClass(!!fieldErrors.email)} />
                </Field>

                <Field label="Asunto de interés" error={fieldErrors.asunto}>
                  <div className="relative">
                    <select name="asunto" value={form.asunto} onChange={handleChange}
                      className={`${inputClass(!!fieldErrors.asunto)} appearance-none pr-10 cursor-pointer ${form.asunto === "" ? "text-prius-black/40" : "text-prius-black"}`}>
                      <option value="" disabled>Seleccioná un asunto…</option>
                      {ASUNTO_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-prius-black">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prius-black/40" />
                  </div>
                </Field>

                <Field label="Mensaje (opcional)">
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={2}
                    placeholder="Contanos qué necesitás, fechas de interés, cantidad de personas…"
                    className={`${inputClass(false)} resize-none`} />
                </Field>

                {status === "error" && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded p-3 text-xs">
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Botón Refinado - Exactamente con el mismo estilo y tamaño que el del Nav */}
                <button 
                  onClick={handleSubmit} 
                  disabled={status === "loading"}
                  className="w-full h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-gold text-prius-black hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed flex gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin text-prius-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Enviando...
                    </>
                  ) : "Enviar Solicitud"}
                </button>

                <p className="text-center text-[10px] text-prius-black/40 font-light tracking-wide">
                  También podés escribirnos directo por{" "}
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="font-bold text-gold hover:underline transition-all">
                    WhatsApp
                  </a>
                </p>
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
      <label className="text-[8px] tracking-widest text-prius-black/50 uppercase font-bold font-display">{label}</label>
      {children}
      {error && (
        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-light">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-1 py-2 bg-transparent border-b text-xs text-prius-black placeholder-prius-black/35 font-light",
    "focus:outline-none focus:border-gold transition-colors duration-300",
    hasError ? "border-red-400" : "border-hairline",
  ].join(" ");
}