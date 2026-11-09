import {describe,it,expect} from 'vitest';
import {resolveBowlingBall,type BowlingPlan} from './bowlingTactics';
const plan:BowlingPlan={line:'stumps',length:'good',variation:'stock',effort:2};
describe('tactical bowling',()=>{
 it('returns deterministic outcomes for same plan and seed',()=>{expect(resolveBowlingBall(plan,60,70,12)).toEqual(resolveBowlingBall(plan,60,70,12));});
 it('marks wides as illegal deliveries',()=>{const p={...plan,line:'outside-off' as const};const outcomes=Array.from({length:100},(_,i)=>resolveBowlingBall(p,50,70,i));expect(outcomes.some(x=>x.runs===1&&!x.legal&&x.message.includes('wide'))).toBe(true);});
 it('can generate wicket outcomes',()=>{const outcomes=Array.from({length:200},(_,i)=>resolveBowlingBall({...plan,variation:'yorker'},85,85,i));expect(outcomes.some(x=>x.wicket)).toBe(true);});
 it('keeps legal outcomes explicit',()=>{const o=resolveBowlingBall(plan,50,70,4);expect(typeof o.legal).toBe('boolean');});
});
