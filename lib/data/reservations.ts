import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Reservation } from "@/lib/types";

export async function getReservations() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [] as Reservation[];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true });

  if (error) {
    console.error("Failed to load reservations", error.message);
    return [] as Reservation[];
  }

  return (data || []) as Reservation[];
}
