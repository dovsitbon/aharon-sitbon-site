"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/components/providers";
import { WhatsAppIcon } from "@/components/icons";
import { formatDay, isEmail, isoDay, isPhone, waLink } from "@/lib/booking";

const TYPES = ["chuppah", "evening", "gala", "community", "other"] as const;
type T = (typeof TYPES)[number];
type Q = { type: T | ""; date: string; city: string; name: string; phone: string; email: string; message: string };
type Errors = Partial<Record<"type" | "name" | "phone" | "email", string>>;

/** Demande de « moment » (houppa, soirée, gala) : rien n'est enregistré, le message s'ouvre dans WhatsApp. */
export function GuestForm() {
  const { lang, d } = useLocale();
  const g = d.guest.form;
  const b = d.booking;
  const [q, setQ] = useState<Q>({ type: "", date: "", city: "", name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof Q>(k: K, v: Q[K]) => setQ((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!q.type) err.type = b.errors.type;
    if (!q.name.trim()) err.name = b.errors.name;
    if (!isPhone(q.phone)) err.phone = b.errors.phone;
    if (q.email && !isEmail(q.email)) err.email = b.errors.email;
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`g-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    const c = lang === "fr" ? " :" : ":";
    const line = (l: string, v: string) => (v ? `${l}${c} ${v}` : "");
    const text = [
      [`*${g.waTitle}*`],
      [line(g.type, q.type ? g.types[q.type] : ""), line(g.waDate, q.date ? formatDay(q.date, lang) : ""), line(g.waCity, q.city)],
      [line(b.wa.name, q.name), line(b.wa.phone, q.phone), line(b.wa.email, q.email)],
      [line(b.wa.message, q.message)],
      [b.wa.closing],
    ]
      .map((x) => x.filter(Boolean).join("\n"))
      .filter(Boolean)
      .join("\n\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`ge-${k}`} className="mt-2 text-[0.8125rem] text-[#a8341c]" role="alert">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `ge-${k}` : undefined });
  const opt = <span className="font-normal text-muted">({b.optional})</span>;

  return (
    <form onSubmit={submit} noValidate className="card space-y-7 p-6 md:p-9">
      <h3 className="display text-[1.8rem]">{g.title}</h3>
      <fieldset>
        <legend className="label">{g.type}</legend>
        <div className="mt-1 flex flex-wrap gap-2" id="g-type" tabIndex={-1} {...aria("type")}>
          {TYPES.map((t) => (
            <label key={t} className="chip">
              <input type="radio" name="gtype" value={t} checked={q.type === t} onChange={() => set("type", t)} className="sr-only" />
              {g.types[t]}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="g-date" className="label">
            {g.date} {opt}
          </label>
          <input id="g-date" type="date" className="field" min={isoDay(new Date())} value={q.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div>
          <label htmlFor="g-city" className="label">
            {g.city} {opt}
          </label>
          <input id="g-city" type="text" className="field" value={q.city} onChange={(e) => set("city", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="g-name" className="label">
            {b.name}
          </label>
          <input id="g-name" type="text" className="field" autoComplete="name" value={q.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="g-phone" className="label">
            {b.phone}
          </label>
          <input id="g-phone" type="tel" dir="ltr" className="field rtl:text-end" autoComplete="tel" value={q.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="g-email" className="label">
            {b.email} {opt}
          </label>
          <input id="g-email" type="email" dir="ltr" className="field rtl:text-end" autoComplete="email" value={q.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="g-message" className="label">
          {b.message} {opt}
        </label>
        <textarea id="g-message" rows={4} className="field resize-y" placeholder={b.messagePlaceholder} value={q.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      <button type="submit" className="btn">
        <WhatsAppIcon className="h-4 w-4" />
        {g.submit}
      </button>
    </form>
  );
}
