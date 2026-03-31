import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import CompetitionCard from "../components/CompetitionCard";
import { useStore } from "../store";

const FILTER_TABS = ["All", "Upcoming", "This Month", "Featured"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function CompetitionsPage() {
  const { competitions, navigate } = useStore();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const states = [...new Set(competitions.map((c) => c.state))].sort();
  const cities = [
    ...new Set(
      competitions
        .filter((c) => !selectedState || c.state === selectedState)
        .map((c) => c.city),
    ),
  ].sort();

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      if (!c.active) return false;
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase());
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
                : true;
      return matchSearch && matchState && matchCity && matchTab;
    });
  }, [competitions, search, selectedState, selectedCity, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-4xl mb-2">
          ALL <span style={{ color: "#E4572E" }}>COMPETITIONS</span>
        </h1>
        <p className="text-sm" style={{ color: "#A7AFB9" }}>
          Discover powerlifting events across India
        </p>
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
            placeholder="Search competitions, cities..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#F2F4F7" }}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: "#A7AFB9" }} />
            <span className="text-xs" style={{ color: "#A7AFB9" }}>
              Filter:
            </span>
          </div>
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
          {(selectedState || selectedCity || search) && (
            <button
              onClick={() => {
                setSelectedState("");
                setSelectedCity("");
                setSearch("");
              }}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ color: "#E4572E" }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
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

      <div className="flex items-center gap-2 mb-5">
        <span className="text-sm" style={{ color: "#A7AFB9" }}>
          {filtered.length} competition{filtered.length !== 1 ? "s" : ""} found
        </span>
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
