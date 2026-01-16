import NextImage from 'next/image';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  priority?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
}: ImageProps) {
  // For images without dimensions, use fill layout
  const useFill = !width || !height;

  return (
    <figure className="my-8">
      <div
        className={`relative overflow-hidden rounded-lg bg-muted ${
          useFill ? 'aspect-video' : ''
        }`}
      >
        <NextImage
          src={src}
          alt={alt}
          {...(useFill
            ? { fill: true, className: 'object-cover' }
            : { width, height, className: 'w-full h-auto' })}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
