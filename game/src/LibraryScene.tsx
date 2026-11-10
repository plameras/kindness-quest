import {useState, type KeyboardEvent} from 'react';
import type {StepId} from './story';

export const libraryTargets = {
  notice: {x: 2, y: 0, name: 'Clue card', action: 'Pick up clue', icon: '▤'},
  act: {x: 4, y: 2, name: 'Niko', action: 'Check in', icon: '♡'},
  report: {x: 6, y: 1, name: 'Librarian', action: 'Talk to librarian', icon: '✦'},
};

const directions = {
  ArrowUp: {dx: 0, dy: -1, label: 'Move up', icon: '↑'},
  ArrowLeft: {dx: -1, dy: 0, label: 'Move left', icon: '←'},
  ArrowDown: {dx: 0, dy: 1, label: 'Move down', icon: '↓'},
  ArrowRight: {dx: 1, dy: 0, label: 'Move right', icon: '→'},
};

const columns = 7;
const rows = 4;
const tile = 68;
const boardLeft = 62;
const boardTop = 48;

export function LibraryScene({step, active, motion, onInteract}: {
  step: StepId;
  active: boolean;
  motion: boolean;
  onInteract: () => void;
}) {
  const [position, setPosition] = useState({x: 0, y: 3});
  const target = libraryTargets[step];
  const atTarget = position.x === target.x && position.y === target.y;

  function move(dx: number, dy: number) {
    if (!active) return;
    setPosition(previous => ({
      x: Math.max(0, Math.min(columns - 1, previous.x + dx)),
      y: Math.max(0, Math.min(rows - 1, previous.y + dy)),
    }));
  }

  function interact() {
    if (active && atTarget) onInteract();
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    const direction = directions[event.key as keyof typeof directions];
    if (direction) {
      event.preventDefault();
      move(direction.dx, direction.dy);
    } else if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      interact();
    }
  }

  return <div id="library-board" className="library-board" tabIndex={0} onKeyDown={handleKey}
    role="region" aria-label="Library movement area" aria-describedby="library-position">
    <svg viewBox="0 0 600 340" aria-hidden="true">
      <rect width="600" height="340" fill="#e8d9c5"/>
      <path d="M24 54v252m552-252v252" stroke="#ac7d69" strokeWidth="25" strokeLinecap="round"/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M17 ${63 + i * 21}h14m538 0h14`}
        stroke={['#f0c67f', '#8fb69c', '#9e81b7'][i % 3]} strokeWidth="7"/>)}
      {Array.from({length: columns * rows}, (_, i) => <rect key={i}
        x={boardLeft + (i % columns) * tile} y={boardTop + Math.floor(i / columns) * tile}
        width={tile - 3} height={tile - 3} rx="7" fill={(i + Math.floor(i / columns)) % 2 ? '#f6ead9' : '#fff5e8'}/>)}
      {Object.entries(libraryTargets).map(([id, place]) => <g key={id}
        transform={`translate(${boardLeft + place.x * tile + 32} ${boardTop + place.y * tile + 30})`}>
        <circle r="20" fill={id === step && active ? '#7550b6' : '#dac9e8'}/>
        <text textAnchor="middle" y="7" fill={id === step && active ? '#fff' : '#54396d'}
          fontSize="21" fontWeight="800">{place.icon}</text>
        <text textAnchor="middle" y="30" fill="#493960" fontSize="10" fontWeight="800">{place.name}</text>
      </g>)}
      <g className={motion ? 'library-player moving' : 'library-player'}
        transform={`translate(${boardLeft + position.x * tile + (atTarget ? 51 : 32)} ${boardTop + position.y * tile + 31})`}>
        <circle r="16" fill="#d36955" stroke="#fff5e8" strokeWidth="3"/>
        <text textAnchor="middle" y="4" fill="#fff" fontSize="10" fontWeight="900">YOU</text>
      </g>
    </svg>
    <div className="library-controls">
      <p id="library-position" role="status">
        {active ? atTarget ? `You reached ${target.name}. Choose ${target.action}.`
          : `Find ${target.name} at row ${target.y + 1}, column ${target.x + 1}. You’re at row ${position.y + 1}, column ${position.x + 1}.`
          : `Reached ${target.name}.`}
      </p>
      {active && <div className="library-buttons">
        {Object.entries(directions).map(([key, direction]) => <button type="button" className="secondary"
          key={key} aria-label={direction.label} onClick={() => move(direction.dx, direction.dy)}>{direction.icon}</button>)}
        <button type="button" className="primary" disabled={!atTarget} onClick={interact}>{target.action}</button>
      </div>}
    </div>
  </div>;
}
