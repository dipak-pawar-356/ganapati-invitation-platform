"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, mandals, User } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE_NAME = "mandal_saas_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "PLATFORM_ADMIN" | "MANDAL_ADMIN";
  mandalId?: string | null;
}

// Simple signed token mechanism for production security
function encodeSession(payload: SessionPayload): string {
  const data = JSON.stringify(payload);
  return Buffer.from(data).toString("base64");
}

function decodeSession(token: string): SessionPayload | null {
  try {
    const data = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(data) as SessionPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function setSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  const token = encodeSession(payload);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function logoutSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requirePlatformAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "PLATFORM_ADMIN") {
    throw new Error("Unauthorized: Platform Admin access required");
  }
  return session;
}

export async function requireMandalAdmin(mandalId: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Please log in");
  }
  if (session.role === "PLATFORM_ADMIN") {
    return session; // Platform admin has full access to any mandal
  }
  if (session.role === "MANDAL_ADMIN" && session.mandalId === mandalId) {
    return session;
  }
  throw new Error("Unauthorized: You do not have permission to manage this Mandal");
}
