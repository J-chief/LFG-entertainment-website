'use client';

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full bg-black min-h-screen text-white py-20 px-6 md:px-12 max-w-4xl mx-auto">
      <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-2 uppercase">
        ○ LEGAL DOCUMENTS
      </span>
      <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-12">
        Terms & Conditions
      </h1>

      <div className="text-gray-400 text-xs md:text-sm space-y-6 leading-relaxed font-sans">
        <p className="font-bold text-white uppercase font-display text-[10px] tracking-widest">
          Last Updated: July 10, 2026
        </p>

        <p>
          Welcome to the LFG Entertainment website. By accessing or using our services, ticketing engines, or membership dashboards, you agree to comply with and be bound by the following Terms & Conditions.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          1. Ticket Purchasing & Refunds
        </h3>
        <p>
          All ticket sales made via the LFG Entertainment platform are final. Tickets are strictly non-refundable except in cases of complete event cancellation by the organizers. If an event is cancelled, we will issue a face-value refund of the ticket cost. In the event of rescheduling, your tickets will automatically carry forward to the new dates. Tickets may be transferred to another person up to 48 hours prior to gates opening by updating details via support.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          2. Event Rules & Admission
        </h3>
        <p>
          Entry is subject to verification of a valid QR ticket code at the gate. One scan per ticket. Re-entry is not permitted. All attendees must carry valid government-issued photographic ID to purchase alcoholic beverages at our bars (minimum drinking age is 21+). We reserve the right to refuse entry or remove individuals from the venue for disruptive, harmful, or illegal behavior without compensation or refund.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          3. Limitation of Liability
        </h3>
        <p>
          LFG Entertainment is not liable for personal property lost, stolen, or damaged during our events. By purchasing a pass and entering the festival grounds, you assume all risks associated with live entertainment environments, including exposure to high decibel noise levels, pyrotechnics, strobe effects, and crowds.
        </p>
      </div>
    </div>
  );
}
