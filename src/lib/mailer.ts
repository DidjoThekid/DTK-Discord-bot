import emailjs from "@emailjs/nodejs";

export async function sendVerificationEmail(
  email: string,
  code: string
) {
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
}
