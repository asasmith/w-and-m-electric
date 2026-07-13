"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type NavigationProps = {
  companyName: string;
  phone: string;
};

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

function BoltMark() {
  return (
    <svg aria-hidden="true" className="h-9 w-8 text-copper" viewBox="0 0 60 96" fill="currentColor">
      <path d="M38 0 6 52h20L17 96l37-58H33z" />
    </svg>
  );
}

export default function Navigation({ companyName, phone }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-steel/40 bg-ink/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link className="flex items-center gap-3" href="/">
            <BoltMark />
            <div>
              <span className="block font-display text-2xl uppercase tracking-[0.08em] text-paper">{companyName}</span>
              <span className="block font-mono text-[0.7rem] uppercase tracking-[0.22em] text-steel">Licensed residential + commercial</span>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className={`text-sm uppercase tracking-[0.18em] transition ${isActive(pathname, link.href) ? "text-paper" : "text-steel hover:text-paper"}`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <a className="border border-copper bg-copper px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-amber hover:text-ink" href={toTelHref(phone)}>
              Call Now
            </a>
          </div>

          <button
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="border border-steel/50 px-3 py-2 text-paper md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            type="button"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Menu</span>
          </button>
        </div>

        {isOpen ? (
          <div className="border-t border-steel/40 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  className={`border px-4 py-3 text-sm uppercase tracking-[0.18em] ${isActive(pathname, link.href) ? "border-paper text-paper" : "border-steel/40 text-steel"}`}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a className="border border-copper bg-copper px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper" href={toTelHref(phone)}>
                Call {phone}
              </a>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
