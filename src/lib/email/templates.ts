type OtpType =
  | "sign-in"
  | "change-email"
  | "email-verification"
  | "forget-password";

export function otpEmailTemplate({
  otp,
  type,
}: {
  otp: string;
  type: OtpType;
}) {
  const title =
    type === "sign-in"
      ? "Your login code"
      : type === "email-verification"
        ? "Verify your email"
        : type === "change-email"
          ? "Confirm your new email"
          : "Your password reset code";

  return {
    subject: `${title} | Parth Jewellers`,

    text: `Your verification code is ${otp}. This code expires in 5 minutes. If you did not request this code, you can safely ignore this email.`,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;padding:40px;border-radius:12px;">
            <h2 style="margin-top:0;">${title}</h2>

            <p>Your one-time verification code is:</p>

            <div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:30px 0;">
              ${otp}
            </div>

            <p style="color:#666;">
              This code expires in 5 minutes.
            </p>

            <p style="color:#666;">
              If you did not request this code, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />

            <p style="font-size:12px;color:#999;">
              Parth Jewellers
            </p>
          </div>
        </body>
      </html>
    `,
  };
}