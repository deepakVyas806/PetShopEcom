"use client";

import { cn } from "@/lib/utils";
import useSignInContainer from "./SignInContainer.hook";
import { IconShield, IconLock, IconPaw } from "@/lib/icons";
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
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-surface">

      {/* Brand */}
      <div className="mb-6 flex justify-center">
        <span className="text-base font-black text-primary tracking-tight">artPetShop</span>
      </div>

      <section className="w-full max-w-sm">
        {/* Card */}
        <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-card-md">

          {/* Tab toggle (hidden on forgot-password) */}
          {view !== "forgot-password" && (
            <div className="flex bg-surface-container rounded-xl p-1 mb-5 gap-1">
              {["login", "signup"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border-none",
                    view === v
                      ? "bg-surface-container-lowest shadow-card-sm text-on-surface"
                      : "bg-transparent text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {v === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-on-surface tracking-tight">{title}</h2>
            <p className="text-xs text-on-surface-variant mt-1">{sub}</p>
          </div>

          {/* Social buttons (login + signup only) */}
          {view !== "forgot-password" && <SocialButtons />}

          {/* Form area */}
          {view === "login"            && <LoginForm  onForgot={() => setView("forgot-password")} onSignup={() => setView("signup")} />}
          {view === "signup"           && <SignupForm onLogin={() => setView("login")} />}
          {view === "forgot-password"  && <ForgotForm onBack={() => setView("login")} />}
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex justify-center gap-5">
          {[
            { Icon: IconShield, label: "SSL Secure"  },
            { Icon: IconLock,   label: "Encrypted"   },
            { Icon: IconPaw,    label: "Pet-First"   },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-on-surface-variant/60">
              <Icon size={13} weight="regular" />
              <span className="text-[10px] font-medium">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-on-surface-variant/40">© 2024 artPetShop. All rights reserved.</p>
      </section>
    </div>
  );
}
