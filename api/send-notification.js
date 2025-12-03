import fetch from "node-fetch";

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "";
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export default async function handler(req, res) {
  const allowed = getAllowedOrigins();
  const requestOrigin = req.headers.origin || null;

  // If origin is allowed, set header. Otherwise omit the header so browser blocks cross-origin calls.
  if (requestOrigin && allowed.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Simple GET debug to verify route & CORS quickly
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, requestOrigin, allowed });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

  try {
    const response = await fetch(
      "https://api.onesignal.com/notifications?c=push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          included_segments: ["All"],
          contents: { en: "This is a test notification from the backend!" },
        }),
      }
    );

    const data = await response.json();
    return res.status(200).json({ success: true, response: data });
  } catch (error) {
    console.error("Push Notification Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
