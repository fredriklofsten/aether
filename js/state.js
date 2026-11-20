/* Aether – Tillstånd (S), spara/ladda och träningsmotorn: trötthet, volym, progression, passval */
function defaults(){return{
  name:'',goal:'hypertrophy',freq:4,bw:82,sex:'m',age:30,height:178,act:1.55,limits:[],swaps:{},sIdx:0,
  week:2,readiness:7,rAvg:6.8,hrv:68,hrvBase:72,
  split:'ul',sessionKey:'lower_heavy',season:'normal',fast:'none',fastedTrain:'no',winStart:12,trainHour:17,fastDays:[],adfOff:0,bfMode:'none',bf:null,waist:null,neck:null,hip:null,exp:'beginner',rate:'std',goalW:null,timeBudget:'full',context:[],trainingDay:true,
  logs:[],meals:[],loggedKcal:0,mealDate:'',readinessLog:[],e1Log:[],decisions:[],feedback:[],bwLog:[],prs:{},e1View:'squat',
  e1Hist:{squat:[],bench:[],rdl:[]},plan:null,customT:{},measLog:[],onboarded:false,prof:{diet:null,meals:null,allergies:[],allergyOther:'',noProt:[],favProt:null,len:60,equip:'gym',likes:[],sleep:null,stress:null,why:'',deadline:'',chest:null,arm:null,thigh:null},ui:{theme:'dark',accent:'teal',font:'normal',home:defaultHome()},selSlot:0,override:null,done:null,weekStamp:null,
  prev:{back_squat:{w:120,reps:5,rpe:8},bench_press:{w:90,reps:5,rpe:8},rdl:{w:100,reps:7,rpe:7.5}},
  e1:{squat:null,bench:null,rdl:null}
};}
function migrate(o){
  const d=defaults();if(!o||typeof o!=='object')return d;
  const m={...d,...o};
  m.prev={...(o.prev||d.prev)};m.e1={...d.e1,...(o.e1||{})};m.e1Hist={...d.e1Hist,...(o.e1Hist||{})};
  ['logs','meals','readinessLog','e1Log','decisions','feedback','bwLog','context','limits'].forEach(k=>{if(!Array.isArray(m[k]))m[k]=[];});
  if(!m.swaps||typeof m.swaps!=='object')m.swaps={};if(!m.customT||typeof m.customT!=='object')m.customT={};
  m.prof={...d.prof,...(o.prof||{})};if(!Array.isArray(m.prof.likes))m.prof.likes=[];m.ui={...d.ui,...(o.ui||{})};
  if(!m.ui.home||!Array.isArray(m.ui.home.order)){m.ui.home=defaultHome();}else{defaultHome().order.forEach(k=>{if(!m.ui.home.order.includes(k))m.ui.home.order.push(k);});m.ui.home.order=m.ui.home.order.filter(k=>HOME_SEC[k]);if(!Array.isArray(m.ui.home.hidden))m.ui.home.hidden=[];}
  if(!Array.isArray(m.measLog))m.measLog=[];
  if(m.plan&&!Array.isArray(m.plan.weeks)){if(Array.isArray(m.plan.days)&&m.plan.days.length===7){m.plan={name:m.plan.name,goal:m.plan.goal,weeks:[{days:m.plan.days,mod:{label:'Vecka 1'}}],start:new Date().toISOString()};}else m.plan=null;}
  if(m.plan&&(!m.plan.weeks.length||m.plan.weeks.some(w=>!Array.isArray(w.days)||w.days.length!==7)))m.plan=null;
  if(m.plan&&!m.plan.start)m.plan.start=new Date().toISOString();if(!m.prs||typeof m.prs!=='object')m.prs={};
  // gammalt fritextfält "lim" → begränsnings-chips
  if(typeof o.lim==='string'&&o.lim&&!(o.limits||[]).length){const t=o.lim.toLowerCase();
    m.limits=Object.keys(LIMIT_SWAPS).filter(k=>t.includes(k)||(k==='ländrygg'&&t.includes('rygg')));}
  delete m.lim;
  // gammal e1Log (bara knäböj) → e1Hist.squat
  if(!m.e1Hist.squat.length&&m.e1Log.length)m.e1Hist.squat=m.e1Log.slice(-30);
  if(!ROTATIONS[m.split])m.split='ul';
  if(o.tre&&!o.fast)m.fast=FAST[o.tre]?o.tre:'none';delete m.tre;
  if(!FAST[m.fast])m.fast='none';
  if(typeof o.fastedTrain==='boolean')m.fastedTrain=o.fastedTrain?'morning':'no';
  if(!Array.isArray(m.fastDays))m.fastDays=[];
  if(o.sIdx==null){const ks=ROTATIONS[m.split],days=DAYS[m.freq]||DAYS[4];const i=days.findIndex((d,n)=>ks[n%ks.length]===m.sessionKey);m.sIdx=i<0?0:i;}
  return m;
}
let S; // initieras sist i skriptet (efter att alla konstanter finns)
let timerInt=null,tLeft=0,lastDecision=null;

function load(){try{return JSON.parse(localStorage.getItem('aether_v3'));}catch(e){return null;}}
function save(){localStorage.setItem('aether_v3',JSON.stringify(S));}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');setTimeout(()=>el.classList.remove('on'),1600);}
function getPhase(w){if(typeof S!=='undefined'&&S&&S.plan&&S.plan.weeks&&S.plan.weeks.length>1){const m=curMod(),n=S.plan.weeks.length;return{phase:m.deload?'deload':'accumulation',weekInPhase:curWi()+1,totalWeeks:n,rpe:[6.5,9],planLabel:m.label||''};}let c=0;for(const b of BLOCKS){c+=b.weeks;if(w<c){const wi=w-(c-b.weeks)+1;return{...b,weekInPhase:wi,totalWeeks:b.weeks};}}return{...BLOCKS[3],weekInPhase:1,totalWeeks:1};}
function hrvSt(c,b){if(!c||!b)return'normal';const r=c/b;if(r<.9)return'low';if(r>1.1)return'high';return'normal';}
function daysAgo(ts){return(Date.now()-ts)/(86400000);}
function e1rm(w,r){if(!w||!r)return null;return r===1?w:Math.round(w*(1+r/30)*10)/10;}

function calcFatigue(logs){
  let score=0,hardDays=0;
  (logs||[]).forEach(log=>{
    const ts=log.ts||Date.now();const d=daysAgo(ts);if(d>7)return;
    const decay=Math.max(0,1-d/7);let sessionLoad=0,n=0,rpeSum=0;
    (log.lifts||[]).forEach(l=>{sessionLoad+=(l.p||7.5);n++;rpeSum+=(l.p||7.5);});
    if(!n&&log.sets){sessionLoad=log.sets*7.5;n=log.sets;}
    score+=sessionLoad*decay;
    if(n&&rpeSum/n>=7.5&&d<=3)hardDays++;
  });
  let level='low',mod=1;
  if(score>=90){level='very_high';mod=0.72;}else if(score>=65){level='high';mod=0.85;}
  else if(score>=35){level='moderate';mod=1;}else if(score>=15){level='low';mod=1.03;}
  else{level='very_low';mod=1.05;}
  return{score:+score.toFixed(1),level,mod,hardDays};
}
function calcMuscleVolume(logs){
  const vol={};
  (logs||[]).forEach(log=>{
    if(daysAgo(log.ts||Date.now())>7)return;
    (log.lifts||[]).forEach(l=>{
      const ex=EX[l.id];if(!ex||(l.p||7.5)<6.5)return;
      (ex.m||[]).forEach(m=>vol[m]=(vol[m]||0)+1);
      (ex.sec||[]).forEach(m=>vol[m]=(vol[m]||0)+0.5);
    });
  });
  const status={};
  Object.keys(VOLUME_LANDMARKS).forEach(m=>{
    const v=vol[m]||0,lm=VOLUME_LANDMARKS[m];
    let st='under';if(v>=lm[2])st='over';else if(v>=lm[1])st='high';else if(v>=lm[0])st='optimal';
    status[m]={sets:+v.toFixed(1),mev:lm[0],mav:lm[1],mrv:lm[2],status:st};
  });
  return{vol,status};
}
function calcRecoveryBudget(logs,freq){
  // Weekly budget: base 100, each hard set costs ~2, sleep/context refund simplified
  const max=100;
  let used=0;
  (logs||[]).forEach(log=>{
    if(daysAgo(log.ts||Date.now())>7)return;
    used+=(log.sets||(log.lifts||[]).length)*2.2;
  });
  const season=SEASON[S.season]||SEASON.normal;
  used*=(season.vol<1?0.9:1);
  const left=Math.max(0,Math.round(max-used));
  return{max,used:+used.toFixed(0),left,pct:Math.max(0,Math.min(100,left))};
}
function liftHist(logs,id,n=6){
  const h=[];(logs||[]).forEach(log=>{(log.lifts||[]).forEach(l=>{if(l.id===id&&l.w&&l.r)h.push({w:l.w,reps:l.r,rpe:l.p,ts:log.ts});});});
  return h.sort((a,b)=>(a.ts||0)-(b.ts||0)).slice(-n);
}
function sugW(pw,pr,pR,tr,tR,hist){
  if(!pw||pR==null)return{weight:null,action:'hold',detail:'Ingen historik'};
  let stuck=false;
  if(hist&&hist.length>=3){
    const l=hist.slice(-3);
    stuck=l.every(h=>Math.abs(h.w-pw)<0.1)&&l.every(h=>h.reps<=pr)&&l.every(h=>(h.rpe||8)>=tR);
  }
  if(stuck)return{weight:Math.round(pw*0.9/2.5)*2.5,action:'reset',detail:'Stagnerat 3+ pass → 10% reset'};
  let p=0,action='hold',detail='Håll vikt, jaga reps';
  if(pr>=tr&&pR<=tR-1){p=.03;action='up';detail='Reps i topp + låg RPE → öka';}
  else if(pr>=tr&&pR<=tR-0.5){p=.025;action='up';detail='Bra set → liten ökning';}
  else if(pr>=tr&&pR<=tR){p=.015;action='up';detail='Nådde reps → öka försiktigt';}
  else if(pr<tr&&pR>=tR+1){p=-.025;action='down';detail='Missade reps + hög RPE → sänk';}
  else if(pr<tr){p=-.015;action='down';detail='Under rep-mål → sänk något';}
  else if(pR>=tR+1.5){p=-.02;action='down';detail='RPE för hög → sänk';}
  return{weight:Math.round(pw*(1+p)/2.5)*2.5,action,detail};
}
function applyTimeBudget(exercises,budget){
  if(budget==='full')return exercises;
  const sorted=[...exercises].sort((a,b)=>(EX[a.id]?.priority||3)-(EX[b.id]?.priority||3));
  if(budget==='45')return sorted.slice(0,Math.max(3,sorted.length-1)).map(e=>({...e,sets:Math.max(2,e.sets- (e.sets>3?1:0))}));
  if(budget==='30')return sorted.filter(e=>(EX[e.id]?.priority||3)<=2).slice(0,3).map(e=>({...e,sets:Math.max(2,e.sets-1)}));
  // 20 min MED
  return sorted.filter(e=>(EX[e.id]?.priority||3)===1).slice(0,2).map(e=>({...e,sets:Math.max(2,Math.min(3,e.sets))}));
}
function plannedLoad(tmpl,volMod){
  return tmpl.reduce((s,e)=>s+Math.max(1,Math.round(e.sets*volMod))*(e.rpe||7.5),0);
}
function adj(r,rAvg,hs,phase,fatigue){
  let vol=1,rpeCap=phase.rpe[1];const reasons=[];const decisions=[];const eff=r*.6+rAvg*.4;
  if(eff>=9){vol=1.06;reasons.push('Bra dagsform → lite mer volym idag');decisions.push({k:'readiness',v:'high'});}
  else if(eff>=7){reasons.push('Normal dagsform → kör passet som planerat');decisions.push({k:'readiness',v:'ok'});}
  else if(eff>=5.5){vol=.88;rpeCap=Math.min(rpeCap,8);reasons.push('Lite sämre dagsform → något färre set');decisions.push({k:'readiness',v:'low_mod'});}
  else if(eff>=4){vol=.7;rpeCap=Math.min(rpeCap,7.5);reasons.push('Låg dagsform → tydligt lättare pass');decisions.push({k:'readiness',v:'low'});}
  else{vol=.45;rpeCap=6.5;reasons.push('Mycket låg dagsform → minipass eller vila');decisions.push({k:'readiness',v:'critical'});}
  if(hs==='low'){vol*=.9;reasons.push('HRV under din baslinje');decisions.push({k:'hrv',v:'low'});}
  if(fatigue){vol*=fatigue.mod;if(fatigue.level==='high'||fatigue.level==='very_high'){reasons.push('Mycket träning senaste veckan → färre set');decisions.push({k:'fatigue',v:fatigue.level});}
    if(fatigue.hardDays>=4){vol*=.92;reasons.push(fatigue.hardDays+' tunga dagar nyligen → lite lättare');}}
  // Context tags
  (S.context||[]).forEach(c=>{
    if(c==='sick'){vol*=.5;rpeCap=Math.min(rpeCap,6.5);reasons.push('Sjuk/krasslig → mycket lätt pass');decisions.push({k:'context',v:'sick'});}
    if(c==='poor_sleep'){vol*=.9;reasons.push('Dålig sömn → något lättare');decisions.push({k:'context',v:'poor_sleep'});}
    if(c==='high_stress'){vol*=.92;reasons.push('Hög stress → något lättare');decisions.push({k:'context',v:'stress'});}
    if(c==='travel'){vol*=.85;reasons.push('Resdag → enklare pass');decisions.push({k:'context',v:'travel'});}
    if(c==='time_crunch'&&S.timeBudget==='full'){reasons.push('Ont om tid → 30-minuterspass');}
  });
  const season=SEASON[S.season]||SEASON.normal;
  vol*=season.vol;
  if(season.vol!==1){reasons.push('Säsong '+season.label+' → '+Math.round(season.vol*100)+' % av normal volym');decisions.push({k:'season',v:S.season});}
  if(phase.phase==='deload'){vol=Math.min(vol,.55);rpeCap=Math.min(rpeCap,7);reasons.push('Återhämtningsvecka (deload)');decisions.push({k:'phase',v:'deload'});}
  // Recovery budget hard cap
  const rec=calcRecoveryBudget(S.logs,S.freq);
  if(rec.left<15){vol=Math.min(vol,.7);reasons.push('Återhämtningsbudgeten är låg ('+rec.left+') → skyddar dig');decisions.push({k:'recovery',v:rec.left});}
  return{volumeMod:+vol.toFixed(2),rpeCap:+rpeCap.toFixed(1),reasons,decisions,rec,
    recText:eff<=4.5?'Lättare pass eller vila idag.':eff<7?'Passet är lite nedskalat idag.':vol>1.02?'Du kan ta i lite extra idag.':'Kör enligt plan.',
    counterfactual:eff<7?`Om readiness varit 8+ hade volymmod varit närmare ×${(vol/(eff>=5.5?0.88:0.7)*1.0).toFixed(2)}.`:`Med lägre readiness (≤5) hade passet kapats kraftigt.`};
}

function rotation(){if(S.plan){const r=[];curDays().forEach((l,di)=>l.forEach(x=>r.push({d:DAYN[di],k:x.k})));if(r.length)return r;}const keys=ROTATIONS[S.split]||ROTATIONS.ul;const days=DAYS[S.freq]||DAYS[4];return days.map((d,i)=>({d,k:keys[i%keys.length]}));}
function sessName(k){return SESSION_NAMES[k]||((S.customT||{})[k]&&S.customT[k].n)||String(k).replace(/_/g,' ');}
function effBudget(){return((S.context||[]).includes('time_crunch')&&S.timeBudget==='full')?'30':S.timeBudget;}
function pickSession(i){const rot=rotation();S.sIdx=i;S.sessionKey=rot[i].k;save();refresh();tab('today');toast(sessName(S.sessionKey));}
function limitSwap(id,taken){
  let cur=id,why=[];
  for(const lim of (S.limits||[])){const c=(LIMIT_SWAPS[lim]||{})[cur];if(!c)continue;
    const pick=c.find(x=>!taken.has(x));if(pick){cur=pick;why.push(LIMIT_LABEL[lim]);}}
  return{id:cur,why};
}
function resolveSession(key){
  const base=getT(key);const taken=new Set(base.map(e=>e.id));
  return base.map(e=>{
    const man=(S.swaps||{})[e.id];
    if(man&&EX[man]&&man!==e.id){taken.add(man);return{...e,id:man,orig:e.id,swapReason:'Ditt val (ersätter '+EX[e.id].name+')'};}
    const r=limitSwap(e.id,taken);
    if(r.id!==e.id){taken.add(r.id);return{...e,id:r.id,orig:e.id,swapReason:'Pga '+r.why.join(' + ')+' (ersätter '+EX[e.id].name+')'};}
    return{...e,orig:e.id};
  });
}
function currentSession(){if(kindOf(S.sessionKey)==='cardio'||isRestToday())return[];return applyTimeBudget(weekAdjust(resolveSession(S.sessionKey),hasOverride()||!S.plan?curMod():curMod()),effBudget());}
function limitSwapList(){
  const seen=new Set(),out=[];
  Object.keys(TEMPLATES).forEach(k=>resolveSession(k).forEach(e=>{if(e.swapReason&&e.swapReason.startsWith('Pga')){const t=EX[e.orig].name+' → '+EX[e.id].name;if(!seen.has(t)){seen.add(t);out.push(t);}}}));
  return out;
}
function alternatives(orig){
  const o=EX[orig];if(!o)return[];
  return Object.keys(EX).filter(k=>k!==orig&&EX[k].m.some(m=>o.m.includes(m))).sort((a,b)=>(EX[a].m[0]===o.m[0]?0:1)-(EX[b].m[0]===o.m[0]?0:1)||EX[a].priority-EX[b].priority).slice(0,6);
}
function setSwap(orig,id){S.swaps=S.swaps||{};if(!id||id===orig)delete S.swaps[orig];else S.swaps[orig]=id;save();closeM();refresh();toast(id&&id!==orig?'Bytt till '+EX[id].name:'Återställd');}
function logDecision(a,sessionKey){
  const sig=[sessionKey,a.volumeMod,a.rpeCap,a.reasons.join('|')].join('#');
  const top=(S.decisions||[])[0];
  if(top&&top.sig===sig&&Date.now()-top.ts<12*3600e3){top.ts=Date.now();lastDecision=top;save();return;}
  lastDecision={ts:Date.now(),sig,session:sessionKey,volumeMod:a.volumeMod,rpeCap:a.rpeCap,reasons:a.reasons.slice(),decisions:a.decisions.slice(),feedback:0};
  S.decisions=[lastDecision,...(S.decisions||[])].slice(0,30);
  save();
}
