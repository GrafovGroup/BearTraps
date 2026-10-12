import configuration from "@/content/business.json";
import { phoneLink } from "@/lib/business";
export default function BusinessPhone({ className }: { className?: string }) {
  const phone = phoneLink(configuration);
  return phone ? (
    <a className={className} href={phone.href}>
      CALL {phone.label}
    </a>
  ) : null;
}
