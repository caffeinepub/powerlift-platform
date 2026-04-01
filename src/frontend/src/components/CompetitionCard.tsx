import {
  Calendar,
  DollarSign,
  MapPin,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { type Competition, useStore } from "../store";

const GRADIENTS = [
  "linear-gradient(135deg, #1a0a00 0%, #4a1500 50%, #2d0d00 100%)",
  "linear-gradient(135deg, #0a0a1a 0%, #1a1a4a 50%, #0d0d2d 100%)",
  "linear-gradient(135deg, #001a0a 0%, #004a1a 50%, #002d0d 100%)",
  "linear-gradient(135deg, #1a001a 0%, #3a003a 50%, #1a001a 100%)",
  "linear-gradient(135deg, #1a0d00 0%, #3a2000 50%, #2a1500 100%)",
  "linear-gradient(135deg, #00101a 0%, #002030 50%, #001520 100%)",
  "linear-gradient(135deg, #0a1a00 0%, #1a3a00 50%, #0d2d00 100%)",
  "linear-gradient(135deg, #1a1000 0%, #3a2a00 50%, #2d2000 100%)",
];

interface Props {
  competition: Competition;
  onDetails?: () => void;
}

export default function CompetitionCard({ competition, onDetails }: Props) {
  const { navigate, currentUser } = useStore();
  const gradient = GRADIENTS[competition.gradientIndex % GRADIENTS.length];
  const whatsappUrl = `https://wa.me/${competition.contactNumber}?text=Hi, I want to join ${encodeURIComponent(competition.name)}`;

  const isUpcoming = new Date(competition.date) >= new Date();
  const statusLabel = isUpcoming ? "UPCOMING" : "CLOSED";
  const statusColor = isUpcoming ? "#22c55e" : "#6b7280";

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl"
      style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
    >
      {/* Card header gradient */}
      <div
        className="h-36 relative flex items-end p-4"
        style={{ background: gradient }}
      >
        {competition.featured && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#D6A14A", color: "#000" }}
          >
            ★ FEATURED
          </span>
        )}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusColor, color: "#000" }}
        >
          {statusLabel}
        </span>
        <span
          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full border"
          style={{ borderColor: "#2A2F36", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          OPEN
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3
          className="font-heading text-base leading-tight"
          style={{ color: "#F2F4F7" }}
        >
          {competition.name}
        </h3>

        <div className="space-y-1">
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#A7AFB9" }}
          >
            <MapPin size={12} style={{ color: "#E4572E" }} />
            <span>
              {competition.city}, {competition.state}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#A7AFB9" }}
          >
            <Calendar size={12} style={{ color: "#E4572E" }} />
            <span>
              {new Date(competition.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#A7AFB9" }}
          >
            <DollarSign size={12} style={{ color: "#D6A14A" }} />
            <span>₹{competition.entryFee.toLocaleString()} entry fee</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#A7AFB9" }}
          >
            <User size={12} style={{ color: "#A7AFB9" }} />
            <span>{competition.organizerName}</span>
          </div>
        </div>

        {/* Weight categories */}
        <div className="flex flex-wrap gap-1 mt-1">
          {competition.weightCategories.slice(0, 3).map((w) => (
            <span
              key={w}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#2A2F36", color: "#A7AFB9" }}
            >
              {w}
            </span>
          ))}
          {competition.weightCategories.length > 3 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#2A2F36", color: "#A7AFB9" }}
            >
              +{competition.weightCategories.length - 3}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 text-xs"
          style={{ color: "#A7AFB9" }}
        >
          <Star size={11} style={{ color: "#D6A14A" }} fill="#D6A14A" />
          <span>{competition.participants.length} athletes registered</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <button
            type="button"
            onClick={() =>
              onDetails
                ? onDetails()
                : navigate(`/competitions/${competition.id}`)
            }
            className="flex-1 text-xs py-2 rounded-lg border hover:bg-white/5 transition-colors"
            style={{ borderColor: "#2A2F36" }}
          >
            View Details
          </button>
          {currentUser?.role === "player" ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#E4572E", color: "#fff" }}
            >
              <MessageCircle size={12} /> Join Now
            </a>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#E4572E", color: "#fff" }}
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
