"use server";

import { cookies } from "next/headers";

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Galat password" };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return { error: null };
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}
