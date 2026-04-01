import { Building, Phone, Shield, User, Zap } from "lucide-react";
import { useState } from "react";
import { type Role, useStore } from "../store";
import { sendOtp, verifyOtp } from "../utils/twoFactor";

type Step = "form" | "otp";

export default function Register() {
  const { register, navigate } = useStore();
  const [step, setStep] = useState<Step>("form");
  const [role, setRole] = useState<Role>("player");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    if (role === "organizer" && !orgName.trim()) {
      setError("Organization name is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const sid = await sendOtp(phone);
      setSessionId(sid);
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const valid = await verifyOtp(sessionId, otp);
      if (!valid) {
        setError("Invalid or expired OTP. Please try again.");
        setLoading(false);
        return;
      }
      register({
        role,
        name: name.trim(),
        phone,
        orgName: orgName.trim() || undefined,
      });
      if (role === "organizer") {
        navigate("/login");
        alert(
          "Registration successful! Your organizer account is pending admin approval.",
        );
      } else {
        navigate("/login");
        alert("Registration successful! Please login with your phone number.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "rgba(228,87,46,0.15)" }}
          >
            <Zap size={28} style={{ color: "#E4572E" }} />
          </div>
          <h1 className="font-heading text-3xl">JOIN POWERLIFT</h1>
          <p className="text-sm mt-2" style={{ color: "#A7AFB9" }}>
            Create your account to get started
          </p>
        </div>

        <div
          className="rounded-2xl border p-6 space-y-5"
          style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
        >
          {step === "form" ? (
            <>
              <div>
                <span className="text-sm font-medium block mb-2">I am a</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["player", "organizer"] as Role[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className="py-3 rounded-xl text-sm font-semibold border-2 transition-all capitalize"
                      style={{
                        borderColor: role === r ? "#E4572E" : "#2A2F36",
                        backgroundColor:
                          role === r ? "rgba(228,87,46,0.1)" : "transparent",
                        color: role === r ? "#E4572E" : "#A7AFB9",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {role === "organizer" && (
                <div>
                  <label
                    htmlFor="org-name"
                    className="text-sm font-medium block mb-2"
                  >
                    Competition / Organization Name
                  </label>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
                    style={{
                      borderColor: "#2A2F36",
                      backgroundColor: "#20242A",
                    }}
                  >
                    <Building size={16} style={{ color: "#A7AFB9" }} />
                    <input
                      id="org-name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Iron Beast Federation"
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: "#F2F4F7" }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="full-name"
                  className="text-sm font-medium block mb-2"
                >
                  {role === "organizer" ? "Organizer Name" : "Full Name"}
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: "#2A2F36", backgroundColor: "#20242A" }}
                >
                  <User size={16} style={{ color: "#A7AFB9" }} />
                  <input
                    id="full-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#F2F4F7" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="text-sm font-medium block mb-2"
                >
                  Phone Number
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: "#2A2F36", backgroundColor: "#20242A" }}
                >
                  <Phone size={16} style={{ color: "#A7AFB9" }} />
                  <span className="text-sm" style={{ color: "#A7AFB9" }}>
                    +91
                  </span>
                  <input
                    id="reg-phone"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit phone number"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#F2F4F7" }}
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {loading ? "Sending OTP..." : "Send OTP to Verify"}
              </button>

              {role === "organizer" && (
                <p className="text-xs text-center" style={{ color: "#A7AFB9" }}>
                  Organizer accounts require admin approval before you can
                  create competitions.
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div
                className="text-center p-3 rounded-xl"
                style={{ backgroundColor: "rgba(228,87,46,0.1)" }}
              >
                <Shield
                  size={20}
                  style={{ color: "#E4572E" }}
                  className="mx-auto mb-1"
                />
                <p className="text-sm">
                  OTP sent to <strong>+91 {phone}</strong>
                </p>
                <p className="text-xs mt-1" style={{ color: "#A7AFB9" }}>
                  Enter the 6-digit code sent via SMS to complete registration
                </p>
              </div>

              <div>
                <label
                  htmlFor="reg-otp"
                  className="text-sm font-medium block mb-2"
                >
                  Enter OTP
                </label>
                <input
                  id="reg-otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-center tracking-widest font-mono outline-none"
                  style={{
                    backgroundColor: "#20242A",
                    borderColor: "#2A2F36",
                    color: "#F2F4F7",
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleVerifyAndRegister()
                  }
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {loading ? "Creating Account..." : "Verify & Create Account"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm"
                style={{ color: "#A7AFB9" }}
              >
                Go back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-4" style={{ color: "#A7AFB9" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold"
            style={{ color: "#E4572E" }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
