"use client";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

/**
 * VideoPlayer — componente placeholder cinematográfico.
 *
 * Cuando videoUrl está vacío muestra un estado de "próximamente".
 * Preparado para recibir URLs de Bunny.net, Vimeo o cualquier iframe.
 *
 * Para embeber Bunny.net: videoUrl = "https://iframe.mediadelivery.net/embed/{library}/{id}"
 * Para Vimeo:             videoUrl = "https://player.vimeo.com/video/{id}"
 */
export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="w-full h-full min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border border-border flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="square"
                d="M15 10l4.553-2.276A1 1 0 0121 8.724v6.552a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-sans">
              {title ?? "Video"}
            </p>
            <p className="text-xs text-muted-foreground/30 font-sans mt-1 tracking-wider uppercase">
              Próximamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[60vh] bg-black">
      <iframe
        src={videoUrl}
        title={title ?? "Video del curso"}
        className="w-full h-full min-h-[60vh]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
