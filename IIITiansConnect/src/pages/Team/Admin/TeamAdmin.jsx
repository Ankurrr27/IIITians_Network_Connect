import { useEffect, useMemo, useState } from "react";
import { 
  ArrowUpDown, 
  GripVertical, 
  Search, 
  Users,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

import TeamMemberForm from "./TeamMemberForm";
import TeamMemberList from "./TeamMemberList";
import EditMemberModal from "./EditMemberModal";
import MockRequestList from "./MockRequestList";

export default function TeamAdmin() {
  const navigate = useNavigate();
  console.log("Icon Status:", { ShieldCheck, Users });
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [query, setQuery] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "pending"
  const [reloadRequests, setReloadRequests] = useState(0);
  const [pendingApprovalReq, setPendingApprovalReq] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/team");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const availableYears = useMemo(
    () =>
      [...new Set(members.map((member) => member.year).filter(Boolean))].sort((a, b) =>
        String(b).localeCompare(String(a), undefined, { numeric: true })
      ),
    [members]
  );

  const availableTeams = useMemo(
    () => [...new Set(members.map((member) => member.team).filter(Boolean))].sort(),
    [members]
  );

  const filteredMembers = useMemo(() => {
    const orderedMembers = [...members];

    const normalizedQuery = query.toLowerCase();

    const searchedMembers = orderedMembers.filter((member) => {
      const matchesQuery =
        !query.trim() ||
        [member.name, member.role, member.iiit, member.team, member.year, member.roleType]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedQuery));

      const matchesYear = yearFilter === "all" || member.year === yearFilter;
      const matchesTeam = teamFilter === "all" || member.team === teamFilter;
      const matchesRole = roleFilter === "all" || member.roleType === roleFilter;

      return matchesQuery && matchesYear && matchesTeam && matchesRole;
    });

    const sortedMembers = [...searchedMembers].sort((a, b) => {
      const yearCompare = String(b.year || "").localeCompare(String(a.year || ""), undefined, {
        numeric: true,
      });

      const manualOrderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
      const manualOrderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;

      if (sortBy === "order") {
        if (manualOrderA !== manualOrderB) return manualOrderA - manualOrderB;
        if (yearCompare !== 0) return yearCompare;
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "") || yearCompare;
      }

      if (sortBy === "role") {
        return (a.role || "").localeCompare(b.role || "") || yearCompare;
      }

      if (sortBy === "team") {
        return (a.team || "").localeCompare(b.team || "") || yearCompare;
      }

      if (yearCompare !== 0) return yearCompare;
      if (manualOrderA !== manualOrderB) return manualOrderA - manualOrderB;
      return (a.name || "").localeCompare(b.name || "");
    });

    return sortedMembers;
  }, [members, query, sortBy, yearFilter, teamFilter, roleFilter]);

  const saveMemberOrder = async (orderedMembers) => {
    setSavingOrder(true);
    try {
      await Promise.all(
        orderedMembers.map((member, index) => {
          const formData = new FormData();
          formData.append("order", String(index + 1));
          return api.put(`/team/${member._id}`, formData);
        })
      );

      setMembers((prevMembers) =>
        [...prevMembers].sort((a, b) => {
          const updatedIndexA = orderedMembers.findIndex((member) => member._id === a._id);
          const updatedIndexB = orderedMembers.findIndex((member) => member._id === b._id);

          if (updatedIndexA !== -1 && updatedIndexB !== -1) {
            return updatedIndexA - updatedIndexB;
          }

          if (updatedIndexA !== -1) return -1;
          if (updatedIndexB !== -1) return 1;

          const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
          const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        }).map((member, index) => ({ ...member, order: index + 1 }))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to save the new order");
      load();
    } finally {
      setSavingOrder(false);
    }
  };

  const stats = useMemo(() => {
    const activeMembers = members.filter((member) => member.isActive !== false);

    return {
      total: members.length,
      active: activeMembers.length,
      exec: activeMembers.filter((member) => member.roleType === "EXEC").length,
      leads: activeMembers.filter((member) => member.roleType === "LEAD").length,
    };
  }, [members]);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white/80 text-indigo-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-indigo-700 hover:shadow-md active:scale-95"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="h-px w-8 bg-slate-200" />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Team workspace
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Team Management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Add, promote, continue, end tenure, and manage the public team directory.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="All records" value={stats.total} />
          <StatCard label="Active team" value={stats.active} />
          <StatCard label="Executives" value={stats.exec} />
          <StatCard label="Leads" value={stats.leads} />
        </div>
      </header>

      <div className="flex gap-2 rounded-[2rem] border border-slate-200 bg-white/50 p-2 shadow-sm backdrop-blur-sm lg:w-fit">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 rounded-[1.4rem] px-6 py-3 text-sm font-semibold transition ${
            activeTab === "active"
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          Active Roster
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 rounded-[1.4rem] px-6 py-3 text-sm font-semibold transition ${
            activeTab === "pending"
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          Pending Review
          {/* Badge could be added here if we had a count */}
        </button>
      </div>

      {activeTab === "pending" ? (
        <section className="space-y-8">
          <div className="rounded-[2.5rem] border border-indigo-100 bg-indigo-50/50 p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
              <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-indigo-100">
                <ShieldCheck size={32} className="text-indigo-400" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Waiting for backend API /team-requests to be live...
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Applications submitted via the public form will appear here once the API is connected. 
                  Currently, we are using <strong>LocalStorage Mocking</strong> to allow you to test.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                LocalStorage Mock Active
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 text-center lg:text-left">Applications Queue (Offline Data)</h3>
             <MockRequestList 
               onApprove={(req) => {
                 setPendingApprovalReq(req);
                 setActiveTab("active");
                 window.scrollTo({ top: 300, behavior: 'smooth' });
               }} 
             />
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <TeamMemberForm 
              members={members} 
              onSuccess={() => {
                setPendingApprovalReq(null);
                load();
                setReloadRequests(prev => prev + 1);
              }} 
              initialData={pendingApprovalReq}
            />
          </section>

          <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid flex-1 gap-3 lg:max-w-5xl lg:grid-cols-[minmax(0,1.2fr)_220px_180px_180px_180px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, role, IIIT, team..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="relative">
              <ArrowUpDown
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="latest">Sort: Latest team first</option>
                <option value="order">Sort: Manual order</option>
                <option value="name">Sort: Name</option>
                <option value="role">Sort: Role</option>
                <option value="team">Sort: Team</option>
              </select>
            </div>

            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All teams</option>
              {availableTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All roles</option>
              <option value="EXEC">Executive</option>
              <option value="LEAD">Lead</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>

          <div className="flex max-w-xl items-start gap-3 rounded-[1.6rem] bg-gradient-to-br from-slate-50 to-white px-4 py-3 ring-1 ring-slate-200/80">
            <div className="mt-0.5 rounded-full bg-white p-2 text-slate-500 ring-1 ring-slate-200">
              <GripVertical size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Drag to set team order
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Move cards in the admin list to decide the public display order.
                {query.trim() || yearFilter !== "all" || teamFilter !== "all" || roleFilter !== "all"
                  ? " Clear search and filters to enable drag and drop."
                  : savingOrder
                    ? " Saving the new order..."
                    : ""}
              </p>
            </div>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No team members match your search.
          </p>
        ) : (
          <TeamMemberList
            members={filteredMembers}
            reload={load}
            onEdit={(member) => setEditingMember(member)}
            onReorder={saveMemberOrder}
            disableReorder={
              Boolean(query.trim()) ||
              savingOrder ||
              yearFilter !== "all" ||
              teamFilter !== "all" ||
              roleFilter !== "all"
            }
          />
        )}
      </section>
    </>
  )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdated={() => {
            setEditingMember(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
