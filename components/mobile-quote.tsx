"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileContact() {
  const path = usePathname().replace(/\/$/, "");
  if (
    [
      "/contact",
      "/privacy",
      "/terms",
      "/request-quote",
      "/equipment-package",
    ].includes(path)
  )
    return null;
  return (
    <aside className="mobile-quote" aria-label="Contact shortcut">
      <Link className="button amber" href="/contact/">
        CONTACT US ↗
      </Link>
    </aside>
  );
}
