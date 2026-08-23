import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  return data;
}