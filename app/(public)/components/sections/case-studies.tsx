import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type CaseStudy =
  | {
      id: string;
      title: string | null;
      short_description: string | null;
      cover_image_url: string | null;
      link_url: string | null;
      is_active: boolean;
    }[]
  | null;

export default function CaseStudies({
  caseStudies,
}: {
  caseStudies: CaseStudy;
}) {
  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full mb-12">
        <h2 className="bg-[#B9FF66] rounded-md px-1.5 py-1 text-3xl md:text-4xl font-semibold whitespace-nowrap">
          Case Studies
        </h2>
        <p className="text-sm md:text-base max-w-xl">
          Explore Real-Life Examples of Our Proven Digital Marketing Success
          through Our Case Studies
        </p>
      </div>

      <div className="bg-black rounded-[30px] md:rounded-[45px] p-8 md:p-12 lg:p-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {caseStudies ? (
            caseStudies.map(
              (caseStudy, index) =>
                caseStudy.is_active && (
                  <div
                    key={caseStudy.id}
                    className={`flex flex-col justify-between gap-6 ${
                      index !== caseStudies.length - 1
                        ? "md:border-r md:border-white md:pr-8 lg:pr-12"
                        : ""
                    } ${index !== 0 ? "md:pl-8 lg:pl-12" : ""}`}
                  >
                    <p className="text-white text-base md:text-lg leading-relaxed">
                      {caseStudy.short_description}
                    </p>
                    <Link
                      href={caseStudy.link_url ?? ""}
                      className="inline-flex items-center gap-2 text-[#B9FF66] hover:opacity-80 transition-opacity group w-fit"
                    >
                      <span className="text-lg md:text-xl">Learn more</span>
                      <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                )
            )
          ) : (
            <div>
              <p>No case studies found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
