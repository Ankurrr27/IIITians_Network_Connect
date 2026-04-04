import { BookOpenText, FileText, Megaphone, ShieldCheck, Sparkles, LayoutDashboard, Users, Users2, Landmark, ShieldPlus } from "lucide-react";
import GuideFlowSection from "./components/GuideFlowSection";
import GuideMockup from "./components/GuideMockup";

const adminFlow = {
  id: "admin",
  label: "Admin Panel",
  icon: ShieldCheck,
  eyebrow: "Admin Workspace Guide",
  title: "A complete guide to managing the IIITians Network.",
  description:
    "The admin panel is where you manage the database, approve submissions, and moderate campus activity. This guide breaks down exactly how to verify records without compromising the network's integrity.",
  steps: [
    {
      title: "Strict Legacy Verification",
      text: "Compare legacy submissions against LinkedIn profiles or official team records. Verify the batch year and role before clicking approve. Reject entries with broken links or vague descriptions immediately.",
    },
    {
      title: "Club & POC Legitimacy",
      text: "When a club registers, check if the handle (@identity) matches their official social presence. Contact the POC if the club handle seems unofficial to prevent impersonation on the Discuss board.",
    },
    {
      title: "Active Team Management",
      text: "Maintain the official directory by adding new members or promoting existing ones to new roles. Use the drag handles to decide the public sequence on the team page.",
    },
    {
      title: "Tenure & History",
      text: "When a member's term ends, transition them to the Legacy section to preserve their contribution history while keeping the current team list fresh.",
    },
  ],
  note: "Data is live. Any change you approve in the admin panel reflects instantly on the public website. Review twice, publish once.",
};

export default function AdminGuide() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f1f5ff_0%,_#f9fbff_35%,_#ffffff_100%)]">
      <section className="relative overflow-hidden px-4 pb-8 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_65%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
            <LockIcon className="h-4 w-4" />
            Restricted Admin Path
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                The Network Moderator Manual.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-lg">
                As an admin, you are the gatekeeper of the network's data. This manual explains the precise protocols for approvals, members, and site-wide consistency.
              </p>
            </div>

            <div className="rounded-[2.5rem] bg-white/90 p-5 shadow-[0_32px_80px_-40px_rgba(79,70,229,0.22)] sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideStat
                  icon={ShieldCheck}
                  title="Zero-Spam Policy"
                  text="Verify profile links before every single approval push."
                />
                <GuideStat
                  icon={LayoutDashboard}
                  title="Live Refreshes"
                  text="Modifications sync across the global IIIT network immediately."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mt-8">
            <GuideFlowSection
              eyebrow={adminFlow.eyebrow}
              title={adminFlow.title}
              description={adminFlow.description}
              steps={adminFlow.steps}
              note={adminFlow.note}
              variant={adminFlow.id}
            />
          </div>

          <div className="mt-12 space-y-12">
            {/* Approval Lifecycle */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_70px_-38px_rgba(79,70,229,0.18)] border border-slate-100 sm:p-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
                  <ShieldPlus className="h-8 w-8 text-indigo-600" />
                  Approval Workflow & Lifecycle
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Every piece of public data on the IIITians Network follows a strict "Human-in-the-loop" approval lifecycle. This ensures that only verified, high-quality information reaches the students.
                </p>
                <div className="mt-10 space-y-10">
                  <DetailSection 
                    title="1. Incoming Request Queue"
                    text="When a student submits a Legacy request, a Team application, or a Club verification ask, it enters the 'Pending Review' queue. These requests are isolated from the production database and cannot be accessed by public users until an admin explicitly validates them."
                  />
                  <DetailSection 
                    title="2. Verification & Modification"
                    text="Admins must cross-verify the data. If a field contains minor errors (e.g., misspelled project name or incorrect graduation year), use the inline 'Edit' feature to correct it before approval. This saves the student from having to resubmit while maintaining data accuracy."
                  />
                  <DetailSection 
                    title="3. Public Publishing"
                    text="Upon clicking 'Approve', the record is transformed into an Active Member or Verified Club. The system automatically handles the creation of unique identifiers and syncs the data across all relevant directories (Colleges, Team, and Discuss)."
                  />
                </div>
              </div>
            </div>

            {/* Verification Protocols */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white sm:p-10">
                <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Users2 className="h-6 w-6 text-indigo-400" />
                  Team Management SOP
                </h3>
                <p className="mt-4 text-slate-400 leading-7">
                  The 'Team' section represents the core of the IIITians Network. Admins are responsible for managing the hierarchy and ensuring the directory stays up to date with every academic cycle.
                </p>
                <ul className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
                  <li className="flex gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span><strong>Tenure Transitions:</strong> When a member's term ends, do not delete their record. Move them to the 'Legacy' state to preserve their contribution history.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span><strong>Visual Ordering:</strong> Use the positional 'Order' field to ensure leads and executive members appear at the top of the directory.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span><strong>Uniform Identity:</strong> Ensure all profile photos follow the recommended 400x400px square format to maintain a premium site-wide aesthetic.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-[2.5rem] bg-indigo-50 border border-indigo-100 p-8 sm:p-10">
                <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-indigo-600" />
                  Governance Standards
                </h3>
                <p className="mt-4 text-slate-600 leading-7">
                  As an admin, you hold the authority to decide which colleges and placement records are visible. Follow these governance rules strictly:
                </p>
                <div className="mt-8 space-y-6">
                  <ProtocolItem 
                    title="Placement Accuracy"
                    text="Only approve placement records that have been cross-verified with official college TPO brochures. Incorrect numbers damage the network's credibility."
                  />
                  <ProtocolItem 
                    title="Alumni (Legacy) Legitimacy"
                    text="Verify every LinkedIn handle. If the profile doesn't show a clear connection to the claimed IIIT, mark the request as 'Spam'."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProtocolItem({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 ring-1 ring-slate-100">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function DetailSection({ title, text }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-base leading-8 text-slate-600">{text}</p>
    </div>
  );
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GuideStat({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 hover:border-indigo-200 transition">
      <Icon className="h-5 w-5 text-indigo-600" />
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  );
}

function MiniPath({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-sm transition hover:border-indigo-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
