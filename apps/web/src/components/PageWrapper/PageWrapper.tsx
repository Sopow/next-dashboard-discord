import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";

function PageWrapper({
  t,
  children,
  isThereFooter = true,
  isTherePadding = false,
  padding = 25
}) {
  return (
    <>
      <AnimatePresence>
        <div className="min-h-screen bg-[#0f0d18]">
          <Header t={t} />
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {isTherePadding && (
              <div className={`flex flex-col items-center justify-center`} style={{
                padding: `${padding}vh 0`
              }}>
                {children}
              </div>
            )}
            {!isTherePadding && children}
          </motion.div>
          {isThereFooter && <Footer />}
        </div>
      </AnimatePresence>
    </>
  );
}

export default PageWrapper;
