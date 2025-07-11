"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export const FadeIn = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, direction = "right" }: { children: ReactNode; direction?: "left" | "right" }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const TaskCheckAnimation = ({ children, checked }: { children: ReactNode; checked: boolean }) => (
  <motion.div
    animate={{ scale: checked ? 0.95 : 1 }}
    transition={{ duration: 0.1 }}
  >
    {children}
  </motion.div>
);
