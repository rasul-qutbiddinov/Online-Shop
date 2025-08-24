// src/layouts/SplashLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Vortex } from "@/components/shared/Vortex";

const SplashLayout = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem("hasVisited"),
  );

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSplash, navigate]);

  return (
    <AnimatePresence mode="sync">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen overflow-hidden bg-black"
        >
          <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={120}
            className="flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10"
          >
            <h2 className="text-3xl font-bold text-white md:text-6xl">
              Online shop
            </h2>
            <p className="mt-6 max-w-xl text-center text-sm text-white md:text-2xl">
              By Rasul
            </p>
          </Vortex>
        </motion.div>
      ) : (
        <Outlet />
      )}
    </AnimatePresence>
  );
};

export default SplashLayout;
