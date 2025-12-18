import { motion } from "framer-motion";

export default function TeamCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-24"
    >
      <div className="max-w-3xl mx-auto text-center bg-white border border-gray-200 rounded-3xl px-8 py-12 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Want to work with us?
        </h2>

        <p className="mt-3 text-gray-600 text-sm md:text-base">
          We’re always looking for driven students who want to build,
          lead, and create real impact across IIITs.
        </p>

        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <a
            href="/join"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white
                       font-medium hover:bg-indigo-700 transition"
          >
            Join the Team
          </a>

          <a
            href="/contact"
            className="px-6 py-3 rounded-xl border border-gray-300
                       text-gray-700 font-medium hover:border-indigo-600
                       hover:text-indigo-600 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </motion.section>
  );
}
