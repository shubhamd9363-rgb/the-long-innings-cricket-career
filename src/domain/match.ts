export type BatterIntent = 'defend' | 'balanced' | 'attack';
export type Shot = 'leave' | 'block' | 'rotate' | 'drive' | 'cut' | 'pull' | 'loft';
export type BowlingLine = 'off-stump' | 'middle' | 'leg-stump' | 'wide';
export type BowlingLength = 'yorker' | 'full' | 'good' | 'short';
export type BowlingVariation = 'stock' | 'swing' | 'seam' | 'spin';
export type Ball = { runs:number; legal:boolean; wicket:boolean; text:string; shot:Shot; intent:BatterIntent };
export type Career = {
  name:string; age:number; hometown:string; state:string; hand:string; role:string;
  style:string; ambition:string; background:string; level:string; week:number;
  skills:{technique:number;power:number;temperament:number;fitness:number};
  money:number; fatigue:number; confidence:number; runs:number; wickets:number;
  matches:number; training:number; log:string[];
};
export type Innings = {runs:number; wickets:number; balls:number; log:Ball[]; done:boolean};
export type FullMatch = {phase:'batting'|'bowling'|'complete'; player:Innings; opposition:Innings; result:string; seed:number};
export const freshInnings=():Innings=>({runs:0,wickets:0,balls:0,log:[],done:false});
export const freshFullMatch=():FullMatch=>({phase:'batting',player:freshInnings(),opposition:freshInnings(),result:'',seed:1});
const random=(seed:number,n:number)=>{const x=Math.sin(seed*127.1+n*311.7)*43758.5453;return x-Math.floor(x)};
export function resolveBall(skill:number,confidence:number,shot:Shot,intent:BatterIntent,seed:number):Ball{
 const aggression=intent==='attack'?.24:intent==='balanced'?.12:.04;
 if(shot==='leave')return {runs:0,legal:true,wicket:false,text:'Left safely. Good judgement.',shot,intent};
 const control=Math.min(.85,.35+skill/200+confidence/400);
 if(random(seed,1)<.035+aggression*.18)return {runs:0,legal:true,wicket:true,text:'Beaten. The stumps are disturbed!',shot,intent};
 const r=random(seed,2);let runs=0;
 if(r<control*.16)runs=4;else if(r<control*.23)runs=6;else if(r<control*.52)runs=2;else if(r<control*.68)runs=1;else if(r<control*.74)runs=3;
 if(intent==='attack'&&shot==='loft'&&runs<4&&random(seed,3)<.22)runs=4;
 if(intent==='attack'&&random(seed,4)<.05)return {runs:0,legal:true,wicket:true,text:'Mistimed attack. Caught in the deep!',shot,intent};
 const words:Record<Shot,string>={block:'Solid defence.',rotate:'Nudged into the gap; a run taken.',drive:runs>=4?'A crisp drive races away!':'Driven into the outfield.',cut:'Cut square through point.',pull:'Pulled away into the leg side.',loft:runs===6?'SIX! Clean strike over the rope.':'Aerial shot, safely placed.',leave:'Left safely.'};
 return {runs,legal:true,wicket:false,text:words[shot],shot,intent};
}
export function applyInningsBall(i:Innings,b:Ball):Innings{
 if(i.done)return i;const n={...i,runs:i.runs+b.runs,wickets:i.wickets+(b.wicket?1:0),balls:i.balls+(b.legal?1:0),log:[b,...i.log]};
 n.done=n.wickets>=10||n.balls>=120;return n;
}
export function resolveOppositionBall(seed:number,playerBowling:number,playerFitness:number,line:BowlingLine='off-stump',length:BowlingLength='good',variation:BowlingVariation='stock'):Ball{
 const lineBonus=line==='off-stump'?.012:line==='middle'?.006:line==='wide'?.002:-.004;
 const lengthBonus=length==='good'?.018:length==='yorker'?.014:length==='short'?.004:-.006;
 const variationBonus=variation==='seam'?.012:variation==='swing'?.01:variation==='spin'?.008:0;
 const r=random(seed,10),wicketChance=.025+Math.max(0,playerBowling-50)*.00035+Math.max(0,70-playerFitness)*.0002+lineBonus+lengthBonus+variationBonus;
 if(r<Math.max(.01,wicketChance))return {runs:0,legal:true,wicket:true,text:`WICKET! ${length} ${variation} on ${line} beats the batter.`,shot:'block',intent:'balanced'};
 const x=random(seed,11);let runs=x<.08?0:x<.43?1:x<.67?2:x<.76?3:x<.94?4:6;
 if(line==='wide'&&x>.45)runs=Math.min(6,runs+1);
 if(length==='short'&&x>.7)runs=Math.min(6,runs+2);
 return {runs,legal:true,wicket:false,text:runs===0?'Dot ball. Good pressure.':runs===4?'Driven to the boundary.':runs===6?'Launched for six!':`${runs} run${runs===1?'':'s'} taken.`,shot:'rotate',intent:'balanced'};
}
export function finishIfNeeded(m:FullMatch):FullMatch{
 if(m.phase==='batting'&&m.player.done)return {...m,phase:'bowling'};
 if(m.phase==='bowling'&&m.opposition.done){const p=m.player.runs,o=m.opposition.runs;return {...m,phase:'complete',result:p>o?`You won by ${p-o} runs!`:p===o?'Match tied!':`Opposition won by ${10-m.opposition.wickets} wickets.`}}return m;
}
