import {Face} from './Face';
import {reactions, type Expression} from './expressions';
import type {BusSequenceStep, CardArt, Step} from './story';

const illustrations: Record<CardArt, {color: string; path: string}> = {
  repeat: {color: 'lavender', path: 'M49 21H24a11 11 0 0 0 0 22h5m13 0h7a11 11 0 0 0 0-22h-4M42 14l7 7-7 7m-8 8-7 7 7 7'},
  joke: {color: 'peach', path: 'M13 17h46v28H35L24 54v-9H13zM26 28h1m17 0h1m-17 7q8 10 16 0'},
  backpack: {color: 'mint', path: 'M18 30a18 18 0 0 1 36 0v23H18zM29 14v-3h14v3M25 39h22v14M31 31h10'},
  seat: {color: 'mint', path: 'M19 14h16v24h21v10H19zM22 48v7m30-7v7M46 19q-7-8-11 0 0 6 11 12 11-6 11-12-4-8-11 0z'},
  adult: {color: 'lavender', path: 'M24 29a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 53v-5a14 14 0 0 1 28 0v5zM40 12h22v19H49l-9 6zM46 20h10'},
  shout: {color: 'peach', path: 'M13 25h13l19-10v33L26 38H13zM20 38l4 13h9l-4-12m23-14 8-5m-8 12h10m-10 7 8 5'},
};

export function ChoiceArt({art}: {art: CardArt}) {
  const {color, path} = illustrations[art];
  return <span className={`choice-art ${color}`} aria-hidden="true">
    <svg viewBox="0 0 72 64"><path d={path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>;
}

function BusPerson({label, shirt, seated = false, expression}: {label: string; shirt: string; seated?: boolean; expression: Expression}) {
  return <g>
    <ellipse cy="61" rx="27" ry="6" fill="#6a4752" opacity=".2"/>
    <path d={seated ? "M-9 40l-5 7v8m23-15 5 7v8" : "M-9 41v17m18-17v17"} stroke="#483757" strokeWidth="9" strokeLinecap="round"/>
    <rect x="-20" y="5" width="40" height="42" rx="13" fill={shirt}/>
    <circle cy="-15" r="23" fill="#55374b"/>
    <ellipse cy="-10" rx="18" ry="20" fill="#d99a72"/>
    <path d="M-17-17q2-23 25-15l9 13q-10-2-17-9-5 8-17 11" fill="#55374b"/>
    <Face expression={expression} transform="translate(0 -10)"/>
    <rect x="-37" y="-62" width="74" height="18" rx="9" fill="#fff8ee"/>
    <text y="-49" textAnchor="middle" fill="#493960" fontSize="10" fontWeight="800">{label}</text>
  </g>;
}

const sequenceLabels: Record<BusSequenceStep, string> = {
  ride: 'Stay seated while the bus moves.',
  find: 'The bus stops. Walk to the teacher.',
  tell: 'Tell the teacher what happened.',
};

export function BusScene({choice, stopped, sequenceStep, motion}: {
  choice: Step['choices'][number] | null;
  stopped: boolean;
  sequenceStep?: BusSequenceStep;
  motion: boolean;
}) {
  const action = sequenceStep === 'tell' ? 'report' : choice?.scene;
  const expression = reactions(action);
  const parked = stopped || sequenceStep === 'find' || sequenceStep === 'tell';
  const playerX = parked ? (action === 'report' ? 492 : sequenceStep === 'find' ? 458 : choice ? 427 : 132)
    : action === 'support' ? 257 : 132;
  const playerY = action === 'unsafe' ? 185 : 218;
  const description = sequenceStep ? sequenceLabels[sequenceStep]
    : parked ? 'The bus is stopped. Ari and you are inside with a teacher.'
    : 'Inside a moving school bus. Ari is seated with their backpack by the aisle.';
  return <svg className={`bus-scene${motion ? ' moving' : ''}${parked ? ' parked' : ''}`}
    viewBox="0 0 720 330" role="img" aria-label={description}>
    <path fill="#ffdc9e" d="M0 0h720v330H0z"/>
    <path fill="#edae67" d="M0 153h720v177H0z"/>
    {[55, 212, 369, 526].map(x => <g key={x} transform={`translate(${x} 41)`}>
      <rect width="139" height="103" rx="13" fill="#b47b6c"/>
      <rect x="7" y="7" width="125" height="89" rx="8" fill="#bce0ee"/>
      <svg x="7" y="7" width="125" height="89" viewBox="0 0 125 89" overflow="hidden" aria-hidden="true">
        <g className="bus-hills">
          {[0, 240].map(offset => <path key={offset} transform={`translate(${offset} 0)`}
            d="M0 75q30-30 60-12t60-3q30-20 60 3t60 12v14H0z" fill="#95bf9a"/>)}
        </g>
        <g className="bus-trees">
          {[22, 125, 182, 262, 365, 422].map(tree => <g key={tree} transform={`translate(${tree} 0)`}>
            <path d="M0 75v14" stroke="#8c776e" strokeWidth="4"/>
            <ellipse cy="70" rx="10" ry="14" fill="#5b947d"/>
          </g>)}
        </g>
      </svg>
      <path d="M70 7v89" stroke="#b47b6c" strokeWidth="5"/>
    </g>)}
    <path d="M0 281h720v49H0z" fill="#ad8075"/>
    <path d="M0 283h720" stroke="#f6c17d" strokeWidth="5"/>
    {[77, 300, 520].map(x => <g key={x} transform={`translate(${x} 180)`}>
      <rect width="112" height="82" rx="20" fill="#a77bb6"/>
      <rect x="5" y="7" width="102" height="60" rx="15" fill="#bd99ce"/>
      <path d="M21 82v17m72-17v17" stroke="#69496e" strokeWidth="7" strokeLinecap="round"/>
    </g>)}
    <g transform={`translate(${playerX} ${playerY})`} className="bus-player">
      <BusPerson label="YOU" shirt="#ec8b78" expression={expression.player} seated={!parked && action !== 'unsafe'}/>
    </g>
    <g transform="translate(358 213)">
      <ellipse cy="62" rx="43" ry="8" fill="#916367" opacity=".4"/>
      <rect x="-22" y="4" width="44" height="44" rx="14" fill="#628f83"/>
      <path d="M-10 43v16m20-16v16" stroke="#483757" strokeWidth="10" strokeLinecap="round"/>
      <circle cy="-16" r="25" fill="#47324d"/>
      <ellipse cy="-11" rx="20" ry="21" fill="#b87556"/>
      <path d="M-20-17q4-26 28-17 10 5 12 16-14-3-22-12-6 12-18 13" fill="#47324d"/>
      <Face expression={expression.friend} transform="translate(0 -11)"/>
      <rect x="-22" y="-65" width="44" height="19" rx="8" fill="#fff8ee"/>
      <text y="-52" textAnchor="middle" fill="#493960" fontSize="11" fontWeight="800">ARI</text>
    </g>
    <g className="bus-player" transform={`translate(${action === 'report' ? 551 : 573} 218)`}>
      <BusPerson label="TEACHER" shirt="#795b9c" expression={expression.adult} seated={!parked}/>
    </g>
    <g key={choice?.label ?? 'bag'} transform="translate(406 237)">
    <g className={action === 'pattern' ? `bus-bag ${choice?.art === 'repeat' ? 'repeat' : ''}` : undefined}
      stroke="#835269" strokeWidth="4" strokeLinejoin="round">
      <path d="M10 9V3h13v6" fill="none"/>
      <rect y="9" width="34" height="38" rx="11" fill="#e98976"/>
      <path d="M6 29h22v14H6z" fill="#ffb392"/>
    </g>
    </g>
    {sequenceStep && <g className="bus-sequence-caption" transform="translate(360 108)">
      <rect x="-151" y="-16" width="302" height="32" rx="12" fill="#fffaf0"/>
      {sequenceStep === 'tell' && <path d="M114 15l19 15-2-15z" fill="#fffaf0"/>}
      <text y="5" textAnchor="middle" fill="#493960" fontSize="15" fontWeight="800">{sequenceLabels[sequenceStep]}</text>
    </g>}
  </svg>;
}
