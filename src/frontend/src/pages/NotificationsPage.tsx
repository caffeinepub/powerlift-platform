import { Bell, CheckCheck } from "lucide-react";
import { useStore } from "../store";

export default function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, navigate } =
    useStore();

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-xl"
          style={{ backgroundColor: "#E4572E", color: "#fff" }}
        >
          Login
        </button>
      </div>
    );
  }

  const myNotifs = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = myNotifs.filter((n) => !n.read);

  const markAllRead = () => {
    for (const n of unread) {
      markNotificationRead(n.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl">NOTIFICATIONS</h1>
          {unread.length > 0 && (
            <p className="text-sm mt-1" style={{ color: "#A7AFB9" }}>
              {unread.length} unread
            </p>
          )}
        </div>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border hover:bg-white/10"
            style={{ borderColor: "#2A2F36" }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border"
          style={{ borderColor: "#2A2F36", backgroundColor: "#1B1E22" }}
        >
          <Bell
            size={40}
            className="mx-auto mb-3"
            style={{ color: "#2A2F36" }}
          />
          <p className="font-heading text-xl">NO NOTIFICATIONS</p>
          <p className="text-sm mt-2" style={{ color: "#A7AFB9" }}>
            You&apos;re all caught up!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className="w-full text-left p-4 rounded-2xl border transition-all hover:border-orange-500/30"
              style={{
                backgroundColor: n.read ? "#1B1E22" : "rgba(228,87,46,0.08)",
                borderColor: n.read ? "#2A2F36" : "rgba(228,87,46,0.2)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: n.read ? "transparent" : "#E4572E",
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs mt-1" style={{ color: "#A7AFB9" }}>
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
