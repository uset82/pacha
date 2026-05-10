"use client";

import { useActionState } from "react";
import { Trash2, Upload } from "lucide-react";
import { createMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/actions/admin-menu-actions";
import { ActionMessage } from "@/components/ui/action-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { fileNameFromPath } from "@/lib/images";
import type { MenuItem } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function MenuItemForm({ item }: { item?: MenuItem }) {
  const action = item ? updateMenuItem : createMenuItem;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="admin-panel space-y-5">
      <form action={formAction} className="space-y-5">
        {item && (
          <>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="existing_image_path" value={item.image_path || ""} />
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="label">Name</span>
            <input className="field" name="name" defaultValue={item?.name} required />
          </label>
          <label className="space-y-2">
            <span className="label">Slug</span>
            <input className="field" name="slug" defaultValue={item?.slug} placeholder="auto-generated if empty" />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="label">Description</span>
          <textarea className="field min-h-24 resize-y" name="description" defaultValue={item?.description} required />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="label">Price NOK</span>
            <input className="field" name="price_nok" type="number" min={0} defaultValue={item?.price_nok ?? 0} required />
          </label>
          <label className="space-y-2">
            <span className="label">Category</span>
            <input className="field" name="category" defaultValue={item?.category || "Menu"} required />
          </label>
          <label className="space-y-2">
            <span className="label">Sort order</span>
            <input className="field" name="sort_order" type="number" defaultValue={item?.sort_order ?? 100} />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <label className="space-y-2">
            <span className="label inline-flex items-center gap-2">
              <Upload className="size-4 text-brass" />
              Image
            </span>
            <input className="field file:mr-4 file:rounded-full file:border-0 file:bg-brass file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
            <span className="block text-xs text-mist/70">Current: {fileNameFromPath(item?.image_path)}</span>
          </label>
          <label className="space-y-2">
            <span className="label">Image alt text</span>
            <input className="field" name="image_alt" defaultValue={item?.image_alt || ""} />
          </label>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-mist">
          <label className="inline-flex items-center gap-2">
            <input className="size-4 accent-brass" type="checkbox" name="featured" defaultChecked={item?.featured ?? false} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input className="size-4 accent-brass" type="checkbox" name="active" defaultChecked={item?.active ?? true} />
            Active
          </label>
        </div>

        <ActionMessage state={state} />
        <SubmitButton pendingText={item ? "Updating..." : "Creating..."}>{item ? "Update item" : "Create item"}</SubmitButton>
      </form>

      {item && (
        <form action={deleteMenuItem} className="border-t border-ivory/10 pt-4">
          <input type="hidden" name="id" value={item.id} />
          <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-terracotta/70 px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-terracotta">
            <Trash2 className="size-4" />
            Delete item
          </button>
        </form>
      )}
    </div>
  );
}
