import { Suspense } from "react";
import BookAppointmentContainer from "@/app/containers/BookAppointmentContainer/BookAppointmentContainer";

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant text-sm font-medium">
        Loading...
      </div>
    }>
      <BookAppointmentContainer />
    </Suspense>
  );
}
