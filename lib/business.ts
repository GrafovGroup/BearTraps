import { z } from "zod";
export const businessSchema = z
  .object({
    phone: z
      .object({
        e164: z.string().regex(/^\+[1-9]\d{7,14}$/),
        display: z
          .string()
          .trim()
          .min(8)
          .max(40)
          .regex(/^[+\d ().-]+$/),
        confirmedAt: z
          .string()
          .datetime()
          .refine((v) => Date.parse(v) <= Date.now()),
        confirmationReference: z.string().trim().min(3).max(200),
      })
      .strict()
      .refine(
        (p) =>
          p.display.replace(/\D/g, "") === p.e164.slice(1) ||
          (p.e164.startsWith("+1") &&
            "1" + p.display.replace(/\D/g, "") === p.e164.slice(1)),
        "Display must match the confirmed number",
      )
      .nullable(),
  })
  .strict();
export function phoneLink(input: unknown) {
  const { phone } = businessSchema.parse(input);
  return phone
    ? { href: `tel:${phone.e164}`, label: phone.display, e164: phone.e164 }
    : null;
}
