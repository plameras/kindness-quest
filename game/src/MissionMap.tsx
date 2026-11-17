import {useState, type RefObject} from 'react';
import {badges, missions} from './story';
import {missionBadges, type Progress} from './progress';

const stops = [{x:24,y:76}, {x:71,y:57}, {x:28,y:36}, {x:70,y:17}];

function Landmark({index}: {index:number}) {
  return <svg viewBox="0 0 140 100" aria-hidden="true">
    <ellipse cx="70" cy="88" rx="60" ry="9" fill="#345e4925"/>
    {index === 0 ? <>
      <path d="M17 83L32 22h67l23 61M32 22l20 61M99 22L80 83" stroke="#9b654d" strokeWidth="7" fill="none" strokeLinejoin="round"/>
      <path d="M49 25v37m33-37v37" stroke="#f7e7b9" strokeWidth="3"/>
      <path d="M43 63h45" stroke="#e99b42" strokeWidth="8" strokeLinecap="round"/>
      <path d="M97 33l23 37h-16L88 44" fill="#f6a869" stroke="#fff2c5" strokeWidth="3"/>
    </> : index === 2 ? <>
      <rect x="13" y="31" width="112" height="49" rx="12" fill="#f7bd45" stroke="#b88326" strokeWidth="3"/>
      {[25,48,71,94].map(x=><rect key={x} x={x} y="40" width="17" height="18" rx="3" fill="#bce7e6"/>)}
      <path d="M17 65h106" stroke="#bb8437" strokeWidth="3"/><circle cx="37" cy="80" r="11" fill="#3d4956"/><circle cx="101" cy="80" r="11" fill="#3d4956"/>
      <circle cx="37" cy="80" r="5" fill="#e8e6d5"/><circle cx="101" cy="80" r="5" fill="#e8e6d5"/>
    </> : <>
      <rect x="23" y="39" width="94" height="47" rx="4" fill={index===1?'#fff0cb':'#d5d9f5'}/>
      <path d="M12 40L70 9l58 31z" fill={index===1?'#df8069':'#7865aa'}/>
      <rect x="58" y="56" width="24" height="30" rx="4" fill="#6e8d9b"/>
      {[32,91].map(x=><rect key={x} x={x} y="51" width="17" height="18" rx="3" fill="#a8dce4" stroke="#fff" strokeWidth="3"/>)}
      <rect x="45" y="29" width="50" height="18" rx="4" fill="#fffaf0"/>
      <text x="70" y="42" textAnchor="middle" fontSize="10" fontWeight="900" fill="#554163">{index===1?'CAFÉ':'BOOKS'}</text>
      {index===3&&<path d="M94 80v-6h7v6h7v-6h7v6" stroke="#c28c5b" strokeWidth="5"/>}
    </>}
  </svg>;
}

export function MissionMap({progress,motion,headingRef,currentMission,onPlay,onScorecard,onHover}: {
  progress:Progress; motion:boolean; currentMission:number; headingRef:RefObject<HTMLHeadingElement|null>;
  onPlay:(index:number)=>void; onScorecard:()=>void; onHover:()=>void;
}) {
  const next = missions.findIndex((_,i)=>!progress.completed.includes(i));
  const [selected,setSelected] = useState(next<0?3:next);
  const allDone = next === -1;
  const locked = (i:number)=>!missions.slice(0,i).every((_,n)=>progress.completed.includes(n));
  const item = missions[selected];
  const complete = progress.completed.includes(selected);
  return <section className={`island-map ${motion?'map-motion':''}`} aria-label="Kindness Island mission map">
    <div className="island-heading"><div><div className="eyebrow">FOUR STOPS · ONE KINDER SCHOOL</div><h2 ref={headingRef} tabIndex={-1}>Welcome to Kindness Island!</h2></div><span className="island-counter">🚩 {progress.completed.length} / 4 explored</span></div>
    <p className="map-instructions">Follow the trail. Tap a place to discover your mission!</p>
    <div className="island-world">
      <svg className="island-scenery" viewBox="0 0 900 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="grass" x2="0.6" y2="1"><stop stopColor="#c5e98c"/><stop offset="1" stopColor="#79ba76"/></linearGradient><pattern id="water" width="90" height="60" patternUnits="userSpaceOnUse"><path d="M10 30q15 9 30 0" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="3"/></pattern></defs>
        <rect width="900" height="1000" fill="#afdce3"/><rect width="900" height="1000" fill="url(#water)"/>
        <path d="M95 151Q70 55 243 53L680 50Q837 60 829 193L852 781Q835 939 669 944L222 941Q57 931 60 792Z" fill="#607f68" transform="translate(0 23)"/>
        <path d="M95 151Q70 55 243 53L680 50Q837 60 829 193L852 781Q835 939 669 944L222 941Q57 931 60 792Z" fill="url(#grass)" stroke="#d3e99e" strokeWidth="10"/>
        <path d="M72 650Q280 570 405 690T838 718" fill="none" stroke="#daeed1" strokeWidth="48"/>
        <path d="M72 650Q280 570 405 690T838 718" fill="none" stroke="#72c9da" strokeWidth="31"/>
        <path d="M213 864Q90 719 326 702T639 560Q805 429 457 423T236 340Q111 197 414 215T625 162L740 100" fill="none" stroke="#6d995c" strokeWidth="53" strokeLinecap="round" opacity=".25"/>
        <path d="M213 864Q90 719 326 702T639 560Q805 429 457 423T236 340Q111 197 414 215T625 162L740 100" fill="none" stroke="#f6e4b3" strokeWidth="38" strokeLinecap="round"/>
        <path d="M213 864Q90 719 326 702T639 560Q805 429 457 423T236 340Q111 197 414 215T625 162L740 100" fill="none" stroke="#c7ad7e" strokeWidth="3" strokeDasharray="3 18"/>
        <g transform="translate(370 660) rotate(19)"><rect width="100" height="58" rx="5" fill="#bb8656"/>{[5,20,35,50,65,80,95].map(x=><path key={x} d={`M${x} 0v58`} stroke="#f7cf93" strokeWidth="4"/>)}<path d="M0 0h100M0 58h100" stroke="#855c3e" strokeWidth="7"/></g>
        {[[142,176],[738,352],[122,475],[746,844],[485,825],[485,100],[125,851],[760,102]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><ellipse cy="30" rx="30" ry="10" fill="#3b754735"/><path d="M0 0v30" stroke="#966b46" strokeWidth="9"/><circle cy="-9" r="31" fill={i%2?'#4d9468':'#5fa66d'}/><circle cx="-10" cy="-18" r="16" fill="#7cbd77"/></g>)}
        {Array.from({length:26},(_,i)=><g key={i} transform={`translate(${110+(i*137)%670} ${90+(i*193)%790})`}><path d="M0 0v8" stroke="#5e9b62" strokeWidth="2"/><circle r="4" fill={i%2?'#fff5c6':'#f7ca6b'}/></g>)}
      </svg>
      <span className="island-start" role="img" aria-label="Home: your adventure starts here">
        <svg viewBox="0 0 80 80" aria-hidden="true"><ellipse cx="40" cy="72" rx="30" ry="5" fill="#41633b33"/><rect x="17" y="33" width="46" height="35" rx="4" fill="#fff4d4" stroke="#b18b59" strokeWidth="2"/><path d="M9 36L40 10l31 26" fill="#dc8068" stroke="#9b604e" strokeWidth="4" strokeLinejoin="round"/><rect x="33" y="46" width="15" height="22" rx="3" fill="#7957aa"/><rect x="22" y="43" width="9" height="10" rx="2" fill="#9dd4df"/><rect x="51" y="43" width="9" height="10" rx="2" fill="#9dd4df"/><circle cx="43" cy="58" r="1.5" fill="#ffe19a"/><path d="M38 24l2-4 2 4 4 2-4 2-2 4-2-4-4-2z" fill="#ffe6a2"/></svg>
        <strong>START</strong>
      </span>
      {missions.map((mission,i)=>{
        const earned = missionBadges(mission).filter(b=>progress.badges.includes(b)).length;
        const done = progress.completed.includes(i);
        return <button key={mission.title} className={`island-stop stop-${i} ${locked(i)?'stop-locked':''} ${done?'stop-complete':''} ${next===i?'stop-next':''} ${selected===i?'stop-selected':''}`} style={{left:`${stops[i].x}%`,top:`${stops[i].y}%`}} aria-pressed={selected===i} aria-label={`${mission.title}, ${locked(i)?'locked':done?'completed':'available'}, ${earned} of 3 badges. Show mission details.`} onPointerEnter={event => { if (i === currentMission && event.pointerType !== 'touch') onHover(); }} onFocus={() => { if (i === currentMission) onHover(); }} onClick={()=>setSelected(i)}>
          <span className="stop-flag">{done?'🚩':locked(i)?'🔒':`LEVEL ${i+1}`}</span><Landmark index={i}/><strong>{mission.title}</strong><span className="stop-stars" aria-hidden="true">{[0,1,2].map(n=><span key={n} className={n<earned?'earned-star':''}>★</span>)}</span>
        </button>;
      })}
      <button className="island-trophy" disabled={!allDone} onClick={onScorecard} aria-label={allDone?'Open your final quest scorecard':'Complete all four missions to unlock the golden badge'}><span>🏆</span><strong>{allDone?'Your scorecard!':'Golden badge'}</strong><small>{allDone?'Tap to celebrate':'Finish all 4 missions'}</small></button>
    </div>
    <div className="map-detail" aria-live="polite"><div><span className="eyebrow">LEVEL {selected+1} · {locked(selected)?'COMING UP':complete?'MISSION COMPLETE':'READY TO EXPLORE'}</span><h3>{item.title}</h3><p>{locked(selected)?`Finish ${missions[selected-1].title} to open this stop.`:item.setting + '. A small act of kindness can make a big difference.'}</p><div className="map-skill-list">{missionBadges(item).map(b=><span key={b} className={progress.badges.includes(b)?'collected-skill':''}>{progress.badges.includes(b)?'✓':badges[b].icon} {badges[b].name}</span>)}</div></div><button className="primary" disabled={locked(selected)} onClick={()=>onPlay(selected)}>{locked(selected)?'🔒 Locked':complete?'Replay mission ↻':'Let’s go! →'}</button></div>
    <p className="map-key">🚩 Completed <span>✦ Next adventure</span> 🔒 Unlock by finishing the previous mission</p>
  </section>;
}
