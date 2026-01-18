interface VideoProps {
  id: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  start?: number;
}

export function Video({
  id,
  title = 'Video',
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  poster,
  start,
}: VideoProps) {
  const params = new URLSearchParams();

  if (autoplay) params.set('autoplay', 'true');
  if (loop) params.set('loop', 'true');
  if (muted) params.set('muted', 'true');
  if (!controls) params.set('controls', 'false');
  if (poster) params.set('poster', poster);
  if (start) params.set('startTime', start.toString());

  const queryString = params.toString();
  const src = `https://iframe.videodelivery.net/${id}${queryString ? `?${queryString}` : ''}`;

  return (
    <div className="relative aspect-video my-8 rounded-md overflow-hidden bg-muted">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
