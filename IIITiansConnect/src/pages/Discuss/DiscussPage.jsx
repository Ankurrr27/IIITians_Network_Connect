import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Trash2,
  ImagePlus,
  LogIn,
  LogOut,
  Megaphone,
  Plus,
  Send,
  ShieldCheck,
  UserPlus,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  BadgeCheck,
  Clock,
  Users,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [collegeOptions, setCollegeOptions] = useState([]);
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

  const [existingClubs, setExistingClubs] = useState([]);
  const [duplicateClubFound, setDuplicateClubFound] = useState(false);

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

  const loadPublicAccounts = async () => {
    try {
      const response = await api.get("/discuss-accounts/public");
      setExistingClubs(response.data || []);
    } catch {
      setExistingClubs([]);
    }
  };

  const loadColleges = async () => {
    try {
      const response = await api.get("/colleges");
      setCollegeOptions(
        (response.data || []).map((college) => college?.name).filter(Boolean)
      );
    } catch {
      setCollegeOptions([]);
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
    loadColleges();
    loadPublicAccounts();
  }, []);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const college = searchParams.get("college");

    if (college) {
      setRegisterForm((prev) => ({
        ...prev,
        collegeName: prev.collegeName || college,
      }));
    }

    if (mode === "register") {
      setAuthMode("register");
      setPanelMode("auth");
    }
  }, [searchParams]);

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
    if (searchParams.get("mode") || searchParams.get("college")) {
      setSearchParams({}, { replace: true });
    }
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
        success: "Club request created. An admin must approve it before login and posting are enabled.",
      });
    } catch (error) {
      setAuthState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not create discuss account.",
      });
    }
  };

  useEffect(() => {
    if (authMode === "register" && registerForm.clubName && registerForm.collegeName) {
      const exists = existingClubs.some(
        (c) =>
          c.clubName.trim().toLowerCase() === registerForm.clubName.trim().toLowerCase() &&
          c.collegeName.trim().toLowerCase() === registerForm.collegeName.trim().toLowerCase()
      );
      setDuplicateClubFound(exists);
    } else {
      setDuplicateClubFound(false);
    }
  }, [registerForm.clubName, registerForm.collegeName, existingClubs, authMode]);

  const clubSuggestions = useMemo(() => {
    if (!registerForm.collegeName) return [];
    const clubsAtCollege = existingClubs.filter(
      (c) => c.collegeName.trim().toLowerCase() === registerForm.collegeName.trim().toLowerCase()
    );
    return Array.from(new Set(clubsAtCollege.map((c) => c.clubName)));
  }, [registerForm.collegeName, existingClubs]);

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

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("discussToken");
    if (!token) return;

    const confirmed = window.confirm(
      "Delete this post permanently from Discuss?"
    );
    if (!confirmed) return;

    setAuthState({ loading: false, error: "", success: "" });

    try {
      await api.delete(`/discuss/mine/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Promise.all([loadPosts(), loadAccount()]);
      setAuthState({
        loading: false,
        error: "",
        success: "Post deleted successfully.",
      });
    } catch (error) {
      setAuthState({
        loading: false,
        success: "",
        error: error.response?.data?.message || "Could not delete the post.",
      });
    }
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
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#eef7ff_0%,_#f7fbff_36%,_#f9fcff_100%)] pb-10 pt-20 sm:pb-14 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.18),transparent_0_20%),radial-gradient(circle_at_72%_72%,rgba(96,165,250,0.12),transparent_0_24%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
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

            <div className="rounded-[1.7rem] border border-indigo-100 bg-white/70 p-4 shadow-sm xl:max-w-md">
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4" />
                      Post update
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanelMode("auth")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50"
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
                  <Link
                    to="/guide"
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Need help? Open Guide
                  </Link>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setPanelMode("auth")}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50"
                    >
                      <LogIn className="h-4 w-4" />
                      Club account
                    </button>
                    <button
                      type="button"
                      onClick={openComposer}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
            <DiscussFeedSkeletonList />
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
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
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
                <TextInput name="title" value={postForm.title} onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Abhivyakti registrations are now live" required />
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
              <TextInput name="actionLink" value={postForm.actionLink} onChange={(e) => setPostForm((p) => ({ ...p, actionLink: e.target.value }))} placeholder="e.g. https://forms.gle/your-event-link" />
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
                placeholder="e.g. Happy to share that our flagship hackathon is opening registrations tonight. Use the link above to join, and share this with your campus community."
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
              <div className="space-y-6">
                
                {/* Profile Header Card */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.08),_transparent_70%)]" />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,_#eff6ff,_#e0e7ff)] text-2xl font-bold text-indigo-600 shadow-inner">
                      {account.clubName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{account.clubName}</h3>
                        {account.isAuthorized && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {account.collegeName}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-[1.2rem] bg-slate-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Point of Contact</div>
                        <div className="truncate text-sm font-medium text-slate-800">{account.contactName}</div>
                      </div>
                    </div>

                    {account.contactPhone && (
                      <div className="flex items-center gap-3 rounded-[1.2rem] bg-slate-50 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</div>
                          <div className="truncate text-sm font-medium text-slate-800">{account.contactPhone}</div>
                        </div>
                      </div>
                    )}

                    <div className="col-span-full flex items-center gap-3 rounded-[1.2rem] bg-slate-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                        <div className="truncate text-sm font-medium text-slate-800">{account.email}</div>
                      </div>
                    </div>

                    {account.clubEmail && (
                      <div className="col-span-full flex items-center gap-3 rounded-[1.2rem] bg-indigo-50/50 p-3 ring-1 ring-indigo-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                           <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Official Club Email</div>
                           <div className="truncate text-sm font-semibold text-indigo-900">{account.clubEmail}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Posts Section */}
                {myPosts.length > 0 && (
                  <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Megaphone className="h-4 w-4 text-indigo-500" />
                        History ({myPosts.length})
                      </h4>
                    </div>
                    <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                      {myPosts.map((post) => (
                        <div
                          key={post._id}
                          className="group relative overflow-hidden rounded-[1.2rem] bg-slate-50 p-4 transition-all hover:bg-indigo-50/50 hover:shadow-md hover:ring-1 hover:ring-indigo-100"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => openEditPost(post)}
                              className="min-w-0 flex-1 text-left"
                            >
                              <p className="truncate text-sm font-semibold tracking-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                                {post.title}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  post.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  post.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {post.status}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                  <Clock className="h-3 w-3" />
                                  {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </button>
                            <div className="flex shrink-0 items-center gap-1 xl:opacity-0 transition-opacity xl:group-hover:opacity-100 focus-within:opacity-100">
                              <button
                                type="button"
                                onClick={() => openEditPost(post)}
                                className="flex h-8 items-center justify-center rounded-full bg-white px-3 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-indigo-600"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post._id)}
                                aria-label={`Delete ${post.title}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Logout of Club
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
                    <LabeledField label="Club Name">
                      <TextInput 
                        name="clubName" 
                        list="discuss-club-suggestions"
                        value={loginForm.clubName} 
                        onChange={(e) => setLoginForm((p) => ({ ...p, clubName: e.target.value }))} 
                        placeholder="e.g. E-Cell" 
                        required 
                      />
                    </LabeledField>
                    <LabeledField label="Point of contact name">
                      <TextInput 
                        name="contactName" 
                        value={loginForm.contactName} 
                        onChange={(e) => setLoginForm((p) => ({ ...p, contactName: e.target.value }))} 
                        placeholder="e.g. Priyanshu Sharma" 
                        required 
                      />
                    </LabeledField>
                    <LabeledField label="Password">
                      <TextInput name="password" type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Enter your club password" required />
                    </LabeledField>
                    <button type="submit" disabled={authState.loading} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                      <LogIn className="h-4 w-4" />
                      {authState.loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <LabeledField label="College / institute" className="sm:col-span-2">
                        <TextInput name="collegeName" list="discuss-college-options" value={registerForm.collegeName} onChange={(e) => setRegisterForm((p) => ({ ...p, collegeName: e.target.value }))} placeholder="Choose or type your IIIT, e.g. IIIT Kota" required />
                        <datalist id="discuss-college-options">
                          {collegeOptions.map((option) => (
                            <option key={option} value={option} />
                          ))}
                        </datalist>
                      </LabeledField>
                      <LabeledField label="Club / society name">
                        <TextInput 
                          name="clubName" 
                          list="discuss-club-suggestions"
                          value={registerForm.clubName} 
                          onChange={(e) => setRegisterForm((p) => ({ ...p, clubName: e.target.value }))} 
                          placeholder="e.g. E-Cell" 
                          required 
                        />
                        <datalist id="discuss-club-suggestions">
                          {clubSuggestions.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </LabeledField>
                      <LabeledField label="Point of contact name">
                        <TextInput name="contactName" value={registerForm.contactName} onChange={(e) => setRegisterForm((p) => ({ ...p, contactName: e.target.value }))} placeholder="e.g. Priyanshu Sharma" required />
                      </LabeledField>
                      <LabeledField label="Point of contact phone">
                        <TextInput name="contactPhone" value={registerForm.contactPhone} onChange={(e) => setRegisterForm((p) => ({ ...p, contactPhone: e.target.value }))} placeholder="e.g. 9876543210" />
                      </LabeledField>
                      <LabeledField label="Club Official Email">
                        <TextInput name="clubEmail" type="email" value={registerForm.clubEmail} onChange={(e) => setRegisterForm((p) => ({ ...p, clubEmail: e.target.value }))} placeholder="e.g. ecell@iiitk.ac.in" />
                      </LabeledField>
                    </div>

                    {duplicateClubFound && (
                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
                        <p className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-widest">
                          <Users className="h-4 w-4" />
                          Club already registered
                        </p>
                        <p className="mt-1 text-sm text-indigo-600 leading-relaxed">
                          This club is already active on the network. Continue below to register as an additional member or coordinator for this club.
                        </p>
                      </div>
                    )}

                    <LabeledField label="Club website / Social Media">
                      <TextInput name="website" value={registerForm.website} onChange={(e) => setRegisterForm((p) => ({ ...p, website: e.target.value }))} placeholder="e.g. https://linktr.ee/ecelliiitkota" />
                    </LabeledField>
                    <LabeledField label="Club handle">
                      <HandleInput value={registerForm.handle} onChange={(e) => setRegisterForm((p) => ({ ...p, handle: e.target.value }))} />
                    </LabeledField>
                    <LabeledField label="Create password">
                      <TextInput name="password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} placeholder="Create a password for your club account" required />
                    </LabeledField>
                    <button type="submit" disabled={authState.loading} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                      <UserPlus className="h-4 w-4" />
                      {authState.loading ? "Creating..." : duplicateClubFound ? "Join this club" : "Create club account"}
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

function DiscussFeedSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[1.8rem] border border-sky-100 bg-white/90 shadow-sm"
        >
          <div className="flex flex-col gap-0 md:grid md:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="aspect-square bg-slate-200 md:h-full md:min-h-[12rem]" />
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-24 rounded-full bg-slate-200" />
                <div className="h-7 w-20 rounded-full bg-slate-100" />
                <div className="h-7 w-28 rounded-full bg-slate-100" />
              </div>
              <div className="h-7 w-2/3 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-full bg-slate-100" />
                <div className="h-8 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
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

function TextInput({ name, type = "text", value, onChange, placeholder, required = false, list }) {
  return <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} list={list} className={inputClassName} />;
}

function HandleInput({ value, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
      <input name="handle" value={value} onChange={onChange} placeholder="e.g. ecellkota" required className="w-full bg-transparent px-4 py-3 text-sm outline-none" />
      <span className="flex items-center border-l border-slate-200 px-4 text-sm text-slate-500">@iiitiansnetwork</span>
    </div>
  );
}

function LabeledField({ label, children, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100";
 
