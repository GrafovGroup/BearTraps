"use client";
import Link from "@/components/site-link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactSchema, contactMailto } from "@/lib/contact";
import { contactDelivery } from "@/lib/contact-delivery";
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "";
export default function ContactForm() {
  const params = useSearchParams();
  const product = params.get("product") || "";
  const reference = /^https:\/\/beartraps\.ca\/products\/[a-z0-9-]+\/$/.test(
    product,
  )
    ? product
    : "";
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {},
  );
  const [message, setMessage] = useState("");
  const [mailto, setMailto] = useState("");
  const [busy, setBusy] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const retry = useRef({ payload: "", key: "" });
  function errorFocus() {
    requestAnimationFrame(() => summary.current?.focus());
  }
  return (
    <section className="section contact-form-section">
      <h2>Talk to our team</h2>
      <p>
        Ask about equipment, specifications or procurement needs. Our team
        handles quotations and orders directly. Do not include confidential
        documents or sensitive personal information.
      </p>
      <form
        noValidate
        onChange={() => {
          setMailto("");
          setMessage("");
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const data = Object.fromEntries(new FormData(event.currentTarget));
          const parsed = contactSchema.safeParse({
            ...data,
            consent: data.consent === "on",
          });
          setMailto("");
          setMessage("");
          if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);
            errorFocus();
            return;
          }
          setErrors({});
          if (!endpoint) {
            setMailto(contactMailto(parsed.data));
            setMessage(
              "Your email is prepared. Open your email app below, review it and send it yourself. Nothing has been submitted by this website.",
            );
            return;
          }
          setBusy(true);
          const payload = JSON.stringify(parsed.data);
          if (retry.current.payload !== payload)
            retry.current = { payload, key: crypto.randomUUID() };
          try {
            const receipt = await contactDelivery(endpoint).submit(
              parsed.data,
              retry.current.key,
            );
            setMessage(
              `Accepted for processing. Reference: ${receipt.reference}. This confirms receipt by the service, not delivery to our inbox.`,
            );
          } catch {
            setMessage(
              "Receipt was not confirmed. Retry or email info@beartraps.ca directly.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {Object.keys(errors).length > 0 && (
          <div
            className="error-summary"
            role="alert"
            tabIndex={-1}
            ref={summary}
          >
            <h3>Review your message</h3>
            <ul>
              {Object.entries(errors).map(([key, messages]) => (
                <li key={key}>
                  <a href={`#contact-${key}`}>{messages?.[0]}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <fieldset disabled={busy}>
          <legend className="sr-only">Your contact details and enquiry</legend>
          {[
            ["name", "NAME", "text", true, 100],
            [
              "organization",
              "COMPANY / ORGANIZATION (OPTIONAL)",
              "text",
              false,
              160,
            ],
            ["email", "EMAIL", "email", true, 254],
            ["phone", "PHONE (OPTIONAL)", "tel", false, 40],
            ["subject", "SUBJECT / PRODUCT OF INTEREST", "text", true, 200],
          ].map(([key, label, type, required, max]) => (
            <label
              className="field"
              key={String(key)}
              htmlFor={`contact-${key}`}
            >
              <span id={`label-${key}`}>{label}</span>
              <input
                id={`contact-${key}`}
                name={String(key)}
                aria-labelledby={`label-${key}`}
                type={String(type)}
                required={Boolean(required)}
                maxLength={Number(max)}
                defaultValue={
                  key === "subject"
                    ? (params.get("interest") || "").slice(0, 200)
                    : ""
                }
                aria-invalid={Boolean(errors[String(key)])}
                aria-describedby={
                  errors[String(key)] ? `error-${key}` : undefined
                }
              />
              {errors[String(key)] && (
                <span id={`error-${key}`} className="field-error">
                  {errors[String(key)]?.[0]}
                </span>
              )}
            </label>
          ))}
          <label className="field" htmlFor="contact-message">
            <span id="label-message">MESSAGE</span>
            <textarea
              id="contact-message"
              name="message"
              aria-labelledby="label-message"
              rows={6}
              maxLength={3000}
              required
              defaultValue={
                reference ? `I am interested in ${reference}\n` : ""
              }
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "error-message" : undefined}
            />
            {errors.message && (
              <span className="field-error" id="error-message">
                {errors.message[0]}
              </span>
            )}
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              WEBSITE
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <label className="consent">
            <input
              id="contact-consent"
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "error-consent" : undefined}
            />{" "}
            I agree that BearTraps.ca may use these details to respond to my
            enquiry.
          </label>
          {errors.consent && (
            <p className="field-error" id="error-consent">
              {errors.consent[0]}
            </p>
          )}
          <p>
            See our <Link href="/privacy/">privacy information</Link>.
          </p>
          <button className="button amber" type="submit">
            {busy ? "SENDING…" : endpoint ? "SEND MESSAGE" : "PREPARE EMAIL"}
          </button>
        </fieldset>
        <p role="status" aria-live="polite">
          {message}
        </p>
        {mailto && (
          <a className="button dark" href={mailto}>
            OPEN EMAIL APP ↗
          </a>
        )}
        {!endpoint && (
          <p>
            You can prepare your message here and send it through your own email
            app, or email{" "}
            <a href="mailto:info@beartraps.ca">info@beartraps.ca</a> directly.
            Preparing an email does not send it.
          </p>
        )}
      </form>
    </section>
  );
}
