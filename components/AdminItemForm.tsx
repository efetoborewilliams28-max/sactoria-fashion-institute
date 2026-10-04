"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CatalogueItem } from "@/lib/types";

export function AdminItemForm({ item }: { item?: CatalogueItem }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(item);

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [whatsappMessage, setWhatsappMessage] = useState(item?.whatsapp_message ?? "");
  const [isVisible, setIsVisible] = useState(item?.is_visible ?? true);
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(item?.image_url ?? "");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadImageIfNeeded(): Promise<string | null> {
    if (!imageFile) return imageUrl || null;

    setUploadingImage(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("catalogue-images")
      .upload(filePath, imageFile, { upsert: false });

    setUploadingImage(false);

    if (uploadError) {
      setError("Image upload failed. Please try a different image.");
      return null;
    }

    const { data } = supabase.storage.from("catalogue-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !category.trim() || !price) {
      setError("Name, category and price are required.");
      return;
    }

    setSaving(true);

    const uploadedUrl = await uploadImageIfNeeded();
    if (imageFile && !uploadedUrl) {
      setSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      image_url: uploadedUrl,
      whatsapp_message: whatsappMessage.trim() || null,
      is_visible: isVisible,
    };

    const { error: saveError } = isEditing
      ? await supabase.from("catalogue_items").update(payload).eq("id", item!.id)
      : await supabase.from("catalogue_items").insert(payload);

    setSaving(false);

    if (saveError) {
      setError("Could not save this item. Please try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputClasses =
    "focus-ring w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-stone";

  return (
    <form onSubmit={handleSubmit} className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Name</label>
        <input
          className={inputClasses}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Advanced Pattern Cutting Course"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Category</label>
        <input
          className={inputClasses}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Courses / Ready-to-wear / Bridal..."
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Price (₦)</label>
        <input
          type="number"
          min="0"
          step="1"
          className={inputClasses}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="150000"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-stone-light">Visibility</label>
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className={`focus-ring rounded-sm border px-4 py-2.5 text-left text-sm ${
            isVisible
              ? "border-green-800 bg-green-900/30 text-green-300"
              : "border-white/20 bg-white/5 text-stone-light"
          }`}
        >
          {isVisible ? "Visible on public site" : "Hidden from public site"}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm text-stone-light">Description</label>
        <textarea
          className={`${inputClasses} min-h-28`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What the customer or student receives..."
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm text-stone-light">
          WhatsApp message override <span className="text-stone">(optional)</span>
        </label>
        <input
          className={inputClasses}
          value={whatsappMessage}
          onChange={(event) => setWhatsappMessage(event.target.value)}
          placeholder="Leave blank to use the default enroll/order message"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm text-stone-light">Image</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-white/10">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" fill sizes="80px" className="object-cover" />
            ) : null}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-stone-light file:mr-4 file:rounded-sm file:border-0 file:bg-wine file:px-4 file:py-2 file:text-sm file:text-ivory hover:file:bg-wine-dark"
          />
        </div>
        {uploadingImage ? (
          <p className="text-xs text-stone-light">Uploading image...</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="focus-ring rounded-sm bg-wine px-6 py-2.5 text-sm font-medium text-ivory hover:bg-wine-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add item"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="focus-ring rounded-sm border border-white/20 px-6 py-2.5 text-sm text-ivory"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
