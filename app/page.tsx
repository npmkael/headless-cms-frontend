// sections
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";

export default function Home() {
  return (
    <main className="min-h-screen mx-auto max-w-[1280px] px-4 md:px-8 xl:px-0 flex flex-col gap-16">
      <Hero />
      <Services />
    </main>
  );
}
