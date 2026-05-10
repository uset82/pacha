import type { Metadata } from "next";
import { ReservationForm } from "@/components/public/reservation-form";
import { siteDetails } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Table",
  description: "Request a reservation at Pasha International Food & Bar in Bergen.",
};

export default function BookPage() {
  return (
    <section className="bg-[linear-gradient(135deg,#070706_0%,#10231c_100%)] pb-20 pt-36 md:pt-44">
      <div className="site-shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="sticky top-28">
          <p className="eyebrow mb-4">Reservations</p>
          <h1 className="section-title">Book a table at Pasha.</h1>
          <p className="mt-6 text-lg leading-8 text-mist">
            Send a request for your preferred date and time. The team will confirm by phone or email.
          </p>
          <div className="mt-8 border-l border-brass/40 pl-5 text-sm leading-7 text-mist">
            <p>{siteDetails.location}</p>
            <p>
              <a href={siteDetails.phoneHref} className="transition hover:text-brass">
                {siteDetails.phone}
              </a>
            </p>
          </div>
        </div>
        <ReservationForm />
      </div>
    </section>
  );
}
