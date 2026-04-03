import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";

const BASE_VIEW_COUNT = 20000;
const VIEW_STORAGE_KEY = "iiitians-network-total-views";
const VIEW_SESSION_KEY = "iiitians-network-view-recorded";

const Footer = () => {
  const [viewCount, setViewCount] = useState(BASE_VIEW_COUNT);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedCount = Number(localStorage.getItem(VIEW_STORAGE_KEY));
    const hasRecordedThisSession = sessionStorage.getItem(VIEW_SESSION_KEY);
    let nextCount =
      Number.isFinite(storedCount) && storedCount >= BASE_VIEW_COUNT
        ? storedCount
        : BASE_VIEW_COUNT;

    if (!hasRecordedThisSession) {
      nextCount += 1;
      localStorage.setItem(VIEW_STORAGE_KEY, String(nextCount));
      sessionStorage.setItem(VIEW_SESSION_KEY, "true");
    } else if (!localStorage.getItem(VIEW_STORAGE_KEY)) {
      localStorage.setItem(VIEW_STORAGE_KEY, String(nextCount));
    }

    setViewCount(nextCount);
  }, []);

  return (
    <footer className="bg-slate-900 pb-6 pt-14 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 rounded-[1.75rem] border border-slate-700 bg-slate-800/60 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-300">
                Network Reach
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {viewCount.toLocaleString()} total views
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                to="/colleges"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                <Eye size={16} className="text-indigo-300" />
                Explore colleges
              </Link>
              <Link
                to="/team"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Meet the team
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-slate-700 pb-10 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-white">
              IIITians Network
            </h3>
            <p className="text-sm leading-snug text-slate-400">
              A student-led community connecting IIIT students, alumni, and
              aspirants across India through data, collaboration, and shared
              opportunities.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/placement" className="hover:text-white">
                  Placements
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white">
                  News & Events
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/legacy" className="hover:text-white">
                  Legacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jee-counselling" className="hover:text-white">
                  JEE Counselling
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Connect With Us
            </h4>
            <div className="flex gap-4 text-slate-400">
              <a
                href="https://www.linkedin.com/company/iiitians-network/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="https://www.instagram.com/iiitiansnetwork?igsh=MW4wY2d1Z211aGF2NA=="
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://discord.gg/88AnpuNc6E"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href="https://www.reddit.com/r/iiitiansnetwork_/s/raoRbgEdX6"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
          <div className="flex flex-wrap gap-1">
            <span>Created by</span>
            <a
              href="https://www.linkedin.com/in/srishti-singh19/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white hover:underline"
            >
              Srishti
            </a>
            <span>,</span>
            <a
              href="https://www.linkedin.com/in/utkarsh-pratap-460502251/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white hover:underline"
            >
              Utkarsh
            </a>
            <span>&</span>
            <a
              href="https://www.linkedin.com/in/ankur-singh-03ba44380/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white hover:underline"
            >
              Ankur
            </a>
          </div>

          <div className="flex gap-4">
            <p>&copy; {new Date().getFullYear()} IIITians Network.</p>
            <p>Built by IIITians, for IIITians.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

