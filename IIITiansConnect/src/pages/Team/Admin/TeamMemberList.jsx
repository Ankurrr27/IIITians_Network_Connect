import { GripVertical, Pencil, Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { useEffect, useState } from "react";

export default function TeamMemberList({
  members,
  reload,
  onEdit,
  onReorder,
  disableReorder = false,
}) {
  const [orderedMembers, setOrderedMembers] = useState(members);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    setOrderedMembers(members);
  }, [members]);

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

  const moveMember = (draggedMemberId, targetMemberId) => {
    if (!draggedMemberId || draggedMemberId === targetMemberId) return;

    setOrderedMembers((prev) => {
      const draggedIndex = prev.findIndex((member) => member._id === draggedMemberId);
      const targetIndex = prev.findIndex((member) => member._id === targetMemberId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [draggedMember] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedMember);
      return next;
    });
  };

  const handleDrop = async () => {
    if (!draggedId) return;
    const nextOrder = [...orderedMembers];
    setDraggedId(null);

    if (onReorder) {
      await onReorder(nextOrder);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {orderedMembers.map((member) => (
        <div
          key={member._id}
          draggable={!disableReorder}
          onDragStart={() => !disableReorder && setDraggedId(member._id)}
          onDragOver={(event) => {
            if (disableReorder) return;
            event.preventDefault();
          }}
          onDragEnter={() => {
            if (disableReorder || !draggedId) return;
            moveMember(draggedId, member._id);
          }}
          onDrop={handleDrop}
          onDragEnd={() => setDraggedId(null)}
          className={`relative rounded-[1.6rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md ${
            draggedId === member._id ? "opacity-60 ring-2 ring-indigo-300" : ""
          }`}
        >
          <div className="absolute right-3 top-3 flex gap-2">
            <div
              title={disableReorder ? "Clear search to reorder" : "Drag to reorder"}
              className={`rounded-full border border-slate-200 bg-white p-2 transition ${
                disableReorder ? "cursor-not-allowed text-slate-300" : "cursor-grab text-slate-500 hover:bg-slate-100"
              }`}
            >
              <GripVertical size={14} />
            </div>
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

          <div className="mb-3 flex items-start gap-3">
            <img
              src={member.photo?.url}
              alt={member.name}
              className="h-24 w-24 rounded-[1.2rem] object-cover ring-1 ring-slate-200"
            />
            <div className="flex flex-1 flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                {member.roleType}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                #{member.order || 0}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                {member.team}
              </span>
            </div>
          </div>

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
