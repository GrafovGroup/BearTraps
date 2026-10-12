"use client";
import { useRef, useState } from "react";
import { useBasket } from "./use-basket";
import QuoteBasket from "./quote-basket";
import {
  provinces,
  timezones,
  buyerTypes,
  quoteSchema,
  type Quote,
} from "@/lib/quote";
import { rfqSummary } from "@/lib/rfq-summary";
import { httpDelivery, type Receipt } from "@/lib/rfq-delivery";
const endpoint = process.env.NEXT_PUBLIC_RFQ_ENDPOINT || "";
export default function QuoteForm() {
  const { items, ready, update } = useBasket();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [deliveryError, setDeliveryError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const retry = useRef<{ payload: string; key: string } | null>(null);
  function save(items: Parameters<typeof update>[0]) {
    if (!update(items))
      setStatus(
        "Selections are retained for this tab only because browser storage is unavailable.",
      );
  }
  function validate(form: HTMLFormElement): Quote | null {
    const data = new FormData(form);
    const result = quoteSchema.safeParse({
      ...Object.fromEntries(data),
      items,
      eligibility: data.get("eligibility") === "on",
      consent: data.get("consent") === "on",
    });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues)
        next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setStatus("");
      requestAnimationFrame(() => errorRef.current?.focus());
      return null;
    }
    setErrors({});
    return result.data;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quote = validate(event.currentTarget);
    if (!quote) return;
    const content = rfqSummary(quote);
    setSummary(content);
    const action =
      (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ||
      "download";
    if (action === "print") {
      requestAnimationFrame(() => window.print());
      return;
    }
    if (action === "send") {
      if (!endpoint) return;
      const payload = JSON.stringify(quote);
      if (retry.current?.payload !== payload)
        retry.current = { payload, key: crypto.randomUUID() };
      setSending(true);
      setDeliveryError("");
      setReceipt(null);
      try {
        const accepted = await httpDelivery(endpoint).submit(
          quote,
          retry.current!.key,
        );
        setReceipt(accepted);
        setStatus(
          "Your request was accepted for review. Reference: " +
            accepted.reference,
        );
      } catch {
        setDeliveryError(
          "Receipt could not be confirmed. Download a copy, or retry the same request. Do not assume it was delivered.",
        );
      } finally {
        setSending(false);
      }
      return;
    }
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "beartraps-equipment-request.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "Your RFQ file has been prepared for download. No request has been submitted.",
    );
  }
  const field = (
    name: string,
    label: string,
    type = "text",
    required = false,
  ) => (
    <label className="field" htmlFor={name} key={name}>
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={name === "email" ? 254 : 2000}
        autoComplete={
          (
            {
              name: "name",
              organization: "organization",
              email: "email",
              phone: "tel",
            } as Record<string, string>
          )[name] || "off"
        }
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      />
      {errors[name] && (
        <span className="error" id={name + "-error"}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  const select = (
    name: string,
    label: string,
    options: readonly string[],
    required = false,
  ) => (
    <label className="field" htmlFor={name}>
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        id={name}
        defaultValue=""
        required={required}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace("America/", "").replaceAll("_", " ")}
          </option>
        ))}
      </select>
      {errors[name] && (
        <span className="error" id={name + "-error"}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  const area = (name: string, label: string) => (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <textarea
        id={name}
        name={name}
        rows={3}
        maxLength={2000}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      />
      {errors[name] && (
        <span className="error" id={name + "-error"}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  return (
    <>
      <section className="section quote-layout">
        <QuoteBasket
          items={items}
          ready={ready}
          update={save}
          error={errors.items}
        />
        <form onSubmit={submit} noValidate>
          <fieldset disabled={sending} className="quote-fields">
            <legend className="eyebrow">02 / PROJECT DETAILS</legend>
            <h2>Tell us what the job needs.</h2>
            <p>
              Fields marked * are required. Provide document references, not
              confidential attachments.
            </p>
            {Object.keys(errors).length > 0 && (
              <div
                tabIndex={-1}
                ref={errorRef}
                className="error-summary"
                role="alert"
              >
                <strong>Review your request</strong>
                <ul>
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>
                      <a href={"#" + key}>{value}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="form-grid">
              {field("name", "CONTACT NAME", "text", true)}
              {field("organization", "ORGANIZATION", "text", true)}
              {select("buyerType", "BUYER TYPE", buyerTypes, true)}
              {field("email", "EMAIL", "email", true)}
              {field("phone", "PHONE", "tel", true)}
              {select("province", "PROVINCE / TERRITORY", provinces, true)}
              {field("destination", "DELIVERY DESTINATION", "text", true)}
              {field("desiredDate", "DELIVERY DEADLINE", "date")}
            </div>
            <fieldset className="tender-fields">
              <legend>TENDER & PROCUREMENT DETAILS</legend>
              <p>
                For a tender, include its closing date, local time and time
                zone. An RFQ here does not submit a tender bid.
              </p>
              <div className="form-grid">
                {field("tenderReference", "TENDER REFERENCE")}
                {field("closingDate", "TENDER CLOSING DATE", "date")}
                {field("closingTime", "TENDER CLOSING TIME", "time")}
                {select("closingTimezone", "CLOSING TIME ZONE", timezones)}
              </div>
              {field("procurementReference", "PROCUREMENT DOCUMENT REFERENCE")}
            </fieldset>
            {area("requirements", "TECHNICAL REQUIREMENTS")}
            {area("freightNeeds", "FREIGHT / UNLOADING NEEDS")}
            {area("installationNeeds", "INSTALLATION REQUIREMENTS")}
            {area("notes", "ADDITIONAL NOTES")}
            <p className="form-note">
              Installation requirements inform equipment sourcing. Installation
              services and availability require separate confirmation.
            </p>
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {[
              [
                "eligibility",
                "I understand that product availability, compatibility, buyer authorization and jurisdiction requirements must be confirmed before supply.",
              ],
              [
                "consent",
                "I authorize inclusion of these contact and project details in this RFQ. I understand that downloading or printing does not send it.",
              ],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="checkbox">
                  <input
                    id={name}
                    name={name}
                    type="checkbox"
                    required
                    aria-invalid={!!errors[name]}
                    aria-describedby={
                      errors[name] ? name + "-error" : undefined
                    }
                  />
                  <span>{label} *</span>
                </label>
                {errors[name] && (
                  <p className="error" id={name + "-error"}>
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}
            <div className="rfq-actions">
              <button
                className="button amber"
                value="download"
                type="submit"
                disabled={!ready}
              >
                DOWNLOAD YOUR RFQ ↓
              </button>
              <button
                className="button dark"
                value="print"
                type="submit"
                disabled={!ready}
              >
                PRINT RFQ / SAVE PDF
              </button>
            </div>
            <div className="delivery-panel">
              <h3>Send your equipment request</h3>
              <p>
                Use your downloaded RFQ to contact{" "}
                <a href="mailto:info@beartraps.ca">info@beartraps.ca</a>.
                Opening your email app does not send a request automatically.
              </p>
              <button
                className="button dark"
                type="submit"
                value="send"
                disabled={!endpoint || !ready || sending}
                aria-describedby="delivery-state"
              >
                {sending
                  ? "SENDING…"
                  : endpoint
                    ? "SUBMIT RFQ"
                    : "ONLINE SUBMISSION UNAVAILABLE"}
              </button>
              <p id="delivery-state" className="form-note">
                {endpoint
                  ? "A receipt appears only after the delivery service confirms acceptance."
                  : "Download or print your RFQ to retain a copy and email it yourself."}
              </p>
              {deliveryError && (
                <p role="alert" className="error">
                  {deliveryError}
                </p>
              )}
              {receipt && (
                <p role="status">
                  Accepted for review: {receipt.reference}. Acceptance does not
                  confirm product availability or eligibility.
                </p>
              )}
            </div>
            <p role="status" className="form-status">
              {status}
            </p>
            <p className="form-note">
              Equipment selections and line specifications are saved in this
              browser. Contact and project fields are not saved. Clear the
              equipment list on shared devices.
            </p>
          </fieldset>
        </form>
      </section>
      <section className="print-rfq" aria-label="Prepared RFQ summary">
        <pre>{summary}</pre>
      </section>
    </>
  );
}
