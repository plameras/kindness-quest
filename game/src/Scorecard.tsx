import {useState, type Ref} from 'react';
import {missionBadges, type Progress} from './progress';
import {badges, missions} from './story';

export function Scorecard({progress, motion, headingRef, onCelebrate}: {
  progress: Progress;
  motion: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onCelebrate: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const totalBadges = missions.flatMap(missionBadges).length;

  function reveal() {
    if (!revealed) onCelebrate();
    setRevealed(!revealed);
  }

  return <section className="quest-scorecard" aria-labelledby="scorecard-title">
    <div className="quest-finale">
      <div className="eyebrow">✦ QUEST COMPLETE</div>
      <h1 id="scorecard-title" tabIndex={-1} ref={headingRef}>You finished the quest!</h1>
      <p>You earned the <strong>Golden Kindness Badge</strong> by finishing every mission.</p>
      <button type="button" className="gold-badge" onClick={reveal}
        aria-expanded={revealed} aria-controls="quest-congratulations">
        <span className={revealed && motion ? 'gold-medal medal-reveal' : 'gold-medal'} aria-hidden="true">✦</span>
        <span>{revealed ? 'Close congratulations' : 'Tap your badge for a surprise'}</span>
      </button>
      <div id="quest-congratulations" hidden={!revealed} role="status">
        {revealed && <p className="quest-message"><strong>Congratulations, Kindness Champion!</strong><br/>
          You noticed when someone needed help, offered support, and knew when to tell a trusted adult.
        </p>}
      </div>
    </div>

    <div className="quest-summary">
      <h2>Quest scorecard</h2>
      <p>{progress.completed.length} of {missions.length} missions completed · {progress.badges.length} of {totalBadges} skill badges collected</p>
      <div className="quest-missions">
        {missions.map(mission => {
          const earned = missionBadges(mission).filter(badge => progress.badges.includes(badge));
          return <article className="quest-mission" key={mission.title}>
            <h3><span aria-hidden="true">{mission.icon}</span> {mission.title}</h3>
            <ul>{earned.map(badge => <li key={badge}><span aria-hidden="true">✓</span> {badges[badge].name}</li>)}</ul>
          </article>;
        })}
      </div>
      <p className="quest-reflection"><strong>Think about your school.</strong> {missions[missions.length - 1].reflection}</p>
    </div>
  </section>;
}
