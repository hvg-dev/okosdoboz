import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceScroll } from '../src/scroll-controls.js';

test('half-screen movement hides and reveals controls', () => {
  let state = { direction: 0, distance: 0, hidden: false };
  state = advanceScroll(state, 99, 200);
  assert.equal(state.hidden, false);
  state = advanceScroll(state, 101, 200);
  assert.equal(state.hidden, true);
  state = advanceScroll(state, -199, 200);
  assert.equal(state.hidden, true);
  state = advanceScroll(state, -1, 200);
  assert.equal(state.hidden, false);
});

test('direction reversal resets progress and zero movement preserves state', () => {
  let state = { direction: 1, distance: 150, hidden: true };
  state = advanceScroll(state, -60, 200);
  assert.equal(state.distance, 60);
  state = advanceScroll(state, 10, 200);
  assert.equal(state.distance, 10);
  assert.equal(state.hidden, true);
  assert.equal(advanceScroll(state, 0, 200), state);
  assert.equal(advanceScroll(state, -500, 200).distance, 200);
});