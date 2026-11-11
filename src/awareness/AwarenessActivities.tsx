import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { AwarenessContent } from "./content";
const Arrow = () => <ArrowUpRight size={18} aria-hidden="true" />;

export function AwarenessActivities({
  activities,
}: {
  activities: AwarenessContent["activities"];
}) {
  return activities.length ? (
    <div className="awareness-resource-grid">
      {activities.map((activity) => (
        <Link
          className="information-card"
          key={activity.slug}
          to={`/community/${activity.slug}`}
        >
          <span className="support-eyebrow">
            Community {activity.kind === "news" ? "update" : activity.kind}
          </span>
          <h3>{activity.title}</h3>
          <p>{activity.summary}</p>
          <span className="information-card-action">
            View confirmed details <Arrow />
          </span>
        </Link>
      ))}
    </div>
  ) : (
    <div className="awareness-empty">
      <div>
        <h3>More opportunities to learn together.</h3>
        <p>
          No confirmed activities are published here yet. Dates, locations, and
          participation information will appear in Community when the details
          are ready.
        </p>
      </div>
      <Link className="support-button" to="/community">
        Explore Community <Arrow />
      </Link>
    </div>
  );
}
