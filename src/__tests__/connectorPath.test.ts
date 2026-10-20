import { expect, test } from 'vitest';

import { connectorPath } from '../components/connectorPath.ts';

const from = { x: 60, y: 82 };
const to = { x: 200, y: 32 };

test('a curve with a head ends on a straight segment as long as the head', () => {
  expect(connectorPath(from, to, 'curve', true)).toBe(
    'M 60 82 C 130 82  130 32  180 32 Q 180 32  200 32 ',
  );
});

test('a curve without a head runs to the end point', () => {
  expect(connectorPath(from, to, 'curve', false)).toBe(
    'M 60 82 C 130 82 130 32 200 32',
  );
});

test('a straight connector is one line', () => {
  expect(connectorPath(from, to, 'straight', true)).toBe('M 60 82 L 200 32');
});

test('an elbow turns halfway between the two points', () => {
  expect(connectorPath(from, to, 'elbow', false)).toBe(
    'M 60 82 H 130 V 32 H 200',
  );
});
