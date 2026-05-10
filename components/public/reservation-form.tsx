"use client";

import { useActionState } from "react";
import { CalendarDays, Users } from "lucide-react";
import { createReservation } from "@/lib/actions/reservation-actions";
import { reservationTimes } from "@/lib/site";
import { ActionMessage } from "@/components/ui/action-message";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { ok: false, message: "" };

export function ReservationForm() {
  const [state, formAction] = useActionState(createReservation, initialState);

  return (
    <form action={formAction} className="admin-panel space-y-5 bg-charcoal/90">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="label inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-brass" />
            Date
          </span>
          <input className="field" name="reservation_date" type="date" required />
        </label>
        <label className="space-y-2">
          <span className="label">Time</span>
          <select className="field" name="reservation_time" required defaultValue="">
            <option value="" disabled>
              Choose time
            </option>
            {reservationTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="label inline-flex items-center gap-2">
          <Users className="size-4 text-brass" />
          Party size
        </span>
        <input className="field" name="party_size" type="number" min={1} max={20} defaultValue={2} required />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Name</span>
          <input className="field" name="name" autoComplete="name" required />
        </label>
        <label className="space-y-2">
          <span className="label">Phone</span>
          <input className="field" name="phone" autoComplete="tel" required />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="label">Email</span>
        <input className="field" name="email" type="email" autoComplete="email" required />
      </label>

      <label className="space-y-2 block">
        <span className="label">Message</span>
        <textarea className="field min-h-28 resize-y" name="message" placeholder="Allergies, occasion, or timing notes" />
      </label>

      <ActionMessage state={state} />
      <SubmitButton pendingText="Sending request...">Request reservation</SubmitButton>
    </form>
  );
}
