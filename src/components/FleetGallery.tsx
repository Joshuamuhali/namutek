import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Download, Heart, MessageCircle, Send, X } from "lucide-react";

import { Reveal } from "@/components/reveal";
import {
  FLEET_GALLERY_BATCH_SIZE,
  FLEET_GALLERY_IMAGES,
  publicAssetPath,
  type FleetGalleryImage,
} from "@/lib/fleet-gallery";

function assetUrl(src: string) {
  return publicAssetPath(src);
}

function downloadName(image: FleetGalleryImage) {
  const ext = image.src.split(".").pop()?.toLowerCase() ?? "jpg";
  return `namutek-fleet-${image.id}.${ext}`;
}

const SAMPLE_COMMENTS = [
  {
    name: "Amina K.",
    country: "Zambia",
    text: "A strong fleet makes a big difference to every project.",
  },
  {
    name: "Thabo M.",
    country: "South Africa",
    text: "Great to see logistics and construction working side by side.",
  },
  { name: "Nia O.", country: "Kenya", text: "Keeping businesses and communities connected." },
  {
    name: "Kofi A.",
    country: "Ghana",
    text: "The right equipment helps keep important work moving.",
  },
  { name: "Amara D.", country: "Nigeria", text: "A professional fleet ready for demanding jobs." },
  {
    name: "Musa B.",
    country: "Tanzania",
    text: "Reliable transport is at the heart of every successful delivery.",
  },
  {
    name: "Lerato P.",
    country: "Botswana",
    text: "Impressive capability for projects across the region.",
  },
  {
    name: "Daniel R.",
    country: "United Kingdom",
    text: "A well-presented fleet and a clear focus on service.",
  },
  {
    name: "Sofia L.",
    country: "Portugal",
    text: "Moving materials safely is what keeps projects on schedule.",
  },
  {
    name: "Raj S.",
    country: "India",
    text: "Good equipment and coordination make all the difference.",
  },
] as const;

function sampleLikeCount(imageIndex: number) {
  return 128 + imageIndex * 17;
}

export function FleetGallery() {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(FLEET_GALLERY_BATCH_SIZE, FLEET_GALLERY_IMAGES.length),
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState("");
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
    const imageIndex = FLEET_GALLERY_IMAGES.findIndex((image) => image.id === id);
    return likes[id] ?? { liked: false, count: sampleLikeCount(Math.max(0, imageIndex)) };
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

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCommentError(
      "Comments aren't available yet. Account creation and comment storage are coming soon, so your comment wasn't posted.",
    );
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
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Photography</p>
          <h2 className="mt-2 text-3xl text-foreground md:text-5xl">Our Fleet in Action</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Trucks, trailers and site equipment used on Namutek transport and construction
            assignments.
          </p>
        </Reveal>

        {FLEET_GALLERY_IMAGES.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No fleet photographs are available yet.
          </p>
        ) : (
          <>
            <Reveal delay={0.08}>
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
                        <Heart
                          className="absolute right-1 top-1 h-3 w-3 fill-primary text-primary"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </Reveal>
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

            <div className="max-h-[45vh] overflow-y-auto rounded-xl bg-background p-4 text-foreground sm:p-5">
              <p id="fleet-gallery-caption" className="text-sm leading-relaxed">
                {activeImage.caption}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleLike(activeImage.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:bg-primary/5"
                  aria-pressed={likeState(activeImage.id).liked}
                  aria-label={
                    likeState(activeImage.id).liked ? "Unlike this photo" : "Like this photo"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likeState(activeImage.id).liked ? "fill-primary text-primary" : ""
                    }`}
                    aria-hidden
                  />
                  {likeState(activeImage.id).count} sample likes
                </button>
              </div>
              <section
                className="mt-5 border-t border-border pt-5"
                aria-labelledby="gallery-comments-title"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h3 id="gallery-comments-title" className="text-sm font-bold text-foreground">
                    Community comments
                  </h3>
                </div>

                <ul className="mt-4 space-y-4">
                  {SAMPLE_COMMENTS.map((comment) => (
                    <li key={comment.name} className="flex items-start gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                        aria-hidden="true"
                      >
                        {comment.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-bold text-foreground">{comment.name}</span>
                          <span aria-hidden="true"> · </span>
                          {comment.country}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                          {comment.text}
                        </p>
                      </div>
                      <Heart
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold text-foreground">Start the conversation</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Share a note about this fleet photo. Comment posting is coming soon.
                  </p>
                  <form onSubmit={submitComment} className="mt-4">
                    <label htmlFor="fleet-photo-comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="fleet-photo-comment"
                      value={commentDraft}
                      onChange={(event) => {
                        setCommentDraft(event.target.value);
                        setCommentError("");
                      }}
                      rows={3}
                      maxLength={500}
                      required
                      placeholder="Write a comment..."
                      className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        {commentDraft.length}/500 characters
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Post comment
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    {commentError ? (
                      <p
                        className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm leading-relaxed text-destructive"
                        role="alert"
                      >
                        {commentError}
                      </p>
                    ) : null}
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
