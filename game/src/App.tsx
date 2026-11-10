import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {createRoot} from 'react-dom/client';
import {badges, missions, stepIds, type Badge, type Step, type StepId} from './story';
import {ChallengeCards} from './ChallengeCards';
import {Scene} from './Scene';
import {BusScene, ChoiceArt} from './BusScene';
import {missionBadges, progressKey, readProgress} from './progress';
import {GameSound} from './sound';
import './style.css';

type Feedback = Step['choices'][number] & {earnedBadge?: Badge};
const soundKey = 'kindness-quest-sound';
const confettiColors = ['#9362ce', '#ffb354', '#60aa80', '#ee799a', '#56a6d9'];
const confettiPieces = Array.from({length: 20}, (_, index) => {
  const angle = index * Math.PI * 2 / 20;
  const distance = index % 2 === 0 ? 105 : 70;
  return {
    '--confetti-x': `${Math.cos(angle) * distance}px`,
    '--confetti-y': `${Math.sin(angle) * distance + 26}px`,
    '--confetti-spin': `${(index % 2 === 0 ? 1 : -1) * (160 + index * 23)}deg`,
    backgroundColor: confettiColors[index % confettiColors.length],
  } as CSSProperties;
});

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [missionIndex, setMissionIndex] = useState(0);
  const [stepId, setStepId] = useState<StepId | 'finish'>('notice');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem(soundKey) === 'on'; }
    catch { return false; }
  });
  const sound = useRef<GameSound | null>(null);
  const [view, setView] = useState<'play' | 'map'>('play');
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const initialRender = useRef(true);
  const mission = missions[missionIndex];
  const step = mission.steps[stepId === 'finish' ? 'report' : stepId];
  const stepNumber = stepId === 'finish' ? stepIds.length : stepIds.indexOf(stepId) + 1;
  const levelBadges = missionBadges(mission);
  const collected = levelBadges.filter(badge => progress.badges.includes(badge)).length;
  const allBadgesCollected = collected === levelBadges.length;
  const missingStep = stepIds.find(id => !progress.badges.includes(mission.badgeByStep[id]));
  const needsPractice = feedback?.next === 'finish' && missingStep !== undefined;
  const finished = stepId === 'finish';
  const nextMission = missions[missionIndex + 1];
  const allMissionsComplete = progress.completed.length === missions.length;
  const unlocked = (i: number) => missions.slice(0, i).every((_, index) => progress.completed.includes(index));

  useEffect(() => {
    try { localStorage.setItem(progressKey, JSON.stringify(progress)); }
    catch { /* Progress stays available for this visit. */ }
  }, [progress]);

  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    (feedback ? feedbackHeading : heading).current?.focus();
  }, [feedback, stepId, view, missionIndex]);

  function toggleSound() {
    const enabled = !soundOn;
    setSoundOn(enabled);
    try { localStorage.setItem(soundKey, enabled ? 'on' : 'off'); }
    catch { /* The preference still applies for this visit. */ }
    if (enabled) void (sound.current ??= new GameSound()).play('ready');
    else sound.current?.stop();
  }

  function start(index: number) {
    setCelebrating(false);
    setMissionIndex(index);
    setStepId('notice');
    setFeedback(null);
    setView('play');
  }

  function replayFromMap(index: number) {
    const badgesToReset = missionBadges(missions[index]);
    setProgress(previous => ({
      completed: previous.completed.filter(level => level !== index),
      badges: previous.badges.filter(badge => !badgesToReset.includes(badge)),
    }));
    start(index);
  }

  function choose(choice: Step['choices'][number]) {
    const earnedBadge = choice.badge && !progress.badges.includes(choice.badge) ? choice.badge : undefined;
    const completesBadgeSet = earnedBadge !== undefined &&
      levelBadges.includes(earnedBadge) && collected + 1 === levelBadges.length;
    setFeedback({...choice, earnedBadge});
    if (soundOn) {
      const cue = completesBadgeSet ? 'victory' : earnedBadge ? 'badge' : choice.next ? 'correct' : 'retry';
      void (sound.current ??= new GameSound()).play(cue);
    }
    if (earnedBadge) {
      if (motion && completesBadgeSet) setCelebrating(true);
      setProgress(previous => previous.badges.includes(earnedBadge) ? previous :
        {...previous, badges: [...previous.badges, earnedBadge]});
    }
  }

  function advance() {
    const next = feedback?.next;
    setFeedback(null);
    if (!next) return;
    if (next === 'finish') {
      if (missingStep) {
        setStepId(missingStep);
        return;
      }
      if (soundOn) void (sound.current ??= new GameSound()).play('finish');
      setProgress(previous => previous.completed.includes(missionIndex) ? previous :
        {...previous, completed: [...previous.completed, missionIndex]});
    }
    setStepId(next);
  }

  return <>
    <header className="topbar"><div className="top-inner">
      <div className="brand"><span className="logo" aria-hidden="true">✦</span><div>Kindness Quest<small>SCHOOLYARD ADVENTURES</small></div></div>
      <div className="header-actions">
        <button type="button" className="map-button" onClick={toggleSound} aria-label="Sound effects" aria-pressed={soundOn}>
          Sound {soundOn ? 'on' : 'off'}
        </button>
        <button type="button" className="map-button" onClick={() => { setCelebrating(false); setView(view === 'map' ? 'play' : 'map'); }}>{view === 'map' ? '← Back to mission' : '▦  Mission map'}</button>
      </div>
    </div></header>
    <main>
      <div className="intro">
        <div className="eyebrow"><span aria-hidden="true">✧</span> {view === 'play' ? `MISSION 0${missionIndex + 1} / 0${missions.length}` : 'YOUR ADVENTURE'}</div>
        <h1>{view === 'play' ? mission.title : 'Mission map'}</h1>
        <p>{view === 'play' ? 'Notice what’s happening, then choose a safe way to help.' : 'Try each mission and collect skills you can use at school.'}</p>
      </div>
      <div className="layout">
        {view === 'play' ? <section className="mission-card" aria-label={mission.title}>
          <div className="scene-frame">
            {missionIndex === 2
              ? <BusScene choice={feedback} stopped={stepId === 'report' || finished} motion={motion}/>
              : <Scene lunch={missionIndex === 1} action={feedback?.scene} motion={motion}/>}
            {feedback && <div key={feedback.cue} className={motion ? 'scene-cue scene-cue-enter' : 'scene-cue'}>{feedback.cue}</div>}
            <button type="button" className="motion-button" onClick={() => { setCelebrating(false); setMotion(value => !value); }}>
              {motion ? 'Pause motion' : 'Play motion'}
            </button>
            <span className="setting"><i />{mission.setting}</span>
          </div>
          <div className="mission-content">
            {!finished && <div className="step-strip">
              <span>STEP {stepNumber} OF 3</span>
              <div className="ticks" aria-hidden="true">{[1,2,3].map(i => <b key={i} className={i <= stepNumber ? 'lit' : ''}/>)}</div>
            </div>}
            {finished ? <>
              <div className="eyebrow">✦ MISSION COMPLETE</div>
              <h2 tabIndex={-1} ref={heading}>{allMissionsComplete ? 'You finished the quest!' : 'You made a difference.'}</h2>
              <p className="story"><strong>Think about your school.</strong> {mission.reflection}</p>
              <div className="end-actions">
                {nextMission
                  ? <button className="primary" onClick={() => start(missionIndex + 1)}>Play {nextMission.title} →</button>
                  : <button className="primary" onClick={() => setView('map')}>View mission map →</button>}
                <button className="secondary" onClick={() => start(missionIndex)}>Replay mission</button>
              </div>
            </> : feedback ? <div className={feedback.next ? 'feedback good' : 'feedback retry'}>
              <div className="eyebrow">{feedback.next ? '✦  GOOD THINKING' : '↻  TAKE ANOTHER LOOK'}</div>
              <h2 tabIndex={-1} ref={feedbackHeading}>{feedback.next ? 'Here’s what happened' : 'Try another choice'}</h2>
              <p className="story">{feedback.feedback}</p>
              {feedback.earnedBadge && <p className="earned">{badges[feedback.earnedBadge].icon} Skill collected · {badges[feedback.earnedBadge].name}</p>}
              {needsPractice && <p className="story">
                One more skill to practice. <strong>{badges[mission.badgeByStep[missingStep]].name}.</strong> {badges[mission.badgeByStep[missingStep]].detail}
              </p>}
              <button className="primary" onClick={advance}>
                {needsPractice ? 'Practice the missing skill ↻' : feedback.next === 'finish' ? 'Finish mission →' : feedback.next ? 'Continue →' : 'Try again ↻'}
              </button>
            </div> : <>
              <h2 tabIndex={-1} ref={heading}>{step.prompt}</h2>
              <p className="story">{step.story}</p>
              {step.challenge ? <ChallengeCards challenge={step.challenge} onCheck={correct => {
                const outcome = step.choices.find(choice => Boolean(choice.badge) === correct);
                if (outcome) choose(outcome);
              }}/> : <div className={step.choices[0]?.art ? 'choices illustrated-choices' : 'choices'}>{step.choices.map((choice, i) =>
                <button key={choice.label} onClick={() => choose(choice)}>{choice.art ? <ChoiceArt art={choice.art}/> : <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span>}<span>{choice.label}</span><span className="chevron" aria-hidden="true">›</span></button>
              )}</div>}
            </>}
          </div>
        </section> : <section className="map-card" aria-label="Missions">
          <h2 tabIndex={-1} ref={heading}>Choose a mission</h2>
          {missions.map((item, i) => {
            const required = missionBadges(item);
            const count = required.filter(badge => progress.badges.includes(badge)).length;
            const locked = !unlocked(i);
            const complete = progress.completed.includes(i);
            return <div className="mission-row" key={item.title}>
            <span className="badge-icon" aria-hidden="true">{item.icon}</span>
              <div><strong>{item.title}</strong><small>{complete ? 'Completed · ' : ''}{count} of {required.length} badges</small></div>
              <button className="secondary" disabled={locked} onClick={() => complete ? replayFromMap(i) : start(i)}>{locked ? 'Locked' : complete ? 'Replay' : 'Play'}</button>
            </div>;
          })}
        </section>}
        <aside>
          {view === 'play' && <section className={allBadgesCollected ? 'skill-card badge-victory' : 'skill-card'}>
            <div className="eyebrow">✧  YOUR PROGRESS</div>
            <h2>Skill badges</h2>
            <div className="score"><strong>{collected}<span> / {levelBadges.length}</span></strong><span>collected</span></div>
            <progress value={collected} max={levelBadges.length} aria-label="Skill badges collected for this mission"/>
            <div role="status">
              {allBadgesCollected && <p className="badge-victory-message"><span aria-hidden="true">✦</span> All skill badges collected!</p>}
            </div>
            {celebrating && motion && <div className="badge-confetti" aria-hidden="true" onAnimationEnd={() => setCelebrating(false)}>
              {confettiPieces.map((style, index) => <i key={index} style={style}/>)}
            </div>}
            <div className="badge-list">{levelBadges.map(key => {
              const badge = badges[key];
              const earned = progress.badges.includes(key);
              return <div className={'badge '+(earned ? 'unlocked' : '')} key={key}>
                <span className="badge-icon" aria-hidden="true">{badge.icon}</span><div><strong>{badge.name}</strong><small>{earned ? 'Collected' : badge.detail}</small></div>
                {earned && <span className="check" aria-hidden="true">✓</span>}
              </div>;
            })}</div>
          </section>}
          <div className="tip"><span aria-hidden="true">♥</span><div><strong>You can ask for help</strong><p>If something like this happens to you or someone you know, you can talk to an adult you trust.</p></div></div>
        </aside>
      </div>
      <footer><span>✦</span> KINDNESS QUEST <span>·</span> SCHOOLYARD ADVENTURES</footer>
    </main>
  </>;
}
createRoot(document.getElementById('root')!).render(<App/>);
