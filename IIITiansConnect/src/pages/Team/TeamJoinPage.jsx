import { useState } from "react";
import { 
  Users, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  Linkedin,
  Instagram,
  UserPlus,
  Share2,
  Copy
} from "lucide-react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import ImageCropModal from "../../components/ImageCropModal";
import useThemeMode from "../../hooks/useThemeMode";

const initialForm = {
  name: "",
  email: "",
  iiit: "",
  year: "2026",
  team: "Development",
  role: "",
  linkedin: "",
  instagram: "",
  aboutText: "",
  messageText: "",
};

const teamOptions = ["Development", "Design", "Content", "Social Media", "Video & Post"];

export default function TeamJoinPage() {
  const { isDarkMode } = useThemeMode();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);

      // Using a hypothetical endpoint for team join requests
      await api.post("/team-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`relative min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8faff_40%,_#ffffff_100%)]'} pt-20 sm:pt-32`}>
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400 ring-emerald-500/30' : 'bg-emerald-100 text-emerald-600 ring-emerald-200'} shadow-sm ring-1`}>
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className={`mt-8 text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} sm:text-5xl`}>
            Application Received!
          </h1>
          <p className={`mt-4 text-lg leading-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Thank you for applying to be a part of the IIITians Network. Your profile is currently in the review queue.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl"
            >
              Back to Team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-full border ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'} px-8 py-4 text-sm font-semibold transition`}
            >
              Go Home
            </Link>
          </div>
          <p className={`mt-12 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            You'll receive an email once your application has been reviewed by the network administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-[linear-gradient(180deg,_#eff6ff_0%,_#f9faff_40%,_#ffffff_100%)]'} pb-20 pt-20 sm:pt-24`}>
      {/* Background radial highlight */}
      <div className={`pointer-events-none absolute inset-0 ${isDarkMode ? 'opacity-30' : 'opacity-40'} [background-image:radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_0_22%),radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.14),transparent_0_20%)]`} />

      <section className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className={`inline-flex items-center gap-2 rounded-full border ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white text-indigo-700 border-indigo-100 shadow-sm'} px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]`}>
                <ShieldCheck className="h-4 w-4" />
                Team Application
              </div>
              <button
                onClick={handleShare}
                className={`inline-flex items-center gap-2 rounded-full border ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'} px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition`}
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Link Copied" : "Share Form"}
              </button>
            </div>
            <h1 className={`mt-6 text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} sm:text-5xl`}>
              Team Application
            </h1>
            <p className={`mt-4 max-w-2xl text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Help build the future of the IIIT network. Submit your profile below for review by our moderators.
            </p>
          </div>

          <div className="mt-12 grid gap-16 lg:grid-cols-[minmax(0,1fr)_340px]">
            <form onSubmit={handleSubmit} className={`space-y-10 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'} p-0`}>
              {error && (
                <div className={`rounded-2xl border ${isDarkMode ? 'border-rose-900/50 bg-rose-950/20 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-700'} p-4 text-sm`}>
                  {error}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <InputGroup
                  label="Full Name"
                  icon={Sparkles}
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priyanshu Sharma"
                  isDarkMode={isDarkMode}
                  required
                />
                <InputGroup
                  label="Email Address"
                  icon={Mail}
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@iiit.ac.in"
                  required
                />
                <InputGroup
                  label="IIIT Institute"
                  icon={Building2}
                  id="iiit"
                  name="iiit"
                  value={form.iiit}
                  onChange={handleChange}
                  placeholder="e.g. IIIT Kota"
                  required
                />
                <InputGroup
                  label="Team Tenure"
                  icon={ShieldCheck}
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="e.g. 2025-26"
                  required
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="team" className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Team Preference</label>
                  <select
                    id="team"
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    className={`h-[52px] rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-100 focus:border-indigo-500/50 focus:ring-indigo-500/10' : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-indigo-100'} px-4 text-sm outline-none transition focus:ring-4`}
                  >
                    {teamOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>

                <InputGroup
                  label="Proposed Role"
                  icon={Users}
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Core Volunteer"
                  isDarkMode={isDarkMode}
                  required
                />

                <div className="sm:col-span-2">
                  <InputGroup
                    label="LinkedIn Profile"
                    icon={Linkedin}
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputGroup
                    label="Instagram (Optional)"
                    icon={Instagram}
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="aboutText" className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Your Bio / Contributions</label>
                  <textarea
                    id="aboutText"
                    name="aboutText"
                    value={form.aboutText}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself and what you've built or contributed."
                    className={`rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-indigo-500/10' : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-indigo-100'} px-4 py-3 text-sm outline-none transition focus:ring-4`}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="messageText" className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Note for Admin (Private)</label>
                  <textarea
                    id="messageText"
                    name="messageText"
                    value={form.messageText}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any specific note for the moderators?"
                    className={`rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-indigo-500/10' : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-indigo-100'} px-4 py-3 text-sm outline-none transition focus:ring-4`}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? "Submitting Application..." : "Send Application"}
                  {!loading && <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>

            <aside className="space-y-10">
              <div className="p-0">
                <label className={`mb-6 block text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-center lg:text-left`}>Profile Photo</label>
                <div className="flex flex-col items-center gap-6 lg:items-start">
                  <div className="relative group grayscale hover:grayscale-0 transition-all duration-500">
                    <div className={`h-44 w-44 overflow-hidden rounded-[2.5rem] ${isDarkMode ? 'bg-slate-900 ring-slate-800' : 'bg-slate-100 ring-slate-50'} ring-4 ring-offset-4 ${isDarkMode ? 'ring-offset-slate-950' : 'ring-offset-white'}`}>
                      {photo ? (
                        <img src={URL.createObjectURL(photo)} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className={`flex h-full w-full items-center justify-center border-2 border-dashed ${isDarkMode ? 'border-slate-800 text-slate-700' : 'border-slate-200 text-slate-300'}`}>
                          <Users className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => document.getElementById('photo-upload').click()}
                    className={`w-full max-w-[176px] rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-950 text-white hover:bg-slate-800'} px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition`}
                  >
                    {photo ? "Change Photo" : "Upload Photo"}
                  </button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setRawPhoto(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Approval Flow</h3>
                <ul className={`space-y-4 text-sm leading-7 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  <li className="flex gap-4">
                    <div className={`mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
                    <p>Fill all required fields completely.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className={`mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
                    <p>Submission goes to Admin pending queue.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className={`mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
                    <p>Moderators verify identity and socials.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className={`mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
                    <p>Profile goes live on the official Team page.</p>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {rawPhoto && (
        <ImageCropModal
          file={rawPhoto}
          onClose={() => setRawPhoto(null)}
          onCrop={(croppedFile) => {
            setPhoto(croppedFile);
            setRawPhoto(null);
          }}
        />
      )}
    </div>
  );
}

function InputGroup({ label, icon: Icon, required, isDarkMode, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
        {required && <span className="ml-[2px] text-indigo-500">*</span>}
      </label>
      <div className="relative">
        <Icon className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          {...props}
          className={`w-full rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/10' : 'border-slate-200 bg-white/50 text-slate-900 placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-indigo-100'} py-3.5 pl-11 pr-4 text-sm outline-none transition focus:ring-4 sm:text-base`}
        />
      </div>
    </div>
  );
}
