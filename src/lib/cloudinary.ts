import { v2 as cloudinary } from "cloudinary";

console.log("In src/lib/cloudinary.ts, CLOUDINARY_URL is:", process.env.CLOUDINARY_URL);

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else if (process.env.CLOUDINARY_URL) {
  console.log("Calling config(true)");
  // Force parsing of CLOUDINARY_URL
  cloudinary.config(true);
}

export default cloudinary;
