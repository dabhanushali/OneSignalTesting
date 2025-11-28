import fetch from "node-fetch";

export default async function handler(req, res) {
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
