export const INQUIRY_KEY = "oakline:inquiry:v1";

export interface Inquiry {
  name: string;
  email: string;
  phone?: string;
  area: string;
  projectType: string;
  propertyStatus: string;
  timeframe: string;
  investment: string;
  priorities: string;
  consultDate?: string;
  consultWindow?: string;
  message: string;
  consent: boolean;
}

export function inquirySummary(d: Inquiry) {
  return [
    "Oakline Custom Homes — project brief",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : null,
    `City or neighborhood: ${d.area}`,
    `Project type: ${d.projectType}`,
    `Property status: ${d.propertyStatus}`,
    `Preferred timeframe: ${d.timeframe}`,
    `Investment range: ${d.investment}`,
    d.consultDate ? `Preferred consultation: ${d.consultDate}, ${d.consultWindow || "any time"} (Eastern Time)` : null,
    `Priorities:\n${d.priorities}`,
    `Message:\n${d.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function readSavedInquiry(): { data: Inquiry | null; ok: boolean } {
  try {
    const raw = localStorage.getItem(INQUIRY_KEY);
    if (!raw) return { data: null, ok: true };
    try {
      const v = JSON.parse(raw);
      if (v && typeof v === "object" && typeof v.name === "string" && typeof v.email === "string") return { data: v as Inquiry, ok: true };
    } catch {
      /* malformed */
    }
    localStorage.removeItem(INQUIRY_KEY);
    return { data: null, ok: true };
  } catch {
    return { data: null, ok: false };
  }
}

/** Earliest valid consultation date: tomorrow, as YYYY-MM-DD in local time. */
export function minConsultDate(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
