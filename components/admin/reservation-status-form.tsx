import { updateReservationStatus } from "@/lib/actions/admin-reservation-actions";
import type { Reservation, ReservationStatus } from "@/lib/types";

const statuses: ReservationStatus[] = ["requested", "confirmed", "cancelled"];

export function ReservationStatusForm({ reservation }: { reservation: Reservation }) {
  return (
    <form action={updateReservationStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={reservation.id} />
      <select className="field py-2" name="status" defaultValue={reservation.status} aria-label="Reservation status">
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button className="focus-ring rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ivory">
        Save
      </button>
    </form>
  );
}
