"use client";

import { useState } from "react";
import { IconSend, IconCheckCircle, IconPaw, IconInstagram, IconCamera, IconVideo } from "@/lib/icons";

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <section className="py-8 px-4 md:px-6 max-w-container-max mx-auto">
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f9f5ff 0%, #ede9fe 50%, #ddd6fe 100%)" }}
      >
        <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center gap-8">

          {/* Left: copy */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            {/* Social proof */}
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <div className="flex -space-x-2">
                {["🐕", "🐱", "🐠"].map((em, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-xs">
                    {em}
                  </div>
                ))}
              </div>
              <span className="text-xs text-purple-700 font-semibold">50,000+ happy pet parents</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
              Join the artPet<br />
              <span className="text-primary">Community</span>
            </h2>
            <p className="text-xs text-gray-600 mt-2 max-w-xs md:max-w-none leading-relaxed">
              Get weekly pet care tips, exclusive deals, new arrival alerts, and vet Q&amp;A straight to your inbox.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center md:justify-start">
              {["Weekly deals", "Vet advice", "Free recipes", "No spam"].map((p) => (
                <span key={p} className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                  <IconCheckCircle size={11} weight="fill" className="text-primary" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Right: form + social */}
          <div className="flex-1 w-full md:max-w-sm space-y-4">
            {submitted ? (
              <div className="bg-white/80 rounded-2xl p-6 text-center space-y-2 border border-primary/20">
                <IconPaw size={32} className="text-primary mx-auto" weight="fill" />
                <p className="text-sm font-black text-on-surface">You&apos;re in! 🎉</p>
                <p className="text-xs text-on-surface-variant">Check your inbox for a welcome gift.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/50"
                />
                <button
                  type="submit"
                  className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer shadow-md shadow-primary/20"
                >
                  <IconSend size={14} weight="bold" />
                  Subscribe
                </button>
              </form>
            )}

            {/* Social links */}
            <div className="flex items-center gap-3 justify-center md:justify-start pt-1">
              <span className="text-[10px] text-gray-500 font-medium">Follow us:</span>
              {[
                { Icon: IconInstagram, label: "Instagram", color: "text-pink-600 hover:bg-pink-50" },
                { Icon: IconCamera,    label: "YouTube",   color: "text-red-500 hover:bg-red-50"   },
                { Icon: IconVideo,     label: "Reels",     color: "text-purple-600 hover:bg-purple-50" },
              ].map(({ Icon, label, color }) => (
                <button
                  key={label}
                  title={label}
                  className={`w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${color}`}
                >
                  <Icon size={15} weight="regular" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
