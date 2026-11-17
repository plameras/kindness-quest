import {useState} from 'react';
import {Face} from './Face';

export function GameLogo({motion}: {motion: boolean}) {
  const [wave, setWave] = useState(0);

  return <div className="brand game-brand">
    <button type="button" className={motion ? 'logo-mascot animated' : 'logo-mascot'}
      aria-label="Wave hello to the Kindness Quest mascot" onClick={() => setWave(count => count + 1)}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <rect x="3" y="3" width="74" height="74" rx="23" fill="#734cbc"/>
        <path d="M12 25l3-6 3 6 6 3-6 3-3 6-3-6-6-3z" fill="#ffe39a"/>
        <ellipse cx="41" cy="72" rx="22" ry="4" fill="#533281"/>
        <g key={wave} className="mascot-body">
          <path d="M31 66v6m17-6v6" stroke="#382b45" strokeWidth="7" strokeLinecap="round"/>
          <rect x="25" y="46" width="31" height="22" rx="10" fill="#ec8b78"/>
          <path d="M27 53l-8 9" stroke="#ec8b78" strokeWidth="7" strokeLinecap="round"/>
          <circle cx="18" cy="63" r="4" fill="#b87552"/>
          <g className="mascot-hand">
            <path d="M53 53l9-5 1-12" stroke="#ec8b78" strokeWidth="7"
              fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="63" cy="34" r="4.5" fill="#b87552"/>
          </g>
          <circle cx="40" cy="29" r="18" fill="#382b45"/>
          <ellipse cx="40" cy="34" rx="15" ry="16" fill="#b87552"/>
          <path d="M25 28q1-17 16-17 14 0 16 18-9-1-16-9-6 10-16 8" fill="#382b45"/>
          <Face expression="smile" transform="translate(40 33) scale(.9)"/>
        </g>
      </svg>
    </button>
    <div className="game-wordmark"><span>Kindness</span> <span>Quest<span className="wordmark-star" aria-hidden="true">✦</span></span>
      <small>SCHOOLYARD ADVENTURES</small>
    </div>
  </div>;
}
