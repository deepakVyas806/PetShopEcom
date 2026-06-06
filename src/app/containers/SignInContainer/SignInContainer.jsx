"use client";

import { cn } from "@/lib/utils";
import useSignInContainer from "./SignInContainer.hook";
import { IconShield, IconLock, IconPaw } from "@/lib/icons";
import LeftPanel     from "./Components/LeftPanel";
import SocialButtons from "./Components/SocialButtons";
import LoginForm     from "./Components/LoginForm";
import SignupForm    from "./Components/SignupForm";
import ForgotForm    from "./Components/ForgotForm";

const HEADINGS = {
  login:            { title: "Welcome back",              sub: "Sign in to manage your pet's needs"    },
  signup:           { title: "Join artPetShop",           sub: "Give your pet the care they deserve"   },
  "forgot-password":{ title: "Reset your password",       sub: "We'll send a reset link to your email" },
};

export default function SignInContainer() {
  const { view, setView } = useSignInContainer();
  const { title, sub } = HEADINGS[view] ?? HEADINGS.login;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LeftPanel />

      {/* Right: scrollable form panel */}
      <section className="flex-1 flex flex-col items-center justify-start md:justify-center py-8 px-4 md:px-10 bg-surface overflow-y-auto">

        {/* Mobile brand */}
        <div className="md:hidden w-full max-w-sm mb-5 flex justify-center">
          <span className="text-sm font-black text-primary tracking-tight">artPetShop</span>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm rounded-2xl p-6 shadow-sm"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(204,195,216,0.5)",
          }}
        >
          {/* Tab toggle (hidden on forgot-password) */}
          {view !== "forgot-password" && (
            <div className="flex bg-surface-container rounded-lg p-0.5 mb-4">
              {["login", "signup"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "flex-1 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer border-none",
                    view === v
                      ? "bg-surface shadow-sm text-on-surface"
                      : "bg-transparent text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {v === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {/* Heading */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-on-surface">{title}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
          </div>

          {/* Social buttons (login + signup only) */}
          {view !== "forgot-password" && <SocialButtons />}

          {/* Form area */}
          {view === "login"            && <LoginForm  onForgot={() => setView("forgot-password")} onSignup={() => setView("signup")} />}
          {view === "signup"           && <SignupForm onLogin={() => setView("login")} />}
          {view === "forgot-password"  && <ForgotForm onBack={() => setView("login")} />}
        </div>

        {/* Trust strip */}
        <div className="mt-5 flex justify-center gap-6 opacity-50">
          {[
            { Icon: IconShield, label: "Secure"    },
            { Icon: IconLock,   label: "Encrypted" },
            { Icon: IconPaw,    label: "Pet-First" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <Icon size={16} className="text-on-surface-variant" weight="regular" />
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-on-surface-variant/60">© 2024 artPetShop. All rights reserved.</p>
      </section>
    </div>
  );
}
