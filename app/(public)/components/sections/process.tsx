"use client";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/app/(public)/components/ui/accordion";

type WorkingProcess =
  | {
      id: string;
      step_no: number;
      title: string | null;
      description: string | null;
      is_active: boolean;
    }[]
  | null;

export default function Process({ processes }: { processes: WorkingProcess }) {
  return (
    <section
      className="flex flex-col items-center justify-center"
      aria-labelledby="process-heading"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full mb-10 md:mb-14">
        <h2
          id="process-heading"
          className="bg-main rounded-md px-1.5 py-1 text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap"
        >
          Our Working Process
        </h2>
        <p className="text-sm md:text-base max-w-sm">
          Step-by-Step Guide to Achieving Your Business Goals
        </p>
      </div>

      <Accordion mode="single" defaultOpen="consultation" className="w-full">
        {processes?.map((proccess) => (
          <AccordionItem
            key={proccess.id}
            id={proccess.id}
            number={proccess.step_no.toString()}
            title={proccess.title ?? ""}
          >
            <AccordionContent>{proccess.description ?? ""}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
