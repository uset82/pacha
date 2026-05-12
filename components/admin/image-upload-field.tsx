"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { fileNameFromPath, resolveImageUrl } from "@/lib/images";

type ImageUploadFieldProps = {
  label: string;
  inputName: string;
  currentPath?: string | null;
  existingInputName: string;
  removeInputName: string;
};

export function ImageUploadField({
  label,
  inputName,
  currentPath,
  existingInputName,
  removeInputName,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(() => (currentPath ? resolveImageUrl(currentPath) : null));
  const [selectedName, setSelectedName] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={existingInputName} value={currentPath || ""} />
      <input type="hidden" name={removeInputName} value={removeImage ? "on" : ""} />
      <div className="flex items-center justify-between gap-3">
        <span className="label inline-flex items-center gap-2">
          <Upload className="size-4 text-brass" />
          {label}
        </span>
        {(previewUrl || currentPath) && (
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-terracotta/70 px-3 py-1.5 text-xs font-semibold text-ivory transition hover:bg-terracotta"
            onClick={() => {
              clearObjectUrl();
              setPreviewUrl(null);
              setSelectedName("");
              setRemoveImage(true);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        )}
      </div>

      <div
        className="grid min-h-44 place-items-center overflow-hidden rounded-lg border border-mist/15 bg-ink/70 bg-cover bg-center text-center text-sm text-mist"
        style={previewUrl ? { backgroundImage: `url("${previewUrl.replaceAll('"', "%22")}")` } : undefined}
      >
        {!previewUrl && (
          <div className="grid justify-items-center gap-2 px-4">
            <ImageIcon className="size-8 text-brass/70" />
            <span>No image selected</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        className="field file:mr-4 file:rounded-full file:border-0 file:bg-brass file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
        name={inputName}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];

          clearObjectUrl();

          if (!file) {
            setPreviewUrl(currentPath ? resolveImageUrl(currentPath) : null);
            setSelectedName("");
            return;
          }

          const objectUrl = URL.createObjectURL(file);
          objectUrlRef.current = objectUrl;
          setPreviewUrl(objectUrl);
          setSelectedName(file.name);
          setRemoveImage(false);
        }}
      />
      <p className="text-xs text-mist/70">
        {selectedName ? `Selected: ${selectedName}` : `Current: ${fileNameFromPath(currentPath)}`}
      </p>
    </div>
  );
}
