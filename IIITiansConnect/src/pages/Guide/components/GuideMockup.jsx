import {
  CalendarDays,
  ExternalLink,
  GripVertical,
  Handshake,
  ImagePlus,
  LayoutDashboard,
  Mail,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShieldPlus,
  Users,
  Users2,
  BarChart3,
  Images,
  TrendingUp,
} from "lucide-react";

export default function GuideMockup({ variant = "discuss" }) {
  if (variant === "event") return <EventMockup />;
  if (variant === "legacy") return <LegacyMockup />;
  if (variant === "member") return <MemberMockup />;
  if (variant === "collab") return <CollabMockup />;
  if (variant === "admin") return <AdminMockup />;
  if (variant === "gallery") return <GalleryMockup />;
  if (variant === "placement") return <PlacementMockup />;
  return <DiscussMockup />;
}

function Shell({ children }) {
  return (
    <div className="w-full rounded-[1.7rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),rgba(239,246,255,0.95))] p-2 shadow-[0_28px_70px_-34px_rgba(79,70,229,0.24)] sm:p-3">
      <div className="overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,_#eef7ff_0%,_#f8fbff_100%)]">
        <div className="flex items-center justify-between bg-white/90 px-4 py-3">
          <div className="h-3 w-24 rounded-full bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
        </div>
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

function DiscussMockup() {
  return (
    <Shell>
      <div className="rounded-[1.4rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(14,116,144,0.35)] sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Neon Club
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Verified
          </span>
        </div>
        <div className="mt-3 text-sm text-slate-600">IIIT Kota</div>
        <div className="mt-4 flex gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Post update
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Manage account
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[1.5rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(14,116,144,0.35)] sm:p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          Announcement
        </div>
        <div className="mt-3 h-40 rounded-[1.2rem] bg-[linear-gradient(135deg,_#dbeafe,_#c7d2fe)] sm:h-48" />
        <div className="mt-4 text-lg font-semibold text-slate-900">
          Website launch update
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
            IIIT Kota
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-700">
            Neon Club
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-2.5 rounded-full bg-slate-200" />
          <div className="h-2.5 w-[88%] rounded-full bg-slate-200" />
          <div className="h-2.5 w-[72%] rounded-full bg-slate-200" />
        </div>
      </div>
    </Shell>
  );
}

function EventMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] bg-white shadow-[0_18px_44px_-30px_rgba(79,70,229,0.32)]">
        <div className="relative h-52 overflow-hidden rounded-t-[1.5rem] bg-[linear-gradient(135deg,_#1e293b,_#4f46e5)] sm:h-60">
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
            <CalendarDays className="h-4 w-4" />
            16 Jan
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-2xl font-semibold text-white">E-Summit 2026</div>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
              <MapPin className="h-3.5 w-3.5" />
              IIIT Nagpur
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-700">
              <Users className="h-3.5 w-3.5" />
              E-Cell
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2.5 rounded-full bg-slate-200" />
            <div className="h-2.5 w-[84%] rounded-full bg-slate-200" />
            <div className="h-2.5 w-[66%] rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 rounded-full bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white">
              View details
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function LegacyMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.24)] sm:p-5">
        <div className="flex items-center gap-3 rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          Search name, post, role, company...
        </div>

        <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-slate-50">
          <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#c7d2fe,_#a5b4fc)] sm:h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_45%)]" />
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/85 text-2xl font-semibold text-indigo-700 shadow-sm">
                AS
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                2024-28
              </div>
              <div className="mt-3 text-xl font-semibold text-slate-900">
                Ankur Singh
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
                  Vice President
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
                  IIIT Kota
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-[82%] rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">
                  2024: Instagram Admin
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">
                  2025: Social Media Lead
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">
                  2026: Vice President
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-indigo-600">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AdminMockup() {
  return (
    <Shell>
      <div className="grid h-[28rem] gap-3 lg:grid-cols-[11rem_1fr] sm:h-[32rem]">
        {/* Sidebar */}
        <div className="flex flex-col gap-1 rounded-[1.2rem] bg-indigo-950 p-3 text-white">
          <div className="mb-4 flex items-center gap-2 px-2 py-1">
            <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center ring-1 ring-indigo-500/30">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
              Admin
            </span>
          </div>
          
          <SidebarPill icon={LayoutDashboard} label="Dashboard" active />
          <SidebarPill icon={Users} label="Legacy" />
          <SidebarPill icon={ShieldPlus} label="Colleges" />
          <SidebarPill icon={Megaphone} label="Events" />
          <SidebarPill icon={Mail} label="Discuss" />
          <SidebarPill icon={Users2} label="Team" />
          
          <div className="mt-auto rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300/60">
              Session
            </div>
            <div className="mt-1 text-[11px] text-sky-400">
              Root Authenticated
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-col gap-3 min-w-0">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Awaiting Review
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">14</div>
            </div>
            <div className="rounded-[1.2rem] bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Live Now
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">822</div>
            </div>
            <div className="hidden rounded-[1.2rem] bg-indigo-600 p-3 shadow-md sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                Weekly Active
              </div>
              <div className="mt-1 text-xl font-bold text-white">2.4k</div>
            </div>
          </div>

          {/* Main Board */}
          <div className="flex-1 rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-sm font-semibold text-slate-900">
                Review Queue (Legacy & Clubs)
              </div>
              <div className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 ring-1 ring-amber-200/50">
                High Priority
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <ReviewRow 
                initials="JD" 
                title="Jane Doe" 
                subtitle="Legacy Request • Batch 2024"
                status="Pending Verification"
              />
              <ReviewRow 
                initials="NC" 
                title="Neon Club" 
                subtitle="Verification • IIIT Kota"
                status="Documents Submitted"
              />
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,_#6366f1,_#4f46e5)] text-sm font-bold text-white">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs font-semibold text-slate-900">Ankur Singh</div>
                  <div className="truncate text-[10px] text-slate-500">Edit Legacy Record • 2024-28</div>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-7 rounded-lg bg-emerald-500 px-2 flex items-center text-[10px] font-bold text-white shadow-[0_4px_12px_-4px_rgba(16,185,129,0.5)]">Approve</div>
                  <div className="h-7 rounded-lg bg-slate-200 px-2 flex items-center text-[10px] font-bold text-slate-600">Details</div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log / Mini Feed */}
          <div className="rounded-[1.4rem] bg-indigo-50/50 px-4 py-3 ring-1 ring-indigo-100/50 backdrop-blur-sm shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700">
              Audit Stream (Live)
            </div>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-indigo-800">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span>Admin @super verified Neon Club POC • 2m ago</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-indigo-500">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Legacy batch 2025 published by Admin @alex • 8m ago</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function SidebarPill({ icon: Icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200 ${
        active 
          ? "bg-white text-indigo-950 font-bold shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] ring-1 ring-white/20" 
          : "text-indigo-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[12px]">{label}</span>
    </div>
  );
}

function ReviewRow({ initials, title, subtitle, status }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
      <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-slate-900 truncate">{title}</div>
        <div className="text-[10px] text-slate-500 truncate">{subtitle}</div>
      </div>
      <div className="hidden sm:block text-[10px] font-medium text-indigo-600 whitespace-nowrap">
        {status}
      </div>
    </div>
  );
}


function MemberMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.24)] sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
          <div className="flex h-32 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,_#bfdbfe,_#a5b4fc)] text-2xl font-semibold text-indigo-900">
            AV
          </div>
          <div>
            <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Network Member Path
            </div>
            <div className="mt-3 text-xl font-semibold text-slate-900">
              Aakash Verma
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
                IIIT Delhi
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-700">
                Core Volunteer
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2.5 rounded-full bg-slate-200" />
              <div className="h-2.5 w-[76%] rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <ActionChip icon={Users} label="Team" />
          <ActionChip icon={ShieldCheck} label="Legacy" />
          <ActionChip icon={Mail} label="Visible profile" />
        </div>
      </div>
    </Shell>
  );
}

function CollabMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.24)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              <Handshake className="h-4 w-4" />
              Collaboration Ask
            </div>
            <div className="mt-3 text-lg font-semibold text-slate-900">
              Open call for media and outreach partners
            </div>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Verified
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-700">
            IIT Ranchi
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">
            IIIT Bangalore
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
            Festival partnership
          </span>
        </div>
        <div className="mt-4 h-36 rounded-[1.2rem] bg-[linear-gradient(135deg,_#dbeafe,_#e9d5ff)]" />
        <div className="mt-4 space-y-2">
          <div className="h-2.5 rounded-full bg-slate-200" />
          <div className="h-2.5 w-[88%] rounded-full bg-slate-200" />
          <div className="h-2.5 w-[70%] rounded-full bg-slate-200" />
        </div>
      </div>
    </Shell>
  );
}



function AdminStat({ label, value }) {
  return (
    <div className="rounded-[1.2rem] bg-white p-4 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.2)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function GalleryMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Gallery Audit
            </div>
            <div className="text-xl font-bold text-slate-900">Campus Visuals</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <Plus className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="aspect-video rounded-xl bg-[linear-gradient(135deg,_#eef2ff,_#e0e7ff)] ring-1 ring-slate-200 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Images size={24} />
             </div>
             <div className="absolute bottom-2 left-2 right-2 h-7 rounded-lg bg-white/80 backdrop-blur px-2 flex items-center justify-between">
                <div className="w-12 h-1.5 rounded-full bg-indigo-200" />
                <div className="w-4 h-4 rounded-md bg-rose-500" />
             </div>
          </div>
          <div className="aspect-video rounded-xl bg-[linear-gradient(135deg,_#f0f9ff,_#e0f2fe)] ring-1 ring-slate-200 overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Images size={24} />
             </div>
             <div className="absolute bottom-2 left-2 right-2 h-7 rounded-lg bg-white/80 backdrop-blur px-2 flex items-center justify-between">
                <div className="w-12 h-1.5 rounded-full bg-sky-200" />
                <div className="w-4 h-4 rounded-md bg-rose-500" />
             </div>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-4 text-center">
           <div className="mx-auto h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <Plus size={16} />
           </div>
           <div className="mt-2 text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Publish official photo</div>
        </div>
      </div>
    </Shell>
  );
}

function PlacementMockup() {
  return (
    <Shell>
      <div className="rounded-[1.5rem] border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Placement Hub
            </div>
            <div className="text-xl font-bold text-slate-900">Yearly Records</div>
          </div>
          <div className="text-xs font-bold text-slate-400">AY 2024-25</div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <BarChart3 size={20} />
              </div>
              <div className="flex-1">
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">CSE Highly</div>
                 <div className="text-lg font-bold text-slate-900">48.5 LPA</div>
              </div>
              <div className="text-emerald-500">
                 <TrendingUp size={16} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg (LPA)</div>
                 <div className="mt-1 text-base font-bold text-slate-900">18.2</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placed %</div>
                 <div className="mt-1 text-base font-bold text-slate-900">92.4%</div>
              </div>
           </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
           <div className="flex items-center justify-between gap-2">
              <div className="h-8 rounded-lg bg-slate-100 px-3 flex items-center text-[11px] font-bold text-slate-600">Add branch</div>
              <div className="h-8 rounded-lg bg-slate-900 px-4 flex items-center text-[11px] font-bold text-white shadow-lg">Save record</div>
           </div>
        </div>
      </div>
    </Shell>
  );
}

function ActionChip({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
