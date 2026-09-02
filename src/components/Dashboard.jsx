import React from "react";
import { ArrowRight, Droplets, Leaf, MessageSquare, Zap, Play } from "lucide-react";
import greenVideo from "./GREEN.mp4";

function Metric({ value, label, detail }) {
  return (
    <article className="eco-metric">
      <span className="eco-metric-value">{value}</span>
      <span className="eco-metric-label">{label}</span>
      {detail && <span className="eco-metric-detail">{detail}</span>}
    </article>
  );
}

export default function Dashboard({ stats, challenges, onQuickAction, onCompleteChallenge }) {
  const activeChallenges = challenges.filter((challenge) => !challenge.completed).slice(0, 2);
  const weeklyProgress = Math.min(100, Math.round((stats.xp / Math.max(stats.weeklyGoalXP || 300, 1)) * 100));

  return (
    <div className="eco-dashboard space-y-6">
      {/* Hero Video Section at Top of Home Page */}
      <section className="relative rounded-2xl overflow-hidden shadow-md border border-[#85a528]/30 bg-[#ffffff]" aria-label="Eco Movement Video Showcase">
        <div className="relative w-full aspect-video bg-[#000000] overflow-hidden">
          <video
            src={greenVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Rest of Homepage Content Appears on Scroll Below Video */}
      <section className="eco-command-header" aria-labelledby="dashboard-title">
        <span className="eco-eyebrow">Eco Green / personal impact log</span>
        <h2 id="dashboard-title">Good morning, {stats.name}.</h2>
        <p>Small, tracked choices build a cleaner everyday.</p>
        <div className="eco-rule" />
      </section>

      <section className="eco-impact-card" aria-label="Weekly verified impact">
        <span className="eco-label-dark">This week&apos;s verified impact</span>
        <strong>{stats.co2Saved.toFixed(1)} green points</strong>
        <span>{stats.waterSaved} L water saved · ₹{stats.costSaved} kept</span>
      </section>

      <section aria-labelledby="impact-details-title">
        <div className="eco-section-heading">
          <span id="impact-details-title" className="eco-eyebrow">Impact details</span>
          <span className="eco-progress-copy">{weeklyProgress}% of weekly goal</span>
        </div>
        <div className="eco-metric-grid">
          <Metric value={`${stats.waterSaved} L`} label="Water saved" detail="Measured impact" />
          <Metric value={`${stats.streak} days`} label="Active streak" detail={`Level ${stats.level}`} />
          <Metric value={`${stats.xp} XP`} label="Growth points" detail={`${stats.forestTrees || Math.floor(stats.xp / 200)} trees grown`} />
        </div>
      </section>

      <section className="eco-next-action" aria-labelledby="next-action-title">
        <span className="eco-eyebrow">Next action</span>
        <div className="eco-action-copy">
          <div>
            <h3 id="next-action-title">Log one sustainable choice.</h3>
            <p>Keep your impact log current to grow your forest and streak.</p>
          </div>
          <button id="qa-track" onClick={() => onQuickAction("track")} className="eco-primary-button">
            Log an action <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section aria-labelledby="quick-links-title">
        <h3 id="quick-links-title" className="eco-eyebrow">Explore GreenSteps</h3>
        <div className="eco-quick-grid">
          <button onClick={() => onQuickAction("challenges")} className="eco-quick-link"><Zap size={18} /><span>Tasks</span></button>
          <button onClick={() => onQuickAction("coach")} className="eco-quick-link"><MessageSquare size={18} /><span>Coach</span></button>
          <button onClick={() => onQuickAction("family")} className="eco-quick-link"><Leaf size={18} /><span>Family</span></button>
          <button onClick={() => onQuickAction("leaderboard")} className="eco-quick-link"><Droplets size={18} /><span>Community</span></button>
        </div>
      </section>

      <section className="eco-challenge-list" aria-labelledby="daily-challenges-title">
        <div className="eco-section-heading">
          <h3 id="daily-challenges-title" className="eco-eyebrow">Today&apos;s actions</h3>
          <button onClick={() => onQuickAction("challenges")} className="eco-text-button">All tasks <ArrowRight size={14} /></button>
        </div>
        {activeChallenges.length ? activeChallenges.map((challenge) => (
          <article key={challenge.id} className="eco-challenge-row">
            <span className="eco-challenge-icon" aria-hidden="true">{challenge.emoji}</span>
            <div>
              <h4>{challenge.title}</h4>
              <p>{challenge.description}</p>
              <span className="eco-xp">+{challenge.rewardXP} XP · {challenge.timeEstimate}</span>
            </div>
            <button id={`btn-complete-on-dash-${challenge.id}`} onClick={() => onCompleteChallenge(challenge.id)} className="eco-complete-button">Done</button>
          </article>
        )) : (
          <div className="eco-empty-state">All actions are logged. Return tomorrow for a fresh set of steps.</div>
        )}
      </section>
    </div>
  );
}
