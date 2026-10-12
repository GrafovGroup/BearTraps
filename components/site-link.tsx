import NextLink from "next/link";
import type { ComponentProps } from "react";
// Static hosting: fetch route data on navigation, not speculative background requests.
export default function SiteLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}
