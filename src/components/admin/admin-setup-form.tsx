"use client";

import { FormEvent, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/auth-client";
import { bootstrapCurrentUserAsAdmin } from "@/lib/auth/bootstrap-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminSetupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const signup = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (signup.error) {
        setError(signup.error.message ?? "Unable to create administrator.");
        return;
      }

      const admin = await bootstrapCurrentUserAsAdmin(secret);

      if (!admin) {
        setError("Administrator setup failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Administrator setup failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="admin-name" className="text-sm font-medium">
          Administrator name
        </label>

        <Input
          id="admin-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="setup-email" className="text-sm font-medium">
          Administrator email
        </label>

        <Input
          id="setup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="setup-password" className="text-sm font-medium">
          Password
        </label>

        <Input
          id="setup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bootstrap-secret" className="text-sm font-medium">
          Bootstrap secret
        </label>

        <Input
          id="bootstrap-secret"
          type="password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          placeholder="Enter your setup secret"
          autoComplete="off"
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
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating administrator...
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" />
            Create administrator
          </>
        )}
      </Button>
    </form>
  );
}