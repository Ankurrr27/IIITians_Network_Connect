import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  LogIn,
  LogOut,
  Megaphone,
  Plus,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import api from "../../api/axios";
import ImageCropModal from "../../components/ImageCropModal";
import DiscussSlidePanel from "./components/DiscussSlidePanel";
import DiscussFeedCard from "./components/DiscussFeedCard";
import {
  initialLoginForm,
  initialPostForm,
  initialRegisterForm,
  typeMeta,
} from "./discuss.constants";

export default function DiscussPage() {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelMode, setPanelMode] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [editingPostId, setEditingPostId] = useState("");
  const [postForm, setPostForm] = useState(initialPostForm);
  const [postImages, setPostImages] = useState([]);
  const [postPreviews, setPostPreviews] = useState([]);
  const [cropQueue, setCropQueue] = useState([]);
  const [postState, setPostState] = useState({ loading: false, error: "", success: "" });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [authState, setAuthState] = useState({ loading: false, error: "", success: "" });
  const [accountLoading, setAccountLoading] = useState(true);
  const [account, setAccount] = useState(null);

  const stats = useMemo(
    () => ({
      total: posts.length,
      colleges: new Set(posts.map((post) => post.collegeName).filter(Boolean)).size,
      clubs: new Set(posts.map((post) => `${post.collegeName}::${post.clubName}`).filter(Boolean)).size,
    }),
    [posts]
  );

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
      setMyPosts([]);
      return;
    }

    setAccountLoading(true);
    try {
      const [accountRes, postsRes] = await Promise.all([
        api.get("/discuss-accounts/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/discuss/mine", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAccount(accountRes.data);
      setMyPosts(postsRes.data || []);
    } catch {
      localStorage.removeItem("discussToken");
      setAccount(null);
      setMyPosts([]);
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

    const previews = postImages.map((file) => URL.createObjectURL(file));
    setPostPreviews(previews);
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [postImages]);

  const resetComposer = () => {
    setEditingPostId("");
    setPostForm(initialPostForm);
    setPostImages([]);
    setPostPreviews([]);
    setCropQueue([]);
  };

  const openComposer = () => {
    if (!account) {
      setAuthState({
        loading: false,
        error: "",
        success: "Log into your club account first, then post from the same board.",
      });
      setPanelMode("auth");
      return;
    }
    resetComposer();
    setPostState({ loading: false, error: "", success: "" });
    setPanelMode("composer");
  };

  const openEditPost = (post) => {
    setEditingPostId(post._id);
    setPostForm({
      title: post.title || "",
      description: post.description || "",
      type: post.type || "announcement",
      actionLink: post.actionLink || "",
      eventDate: post.eventDate ? String(post.eventDate).slice(0, 10) : "",
    });
    setPostImages([]);
    setPostPreviews(
      (post.photos || []).map((photo) => photo?.url).filter(Boolean)
    );
    setPostState({ loading: false, error: "", success: "" });
    setPanelMode("composer");
  };

  const closePanel = () => {
    setPanelMode("");
    setAuthState((prev) => ({ ...prev, error: "" }));
    setPostState((prev) => ({ ...prev, error: "" }));
    resetComposer();
  };

  const handleBannerChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 6);
    if (!files.length) return;
    setPostImages([]);
    setCropQueue(files);
    event.target.value = "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthState({ loading: true, error: "", success: "" });
    try {
      await api.post("/discuss-accounts/register", registerForm);
      setRegisterForm(initialRegisterForm);
      setAuthMode("login");
      setAuthState({
        loading: false,
        error: "",
        success: "Club account created. Log in now and wait for verification.",
      });
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
      await loadAccount();
      setAuthState({
        loading: false,
        error: "",
        success: "Logged in successfully.",
      });
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
    setMyPosts([]);
    closePanel();
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("discussToken");
    if (!token) return;

    setPostState({ loading: true, error: "", success: "" });
    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("description", postForm.description);
      formData.append("type", postForm.type);
      formData.append("actionLink", postForm.actionLink);
      formData.append("eventDate", postForm.eventDate);
      postImages.forEach((image) => formData.append("banners", image));

      if (editingPostId) {
        await api.patch(`/discuss/mine/${editingPostId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/discuss", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      resetComposer();
      await Promise.all([loadPosts(), loadAccount()]);
      setPostState({
        loading: false,
        error: "",
        success: editingPostId ? "Post updated successfully." : "Post submitted successfully.",
      });
    } catch (error) {
      setPostState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not save discuss post.",
      });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2.2rem] border border-sky-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(236,246,255,0.9))] p-5 shadow-[0_24px_80px_-40px_rgba(37,99,235,0.38)] sm:p-8">
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
                Clubs can post updates, come back later, and edit their earlier announcements from the same account.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-sky-100 bg-white/70 p-4 shadow-sm xl:max-w-md">
              {accountLoading ? (
                <div className="text-sm text-slate-600">Restoring your discuss account...</div>
              ) : account ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                      <ShieldCheck className="h-4 w-4" />
                      {account.clubName}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${account.isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {account.isAuthorized ? account.badgeLabel || "Verified by network" : account.badgeLabel || "Pending verification"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{account.collegeName}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={openComposer}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <Plus className="h-4 w-4" />
                      Post update
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanelMode("auth")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50"
                    >
                      Manage account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-slate-600">
                    Create a club account once, then post and manage everything from here.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setPanelMode("auth")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50"
                    >
                      <LogIn className="h-4 w-4" />
                      Club account
                    </button>
                    <button
                      type="button"
                      onClick={openComposer}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <Plus className="h-4 w-4" />
                      Post update
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Live updates" value={stats.total} />
            <StatCard label="Colleges active" value={stats.colleges} />
            <StatCard label="Communities posting" value={stats.clubs} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <EmptyBlock message="Loading discuss updates..." />
          ) : posts.length === 0 ? (
            <EmptyBlock message="No live updates yet. The first approved club announcement will appear here." />
          ) : (
            posts.map((post) => <DiscussFeedCard key={post._id} post={post} />)
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

      <DiscussSlidePanel
        open={Boolean(panelMode)}
        title={panelMode === "composer" ? (editingPostId ? "Edit post" : "Post to Discuss") : "Club account"}
        onClose={closePanel}
      >
        {panelMode === "composer" ? (
          <div>
            {postState.error && <Message tone="error">{postState.error}</Message>}
            {postState.success && <Message tone="success">{postState.success}</Message>}
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput name="title" value={postForm.title} onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))} placeholder="Post title" required />
                <select
                  name="type"
                  value={postForm.type}
                  onChange={(e) => setPostForm((p) => ({ ...p, type: e.target.value }))}
                  className={inputClassName}
                >
                  {Object.entries(typeMeta).map(([value, item]) => (
                    <option key={value} value={value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <TextInput name="actionLink" value={postForm.actionLink} onChange={(e) => setPostForm((p) => ({ ...p, actionLink: e.target.value }))} placeholder="Registration or event link" />
              {postForm.type === "event" && (
                <TextInput
                  name="eventDate"
                  type="date"
                  value={postForm.eventDate}
                  onChange={(e) => setPostForm((p) => ({ ...p, eventDate: e.target.value }))}
                  required
                />
              )}
              <label className="block rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Add photos</p>
                    <p className="text-xs text-slate-500">Every image opens crop first. Up to 6 files.</p>
                  </div>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleBannerChange} className="mt-4 block w-full text-sm text-slate-500" />
              </label>
              {postPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {postPreviews.map((preview, index) => (
                    <img key={`${preview}-${index}`} src={preview} alt={`Preview ${index + 1}`} className="aspect-square w-full rounded-[1.35rem] object-cover ring-1 ring-slate-200" />
                  ))}
                </div>
              )}
              <textarea
                name="description"
                value={postForm.description}
                onChange={(e) => setPostForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Write the update..."
                rows={7}
                required
                className={`${inputClassName} min-h-[180px] resize-none py-4`}
              />
              <button
                type="submit"
                disabled={postState.loading || accountLoading || !account}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {postState.loading ? "Saving..." : editingPostId ? "Save changes" : "Publish request"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {authState.error && <Message tone="error">{authState.error}</Message>}
            {authState.success && <Message tone="success">{authState.success}</Message>}
            {account ? (
              <div className="space-y-4 rounded-[1.6rem] bg-slate-50 p-5 ring-1 ring-slate-200/80">
                <div className="space-y-1 text-sm text-slate-600">
                  <p>{account.clubName}</p>
                  <p>{account.collegeName}</p>
                  <p>{account.contactName}</p>
                  {account.contactPhone && <p>{account.contactPhone}</p>}
                  <p>{account.email}</p>
                </div>
                {myPosts.length > 0 && (
                  <div className="rounded-[1.4rem] bg-white p-3 ring-1 ring-slate-200">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                      Past posts
                    </p>
                    <div className="mt-3 space-y-2">
                      {myPosts.map((post) => (
                        <button
                          key={post._id}
                          type="button"
                          onClick={() => openEditPost(post)}
                          className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-left ring-1 ring-slate-200 transition hover:bg-sky-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {post.title}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {post.status}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                            Edit
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                <div className="flex gap-2 rounded-full bg-slate-100 p-1">
                  <button type="button" onClick={() => setAuthMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Login</button>
                  <button type="button" onClick={() => setAuthMode("register")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${authMode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Register</button>
                </div>
                {authMode === "login" ? (
                  <form onSubmit={handleLogin} className="mt-5 space-y-4">
                    <HandleInput value={loginForm.handle} onChange={(e) => setLoginForm((p) => ({ ...p, handle: e.target.value }))} />
                    <TextInput name="password" type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" required />
                    <button type="submit" disabled={authState.loading} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                      <LogIn className="h-4 w-4" />
                      {authState.loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput name="collegeName" value={registerForm.collegeName} onChange={(e) => setRegisterForm((p) => ({ ...p, collegeName: e.target.value }))} placeholder="College name" required />
                      <TextInput name="clubName" value={registerForm.clubName} onChange={(e) => setRegisterForm((p) => ({ ...p, clubName: e.target.value }))} placeholder="Club name" required />
                      <TextInput name="contactName" value={registerForm.contactName} onChange={(e) => setRegisterForm((p) => ({ ...p, contactName: e.target.value }))} placeholder="PoC name" required />
                      <TextInput name="contactPhone" value={registerForm.contactPhone} onChange={(e) => setRegisterForm((p) => ({ ...p, contactPhone: e.target.value }))} placeholder="PoC phone" />
                    </div>
                    <HandleInput value={registerForm.handle} onChange={(e) => setRegisterForm((p) => ({ ...p, handle: e.target.value }))} />
                    <TextInput name="password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} placeholder="Create password" required />
                    <button type="submit" disabled={authState.loading} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                      <UserPlus className="h-4 w-4" />
                      {authState.loading ? "Creating..." : "Create club account"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </DiscussSlidePanel>

      {cropQueue[0] && (
        <ImageCropModal
          file={cropQueue[0]}
          aspect={1}
          onClose={() => setCropQueue((prev) => prev.slice(1))}
          onCrop={(croppedFile) => {
            setPostImages((prev) => [...prev, croppedFile].slice(0, 6));
            setCropQueue((prev) => prev.slice(1));
          }}
        />
      )}
    </section>
  );
}

function EmptyBlock({ message }) {
  return <div className="rounded-[1.8rem] border border-sky-100 bg-white/90 px-5 py-6 text-sm text-slate-600 shadow-sm">{message}</div>;
}

function Message({ tone = "success", children }) {
  const styles = tone === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
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

function TextInput({ name, type = "text", value, onChange, placeholder, required = false }) {
  return <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={inputClassName} />;
}

function HandleInput({ value, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
      <input name="handle" value={value} onChange={onChange} placeholder="neon" required className="w-full bg-transparent px-4 py-3 text-sm outline-none" />
      <span className="flex items-center border-l border-slate-200 px-4 text-sm text-slate-500">@iiitiansnetwork</span>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100";
 
