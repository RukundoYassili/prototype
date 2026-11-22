import { useEffect, useState } from "react";
import type { CommunityPhoto } from "./photos";
import { CommunityAlbum } from "./CommunityMedia";

export function ManagedGallery({ id, fallback, title, initiallyVisible }: { id: string; fallback: CommunityPhoto[]; title: string; initiallyVisible?: number }) {
  const enabled = import.meta.env.VITE_MEDIA_ENABLED === "1";
  const [photos, setPhotos] = useState<CommunityPhoto[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetch(`/api/media/galleries/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Gallery unavailable"); return response.json(); })
      .then(data => { if (!Array.isArray(data.photos)) throw new Error("Invalid gallery"); setPhotos(data.photos); })
      .catch(error => { if (error.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  }, [id, enabled]);
  if (!enabled) return <CommunityAlbum photos={fallback} title={title} initiallyVisible={initiallyVisible} />;
  if (failed) return <p role="status">The photo gallery is temporarily unavailable. Please try again later.</p>;
  if (!photos) return <p role="status">Loading photos…</p>;
  if (!photos.length) return <p>No photos are currently available.</p>;
  return <CommunityAlbum photos={photos} title={title} initiallyVisible={initiallyVisible} />;
}
