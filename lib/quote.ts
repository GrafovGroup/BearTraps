import { z } from "zod";
import { provinces, timezones } from "./geography.ts";
import { lineSchema } from "./line-items.ts";
export { provinces, timezones } from "./geography.ts";
export const buyerTypes = [
  "Government",
  "Municipality",
  "Parks or conservation",
  "Authorized wildlife professional",
  "Commercial organization",
  "Other",
] as const;
const text = z.string().trim().max(2000);
export function validDate(v: string) {
  return (
    v === "" ||
    (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v)
  );
}
const date = z.string().refine(validDate, "Enter a valid date");
export function deadlineInstants(
  date: string,
  time: string,
  timezone: string,
): number[] {
  if (
    !date ||
    !time ||
    !timezone ||
    !validDate(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  )
    return [];
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const base = Date.parse(`${date}T${time}:00Z`);
  const matches: number[] = [];
  for (let minutes = -840; minutes <= 840; minutes += 15) {
    const candidate = base + minutes * 60000;
    const parts = Object.fromEntries(
      formatter.formatToParts(candidate).map((p) => [p.type, p.value]),
    );
    if (
      `${parts.year}-${parts.month}-${parts.day}` === date &&
      `${parts.hour}:${parts.minute}` === time
    )
      matches.push(candidate);
  }
  return matches;
}
export const quoteSchema = z
  .object({
    name: text.min(2, "Enter your name"),
    organization: text.min(2, "Enter your organization"),
    buyerType: z.enum(buyerTypes),
    email: z.string().trim().email("Enter a valid email").max(254),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a phone number")
      .max(40)
      .regex(/^[+\d\s().x-]+$/, "Enter a valid phone number"),
    province: z.enum(provinces),
    destination: text.min(5, "Enter a delivery destination"),
    desiredDate: date,
    tenderReference: text,
    closingDate: date,
    closingTime: z
      .string()
      .regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid closing time"),
    closingTimezone: z.union([z.literal(""), z.enum(timezones)]),
    procurementReference: text,
    requirements: text,
    freightNeeds: text,
    installationNeeds: text,
    notes: text,
    eligibility: z.literal(true, {
      errorMap: () => ({
        message: "Acknowledge the equipment eligibility requirements",
      }),
    }),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Confirm permission to include these details in the RFQ",
      }),
    }),
    website: z.string().max(0),
    items: z
      .array(lineSchema)
      .min(1, "Add at least one equipment requirement")
      .max(50, "Use at most 50 line items"),
  })
  .superRefine((d, ctx) => {
    if (new Set(d.items.map((i) => i.id)).size !== d.items.length)
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message: "Each RFQ line needs a unique identifier",
      });
    if (
      d.closingDate ||
      d.closingTime ||
      d.closingTimezone ||
      d.tenderReference
    ) {
      for (const key of [
        "closingDate",
        "closingTime",
        "closingTimezone",
      ] as const)
        if (!d[key])
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Provide the tender closing date, time and time zone",
          });
      if (d.closingDate && d.closingTime && d.closingTimezone) {
        const instants = deadlineInstants(
          d.closingDate,
          d.closingTime,
          d.closingTimezone,
        );
        if (instants.length !== 1)
          ctx.addIssue({
            code: "custom",
            path: ["closingTime"],
            message:
              "This local time is missing or ambiguous at a daylight-saving change. Specify an unambiguous closing time.",
          });
        else if (instants[0] <= Date.now())
          ctx.addIssue({
            code: "custom",
            path: ["closingDate"],
            message: "The tender deadline must be in the future",
          });
      }
      if (d.desiredDate && d.closingDate && d.desiredDate < d.closingDate)
        ctx.addIssue({
          code: "custom",
          path: ["desiredDate"],
          message: "Delivery deadline cannot precede tender closing date",
        });
    }
  });
export type Quote = z.infer<typeof quoteSchema>;
