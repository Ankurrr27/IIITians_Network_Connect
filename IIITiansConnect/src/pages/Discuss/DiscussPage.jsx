import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  Handshake,
  ImagePlus,
  LogIn,
  LogOut,
  Megaphone,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import api from "../../api/axios";

const initialPostForm = {
  title: "",
  description: "",
  type: "announcement",
  actionLink: "",
};

const initialRegisterForm = {
  collegeName: "",
  clubName: "",
  contactName: "",
  contactPhone: "",
  handle: "",
  password: "",
};

const initialLoginForm = {
  handle: "",
  password: "",
};

const typeMeta = {
  announcement: { label: "Announcement", Icon: Megaphone },
  event: { label: "Event Push", Icon: CalendarDays },
  campaign: { label: "Campaign", Icon: Sparkles },
  collaboration: { label: "Collaboration", Icon: Handshake },
  opportunity: { label: "Opportunity", Icon: BriefcaseBusiness },
};

export default function DiscussPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelMode, setPanelMode] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [postForm, setPostForm] = useState(initialPostForm);
  const [postImages, setPostImages] = useState([]);
  const [postPreviews, setPostPreviews] = useState([]);
  const [postState, setPostState] = useState({ loading: false, error: "", success: "" });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [authState, setAuthState] = useState({ loading: false, error: "", success: "" });
  const [accountLoading, setAccountLoading] = useState(true);
  const [account, setAccount] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/discuss");
      setPosts(response.data || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAccount = async () => {
    const token = localStorage.getItem("discussToken");
    if (!token) {
      setAccount(null);
      setAccountLoading(false);
      return;
    }

    setAccountLoading(true);
    try {
      const response = await api.get("/discuss-accounts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccount(response.data);
    } catch {
      localStorage.removeItem("discussToken");
      setAccount(null);
    } finally {
      setAccountLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadAccount();
  }, []);

  useEffect(() => {
    if (!postImages.length) {
      setPostPreviews([]);
      return undefined;
    }

    const nextPreviews = postImages.map((file) => URL.createObjectURL(file));
    setPostPreviews(nextPreviews);

    return () => nextPreviews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [postImages]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      colleges: new Set(posts.map((post) => post.collegeName).filter(Boolean)).size,
      clubs: new Set(posts.map((post) => `${post.collegeName}::${post.clubName}`).filter(Boolean)).size,
    }),
    [posts]
  );

  const openComposer = () => {
    setPostState({ loading: false, error: "", success: "" });
    if (!account) {
      setAuthState({
        loading: false,
        error: "",
        success: "Create or log into your club account first, then you can publish updates from the + button.",
      });
      setPanelMode("auth");
      return;
    }

    setPanelMode("composer");
  };

  const closePanel = () => {
    setPanelMode("");
    setAuthState((prev) => ({ ...prev, error: "" }));
    setPostState((prev) => ({ ...prev, error: "" }));
  };

  const handlePostChange = (event) => {
    setPostForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleRegisterChange = (event) => {
    setRegisterForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLoginChange = (event) => {
    setLoginForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleBannerChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 6);
    setPostImages(files);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthState({ loading: true, error: "", success: "" });

    try {
      await api.post("/discuss-accounts/register", registerForm);
      setRegisterForm(initialRegisterForm);
      setAuthState({
        loading: false,
        error: "",
        success: "Club account created. Admins can now verify it, and you can log in any time with your handle.",
      });
      setAuthMode("login");
    } catch (error) {
      setAuthState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not create discuss account.",
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthState({ loading: true, error: "", success: "" });

    try {
      const response = await api.post("/discuss-accounts/login", loginForm);
      localStorage.setItem("discussToken", response.data.token);
      setLoginForm(initialLoginForm);
      setAuthState({
        loading: false,
        error: "",
        success: "Logged in successfully. You can now open the + button and post updates.",
      });
      await loadAccount();
    } catch (error) {
      setAuthState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not log in to discuss account.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("discussToken");
    setAccount(null);
    setPostForm(initialPostForm);
    setPostImages([]);
    setPostPreviews([]);
    if (panelMode === "composer") {
      setPanelMode("");
    }
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("discussToken");
    if (!token) {
      setPostState({
        loading: false,
        error: "Log in with a discuss account first.",
        success: "",
      });
      setPanelMode("auth");
      return;
    }

    setPostState({ loading: true, error: "", success: "" });

    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("description", postForm.description);
      formData.append("type", postForm.type);
      formData.append("actionLink", postForm.actionLink);
      postImages.forEach((image) => formData.append("banners", image));

      await api.post("/discuss", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPostForm(initialPostForm);
      setPostImages([]);
      setPostPreviews([]);
      setPostState({
        loading: false,
        error: "",
        success: account?.isAuthorized
          ? "Update submitted. Your account is authorized, so eligible posts can go live faster."
          : "Update submitted for admin review.",
      });
      await loadPosts();
    } catch (error) {
      setPostState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not submit discuss post.",
      });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.75'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2.2rem] border border-sky-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(236,246,255,0.9))] p-5 shadow-[0_24px_80px_-40px_rgba(37,99,235,0.38)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <Megaphone className="h-4 w-4" />
                Discuss Board
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Network-wide updates from clubs, communities, and campus teams.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Open Discuss to catch live event pushes, collaborations, campaigns, and announcements across the IIITians Network.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:max-w-xl xl:justify-end">
              <button
                type="button"
                onClick={() => {
                  setAuthState({ loading: false, error: "", success: "" });
                  setPanelMode("auth");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
              >
                <LogIn className="h-4 w-4" />
                Club account
              </button>
              <button
                type="button"
                onClick={openComposer}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Plus className="h-4 w-4" />
                Post update
              </button>
            </div>
          </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Live updates" value={stats.total} />
            <StatCard label="Colleges active" value={stats.colleges} />
            <StatCard label="Communities posting" value={stats.clubs} />
          </div>
        </div>

        {accountLoading ? (
          <div className="mt-5 rounded-[1.7rem] border border-sky-100 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm">
            Restoring your discuss account...
          </div>
        ) : account ? (
          <div className="mt-5 flex flex-col gap-4 rounded-[1.8rem] border border-sky-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(232,244,255,0.92))] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  <ShieldCheck className="h-4 w-4" />
                  {account.clubName}
                </span>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${account.isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {account.badgeLabel || (account.isAuthorized ? "Authorized" : "Pending verification")}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">{account.collegeName}</p>
              <p className="mt-1 text-sm text-slate-600">
                {account.contactName}
                {account.contactPhone ? ` · ${account.contactPhone}` : ""}
                {account.email ? ` · ${account.email}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openComposer}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Plus className="h-4 w-4" />
                Post now
              </button>
              <button
                type="button"
                onClick={() => setPanelMode("auth")}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50"
              >
                Manage account
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-4 px-1">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Latest updates</h2>
            <p className="mt-1 text-sm text-slate-600">
              Browse the board first. Account access and post creation stay tucked away until you need them.
            </p>
          </div>

          <button
            type="button"
            onClick={openComposer}
            className="hidden items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 lg:inline-flex"
          >
            <Plus className="h-4 w-4" />
            New update
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {loading ? (
            <EmptyBlock message="Loading discuss updates..." />
          ) : posts.length === 0 ? (
            <EmptyBlock message="No live updates yet. The first approved club announcement will appear here." />
          ) : (
            posts.map((post) => <DiscussCard key={post._id} post={post} />)
          )}
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-30 lg:hidden">
        <button
          type="button"
          onClick={openComposer}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition hover:bg-sky-700"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <SlidePanel
        open={Boolean(panelMode)}
        title={panelMode === "composer" ? "Post to Discuss" : "Club account"}
        onClose={closePanel}
      >
        {panelMode === "composer" ? (
          <div>
            <p className="text-sm leading-6 text-slate-600">
              Push an event, campaign, collaboration, or announcement. Add a banner if you want the update to feel more alive on the board.
            </p>

            {account ? (
              <div className="mt-4 rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    {account.clubName}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${account.isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {account.badgeLabel || (account.isAuthorized ? "Authorized" : "Pending verification")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{account.collegeName}</p>
                <p className="mt-1 text-sm text-slate-600">{account.contactName}</p>
                {account.contactPhone && <p className="mt-1 text-sm text-slate-600">{account.contactPhone}</p>}
              </div>
            ) : (
              <Message tone="error">Create or log into your club account first to post an update.</Message>
            )}

            {postState.error && <Message tone="error">{postState.error}</Message>}
            {postState.success && <Message tone="success">{postState.success}</Message>}

            <form onSubmit={handleSubmitPost} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  name="title"
                  value={postForm.title}
                  onChange={handlePostChange}
                  placeholder="Post title"
                  required
                />
                <select
                  name="type"
                  value={postForm.type}
                  onChange={handlePostChange}
                  className={inputClassName}
                >
                  {Object.entries(typeMeta).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <TextInput
                name="actionLink"
                value={postForm.actionLink}
                onChange={handlePostChange}
                placeholder="Registration link / campaign link / event page"
              />

              <label className="block rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-emerald-400 hover:bg-white">
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Add event photos / promo creatives</p>
                    <p className="text-xs text-slate-500">Upload one or multiple images, up to 6 files.</p>
                  </div>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleBannerChange} className="mt-4 block w-full text-sm text-slate-500" />
              </label>

              {postPreviews.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {postPreviews.map((preview, index) => (
                    <img
                      key={`${preview}-${index}`}
                      src={preview}
                      alt={`Discuss preview ${index + 1}`}
                      className="h-40 w-full rounded-[1.5rem] object-cover ring-1 ring-slate-200"
                    />
                  ))}
                </div>
              )}

              <textarea
                name="description"
                value={postForm.description}
                onChange={handlePostChange}
                placeholder="Write the update..."
                rows={7}
                required
                className={`${inputClassName} min-h-[180px] resize-none py-4`}
              />

              <button
                type="submit"
                disabled={postState.loading || accountLoading || !account}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {postState.loading ? "Submitting..." : "Publish request"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-sm leading-6 text-slate-600">
              Create your club handle once, then use it any time to publish updates to the network board.
            </p>

            {authState.error && <Message tone="error">{authState.error}</Message>}
            {authState.success && <Message tone="success">{authState.success}</Message>}

            {accountLoading ? (
              <p className="mt-5 text-sm text-slate-600">Checking discuss account...</p>
            ) : account ? (
              <div className="mt-5 space-y-4 rounded-[1.6rem] bg-slate-50 p-5 ring-1 ring-slate-200/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    <ShieldCheck className="h-4 w-4" />
                    {account.clubName}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${account.isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {account.badgeLabel || (account.isAuthorized ? "Authorized" : "Pending verification")}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>{account.collegeName}</p>
                  <p>{account.contactName}</p>
                  {account.contactPhone && <p>{account.contactPhone}</p>}
                  <p>{account.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 flex gap-2 rounded-full bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${authMode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    Register
                  </button>
                </div>

                {authMode === "login" ? (
                  <form onSubmit={handleLogin} className="mt-5 space-y-4">
                    <HandleInput value={loginForm.handle} onChange={handleLoginChange} />
                    <TextInput
                      name="password"
                      type="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Password"
                      required
                    />
                    <button
                      type="submit"
                      disabled={authState.loading}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogIn className="h-4 w-4" />
                      {authState.loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput
                        name="collegeName"
                        value={registerForm.collegeName}
                        onChange={handleRegisterChange}
                        placeholder="College name"
                        required
                      />
                      <TextInput
                        name="clubName"
                        value={registerForm.clubName}
                        onChange={handleRegisterChange}
                        placeholder="Club / community name"
                        required
                      />
                      <TextInput
                        name="contactName"
                        value={registerForm.contactName}
                        onChange={handleRegisterChange}
                        placeholder="PoC name"
                        required
                      />
                      <TextInput
                        name="contactPhone"
                        value={registerForm.contactPhone}
                        onChange={handleRegisterChange}
                        placeholder="PoC phone / WhatsApp"
                      />
                    </div>
                    <HandleInput value={registerForm.handle} onChange={handleRegisterChange} />
                    <TextInput
                      name="password"
                      type="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="submit"
                      disabled={authState.loading}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <UserPlus className="h-4 w-4" />
                      {authState.loading ? "Creating..." : "Create club account"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </SlidePanel>
    </section>
  );
}

function SlidePanel({ open, title, onClose, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xl transform border-l border-sky-100 bg-[linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_100%)] shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sky-100 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-slate-600 transition hover:bg-sky-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        </div>
      </aside>
    </>
  );
}

function EmptyBlock({ message }) {
  return (
    <div className="rounded-[1.8rem] border border-sky-100 bg-white/90 px-5 py-6 text-sm text-slate-600 shadow-sm">
      {message}
    </div>
  );
}

function Message({ tone = "success", children }) {
  const styles =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.94),rgba(236,246,255,0.9))] px-4 py-4 ring-1 ring-sky-100/90">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function DiscussCard({ post }) {
  const meta = typeMeta[post.type] || typeMeta.announcement;
  const Icon = meta.Icon;
  const gallery = Array.isArray(post.photos) && post.photos.length > 0 ? post.photos : post.banner?.url ? [post.banner] : [];

  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-sky-100 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),rgba(242,248,255,0.96))] shadow-[0_18px_48px_-34px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(37,99,235,0.5)]">
      {gallery.length > 0 && (
        <div className={`grid ${gallery.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-1 bg-sky-50`}>
          {gallery.slice(0, 4).map((photo, index) => (
            <img
              key={photo.public_id || photo.url || index}
              src={photo.url}
              alt={`${post.title} ${index + 1}`}
              className={`w-full object-cover ${gallery.length === 1 ? "h-52 sm:h-60" : "h-40 sm:h-44"}`}
            />
          ))}
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            <Icon className="h-4 w-4" />
            {meta.label}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-sky-100">
            {post.collegeName}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 ring-1 ring-sky-100">
            {post.clubName}
          </span>
          {post.isAuthorisedPost && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
              {post.badgeLabel || "Authorized"}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{post.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
          {post.contactName && <span>{post.contactName}</span>}
          {post.contactPhone && <span>{post.contactPhone}</span>}
          {post.contactEmail && <span>{post.contactEmail}</span>}
        </div>

        {post.actionLink && (
          <a
            href={post.actionLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            Open link
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function TextInput({ name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputClassName}
    />
  );
}

function HandleInput({ value, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
      <input
        name="handle"
        value={value}
        onChange={onChange}
        placeholder="neon"
        required
        className="w-full bg-transparent px-4 py-3 text-sm outline-none"
      />
      <span className="flex items-center border-l border-slate-200 px-4 text-sm text-slate-500">
        @iiitiansnetwork
      </span>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100";
