import type {CardArt} from './story';

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

export function BusScene() {
  return <svg className="bus-scene" viewBox="0 0 720 330" role="img" aria-label="Inside a school bus. Ari is seated with their backpack by the aisle.">
    <path fill="#ffdc9e" d="M0 0h720v330H0z"/>
    <path fill="#edae67" d="M0 153h720v177H0z"/>
    {[55, 212, 369, 526].map(x => <g key={x} transform={`translate(${x} 41)`}>
      <rect width="139" height="103" rx="13" fill="#b47b6c"/>
      <rect x="7" y="7" width="125" height="89" rx="8" fill="#bce0ee"/>
      <path d="M7 82q27-30 57-12t68-7v25q0 8-8 8H15q-8 0-8-8z" fill="#95bf9a"/>
      <path d="M70 7v89" stroke="#b47b6c" strokeWidth="5"/>
    </g>)}
    <path d="M0 281h720v49H0z" fill="#ad8075"/>
    <path d="M0 283h720" stroke="#f6c17d" strokeWidth="5"/>
    {[77, 300, 520].map(x => <g key={x} transform={`translate(${x} 180)`}>
      <rect width="112" height="82" rx="20" fill="#a77bb6"/>
      <rect x="5" y="7" width="102" height="60" rx="15" fill="#bd99ce"/>
      <path d="M21 82v17m72-17v17" stroke="#69496e" strokeWidth="7" strokeLinecap="round"/>
    </g>)}
    <g transform="translate(358 213)">
      <ellipse cy="62" rx="43" ry="8" fill="#916367" opacity=".4"/>
      <rect x="-22" y="4" width="44" height="44" rx="14" fill="#628f83"/>
      <path d="M-10 43v16m20-16v16" stroke="#483757" strokeWidth="10" strokeLinecap="round"/>
      <circle cy="-16" r="25" fill="#47324d"/>
      <ellipse cy="-11" rx="20" ry="21" fill="#b87556"/>
      <path d="M-20-17q4-26 28-17 10 5 12 16-14-3-22-12-6 12-18 13" fill="#47324d"/>
      <path d="M-7-11h1m12 0h1m-10 10q3-3 6 0" stroke="#483044" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="-22" y="-65" width="44" height="19" rx="8" fill="#fff8ee"/>
      <text y="-52" textAnchor="middle" fill="#493960" fontSize="11" fontWeight="800">ARI</text>
    </g>
    <g transform="translate(406 237)" stroke="#835269" strokeWidth="4" strokeLinejoin="round">
      <path d="M10 9V3h13v6" fill="none"/>
      <rect y="9" width="34" height="38" rx="11" fill="#e98976"/>
      <path d="M6 29h22v14H6z" fill="#ffb392"/>
    </g>
  </svg>;
}
