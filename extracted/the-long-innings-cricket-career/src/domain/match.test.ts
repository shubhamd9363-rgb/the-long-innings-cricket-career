import { describe, expect, it } from 'vitest';
import { applyInningsBall, finishIfNeeded, freshFullMatch, freshInnings, resolveBall, resolveOppositionBall, type Ball } from './match';

const ball = (overrides: Partial<Ball> = {}): Ball => ({ runs: 1, legal: true, wicket: false, text: 'Run', shot: 'rotate', intent: 'balanced', ...overrides });

describe('innings engine', () => {
  it('starts with a zeroed innings', () => {
    expect(freshInnings()).toEqual({ runs: 0, wickets: 0, balls: 0, log: [], done: false });
  });
  it('adds runs, wickets, legal balls and log entries', () => {
    const next = applyInningsBall(freshInnings(), ball({ runs: 4, wicket: true }));
    expect(next).toMatchObject({ runs: 4, wickets: 1, balls: 1, done: false });
    expect(next.log).toHaveLength(1);
  });
  it('does not count an illegal delivery as a legal ball', () => {
    expect(applyInningsBall(freshInnings(), ball({ legal: false })).balls).toBe(0);
  });
  it('ends at 10 wickets', () => {
    let innings = freshInnings();
    for (let i = 0; i < 10; i++) innings = applyInningsBall(innings, ball({ runs: 0, wicket: true }));
    expect(innings.done).toBe(true);
  });
  it('ends at 120 legal balls', () => {
    let innings = freshInnings();
    for (let i = 0; i < 120; i++) innings = applyInningsBall(innings, ball({ runs: 0 }));
    expect(innings.done).toBe(true);
  });
  it('does not mutate a completed innings', () => {
    const done = { ...freshInnings(), done: true };
    expect(applyInningsBall(done, ball())).toBe(done);
  });
});

describe('ball resolution and match flow', () => {
  it('is deterministic for the same inputs', () => {
    expect(resolveBall(80, 70, 'drive', 'balanced', 42)).toEqual(resolveBall(80, 70, 'drive', 'balanced', 42));
  });
  it('leaving a ball never scores or dismisses the batter', () => {
    expect(resolveBall(50, 50, 'leave', 'attack', 4)).toMatchObject({ runs: 0, wicket: false, legal: true });
  });
  it('opposition bowling simulation returns a legal ball outcome', () => {
    const result = resolveOppositionBall(1, 60, 70);
    expect(result.legal).toBe(true);
    expect(result.runs).toBeGreaterThanOrEqual(0);
  });
  it('moves from batting to bowling after player innings ends', () => {
    const match = { ...freshFullMatch(), player: { ...freshInnings(), done: true } };
    expect(finishIfNeeded(match).phase).toBe('bowling');
  });
  it('declares a win, tie or loss after opposition innings', () => {
    const base = freshFullMatch();
    const win = finishIfNeeded({ ...base, phase: 'bowling', player: { ...freshInnings(), runs: 100 }, opposition: { ...freshInnings(), runs: 80, done: true } });
    const tie = finishIfNeeded({ ...base, phase: 'bowling', player: { ...freshInnings(), runs: 80 }, opposition: { ...freshInnings(), runs: 80, done: true } });
    const loss = finishIfNeeded({ ...base, phase: 'bowling', player: { ...freshInnings(), runs: 80 }, opposition: { ...freshInnings(), runs: 100, wickets: 5, done: true } });
    expect(win.result).toContain('won');
    expect(tie.result).toContain('tied');
    expect(loss.result).toContain('Opposition won');
  });
});
