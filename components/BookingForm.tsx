"use client";

import { useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { COUNTRIES, EVENT_TYPES, FORMULAS, isEmail, isoDay, isPhone, requestMessage, takenDates, waLink, type Request } from "@/lib/booking";

const empty: Request = { type: "", date: "", city: "", country: "", guests: "", formula: "", budget: "", name: "", phone: "", email: "", message: "" };
type Errors = Partial<Record<"type" | "name" | "phone" | "email", string>>;

export function BookingForm() {
  const { lang, d } = useLocale();
  const b = d.booking;
  const [q, setQ] = useState<Request>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof Request>(k: K, v: Request[K]) => setQ((p) => ({ ...p, [k]: v }));
  const taken = q.date && takenDates.has(q.date);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!q.type) err.type = b.errors.type;
    if (!q.name.trim()) err.name = b.errors.name;
    if (!isPhone(q.phone)) err.phone = b.errors.phone;
    if (q.email && !isEmail(q.email)) err.email = b.errors.email;
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

  return (
    <form onSubmit={submit} noValidate className="card space-y-9 p-6 md:p-10">
      <fieldset>
        <legend className="label">{b.type}</legend>
        <div className="mt-1 flex flex-wrap gap-2" id="f-type" tabIndex={-1} {...aria("type")}>
          {EVENT_TYPES.map((t) => (
            <label key={t} className="chip">
              <input type="radio" name="type" value={t} checked={q.type === t} onChange={() => set("type", t)} className="sr-only" />
              {b.types[t]}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="f-date" className="label">
            {b.date}
          </label>
          <input id="f-date" type="date" className="field" min={isoDay(new Date())} value={q.date} onChange={(e) => set("date", e.target.value)} />
          {taken && <p className="mt-2 text-[0.8125rem] text-terra-deep">{b.dateTaken}</p>}
        </div>
        <div>
          <label htmlFor="f-guests" className="label">
            {b.guests}
          </label>
          <input id="f-guests" type="number" inputMode="numeric" min={1} className="field" value={q.guests} onChange={(e) => set("guests", e.target.value)} />
        </div>
        <div>
          <label htmlFor="f-city" className="label">
            {b.city}
          </label>
          <input id="f-city" type="text" className="field" autoComplete="address-level2" value={q.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <fieldset>
          <legend className="label">{b.country}</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <label key={c} className="chip">
                <input type="radio" name="country" value={c} checked={q.country === c} onChange={() => set("country", c)} className="sr-only" />
                {b.countries[c]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className="label">{b.formula}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {FORMULAS.map((f) => (
            <label key={f} className="chip">
              <input type="radio" name="formula" value={f} checked={q.formula === f} onChange={() => set("formula", f)} className="sr-only" />
              {b.formulas[f]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="f-budget" className="label">
          {b.budget} <span className="font-normal text-muted">({b.optional})</span>
        </label>
        <input id="f-budget" type="text" className="field" value={q.budget} onChange={(e) => set("budget", e.target.value)} />
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <label htmlFor="f-name" className="label">
            {b.name}
          </label>
          <input id="f-name" type="text" className="field" autoComplete="name" required value={q.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="f-phone" className="label">
            {b.phone}
          </label>
          <input id="f-phone" type="tel" dir="ltr" className="field rtl:text-end" autoComplete="tel" required value={q.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="f-email" className="label">
            {b.email} <span className="font-normal text-muted">({b.optional})</span>
          </label>
          <input id="f-email" type="email" dir="ltr" className="field rtl:text-end" autoComplete="email" value={q.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="f-message" className="label">
          {b.message}
        </label>
        <textarea id="f-message" rows={4} className="field resize-y" placeholder={b.messagePlaceholder} value={q.message} onChange={(e) => set("message", e.target.value)} />
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
