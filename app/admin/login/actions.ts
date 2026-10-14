"use server";

import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession, destroySession, getSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const attempts = new Map<string, { count: number; resetAt: number }>();
// This best-effort limiter is per serverless instance; instances do not share memory.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getClientIp(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.resetAt <= now) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const record = attempts.get(ip);
  if (record) {
    record.count += 1;
  }
}

function emailsMatch(input: string, configured: string): boolean {
  const inputDigest = createHash("sha256")
    .update(input.toLowerCase())
    .digest();
  const configuredDigest = createHash("sha256")
    .update(configured.toLowerCase())
    .digest();

  return timingSafeEqual(inputDigest, configuredDigest);
}

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = getClientIp(await headers());

  if (isRateLimited(ip)) {
    return { error: "Invalid credentials" };
  }

  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (
    !result.success ||
    !adminEmail ||
    !passwordHash ||
    !emailsMatch(result.data.email, adminEmail) ||
    !(await bcrypt.compare(result.success ? result.data.password : "", passwordHash))
  ) {
    recordFailedAttempt(ip);
    return { error: "Invalid credentials" };
  }

  await createSession(adminEmail);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  if (await getSession()) {
    await destroySession();
  }
  redirect("/admin/login");
}
