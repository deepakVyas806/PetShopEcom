import React from "react";
import { Sparkles } from "lucide-react";

interface ConciergeModalProps {
  product: any;
  onClose: () => void;
}

export default function ConciergeModal({ product, onClose }: ConciergeModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-brand-card border border-brand-foreground/10 p-8 shadow-2xl text-left animate-slide-up">
        <h3 className="text-2xl font-black text-brand-foreground mb-2">Exclusive Concierge Booking</h3>
        <p className="text-sm text-brand-foreground/60 mb-6">
          You are requesting priority procurement for: <strong>{product.name}</strong> (₹{product.price.toLocaleString("en-IN")})
        </p>

        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-start gap-4 mb-6">
          <Sparkles className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-brand-foreground">VIP Priority Delivery Included</h4>
            <p className="text-xs text-brand-foreground/60 mt-0.5">
              A dedicated concierge agent will contact you in under 5 minutes to verify custom size fittings or dietary adjustments, scheduling delivery straight to your location.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-extrabold text-brand-foreground/75 uppercase tracking-wider">Your Full Name</span>
            <input 
              type="text" 
              placeholder="e.g. Lady Genevieve" 
              className="px-4 py-3 rounded-xl border border-brand-foreground/15 bg-brand-card text-brand-foreground focus:border-brand-primary focus:outline-none text-sm w-full"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-extrabold text-brand-foreground/75 uppercase tracking-wider">Contact Phone / Email</span>
            <input 
              type="text" 
              placeholder="concierge-client@example.com" 
              className="px-4 py-3 rounded-xl border border-brand-foreground/15 bg-brand-card text-brand-foreground focus:border-brand-primary focus:outline-none text-sm w-full"
            />
          </label>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-brand-foreground/10 text-brand-foreground hover:bg-brand-foreground/5 font-bold transition cursor-pointer text-center"
          >
            Go Back
          </button>
          <button 
            onClick={() => {
              alert(`🐾 Concierge requested for ${product.name}! An agent will contact you shortly.`);
              onClose();
            }}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold transition shadow-lg shadow-brand-primary/20 hover:scale-[1.02] cursor-pointer text-center"
          >
            Confirm Priority Request
          </button>
        </div>
      </div>
    </div>
  );
}
