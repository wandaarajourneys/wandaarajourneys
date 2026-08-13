"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { adminUploadFetch } from "@/lib/csrfClient";

export function ImageUploadField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onChange(json.url);
    } catch {
      setUploadError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-teal-800">{label}</label>
      <div className="mt-1.5 flex items-start gap-4">
        {value ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-teal-700/10 bg-sand-100">
            <Image src={value} alt="" fill sizes="112px" className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... (paste an image URL, or upload below)"
            className="w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-700/20 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors disabled:opacity-60"
          >
            <Upload size={13} aria-hidden="true" />
            {uploading ? "Uploading..." : "Upload Image"}
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
          {uploadError ? <p className="text-xs text-terracotta-600">{uploadError}</p> : null}
        </div>
      </div>
      {error ? <p className="mt-1.5 text-sm text-terracotta-600">{error}</p> : null}
    </div>
  );
}
