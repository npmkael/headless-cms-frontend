"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

const links = [
  {
    label: "About us",
    href: "#about",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Use Cases",
    href: "#use-cases",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Blog",
    href: "#blog",
  },
];

// TODO: Mobile
// TODO: Make background blurry
// TODO: Add animations to the links

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <nav className="flex justify-between items-center py-6 px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="Positivus"
              width={36}
              height={36}
            />
            <h2 className="text-3xl font-semibold">Positivus</h2>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <ul className="flex items-center gap-10 text-base">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="#quote"
              className="px-8 py-4 border border-black rounded-xl hover:bg-black hover:text-white transition-colors"
            >
              Request a quote
            </Link>
          </div>

          <div className="lg:hidden">
            {isOpen ? (
              <XIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            ) : (
              <MenuIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            )}
          </div>
        </nav>
      </header>

      {isOpen && (
        <div className="fixed top-[70px] inset-0 z-30 bg-white/20 backdrop-blur-sm px-4 block lg:hidden">
          <div className="bg-white rounded-3xl border border-black w-full mt-8 p-8 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li key={link.href} className="group">
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 text-lg hover:text-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t">
              <Link
                href="#quote"
                className="block text-center px-8 py-4 border border-black rounded-xl hover:bg-black hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
