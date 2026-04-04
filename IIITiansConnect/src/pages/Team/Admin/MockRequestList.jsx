import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Calendar, ArrowRight, Trash2, UserPlus } from "lucide-react";

export default function MockRequestList({ onApprove }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem("local-team-requests") || "[]");
      console.log("Mock Data from LocalStorage:", data);
      setRequests(data);
    };

    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const handleDelete = (id) => {
    const updated = requests.filter(r => r._id !== id);
    localStorage.setItem("local-team-requests", JSON.stringify(updated));
    setRequests(updated);
  };

  const handleApprove = (req) => {
    // We remove it from mock and send it to the form
    handleDelete(req._id);
    onApprove(req);
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-slate-200 bg-white p-20 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 ring-1 ring-slate-100">
          <ShieldCheck size={32} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No pending team applications</h3>
        <p className="mt-2 text-sm text-slate-500">New team requests submitted via /team/join will appear here locally.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {requests.map((req) => (
        <div key={req._id} className="group flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md lg:flex-row lg:items-center">
          <div className="flex items-center gap-4 lg:w-1/4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
              <div className="flex h-full w-full items-center justify-center text-indigo-400">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 line-clamp-1">{req.name}</h4>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                {req.applicantType === 'NEW' ? (
                  <span className="flex items-center gap-1 text-emerald-600">
                     <UserPlus size={10} /> New Recruit
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-600">
                     <ShieldCheck size={10} /> Tenure Update
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4 lg:px-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</p>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate">{req.email}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requested Team</p>
              <p className="text-sm font-semibold text-slate-700">{req.team}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role/Tenure</p>
              <p className="text-sm font-medium text-slate-600">{req.role} ({req.year})</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Submitted</p>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} className="text-slate-400" />
                {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
               onClick={() => handleApprove(req)}
               className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-indigo-600 lg:flex-none"
            >
              Approve & Edit <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleDelete(req._id)}
              className="flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
