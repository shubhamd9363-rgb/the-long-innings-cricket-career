export type DeliveryKind = 'normal' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
export type Dismissal = 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket';
export type DeliveryInput = {
  kind?: DeliveryKind;
  batterRuns?: number;
  extras?: number;
  wicket?: Dismissal | null;
  completedRuns?: number;
  boundary?: 4 | 6 | null;
};
export type BatterCard = { name: string; runs: number; balls: number; fours: number; sixes: number; out: boolean; dismissal?: Dismissal };
export type BowlerCard = { name: string; balls: number; runs: number; wickets: number; wides: number; noBalls: number };
export type CricketInnings = {
  total: number; wickets: number; legalBalls: number; extras: { wides:number; noBalls:number; byes:number; legByes:number };
  batters: BatterCard[]; bowlers: BowlerCard[]; striker: number; nonStriker: number;
  nextBatter: number; overEvents: string[]; complete: boolean; target?: number;
};
export const createInnings = (batters: string[], bowlers: string[], target?: number): CricketInnings => ({
  total:0,wickets:0,legalBalls:0,extras:{wides:0,noBalls:0,byes:0,legByes:0},
  batters:batters.map(name=>({name,runs:0,balls:0,fours:0,sixes:0,out:false})),
  bowlers:bowlers.map(name=>({name,balls:0,runs:0,wickets:0,wides:0,noBalls:0})),
  striker:0,nonStriker:1,nextBatter:2,overEvents:[],complete:false,target
});
export const oversText = (balls:number) => `${Math.floor(balls/6)}.${balls%6}`;
export function applyDelivery(state:CricketInnings,input:DeliveryInput,bowlerIndex=0):CricketInnings {
  if(state.complete) return state;
  const s:CricketInnings={...state,extras:{...state.extras},batters:state.batters.map(b=>({...b})),bowlers:state.bowlers.map(b=>({...b})),overEvents:[...state.overEvents]};
  const kind=input.kind??'normal', batter=s.batters[s.striker], bowler=s.bowlers[bowlerIndex];
  const completed=Math.max(0,input.completedRuns??0), boundary=input.boundary??null;
  let batterRuns=Math.max(0,input.batterRuns??0), extra=Math.max(0,input.extras??0), legal=true;
  if(kind==='wide'){extra=Math.max(1,extra);s.extras.wides+=extra;bowler.wides+=extra;legal=false;batterRuns=0;}
  if(kind==='no-ball'){extra=Math.max(1,extra);s.extras.noBalls+=extra;bowler.noBalls+=extra;bowler.runs+=extra+batterRuns;legal=false;}
  if(kind==='bye'){s.extras.byes+=extra;bowler.runs+=extra;}
  if(kind==='leg-bye'){s.extras.legByes+=extra;bowler.runs+=extra;}
  if(kind==='normal'){bowler.runs+=batterRuns+extra;}
  if(legal){s.legalBalls++;bowler.balls++;batter.balls++;}
  batter.runs+=batterRuns;if(boundary===4)batter.fours++;if(boundary===6)batter.sixes++;
  s.total+=batterRuns+extra;
  // Strike changes on odd completed runs; over-end rotation happens after the delivery.
  if((batterRuns+((kind==='bye'||kind==='leg-bye')?extra:0)+completed)%2===1)[s.striker,s.nonStriker]=[s.nonStriker,s.striker];
  if(input.wicket && s.nextBatter<s.batters.length){
    batter.out=true;batter.dismissal=input.wicket;s.wickets++;bowler.wickets++;
    s.striker=s.nextBatter++;
  }
  if(legal && s.legalBalls%6===0){[s.striker,s.nonStriker]=[s.nonStriker,s.striker];s.overEvents.push(`${Math.floor(s.legalBalls/6)} overs`);}
  s.complete=s.wickets>=10||s.legalBalls>=120||(s.target!==undefined&&s.total>=s.target)||s.nextBatter>=s.batters.length&&s.wickets>=s.batters.length-1;
  return s;
}
export function inningsResult(runs:number,wickets:number,target:number){
  if(runs>=target)return `Won by ${10-wickets} wickets`;
  if(runs===target-1)return 'Match tied';
  return `Lost by ${target-runs-1} runs`;
}
