/**
 * Client-side screenshot preparation.
 *
 * Runs in the browser and uses the Canvas API only — no image dependency. A
 * screenshot is downscaled and re-encoded before upload, which keeps the
 * request small, cuts image tokens, and speeds the model call up.
 *
 * The result lives in component state for the duration of one submission.
 */
import { MAX_SCREENSHOT_BYTES, decodedByteLength } from "@/lib/schemas";

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

/** Longest edge after downscaling. */
export const MAX_LONG_EDGE = 1600;

/** Refuse very large source files before decoding them into memory. */
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

export interface PreparedScreenshot {
  /** Always JPEG — everything is re-encoded on the way through. */
  mime_type: "image/jpeg";
  /** Base64 payload with no data: prefix. */
  data: string;
  /** Data URL used only for the local preview. */
  preview_url: string;
  width: number;
  height: number;
}

function scaleToFit(width: number, height: number) {
  const longest = Math.max(width, height);
  if (longest <= MAX_LONG_EDGE) return { width, height };

  const ratio = MAX_LONG_EDGE / longest;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Validate, downscale and encode a screenshot.
 *
 * Throws an Error whose message is safe to show the user.
 */
export async function prepareScreenshot(
  file: File,
): Promise<PreparedScreenshot> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new Error("Attach a PNG, JPEG or WebP image.");
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("That image is too large. Use one under 10 MB.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That image could not be read. Try a different file.");
  }

  const { width, height } = scaleToFit(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("This browser could not process the image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const previewUrl = canvas.toDataURL("image/jpeg", 0.8);
  const data = previewUrl.slice(previewUrl.indexOf(",") + 1);

  if (decodedByteLength(data) > MAX_SCREENSHOT_BYTES) {
    throw new Error("That screenshot is still too large after resizing.");
  }

  return {
    mime_type: "image/jpeg",
    data,
    preview_url: previewUrl,
    width,
    height,
  };
}
