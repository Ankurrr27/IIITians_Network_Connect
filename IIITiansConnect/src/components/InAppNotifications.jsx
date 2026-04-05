import { useEffect, useRef, useState } from "react";
import { Bell, Megaphone, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import api from "../api/axios";

const POLL_INTERVAL_MS = 90000;
const MILESTONE_STORAGE_KEY = "iiitians-network-20k-toast-shown";
const VIEW_STORAGE_KEY = "iiitians-network-total-views";

function buildInitialSnapshot() {
  return {
    posts: 0,
    legacy: 0,
    team: 0,
    clubs: 0,
  };
}

function getVariantMeta(type) {
  switch (type) {
    case "post":
      return {
        icon: Megaphone,
        shell: "border-sky-200 bg-sky-50 text-sky-900",
        badge: "bg-sky-100 text-sky-700",
      };
    case "legacy":
      return {
        icon: ShieldCheck,
        shell: "border-indigo-200 bg-indigo-50 text-indigo-900",
        badge: "bg-indigo-100 text-indigo-700",
      };
    case "team":
      return {
        icon: Users,
        shell: "border-emerald-200 bg-emerald-50 text-emerald-900",
        badge: "bg-emerald-100 text-emerald-700",
      };
    case "club":
      return {
        icon: Bell,
        shell: "border-amber-200 bg-amber-50 text-amber-900",
        badge: "bg-amber-100 text-amber-700",
      };
    default:
      return {
        icon: Sparkles,
        shell: "border-violet-200 bg-violet-50 text-violet-900",
        badge: "bg-violet-100 text-violet-700",
      };
  }
}

export default function InAppNotifications() {
  const [items, setItems] = useState([]);
  const snapshotRef = useRef(buildInitialSnapshot());
  const initializedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const pushNotification = (notification) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [{ id, ...notification }, ...prev].slice(0, 5));

      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 6500);
    };

    const maybeCelebrateViews = () => {
      const views = Number(localStorage.getItem(VIEW_STORAGE_KEY) || 0);
      const alreadyShown = localStorage.getItem(MILESTONE_STORAGE_KEY) === "true";

      if (views >= 20000 && !alreadyShown) {
        localStorage.setItem(MILESTONE_STORAGE_KEY, "true");
        pushNotification({
          type: "milestone",
          title: "20k views crossed",
          message: "Congratulations. IIITians Network has crossed the 20,000 views milestone.",
        });
      }
    };

    const loadSnapshot = async () => {
      const [postsRes, legacyRes, teamRes, clubsRes] = await Promise.allSettled([
        api.get("/discuss"),
        api.get("/alumni"),
        api.get("/team"),
        api.get("/discuss-accounts/public/stats"),
      ]);

      return {
        posts: postsRes.status === "fulfilled" ? postsRes.value.data?.length || 0 : snapshotRef.current.posts,
        legacy:
          legacyRes.status === "fulfilled" ? legacyRes.value.data?.length || 0 : snapshotRef.current.legacy,
        team: teamRes.status === "fulfilled" ? teamRes.value.data?.length || 0 : snapshotRef.current.team,
        clubs:
          clubsRes.status === "fulfilled"
            ? clubsRes.value.data?.registeredClubs || 0
            : snapshotRef.current.clubs,
      };
    };

    const poll = async () => {
      try {
        const nextSnapshot = await loadSnapshot();
        if (!active) return;

        if (!initializedRef.current) {
          snapshotRef.current = nextSnapshot;
          initializedRef.current = true;
          maybeCelebrateViews();
          return;
        }

        const previousSnapshot = snapshotRef.current;

        if (nextSnapshot.posts > previousSnapshot.posts) {
          const diff = nextSnapshot.posts - previousSnapshot.posts;
          pushNotification({
            type: "post",
            title: diff > 1 ? `${diff} new posts added` : "New post added",
            message:
              diff > 1
                ? "Fresh announcements or event pushes are now live on Discuss."
                : "A fresh announcement or event push just went live on Discuss.",
          });
        }

        if (nextSnapshot.legacy > previousSnapshot.legacy) {
          const diff = nextSnapshot.legacy - previousSnapshot.legacy;
          pushNotification({
            type: "legacy",
            title: diff > 1 ? `${diff} new legacy members added` : "New legacy member added",
            message: "Network Legacy has been updated with newly approved profiles.",
          });
        }

        if (nextSnapshot.team > previousSnapshot.team) {
          const diff = nextSnapshot.team - previousSnapshot.team;
          pushNotification({
            type: "team",
            title: diff > 1 ? `${diff} new team members added` : "New team member added",
            message: "The live team directory has just been updated.",
          });
        }

        if (nextSnapshot.clubs > previousSnapshot.clubs) {
          const diff = nextSnapshot.clubs - previousSnapshot.clubs;
          pushNotification({
            type: "club",
            title: diff > 1 ? `${diff} clubs registered` : "New club registered",
            message: "A new campus community has joined the network.",
          });
        }

        snapshotRef.current = nextSnapshot;
        maybeCelebrateViews();
      } catch {
        // Keep notifications quiet if polling fails.
      }
    };

    poll();
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-28">
      {items.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
          onClose={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}
        />
      ))}
    </div>
  );
}

function NotificationCard({ item, onClose }) {
  const meta = getVariantMeta(item.type);
  const Icon = meta.icon;

  return (
    <div className={`pointer-events-auto rounded-[1.35rem] border px-4 py-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur ${meta.shell}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.badge}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="mt-1 text-sm leading-6 opacity-90">{item.message}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 opacity-60 transition hover:bg-white/50 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
