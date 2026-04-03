import { Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";

export default function TeamMemberList({ members, reload, onEdit }) {
  const remove = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this member?");
    if (!ok) return;

    try {
      await api.delete(`/team/${id}`);
      reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {members.map((member) => (
        <div
          key={member._id}
          className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
        >
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={() => onEdit(member)}
              title="Edit member"
              className="rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-100"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => remove(member._id)}
              title="Delete member"
              className="rounded-full border border-slate-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <img
            src={member.photo?.url}
            alt={member.name}
            className="mb-3 h-24 w-24 rounded-xl object-cover"
          />

          <h3 className="font-semibold text-slate-900">{member.name}</h3>

          <p className="text-sm text-slate-600">
            {member.role} - {member.iiit}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {member.team} - {member.year}
          </p>

          <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
            {member.isActive === false ? "inactive" : "active"}
          </div>
        </div>
      ))}
    </div>
  );
}
