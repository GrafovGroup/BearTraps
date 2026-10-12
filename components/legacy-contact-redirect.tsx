"use client";
import { useEffect } from "react";
export default function LegacyContactRedirect() {
  useEffect(() => {
    window.location.replace("/contact/");
  }, []);
  return null;
}
