// Envoi d'e-mail via l'API HTTP de Resend (https://resend.com).
// Inscription gratuite avec juste une adresse e-mail, aucun numéro de téléphone requis.
// En sandbox (sans domaine vérifié), tu ne peux envoyer qu'à l'adresse de ton propre
// compte Resend. Pour envoyer à n'importe qui, vérifie un domaine (gratuit, voir README).

export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Discord Bot Manager <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(`[mailer] RESEND_API_KEY manquant — code pour ${to}: ${code}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Votre code de vérification",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Code de vérification</h2>
          <p>Voici votre code à usage unique :</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${code}</p>
          <p>Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Échec de l'envoi de l'e-mail (Resend) : ${text}`);
  }
}
