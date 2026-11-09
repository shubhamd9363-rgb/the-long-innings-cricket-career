export type BowlingLine='outside-off'|'stumps'|'leg-stump';
export type BowlingLength='full'|'good'|'short';
export type BowlingVariation='stock'|'swing'|'seam'|'slower'|'yorker'|'bouncer';
export type BowlingPlan={line:BowlingLine;length:BowlingLength;variation:BowlingVariation;effort:1|2|3};
export type BowlingOutcome={runs:number;wicket:boolean;legal:boolean;message:string;plan:BowlingPlan};
const seeded=(seed:number,slot:number)=>{const n=Math.sin(seed*91.7+slot*17.31)*10000;return n-Math.floor(n)};
export function resolveBowlingBall(plan:BowlingPlan,skill:number,fitness:number,seed:number):BowlingOutcome{
 const tired=Math.max(0,60-fitness)*.0025, effortRisk=(plan.effort-1)*.012;
 const lengthBonus=plan.length==='good'?.025:plan.length==='full'?.012:.005;
 const variationBonus=plan.variation==='yorker'?.025:plan.variation==='slower'?.018:plan.variation==='swing'||plan.variation==='seam'?.015:.008;
 const lineBonus=plan.line==='stumps'?.012:plan.line==='outside-off'?.018:.006;
 const wicketChance=Math.max(.008,.025+skill*.00045+lengthBonus+variationBonus+lineBonus-tired-effortRisk);
 const wicket=seeded(seed,1)<wicketChance;
 const wide=plan.line==='outside-off'&&seeded(seed,2)<.025+effortRisk;
 const noBall=plan.effort===3&&seeded(seed,3)<.035+tired;
 if(wide)return {runs:1,wicket:false,legal:false,message:'Too wide. Extra run; delivery does not count.',plan};
 if(noBall)return {runs:1,wicket:false,legal:false,message:'Overstepped! No-ball penalty.',plan};
 if(wicket)return {runs:0,wicket:true,legal:true,message:plan.variation==='yorker'?'Yorker! The stumps are rattled.':'Excellent delivery—wicket!',plan};
 const r=seeded(seed,4),concede=plan.length==='short'?.12:plan.length==='full'?.08:.05;
 const runs=r<concede?4:r<concede+.04?6:r<.48?1:r<.68?2:r<.75?3:0;
 return {runs,wicket:false,legal:true,message:runs===0?'Dot ball. Pressure builds.':runs===4?'Boundary conceded.':runs===6?'SIX conceded!':`${runs} run(s) conceded.`,plan};
}
