import { MapPin, Search, SlidersHorizontal, Star, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import CompetitionCard from "../components/CompetitionCard";
import { useStore } from "../store";

const FILTER_TABS = [
  "All",
  "Upcoming",
  "This Month",
  "Featured",
  "My Registrations",
] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function PlayerDashboard() {
  const { currentUser, competitions, navigate } = useStore();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const states = useMemo(
    () => [...new Set(competitions.map((c) => c.state))].sort(),
    [competitions],
  );
  const cities = useMemo(
    () =>
      [
        ...new Set(
          competitions
            .filter((c) => !selectedState || c.state === selectedState)
            .map((c) => c.city),
        ),
      ].sort(),
    [competitions, selectedState],
  );

  const filtered = useMemo(() => {
    if (!currentUser || currentUser.role !== "player") return [];
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return competitions.filter((c) => {
      if (!c.active) return false;
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchState = !selectedState || c.state === selectedState;
      const matchCity = !selectedCity || c.city === selectedCity;
      const compDate = new Date(c.date);
      const matchTab =
        activeTab === "All"
          ? true
          : activeTab === "Upcoming"
            ? compDate >= now
            : activeTab === "This Month"
              ? compDate >= now && compDate <= endOfMonth
              : activeTab === "Featured"
                ? c.featured
                : activeTab === "My Registrations"
                  ? c.participants.includes(currentUser.id)
                  : true;
      return matchSearch && matchState && matchCity && matchTab;
    });
  }, [
    competitions,
    search,
    selectedState,
    selectedCity,
    activeTab,
    currentUser,
  ]);

  if (!currentUser || currentUser.role !== "player") {
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

  const myRegistrations = competitions.filter((c) =>
    c.participants.includes(currentUser.id),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: "#A7AFB9" }}>
          Welcome back,
        </p>
        <h1 className="font-heading text-4xl">
          {currentUser.name.toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Competitions",
            value: competitions.filter((c) => c.active).length,
            Icon: Trophy,
            color: "#E4572E",
          },
          {
            label: "Registered",
            value: myRegistrations.length,
            Icon: Star,
            color: "#D6A14A",
          },
          {
            label: "Featured Events",
            value: competitions.filter((c) => c.featured).length,
            Icon: Star,
            color: "#D6A14A",
          },
          {
            label: "States Available",
            value: new Set(competitions.map((c) => c.state)).size,
            Icon: MapPin,
            color: "#A7AFB9",
          },
        ].map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <Icon size={20} style={{ color }} className="mb-2" />
            <p className="font-heading text-2xl">{value}</p>
            <p className="text-xs" style={{ color: "#A7AFB9" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border p-4 mb-8 space-y-4"
        style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: "#2A2F36", backgroundColor: "#20242A" }}
        >
          <Search size={16} style={{ color: "#A7AFB9" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitions near you..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#F2F4F7" }}
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <SlidersHorizontal size={14} style={{ color: "#A7AFB9" }} />
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity("");
            }}
            className="text-sm px-3 py-1.5 rounded-lg border outline-none"
            style={{
              backgroundColor: "#20242A",
              borderColor: "#2A2F36",
              color: "#F2F4F7",
            }}
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border outline-none"
            style={{
              backgroundColor: "#20242A",
              borderColor: "#2A2F36",
              color: "#F2F4F7",
            }}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-xs px-4 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: activeTab === tab ? "#E4572E" : "#2A2F36",
                backgroundColor:
                  activeTab === tab ? "rgba(228,87,46,0.15)" : "transparent",
                color: activeTab === tab ? "#E4572E" : "#A7AFB9",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-heading text-xl">
          COMPETITIONS{" "}
          <span style={{ color: "#E4572E" }}>({filtered.length})</span>
        </h2>
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <CompetitionCard
              key={c.id}
              competition={c}
              onDetails={() => navigate(`/competitions/${c.id}`)}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-20 rounded-2xl border"
          style={{ borderColor: "#2A2F36", backgroundColor: "#1B1E22" }}
        >
          <p className="font-heading text-xl mb-2">NO COMPETITIONS FOUND</p>
          <p className="text-sm" style={{ color: "#A7AFB9" }}>
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
