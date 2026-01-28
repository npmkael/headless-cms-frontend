import Hero from "@/app/(public)/components/sections/hero";
import Services from "@/app/(public)/components/sections/services";
import CallToAction from "@/app/(public)/components/sections/call-to-action";
import CaseStudies from "@/app/(public)/components/sections/case-studies";
import Process from "@/app/(public)/components/sections/process";
import Team from "@/app/(public)/components/sections/team";
import Testimonials from "@/app/(public)/components/sections/testimonials";
import ContactUs from "@/app/(public)/components/sections/contact-us";
import Footer from "@/app/(public)/components/sections/footer";

import { createClient } from "@/lib/supabase/server";

// TODO: Add error handling
// TODO: Add loading state
// TODO: pass states to the other sections

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: services },
    { data: caseStudies },
    { data: workingProcesses },
    { data: teamMembers },
    { data: testimonials },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("case_studies")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("working_processes")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return (
    <>
      <Hero />
      <Services services={services} />
      <CallToAction />
      <CaseStudies caseStudies={caseStudies} />
      <Process workingProcesses={workingProcesses} />
      <Team />
      <Testimonials />
      <ContactUs />
      <Footer />
    </>
  );
}
