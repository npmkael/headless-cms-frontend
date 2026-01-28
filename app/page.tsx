// sections
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import CallToAction from "@/components/sections/call-to-action";
import CaseStudies from "@/components/sections/case-studies";
import Process from "@/components/sections/process";
import Team from "@/components/sections/team";
import Testimonials from "@/components/sections/testimonials";
import ContactUs from "@/components/sections/contact-us";

export default function Home() {
  // TODO: Refactor text highlights bg-main

  return (
    <main className="min-h-screen mx-auto max-w-7xl px-4 md:px-8 xl:px-0 flex flex-col gap-28">
      <Hero />
      <Services />
      <CallToAction />
      <CaseStudies />
      <Process />
      <Team />
      <Testimonials />
      <ContactUs />
    </main>
  );
}
