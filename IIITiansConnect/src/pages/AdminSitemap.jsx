import { FolderTree, Settings, Users2, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdminSitemap = () => {
  const adminSections = [
    {
      title: "Content & Assets",
      icon: Building2,
      links: [
        { name: "Colleges Directory", path: "/colleges/admin", desc: "Manage IIITs and their details" },
        { name: "Global Events", path: "/events/admin", desc: "Create and update events" },
        { name: "Platform Gallery", path: "/admin/gallery", desc: "Review and manage site images" }
      ]
    },
    {
      title: "Users & Community",
      icon: Users2,
      links: [
        { name: "Team Directory", path: "/team/admin", desc: "Manage core team members" },
        { name: "Network Legacy", path: "/legacy/admin", desc: "Approve legacy/alumni submissions" },
        { name: "Student Discuss", path: "/discuss/admin", desc: "Moderate student discussions" }
      ]
    },
    {
      title: "System & Operations",
      icon: Settings,
      links: [
        { name: "Placement Records", path: "/placement/admin", desc: "Update placement stats" },
        { name: "System Notifications", path: "/admin/notifications", desc: "Broadcast app notifications" },
        { name: "Admin Guide", path: "/admin/guide", desc: "Read operational procedures" }
      ]
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm w-fit">
          <FolderTree size={16} />
          Workflow Overview
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Admin Sitemap
        </h1>
        <p className="text-slate-600">
          A centralized overview of the administrative workflow and management routes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="rounded-[1.5rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.7))] p-6 shadow-[0_20px_60px_rgba(148,163,184,0.12)] backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                <section.icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {section.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group block rounded-xl border border-slate-100 bg-white/60 p-4 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                      {link.name}
                    </div>
                    <ArrowRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {link.desc}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSitemap;
