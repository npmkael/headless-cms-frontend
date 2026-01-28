"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  experience: string;
  image: string;
  linkedIn?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Smith",
    role: "CEO and Founder",
    experience:
      "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy",
    image: "/team/john-smith.jpg",
    linkedIn: "https://linkedin.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Director of Operations",
    experience:
      "7+ years of experience in project management and team leadership. Strong organizational and communication skills",
    image: "/team/jane-doe.jpg",
    linkedIn: "https://linkedin.com",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Senior SEO Specialist",
    experience:
      "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization",
    image: "/team/michael-brown.jpg",
    linkedIn: "https://linkedin.com",
  },
  {
    id: 4,
    name: "Emily Johnson",
    role: "PPC Manager",
    experience:
      "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis",
    image: "/team/emily-johnson.jpg",
    linkedIn: "https://linkedin.com",
  },
  {
    id: 5,
    name: "Brian Williams",
    role: "Social Media Specialist",
    experience:
      "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement",
    image: "/team/brian-williams.jpg",
    linkedIn: "https://linkedin.com",
  },
  {
    id: 6,
    name: "Sarah Kim",
    role: "Content Creator",
    experience:
      "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries",
    image: "/team/sarah-kim.jpg",
    linkedIn: "https://linkedin.com",
  },
];

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
  index: number;
}

function TeamCard({ member, index }: TeamCardProps) {
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
        {member.linkedIn && (
          <div className="shrink-0 place-items-start h-full">
            <Link
              href={member.linkedIn}
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
        {member.experience}
      </p>
    </motion.div>
  );
}

export default function TeamGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mb-8"
    >
      {teamMembers.map((member, index) => (
        <TeamCard key={member.id} member={member} index={index} />
      ))}
    </motion.div>
  );
}
