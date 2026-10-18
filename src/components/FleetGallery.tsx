import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Download, Heart, X } from "lucide-react";

import {
  FLEET_GALLERY_BATCH_SIZE,
  FLEET_GALLERY_IMAGES,
  type FleetGalleryImage,
} from "@/lib/fleet-gallery";

function assetUrl(src: string) {
  return encodeURI(src);
}

function downloadName(image: FleetGalleryImage) {
  const ext = image.src.split(".").pop()?.toLowerCase() ?? "jpg";
  return `namutek-fleet-${image.id}.${ext}`;
}

export function FleetGallery() {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(FLEET_GALLERY_BATCH_SIZE, FLEET_GALLERY_IMAGES.length),
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const loadingLock = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const liveRegionId = useId();

  const visibleImages = FLEET_GALLERY_IMAGES.slice(0, visibleCount);
  const hasMore = visibleCount < FLEET_GALLERY_IMAGES.length;
  const exhausted = !hasMore && FLEET_GALLERY_IMAGES.length > 0;

  const loadMore = useCallback(() => {
    if (loadingLock.current || !hasMore) return;
    loadingLock.current = true;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) =>
        Math.min(count + FLEET_GALLERY_BATCH_SIZE, FLEET_GALLERY_IMAGES.length),
      );
      setLoadingMore(false);
      loadingLock.current = false;
    }, 180);
  }, [hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        const rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 240) loadMore();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowRight") {
        setViewerIndex((index) =>
          index === null ? index : (index + 1) % FLEET_GALLERY_IMAGES.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setViewerIndex((index) =>
          index === null
            ? index
            : (index - 1 + FLEET_GALLERY_IMAGES.length) % FLEET_GALLERY_IMAGES.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewerIndex]);

  function likeState(id: string) {
    return likes[id] ?? { liked: false, count: 0 };
  }

  function toggleLike(id: string) {
    setLikes((current) => {
      const previous = current[id] ?? { liked: false, count: 0 };
      const liked = !previous.liked;
      return {
        ...current,
        [id]: { liked, count: Math.max(0, previous.count + (liked ? 1 : -1)) },
      };
    });
  }

  async function downloadImage(image: FleetGalleryImage) {
    try {
      const response = await fetch(assetUrl(image.src));
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = downloadName(image);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(assetUrl(image.src), "_blank", "noopener,noreferrer");
    }
  }

  const activeImage = viewerIndex === null ? null : FLEET_GALLERY_IMAGES[viewerIndex];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Photography</p>
        <h2 className="mt-2 text-3xl text-foreground md:text-5xl">Our Fleet in Action</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Trucks, trailers and site equipment used on Namutek transport and construction assignments.
        </p>

        {FLEET_GALLERY_IMAGES.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No fleet photographs are available yet.</p>
        ) : (
          <>
            <div
              className="mt-8 grid w-full grid-cols-6 gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
            >
              {visibleImages.map((image, index) => {
                const state = likeState(image.id);
                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setViewerIndex(index)}
                    className="group relative min-w-0 overflow-hidden bg-muted aspect-square focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Open ${image.alt}`}
                  >
                    {broken[image.id] ? (
                      <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-muted-foreground">
                        Image unavailable
                      </span>
                    ) : (
                      <img
                        src={assetUrl(image.src)}
                        alt={image.alt}
                        className="block h-full w-full object-cover object-center"
                        loading={index < 12 ? "eager" : "lazy"}
                        onError={() => setBroken((current) => ({ ...current, [image.id]: true }))}
                      />
                    )}
                    <span className="pointer-events-none absolute inset-0 hidden items-end bg-foreground/25 p-1.5 text-left text-[10px] leading-tight text-background opacity-0 transition group-hover:opacity-100 md:flex">
                      {image.caption}
                    </span>
                    {state.liked ? (
                      <Heart className="absolute right-1 top-1 h-3 w-3 fill-primary text-primary" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div ref={sentinelRef} className="h-8" aria-hidden="true" />
            <p id={liveRegionId} className="sr-only" aria-live="polite">
              {loadingMore
                ? "Loading more photographs"
                : exhausted
                  ? `All ${FLEET_GALLERY_IMAGES.length} photographs are shown`
                  : `${visibleImages.length} of ${FLEET_GALLERY_IMAGES.length} photographs shown`}
            </p>
            {loadingMore ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">Loading photographs…</p>
            ) : null}
            {exhausted ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                End of gallery · {FLEET_GALLERY_IMAGES.length} photographs
              </p>
            ) : null}
            <p className="mt-4 text-xs text-muted-foreground">
              Likes are simulated on this device only and reset when the page is refreshed. Comments are
              read-only and are not collected.
            </p>
          </>
        )}
      </div>

      {activeImage && viewerIndex !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-stretch bg-foreground/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fleet-gallery-caption"
          onClick={() => setViewerIndex(null)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 text-background">
              <p className="text-xs sm:text-sm">
                {viewerIndex + 1} of {FLEET_GALLERY_IMAGES.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadImage(activeImage)}
                  className="inline-flex items-center gap-1 rounded-md border border-background/30 px-3 py-1.5 text-xs font-semibold hover:bg-background/10"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download image
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setViewerIndex(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-background/30 hover:bg-background/10"
                  aria-label="Close image viewer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <img
                src={assetUrl(activeImage.src)}
                alt={activeImage.alt}
                className="mx-auto block h-full max-h-full w-full max-w-full object-contain object-center"
              />
              <button
                type="button"
                onClick={() =>
                  setViewerIndex(
                    (viewerIndex - 1 + FLEET_GALLERY_IMAGES.length) % FLEET_GALLERY_IMAGES.length,
                  )
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-md bg-background/15 px-3 py-2 text-sm font-semibold text-background hover:bg-background/25"
                aria-label="Previous image"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setViewerIndex((viewerIndex + 1) % FLEET_GALLERY_IMAGES.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-md bg-background/15 px-3 py-2 text-sm font-semibold text-background hover:bg-background/25"
                aria-label="Next image"
              >
                Next
              </button>
            </div>

            <div className="max-h-[32vh] overflow-y-auto rounded-md bg-background p-4 text-foreground">
              <p id="fleet-gallery-caption" className="text-sm leading-relaxed">
                {activeImage.caption}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleLike(activeImage.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted"
                  aria-pressed={likeState(activeImage.id).liked}
                  aria-label="Toggle simulated like"
                >
                  <Heart
                    className={`h-4 w-4 ${likeState(activeImage.id).liked ? "fill-primary text-primary" : ""}`}
                    aria-hidden
                  />
                  {likeState(activeImage.id).count} simulated likes
                </button>
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Comments
                </p>
                <p className="mt-2 text-sm text-muted-foreground">No comments available.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Comments are demonstration-only and cannot be submitted on this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
