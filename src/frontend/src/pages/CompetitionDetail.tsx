import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";

export default function CompetitionDetail({ id }: { id: string }) {
  const {
    competitions,
    reviews,
    addReview,
    currentUser,
    navigate,
    joinCompetition,
  } = useStore();
  const competition = competitions.find((c) => c.id === id);
  const compReviews = reviews.filter((r) => r.competitionId === id);
  const avgRating = compReviews.length
    ? (
        compReviews.reduce((s, r) => s + r.rating, 0) / compReviews.length
      ).toFixed(1)
    : null;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!competition)
    return (
      <div className="text-center py-20">
        <p className="font-heading text-2xl">COMPETITION NOT FOUND</p>
        <button
          type="button"
          onClick={() => navigate("/competitions")}
          className="mt-4 text-sm"
          style={{ color: "#E4572E" }}
        >
          Back to Competitions
        </button>
      </div>
    );

  const whatsappUrl = `https://wa.me/${competition.contactNumber}?text=Hi, I want to join ${encodeURIComponent(competition.name)}`;
  const hasReviewed = compReviews.some((r) => r.userId === currentUser?.id);
  const isParticipant = currentUser
    ? competition.participants.includes(currentUser.id)
    : false;

  const handleSubmitReview = () => {
    if (!comment.trim()) return;
    addReview(id, rating, comment.trim());
    setComment("");
    setSubmitted(true);
  };

  const metaRows = [
    {
      icon: MapPin,
      text: `${competition.area}, ${competition.city}, ${competition.state}`,
      color: "#E4572E",
    },
    {
      icon: Calendar,
      text: new Date(competition.date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      color: "#E4572E",
    },
    {
      icon: DollarSign,
      text: `\u20B9${competition.entryFee.toLocaleString()} Entry Fee`,
      color: "#D6A14A",
    },
    { icon: Phone, text: competition.contactNumber, color: "#A7AFB9" },
    { icon: User, text: competition.organizerName, color: "#A7AFB9" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        type="button"
        onClick={() => navigate("/competitions")}
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: "#A7AFB9" }}
      >
        <ArrowLeft size={16} /> Back to Competitions
      </button>

      <div
        className="rounded-2xl overflow-hidden border mb-6"
        style={{ borderColor: "#2A2F36" }}
      >
        <div
          className="h-48 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a0800, #4a1500, #1a0800)",
          }}
        >
          {competition.featured && (
            <span
              className="px-4 py-1.5 rounded-full font-bold text-sm"
              style={{ backgroundColor: "#D6A14A", color: "#000" }}
            >
              ★ FEATURED EVENT
            </span>
          )}
        </div>
        <div className="p-6" style={{ backgroundColor: "#1B1E22" }}>
          <h1 className="font-heading text-3xl mb-4">{competition.name}</h1>
          <div className="grid sm:grid-cols-2 gap-3">
            {metaRows.map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 text-sm">
                <Icon size={16} style={{ color }} />
                <span style={{ color: "#F2F4F7" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <h2 className="font-heading text-lg mb-3">ABOUT THIS EVENT</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#A7AFB9" }}>
              {competition.description}
            </p>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <h2 className="font-heading text-lg mb-3">WEIGHT CATEGORIES</h2>
            <div className="flex flex-wrap gap-2">
              {competition.weightCategories.map((w) => (
                <span
                  key={w}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(228,87,46,0.15)",
                    color: "#E4572E",
                    border: "1px solid rgba(228,87,46,0.3)",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg">REVIEWS</h2>
              {avgRating && (
                <div className="flex items-center gap-1">
                  <Star size={16} style={{ color: "#D6A14A" }} fill="#D6A14A" />
                  <span className="font-bold">{avgRating}</span>
                  <span className="text-xs" style={{ color: "#A7AFB9" }}>
                    ({compReviews.length})
                  </span>
                </div>
              )}
            </div>
            {compReviews.length === 0 ? (
              <p className="text-sm" style={{ color: "#A7AFB9" }}>
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-3">
                {compReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#20242A" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">
                        {r.userName}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            style={{
                              color: s <= r.rating ? "#D6A14A" : "#2A2F36",
                            }}
                            fill={s <= r.rating ? "#D6A14A" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#A7AFB9" }}>
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {currentUser?.role === "player" && !hasReviewed && !submitted && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "#2A2F36" }}
              >
                <p className="text-sm font-semibold mb-3">Add Your Review</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button type="button" key={s} onClick={() => setRating(s)}>
                      <Star
                        size={20}
                        style={{ color: s <= rating ? "#D6A14A" : "#2A2F36" }}
                        fill={s <= rating ? "#D6A14A" : "none"}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "#20242A",
                    borderColor: "#2A2F36",
                    color: "#F2F4F7",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#E4572E", color: "#fff" }}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <p className="text-sm mb-1" style={{ color: "#A7AFB9" }}>
              Entry Fee
            </p>
            <p
              className="font-heading text-3xl mb-4"
              style={{ color: "#E4572E" }}
            >
              ₹{competition.entryFee.toLocaleString()}
            </p>
            <p className="text-sm mb-4" style={{ color: "#A7AFB9" }}>
              {competition.participants.length} athletes registered
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#E4572E", color: "#fff" }}
            >
              <MessageCircle size={16} /> Join on WhatsApp
            </a>
            {currentUser?.role === "player" && !isParticipant && (
              <button
                type="button"
                onClick={() => joinCompetition(id)}
                className="w-full mt-2 py-2.5 rounded-xl text-sm border hover:bg-white/10"
                style={{ borderColor: "#2A2F36" }}
              >
                Mark as Interested
              </button>
            )}
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
          >
            <h3 className="font-semibold text-sm mb-3">Location</h3>
            <div
              className="h-24 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#20242A" }}
            >
              <div className="text-center">
                <MapPin
                  size={20}
                  className="mx-auto mb-1"
                  style={{ color: "#E4572E" }}
                />
                <p className="text-xs">
                  {competition.city}, {competition.state}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
