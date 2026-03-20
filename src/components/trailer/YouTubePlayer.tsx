'use client';

interface YouTubePlayerProps {
  youtubeId: string;
  autoplay?: boolean;
}

export default function YouTubePlayer({ youtubeId, autoplay = false }: YouTubePlayerProps) {
  const src = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
