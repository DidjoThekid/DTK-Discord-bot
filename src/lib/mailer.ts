import emailjs from "@emailjs/nodejs";

export async function sendVerificationEmail(
  email: string,
  code: string
) {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        email: email,
        code: code,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    console.log(`Code de vérification envoyé à ${email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi EmailJS :", error);
    throw error;
  }
}
