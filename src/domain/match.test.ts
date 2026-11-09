import { describe, expect, it } from 'vitest';
import { applyInningsBall, finishIfNeeded, freshFullMatch, freshInnings, resolveBall, resolveOppositionBall, type Ball } from './match';
const ball = (overrides: Partial<Ball> = {}): Ball => ({ runs: 1, legal: true, wicket: false, text: 'Run', shot: 'rotate', intent: 'balanced', ...overrides });
describe('innings engine', () => {
 it('starts with a zeroed innings',()=>expect(freshInnings()).toEqual({runs:0,wickets:0,balls:0,log:[],done:false}));
 it('adds runs, wickets, legal balls and log entries',()=>expect(applyInningsBall(freshInnings(),ball({runs:4,wicket:true}))).toMatchObject({runs:4,wickets:1,balls:1,done:false,log:[expect.objectContaining({runs:4})]}));
 it('does not count an illegal delivery as a legal ball',()=>expect(applyInningsBall(freshInnings(),ball({legal:false})).balls).toBe(0));
 it('ends at 10 wickets',()=>{let i=freshInnings();for(let n=0;n<10;n++)i=applyInningsBall(i,ball({runs:0,wicket:true}));expect(i.done).toBe(true)});
 it('ends at 120 legal balls',()=>{let i=freshInnings();for(let n=0;n<120;n++)i=applyInningsBall(i,ball({runs:0}));expect(i.done).toBe(true)});
 it('does not mutate a completed innings',()=>{const d={...freshInnings(),done:true};expect(applyInningsBall(d,ball())).toBe(d)});
});
describe('ball resolution and match flow',()=>{
 it('is deterministic for same inputs',()=>expect(resolveBall(80,70,'drive','balanced',42)).toEqual(resolveBall(80,70,'drive','balanced',42)));
 it('leaving never scores or dismisses',()=>expect(resolveBall(50,50,'leave','attack',4)).toMatchObject({runs:0,wicket:false,legal:true}));
 it('opposition returns legal outcome',()=>expect(resolveOppositionBall(1,60,70).legal).toBe(true));
 it('moves to bowling after player innings ends',()=>expect(finishIfNeeded({...freshFullMatch(),player:{...freshInnings(),done:true}}).phase).toBe('bowling'));
 it('declares win, tie or loss',()=>{const b=freshFullMatch();expect(finishIfNeeded({...b,phase:'bowling',player:{...freshInnings(),runs:100},opposition:{...freshInnings(),runs:80,done:true}}).result).toContain('won');expect(finishIfNeeded({...b,phase:'bowling',player:{...freshInnings(),runs:80},opposition:{...freshInnings(),runs:80,done:true}}).result).toContain('tied');expect(finishIfNeeded({...b,phase:'bowling',player:{...freshInnings(),runs:80},opposition:{...freshInnings(),runs:100,wickets:5,done:true}}).result).toContain('Opposition won')});
 it('accepts bowling line, length and variation and gives tactical commentary',()=>{const b=resolveOppositionBall(10,75,65,'off-stump','yorker','swing');expect(b.legal).toBe(true);expect(b.text.length).toBeGreaterThan(0)});
 it('supports all tactical bowling selections',()=>{for(const line of ['off-stump','middle','leg-stump','wide'] as const)for(const length of ['yorker','full','good','short'] as const)for(const variation of ['stock','swing','seam','spin'] as const)expect(resolveOppositionBall(15,70,70,line,length,variation).runs).toBeGreaterThanOrEqual(0)});
});
