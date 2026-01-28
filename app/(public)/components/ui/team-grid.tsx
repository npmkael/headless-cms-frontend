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
        <div className="relative shrink-0">
          <div
            className="flower bg-main overflow-hidden"
            style={{ width: "100px", height: "100px" }}
          >
            {/* <Image
              src={member.image}
              alt={member.name}
              width={100}
              height={100}
              className="w-full h-full object-cover grayscale"
              onError={(e) => {
                // Fallback to placeholder if image fails
                const target = e.target as HTMLImageElement;
                // target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${member.name}`;
              }}
            /> */}
          </div>
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
              href={JSON.parse(member.socials_json).linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors "
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
      <p className="text-sm text-muted-foreground leading-relaxed">
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
