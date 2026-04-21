import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import api from "../api/axios";
import { APP_NOTIFICATION_EVENT } from "../utils/appNotifications";

const POLL_INTERVAL_MS = 90000;
const VIEW_MILESTONE_STORAGE_KEY = "iiitians-network-last-view-milestone";
const ENTRY_NOTIFICATION_STORAGE_KEY = "iiitians-network-last-entry-notification";

function buildInitialSnapshot() {
  return {
    posts: 0,
    events: 0,
    legacy: 0,
    team: 0,
    clubs: 0,
  };
}

function getAccentColor(type) {
  // Use a consistent brand blue/indigo shade for the entire app as requested
  return "bg-indigo-500";
}

export default function InAppNotifications() {
  const [items, setItems] = useState([]);
  const snapshotRef = useRef(buildInitialSnapshot());
  const initializedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const pushNotification = (notification) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [{ id, ...notification }, ...prev].slice(0, 3));

      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 7000);
    };

    const maybeCelebrateViews = (views) => {
      if (!views) return;
      const currentMilestone = Math.floor(views / 1000) * 1000;
      if (currentMilestone < 1000) return;

      const storedMilestone = Number(
        localStorage.getItem(VIEW_MILESTONE_STORAGE_KEY) || 0
      );

      if (!storedMilestone) {
        localStorage.setItem(
          VIEW_MILESTONE_STORAGE_KEY,
          String(currentMilestone)
        );
        return;
      }

      if (currentMilestone > storedMilestone) {
        localStorage.setItem(
          VIEW_MILESTONE_STORAGE_KEY,
          String(currentMilestone)
        );
        pushNotification({
          type: "milestone",
          title: `Milestone: ${currentMilestone.toLocaleString()} views`,
          message: "IIITians Network just crossed another view milestone.",
        });
      }
    };

    const maybeShowCustomEntryNotification = async () => {
      try {
        const response = await api.get("/app-notifications/public-active");
        const notifications = Array.isArray(response.data) ? response.data : [];
        if (!notifications.length) return;

        const seenVersions = JSON.parse(
          sessionStorage.getItem(ENTRY_NOTIFICATION_STORAGE_KEY) || "[]"
        );

        notifications.forEach((notification) => {
          if (!notification?._id || !notification?.title || !notification?.message) return;

          const version = `${notification._id}:${notification.updatedAt || ""}`;
          if (seenVersions.includes(version)) return;

          pushNotification({
            type: notification.type || "milestone",
            title: notification.title,
            message: notification.message,
          });
          seenVersions.push(version);
        });

        sessionStorage.setItem(
          ENTRY_NOTIFICATION_STORAGE_KEY,
          JSON.stringify(seenVersions.slice(-20))
        );
      } catch {
        // Silent error
      }
    };

    const loadSnapshot = async () => {
      const [postsRes, eventsRes, legacyRes, teamRes, clubsRes, statsRes] = await Promise.allSettled([
        api.get("/discuss"),
        api.get("/events"),
        api.get("/alumni"),
        api.get("/team"),
        api.get("/discuss-accounts/public/stats"),
        api.get("/site-stats"),
      ]);

      return {
        posts: postsRes.status === "fulfilled" ? postsRes.value.data?.length || 0 : snapshotRef.current.posts,
        events: eventsRes.status === "fulfilled" ? eventsRes.value.data?.length || 0 : snapshotRef.current.events,
        legacy: legacyRes.status === "fulfilled" ? legacyRes.value.data?.length || 0 : snapshotRef.current.legacy,
        team: teamRes.status === "fulfilled" ? teamRes.value.data?.length || 0 : snapshotRef.current.team,
        clubs: clubsRes.status === "fulfilled" ? clubsRes.value.data?.registeredClubs || 0 : snapshotRef.current.clubs,
        views: statsRes.status === "fulfilled" ? statsRes.value.data?.totalViews || 0 : 0,
      };
    };

    const poll = async () => {
      try {
        const nextSnapshot = await loadSnapshot();
        if (!active) return;

        if (!initializedRef.current) {
          snapshotRef.current = nextSnapshot;
          initializedRef.current = true;
          maybeCelebrateViews(nextSnapshot.views);
          maybeShowCustomEntryNotification();
          return;
        }

        const previousSnapshot = snapshotRef.current;

        if (nextSnapshot.posts > previousSnapshot.posts) {
          pushNotification({
            type: "post",
            title: "Discussion Update",
            message: "Fresh conversations and updates are now live on Discuss.",
          });
        }

        if (nextSnapshot.events > previousSnapshot.events) {
          pushNotification({
            type: "event",
            title: "New Event",
            message: "The events section has just been updated with something new.",
          });
        }

        if (nextSnapshot.legacy > previousSnapshot.legacy) {
          pushNotification({
            type: "legacy",
            title: "Legacy Updated",
            message: "Network Legacy has been updated with newly approved profiles.",
          });
        }

        if (nextSnapshot.team > previousSnapshot.team) {
          pushNotification({
            type: "team",
            title: "Team Update",
            message: "The live team directory has just been updated.",
          });
        }

        if (nextSnapshot.clubs > previousSnapshot.clubs) {
          pushNotification({
            type: "club",
            title: "New Club",
            message: "A new campus community has joined the network.",
          });
        }

        snapshotRef.current = nextSnapshot;
        maybeCelebrateViews(nextSnapshot.views);
      } catch {
        // Silent error
      }
    };

    poll();
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);
    const handleAppNotification = (event) => {
      if (!event?.detail?.title) return;
      pushNotification(event.detail);
    };
    window.addEventListener(APP_NOTIFICATION_EVENT, handleAppNotification);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener(APP_NOTIFICATION_EVENT, handleAppNotification);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex w-full max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2.5 sm:bottom-auto sm:top-24 sm:right-6 sm:left-auto sm:translate-x-0">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onClose={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

const NotificationCard = React.forwardRef(({ item, onClose }, ref) => {
  const accentColor = getAccentColor(item.type);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto relative overflow-hidden rounded-xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] backdrop-blur-3xl ring-1 ring-white/30"
    >
      {/* Sidebar Accent Indicator */}
      <div className={`absolute left-0 top-0 h-full w-1 ${accentColor} opacity-90`} />
      
      <div className="flex items-start justify-between gap-4 pl-1">
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600/80">
              {item.type || "Update"}
            </span>
          </div>
          <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
            {item.title}
          </h4>
          <p className="mt-1 text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-2">
            {item.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 -mt-1 p-1 text-slate-300 transition-colors hover:bg-black/5 hover:text-slate-900 rounded-lg"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
});

NotificationCard.displayName = "NotificationCard";

