"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const supabase = createClient();

  const [instituteName, setInstituteName] = useState(settings.institute_name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(settings.logo_url ?? "");
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [address, setAddress] = useState(settings.address ?? "");
  const [instagram, setInstagram] = useState(settings.instagram_url ?? "");
  const [facebook, setFacebook] = useState(settings.facebook_url ?? "");
  const [tiktok, setTiktok] = useState(settings.tiktok_url ?? "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function uploadLogoIfNeeded(): Promise<string | null> {
    if (!logoFile) return logoUrl || null;

    const fileExt = logoFile.name.split(".").pop();
    const filePath = `logo-${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("catalogue-images")
      .upload(filePath, logoFile, { upsert: false });

    if (uploadError) {
      setError("Logo upload failed. Please try a different image.");
      return null;
    }

    const { data } = supabase.storage.from("catalogue-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const uploadedLogoUrl = await uploadLogoIfNeeded();
    if (logoFile && !uploadedLogoUrl) {
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("site_settings")
      .update({
        institute_name: instituteName.trim(),
        tagline: tagline.trim(),
        logo_url: uploadedLogoUrl,
        phone: phone.trim(),
        whatsapp_number: whatsappNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        instagram_url: instagram.trim(),
        facebook_url: facebook.trim(),
        tiktok_url: tiktok.trim(),
      })
      .eq("id", 1);

    setSaving(false);

    if (saveError) {
      setError("Could not save settings. Please try again.");
      return;
    }

    setMessage("Settings saved.");
    router.refresh();
  }

  const inputClasses =
    "focus-ring w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-stone";

  return (
    <form onSubmit={handleSubmit} className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Institute name</label>
        <input
          className={inputClasses}
          value={instituteName}
          onChange={(event) => setInstituteName(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Homepage tagline</label>
        <input
          className={inputClasses}
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm text-stone-light">Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-white/10">
            {logoPreview ? (
              <Image src={logoPreview} alt="Logo preview" fill sizes="64px" className="object-contain" />
            ) : null}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="text-sm text-stone-light file:mr-4 file:rounded-sm file:border-0 file:bg-wine file:px-4 file:py-2 file:text-sm file:text-ivory hover:file:bg-wine-dark"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Phone number</label>
        <input
          className={inputClasses}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+234 000 000 0000"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">WhatsApp number</label>
        <input
          className={inputClasses}
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="+234 000 000 0000"
        />
        <p className="text-xs text-stone">
          Used for every Enroll Now / Order Now button. Include the country code.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Email</label>
        <input
          type="email"
          className={inputClasses}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="hello@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Address / location</label>
        <input
          className={inputClasses}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="City, State, Country"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Instagram URL</label>
        <input
          className={inputClasses}
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
          placeholder="https://instagram.com/..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Facebook URL</label>
        <input
          className={inputClasses}
          value={facebook}
          onChange={(event) => setFacebook(event.target.value)}
          placeholder="https://facebook.com/..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">TikTok URL</label>
        <input
          className={inputClasses}
          value={tiktok}
          onChange={(event) => setTiktok(event.target.value)}
          placeholder="https://tiktok.com/@..."
        />
      </div>

      {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-green-400 sm:col-span-2">{message}</p> : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="focus-ring rounded-sm bg-wine px-6 py-2.5 text-sm font-medium text-ivory hover:bg-wine-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
