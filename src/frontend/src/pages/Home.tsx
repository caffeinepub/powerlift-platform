import { ArrowRight, MapPin, Search, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import CompetitionCard from "../components/CompetitionCard";
import { useStore } from "../store";

export default function Home() {
  const { navigate, competitions } = useStore();
  const [search, setSearch] = useState("");

  const featured = competitions.filter((c) => c.featured && c.active);

  const handleSearch = () => {
    navigate("/competitions");
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[520px] flex items-center"
        style={{
          background:
            "linear-gradient(135deg, #0E0F10 0%, #1a0800 40%, #0E0F10 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(228,87,46,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
              style={{
                borderColor: "#E4572E",
                color: "#E4572E",
                backgroundColor: "rgba(228,87,46,0.1)",
              }}
            >
              <Zap size={12} /> India's #1 Powerlifting Platform
            </div>
            <h1 className="font-heading text-5xl md:text-7xl leading-none mb-4">
              DOMINATE THE <span style={{ color: "#E4572E" }}>PLATFORM</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "#A7AFB9" }}>
              Discover powerlifting competitions near you. Register, compete,
              and rise to the top.
            </p>

            <div className="flex gap-3 mb-8">
              <div
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border"
                style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
              >
                <Search size={16} style={{ color: "#A7AFB9" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, locations..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#F2F4F7" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/competitions")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors hover:opacity-90"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                FIND AN EVENT <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-colors hover:bg-white/10"
                style={{ borderColor: "#2A2F36" }}
              >
                HOST A MEET
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t"
          style={{ borderColor: "#2A2F36" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div
              className="grid grid-cols-3 divide-x"
              style={{ borderColor: "#2A2F36" }}
            >
              {[
                { icon: Trophy, label: "Competitions", value: "50+" },
                { icon: Users, label: "Athletes", value: "2,000+" },
                { icon: MapPin, label: "Cities", value: "25+" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-3 py-4 px-6"
                >
                  <Icon size={20} style={{ color: "#E4572E" }} />
                  <div>
                    <p className="font-heading text-xl">{value}</p>
                    <p className="text-xs" style={{ color: "#A7AFB9" }}>
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl">
                FEATURED <span style={{ color: "#E4572E" }}>COMPETITIONS</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: "#A7AFB9" }}>
                Highlighted events from top organizers
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/competitions")}
              className="text-sm flex items-center gap-1 hover:underline"
              style={{ color: "#E4572E" }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section
        className="border-t py-16"
        style={{ borderColor: "#2A2F36", backgroundColor: "#0A0B0C" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">
            HOW IT <span style={{ color: "#E4572E" }}>WORKS</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Register",
                desc: "Create your account as a Player or Organizer.",
              },
              {
                step: "02",
                title: "Discover",
                desc: "Browse competitions near you by state, city, or area.",
              },
              {
                step: "03",
                title: "Compete",
                desc: "Join via WhatsApp and show up to compete.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center p-6 rounded-2xl border"
                style={{ borderColor: "#2A2F36", backgroundColor: "#1B1E22" }}
              >
                <span
                  className="font-heading text-5xl mb-3"
                  style={{ color: "#E4572E" }}
                >
                  {step}
                </span>
                <h3 className="font-heading text-xl mb-2">{title}</h3>
                <p className="text-sm" style={{ color: "#A7AFB9" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(228,87,46,0.2) 0%, rgba(214,161,74,0.1) 100%)",
            border: "1px solid rgba(228,87,46,0.3)",
          }}
        >
          <h2 className="font-heading text-4xl mb-3">
            READY TO <span style={{ color: "#E4572E" }}>COMPETE?</span>
          </h2>
          <p className="mb-6" style={{ color: "#A7AFB9" }}>
            Join thousands of powerlifters across India.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: "#E4572E", color: "#fff" }}
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
}
