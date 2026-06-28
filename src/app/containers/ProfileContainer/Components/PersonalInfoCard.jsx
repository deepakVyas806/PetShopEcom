"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IconPhone, IconPaw, IconEdit, IconCancel, IconCheck, IconCamera, IconImage, IconMail, IconShield, IconCalendar } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const PRESET_EMOJIS = ["🐾", "🐕", "🐈", "🦜", "🐠", "🐇", "🦎", "🐿️", "🐓", "🦔"];

function formatMemberSince(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getToken() {
  try {
    const raw = localStorage.getItem("petshop_auth");
    return raw ? (JSON.parse(raw).token ?? null) : null;
  } catch { return null; }
}

async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", "avatar");
  const token = getToken();
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? "Upload failed");
  return body.url;
}

function AvatarPickerPortal({ anchorRef, current, onChange, onClose }) {
  const [pos,         setPos]         = useState({ top: 0, left: 0 });
  const [mounted,     setMounted]     = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const pickerH = 260;
    const flipUp  = window.innerHeight - rect.bottom < pickerH && rect.top > pickerH;
    setPos({
      top:  flipUp ? rect.top - pickerH - 8 : rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 280),
    });
  }, [anchorRef]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadAvatar(file);
      onChange(url);
      onClose();
    } catch (err) {
      setUploadError(err?.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      <div
        className="fixed z-[201] w-72 bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-4 space-y-4"
        style={{ top: pos.top, left: pos.left }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-2">Upload Photo</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer bg-transparent text-xs font-medium text-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading
              ? <><span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Uploading…</>
              : <><IconImage size={16} weight="regular" /> Choose from device / gallery</>
            }
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleFile} />
          {uploadError && (
            <p className="text-[10px] text-error font-medium mt-1.5 leading-snug">{uploadError}</p>
          )}
        </div>
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

export default function PersonalInfoCard({ user }) {
  const { updateUser } = useAuth();

  const [editing,        setEditing]        = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState(null);
  const [showAvatarPick, setShowAvatarPick] = useState(false);
  const [petOptions,     setPetOptions]     = useState([]);

  const [name,     setName]     = useState(user?.name     ?? "");
  const [mobile,   setMobile]   = useState(user?.mobile   ?? "");
  const [petPrefs, setPetPrefs] = useState(user?.petPrefs ?? []);
  const [avatar,   setAvatar]   = useState(user?.avatar   ?? "");

  useEffect(() => {
    api.get("/catalog?type=petType")
      .then(data => setPetOptions((data.items ?? []).map(i => i.name)))
      .catch(() => {});
  }, []);

  const avatarBtnRef = useRef(null);

  const togglePet = (pet) =>
    setPetPrefs(p => p.includes(pet) ? p.filter(x => x !== pet) : [...p, pet]);

  const handleEdit = () => {
    setName(user?.name ?? "");
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
    setSaving(true); setError(null);
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
  const isAdmin       = user?.role === "admin";

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-card-sm">

      {/* Cover banner */}
      <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #7c3aed 1px, transparent 0)", backgroundSize: "18px 18px" }}
        />
        {/* Edit / Save / Cancel buttons live in the cover row */}
        <div className="absolute top-3 right-3 flex gap-2">
          {!editing ? (
            <button
              onClick={handleEdit}
              className="bg-white/80 backdrop-blur-sm text-on-surface px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white transition-all active:scale-95 border border-outline-variant/30 cursor-pointer shadow-sm"
            >
              <IconEdit size={13} weight="regular" /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="bg-white/80 backdrop-blur-sm text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white transition-all active:scale-95 border border-outline-variant/30 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <IconCancel size={13} weight="regular" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all active:scale-95 border-none cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {saving
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IconCheck size={13} weight="bold" />
                }
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body — pulls avatar up into cover */}
      <div className="px-5 pb-5 -mt-10">

        {/* Avatar row */}
        <div className="flex items-end gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl border-[3px] border-surface shadow-md overflow-hidden bg-primary/10 flex items-center justify-center">
              {displayAvatar && (displayAvatar.startsWith("/") || displayAvatar.startsWith("http")) ? (
                <img src={displayAvatar} alt={user?.name ?? "Avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-3xl leading-none select-none">
                  {displayAvatar || user?.name?.[0]?.toUpperCase() || "👤"}
                </span>
              )}
            </div>
            {editing && (
              <button
                ref={avatarBtnRef}
                type="button"
                onClick={() => setShowAvatarPick(v => !v)}
                className="absolute inset-0 rounded-2xl bg-black/45 flex items-center justify-center border-none cursor-pointer"
                title="Change photo"
              >
                <IconCamera size={20} className="text-white" weight="fill" />
              </button>
            )}
          </div>

          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-extrabold text-on-surface leading-tight">{user?.name || "User"}</h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[9px] font-black uppercase tracking-wide border border-error/20">
                  <IconShield size={9} weight="fill" /> Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-[10px] text-on-surface-variant/70 mt-0.5 flex items-center gap-1">
                <IconCalendar size={10} weight="regular" />
                Member since {formatMemberSince(user.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* View mode — info grid */}
        {!editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/15">
            {/* Email */}
            <div className="flex items-start gap-2.5 p-3 bg-surface-container rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconMail size={13} className="text-primary" weight="regular" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-xs text-on-surface truncate">{user?.email || "—"}</p>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex items-start gap-2.5 p-3 bg-surface-container rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconPhone size={13} className="text-primary" weight="regular" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-0.5">Mobile</p>
                <p className="text-xs text-on-surface">{user?.mobile || <span className="text-on-surface-variant/60 italic">Not set</span>}</p>
              </div>
            </div>

            {/* Pet preferences */}
            {(user?.petPrefs?.length > 0) && (
              <div className="flex items-start gap-2.5 p-3 bg-surface-container rounded-xl sm:col-span-2 lg:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconPaw size={13} className="text-primary" weight="regular" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1.5">Pet Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {user.petPrefs.map(p => (
                      <span key={p} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/15">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-outline uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-outline uppercase tracking-wider">Mobile</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Pet preferences — only shown when catalog has pet types */}
            {petOptions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-outline uppercase tracking-wider">Pet Preferences</p>
              <div className="flex flex-wrap gap-2">
                {petOptions.map(pet => (
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
            )}

            {error && (
              <p className="text-xs text-error flex items-center gap-1.5">
                <IconCancel size={13} weight="fill" /> {error}
              </p>
            )}
          </div>
        )}
      </div>

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
