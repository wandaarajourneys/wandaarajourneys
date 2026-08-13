"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export function TagListInput({
  label,
  items,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  error?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="text-sm font-medium text-teal-800">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-teal-700/20 px-3 text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
          aria-label={`Add ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>
      {items.length > 0 ? (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center gap-1.5 rounded-full bg-sand-100 pl-3 pr-1.5 py-1 text-xs text-teal-800"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-full p-0.5 hover:bg-teal-700/10"
                aria-label={`Remove ${item}`}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="mt-1.5 text-sm text-terracotta-600">{error}</p> : null}
    </div>
  );
}
