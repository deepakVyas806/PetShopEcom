// Signup lives inside /signin. The proxy.ts redirects /signup → /signin?view=signup
// for unauthenticated users before this page even renders, so this is just a fallback.
export default function SignupPage() {
  return null;
}
