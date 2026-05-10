import type { Metadata } from "next";
import { ReservationStatusForm } from "@/components/admin/reservation-status-form";
import { formatReservationDate } from "@/lib/format";
import { getReservations } from "@/lib/data/reservations";

export const metadata: Metadata = {
  title: "Admin Reservations",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminReservationsPage() {
  const reservations = await getReservations();

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Reservations</p>
        <h1 className="font-display text-5xl font-semibold text-ivory">Booking requests.</h1>
        <p className="mt-4 max-w-2xl text-mist">
          Public booking submissions start as requested. Confirm or cancel after contacting the guest.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="admin-panel text-mist">No reservation requests yet.</div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="admin-panel grid gap-5 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-3xl font-semibold text-ivory">{reservation.name}</h2>
                  <span className="status-pill border-brass/50 text-brass">{reservation.status}</span>
                </div>
                <p className="mt-3 text-mist">
                  {formatReservationDate(reservation.reservation_date)} at {reservation.reservation_time.slice(0, 5)} · {reservation.party_size} guests
                </p>
                <p className="mt-2 text-sm text-mist">
                  {reservation.email} · {reservation.phone}
                </p>
                {reservation.message && <p className="mt-4 text-sm leading-6 text-mist">{reservation.message}</p>}
              </div>
              <ReservationStatusForm reservation={reservation} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
