import { AnimatePresence, motion } from "framer-motion";

interface AnimatedTableWrapperProps {
  children: React.ReactNode;
  dependencyKey: string | number;
}

export default function AnimatedTableWrapper({
  children,
  dependencyKey,
}: AnimatedTableWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dependencyKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
