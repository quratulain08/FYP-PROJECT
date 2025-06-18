import { Suspense } from "react";
import FacultyFormClient from "./FacultyFormClient";

export default function FacultyFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <FacultyFormClient />
    </Suspense>
  );
}
