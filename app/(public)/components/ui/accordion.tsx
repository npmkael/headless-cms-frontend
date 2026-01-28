"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Plus, Minus } from "lucide-react";

type AccordionMode = "single" | "multiple";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
  mode: AccordionMode;
  reducedMotion: boolean;
}

interface AccordionProps {
  children: ReactNode;
  mode?: AccordionMode;
  defaultOpen?: string | string[];
  className?: string;
}

interface AccordionItemProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check on mount (client-side only)
  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches !== reducedMotion) {
      setReducedMotion(mediaQuery.matches);
    }
  }

  return reducedMotion;
}

const contentVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.2 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.25, delay: 0.1 },
    },
  },
};

const iconVariants: Variants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function Accordion({
  children,
  mode = "single",
  defaultOpen,
  className = "",
}: AccordionProps) {
  const reducedMotion = useReducedMotion();

  const initialOpenItems = useMemo(() => {
    if (!defaultOpen) return new Set<string>();
    if (Array.isArray(defaultOpen)) return new Set(defaultOpen);
    return new Set([defaultOpen]);
  }, [defaultOpen]);

  const [openItems, setOpenItems] = useState<Set<string>>(initialOpenItems);

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);

        if (mode === "single") {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.clear();
            next.add(id);
          }
        } else {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
        }

        return next;
      });
    },
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      openItems,
      toggle,
      mode,
      reducedMotion,
    }),
    [openItems, toggle, mode, reducedMotion]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={`flex flex-col gap-4 md:gap-6 ${className}`}
        role="region"
        aria-label="Accordion"
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}


export function AccordionItem({
  id,
  number,
  title,
  children,
  className = "",
}: AccordionItemProps) {
  const { openItems, toggle, reducedMotion } = useAccordion();
  const isOpen = openItems.has(id);
  const uniqueId = useId();
  const headerId = `accordion-header-${uniqueId}`;
  const panelId = `accordion-panel-${uniqueId}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  };

  const duration = reducedMotion ? 0 : undefined;

  return (
    <motion.div
      className={`
        rounded-[20px] md:rounded-[24px] 
        border border-black 
        shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[0px_5px_0px_0px_rgba(0,0,0,1)]
        overflow-hidden
        transition-colors duration-300
        ${isOpen ? "bg-main" : "bg-gray"}
        ${className}
      `}
      initial="initial"
      animate="animate"
      variants={itemVariants}
      custom={parseInt(number) - 1}
      layout={!reducedMotion}
    >
      {/* Header Button */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggle(id)}
        onKeyDown={handleKeyDown}
        className={`
          w-full
          flex items-center justify-between
          px-5 py-5 md:px-8 md:py-6
          text-left
          cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          min-h-[72px] md:min-h-[88px]
          group
          transition-colors duration-300
        `}
      >
        {/* Left side: Number + Title */}
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-none">
            {number}
          </span>
          <span className="text-lg md:text-xl lg:text-2xl font-medium text-black">
            {title}
          </span>
        </div>

        {/* Right side: Icon Button */}
        <motion.div
          className={`
            w-10 h-10 md:w-12 md:h-12
            rounded-full
            border-2 border-black
            flex items-center justify-center
            shrink-0
            transition-colors duration-200
            ${isOpen ? "bg-gray" : "bg-gray"}
            group-hover:bg-white
          `}
          initial={false}
          animate={isOpen ? "expanded" : "collapsed"}
          variants={iconVariants}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 25 }
          }
        >
          {isOpen ? (
            <Minus
              className="w-5 h-5 md:w-6 md:h-6 text-black"
              strokeWidth={2.5}
            />
          ) : (
            <Plus
              className="w-5 h-5 md:w-6 md:h-6 text-black"
              strokeWidth={2.5}
            />
          )}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
            className="mx-5 md:mx-8 h-px bg-black origin-left"
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={duration !== undefined ? { duration } : undefined}
            className="overflow-hidden"
          >
            <div className="px-5 pt-4 pb-6 md:px-8 md:pt-5 md:pb-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


export  function AccordionContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-sm md:text-base text-black/80 leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
}
