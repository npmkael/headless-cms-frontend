"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Testimonial =
  | {
      id: string;
      name: string | null;
      role_company: string | null;
      message: string | null;
      avatar_url: string | null;
      is_active: boolean;
    }[]
  | null;

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(598); // 550px card + 48px gap
  const [initialOffset, setInitialOffset] = useState(0);
  const totalSlides = testimonials ? testimonials.length : 0;
  const testimonialLength = testimonials?.length;

  // TODO: Message bubbles are still not centered

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 768) {
        // Mobile: card width + gap
        const cardWidth = window.innerWidth - 80;
        const gap = 24;
        setSlideWidth(cardWidth + gap);
        // Center the first card: (container width - card width) / 2
        setInitialOffset((window.innerWidth - cardWidth) / 2);
      } else {
        // Desktop: 550px card + 48px gap
        setSlideWidth(550 + 48);
        setInitialOffset(0); // Desktop uses pl-[calc(50%-275px)]
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full mb-12">
        <h2 className="bg-[#B9FF66] rounded-md px-1.5 py-1 text-3xl md:text-4xl font-semibold whitespace-nowrap">
          Testimonials
        </h2>
        <p className="text-sm md:text-base max-w-lg">
          Hear from Our Satisfied Clients: Read Our Testimonials to Learn More
          about Our Digital Marketing Services
        </p>
      </div>

      {/*  */}
      <div className="flex flex-col bg-black rounded-[32px] md:rounded-[40px] py-8 md:py-12 lg:py-16 w-full overflow-hidden">
        <motion.div
          className="flex w-max md:px-[calc(50%-275px)] gap-8 md:gap-12"
          animate={{
            x: initialOffset - currentIndex * slideWidth,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        >
          {testimonials ? (
            testimonials.map(
              (testimonial) =>
                testimonial.is_active && (
                  <div key={testimonial.id} className="shrink-0 flex flex-col">
                    <div className="relative">
                      <div className="border border-main p-6 md:p-10 w-[calc(100vw-80px)] md:w-[550px] h-[180px] md:h-[250px] rounded-[32px] md:rounded-[45px] overflow-hidden flex items-center justify-center">
                        <p className="text-xs md:text-base text-white leading-relaxed line-clamp-6">
                          "{testimonial.message}"
                        </p>
                      </div>
                      <svg
                        className="absolute left-8 md:left-14 z-10 -bottom-[25px]"
                        width="40"
                        height="28"
                        viewBox="0 0 48 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L24 28L47 1"
                          stroke="#B9FF66"
                          strokeWidth="1"
                          fill="#191A23"
                        />
                      </svg>
                    </div>
                    <div className="mt-8 md:mt-12 ml-8 md:ml-14">
                      <p className="text-main text-lg">{testimonial.name}</p>
                      <p className="text-white text-sm">
                        {testimonial.role_company}
                      </p>
                    </div>
                  </div>
                )
            )
          ) : (
            <div>
              <p>No testimonials found</p>
            </div>
          )}
        </motion.div>

        {/* navigation buttons and dot indicators */}
        <div className="flex justify-between items-center gap-4 md:gap-6 mt-8 md:mt-12 max-w-xl mx-auto w-full px-6 md:px-0">
          <motion.button
            onClick={handlePrev}
            className="w-12 h-12 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>

          <div className="flex items-center gap-4">
            {testimonials?.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                className="w-4 h-4 cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{
                    scale: currentIndex === index ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.path
                    d="M17.651 5.1856L35.2521 0L30.1163 17.651L35.2521 35.2521L17.651 30.1163L0 35.2521L5.1856 17.651L0 0L17.651 5.1856Z"
                    animate={{
                      fill: currentIndex === index ? "#B9FF66" : "#FFFFFF",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.svg>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
