import nodemailer from "nodemailer";

// Envoi d'e-mail via Gmail (SMTP) — aucun nom de domaine requis, fonctionne
// immédiatement avec un compte Gmail classique + un "mot de passe d'application".

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendVerificationEmail(to: string, code: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn(`[mailer] GMAIL_USER/GMAIL_APP_PASSWORD manquant — code pour ${to}: ${code}`);
    return;
  }

  await getTransporter().sendMail({
    from: `Discord Bot Manager <${user}>`,
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
  });
}
