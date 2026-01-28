import Image from "next/image";

const brandLogos = [
  "amazon",
  "dribble",
  "hubspot",
  "notion",
  "netflix",
  "zoom",
];

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-0">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12">
        <div className="flex flex-col gap-6 md:gap-8 xl:gap-12 max-w-full md:max-w-[400px] xl:max-w-[520px]">
          <h1 className="text-3xl md:text-4xl xl:text-6xl font-medium">
            Navigating the digital landscape for success
          </h1>

          <p className="text-base md:text-base xl:text-lg">
            Our digital marketing agency helps businesses grow and succeed
            online through a range of services including SEO, PPC, social media
            marketing, and content creation.
          </p>
          <button className="px-8 py-4 bg-black text-white rounded-xl transition-colors w-fit cursor-pointer">
            Book a consultation
          </button>
        </div>
        <div className="w-full md:w-auto md:flex-1 max-w-[400px] md:max-w-none">
          <Image
            src="/images/hero-illustration.jpg"
            alt="Hero"
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-4 xl:gap-8 w-full mt-12 md:mt-14 xl:mt-16">
        {brandLogos.map((logo) => (
          <Image
            key={logo}
            src={`/logo/${logo}-logo.svg`}
            alt={logo}
            width={120}
            height={40}
            className="h-auto w-20 md:w-24 xl:w-28 object-contain grayscale opacity-70"
          />
        ))}
      </div>
    </section>
  );
}
