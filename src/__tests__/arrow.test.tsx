import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { Arrow } from '../components/Arrow.tsx';

const from = { x: 0, y: 0 };
const to = { x: 100, y: 0 };

// A labelled arrow drawn without an explicit horizontalPosition must still show
// its label: the position defaults to 'center'. Guards the regression where the
// default was dropped and every unpositioned arrow label silently disappeared.
test('a labelled arrow with no horizontalPosition centres its label', () => {
  const svg = renderToStaticMarkup(
    <svg>
      <Arrow id="edge" from={from} to={to} label="Ionization" />
    </svg>,
  );

  expect(svg).toContain('Ionization');
  expect(svg).toContain('text-anchor="middle"');
});

test('an explicit horizontalPosition places the label', () => {
  const svg = renderToStaticMarkup(
    <svg>
      <Arrow
        id="edge"
        from={from}
        to={to}
        label="End"
        horizontalPosition="right"
      />
    </svg>,
  );

  expect(svg).toContain('End');
  expect(svg).toContain('text-anchor="end"');
});
