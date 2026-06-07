"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconPaw } from "@/lib/icons";
import GeneralInfoCard     from "./Components/GeneralInfoCard";
import ServiceSettingsCard from "./Components/ServiceSettingsCard";
import AvailabilityCard    from "./Components/AvailabilityCard";
import MediaGalleryCard    from "./Components/MediaGalleryCard";
import ServiceStatusCard   from "./Components/ServiceStatusCard";

const EMPTY_FORM = {
  name:           "",
  category:       "Spa",
  targetPets:     "Dogs",
  description:    "",
  duration:       "60 min",
  priceRaw:       "",
  capacity:       1,
  images:         ["", "", "", ""],
  operatingHours: [
    { id: 1, day: "Monday",    start: "09:00", end: "17:00" },
    { id: 2, day: "Wednesday", start: "09:00", end: "17:00" },
  ],
  active:     true,
  visibility: "public",
  tags:       [],
};

function serviceToForm(s) {
  return {
    name:           s.name           ?? "",
    category:       s.category       ?? "Spa",
    targetPets:     s.targetPets     ?? "Dogs",
    description:    s.description    ?? "",
    duration:       s.duration       ?? "60 min",
    priceRaw:       s.priceRaw       ?? "",
    capacity:       s.capacity       ?? 1,
    images:         Array.isArray(s.images) ? [...s.images] : ["", "", "", ""],
    operatingHours: Array.isArray(s.operatingHours) ? s.operatingHours.map((h) => ({ ...h })) : [],
    active:         s.active         ?? true,
    visibility:     s.visibility     ?? "public",
    tags:           Array.isArray(s.tags) ? [...s.tags] : [],
  };
}

export default function CreateServiceContainer({ service }) {
  const isEdit = Boolean(service?.id);
  const router = useRouter();

  const [form, setForm] = useState(() =>
    service
      ? serviceToForm(service)
      : { ...EMPTY_FORM, operatingHours: EMPTY_FORM.operatingHours.map((h) => ({ ...h })) }
  );

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAction = useCallback(() => {
    router.push("/admin/services");
  }, [router]);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/services")}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer flex-shrink-0"
          >
            <IconArrowLeft size={18} weight="bold" />
          </button>
          <div>
            <p className="text-[10px] text-on-surface-variant">
              Admin &rsaquo; Services &rsaquo;{" "}
              <span className="font-semibold">{isEdit ? "Edit" : "New Service"}</span>
            </p>
            <h1 className="text-sm font-bold text-on-surface leading-tight">
              {isEdit ? `Editing: ${service.name}` : "Add New Service"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleAction}
            className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-xs font-semibold hover:bg-surface-container-low transition-all cursor-pointer"
          >
            {isEdit ? "Discard Changes" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={handleAction}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <IconCheck size={14} weight="bold" />
            {isEdit ? "Save Changes" : "Publish Service"}
          </button>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: main fields */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <GeneralInfoCard     form={form} setField={setField} />
          <ServiceSettingsCard form={form} setField={setField} />
          <AvailabilityCard    form={form} setField={setField} />
        </div>

        {/* Right: media + status */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <MediaGalleryCard   form={form} setField={setField} />
          <ServiceStatusCard  form={form} setField={setField} />

          {/* Pro tip */}
          <div className="p-4 bg-secondary-container/40 border border-secondary-fixed rounded-2xl">
            <div className="flex gap-3">
              <IconPaw
                size={16}
                className="text-primary flex-shrink-0 mt-0.5"
                weight="duotone"
              />
              <div>
                <p className="text-xs font-bold text-primary mb-0.5">Pro Tip</p>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Include clear photos of the service environment and staff. Services with 3+ images
                  receive 40% more bookings on average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
