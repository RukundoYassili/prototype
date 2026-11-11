import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { CommunityCard } from "./CommunityPages";
import { communityRepository, type CommunityRepository } from "./repository";
import "./community.css";
import "./community-hub.css";

export default function CommunitySection({
  repository = communityRepository,
}: {
  repository?: CommunityRepository;
}) {
  const entries = repository.list().slice(0, 3);
  return (
    <section
      className="community-section community-home-preview"
      id="community"
      aria-labelledby="community-title"
    >
      <div className="community-inner">
        <div className="community-heading">
          <div>
            <span className="community-eyebrow">
              <HeartHandshake size={17} aria-hidden="true" /> COMMUNITY &
              OUTREACH
            </span>
            <h2 id="community-title">
              A community that
              <br />
              <span>cares, together.</span>
            </h2>
          </div>
          <div className="community-intro">
            <p>
              Stories, shared learning, and opportunities to connect. Explore
              our community at your own pace.
            </p>
            <Link to="/community" className="community-work-link">
              Explore our community work
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {entries.some((entry) => entry.demo) && (
          <p className="community-home-demo-note">
            Demo stories and illustrative media · a preview of what’s to come.
          </p>
        )}
        {entries.length ? (
          <div className="community-entry-grid">
            {entries.map((entry) => (
              <CommunityCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="community-home-empty">
            <h3>Our next chapter starts together.</h3>
            <p>
              Community stories, videos, photo albums, and confirmed activities
              will appear here when they’re ready to share.
            </p>
            <Link to="/knowledge-hub" className="community-work-link">
              Discover something to learn
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
