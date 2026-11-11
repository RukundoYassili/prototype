// Materialize the separate, human-readable record of the 9 November web review.
// Running this script does not perform a new network or specialist review.
import { readFile, writeFile } from "node:fs/promises";
const audit = JSON.parse(
  await readFile("artifacts/gbv-learning/source-audit.json", "utf8"),
);
const records = new Map();
for (const chapter of audit.chapters)
  for (const reference of chapter.references) {
    if (!reference.url)
      throw new Error(
        `Missing source URL: ${chapter.chapter}/${reference.number}`,
      );
    const record = records.get(reference.url) || {
      url: reference.url,
      sourceEntries: [],
      checkedAt: "2026-11-09",
      method: "Web retrieval of the source URL",
      status: "retrieved",
      note: "Official publication or institutional page retrieved. Availability is not specialist validation of the chapter.",
    };
    record.sourceEntries.push({
      chapter: chapter.chapter,
      reference: reference.number,
    });
    records.set(reference.url, record);
  }
for (const [url, record] of records) {
  if (
    url.includes("un.org/en/node/71778") ||
    url.includes("apps.who.int/iris/") ||
    url.includes("unwomen.org/sites/default/files/")
  ) {
    record.status = "verification-needed";
    record.note =
      "Web retrieval returned 403 Forbidden. This does not establish that the source is unavailable to all readers. Recheck manually before publication.";
  }
  if (url.includes("unwomen.org.nz/")) {
    record.status = "verification-needed";
    record.note =
      "The URL returned a JavaScript application shell; substantive content could not be verified by this retrieval. Recheck manually before publication.";
  }
  if (url.includes("apps.who.int/iris/"))
    record.alternativeOfficialUrl =
      "https://www.who.int/publications-detail-redirect/WHO-RHR-14.26";
  if (url.includes("National_Policy_"))
    record.note =
      "The July 2011 historical policy PDF was retrieved. Current operational/legal requirements remain unverified and require a Rwanda-qualified reviewer.";
  if (url.includes("who.int/") && url.includes("violence-against-women"))
    record.note =
      "WHO fact sheet retrieved, dated 18 June 2026. The printed 840 million statistic and its defined violence measures match the retrieved page; it is not an individual risk prediction.";
  if (url.includes("9789240117020"))
    record.note =
      "WHO second edition of RESPECT retrieved, dated 19 November 2025, with seven complementary prevention strategies.";
  if (url.includes("cdc.gov/"))
    record.note =
      "CDC provider guidance retrieved, dated 7 October 2026; assessment and PEP timing are for clinical review, not personalized advice from this website.";
  if (url.includes("unfpa.org/publications/guidance"))
    record.note =
      "UNFPA publication page retrieved; publication date displayed as Oct 2026. Safe data handling guidance does not constitute approval of this implementation.";
  if (url.includes("help.unhcr.org/"))
    record.note =
      "UNHCR Rwanda lists Isange 3029, access in all 30 districts and possible reporting to law enforcement. A web listing does not verify live telephone operation or a specific facility.";
  if (url.includes("family-promotion-"))
    record.note =
      "MIGEPROF lists RIB 116 / 3512, GMO 5798, MIGEPROF 9059 and NCDA 711. Hours, eligibility, response and referral procedures were not operationally tested.";
}
const review = {
  collection: "gbv",
  checkedAt: "2026-11-09",
  scope:
    "Link retrieval and comparison of published referral listings only. Original source transcription is unchanged.",
  specialistApproval: false,
  publicationApproval: false,
  operationalTelephoneChecks: false,
  references: [...records.values()],
  referrals: [
    {
      service: "Isange One Stop Centres",
      numbers: ["3029"],
      source: "https://help.unhcr.org/rwanda/services/sgbv/",
      publishedListingConfirmed: true,
      caution:
        "The published page notes that approaching Isange may result in reporting to law enforcement. Confirm privacy, reporting, eligibility and access with a qualified local service.",
    },
    {
      service: "RIB / GMO / MIGEPROF / NCDA",
      numbers: ["116", "3512", "5798", "9059", "711"],
      source:
        "https://www.migeprof.gov.rw/family-promotion-and-child-right-protection",
      publishedListingConfirmed: true,
      caution:
        "Only the published listing was checked. No calls, case referrals or operating-hour checks were made.",
    },
  ],
  flags: [
    "Three source URLs returned 403 and one provided a JavaScript-only shell; retain the original citations and require a manual recheck.",
    "The 2011 national policy is historical. Its continued hosting is not proof of current legal or operational requirements.",
    "Telephone listing verification does not establish availability, confidentiality, safety, eligibility or a legal outcome.",
    "Publication, clinical, GBV-specialist, safeguarding, legal, accessibility, translation and Rwanda-localization approvals remain outstanding.",
  ],
};
await writeFile(
  "public/learning/gbv/reference-review.json",
  JSON.stringify(review, null, 2) + "\n",
);
await writeFile(
  "artifacts/gbv-learning/reference-review.json",
  JSON.stringify(review, null, 2) + "\n",
);
console.log(
  `Recorded ${records.size} distinct source URLs across 25 reference entries.`,
);
