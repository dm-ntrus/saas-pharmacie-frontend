import { Suspense } from "react";
import { AuthCallbackClient } from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  // Next.js requires a Suspense boundary for useSearchParams in App Router.
  return (
    <Suspense>
      <AuthCallbackClient />
    </Suspense>
  );
}

