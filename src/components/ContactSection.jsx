"use client";

import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

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

// Soporte dual para process.env (Next/Cloudflare) y import.meta.env (Vite)
const N8N_WEBHOOK_URL = 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) || 
  (import.meta.env && import.meta.env.VITE_N8N_WEBHOOK_URL) || 
  "";

// ─── Component ────────────────────────────────────────────────────────────────

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
    <section id="contacto" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-2">
            RESERVAS & CONSULTAS
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            CONTACTATE CON{" "}
            <span className="text-[#F2CA50]">NUESTRO EQUIPO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-xl">
          <div className="lg:col-span-2 bg-gray-900 text-white p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#F2CA50] uppercase mb-4">
                CONTACTO EXCLUSIVO
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
                HABLEMOS DE SU
                <br />PRÓXIMA ESTADÍA
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nuestro equipo de atención personalizada está listo para
                diseñar su experiencia perfecta en Playa Grande.
              </p>
            </div>
            <div className="mt-10 space-y-5 border-t border-gray-700 pt-8">
              <div>
                <p className="text-xs tracking-[0.15em] text-[#F2CA50] uppercase mb-1">TELÉFONO / WHATSAPP</p>
                <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-[#F2CA50] transition-colors">
                  +54 223 576 5482
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] text-[#F2CA50] uppercase mb-1">EMAIL</p>
                <a href="mailto:info@priusplayagrande.com"
                  className="text-white font-semibold hover:text-[#F2CA50] transition-colors">
                  info@priusplayagrande.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] text-[#F2CA50] uppercase mb-1">UBICACIÓN</p>
                <p className="text-white font-semibold">Paseo Victoria Ocampo, Playa Grande</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-8 sm:p-10">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F2CA50]/15 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-[#F2CA50]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Solicitud enviada</h4>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  Recibimos tu consulta. Nuestro equipo se va a comunicar con vos por WhatsApp en breve.
                </p>
                <button onClick={() => setStatus("idle")}
                  className="mt-8 text-xs tracking-widest text-[#F2CA50] uppercase font-semibold hover:opacity-70 transition-opacity">
                  Enviar otra consulta →
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      className={`${inputClass(!!fieldErrors.asunto)} appearance-none pr-10 cursor-pointer ${form.asunto === "" ? "text-gray-400" : "text-gray-900"}`}>
                      <option value="" disabled>Seleccioná un asunto…</option>
                      {ASUNTO_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="text-gray-900">{opt}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Field>

                <Field label="Mensaje (opcional)">
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={3}
                    placeholder="Contanos qué necesitás, fechas de interés, cantidad de personas…"
                    className={`${inputClass(false)} resize-none`} />
                </Field>

                {status === "error" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={status === "loading"}
                  className="w-full py-4 bg-[#F2CA50] text-gray-900 text-xs font-bold tracking-[0.2em] uppercase rounded-none hover:bg-[#e0b93e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Enviando…
                    </>
                  ) : "ENVIAR SOLICITUD"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  También podés escribirnos directo por{" "}
                  <a href="https://wa.me/542235765482" target="_blank" rel="noopener noreferrer"
                    className="text-[#F2CA50] font-semibold hover:opacity-70 transition-opacity">
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-[0.12em] text-gray-500 uppercase font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full px-0 py-2.5 bg-transparent border-b text-sm text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:border-[#F2CA50] transition-colors duration-200",
    hasError ? "border-red-400" : "border-gray-200",
  ].join(" ");
}