"use server";

import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePlatformAdmin } from "./auth";
import { revalidatePath } from "next/cache";

export async function approveMandal(id: string) {
  await requirePlatformAdmin();
  await db.update(mandals).set({ status: "approved" }).where(eq(mandals.id, id));
  revalidatePath("/admin");
}

export async function rejectMandal(id: string) {
  await requirePlatformAdmin();
  await db.update(mandals).set({ status: "suspended" }).where(eq(mandals.id, id));
  revalidatePath("/admin");
}

export async function unapproveMandal(id: string) {
  await requirePlatformAdmin();
  await db.update(mandals).set({ status: "pending" }).where(eq(mandals.id, id));
  revalidatePath("/admin");
}

export async function deleteMandal(id: string) {
  await requirePlatformAdmin();
  await db.delete(mandals).where(eq(mandals.id, id));
  revalidatePath("/admin");
}