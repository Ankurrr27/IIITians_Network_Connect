import { motion } from "framer-motion";

export default function TeamCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-16 md:mt-24"
    >
      <div
        className="
          max-w-3xl mx-auto text-center
          bg-white border border-gray-200
          rounded-2xl md:rounded-3xl
          px-5 py-8
          md:px-8 md:py-12
          shadow-sm
        "
      >
        <h2 className="text-xl md:text-3xl font-bold text-gray-900">
          Want to work with us?
        </h2>

        <p className="mt-2 md:mt-3 text-gray-600 text-sm md:text-base">
          We’re always looking for driven students who want to build,
          lead, and create real impact across IIITs.
        </p>

        {/* BUTTONS */}
        <div
          className="
            mt-5 md:mt-6
            flex flex-nowrap justify-center
            gap-3 md:gap-4
          "
        >
          <a
            href="/join"
            className="
              px-2 py-2.5
              md:px-6 md:py-3
              rounded-lg md:rounded-xl
              bg-indigo-600 text-white
              text-sm sm:text-md font-medium
              hover:bg-indigo-700 transition
              whitespace-nowrap
            "
          >
            Join the Team
          </a>

          <a
            href="/contact"
            className="
              px-2 py-2.5
              md:px-6 md:py-3
              rounded-lg md:rounded-xl
              border text-sm sm:text-md border-gray-300
              text-gray-700 font-medium
              hover:border-indigo-600
              hover:text-indigo-600 transition
              whitespace-nowrap
            "
          >
            Contact Us
          </a>
        </div>
      </div>
    </motion.section>
  );
}
