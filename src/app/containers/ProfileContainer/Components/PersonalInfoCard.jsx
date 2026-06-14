"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IconPhone, IconPaw, IconEdit, IconCancel, IconCheck, IconCamera, IconImage } from "@/lib/icons";
import UserAvatar from "@/components/common/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const PET_OPTIONS   = ["Dogs", "Cats", "Birds", "Fish", "Rabbits", "Reptiles"];
const PRESET_EMOJIS = ["🐾", "🐕", "🐈", "🦜", "🐠", "🐇", "🦎", "🐿️", "🐓", "🦔"];
const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm overflow-hidden";

/** Resize image file to max 240×240 JPEG via canvas — returns base64 data URL */
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const SIZE = 160;
      const canvas = document.createElement("canvas");
      canvas.width  = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      const min = Math.min(img.width, img.height);
      const sx  = (img.width  - min) / 2;
      const sy  = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function AvatarPickerPortal({ anchorRef, current, onChange, onClose }) {
  const [pos,     setPos]     = useState({ top: 0, left: 0, flipUp: false });
  const [mounted, setMounted] = useState(false);
  const pickerRef = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const pickerH = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipUp = spaceBelow < pickerH && rect.top > pickerH;
    setPos({
      top:    flipUp ? rect.top - pickerH - 8 : rect.bottom + 8,
      left:   Math.min(rect.left, window.innerWidth - 280),
      flipUp,
    });
  }, [anchorRef]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      onChange(dataUrl);
      onClose();
    } catch {
      // ignore resize error — file might not be a valid image
    }
  }, [onChange, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 z-[200]" onClick={onClose} />

      <div
        ref={pickerRef}
        className="fixed z-[201] w-72 bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-4 space-y-4"
        style={{ top: pos.top, left: pos.left }}
        onClick={e => e.stopPropagation()}
      >
        {/* Upload from device */}
        <div>
          <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-2">Upload Photo</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer bg-transparent text-xs font-medium text-primary"
          >
            <IconImage size={16} weight="regular" />
            Choose from device / gallery
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Preset emojis */}
        <div>
          <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-2">Quick Pick</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji); onClose(); }}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer border hover:scale-110 active:scale-95 ${
                  current === emoji
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-surface-container-low border-outline-variant/30 hover:border-primary/50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

function Field({ Icon, label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-on-surface-variant leading-none" weight="regular" />
        <span className="text-xs text-on-surface truncate">{value || "—"}</span>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-outline uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
      />
    </div>
  );
}

export default function PersonalInfoCard({ user }) {
  const { updateUser } = useAuth();

  const [editing,        setEditing]        = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState(null);
  const [showAvatarPick, setShowAvatarPick] = useState(false);

  const [name,     setName]     = useState(user?.name     ?? "");
  const [mobile,   setMobile]   = useState(user?.mobile   ?? "");
  const [petPrefs, setPetPrefs] = useState(user?.petPrefs ?? []);
  const [avatar,   setAvatar]   = useState(user?.avatar   ?? "");

  const avatarBtnRef = useRef(null);

  const togglePet = (pet) =>
    setPetPrefs(p => p.includes(pet) ? p.filter(x => x !== pet) : [...p, pet]);

  const handleEdit = () => {
    setName(user?.name     ?? "");
    setMobile(user?.mobile ?? "");
    setPetPrefs(user?.petPrefs ?? []);
    setAvatar(user?.avatar ?? "");
    setError(null);
    setShowAvatarPick(false);
    setEditing(true);
  };

  const handleCancel = () => { setEditing(false); setError(null); setShowAvatarPick(false); };

  const handleSave = async () => {
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setSaving(true);
    setError(null);
    try {
      const trimmedName   = name.trim();
      const trimmedMobile = mobile.trim();
      await api.put("/auth/me", { name: trimmedName, mobile: trimmedMobile, petPrefs, avatar });
      updateUser({ name: trimmedName, mobile: trimmedMobile, petPrefs, avatar });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = editing ? avatar : user?.avatar;

  return (
    <section className={GLASS}>
      {/* Cover */}
      <div className="h-16 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #7c3aed 1px, transparent 0)", backgroundSize: "20px 20px" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="px-4 pb-4 -mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          {/* Avatar + name */}
          <div className="flex items-end gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl border-2 border-white shadow-md overflow-hidden">
                <UserAvatar avatar={displayAvatar} name={user?.name} size="w-16 h-16" textSize="text-2xl" className="rounded-xl" />
              </div>

              {editing && (
                <button
                  ref={avatarBtnRef}
                  type="button"
                  onClick={() => setShowAvatarPick(v => !v)}
                  className="absolute inset-0 rounded-xl bg-black/45 flex items-center justify-center border-none cursor-pointer"
                  title="Change photo"
                >
                  <IconCamera size={18} className="text-white" weight="fill" />
                </button>
              )}
            </div>

            <div className="mb-1">
              <h1 className="text-xs font-bold text-on-surface leading-tight">{user?.name || "User"}</h1>
              <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Action buttons */}
          {!editing ? (
            <button
              onClick={handleEdit}
              className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-md transition-all active:scale-95 border-none cursor-pointer self-start sm:self-auto"
            >
              <IconEdit size={14} className="leading-none" weight="regular" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 self-start sm:self-auto">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer bg-transparent disabled:opacity-50"
              >
                <IconCancel size={14} className="leading-none" weight="regular" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-md transition-all active:scale-95 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IconCheck size={14} className="leading-none" weight="bold" />
                }
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <div className="mt-4 pt-3 border-t border-outline-variant/20 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field Icon={IconPhone} label="Mobile"   value={user?.mobile || "Not set"} />
            <Field Icon={IconPaw}   label="Pet Type" value={user?.petPrefs?.join(" · ") || "Not set"} />
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="mt-4 pt-3 border-t border-outline-variant/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Display Name" value={name}   onChange={setName}   placeholder="Your name" />
              <InputField label="Mobile" type="tel" value={mobile} onChange={setMobile} placeholder="+91 98765 43210" />
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-outline uppercase tracking-wider">Pet Preferences</p>
              <div className="flex flex-wrap gap-2">
                {PET_OPTIONS.map(pet => (
                  <button
                    key={pet}
                    type="button"
                    onClick={() => togglePet(pet)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      petPrefs.includes(pet)
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {pet}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-error flex items-center gap-1.5">
                <IconCancel size={13} weight="fill" />
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Portal-rendered avatar picker — rendered outside card so no clipping */}
      {editing && showAvatarPick && (
        <AvatarPickerPortal
          anchorRef={avatarBtnRef}
          current={avatar}
          onChange={setAvatar}
          onClose={() => setShowAvatarPick(false)}
        />
      )}
    </section>
  );
}
