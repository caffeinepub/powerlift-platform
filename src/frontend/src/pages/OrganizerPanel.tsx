import { Clock, Edit, Plus, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { type Competition, useStore } from "../store";

const WEIGHT_OPTIONS = [
  "52kg",
  "56kg",
  "60kg",
  "67.5kg",
  "75kg",
  "82.5kg",
  "90kg",
  "100kg",
  "110kg",
  "125kg",
  "140kg",
  "59kg",
  "66kg",
  "74kg",
  "83kg",
  "93kg",
  "105kg",
  "120kg+",
];
const STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

interface FormData {
  name: string;
  state: string;
  city: string;
  area: string;
  date: string;
  entryFee: string;
  weightCategories: string[];
  description: string;
  contactNumber: string;
}

const defaultForm: FormData = {
  name: "",
  state: "",
  city: "",
  area: "",
  date: "",
  entryFee: "",
  weightCategories: [],
  description: "",
  contactNumber: "",
};

export default function OrganizerPanel() {
  const {
    currentUser,
    competitions,
    users,
    createCompetition,
    updateCompetition,
    deleteCompetition,
    navigate,
  } = useStore();
  const [tab, setTab] = useState<"list" | "create">("list");
  const [form, setForm] = useState<FormData>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [participantsModal, setParticipantsModal] =
    useState<Competition | null>(null);
  const [error, setError] = useState("");

  if (!currentUser || currentUser.role !== "organizer") {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-2xl mb-4">ACCESS RESTRICTED</p>
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

  if (!currentUser.approved) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="rounded-2xl border p-10"
          style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
        >
          <Clock
            size={48}
            className="mx-auto mb-4"
            style={{ color: "#D6A14A" }}
          />
          <h2 className="font-heading text-2xl mb-3">PENDING APPROVAL</h2>
          <p className="text-sm" style={{ color: "#A7AFB9" }}>
            Your organizer account is under review. You&apos;ll be notified once
            approved by the admin.
          </p>
        </div>
      </div>
    );
  }

  const myComps = competitions.filter((c) => c.organizerId === currentUser.id);

  const toggleWeight = (w: string) => {
    setForm((f) => ({
      ...f,
      weightCategories: f.weightCategories.includes(w)
        ? f.weightCategories.filter((x) => x !== w)
        : [...f.weightCategories, w],
    }));
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.state ||
      !form.city ||
      !form.date ||
      !form.entryFee ||
      !form.contactNumber
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
    const data = {
      name: form.name,
      state: form.state,
      city: form.city,
      area: form.area,
      date: form.date,
      entryFee: Number(form.entryFee),
      weightCategories: form.weightCategories,
      description: form.description,
      contactNumber: form.contactNumber,
      organizerId: currentUser.id,
      organizerName: currentUser.orgName || currentUser.name,
      featured: false,
      active: true,
    };
    if (editId) {
      updateCompetition(editId, data);
      setEditId(null);
    } else {
      createCompetition(data);
    }
    setForm(defaultForm);
    setTab("list");
  };

  const startEdit = (c: Competition) => {
    setForm({
      name: c.name,
      state: c.state,
      city: c.city,
      area: c.area,
      date: c.date,
      entryFee: String(c.entryFee),
      weightCategories: c.weightCategories,
      description: c.description,
      contactNumber: c.contactNumber,
    });
    setEditId(c.id);
    setTab("create");
  };

  const participants = participantsModal
    ? users.filter((u) => participantsModal.participants.includes(u.id))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm" style={{ color: "#A7AFB9" }}>
            Welcome,
          </p>
          <h1 className="font-heading text-3xl">
            {(currentUser.orgName || currentUser.name).toUpperCase()}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setTab("create");
            setEditId(null);
            setForm(defaultForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "#E4572E", color: "#fff" }}
        >
          <Plus size={16} /> New Competition
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["list", "create"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => {
              setTab(t);
              if (t === "list") {
                setEditId(null);
                setForm(defaultForm);
              }
            }}
            className="px-5 py-2 rounded-xl text-sm font-semibold border transition-all"
            style={{
              borderColor: tab === t ? "#E4572E" : "#2A2F36",
              backgroundColor:
                tab === t ? "rgba(228,87,46,0.15)" : "transparent",
              color: tab === t ? "#E4572E" : "#A7AFB9",
            }}
          >
            {t === "list"
              ? "My Competitions"
              : editId
                ? "Edit Competition"
                : "Create New"}
          </button>
        ))}
      </div>

      {tab === "list" ? (
        myComps.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "#2A2F36", backgroundColor: "#1B1E22" }}
          >
            <p className="font-heading text-xl mb-2">NO COMPETITIONS YET</p>
            <p className="text-sm mb-4" style={{ color: "#A7AFB9" }}>
              Create your first competition
            </p>
            <button
              type="button"
              onClick={() => setTab("create")}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#E4572E", color: "#fff" }}
            >
              Create Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myComps.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3"
                style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{c.name}</h3>
                    {c.featured && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#D6A14A", color: "#000" }}
                      >
                        Featured
                      </span>
                    )}
                    {!c.active && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#6b7280", color: "#fff" }}
                      >
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#A7AFB9" }}>
                    {c.city}, {c.state} &bull;{" "}
                    {new Date(c.date).toLocaleDateString("en-IN")} &bull;
                    &#8377;{c.entryFee.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setParticipantsModal(c)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border hover:bg-white/10"
                    style={{ borderColor: "#2A2F36" }}
                  >
                    <Users size={12} /> {c.participants.length}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <Edit size={14} style={{ color: "#A7AFB9" }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCompetition(c.id)}
                    className="p-2 rounded-lg hover:bg-red-900/30"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div
          className="rounded-2xl border p-6 max-w-2xl"
          style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
        >
          <h2 className="font-heading text-xl mb-6">
            {editId ? "EDIT COMPETITION" : "CREATE COMPETITION"}
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="comp-name"
                className="text-xs font-medium block mb-1.5"
                style={{ color: "#A7AFB9" }}
              >
                Competition Name *
              </label>
              <input
                id="comp-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Mumbai Open 2026"
                className="input-dark"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comp-state"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  State *
                </label>
                <select
                  id="comp-state"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, state: e.target.value }))
                  }
                  className="input-dark"
                >
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="comp-city"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  City *
                </label>
                <input
                  id="comp-city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="City name"
                  className="input-dark"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comp-area"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  Area / Venue
                </label>
                <input
                  id="comp-area"
                  value={form.area}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, area: e.target.value }))
                  }
                  placeholder="Area or venue name"
                  className="input-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="comp-date"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  Date *
                </label>
                <input
                  id="comp-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="input-dark"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comp-fee"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  Entry Fee (&#8377;) *
                </label>
                <input
                  id="comp-fee"
                  type="number"
                  value={form.entryFee}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, entryFee: e.target.value }))
                  }
                  placeholder="e.g. 1000"
                  className="input-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="comp-contact"
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: "#A7AFB9" }}
                >
                  Contact Number *
                </label>
                <input
                  id="comp-contact"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contactNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    }))
                  }
                  placeholder="WhatsApp number"
                  className="input-dark"
                />
              </div>
            </div>
            <div>
              <span
                className="text-xs font-medium block mb-1.5"
                style={{ color: "#A7AFB9" }}
              >
                Weight Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => toggleWeight(w)}
                    className="text-xs px-2.5 py-1 rounded-full border transition-all"
                    style={{
                      borderColor: form.weightCategories.includes(w)
                        ? "#E4572E"
                        : "#2A2F36",
                      backgroundColor: form.weightCategories.includes(w)
                        ? "rgba(228,87,46,0.15)"
                        : "transparent",
                      color: form.weightCategories.includes(w)
                        ? "#E4572E"
                        : "#A7AFB9",
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="comp-desc"
                className="text-xs font-medium block mb-1.5"
                style={{ color: "#A7AFB9" }}
              >
                Description
              </label>
              <textarea
                id="comp-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the competition..."
                rows={3}
                className="input-dark resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {editId ? "Update" : "Create Competition"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("list");
                  setEditId(null);
                  setForm(defaultForm);
                }}
                className="px-4 py-3 rounded-xl text-sm border hover:bg-white/10"
                style={{ borderColor: "#2A2F36" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {participantsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg">PARTICIPANTS</h3>
              <button type="button" onClick={() => setParticipantsModal(null)}>
                <X size={18} style={{ color: "#A7AFB9" }} />
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: "#A7AFB9" }}>
              {participantsModal.name}
            </p>
            {participants.length === 0 ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: "#A7AFB9" }}
              >
                No participants yet
              </p>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: "#20242A" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: "#E4572E" }}
                    >
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs" style={{ color: "#A7AFB9" }}>
                        +91 {p.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
