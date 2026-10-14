import { cookies } from "next/headers";
import { connection } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "portfolio_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

export type Session = {
  email: string;
};

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getSession(): Promise<Session | null> {
  // JWT expiry checks depend on the current time and must run per request.
  // Keep this outside the catch so rendering signals can reach Next.js.
  await connection();
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    return token ? verifySessionToken(token) : null;
  } catch {
    return null;
  }
}

export async function verifySessionToken(
  token: string,
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const email =
      typeof payload.email === "string"
        ? payload.email
        : typeof payload.sub === "string"
          ? payload.sub
          : null;

    return email ? { email } : null;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export { SESSION_COOKIE };
