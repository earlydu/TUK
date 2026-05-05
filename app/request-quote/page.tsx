import { Suspense } from "react";
import RequestQuoteForm from "./RequestQuoteForm";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-600">Loading quote form...</p>
        </div>
      }
    >
      <RequestQuoteForm />
    </Suspense>
  );
}
