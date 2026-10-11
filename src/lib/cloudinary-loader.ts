export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.includes("res.cloudinary.com")) return src;
  
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  
  const uploadIndex = src.indexOf('/upload/');
  if (uploadIndex === -1) return src;
  
  const prefix = src.substring(0, uploadIndex + '/upload/'.length);
  const suffix = src.substring(uploadIndex + '/upload/'.length);
  
  return `${prefix}${params.join(',')}/${suffix}`;
}

