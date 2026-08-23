import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import { prisma } from "@/lib/prisma/client";
import { sendEmail } from "@/lib/email/send-email";
import { otpEmailTemplate } from "@/lib/email/templates";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    modelName: "User",

    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },

      lastName: {
        type: "string",
        required: false,
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        input: true,
      },

      phoneVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },

      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },

      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        input: false,
      },
    },
  },

  rateLimit: {
    enabled: true,
    storage: "memory",

    customRules: {
      "/email-otp/send-verification-otp": {
        window: 60,
        max: 3,
      },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,

      async sendVerificationOTP({ email, otp, type }) {
        const template = otpEmailTemplate({
          otp,
          type,
        });

        await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      },
    }),
  ],
});