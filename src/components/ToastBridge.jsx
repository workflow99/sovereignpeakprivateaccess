import { useEffect, useRef } from "react";
import { useAppStore } from "../store/AppStoreContext";
import { useToast } from "./ToastProvider";

const TOASTED_KEY = "sovereign_peak_toasted_v1";

const TYPE_MAP = {
  transaction: "success",
  loan: "info",
  support: "info",
  system: "info",
};

function toastTypeForNotification(n) {
  const status = n.status;
  if (status === "failed") return "error";
  if (status === "pending") return "warning";
  return TYPE_MAP[n.type] || "info";
}

function readToastedIds() {
  try {
    const raw = localStorage.getItem(TOASTED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function writeToastedIds(set) {
  try {
    const arr = Array.from(set);
    // cap to avoid unbounded growth
    if (arr.length > 500) arr.splice(0, arr.length - 500);
    localStorage.setItem(TOASTED_KEY, JSON.stringify(arr));
  } catch {
    // ignore storage errors
  }
}

export default function ToastBridge() {
  const { state } = useAppStore();
  const { addToast } = useToast();
  const toastedRef = useRef(new Set());

  const notifications = state.notifications || [];

  // On mount: hydrate the set from storage and mark every already-loaded
  // notification as toasted so refreshes don’t re-fire them.
  useEffect(() => {
    const set = readToastedIds();
    notifications.forEach((n) => set.add(n.id));
    toastedRef.current = set;
    writeToastedIds(set);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the notifications array changes, toast anything whose id we
  // haven’t seen yet, then persist the updated set.
  useEffect(() => {
    const set = toastedRef.current;
    let changed = false;

    notifications.forEach((n) => {
      if (!set.has(n.id)) {
        set.add(n.id);
        changed = true;
        addToast(n.message, toastTypeForNotification(n));
      }
    });

    if (changed) {
      writeToastedIds(set);
    }
  }, [notifications, addToast]);

  return null;
}

