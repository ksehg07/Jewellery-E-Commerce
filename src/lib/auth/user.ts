import "server-only";

import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}