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
    <section id="contacto" className="bg-white py-16 px-margin-mobile md:px-margin-desktop border-t border-hairline">
      {/* Contenedor principal con un ancho máximo más compacto (max-w-[1040px]) */}
      <div className="max-w-[1040px] mx-auto">
        
        {/* Encabezado Coherente & Compacto */}
        <div className="mb-8">
          <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
            Reservas & Consultas
          </span>
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
            Contactate con <span className="text-gold">Nuestro Equipo</span>
          </h2>
        </div>

        {/* Estructura Bento Compacta con Altura Ajustada */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-hairline rounded-xl overflow-hidden bg-white">
          
          {/* Bloque Izquierdo: Compacto con Imagen de Trasfondo y Overlay Oscuro */}
          <div className="md:col-span-5 relative text-white p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-hairline/10 overflow-hidden min-h-[340px] md:min-h-auto">
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/bg-desktop.webp" 
                alt="Fondo Costa Prius" 
                className="w-full h-full object-cover grayscale opacity-45"
              />
              {/* Overlay oscuro y degradado para excelente contraste de lectura */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/95 via-neutral-900/90 to-neutral-950/95" />
            </div>

            {/* Contenido en primer plano */}
            <div className="relative z-10">
              <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-1 block font-display">
                Atención Exclusiva
              </span>
              <h3 className="text-lg md:text-xl font-light uppercase tracking-tight leading-snug mb-3 font-display">
                Su próximo descanso<br />comienza acá
              </h3>
              <p className="text-white/60 text-[11px] leading-relaxed font-light max-w-xs">
                Complete el formulario y reciba asesoramiento personalizado para diseñar la estadía que busca en Playa Grande.
              </p>
            </div>

            {/* Datos de Contacto más Compactos */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Phone size={11} />
                </div>
                <div>
                  <p className="text-[7px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">WhatsApp</p>
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-light text-white hover:text-gold transition-colors tracking-wide">
                    +54 223 576 5482
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <Mail size={11} />
                </div>
                <div>
                  <p className="text-[7px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">Email</p>
                  <a href="mailto:info@priusplayagrande.com"
                    className="text-[11px] font-light text-white hover:text-gold transition-colors tracking-wide">
                    info@priusplayagrande.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/5 rounded-full border border-white/10 text-gold shrink-0">
                  <MapPin size={11} />
                </div>
                <div>
                  <p className="text-[7px] font-normal uppercase tracking-widest text-white/40 leading-none mb-0.5">Ubicación</p>
                  <p className="text-[11px] font-light text-white/90 tracking-wide">
                    Paseo Victoria Ocampo, Playa Grande
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario Estructurado y Ajustado (Compacto) */}
          <div className="md:col-span-7 p-6 md:p-8 bg-neutral-50/50 flex flex-col justify-center">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 animate-premium-fade">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-3 text-gold">
                  <Check size={16} strokeWidth={2.5} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black mb-1 font-display">
                  Solicitud Recibida
                </h4>
                <p className="text-prius-black/60 text-[11px] max-w-[240px] leading-relaxed font-light">
                  Nos pondremos en contacto a la brevedad a través de WhatsApp. ¡Muchas gracias!
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-[8px] font-bold tracking-widest uppercase text-gold hover:text-prius-black transition-colors font-display"
                >
                  Enviar otra consulta →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className={`${inputClass(!!fieldErrors.asunto)} appearance-none pr-8 cursor-pointer ${form.asunto === "" ? "text-prius-black/35" : "text-prius-black"}`}>
                      <option value="" disabled>Seleccioná una opción…</option>
                      {ASUNTO_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-prius-black">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-prius-black/40" />
                  </div>
                </Field>

                <Field label="Mensaje (opcional)">
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={1}
                    placeholder="Fechas de interés, cantidad de personas, etc..."
                    className={`${inputClass(false)} resize-none`} />
                </Field>

                {status === "error" && (
                  <div className="bg-red-50 border border-red-100 text-red-700 rounded-md p-2.5 text-[10px] leading-relaxed">
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Botón Compacto Estilo Nav / Hero */}
                <button 
                  onClick={handleSubmit} 
                  disabled={status === "loading"}
                  className="w-full h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-gold text-prius-black hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed flex gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-3 h-3 animate-spin text-prius-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Enviando...
                    </>
                  ) : "Enviar Solicitud"}
                </button>
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
    <div className="flex flex-col gap-0.5">
      <label className="text-[7.5px] tracking-wider text-prius-black/50 uppercase font-bold font-display">{label}</label>
      {children}
      {error && (
        <p className="text-[9px] text-red-500 mt-0.5 font-light">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-0.5 py-1.5 bg-transparent border-b text-[11px] text-prius-black placeholder-prius-black/30 font-light",
    "focus:outline-none focus:border-gold transition-colors duration-300",
    hasError ? "border-red-400" : "border-hairline",
  ].join(" ");
}