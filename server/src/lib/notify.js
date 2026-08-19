// Fire-and-forget notifications when a contact-form submission comes in —
// the message is already safely stored in ContactMessage regardless of
// whether either integration below is configured or succeeds. Failures here
// are logged, never thrown back at the caller.

async function sendWhatsAppNotification(message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO_NUMBER;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneNumberId || !to || !template) {
    console.warn("[notify] WhatsApp not configured (WHATSAPP_TOKEN/_PHONE_NUMBER_ID/_TO_NUMBER/_TEMPLATE_NAME) — skipping");
    return;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: `${message.firstName} ${message.lastName}` },
                { type: "text", text: message.phone || "" },
                { type: "text", text: message.purpose },
                { type: "text", text: message.message || "(no message)" },
              ],
            },
          ],
        },
      }),
    });
    if (!res.ok) console.error("[notify] WhatsApp API responded", res.status, await res.text());
  } catch (err) {
    console.error("[notify] WhatsApp send failed", err);
  }
}

async function sendEmailNotification(message) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) {
    console.warn("[notify] Email not configured (RESEND_API_KEY/NOTIFY_EMAIL_TO) — skipping");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev",
        to,
        reply_to: message.email,
        subject: `New ${message.purpose.toLowerCase()} inquiry from ${message.firstName} ${message.lastName}`,
        text: `${message.firstName} ${message.lastName}\nEmail: ${message.email}\nPurpose: ${message.purpose}\n\n${message.message || "(no message)"}`,
      }),
    });
    if (!res.ok) console.error("[notify] Resend API responded", res.status, await res.text());
  } catch (err) {
    console.error("[notify] Email send failed", err);
  }
}

module.exports = { sendWhatsAppNotification, sendEmailNotification };
