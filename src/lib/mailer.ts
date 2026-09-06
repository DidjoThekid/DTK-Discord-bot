// Envoi d'e-mail via l'API REST d'EmailJS (https://www.emailjs.com).
// EmailJS envoie via TON compte e-mail personnel connecté (Gmail/Outlook...),
// donc pas de restriction de destinataire comme avec Resend en mode sandbox,
// et pas de blocage "IP cloud suspecte" comme avec Gmail SMTP direct.

export async function sendVerificationEmail(to: string, code: string) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(`[mailer] Variables EmailJS manquantes — code pour ${to}: ${code}`);
    return;
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        email: to,
        code,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Échec de l'envoi de l'e-mail (EmailJS) : ${text}`);
  }
}
