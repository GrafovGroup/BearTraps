import images from "@/content/page-images.json";

export default function PagePhoto({
  id,
  priority = false,
  className = "",
}: {
  id: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = images.find((image) => image.id === id);
  if (!photo) throw new Error(`Unknown page image: ${id}`);
  const largest = photo.variants[photo.variants.length - 1];
  return (
    <figure className={`page-photo ${className}`} data-photo-id={id}>
      {/* Static WHC export: responsive files are pre-optimized; no image server required. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={largest.src}
        srcSet={photo.variants
          .map((image) => `${image.src} ${image.width}w`)
          .join(", ")}
        sizes="(max-width: 760px) 100vw, 50vw"
        width={largest.width}
        height={largest.height}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      <figcaption>{photo.label}</figcaption>
    </figure>
  );
}
