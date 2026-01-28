import Link from "next/link";
import Image from "next/image";

export default function CallToAction() {
  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-0">
      <div className="bg-gray-100 rounded-[30px] md:rounded-[45px] p-8 md:p-12 lg:p-16 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-visible relative">
        <div className="flex-1 max-w-lg z-10">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6">
            Let's make things happen
          </h3>
          <p className="text-base md:text-lg mb-8 text-gray-700">
            Contact us today to learn more about how our digital marketing
            services can help your business grow and succeed online.
          </p>
          <Link
            href="#proposal"
            className="inline-block bg-[#191A23] text-white px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all text-base md:text-lg font-normal"
          >
            Get your free proposal
          </Link>
        </div>

        <div className="flex-shrink-0 relative w-full lg:w-auto flex items-center justify-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-16">
          <Image
            src="/images/cta/cta-1.png"
            alt="Let's make things happen"
            width={400}
            height={300}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
