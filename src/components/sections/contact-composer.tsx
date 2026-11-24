"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { mailtoUrl, whatsappUrl } from "@/content/site";

/**
 * Redactor de mensaje sin servidor: arma el texto y lo abre ya escrito en
 * WhatsApp o en el cliente de correo de quien escribe. Nada se envía ni se
 * guarda desde este sitio.
 */
export function ContactComposer() {
  const id = useId();
  const [nombre, setNombre] = useState("");
  const [organizacion, setOrganizacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const compose = () => {
    const quien = nombre.trim()
      ? `Hola Andrés, soy ${nombre.trim()}${organizacion.trim() ? ` de ${organizacion.trim()}` : ""}.`
      : "Hola Andrés.";
    return `${quien} ${mensaje.trim()}`;
  };

  const validate = () => {
    const ok = mensaje.trim().length >= 5;
    setError(!ok);
    return ok;
  };

  const sendWhatsapp = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    window.open(whatsappUrl(compose()), "_blank", "noopener,noreferrer");
  };

  const sendMail = () => {
    if (!validate()) return;
    const asunto = `Contacto desde Evocenda${nombre.trim() ? ` · ${nombre.trim()}` : ""}`;
    window.location.href = mailtoUrl(asunto, compose());
  };

  const field =
    "mt-1.5 w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-neon focus:shadow-[0_0_0_3px_var(--glow-soft)]";

  return (
    <form onSubmit={sendWhatsapp} noValidate className="panel p-5 sm:p-6">
      <p className="eyebrow text-[0.66rem]">Escribe tu mensaje</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[0.86rem] text-muted" htmlFor={`${id}-nombre`}>
          Tu nombre
          <input
            id={`${id}-nombre`}
            name="nombre"
            autoComplete="name"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className={field}
            placeholder="Nombre y apellido"
          />
        </label>
        <label className="block text-[0.86rem] text-muted" htmlFor={`${id}-organizacion`}>
          Organización <span className="text-faint">(opcional)</span>
          <input
            id={`${id}-organizacion`}
            name="organizacion"
            autoComplete="organization"
            value={organizacion}
            onChange={(event) => setOrganizacion(event.target.value)}
            className={field}
            placeholder="Empresa o entidad"
          />
        </label>
      </div>
      <label className="mt-4 block text-[0.86rem] text-muted" htmlFor={`${id}-mensaje`}>
        Mensaje
        <textarea
          id={`${id}-mensaje`}
          name="mensaje"
          rows={4}
          value={mensaje}
          onChange={(event) => {
            setMensaje(event.target.value);
            if (error) setError(false);
          }}
          aria-invalid={error}
          aria-describedby={error ? `${id}-error` : `${id}-nota`}
          className={`${field} resize-y`}
          placeholder="Cuéntame qué necesitas: formación, una automatización, un proyecto…"
        />
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.84rem] text-warm">
          Escribe tu mensaje antes de enviarlo.
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button type="submit" className="btn btn-primary">
          <Icon name="whatsapp" size={17} />
          Enviar por WhatsApp
        </button>
        <button type="button" onClick={sendMail} className="btn btn-ghost">
          <Icon name="mail" size={17} />
          Enviar por correo
        </button>
      </div>
      <p id={`${id}-nota`} className="mt-4 flex items-start gap-2 text-[0.8rem] leading-relaxed text-faint">
        <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
        Este sitio no guarda ni envía tus datos: el mensaje se abre ya escrito en tu WhatsApp o en tu correo.
      </p>
    </form>
  );
}

/** Botón que copia un texto y lo confirma un momento. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(value)
          .then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          })
          .catch(() => undefined);
      }}
      className="icon-btn relative z-10 shrink-0"
      aria-label={copied ? "Copiado" : label}
      title={copied ? "Copiado" : label}
    >
      <Icon name={copied ? "check" : "copy"} size={15} className={copied ? "text-signal" : undefined} />
      <span className="sr-only" aria-live="polite">
        {copied ? "Copiado al portapapeles" : ""}
      </span>
    </button>
  );
}
