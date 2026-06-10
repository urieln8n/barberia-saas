import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  width?: number;
  height?: number;
  duration?: number;
};

// Uploads a Buffer to Cloudinary under studio-media/{barbershopId}/
export async function uploadToCloudinary(
  buffer: Buffer,
  barbershopId: string,
  resourceType: "image" | "video" = "image",
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const folder = `studio-media/${barbershopId}`;
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, use_filename: false },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload returned empty result"));
        resolve({
          public_id:     result.public_id,
          secure_url:    result.secure_url,
          resource_type: resourceType,
          format:        result.format,
          width:         result.width,
          height:        result.height,
          duration:      result.duration,
        });
      },
    ).end(buffer);
  });
}

// Social media platform dimensions (width × height)
const SOCIAL_SIZES: Record<string, { w: number; h: number }> = {
  instagram_reel: { w: 1080, h: 1920 },
  tiktok:         { w: 1080, h: 1920 },
  whatsapp:       { w: 1080, h: 1920 },
  facebook:       { w: 1080, h: 1080 },
  instagram_post: { w: 1080, h: 1080 },
  instagram_story:{ w: 1080, h: 1920 },
};

// Build a Cloudinary URL that enhances and crops an image for a given platform/mode.
export function buildEnhancedUrl(publicId: string, mode: string, platform?: string): string {
  const size = platform ? SOCIAL_SIZES[platform] ?? SOCIAL_SIZES.instagram_reel : null;

  const transformations: string[] = [];

  if (mode === "improve") {
    transformations.push("e_improve:outdoor:50");
    transformations.push("e_sharpen:80");
  }

  if (mode === "auto_crop" && size) {
    transformations.push(`w_${size.w},h_${size.h},c_fill,g_auto,q_auto:best,f_auto`);
  } else if (size) {
    transformations.push(`w_${size.w},h_${size.h},c_fill,g_auto,q_auto:best,f_auto`);
  } else {
    transformations.push("q_auto:best,f_auto");
  }

  return cloudinary.url(publicId, {
    transformation: transformations.map(t => ({ raw_transformation: t })),
    secure: true,
  });
}

// Create a side-by-side vertical 9:16 before/after composite.
// Stacks left image (before) on the left half and right image (after) on the right half.
export function buildBeforeAfterUrl(beforePublicId: string, afterPublicId: string): string {
  // Final canvas: 1080 × 1920 split vertically
  // Left side: before (540×1920), right side: after (540×1920)
  return cloudinary.url(beforePublicId, {
    transformation: [
      // Canvas: full width, left half is the before image
      { raw_transformation: "w_540,h_1920,c_fill,g_auto" },
      // Overlay: after image on the right half
      {
        raw_transformation: [
          `l_${afterPublicId.replace(/\//g, ":")}`,
          "w_540,h_1920,c_fill,g_auto",
          "fl_layer_apply,x_270",
        ].join("/"),
      },
      // Final format
      { raw_transformation: "q_auto:best,f_jpg" },
    ],
    secure: true,
  });
}

export { cloudinary };
