import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.25 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* Logo */}
      <motion.img
        src="/IIITians-Network-Logo-Light.png"
        alt="IIITians Network Logo"
        className="h-24 md:h-28 w-auto mb-6 object-contain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Text */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-white tracking-tight"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        IIITians Network
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-3 text-sm md:text-base text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        Connecting IIITs Across India
      </motion.p>
    </motion.div>
  );
};

export default Loader;
