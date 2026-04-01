import { Bell, ChevronDown, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { useStore } from "../store";

const NAV_LINKS = [
  { label: "Home", page: "/" },
  { label: "Competitions", page: "/competitions" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, navigate, logout, notifications, currentPage } =
    useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unread = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read,
  ).length;

  const getDashboardPage = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "admin") return "/admin";
    if (currentUser.role === "organizer") return "/organizer";
    return "/dashboard";
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0E0F10", color: "#F2F4F7" }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#0E0F10",
          borderBottom: "1px solid #2A2F36",
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Zap size={24} style={{ color: "#E4572E" }} />
            <span
              className="font-heading text-xl tracking-wide"
              style={{ color: "#F2F4F7" }}
            >
              LIFTARENA
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                type="button"
                key={l.page}
                onClick={() => navigate(l.page)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  currentPage === l.page ? "text-white" : "text-gray-400",
                )}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Bell size={20} />
                  {unread > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ backgroundColor: "#E4572E" }}
                    >
                      {unread}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: "#E4572E" }}
                    >
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-48 rounded-xl border py-1 shadow-xl z-50"
                      style={{
                        backgroundColor: "#1B1E22",
                        borderColor: "#2A2F36",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(getDashboardPage());
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Dashboard
                      </button>
                      <hr style={{ borderColor: "#2A2F36" }} className="my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm px-4 py-2 rounded-lg border hover:bg-white/10 transition-colors"
                  style={{ borderColor: "#2A2F36" }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: "#E4572E", color: "#fff" }}
                >
                  Sign Up
                </button>
              </>
            )}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-4 py-3 space-y-1"
            style={{ borderColor: "#2A2F36", backgroundColor: "#0E0F10" }}
          >
            {NAV_LINKS.map((l) => (
              <button
                type="button"
                key={l.page}
                onClick={() => {
                  navigate(l.page);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10"
              >
                {l.label}
              </button>
            ))}
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  navigate(getDashboardPage());
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10"
              >
                Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        style={{ backgroundColor: "#0A0B0C", borderTop: "1px solid #2A2F36" }}
        className="mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} style={{ color: "#E4572E" }} />
                <span className="font-heading text-lg">LIFTARENA</span>
              </div>
              <p className="text-sm" style={{ color: "#A7AFB9" }}>
                India's premier powerlifting competition platform.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Platform</p>
              {["Competitions", "Find Events", "Host a Meet"].map((l) => (
                <p
                  key={l}
                  className="text-sm mb-2"
                  style={{ color: "#A7AFB9" }}
                >
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Account</p>
              {["Register", "Login", "Profile"].map((l) => (
                <p
                  key={l}
                  className="text-sm mb-2"
                  style={{ color: "#A7AFB9" }}
                >
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              {["Privacy Policy", "Terms of Use", "Contact"].map((l) => (
                <p
                  key={l}
                  className="text-sm mb-2"
                  style={{ color: "#A7AFB9" }}
                >
                  {l}
                </p>
              ))}
            </div>
          </div>
          <div
            className="border-t pt-6 text-center text-sm"
            style={{ borderColor: "#2A2F36", color: "#A7AFB9" }}
          >
            © 2026 LiftArena. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
