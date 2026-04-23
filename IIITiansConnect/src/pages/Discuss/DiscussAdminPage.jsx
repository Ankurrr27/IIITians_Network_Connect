import { useEffect, useState, useMemo } from "react";
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
  Search,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../../api/axios";

const statusOptions = ["pending", "approved", "rejected"];
const roleOptions = ["club_member", "club_manager", "publisher"];

export default function DiscussAdminPage() {
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "clubs"

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

      {/* Tabs Layout */}
      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "posts"
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "clubs"
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Manage Clubs
          </button>
        </div>

        <div className="p-6">
          {activeTab === "posts" && (
            <PostsTab
              posts={posts}
              loading={loading}
              savingId={savingId}
              updateStatus={updateStatus}
              deletePost={deletePost}
            />
          )}
          {activeTab === "clubs" && (
            <ClubsTab
              accounts={accounts}
              posts={posts}
              loading={loading}
              savingId={savingId}
              updateAccount={updateAccount}
              deleteAccount={deleteAccount}
            />
          )}
        </div>
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
        <CheckCircle2 className="h-4 w-4" /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
        <XCircle className="h-4 w-4" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
      <Clock3 className="h-4 w-4" /> Pending
    </span>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center mt-8 gap-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// --- SUB COMPONENTS ---

function PostsTab({ posts, loading, savingId, updateStatus, deletePost }) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const postTypes = useMemo(() => Array.from(new Set(posts.map((p) => p.type).filter(Boolean))), [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (typeFilter !== "all" && post.type !== typeFilter) return false;

      if (startDate) {
        const start = new Date(startDate).getTime();
        const postDate = new Date(post.createdAt).getTime();
        if (postDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate).getTime() + 86400000; // end of day
        const postDate = new Date(post.createdAt).getTime();
        if (postDate > end) return false;
      }

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesTitle = post.title?.toLowerCase().includes(query);
        const matchesContent = post.description?.toLowerCase().includes(query);
        const matchesAuthor = (post.contactName?.toLowerCase().includes(query) || post.clubName?.toLowerCase().includes(query));
        if (!matchesTitle && !matchesContent && !matchesAuthor) return false;
      }
      return true;
    });
  }, [posts, statusFilter, typeFilter, debouncedSearch, startDate, endDate]);

  const paginatedPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // Reset to page 1 on filter changes
  useEffect(() => setPage(1), [debouncedSearch, statusFilter, typeFilter, startDate, endDate]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts by title, content, author..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Types</option>
            {postTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
          {(startDate || endDate || statusFilter !== "all" || typeFilter !== "all" || searchInput) && (
            <button
              onClick={() => {
                setSearchInput("");
                setStatusFilter("all");
                setTypeFilter("all");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-slate-600 py-10 text-center">No discuss posts match your filters.</p>
      ) : (
        <div className="space-y-4">
          {paginatedPosts.map((post) => (
            <article key={post._id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition hover:shadow-sm">
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
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">
                      By: {post.contactName || "No contact"} {post.contactEmail ? `(${post.contactEmail})` : ""}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={savingId === post._id}
                      onClick={() => updateStatus(post._id, status)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        post.status === status ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      }`}
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
      
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

function ClubsTab({ accounts, posts, loading, savingId, updateAccount, deleteAccount }) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [membersFilter, setMembersFilter] = useState("all");
  const [regDateFilter, setRegDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const colleges = useMemo(() => Array.from(new Set(accounts.map((a) => a.collegeName).filter(Boolean))), [accounts]);

  const aggregatedClubs = useMemo(() => {
    const group = {};
    accounts.forEach((account) => {
      const key = `${account.collegeName}::${account.clubName}`;
      if (!group[key]) {
        group[key] = {
          id: key,
          collegeName: account.collegeName,
          clubName: account.clubName,
          registrants: [],
          latestRegDate: null,
        };
      }
      group[key].registrants.push(account);
      const accDate = new Date(account.createdAt || 0);
      if (!group[key].latestRegDate || accDate > group[key].latestRegDate) {
        group[key].latestRegDate = accDate;
      }
    });

    return Object.values(group).map((club) => {
      // Sort registrants by createdAt descending (newest first)
      club.registrants.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return club;
    }).sort((a, b) => b.latestRegDate - a.latestRegDate); // Sort clubs by newest registrant first
  }, [accounts]);

  const filteredClubs = useMemo(() => {
    return aggregatedClubs.filter((club) => {
      if (collegeFilter !== "all" && club.collegeName !== collegeFilter) return false;
      if (membersFilter === "multiple" && club.registrants.length <= 1) return false;
      if (membersFilter === "single" && club.registrants.length > 1) return false;
      
      if (regDateFilter) {
        const filterDate = new Date(regDateFilter).getTime();
        const latestDate = club.latestRegDate.getTime();
        // Here we can decide if we want "since" or "on" that date. Let's do "on or after".
        if (latestDate < filterDate) return false;
      }

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesClub = club.clubName?.toLowerCase().includes(query);
        const matchesContact = club.registrants.some(r => 
          r.contactName?.toLowerCase().includes(query) || 
          r.email?.toLowerCase().includes(query)
        );
        if (!matchesClub && !matchesContact) return false;
      }
      return true;
    });
  }, [aggregatedClubs, collegeFilter, membersFilter, regDateFilter, debouncedSearch]);

  const paginatedClubs = filteredClubs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  // Reset to page 1 on filter changes
  useEffect(() => setPage(1), [debouncedSearch, collegeFilter, membersFilter, regDateFilter]);

  const getPostCount = (club) =>
    posts.filter(
      (post) =>
        (post.clubName || "").trim().toLowerCase() === (club.clubName || "").trim().toLowerCase() &&
        (post.collegeName || "").trim().toLowerCase() === (club.collegeName || "").trim().toLowerCase()
    ).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clubs, contact persons, emails..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Colleges</option>
            {colleges.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={membersFilter}
            onChange={(e) => setMembersFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">Membership Limit</option>
            <option value="multiple">Multiple Registrants</option>
            <option value="single">Single Registrant</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered since</span>
            <input
              type="date"
              value={regDateFilter}
              onChange={(e) => setRegDateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
          {(regDateFilter || collegeFilter !== "all" || membersFilter !== "all" || searchInput) && (
            <button
              onClick={() => {
                setSearchInput("");
                setCollegeFilter("all");
                setMembersFilter("all");
                setRegDateFilter("");
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredClubs.length === 0 ? (
        <p className="text-sm text-slate-600 py-10 text-center">No clubs match your filters.</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {paginatedClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              postCount={getPostCount(club)}
              savingId={savingId}
              updateAccount={updateAccount}
              deleteAccount={deleteAccount}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

function ClubCard({ club, postCount, savingId, updateAccount, deleteAccount }) {
  const [expanded, setExpanded] = useState(false);
  const primaryAccount = club.registrants[0];

  return (
    <article className="flex flex-col rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{club.clubName}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Building2 className="h-3.5 w-3.5" />
              {club.collegeName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <Newspaper className="h-3.5 w-3.5" />
              {postCount} posts
            </span>
            {club.registrants.length > 1 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <Users className="h-3.5 w-3.5" />
                {club.registrants.length} accounts
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Registered Network Accounts
          </p>
          {club.registrants.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              {expanded ? (
                <>Hide other registrants <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>View all {club.registrants.length} registrants <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(expanded ? club.registrants : [primaryAccount]).map((account, index) => (
            <div key={account.id} className="relative rounded-2xl bg-slate-50/80 p-5 ring-1 ring-slate-200">
              {index === 0 && expanded && club.registrants.length > 1 && (
                <div className="absolute -top-2.5 right-4 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-indigo-200">
                  PRIMARY CONTACT
                </div>
              )}
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900">{account.contactName}</p>
                  <div className="mt-1 flex flex-col gap-1">
                    {account.email && (
                      <span className="inline-flex items-center gap-2 text-sm text-indigo-600 font-bold">
                        <Mail className="h-4 w-4 text-slate-400" /> {account.email.split('@')[0]}
                        <span className="text-[10px] text-slate-400 font-normal">@iiitiansnetwork</span>
                      </span>
                    )}
                    {account.contactPhone && (
                      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" /> {account.contactPhone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      Registered {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${account.isAuthorized ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {account.isAuthorized ? account.badgeLabel || "Verified" : "Pending Verif."}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 ring-1 ring-slate-200 shadow-sm">
                    {account.role.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <span className="absolute -top-2 left-2 bg-slate-50 px-1 text-[9px] font-bold text-slate-400">Club Name</span>
                  <input
                    defaultValue={account.clubName || ""}
                    onBlur={(event) => {
                       if (event.target.value !== account.clubName) {
                         updateAccount(account.id, { clubName: event.target.value });
                       }
                    }}
                    placeholder="Club display name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 bg-slate-50 px-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Unique ID (Handle)</span>
                  <input
                    defaultValue={account.email?.split('@')[0] || ""}
                    onBlur={(event) => {
                       const nextHandle = event.target.value.trim();
                       if (nextHandle && nextHandle !== account.email?.split('@')[0]) {
                         updateAccount(account.id, { handle: nextHandle });
                       }
                    }}
                    placeholder="Unique club handle"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm font-bold text-indigo-600 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 bg-slate-50 px-1 text-[9px] font-bold text-slate-400">Direct Website</span>
                  <input
                    defaultValue={account.website || ""}
                    onBlur={(event) => {
                       if (event.target.value !== account.website) {
                         updateAccount(account.id, { website: event.target.value });
                       }
                    }}
                    placeholder="Official URL"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={account.role}
                  onChange={(event) => updateAccount(account.id, { role: event.target.value })}
                  disabled={savingId === account.id}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role.replace("_", " ")}</option>
                  ))}
                </select>
                <div className="sm:col-span-2 relative">
                   <span className="absolute -top-2 left-2 bg-slate-50 px-1 text-[9px] font-bold text-slate-400">Moderation Badge / Verification Title</span>
                  <input
                    defaultValue={account.badgeLabel || ""}
                    onBlur={(event) => {
                       if (event.target.value !== account.badgeLabel) {
                         updateAccount(account.id, { badgeLabel: event.target.value });
                       }
                    }}
                    placeholder="e.g. Verified Society"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-200">
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
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 sm:flex-none"
                >
                  <UserCog className="h-4 w-4" />
                  {account.isAuthorized ? "Retract Verification" : "Verify Account"}
                </button>
                <button
                  type="button"
                  disabled={savingId === account.id}
                  onClick={() => deleteAccount(account.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4">
        <div className="h-10 w-full rounded-xl bg-slate-200" />
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 w-full rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
