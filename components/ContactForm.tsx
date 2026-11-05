"use client";

import { useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { CONTACT_TYPES, isEmail, isPhone, requestMessage, waLink, type Request } from "@/lib/booking";

const empty: Request = { type: "message", name: "", phone: "", email: "", message: "" };
type Errors = Partial<Record<"type" | "name" | "phone" | "email" | "message", string>>;

/** Formulaire de contact : rien n'est enregistré, le message s'ouvre dans WhatsApp, rédigé dans la langue du visiteur. */
export function ContactForm() {
  const { lang, d } = useLocale();
  const b = d.booking;
  const [q, setQ] = useState<Request>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof Request>(k: K, v: Request[K]) => setQ((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!q.type) err.type = b.errors.type;
    if (!q.name.trim()) err.name = b.errors.name;
    if (q.phone && !isPhone(q.phone)) err.phone = b.errors.phone;
    if (q.email && !isEmail(q.email)) err.email = b.errors.email;
    if (!q.message.trim()) err.message = b.errors.message;
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`f-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    window.open(waLink(requestMessage(q, lang, d)), "_blank", "noopener,noreferrer");
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`e-${k}`} className="mt-2 text-[0.8125rem] text-[#a8341c]" role="alert">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `e-${k}` : undefined });
  const opt = <span className="font-normal text-muted">({b.optional})</span>;

  return (
    <form onSubmit={submit} noValidate className="card space-y-8 p-6 md:p-10">
      <fieldset>
        <legend className="label">{b.type}</legend>
        <div className="mt-1 flex flex-wrap gap-2" id="f-type" tabIndex={-1} {...aria("type")}>
          {CONTACT_TYPES.map((t) => (
            <label key={t} className="chip">
              <input type="radio" name="type" value={t} checked={q.type === t} onChange={() => set("type", t)} className="sr-only" />
              {b.types[t]}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="f-name" className="label">
            {b.name}
          </label>
          <input id="f-name" type="text" className="field" autoComplete="name" required value={q.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="f-phone" className="label">
            {b.phone} {opt}
          </label>
          <input id="f-phone" type="tel" dir="ltr" className="field rtl:text-end" autoComplete="tel" value={q.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="f-email" className="label">
            {b.email} {opt}
          </label>
          <input id="f-email" type="email" dir="ltr" className="field rtl:text-end" autoComplete="email" value={q.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="f-message" className="label">
          {b.message}
        </label>
        <textarea id="f-message" rows={6} className="field resize-y" placeholder={b.messagePlaceholder} value={q.message} onChange={(e) => set("message", e.target.value)} {...aria("message")} />
        {err("message")}
      </div>

      <div className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn">
          <WhatsAppIcon className="h-4 w-4" />
          {b.submit}
        </button>
        <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className="inline-flex min-h-11 items-center gap-3 text-muted hover:text-ink">
          <PhoneIcon className="h-4 w-4" />
          {b.call} · <span dir="ltr">{lang === "he" ? site.phone : site.phoneIntl}</span>
        </a>
      </div>
      <p className="text-[0.8125rem] leading-relaxed text-muted">{b.note}</p>
    </form>
  );
}
