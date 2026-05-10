"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const reservationSchema = z.object({
  reservation_date: z.string().min(1, "Choose a date."),
  reservation_time: z.string().min(1, "Choose a time."),
  party_size: z.coerce.number().int().min(1, "Party size must be at least 1.").max(20, "Call us for parties over 20."),
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(5, "Enter a phone number."),
  message: z.string().trim().max(500).optional(),
});

export async function createReservation(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = reservationSchema.safeParse({
    reservation_date: formData.get("reservation_date"),
    reservation_time: formData.get("reservation_time"),
    party_size: formData.get("party_size"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Check the reservation details." };
  }

  const requestedDate = new Date(`${parsed.data.reservation_date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(requestedDate.getTime()) || requestedDate < today) {
    return { ok: false, message: "Choose today or a future date." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Booking storage is not configured yet. Add Supabase credentials to save reservations.",
    };
  }

  const { error } = await supabase.from("reservations").insert({
    ...parsed.data,
    message: parsed.data.message || null,
    status: "requested",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/reservations");
  return { ok: true, message: "Reservation requested. Pacha will confirm your table soon." };
}
