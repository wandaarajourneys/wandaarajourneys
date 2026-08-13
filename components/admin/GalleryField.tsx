"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Upload, X } from "lucide-react";
import { adminUploadFetch } from "@/lib/csrfClient";

export function GalleryField({
  label,
  images,
  onChange,
  error,
}: {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}) {
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addUrl() {
    const value = urlDraft.trim();
    if (!value) return;
    onChange([...images, value]);
    setUrlDraft("");
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminUploadFetch("/api/admin/upload", formData);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(json.error || "Upload failed.");
        return;
      }
      onChange([...images, json.url]);
    } catch {
      setUploadError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-teal-800">{label}</label>

      {images.length > 0 ? (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative aspect-video overflow-hidden rounded-lg border border-teal-700/10 bg-sand-100">
              <Image src={src} alt="" fill sizes="150px" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2.5 flex gap-2">
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Paste an image URL..."
          className="flex-1 rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
        />
        <button
          type="button"
          onClick={addUrl}
          className="rounded-lg border border-teal-700/20 px-3 text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
          aria-label="Add image URL"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-700/20 px-3 text-xs font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors disabled:opacity-60"
        >
          <Upload size={14} aria-hidden="true" />
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {uploadError ? <p className="mt-1.5 text-xs text-terracotta-600">{uploadError}</p> : null}
      {error ? <p className="mt-1.5 text-sm text-terracotta-600">{error}</p> : null}
    </div>
  );
}
