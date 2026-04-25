import { toast } from "react-hot-toast";

const APP_NOTIFICATION_EVENT = "iiitians:notify";

export function notifyAppAction({
  title,
  message,
  type = "milestone",
  dedupeKey = "",
  dedupeWindowMs = 20000,
}) {
  if (typeof window === "undefined" || !title) return;

  if (dedupeKey) {
    const storageKey = `iiitians-network-toast-${dedupeKey}`;
    const lastShownAt = Number(sessionStorage.getItem(storageKey) || 0);

    if (Date.now() - lastShownAt < dedupeWindowMs) {
      return;
    }

    sessionStorage.setItem(storageKey, String(Date.now()));
  }

  window.dispatchEvent(
    new CustomEvent(APP_NOTIFICATION_EVENT, {
      detail: {
        title,
        message,
        type,
      },
    })
  );
}

/**
 * Enhanced toast helper using react-hot-toast for promise states.
 * Turns green (success) on completion.
 */
export function notifyPromise(promise, { loading, success, error, id = "fetch-toast" }) {
  return toast.promise(
    promise,
    {
      loading: loading || "Fetching data...",
      success: success || "Data loaded successfully!",
      error: error || "Failed to fetch data. Please try again.",
    },
    {
      id, // Deduplication key
      style: {
        minWidth: "fit-content",
        maxWidth: "calc(100vw - 40px)",
        borderRadius: "1rem",
        background: "#fff",
        color: "#0f172a",
        fontSize: "14px",
        fontWeight: "500",
        padding: "10px 16px",
        border: "1px solid #e2e8f0",
      },
      success: {
        duration: 3000,
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      },
      error: {
        duration: 4000,
      },
    }
  );
}

export { APP_NOTIFICATION_EVENT };
