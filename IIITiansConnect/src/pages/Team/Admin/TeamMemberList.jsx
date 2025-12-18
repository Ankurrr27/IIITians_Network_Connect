import api from "../../../api/axios";
import { Pencil, Trash2 } from "lucide-react";

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
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {members.map((m) => (
        <div
          key={m._id}
          className="relative bg-white border rounded-xl p-4 hover:shadow-md transition"
        >
          {/* ACTION BUTTONS */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => onEdit(m)}
              title="Edit member"
              className="p-2 rounded-full border bg-white
                         hover:bg-gray-100 transition"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => remove(m._id)}
              title="Delete member"
              className="p-2 rounded-full border bg-white text-red-600
                         hover:bg-red-50 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* IMAGE */}
          <img
            src={m.photo?.url}
            alt={m.name}
            className="w-24 h-24 object-cover rounded-lg mb-3"
          />

          {/* INFO */}
          <h3 className="font-semibold text-gray-900">{m.name}</h3>

          <p className="text-sm text-gray-600">
            {m.role} · {m.iiit}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {m.team} · {m.year}
          </p>
        </div>
      ))}
    </div>
  );
}
