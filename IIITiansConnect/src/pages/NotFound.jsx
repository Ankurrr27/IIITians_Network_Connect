import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center my-12 sm:my-20 px-4 sm:px-6">
      <div className="text-center max-w-xl">
        {/* Big signal */}
        <h1 className="text-[72px] sm:text-[120px] leading-none font-extrabold text-indigo-600">
          404
        </h1>

        <p className="mt-3 sm:mt-4 text-xl sm:text-3xl font-bold text-gray-900">
          Wrong Address
        </p>

        <p className="mt-2 sm:mt-3 text-gray-600 text-sm sm:text-lg">
          You’ve landed on a route that doesn’t exist.
          <br />
          Either the link is broken, or the page was moved.
        </p>

        {/* Divider */}
        <div className="w-16 sm:w-24 h-1 bg-indigo-600 mx-auto mt-5 sm:mt-6 rounded-full" />

        {/* Actions — ALWAYS ONE ROW */}
        <div className="mt-6 text-xs sm:text-lg sm:mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="
             px-6 py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              font-medium
              hover:bg-indigo-700
              transition
              text-center
            "
          >
            Go to Home
          </Link>

          <Link
            to="/placement"
            className="
              px-6 py-2.5
              rounded-xl
              border
              border-gray-300
              text-gray-700
              hover:bg-gray-100
              transition
              text-center
            "
          >
            View Placements
          </Link>
        </div>

        {/* Subtle footer text */}
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-gray-400">
          If you believe this is a mistake, please check the URL.
        </p>
      </div>
    </div>
  );
}
