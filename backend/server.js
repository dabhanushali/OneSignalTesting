import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

// -------------------- PUSH NOTIFICATION ENDPOINT --------------------
app.post("/send-notification", async (req, res) => {
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
          included_segments: ["All"], // OR specific "include_player_ids"
          contents: { en: "This is a test notification from the backend!" },
        }),
      }
    );

    const data = await response.json();
    return res.status(200).json({ success: true, response: data });
  } catch (error) {
    console.error("Push Notification Error:", error);
    return res.status(500).json({ success: false, error });
  }
});

// -------------------- EMAIL SEND ENDPOINT --------------------
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required in body." });
  }

  try {
    const response = await fetch(
      "https://api.onesignal.com/notifications?c=email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          email_to: [email],
          target_channel: "email",
          email_subject: "Test Email via OneSignal",
          email_body:
            "<p>This is a test email sent using OneSignal Email API.</p>",
        }),
      }
    );

    const data = await response.json();
    return res.status(200).json({ success: true, response: data });
  } catch (error) {
    console.error("Email Send Error:", error);
    return res.status(500).json({ success: false, error });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(4000, () => {
    console.log("🚀 Server running on port 4000");
  });
}

// Export for Vercel serverless
export default app;
