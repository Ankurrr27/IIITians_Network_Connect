import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Users2,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Command,
  Camera,
  BookOpen,
  FileText,
  Map,
  GraduationCap,
} from "lucide-react";
import api from "../api/axios";

const BASE_VIEW_COUNT = 24810;

const Footer = () => {
  const [stats, setStats] = useState({
    views: BASE_VIEW_COUNT,
    members: 0,
    colleges: 0,
    clubs: 0,
    events: 0,
    photos: 0,
    alumni: 0,
  });

  const loadStats = async () => {
    try {
      const [siteStatsRes, teamRes, clubsStatsRes, clubsRes] = await Promise.allSettled([
        api.get("/site-stats"),
        api.get("/team"),
        api.get("/discuss-accounts/public/stats"),
        api.get("/discuss-accounts/public"),
      ]);

      setStats((prev) => ({
        ...prev,
        views: siteStatsRes.status === "fulfilled" ? siteStatsRes.value.data?.totalViews || prev.views : prev.views,
        events: siteStatsRes.status === "fulfilled" ? siteStatsRes.value.data?.totalEvents || 0 : 0,
        photos: siteStatsRes.status === "fulfilled" ? siteStatsRes.value.data?.totalPhotos || 0 : 0,
        colleges: siteStatsRes.status === "fulfilled" ? siteStatsRes.value.data?.totalColleges || 0 : 0,
        alumni: siteStatsRes.status === "fulfilled" ? siteStatsRes.value.data?.totalAlumni || 0 : 0,
        members: teamRes.status === "fulfilled" ? teamRes.value.data?.length || 0 : 0,
        clubs:
          clubsStatsRes.status === "fulfilled"
            ? clubsStatsRes.value.data?.registeredClubs || 0
            : clubsRes.status === "fulfilled"
              ? clubsRes.value.data?.length || 0
              : 0,
      }));
    } catch (err) {
      console.error("FOOTER STATS ERROR:", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Universal Site Statistics Increment
    const trackView = async () => {
      try {
        const res = await api.post("/site-stats/increment");
        if (res.data?.totalViews) {
          setStats(prev => ({ ...prev, views: res.data.totalViews }));
        }
      } catch (err) {
        console.error("VIEW TRACK ERROR:", err);
        // Fallback to initial stats if increment fails
        loadStats();
      }
    };

    trackView();
    loadStats();
  }, []);

  return (
    <footer className="bg-slate-900 pb-6 pt-14 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Network Reach Card - Restored & Enhanced */}
        <div className="mb-12 rounded-[1.75rem] border border-slate-700 bg-slate-800/60 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-300">
                Network Reach
              </p>
              <h3 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {stats.views.toLocaleString()}{" "}
                <span className="text-xl font-medium text-slate-400 sm:text-2xl">
                  total views
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatChip icon={Users2} value={stats.members} label="Team" />
              <StatChip icon={GraduationCap} value={stats.alumni} label="Alumni" />
              <StatChip icon={Building2} value={stats.colleges} label="IIITs" />
              <StatChip icon={ShieldCheck} value={stats.clubs} label="Clubs" />
              <StatChip icon={Sparkles} value={stats.events} label="Events" />
              <StatChip icon={Camera} value={stats.photos} label="Photos" />
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-slate-700 pb-10 lg:grid-cols-5 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              IIITians Network
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              A student-led community connecting IIIT students, alumni, and 
              aspirants across India through data, collaboration, and shared 
              opportunities.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon href="https://linkedin.com/company/iiitians-network" icon={Linkedin} />
              <SocialIcon href="https://instagram.com/iiitiansnetwork" icon={Instagram} />
              <SocialIcon href="https://discord.gg/88AnpuNc6E" icon={MessageCircle} />
              <SocialIcon href="https://iiitiansnetwork.com" icon={Globe} />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/colleges" className="transition hover:text-white">IIIT Directory</Link></li>
              <li><Link to="/placement" className="transition hover:text-white">Placements</Link></li>
              <li><Link to="/events" className="transition hover:text-white">Events Desk</Link></li>
              <li><Link to="/discuss" className="transition hover:text-white">Student Discuss</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/legacy" className="transition hover:text-white">Network Legacy</Link></li>
              <li><Link to="/team" className="transition hover:text-white">Our Team</Link></li>
              <li><Link to="/team/join" className="transition hover:text-white">Join the Team</Link></li>
              <li><Link to="/guide" className="transition hover:text-white">User Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/gallery" className="transition hover:text-white">Gallery</Link></li>
              <li><Link to="/guide" className="transition hover:text-white">Documentation</Link></li>
              <li><Link to="/branding" className="transition hover:text-white">Branding Kit</Link></li>
              <li><Link to="/" className="transition hover:text-white">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition hover:text-white">Terms of Use</Link></li>
              <li><Link to="/guidelines" className="transition hover:text-white">Community Guidelines</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Contact Us</Link></li>
              <li><Link to="/admin" className="transition hover:text-white">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:flex-row">
          <div className="flex flex-wrap gap-1.5">
            <span>Created by</span>
            <a href="https://www.linkedin.com/in/ankurrr27/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">Ankur</a>
            <span>•</span>
            <a href="https://linkedin.com/in/srishti-singh19/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">Srishti</a>
            <span>•</span>
            <a href="https://linkedin.com/in/utkarsh-pratap-460502251/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">Utkarsh</a>
            
            
          </div>

          <div className="flex gap-4">
            <p>&copy; {new Date().getFullYear()} IIITians Network</p>
            <p>Built by IIITians, for IIITians</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const StatChip = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/5">
    <Icon size={16} className="text-indigo-400" />
    <span className="font-bold text-white">{value}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
  </div>
);

const SocialIcon = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-slate-400 transition-colors hover:text-white"
  >
    <Icon size={18} />
  </a>
);

export default Footer;

