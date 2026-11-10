import {useState} from 'react';
import {ChoiceArt} from './BusScene';
import type {Challenge} from './story';

export function ChallengeCards({challenge, onCheck}: {challenge: Challenge; onCheck: (correct: boolean) => void}) {
  const [selected, setSelected] = useState<number[]>([]);
  const ordered = challenge.mode === 'sequence';
  const needed = challenge.answer.length;

  function toggle(index: number) {
    setSelected(previous => {
      if (previous.includes(index)) return previous.filter(card => card !== index);
      return previous.length < needed ? [...previous, index] : previous;
    });
  }

  function check() {
    if (selected.length !== needed) return;
    const correct = challenge.answer.every((card, index) =>
      ordered ? selected[index] === card : selected.includes(card));
    onCheck(correct);
  }

  return <>
    <div className={ordered ? 'choices illustrated-choices challenge-choices' : 'choices challenge-choices'}>
      {challenge.cards.map((card, index) => {
        const position = selected.indexOf(index);
        return <button type="button" key={card.label} aria-pressed={position >= 0}
          onClick={() => toggle(index)} disabled={position < 0 && selected.length === needed}>
          {card.art ? <ChoiceArt art={card.art}/> :
            <span className="choice-letter" aria-hidden="true">{position >= 0 ? '✓' : '○'}</span>}
          <span>{card.label}</span>
          {ordered && <span className="challenge-order" aria-label={position >= 0 ? `Step ${position + 1}` : undefined}>
            {position >= 0 ? position + 1 : '○'}
          </span>}
        </button>;
      })}
    </div>
    <p className="challenge-count" role="status">{selected.length} of {needed} cards selected</p>
    <div className="end-actions">
      <button type="button" className="primary" disabled={selected.length !== needed} onClick={check}>
        {ordered ? 'Check my order' : 'Check my details'}
      </button>
      <button type="button" className="secondary" disabled={!selected.length} onClick={() => setSelected([])}>Clear picks</button>
    </div>
  </>;
}
