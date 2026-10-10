"use server";

import cloudinary from "@/lib/cloudinary";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function uploadProductImageAction(formData: FormData) {
  await requireAdmin();
  
  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "Invalid file type. Only images are allowed." };
  }

  // Validate size (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File is too large. Limit is 5MB." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "npj-ecomm/products",
        },
        (error, result) => {
          if (error) {
            reject({ error: "Cloudinary upload failed: " + error.message });
          } else if (result) {
            resolve({ 
              success: true, 
              url: result.secure_url, 
              publicId: result.public_id 
            });
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return { error: "An unexpected error occurred during upload." };
  }
}
