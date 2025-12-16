import { Link } from "react-router-dom";
import {
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Globe,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP */}
        <div className="grid gap-10 md:grid-cols-4 border-b border-slate-700 pb-10">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              IIITians Network
            </h3>
            <p className="text-sm leading-snug text-slate-400">
              A student-led community connecting IIIT students, alumni, and
              aspirants across India through data, collaboration, and shared
              opportunities.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/placements" className="hover:text-white">Placements</Link></li>
              <li><Link to="/news-events" className="hover:text-white">News & Events</Link></li>
              <li><Link to="/competitions-hackathons" className="hover:text-white">Hackathons</Link></li>
              <li><Link to="/alumni-achievements" className="hover:text-white">Alumni</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jee-counselling" className="hover:text-white">JEE Counselling</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* SOCIALS */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Connect With Us
            </h4>

            <div className="flex gap-4 text-slate-400">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">
                <Github size={18} />
              </a>
              <a href="https://iiitians.network" target="_blank" rel="noreferrer" className="hover:text-white">
                <Globe size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} IIITians Network. All rights reserved.
          </p>
          <p>
            Built by IIITians, for IIITians.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
