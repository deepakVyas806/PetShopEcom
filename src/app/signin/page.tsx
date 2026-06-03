import { Suspense } from "react";
import SignInContainer from "@/app/containers/SignInContainer/SignInContainer";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <SignInContainer />
    </Suspense>
  );
}
