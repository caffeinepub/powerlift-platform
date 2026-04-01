const API_KEY = "eb078ef4-2d30-11f1-ae4a-0200cd936042";
const BASE_URL = "https://2factor.in/API/V1";

export async function sendOtp(phone: string): Promise<string> {
  const url = `${BASE_URL}/${API_KEY}/SMS/+91${phone}/AUTOGEN`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to send OTP");
  const data = await res.json();
  if (data.Status !== "Success")
    throw new Error(data.Details || "Failed to send OTP");
  return data.Details as string; // session id
}

export async function verifyOtp(
  sessionId: string,
  otp: string,
): Promise<boolean> {
  const url = `${BASE_URL}/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
  const res = await fetch(url);
  if (!res.ok) return false;
  const data = await res.json();
  return data.Status === "Success";
}
