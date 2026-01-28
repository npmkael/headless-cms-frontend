import Hero from "@/app/(public)/components/sections/hero";
import Services from "@/app/(public)/components/sections/services";
import CallToAction from "@/app/(public)/components/sections/call-to-action";
import CaseStudies from "@/app/(public)/components/sections/case-studies";
import Process from "@/app/(public)/components/sections/process";
import Team from "@/app/(public)/components/sections/team";
import Testimonials from "@/app/(public)/components/sections/testimonials";
import ContactUs from "@/app/(public)/components/sections/contact-us";
import Footer from "@/app/(public)/components/sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <CallToAction />
      <CaseStudies />
      <Process />
      <Team />
      <Testimonials />
      <ContactUs />
      <Footer />
    </>
  );
}
