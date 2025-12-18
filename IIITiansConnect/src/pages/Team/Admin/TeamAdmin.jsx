import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";

import TeamMemberForm from "./TeamMemberForm";
import TeamMemberList from "./TeamMemberList";
import EditMemberModal from "./EditMemberModal";
import { Search } from "lucide-react";

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

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredMembers = useMemo(() => {
    if (!query.trim()) return members;

    const q = query.toLowerCase();

    return members.filter((m) =>
      [
        m.name,
        m.role,
        m.iiit,
        m.team,
        m.year,
        m.roleType,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [members, query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl pt-12 font-bold text-gray-900">
            Team Management
          </h1>
          <p className="text-sm text-gray-500">
            Add, edit, search, and manage team members
          </p>
        </div>
      </header>

      {/* CREATE FORM */}
      <section className="bg-white shadow-sm">
        
        <TeamMemberForm onSuccess={load} />
      </section>

      {/* SEARCH + LIST */}
      <section className="space-y-4">

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, IIIT, team..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* LIST */}
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-gray-500">
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

      {/* EDIT MODAL */}
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
