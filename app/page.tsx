// sections
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import CallToAction from "@/components/sections/call-to-action";

export default function Home() {
  return (
    <main className="min-h-screen mx-auto max-w-7xl px-4 md:px-8 xl:px-0 flex flex-col gap-28">
      <Hero />
      <Services />
      <CallToAction />
    </main>
  );
}
