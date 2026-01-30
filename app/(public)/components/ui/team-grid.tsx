"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

interface TeamMember {
  id: string;
  name: string | null;
  role: string | null;
  avatar_url: string | null;
  socials_json: string | null;
  is_active: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

interface TeamCardProps {
  member: TeamMember;
  id: string;
}

function TeamCard({ member, id }: TeamCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="group relative bg-white rounded-[35px] border border-black shadow-[0px_5px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col cursor-pointer transition-colors"
    >
      <div className="flex items-end gap-4 mb-4">
        {/* Clover Avatar Shape */}
        <div className="relative shrink-0 w-[76px] h-[76px] self-end">
          {/* Black shadow (offset) */}
          <Image
            src="/logo/flower-bob.svg"
            alt=""
            width={70}
            height={70}
            className="absolute top-1 left-1.5"
            aria-hidden="true"
          />
          {/* Green clover shape */}
          <svg
            width="70"
            height="70"
            viewBox="0 0 98 98"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-1.5 top-0"
          >
            <path
              d="M83.8068 48.9117C116.649 86.3213 86.3213 116.649 48.9117 83.8068C11.5021 116.649 -18.8258 86.3213 14.0166 48.9117C-18.8258 11.5021 11.5021 -18.8258 48.9117 14.0166C86.3213 -18.8258 116.649 11.5021 83.8068 48.9117Z"
              fill="#B9FF66"
            />
          </svg>
          {/* Avatar image clipped to clover shape */}
          {true && (
            <div
              className="absolute right-1.5 top-0 w-[70px] h-[70px] overflow-hidden"
              style={{
                clipPath:
                  "path('M59.85 35.11C83.66 62.11 61.71 83.66 35.11 59.85C8.28 83.66 -13.57 62.11 10.09 35.11C-13.57 8.28 8.28 -13.57 35.11 10.09C62.11 -13.57 83.66 8.28 59.85 35.11Z')",
              }}
            >
              <Image
                src="/images/team/team-1.jpg"
                alt={member.name || "Team member"}
                fill
                className="object-cover grayscale scale-130"
              />
              {/* Green overlay for tint effect */}
              <div className="absolute inset-0 bg-main/90 mix-blend-multiply" />
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div className="flex-1 pt-2">
          <h3 className="text-lg font-semibold text-black">{member.name}</h3>
          <p className="text-sm text-gray-700">{member.role}</p>
        </div>

        {/* LinkedIn Icon */}
        {member.socials_json && (
          <div className="shrink-0 place-items-start h-full">
            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <Linkedin className="w-5 h-5 text-main" />
            </Link>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-black mb-4" />

      {/* Experience/Description */}
      <p className="text-sm text-black leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore optio
        minima quo ea delectum.
      </p>
    </motion.div>
  );
}

export default function TeamGrid({
  teamMembers,
}: {
  teamMembers: TeamMember[] | null;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mb-8"
    >
      {teamMembers ? (
        teamMembers.map(
          (member, index) =>
            member.is_active && (
              <TeamCard key={member.id} member={member} id={member.id} />
            )
        )
      ) : (
        <div>
          <p>No team members found</p>
        </div>
      )}
    </motion.div>
  );
}
