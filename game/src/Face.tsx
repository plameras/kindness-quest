import {faceLines, type Expression} from './expressions';

export function Face({expression, transform}: {expression: Expression; transform?: string}) {
  return <g transform={transform} data-expression={expression}>
    <circle cx="-6" r="1.7" fill="#483044"/>
    <circle cx="6" r="1.7" fill="#483044"/>
    {faceLines[expression].map((line, index) =>
      <polyline key={index} points={line.map(point => point.join(',')).join(' ')}
        fill="none" stroke="#483044" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>)}
  </g>;
}
