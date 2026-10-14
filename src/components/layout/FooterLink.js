"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Footer link that highlights itself on its own page.
export default function FooterLink({ href, children }) {
  const isActive = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${isActive ? "text-cyan-400" : ""} hover:text-cyan-400 transition-colors`}
    >
      {children}
    </Link>
  );
}
