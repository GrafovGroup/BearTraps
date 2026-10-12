import { z } from "zod";
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(100),
    organization: z.string().trim().max(160),
    email: z.string().trim().email("Enter a valid email").max(254),
    phone: z
      .string()
      .trim()
      .max(40)
      .regex(/^[+\d\s().x-]*$/, "Enter a valid phone number"),
    subject: z.string().trim().min(2, "Enter a subject or product").max(200),
    message: z
      .string()
      .trim()
      .min(10, "Please add a little more detail")
      .max(3000),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Confirm permission to contact you" }),
    }),
    website: z.string().max(0),
  })
  .strict();
export type Contact = z.infer<typeof contactSchema>;
export function contactMailto(contact: Contact): string {
  const c = contactSchema.parse(contact);
  return `mailto:info@beartraps.ca?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(`Name: ${c.name}\nOrganization: ${c.organization}\nEmail: ${c.email}\nPhone: ${c.phone}\n\n${c.message}`)}`;
}
export function productContactHref(p: {
  title: string;
  sku: string;
  model?: string;
  slug: string;
}) {
  return `/contact/?interest=${encodeURIComponent([p.title, p.model, p.sku].filter(Boolean).join(" / ").slice(0, 200))}&product=${encodeURIComponent(`https://beartraps.ca/products/${p.slug}/`)}`;
}
