import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        {/* Big signal */}
        <h1 className="text-[120px] leading-none font-extrabold text-indigo-600">
          404
        </h1>

        <p className="mt-4 text-3xl font-bold text-gray-900">
          Wrong Address
        </p>

        <p className="mt-3 text-gray-600 text-lg">
          You’ve landed on a route that doesn’t exist.
          <br />
          Either the link is broken, or the page was moved.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-indigo-600 mx-auto mt-6 rounded-full" />

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-4">
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
            "
          >
            View Placements
          </Link>
        </div>

        {/* Subtle footer text */}
        <p className="mt-10 text-sm text-gray-400">
          If you believe this is a mistake, please check the URL.
        </p>
      </div>
    </div>
  );
}
