"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReservationStatus } from "@/lib/types";

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["requested", "confirmed", "cancelled"]),
});

export async function updateReservationStatus(formData: FormData) {
  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  await supabase
    .from("reservations")
    .update({ status: parsed.data.status as ReservationStatus })
    .eq("id", parsed.data.id);

  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
}
