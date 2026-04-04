import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  Building2,
  Handshake,
  FileText,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UserPlus2,
  Users,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import GuideFlowSection from "./components/GuideFlowSection";

const flowTabs = [
  {
    id: "discuss",
    label: "Club Account",
    icon: Building2,
    eyebrow: "Guide",
    title: "How clubs create an account and start posting",
    description:
      "A club first creates its Discuss account, logs in with its handle, and then uses the same account to publish updates later.",
    steps: [
      {
        title: "Open Discuss",
        text: "Go to the Discuss page from the navbar and open the club account panel.",
      },
      {
        title: "Register the club",
        text: "Enter college name, club name, point-of-contact details, a handle, and a password.",
      },
      {
        title: "Log in later with the same handle",
        text: "Use the handle with the fixed @iiitiansnetwork identity and your password to restore the same account.",
      },
    ],
    note: "Once the club account is verified, its updates can carry the verified network badge.",
  },
  {
    id: "event",
    label: "Announcements & Events",
    icon: Megaphone,
    eyebrow: "Guide",
    title: "How to post an announcement or push something as an event",
    description:
      "Discuss works for normal announcements, collaborations, campaigns, and events. When a club pushes a post as an event and it gets approved, it can appear on the Events page too.",
    steps: [
      {
        title: "Open Post update",
        text: "After logging in, use the Post update button or the plus button on mobile.",
      },
      {
        title: "Choose the right post type",
        text: "Pick announcement for regular updates, or choose event when you want it represented as an actual event post.",
      },
      {
        title: "Add images, date, and link",
        text: "Upload event poster images, add the event date, and provide the registration or event link.",
      },
      {
        title: "Wait for approval",
        text: "Approved announcements appear on Discuss, and approved event posts are eligible to show on the Events page.",
      },
    ],
    note: "Use the Manage account sidebar to edit or delete any past post later.",
  },
  {
    id: "legacy",
    label: "Network Legacy",
    icon: Users,
    eyebrow: "Guide",
    title: "How to join the Network Legacy section",
    description:
      "Legacy is the public record of people who have been part of the network. Submissions are reviewed first, then shown on the public legacy page after approval.",
    steps: [
      {
        title: "Open the Legacy page",
        text: "Go to Network Legacy and open the submission form.",
      },
      {
        title: "Fill role and profile details",
        text: "Add batch or team term, network post, current role, company, location, and your profile links.",
      },
      {
        title: "Reuse team photo if available",
        text: "If you already exist on the team page, the form can reuse your team photo instead of requiring a new one.",
      },
      {
        title: "Submit for admin review",
        text: "After approval, your legacy card becomes visible in the public Network Legacy section.",
      },
    ],
    note: "Team members can also flow into legacy with their latest network role and journey history.",
  },
  {
    id: "member",
    label: "Become a Member",
    icon: UserPlus2,
    eyebrow: "Guide",
    title: "How to become a visible member of the network",
    description:
      "People usually become visible in the network through teams, legacy, events, or club participation. This flow explains the clean path for joining and staying discoverable on the site.",
    steps: [
      {
        title: "Start with the right entry point",
        text: "If you are active in a club, begin through Discuss. If you served in the network, use Legacy. If you join the team officially, admins add you in Team.",
      },
      {
        title: "Keep your public profile complete",
        text: "Add your role, institute, current work, and links so people can actually identify and connect with you later.",
      },
      {
        title: "Let admins map your journey",
        text: "Once approved, your latest role can appear publicly while your previous posts can still be preserved in legacy history.",
      },
    ],
    note: "The best network profiles are consistent across Team, Legacy, Colleges, and Discuss.",
  },
  {
    id: "collab",
    label: "Collaboration",
    icon: Handshake,
    eyebrow: "Guide",
    title: "How to collaborate with another club, campus, or network initiative",
    description:
      "Use Discuss when you want to raise a campaign, ask for collaboration, promote a shared event, or invite another IIIT community into something bigger.",
    steps: [
      {
        title: "Create the right post",
        text: "Use Discuss to write a clean collaboration request with context, dates, link, and who the collaboration is for.",
      },
      {
        title: "Mention the value clearly",
        text: "Say whether it is an event partnership, media support, club-to-club campaign, or campus-wide participation ask.",
      },
      {
        title: "Keep contact simple",
        text: "Use the club identity, not personal clutter, so interested communities know which club to approach back.",
      },
    ],
    note: "Collaboration posts work best when they are short, visual, and clear about the expected outcome.",
  },
];

export default function GuidePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFlow = searchParams.get("flow");
  const [activeFlow, setActiveFlow] = useState(
    flowTabs.some((item) => item.id === initialFlow) ? initialFlow : "discuss"
  );

  useEffect(() => {
    const flow = searchParams.get("flow");
    if (flow && flowTabs.some((item) => item.id === flow) && flow !== activeFlow) {
      setActiveFlow(flow);
    }
  }, [activeFlow, searchParams]);

  const currentFlow = useMemo(
    () => flowTabs.find((item) => item.id === activeFlow) || flowTabs[0],
    [activeFlow]
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eef4ff_0%,_#f7fbff_34%,_#ffffff_100%)]">
      <section className="relative overflow-hidden px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_56%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Website Guide
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Learn how to use every major part of IIITians Network.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-lg">
                This guide shows how clubs post updates, how events move into the
                Events page, how people become part of the network, and how admins
                run the platform, all inside the same site flow and theme.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white/90 p-4 shadow-[0_24px_70px_-38px_rgba(79,70,229,0.2)] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <GuideStat
                  icon={BookOpenText}
                  title="5 guided flows"
                  text="Clubs, events, legacy, member path, and collabs."
                />
                <GuideStat
                  icon={Megaphone}
                  title="Event-ready"
                  text="Push as event with date and link."
                />
                <GuideStat
                  icon={FileText}
                  title="Admin-reviewed"
                  text="Public data appears after approval."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {flowTabs.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeFlow;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveFlow(item.id);
                    setSearchParams({ flow: item.id }, { replace: true });
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-[0_14px_30px_-16px_rgba(79,70,229,0.8)]"
                      : "border border-indigo-100 bg-white text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <GuideFlowSection
              eyebrow={currentFlow.eyebrow}
              title={currentFlow.title}
              description={currentFlow.description}
              steps={currentFlow.steps}
              note={currentFlow.note}
              variant={currentFlow.id}
            />
          </div>

          <div className="mt-6 rounded-[2rem] bg-white/90 p-4 shadow-[0_24px_70px_-38px_rgba(79,70,229,0.18)] sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Quick use path
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
              <MiniPath
                step="01"
                title="Need to announce something?"
                text="Open Discuss, log into the club account, and post an announcement."
              />
              <MiniPath
                step="02"
                title="Need to promote an event?"
                text="Choose event while posting, attach date and link, then let approval push it live."
              />
              <MiniPath
                step="03"
                title="Need to join legacy?"
                text="Open Network Legacy, submit details, and wait for approval before public listing."
              />
              <MiniPath
                step="04"
                title="Want to become a network member?"
                text="Use the member guide to see the clean path from activity to public presence."
              />
              <MiniPath
                step="05"
                title="Need a collaboration push?"
                text="Use the collaboration guide to post a cleaner ask with context, links, and value."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuideStat({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-indigo-600" />
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  );
}

function MiniPath({ step, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
        {step}
      </div>
      <div className="mt-3 text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}
