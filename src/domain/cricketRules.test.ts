import { describe, expect, it } from 'vitest';
import { applyDelivery, createInnings, oversText } from './cricketRules';
const setup=()=>createInnings(['A','B','C','D'],['X','Y']);
describe('cricket innings rules',()=>{
 it('counts wides as runs but not legal balls or batter balls',()=>{const s=applyDelivery(setup(),{kind:'wide'});expect(s.total).toBe(1);expect(s.legalBalls).toBe(0);expect(s.batters[0].balls).toBe(0);expect(s.extras.wides).toBe(1);});
 it('counts no-ball penalty and batter runs without advancing the over',()=>{const s=applyDelivery(setup(),{kind:'no-ball',batterRuns:4,boundary:4});expect(s.total).toBe(5);expect(s.legalBalls).toBe(0);expect(s.batters[0].runs).toBe(4);expect(s.batters[0].balls).toBe(0);});
 it('counts a legal delivery and rotates strike on an odd run',()=>{const s=applyDelivery(setup(),{batterRuns:1});expect(s.legalBalls).toBe(1);expect(s.batters[0].balls).toBe(1);expect(s.striker).toBe(1);});
 it('rotates strike at the end of six legal balls',()=>{let s=setup();for(let i=0;i<6;i++)s=applyDelivery(s,{batterRuns:0});expect(s.legalBalls).toBe(6);expect(s.striker).toBe(1);expect(s.nonStriker).toBe(0);});
 it('records a wicket and brings in the next batter',()=>{const s=applyDelivery(setup(),{wicket:'bowled'});expect(s.wickets).toBe(1);expect(s.batters[0].out).toBe(true);expect(s.striker).toBe(2);});
 it('stops a chase as soon as the target is reached',()=>{const s=applyDelivery(createInnings(['A','B'],['X'],5),{batterRuns:4,boundary:4});expect(s.total).toBe(4);const next=applyDelivery(s,{batterRuns:1});expect(next.total).toBe(5);expect(next.complete).toBe(true);});
 it('formats overs using legal balls only',()=>{expect(oversText(17)).toBe('2.5');});
});
