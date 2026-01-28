"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactUs() {
  const [formType, setFormType] = useState<"sayHi" | "getQuote">("sayHi");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ formType, ...formData });
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full mb-10 md:mb-14">
        <h2
          id="team-heading"
          className="bg-main rounded-md px-1.5 py-1 text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap"
        >
          Contact Us
        </h2>
        <p className="text-sm md:text-base max-w-xs">
          Connect with Us: Let's Discuss Your Digital Marketing Needs
        </p>
      </div>

      <div className="w-full bg-[#F3F3F3] rounded-3xl p-8 md:p-12 lg:py-16 lg:pl-16 lg:pr-0 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-6">
            {/* Radio Buttons */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="formType"
                    checked={formType === "sayHi"}
                    onChange={() => setFormType("sayHi")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${
                      formType === "sayHi"
                        ? "border-black bg-black"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {formType === "sayHi" && (
                      <div className="absolute inset-0.5 bg-main border-4 border-white rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-base">Say Hi</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="formType"
                    checked={formType === "getQuote"}
                    onChange={() => setFormType("getQuote")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border ${
                      formType === "getQuote"
                        ? "border-black bg-black"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {formType === "getQuote" && (
                      <div className="absolute inset-0.5 bg-main border-4 border-white rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-base">Get a Quote</span>
              </label>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email<span className="text-black">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">
                Message<span className="text-black">*</span>
              </label>
              <textarea
                id="message"
                placeholder="Message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-main/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-black/90 transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Decorative Section */}
          <div className="hidden lg:block absolute -right-64">
            <Image
              src="/images/cta/cta-2.png"
              alt="Contact Us"
              width={550}
              height={650}
              className="object-contain object-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
