"use client";

import TeamGrid from "../ui/team-grid";

export default function Team() {
  //  TODO: Add the image of the team with the flower shape
  return (
    <section
      className="flex flex-col items-center justify-center"
      aria-labelledby="team-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full mb-10 md:mb-14">
        <h2
          id="team-heading"
          className="bg-main rounded-md px-4 py-2 text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap"
        >
          Team
        </h2>
        <p className="text-base md:text-lg max-w-md">
          Meet the skilled and experienced team behind our successful digital
          marketing strategies
        </p>
      </div>

      {/* Team Grid */}
      <TeamGrid />

      <div className="w-full flex justify-end">
        <button className="px-16 py-4 bg-black text-white rounded-xl transition-colors w-fit cursor-pointer">
          See all team
        </button>
      </div>
    </section>
  );
}
