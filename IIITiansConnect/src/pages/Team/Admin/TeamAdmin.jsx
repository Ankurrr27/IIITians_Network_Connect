import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../../../api/axios";

import TeamMemberForm from "./TeamMemberForm";
import TeamMemberList from "./TeamMemberList";
import EditMemberModal from "./EditMemberModal";

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [query, setQuery] = useState("");

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

  const filteredMembers = useMemo(() => {
    if (!query.trim()) return members;

    const normalizedQuery = query.toLowerCase();

    return members.filter((member) =>
      [member.name, member.role, member.iiit, member.team, member.year, member.roleType]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery))
    );
  }, [members, query]);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
          Team workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Team Management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Add, edit, search, and manage the public team directory.
        </p>
      </header>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <TeamMemberForm onSuccess={load} />
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative max-w-md">
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

        {filteredMembers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No team members match your search.
          </p>
        ) : (
          <TeamMemberList
            members={filteredMembers}
            reload={load}
            onEdit={(member) => setEditingMember(member)}
          />
        )}
      </section>

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
