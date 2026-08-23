import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative aspect-square overflow-hidden bg-secondary"
        >
          <Image
            src={image}
            alt={`${name} - view ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}