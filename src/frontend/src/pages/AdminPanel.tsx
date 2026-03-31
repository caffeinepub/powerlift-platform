import {
  BarChart2,
  CheckCircle,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";

type AdminTab = "overview" | "users" | "organizers" | "competitions";

export default function AdminPanel() {
  const {
    currentUser,
    users,
    competitions,
    approveOrganizer,
    rejectOrganizer,
    deleteUser,
    toggleFeatured,
    toggleActive,
    deleteCompetition,
    navigate,
  } = useStore();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [compSearch, setCompSearch] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-2xl mb-4">ACCESS RESTRICTED</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-xl"
          style={{ backgroundColor: "#E4572E", color: "#fff" }}
        >
          Login
        </button>
      </div>
    );
  }

  const pendingOrgs = users.filter(
    (u) => u.role === "organizer" && !u.approved,
  );
  const approvedOrgs = users.filter(
    (u) => u.role === "organizer" && u.approved,
  );
  const players = users.filter((u) => u.role === "player");
  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch),
  );
  const filteredComps = competitions.filter(
    (c) =>
      !compSearch || c.name.toLowerCase().includes(compSearch.toLowerCase()),
  );

  const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "users", label: "Users", icon: Users },
    { id: "organizers", label: "Organizers", icon: CheckCircle },
    { id: "competitions", label: "Competitions", icon: Trophy },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm" style={{ color: "#A7AFB9" }}>
          Admin Panel
        </p>
        <h1 className="font-heading text-3xl">
          CONTROL <span style={{ color: "#E4572E" }}>CENTER</span>
        </h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            style={{
              borderColor: tab === id ? "#E4572E" : "#2A2F36",
              backgroundColor:
                tab === id ? "rgba(228,87,46,0.15)" : "transparent",
              color: tab === id ? "#E4572E" : "#A7AFB9",
            }}
          >
            <Icon size={14} /> {label}
            {id === "organizers" && pendingOrgs.length > 0 && (
              <span
                className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {pendingOrgs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: users.length, color: "#E4572E" },
              {
                label: "Total Players",
                value: players.length,
                color: "#D6A14A",
              },
              {
                label: "Pending Organizers",
                value: pendingOrgs.length,
                color: "#f87171",
              },
              {
                label: "Total Competitions",
                value: competitions.length,
                color: "#4ade80",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
              >
                <p className="font-heading text-4xl" style={{ color }}>
                  {value}
                </p>
                <p className="text-sm mt-1" style={{ color: "#A7AFB9" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
            >
              <h3 className="font-heading text-lg mb-4">
                COMPETITIONS BY STATE
              </h3>
              {[...new Set(competitions.map((c) => c.state))].map((state) => {
                const count = competitions.filter(
                  (c) => c.state === state,
                ).length;
                const pct = Math.round((count / competitions.length) * 100);
                return (
                  <div key={state} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{state}</span>
                      <span style={{ color: "#A7AFB9" }}>{count}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: "#2A2F36" }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: "#E4572E", width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
            >
              <h3 className="font-heading text-lg mb-4">RECENT ACTIVITY</h3>
              <div className="space-y-3">
                {competitions
                  .slice(-5)
                  .reverse()
                  .map((c) => (
                    <div key={c.id} className="flex items-center gap-3 text-sm">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#E4572E" }}
                      />
                      <p className="truncate">{c.name}</p>
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: "#A7AFB9" }}
                      >
                        {c.city}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="flex-1 max-w-sm px-4 py-2 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: "#1B1E22",
                borderColor: "#2A2F36",
                color: "#F2F4F7",
              }}
            />
            <span className="text-sm" style={{ color: "#A7AFB9" }}>
              {filteredUsers.length} users
            </span>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "#2A2F36" }}
          >
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#20242A" }}>
                <tr>
                  {["Name", "Phone", "Role", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: "#A7AFB9" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid #2A2F36" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: "#E4572E" }}
                        >
                          {u.name[0]}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A7AFB9" }}>
                      +91 {u.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor:
                            u.role === "admin"
                              ? "rgba(228,87,46,0.2)"
                              : u.role === "organizer"
                                ? "rgba(214,161,74,0.2)"
                                : "rgba(74,222,128,0.2)",
                          color:
                            u.role === "admin"
                              ? "#E4572E"
                              : u.role === "organizer"
                                ? "#D6A14A"
                                : "#4ade80",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs"
                        style={{ color: u.approved ? "#4ade80" : "#f87171" }}
                      >
                        {u.approved ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-900/30"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "organizers" && (
        <div className="space-y-8">
          {pendingOrgs.length > 0 && (
            <div>
              <h2 className="font-heading text-xl mb-4">
                PENDING APPROVAL{" "}
                <span style={{ color: "#f87171" }}>({pendingOrgs.length})</span>
              </h2>
              <div className="space-y-3">
                {pendingOrgs.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3"
                    style={{
                      backgroundColor: "#1B1E22",
                      borderColor: "#2A2F36",
                    }}
                  >
                    <div>
                      <p className="font-semibold text-sm">{u.orgName}</p>
                      <p className="text-xs" style={{ color: "#A7AFB9" }}>
                        {u.name} &bull; +91 {u.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveOrganizer(u.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: "rgba(74,222,128,0.15)",
                          color: "#4ade80",
                          border: "1px solid rgba(74,222,128,0.3)",
                        }}
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => rejectOrganizer(u.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: "rgba(248,113,113,0.15)",
                          color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.3)",
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-heading text-xl mb-4">
              APPROVED ORGANIZERS{" "}
              <span style={{ color: "#4ade80" }}>({approvedOrgs.length})</span>
            </h2>
            <div className="space-y-3">
              {approvedOrgs.map((u) => (
                <div
                  key={u.id}
                  className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
                >
                  <div>
                    <p className="font-semibold text-sm">{u.orgName}</p>
                    <p className="text-xs" style={{ color: "#A7AFB9" }}>
                      {u.name} &bull; +91 {u.phone}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(74,222,128,0.15)",
                      color: "#4ade80",
                    }}
                  >
                    Active
                  </span>
                </div>
              ))}
              {approvedOrgs.length === 0 && (
                <p className="text-sm" style={{ color: "#A7AFB9" }}>
                  No approved organizers
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "competitions" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <input
              value={compSearch}
              onChange={(e) => setCompSearch(e.target.value)}
              placeholder="Search competitions..."
              className="flex-1 max-w-sm px-4 py-2 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: "#1B1E22",
                borderColor: "#2A2F36",
                color: "#F2F4F7",
              }}
            />
          </div>
          <div className="space-y-3">
            {filteredComps.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3"
                style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-sm">{c.name}</h3>
                    {c.featured && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#D6A14A", color: "#000" }}
                      >
                        Featured
                      </span>
                    )}
                    {!c.active && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#6b7280", color: "#fff" }}
                      >
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "#A7AFB9" }}>
                    {c.city}, {c.state} &bull;{" "}
                    {new Date(c.date).toLocaleDateString("en-IN")} &bull;{" "}
                    {c.organizerName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(c.id)}
                    title="Toggle featured"
                    className="p-1.5 rounded-lg hover:bg-white/10"
                  >
                    <Star
                      size={14}
                      style={{ color: c.featured ? "#D6A14A" : "#A7AFB9" }}
                      fill={c.featured ? "#D6A14A" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => toggleActive(c.id)}
                    title="Toggle active"
                    className="p-1.5 rounded-lg hover:bg-white/10"
                  >
                    {c.active ? (
                      <ToggleRight size={16} style={{ color: "#4ade80" }} />
                    ) : (
                      <ToggleLeft size={16} style={{ color: "#A7AFB9" }} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCompetition(c.id)}
                    className="p-1.5 rounded-lg hover:bg-red-900/30"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
