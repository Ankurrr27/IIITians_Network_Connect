import { motion } from "framer-motion";

const SplashLoader = ({ onFinish }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* SVG MASK */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="splashMask">
            <rect width="100%" height="100%" fill="white" />

            {/* SPLASH CIRCLE */}
            <motion.circle
              cx="50"
              cy="50"
              r="0"
              fill="black"
              animate={{ r: 80 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={onFinish}
            />
          </mask>
        </defs>

        {/* MASKED OVERLAY */}
        <rect
          width="100%"
          height="100%"
          fill="#020617"
          mask="url(#splashMask)"
        />
      </svg>

      {/* DROPLET */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: "50vh", opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      />
    </motion.div>
  );
};

export default SplashLoader;
