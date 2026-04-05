import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  Newspaper,
  Phone,
  ShieldCheck,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";
import api from "../../api/axios";

const statusOptions = ["pending", "approved", "rejected"];
const roleOptions = ["club_member", "club_manager", "publisher"];

export default function DiscussAdminPage() {
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResponse, accountsResponse] = await Promise.all([
        api.get("/discuss/admin/all"),
        api.get("/discuss-accounts/admin/all"),
      ]);
      setPosts(postsResponse.data || []);
      setAccounts(accountsResponse.data || []);
    } catch (error) {
      console.error(error);
      setPosts([]);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      const response = await api.patch(`/discuss/${id}`, { status });
      setPosts((prev) => prev.map((post) => (post._id === id ? response.data : post)));
    } catch (error) {
      console.error(error);
      alert("Could not update discuss post");
    } finally {
      setSavingId("");
    }
  };

  const deletePost = async (id) => {
    const ok = window.confirm("Delete this discuss post?");
    if (!ok) return;
    setSavingId(id);
    try {
      await api.delete(`/discuss/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete discuss post");
    } finally {
      setSavingId("");
    }
  };

  const updateAccount = async (id, updates) => {
    setSavingId(id);
    try {
      const response = await api.patch(`/discuss-accounts/admin/${id}`, updates);
      setAccounts((prev) => prev.map((account) => (account.id === id ? response.data.account : account)));
    } catch (error) {
      console.error(error);
      alert("Could not update discuss account");
    } finally {
      setSavingId("");
    }
  };

  const deleteAccount = async (id) => {
    const ok = window.confirm("Delete this discuss account?");
    if (!ok) return;
    setSavingId(id);
    try {
      await api.delete(`/discuss-accounts/admin/${id}`);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete discuss account");
    } finally {
      setSavingId("");
    }
  };

  const getPostCount = (account) =>
    posts.filter(
      (post) =>
        (post.clubName || "").trim().toLowerCase() ===
          (account.clubName || "").trim().toLowerCase() &&
        (post.collegeName || "").trim().toLowerCase() ===
          (account.collegeName || "").trim().toLowerCase()
    ).length;

  const stats = {
    accounts: accounts.length,
    authorised: accounts.filter((account) => account.isAuthorized).length,
    pendingAccounts: accounts.filter((account) => !account.isAuthorized).length,
    pendingPosts: posts.filter((post) => post.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Discuss workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Discuss accounts and moderation</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage verified club identities, review who is posting, and moderate what goes live on the network board.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <StatCard label="Accounts" value={stats.accounts} />
            <StatCard label="Verified" value={stats.authorised} />
            <StatCard label="Pending accounts" value={stats.pendingAccounts} />
            <StatCard label="Pending posts" value={stats.pendingPosts} />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Discuss accounts</h2>
        </div>

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-5 shadow-sm"
              >
                <div className="flex gap-2">
                  <div className="h-7 w-28 rounded-full bg-slate-200" />
                  <div className="h-7 w-24 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-6 w-1/2 rounded bg-slate-200" />
                <div className="mt-3 flex gap-2">
                  <div className="h-7 w-28 rounded-full bg-slate-100" />
                  <div className="h-7 w-20 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="h-28 rounded-2xl bg-slate-100" />
                  <div className="h-28 rounded-2xl bg-slate-100" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="h-12 rounded-2xl bg-slate-100" />
                  <div className="h-12 rounded-2xl bg-slate-100" />
                  <div className="h-12 rounded-2xl bg-slate-100 sm:col-span-2" />
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-slate-600">No discuss accounts created yet.</p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {accounts.map((account) => (
              <article
                key={account.id}
                className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${account.isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {account.badgeLabel || (account.isAuthorized ? "Verified by network" : "Pending verification")}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                    {account.role.replace("_", " ")}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">{account.clubName}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <Building2 className="h-3.5 w-3.5" />
                    {account.collegeName}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <Newspaper className="h-3.5 w-3.5" />
                    {getPostCount(account)} posts
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Point of contact</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{account.contactName}</p>
                    {account.contactPhone && (
                      <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        {account.contactPhone}
                      </p>
                    )}
                    {account.email && (
                      <p className="mt-1 inline-flex items-center gap-2 break-all text-sm text-slate-600">
                        <Mail className="h-4 w-4" />
                        {account.email}
                      </p>
                    )}
                    {account.website && (
                      <a
                        href={account.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 break-all text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {account.website}
                      </a>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Activity</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Created {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "recently"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Last login {account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : "not yet"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    defaultValue={account.website || ""}
                    onBlur={(event) => updateAccount(account.id, { website: event.target.value })}
                    placeholder="Club website / Linktree"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                  <select
                    value={account.role}
                    onChange={(event) => updateAccount(account.id, { role: event.target.value })}
                    disabled={savingId === account.id}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role.replace("_", " ")}
                      </option>
                    ))}
                  </select>

                  <input
                    defaultValue={account.badgeLabel || ""}
                    onBlur={(event) => updateAccount(account.id, { badgeLabel: event.target.value })}
                    placeholder="Badge label"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={savingId === account.id}
                    onClick={() =>
                      updateAccount(account.id, {
                        isAuthorized: !account.isAuthorized,
                        badgeLabel: !account.isAuthorized
                          ? account.badgeLabel || "Verified by network"
                          : "Pending verification",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <UserCog className="h-4 w-4" />
                    {account.isAuthorized ? "Remove verification" : "Verify account"}
                  </button>

                  <button
                    type="button"
                    disabled={savingId === account.id}
                    onClick={() => deleteAccount(account.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Discuss posts</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-24 rounded-full bg-slate-200" />
                  <div className="h-7 w-20 rounded-full bg-slate-100" />
                  <div className="h-7 w-28 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-6 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
                <div className="mt-4 h-40 rounded-2xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-600">No discuss posts submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post._id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={post.status} />
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                        {post.type}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                        {post.collegeName}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                        {post.clubName}
                      </span>
                      {post.isAuthorisedPost && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                          {post.badgeLabel || "Verified by network"}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{post.description}</p>
                    {post.banner?.url && (
                      <img
                        src={post.banner.url}
                        alt={post.title}
                        className="mt-4 h-40 w-full rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                    )}
                    <p className="mt-3 text-sm text-slate-500">
                      {post.contactName || "No contact name"}
                      {post.contactPhone ? ` · ${post.contactPhone}` : ""}
                      {post.contactEmail ? ` · ${post.contactEmail}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={savingId === post._id}
                        onClick={() => updateStatus(post._id, status)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${post.status === status ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"}`}
                      >
                        {status}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={savingId === post._id}
                      onClick={() => deletePost(post._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
        <XCircle className="h-4 w-4" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
      <Clock3 className="h-4 w-4" />
      Pending
    </span>
  );
}
