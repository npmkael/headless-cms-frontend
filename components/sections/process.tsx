"use client";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";

// Process steps data
const processSteps = [
  {
    id: "consultation",
    number: "01",
    title: "Consultation",
    content:
      "During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.",
  },
  {
    id: "research",
    number: "02",
    title: "Research and Strategy Development",
    content:
      "Our team conducts thorough market research and competitive analysis to develop a data-driven strategy. We identify key opportunities and create a comprehensive roadmap aligned with your business objectives and target audience preferences.",
  },
  {
    id: "implementation",
    number: "03",
    title: "Implementation",
    content:
      "We bring the strategy to life through careful execution across all relevant channels. Our team handles everything from content creation to campaign setup, ensuring consistent messaging and optimal performance from day one.",
  },
  {
    id: "monitoring",
    number: "04",
    title: "Monitoring and Optimization",
    content:
      "We continuously track key performance indicators and analyze campaign data in real-time. Our team makes data-driven adjustments to optimize performance, maximize ROI, and ensure your marketing efforts are always improving.",
  },
  {
    id: "reporting",
    number: "05",
    title: "Reporting and Communication",
    content:
      "Receive detailed reports on campaign performance with clear insights and actionable recommendations. We maintain open lines of communication with regular check-ins to discuss progress and address any questions or concerns.",
  },
  {
    id: "improvement",
    number: "06",
    title: "Continual Improvement",
    content:
      "Marketing is an ongoing process. We continuously refine strategies based on results and changing market conditions. Our commitment to continual improvement ensures your marketing stays ahead of the competition.",
  },
];

export default function Process() {
  return (
    <section
      className="flex flex-col items-center justify-center"
      aria-labelledby="process-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full mb-10 md:mb-14">
        <h2
          id="process-heading"
          className="bg-main rounded-md px-4 py-2 text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap"
        >
          Our Working Process
        </h2>
        <p className="text-base md:text-lg max-w-sm">
          Step-by-Step Guide to Achieving Your Business Goals
        </p>
      </div>

      {/* Accordion */}
      <Accordion mode="single" defaultOpen="consultation" className="w-full">
        {processSteps.map((step) => (
          <AccordionItem
            key={step.id}
            id={step.id}
            number={step.number}
            title={step.title}
          >
            <AccordionContent>{step.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
