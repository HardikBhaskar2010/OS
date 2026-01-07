import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nicknames1 = ["Hardik", "Cookie", "Bunny"];
const nicknames2 = ["Saumya", "Reina", "Senorita", "Honey", "Jaan"];

export const NicknameCycle1 = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % nicknames1.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-block h-[1.2em] align-middle overflow-hidden px-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={nicknames1[index]}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block text-foreground font-sans"
        >
          {nicknames1[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const NicknameCycle2 = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % nicknames2.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-block h-[1.2em] align-middle overflow-hidden px-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={nicknames2[index]}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block text-foreground font-sans"
        >
          {nicknames2[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};