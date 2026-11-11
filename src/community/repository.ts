import {
  communityEntries,
  type CommunityEntry,
  type CommunityKind,
} from "./content";

export type CommunityQuery = {
  q?: string;
  kind?: CommunityKind | "all";
  topic?: string;
  previewTemplates?: boolean;
};
export interface CommunityRepository {
  list(query?: CommunityQuery): CommunityEntry[];
  get(slug: string, previewTemplates?: boolean): CommunityEntry | undefined;
}
const localPath = (value: string) => /^\/(?!\/)/.test(value);
const mediaPath = (value: string) =>
  localPath(value) || /^https:\/\//.test(value);

export function isPublishable(entry: CommunityEntry): boolean {
  if (
    entry.status !== "published" ||
    entry.template ||
    !entry.mediaApproved ||
    !entry.title.trim() ||
    !entry.summary.trim() ||
    !entry.image ||
    !entry.imageAlt.trim()
  )
    return false;
  if (
    entry.resources?.some(
      (resource) =>
        !localPath(resource.href) && !/^https:\/\//.test(resource.href),
    )
  )
    return false;
  if (entry.kind === "events" || entry.kind === "workshops") {
    const schedule = entry.schedule;
    if (
      !schedule ||
      !entry.audience?.trim() ||
      !schedule.location.trim() ||
      !/(Z|[+-]\d{2}:\d{2})$/.test(schedule.startsAt) ||
      !Number.isFinite(Date.parse(schedule.startsAt))
    )
      return false;
    try {
      new Intl.DateTimeFormat("en", { timeZone: schedule.timeZone }).format();
    } catch {
      return false;
    }
    if (
      schedule.endsAt &&
      (!Number.isFinite(Date.parse(schedule.endsAt)) ||
        Date.parse(schedule.endsAt) < Date.parse(schedule.startsAt))
    )
      return false;
    if (
      schedule.registrationUrl &&
      !/^https:\/\//.test(schedule.registrationUrl)
    )
      return false;
  }
  if (entry.kind === "videos") {
    const video = entry.video;
    if (
      !video.transcript.trim() ||
      !video.language.trim() ||
      video.durationSeconds <= 0 ||
      !Number.isFinite(video.durationSeconds) ||
      !video.captions.length ||
      video.captions.some(
        (caption) =>
          !localPath(caption.src) || !caption.language || !caption.label,
      )
    )
      return false;
    if (
      video.source.provider === "youtube"
        ? !/^[\w-]{11}$/.test(video.source.id)
        : !mediaPath(video.source.src)
    )
      return false;
  }
  if (
    entry.kind === "albums" &&
    (!entry.photos.length ||
      entry.photos.some(
        (photo) =>
          !mediaPath(photo.src) || !photo.alt.trim() || !photo.title.trim(),
      ))
  )
    return false;
  return true;
}

// Inject records for tests; the public app always uses the local editorial collection.
export function createCommunityRepository(
  entries: CommunityEntry[],
  allowTemplatePreview = false,
): CommunityRepository {
  const visible = (entry: CommunityEntry, preview = false) =>
    isPublishable(entry) || (allowTemplatePreview && preview && entry.template);
  return {
    list(query = {}) {
      const needle = (query.q || "").trim().toLocaleLowerCase();
      return entries
        .filter(
          (entry) =>
            visible(entry, query.previewTemplates) &&
            (!query.kind ||
              query.kind === "all" ||
              entry.kind === query.kind) &&
            (!query.topic || entry.topics.includes(query.topic)) &&
            [
              entry.title,
              entry.summary,
              ...entry.topics,
              ...entry.sections.flatMap((section) => [
                section.title,
                section.text,
              ]),
              entry.kind === "videos" ? entry.video.transcript : "",
            ]
              .join(" ")
              .toLocaleLowerCase()
              .includes(needle),
        )
        .sort(
          (a, b) =>
            (Date.parse(b.publishedAt || "") || 0) -
              (Date.parse(a.publishedAt || "") || 0) ||
            a.slug.localeCompare(b.slug),
        );
    },
    get(slug, previewTemplates = false) {
      return entries.find(
        (entry) => entry.slug === slug && visible(entry, previewTemplates),
      );
    },
  };
}
export const communityRepository = createCommunityRepository(
  communityEntries,
  import.meta.env?.DEV ?? false,
);
export const findCommunityEntry = (slug?: string) =>
  communityRepository.get(slug || "");
export const isActivity = (entry: CommunityEntry) =>
  entry.kind === "events" || entry.kind === "workshops";
export function activityState(entry: CommunityEntry, now = Date.now()) {
  if (entry.schedule?.cancelled) return "Cancelled";
  if (!entry.schedule) return "Schedule to be announced";
  return Date.parse(entry.schedule.endsAt || entry.schedule.startsAt) < now
    ? "Past event"
    : "Upcoming";
}
export function upcomingActivities(
  entries: CommunityEntry[],
  now = Date.now(),
) {
  return entries
    .filter(
      (entry) =>
        isPublishable(entry) &&
        isActivity(entry) &&
        activityState(entry, now) === "Upcoming",
    )
    .sort(
      (a, b) =>
        Date.parse(a.schedule!.startsAt) - Date.parse(b.schedule!.startsAt),
    );
}
export function communityImage(entry: CommunityEntry) {
  return entry.image.startsWith("/")
    ? entry.image
    : `/images/${entry.image}.webp`;
}
export function durationLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
