import {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {badges, missions, type Badge, type Step} from './story';
import {Scene} from './Scene';
import {BusScene, ChoiceArt} from './BusScene';
import './style.css';

type Feedback = Step['choices'][number] & {earnedBadges: Badge[]};
const badgeKeys = Object.keys(badges) as Badge[];
type Progress = {completed: number[]; badges: Badge[]};
const empty: Progress = {completed: [], badges: []};
const storageKey = 'kindness-quest-v1';

function readProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (Array.isArray(saved?.completed) && Array.isArray(saved?.badges)) {
      return {
        completed: missions.map((_, i) => i).filter(i => saved.completed.includes(i)),
        badges: badgeKeys.filter(badge => saved.badges.includes(badge)),
      };
    }
  } catch { /* Play is still available when storage is disabled. */ }
  return empty;
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [missionIndex, setMissionIndex] = useState(0);
  const [stepId, setStepId] = useState('notice');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [view, setView] = useState<'play' | 'map'>('play');
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const initialRender = useRef(true);
  const mission = missions[missionIndex];
  const step = mission.steps[stepId];
  const stepNumber = ['notice','act','report'].indexOf(stepId) + 1;
  const finished = stepId === 'finish';
  const nextMission = missions[missionIndex + 1];
  const allMissionsComplete = progress.completed.length === missions.length;
  const unlocked = (i: number) => i === 0 || progress.completed.includes(i - 1);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); }
    catch { /* Progress stays available for this visit. */ }
  }, [progress]);

  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    (feedback ? feedbackHeading : heading).current?.focus();
  }, [feedback, stepId, view, missionIndex]);

  function start(index: number) {
    setMissionIndex(index);
    setStepId('notice');
    setFeedback(null);
    setView('play');
  }

  function choose(choice: Step['choices'][number]) {
    const earnedBadges = (choice.badges ?? []).filter(badge => !progress.badges.includes(badge));
    setFeedback({...choice, earnedBadges});
    if (earnedBadges.length) {
      setProgress(previous => ({...previous, badges: [...new Set([...previous.badges, ...earnedBadges])]}));
    }
  }

  function advance() {
    const next = feedback?.next;
    setFeedback(null);
    if (!next) return;
    if (next === 'finish') setProgress(previous => previous.completed.includes(missionIndex) ? previous :
      {...previous, completed: [...previous.completed, missionIndex]});
    setStepId(next);
  }

  return <>
    <header className="topbar"><div className="top-inner">
      <div className="brand"><span className="logo" aria-hidden="true">✦</span><div>Kindness Quest<small>SCHOOLYARD ADVENTURES</small></div></div>
      <button type="button" className="map-button" onClick={() => setView(view === 'map' ? 'play' : 'map')}>{view === 'map' ? '← Back to mission' : '▦  Mission map'}</button>
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
            <button type="button" className="motion-button" onClick={() => setMotion(value => !value)}>
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
              {feedback.earnedBadges.map(badge =>
                <p className="earned" key={badge}>{badges[badge].icon} Skill collected · {badges[badge].name}</p>
              )}
              <button className="primary" onClick={advance}>{feedback.next === 'finish' ? 'Finish mission →' : feedback.next ? 'Continue →' : 'Try again ↻'}</button>
            </div> : <>
              <h2 tabIndex={-1} ref={heading}>{step.prompt}</h2>
              <p className="story">{step.story}</p>
              <div className={step.choices[0]?.art ? 'choices illustrated-choices' : 'choices'}>{step.choices.map((choice, i) =>
                <button key={choice.label} onClick={() => choose(choice)}>{choice.art ? <ChoiceArt art={choice.art}/> : <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span>}<span>{choice.label}</span><span className="chevron" aria-hidden="true">›</span></button>
              )}</div>
            </>}
          </div>
        </section> : <section className="map-card" aria-label="Missions">
          <h2 tabIndex={-1} ref={heading}>Choose a mission</h2>
          {missions.map((item, i) => <div className="mission-row" key={item.title}>
            <span className="badge-icon" aria-hidden="true">{item.icon}</span>
            <div><strong>{item.title}</strong><small>{progress.completed.includes(i) ? 'Completed' : unlocked(i) ? item.setting : `Finish ${missions[i - 1].title} to unlock`}</small></div>
            <button className="secondary" disabled={!unlocked(i)} onClick={() => start(i)}>{!unlocked(i) ? 'Locked' : progress.completed.includes(i) ? 'Replay' : 'Play'}</button>
          </div>)}
        </section>}
        <aside>
          <section className="skill-card">
            <div className="eyebrow">✧  YOUR PROGRESS</div>
            <h2>Skill badges</h2>
            <div className="score"><strong>{progress.badges.length}<span> / {badgeKeys.length}</span></strong><span>collected</span></div>
            <progress value={progress.badges.length} max={badgeKeys.length} aria-label="Skill badges collected"/>
            <div className="badge-list">{badgeKeys.map(key => {
              const badge = badges[key];
              const earned = progress.badges.includes(key);
              return <div className={'badge '+(earned ? 'unlocked' : '')} key={key}>
                <span className="badge-icon" aria-hidden="true">{badge.icon}</span><div><strong>{badge.name}</strong><small>{earned ? 'Collected' : badge.detail}</small></div>
                {earned && <span className="check" aria-hidden="true">✓</span>}
              </div>;
            })}</div>
          </section>
          <div className="tip"><span aria-hidden="true">♥</span><div><strong>You can ask for help</strong><p>If something like this happens to you or someone you know, you can talk to an adult you trust.</p></div></div>
        </aside>
      </div>
      <footer><span>✦</span> KINDNESS QUEST <span>·</span> SCHOOLYARD ADVENTURES</footer>
    </main>
  </>;
}
createRoot(document.getElementById('root')!).render(<App/>);
