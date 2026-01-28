import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  titleHighlight?: string;
  illustration?: string;
  href?: string;
  variant?: "light" | "dark" | "green";
}

const variants = {
  light: {
    bg: "bg-gray-100",
    titleBg: "bg-[#B9FF66]",
    titleText: "text-black",
    buttonBg: "bg-black",
    buttonIcon: "text-[#B9FF66]",
    buttonText: "text-black",
    border: "border-black",
  },
  dark: {
    bg: "bg-[#191A23]",
    titleBg: "bg-white",
    titleText: "text-black",
    buttonBg: "bg-white",
    buttonIcon: "text-black",
    buttonText: "text-white",
    border: "border-black",
  },
  green: {
    bg: "bg-[#B9FF66]",
    titleBg: "bg-white",
    titleText: "text-black",
    buttonBg: "bg-black",
    buttonIcon: "text-[#B9FF66]",
    buttonText: "text-black",
    border: "border-black",
  },
};

export default function ServiceCard({
  title,
  titleHighlight,
  illustration,
  href = "#",
  variant = "light",
}: ServiceCardProps) {
  const theme = variants[variant];

  return (
    <div
      className={`${theme.bg} rounded-[45px] md:rounded-[45px] border ${theme.border} shadow-[0px_5px_0px_0px_rgba(0,0,0,1)] md:shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12 flex flex-col md:flex-row justify-between gap-6 md:gap-0 min-h-[280px] md:min-h-[300px] hover:shadow-[0px_7px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow`}
    >
      <div className="flex flex-col items-start justify-between flex-1">
        <div className="flex-1">
          <h3
            className={`text-xl md:text-2xl lg:text-3xl font-medium ${theme.titleText}`}
          >
            <span
              className={`${theme.titleBg} px-2 py-1 rounded-md inline-block`}
            >
              {titleHighlight || title.split(" ")[0]}
            </span>
            <br />
            <span
              className={`${theme.titleBg} px-2 py-1 rounded-md inline-block`}
            >
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h3>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-2 md:gap-3 mt-6 md:mt-8 group w-fit"
        >
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${theme.buttonBg} flex items-center justify-center group-hover:opacity-80 transition-opacity`}
          >
            <ArrowUpRight
              className={`w-6 h-6 md:w-8 md:h-8 ${theme.buttonIcon}`}
            />
          </div>
          <span
            className={`text-base md:text-lg font-normal ${theme.buttonText}`}
          >
            Learn more
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-center md:justify-end flex-shrink-0">
        {illustration && (
          <Image
            src={illustration}
            alt={title}
            width={192}
            height={192}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
          />
        )}
      </div>
    </div>
  );
}
