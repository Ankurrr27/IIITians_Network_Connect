import { LogOut, ShieldCheck } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Network Legacy", href: "/alumni/admin" },
  { label: "Events", href: "/events/admin" },
  { label: "Team", href: "/team/admin" },
  { label: "Placements", href: "/placement/admin" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 sm:text-xs sm:tracking-[0.24em]">
              <ShieldCheck className="h-4 w-4" />
              Admin Workspace
            </div>
            <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              IIITians Network Admin
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
