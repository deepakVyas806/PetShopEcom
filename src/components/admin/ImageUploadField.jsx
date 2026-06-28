"use client";
import { useState, useRef } from "react";
import { IconUpload, IconClose, IconSpinner } from "@/lib/icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getToken() {
  try { return JSON.parse(localStorage.getItem("petshop_auth") ?? "{}").token ?? null; }
  catch { return null; }
}

function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
}

/**
 * Drop-in image picker with upload-to-server + preview.
 *
 * Props:
 *   value       — current image URL (string)
 *   onChange    — (url: string) => void
 *   context     — upload context: "hero" | "catalog" | "product" | "service" | "offer" | "general"
 *   name        — item name, used for initials fallback
 *   label       — optional field label
 *   shape       — "square" (default) | "wide" — controls preview aspect ratio
 *   objectFit   — "cover" (default) | "contain"
 */
export default function ImageUploadField({
  value,
  onChange,
  context = "general",
  name = "",
  label,
  shape = "square",
  objectFit = "cover",
}) {
  const [uploading, setUploading] = useState(false);
  const [errored,   setErrored]   = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token    = getToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("context", context);

      const res  = await fetch(`${API_BASE}/upload`, {
        method:  "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body:    formData,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? "Upload failed");

      setErrored(false);
      onChange(body.url);
    } catch (e) {
      console.error("Image upload failed:", e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => upload(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => { onChange(""); setErrored(false); };

  const previewCls = shape === "wide"
    ? "w-full h-24 rounded-xl"
    : "w-16 h-16 rounded-xl";

  const fitCls = objectFit === "contain" ? "object-contain p-1.5" : "object-cover";

  return (
    <div>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1.5">
          {label}
        </label>
      )}

      <div
        className={`flex flex-col gap-2 p-3 rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-primary/60 bg-primary/5"
            : "border-outline-variant/40 bg-surface-container-low hover:border-outline-variant/70"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Preview */}
        <div
          className={`${previewCls} bg-surface-container border border-outline-variant/20 overflow-hidden flex items-center justify-center`}
        >
          {value && !errored ? (
            <img
              src={value}
              alt=""
              className={`w-full h-full ${fitCls}`}
              onError={() => setErrored(true)}
            />
          ) : (
            <span className="text-xs font-black text-primary/70 select-none">
              {getInitials(name)}
            </span>
          )}
        </div>

        {/* Hint */}
        <p className="text-[10px] text-on-surface-variant">
          {value && !errored
            ? "Drag a new file or click Change to replace"
            : "Drag an image here, or click Upload"}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-60"
          >
            {uploading
              ? <IconSpinner size={11} className="animate-spin" />
              : <IconUpload size={11} weight="bold" />}
            {uploading ? "Uploading…" : value && !errored ? "Change" : "Upload Image"}
          </button>

          {value && !errored && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 px-3 py-1.5 text-error text-[10px] font-semibold rounded-lg hover:bg-error/8 transition-all cursor-pointer bg-transparent border border-error/25"
            >
              <IconClose size={10} weight="bold" />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleInputChange}
        onClick={(e) => { e.currentTarget.value = ""; }}
      />
    </div>
  );
}
