import { Check, Edit, Trash2, UserPlus, Clock, Info } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function TeamRequestList({ onApprove, reloadTrigger }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Hypothetical endpoint for team join requests
      const res = await api.get("/team-requests");
      setRequests(res.data || []);
    } catch (err) {
      setError("Waiting for backend API /team-requests to be live...");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [reloadTrigger]);

  const reject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    try {
      await api.delete(`/team-requests/${id}`);
      loadRequests();
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-slate-500">
        <Clock className="mr-2 h-4 w-4 animate-spin" />
        Loading pending applications...
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Info className="mx-auto h-8 w-8 text-amber-500" />
        <p className="mt-3 text-sm font-medium text-amber-800">{error}</p>
        <p className="mt-1 text-xs text-amber-600">Applications submitted via the public form will appear here once the API is connected.</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        <UserPlus className="mx-auto h-10 w-10 opacity-20" />
        <p className="mt-4 font-medium text-slate-400 text-lg">No pending applications</p>
        <p className="mt-1 text-sm">When someone applies via /team/join, their profile will appear here for review.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {requests.map((req) => (
        <div key={req._id} className="group relative flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 transition hover:shadow-md lg:flex-row lg:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
            {req.photo?.url ? (
              <img src={req.photo.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <UserPlus size={40} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900 truncate">{req.name}</h3>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-200">
                {req.team}
              </span>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                {req.email}
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-slate-400" />
                {req.iiit} ({req.year})
              </div>
            </div>

            {req.aboutText && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 italic">
                "{req.aboutText}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 lg:flex-col lg:items-end">
            <button
              onClick={() => onApprove(req)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 lg:w-full lg:px-4"
            >
              <Check size={16} />
              Review & Approve
            </button>
            <div className="flex gap-2 lg:w-full lg:justify-end">
              <button
                onClick={() => reject(req._id)}
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-rose-600 transition hover:bg-rose-50 hover:border-rose-200"
                title="Reject"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
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
