import { Phone, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";
import { sendOtp, verifyOtp } from "../utils/twoFactor";

export default function Login() {
  const { login, navigate } = useStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number");
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

  const handleVerify = async () => {
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
      const user = login(phone);
      if (!user) {
        setError(
          "No account found with this phone number. Please register first.",
        );
        setStep("phone");
        setLoading(false);
        return;
      }
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "organizer") navigate("/organizer");
      else navigate("/dashboard");
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "rgba(228,87,46,0.15)" }}
          >
            <Zap size={28} style={{ color: "#E4572E" }} />
          </div>
          <h1 className="font-heading text-3xl">WELCOME BACK</h1>
          <p className="text-sm mt-2" style={{ color: "#A7AFB9" }}>
            Login to your LiftArena account
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#1B1E22", borderColor: "#2A2F36" }}
        >
          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone-input"
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
                    id="phone-input"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="Enter your phone number"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#F2F4F7" }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
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
                  Enter the 6-digit code sent via SMS
                </p>
              </div>
              <div>
                <label
                  htmlFor="otp-input"
                  className="text-sm font-medium block mb-2"
                >
                  Enter OTP
                </label>
                <input
                  id="otp-input"
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
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#E4572E", color: "#fff" }}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm"
                style={{ color: "#A7AFB9" }}
              >
                Change number
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-4" style={{ color: "#A7AFB9" }}>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold"
            style={{ color: "#E4572E" }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
