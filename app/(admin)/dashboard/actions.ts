"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRecent } from "@/lib/analytics-queries";
import type { RecentRow } from "@/lib/analytics-types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

/** Últimos eventos — usado pelo polling da seção "Ao vivo". */
export async function getRecentEvents(limit = 40): Promise<RecentRow[]> {
  await requireUser();
  return getRecent(limit);
}
