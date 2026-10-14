"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function RevealWord({
  word,
  progress,
  disabled,
}: {
  word: string;
  progress: MotionValue<number>;
  disabled: boolean;
}) {
  const opacity = useTransform(progress, [0, 1], [0.15, 1]);

  return (
    <motion.span
      aria-hidden="true"
      style={disabled ? undefined : { opacity }}
    >
      {word}{" "}
    </motion.span>
  );
}

export default function ScrollReveal({ text }: { text: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollXProgress } = useScroll({
    target: paragraphRef,
    axis: "x",
    offset: ["start 0.9", "end 0.35"],
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.p ref={paragraphRef} aria-label={text}>
      {text.split(/\s+/).map((word, index) => (
        <RevealWord
          key={`${word}-${index}`}
          word={word}
          progress={scrollXProgress}
          disabled={!isMounted || prefersReducedMotion !== false}
        />
      ))}
    </motion.p>
  );
}
