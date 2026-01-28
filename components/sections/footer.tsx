"use client";

import { Facebook, Linkedin, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "About us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: <LinkedinIcon className="w-5 h-5" />,
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  // TODO: Working form submit

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white rounded-t-[45px] mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-8 md:px-14 py-12 md:py-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 md:mb-16">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="Positivus"
              width={28}
              height={28}
              className="invert"
            />
            <span className="text-3xl font-medium">Positivus</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white underline underline-offset-4 hover:text-main transition-colors text-sm md:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-main transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-10 mb-12 md:mb-16">
          <div className="space-y-5">
            <h3 className="bg-main text-black px-1.5 rounded-md text-lg font-medium w-fit">
              Contact us:
            </h3>
            <div className="space-y-4 text-white">
              <p>
                Email:{" "}
                <Link
                  href="mailto:info@positivus.com"
                  className="hover:text-main transition-colors"
                >
                  info@positivus.com
                </Link>
              </p>
              <p>
                Phone:{" "}
                <Link
                  href="tel:555-567-8901"
                  className="hover:text-main transition-colors"
                >
                  555-567-8901
                </Link>
              </p>
              <div>
                <p>Address: 1234 Main St</p>
                <p>Moonstone City, Stardust State 12345</p>
              </div>
            </div>
          </div>

          <div className="">
            <form
              onSubmit={handleSubscribe}
              className="bg-[#292A32] h-full rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 w-full sm:w-auto bg-transparent border border-white rounded-xl px-5 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-main transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-main text-black font-medium px-6 py-3 rounded-xl hover:bg-main/90 transition-colors whitespace-nowrap"
              >
                Subscribe to news
              </button>
            </form>
          </div>
        </div>

        <div className="w-full h-px bg-white mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-8 text-sm text-white">
          <p>&copy; 2023 Positivus. All Rights Reserved.</p>
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
