import {useState} from 'react';
import {Face} from './Face';

type Character = {
  name: string;
  shirt: string;
  skin: string;
  hair: string;
  line: string;
};

export const questPlayer: Character = {
  name: 'You', shirt: '#ec8b78', skin: '#b87552', hair: '#382b45',
  line: 'I spotted patterns, helped classmates feel included, and asked adults for help!',
};

export const questCast: Character[][] = [
  [
    {name: 'Sam', shirt: '#8457b9', skin: '#a8664b', hair: '#362a44', line: 'Thanks for staying with me by the bench. I felt less alone.'},
    {name: 'Ms. Rivera', shirt: '#568d76', skin: '#e4a57f', hair: '#623746', line: 'Telling me where it happened helped me know how to follow up.'},
    {name: 'Classmate 1', shirt: '#e79955', skin: '#e6a982', hair: '#55383c', line: 'When someone asks me to stop, I need to listen.'},
    {name: 'Classmate 2', shirt: '#548eaa', skin: '#bd7a58', hair: '#402e4e', line: 'Next recess, I can help make sure everyone feels welcome.'},
  ],
  [
    {name: 'Jo', shirt: '#8457b9', skin: '#a8664b', hair: '#362a44', line: 'You made space for me at lunch. That meant a lot.'},
    {name: 'Mr. Lee', shirt: '#568d76', skin: '#e4a57f', hair: '#623746', line: 'You told me what happened and how often. Those details helped.'},
    {name: 'Classmate 1', shirt: '#e79955', skin: '#e6a982', hair: '#55383c', line: 'An empty seat is a chance to welcome someone.'},
    {name: 'Classmate 2', shirt: '#548eaa', skin: '#bd7a58', hair: '#402e4e', line: 'I can make room when someone wants to join us.'},
  ],
  [
    {name: 'Ari', shirt: '#628f83', skin: '#b87556', hair: '#47324d', line: 'Thanks for checking on me. It helped to know you were there.'},
    {name: 'Teacher', shirt: '#795b9c', skin: '#d99a72', hair: '#55374b', line: 'You stayed seated until the bus stopped, then told me what happened. Good thinking!'},
  ],
  [
    {name: 'Niko', shirt: '#6b56a2', skin: '#c78c67', hair: '#473247', line: 'Thanks for offering to stay with me while we got help.'},
    {name: 'Librarian', shirt: '#448579', skin: '#e0aa81', hair: '#473247', line: 'You found the clue and shared the facts. Now I know where to start.'},
  ],
];

export function ScorecardCast({characters, motion, label}: {
  characters: Character[];
  motion: boolean;
  label: string;
}) {
  const [active, setActive] = useState<string>();
  const [wave, setWave] = useState(0);
  const selected = characters.find(character => character.name === active);

  return <div className="scorecard-cast" role="group" aria-label={label}>
    <div className="cast-buttons">
      {characters.map(character => {
        const smiling = character.name === active;
        return <button type="button" className="cast-character" key={character.name}
          aria-pressed={smiling} onClick={() => { setActive(character.name); setWave(count => count + 1); }}>
          <svg viewBox="0 0 76 76" aria-hidden="true">
            <circle cx="38" cy="38" r="34" fill={smiling ? '#ffe4a0' : '#ece1f9'}/>
            <path d="M23 72v-9a15 15 0 0 1 30 0v9" fill={character.shirt}/>
            <path d="M24 57l-8 9" stroke={character.shirt} strokeWidth="7" strokeLinecap="round"/>
            <g key={smiling ? wave : 'rest'} className={smiling && motion ? 'cast-wave' : undefined}>
              <path d={smiling ? 'M51 56l9-7 1-10' : 'M52 57l8 9'} fill="none"
                stroke={character.shirt} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx={smiling ? 61 : 60} cy={smiling ? 38 : 67} r="4.5" fill={character.skin}/>
            </g>
            <circle cx="38" cy="30" r="17" fill={character.hair}/>
            <ellipse cx="38" cy="34" rx="14" ry="15" fill={character.skin}/>
            <path d="M24 29q1-16 14-16 11 0 14 14-8-1-13-7-5 8-15 9" fill={character.hair}/>
            <Face expression={smiling ? 'smile' : 'neutral'} transform="translate(38 34) scale(.9)"/>
          </svg>
          <span>{character.name}</span>
        </button>;
      })}
    </div>
    <div className="cast-reply" role="status">
      {selected ? <p><strong>{selected.name}</strong> “{selected.line}”</p> : <p>Tap a character to say hello.</p>}
    </div>
  </div>;
}
