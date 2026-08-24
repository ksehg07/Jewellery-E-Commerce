"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

type Step = "email" | "otp";

export function AccountAuth() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } =
        await authClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "sign-in",
        });

      if (error) {
        setError(error.message || "Unable to send verification code.");
        return;
      }

      setEmail(normalizedEmail);
      setStep("otp");
      setMessage("We've sent a six-digit verification code to your email.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the six-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
        name: name.trim() || undefined,
      });

      if (error) {
        setError(error.message || "Invalid or expired verification code.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Unable to sign you in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted/30">
          <Check className="size-5 text-accent" />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Verify your email
          </p>

          <h2 className="mt-3 font-display text-3xl">
            Enter your verification code.
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We sent a six-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Your name
              <span className="ml-1 text-muted-foreground">
                (optional)
              </span>
            </label>

            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="text-sm font-medium"
            >
              Verification code
            </label>

            <Input
              id="otp"
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                )
              }
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="text-center text-lg tracking-[0.4em]"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          {message ? (
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setStep("email");
            setOtp("");
            setError("");
            setMessage("");
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted/30">
        <Mail className="size-5 text-accent" />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Customer account
        </p>

        <h2 className="mt-3 font-display text-3xl">
          Welcome to your account.
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your email and we'll send you a secure verification
          code. No password required.
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email address
          </label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              Continue with email
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-xs leading-5 text-muted-foreground">
        By continuing, you agree to use your email address for
        authentication and account-related communication.
      </p>
    </div>
  );
}