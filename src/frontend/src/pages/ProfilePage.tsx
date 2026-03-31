import { Building, Edit, Phone, Save, User, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";

export default function ProfilePage() {
  const { currentUser, competitions, updateProfile, navigate } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");

  if (!currentUser) {
    return (
      <div className="text-center py-20">
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

  const startEdit = () => {
    setName(currentUser.name);
    setOrgName(currentUser.orgName || "");
    setEditing(true);
  };
  const save = () => {
    updateProfile({
      name: name.trim() || currentUser.name,
      orgName: orgName.trim() || undefined,
    });
    setEditing(false);
  };

  const myComps =
    currentUser.role === "player"
      ? competitions.filter((c) => c.participants.includes(currentUser.id))
      : competitions.filter((c) => c.organizerId === currentUser.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl mb-8">
        MY <span style={{ color: "#E4572E" }}>PROFILE</span>
      </h1>

      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: "#E4572E" }}
            >
              {currentUser.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-xl">{currentUser.name}</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor: "rgba(228,87,46,0.15)",
                  color: "#E4572E",
                }}
              >
                {currentUser.role}
              </span>
              {currentUser.role === "organizer" && !currentUser.approved && (
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(248,113,113,0.15)",
                    color: "#f87171",
                  }}
                >
                  Pending Approval
                </span>
              )}
            </div>
          </div>
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border hover:bg-white/10"
              style={{ borderColor: "#2A2F36" }}
            >
              <Edit size={14} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-name"
                className="text-xs font-medium block mb-1.5"
                style={{ color: "#A7AFB9" }}
              >
                Full Name
              </label>
              <input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{
                  backgroundColor: "#20242A",
                  borderColor: "#2A2F36",
                  color: "#F2F4F7",
                }}
              />
            </div>
            {currentUser.role === "organizer" && (
              <div>
                <label
                  htmlFor="edit-org"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  Organization Name
                </label>
                <input
                  id="edit-org"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{
                    backgroundColor: "#20242A",
                    borderColor: "#2A2F36",
                    color: "#F2F4F7",
                  }}
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={save}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border hover:bg-white/10"
                style={{ borderColor: "#2A2F36" }}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InfoRow icon={User} label="Full Name" value={currentUser.name} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={`+91 ${currentUser.phone}`}
            />
            {currentUser.orgName && (
              <InfoRow
                icon={Building}
                label="Organization"
                value={currentUser.orgName}
              />
            )}
          </div>
        )}
      </div>

      {myComps.length > 0 && (
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
        >
          <h3 className="font-heading text-lg mb-4">
            {currentUser.role === "player"
              ? "MY REGISTRATIONS"
              : "MY COMPETITIONS"}
          </h3>
          <div className="space-y-2">
            {myComps.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: "#20242A" }}
              >
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs" style={{ color: "#A7AFB9" }}>
                    {c.city} &bull;{" "}
                    {new Date(c.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/competitions/${c.id}`)}
                  className="text-xs"
                  style={{ color: "#E4572E" }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} style={{ color: "#A7AFB9" }} />
      <div>
        <p className="text-xs" style={{ color: "#A7AFB9" }}>
          {label}
        </p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
