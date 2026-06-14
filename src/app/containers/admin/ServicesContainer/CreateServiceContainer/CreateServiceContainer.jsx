"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { IconArrowLeft, IconCheck, IconPaw } from "@/lib/icons";
import { Sk } from "@/components/ui";
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

/** Map a backend service document → form state */
function serviceToForm(s) {
  const imgs = Array.isArray(s.images) && s.images.length
    ? [...s.images, "", "", ""].slice(0, 4)
    : [s.image ?? "", "", "", ""];

  return {
    name:           s.name           ?? "",
    category:       s.category       ?? "Spa",
    targetPets:     s.targetPets     ?? "Dogs",
    description:    s.description    ?? "",
    duration:       s.duration       ?? "60 min",
    priceRaw:       s.price != null  ? String(s.price) : (s.priceRaw ?? ""),
    capacity:       s.capacity       ?? 1,
    images:         imgs,
    operatingHours: Array.isArray(s.operatingHours)
      ? s.operatingHours.map((h, i) => ({ id: i + 1, day: h.day ?? "", start: h.start ?? "09:00", end: h.end ?? "17:00" }))
      : [],
    active:         s.active     ?? true,
    visibility:     s.visibility ?? "public",
    tags:           Array.isArray(s.tags) ? [...s.tags] : [],
  };
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <Sk w="w-9"  h="h-9"  rounded="rounded-xl" />
          <div className="space-y-1.5">
            <Sk w="w-48" h="h-3" rounded="rounded-lg" />
            <Sk w="w-32" h="h-4" rounded="rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2">
          <Sk w="w-28" h="h-9" rounded="rounded-xl" />
          <Sk w="w-32" h="h-9" rounded="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Sk key={i} w="w-full" h="h-44" rounded="rounded-2xl" />
          ))}
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Sk w="w-full" h="h-48" rounded="rounded-2xl" />
          <Sk w="w-full" h="h-36" rounded="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** @param {{ editId?: string }} props */
export default function CreateServiceContainer({ editId = undefined }) {
  const isEdit = Boolean(editId);
  const router = useRouter();

  const [form,     setFormState] = useState(() => ({
    ...EMPTY_FORM,
    operatingHours: EMPTY_FORM.operatingHours.map((h) => ({ ...h })),
  }));
  const [editName, setEditName]  = useState("");
  const [fetching, setFetching]  = useState(isEdit);
  const [done,     setDone]      = useState(false);
  const [error,    setError]     = useState("");
  const [notFound, setNotFound]  = useState(false);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      setFetching(true);
      try {
        const data = await api.get(`/admin/services/${editId}`);
        if (cancelled) return;
        const s = data.service ?? data;
        setFormState(serviceToForm(s));
        setEditName(s.name ?? "");
      } catch (e) {
        if (cancelled) return;
        if (e?.message?.includes("404") || e?.statusCode === 404) setNotFound(true);
        else setError(e?.message ?? "Failed to load service.");
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const setField = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAction = useCallback(async () => {
    setError("");
    try {
      const payload = {
        name:           form.name,
        category:       form.category,
        targetPets:     form.targetPets,
        description:    form.description,
        duration:       form.duration,
        priceRaw:       form.priceRaw,
        capacity:       form.capacity,
        images:         form.images,
        operatingHours: form.operatingHours,
        active:         form.active,
        visibility:     form.visibility,
        tags:           form.tags,
      };
      if (isEdit) {
        await api.put(`/admin/services/${editId}`, payload);
      } else {
        await api.post("/admin/services", payload);
      }
      setDone(true);
      setTimeout(() => router.push("/admin/services"), 1200);
    } catch (e) {
      setError(e?.message ?? "Failed to save service.");
    }
  }, [form, isEdit, editId, router]);

  if (fetching) return <FormSkeleton />;

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-sm font-bold text-on-surface">Service not found</p>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="text-xs text-primary font-semibold hover:underline cursor-pointer"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
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
              {isEdit ? `Editing: ${editName}` : "Add New Service"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => router.push("/admin/services")}
            className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-xs font-semibold hover:bg-surface-container-low transition-all cursor-pointer"
          >
            {isEdit ? "Discard Changes" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={done}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-80"
          >
            <IconCheck size={14} weight="bold" />
            {done ? (isEdit ? "Saved!" : "Published!") : isEdit ? "Save Changes" : "Publish Service"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
          {error}
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <GeneralInfoCard     form={form} setField={setField} />
          <ServiceSettingsCard form={form} setField={setField} />
          <AvailabilityCard    form={form} setField={setField} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-5">
          <MediaGalleryCard  form={form} setField={setField} />
          <ServiceStatusCard form={form} setField={setField} />

          <div className="p-4 bg-secondary-container/40 border border-secondary-fixed rounded-2xl">
            <div className="flex gap-3">
              <IconPaw size={16} className="text-primary flex-shrink-0 mt-0.5" weight="duotone" />
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
