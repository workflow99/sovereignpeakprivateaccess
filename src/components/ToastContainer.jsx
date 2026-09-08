import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useToast } from "./ToastProvider";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "border-green-500/20 bg-green-500/10 text-green-400",
  error: "border-red-500/20 bg-red-500/10 text-red-400",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-full max-w-[calc(100vw-2rem)] flex-col gap-2 sm:max-w-xs">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition-all ${styles[toast.type] || styles.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span className="flex-1 break-words text-sm font-medium text-white">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/50 transition-colors hover:text-white"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
