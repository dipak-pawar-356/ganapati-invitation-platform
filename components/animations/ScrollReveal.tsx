"use client";

import { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  Variants,
} from "framer-motion";

type ScrollStaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

const containerVariants: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ScrollStagger({
  children,
  className = "",
  stagger = 0.12,
}: ScrollStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        ...containerVariants,
        show: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      initial={
        shouldReduceMotion
          ? false
          : "hidden"
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : "show"
      }
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      {children}
    </motion.div>
  );
}

export { itemVariants };