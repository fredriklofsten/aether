/* Aether – Hemskärmen */
/* ===================== HEMSKÄRM ===================== */
const FEEL=[[3,'Slut'],[5,'Trött'],[7,'Okej'],[8,'Pigg'],[10,'Topp']];
function logsThisWeek(){const m=mondayOf(new Date()).getTime();return S.logs.filter(l=>l.ts>=m);}
function plannedThisWeek(){if(S.plan)return curDays().reduce((a,l)=>a+l.length,0);return S.freq||4;}
function weekStreak(){let n=0;const now=mondayOf(new Date()).getTime();for(let w=0;w<52;w++){const a=now-w*7*864e5,b=a+7*864e5;const has=S.logs.some(l=>l.ts>=a&&l.ts<b);if(has)n++;else if(w>0)break;}return n;}
function estMin(list){return Math.round(8+list.reduce((t,e)=>t+e.sets*(roleOf(e)==='m'?3:roleOf(e)==='s'?2.5:1.8),0)/5)*5;}
function ringSvg(done,total){const r=26,c=2*Math.PI*r,pct=total?Math.min(1,done/total):0;
  return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--sf3)" stroke-width="6"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="url(#rg)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct)}" transform="rotate(-90 32 32)"/><defs><linearGradient id="rg"><stop offset="0" style="stop-color:var(--p2)"/><stop offset="1" style="stop-color:var(--a)"/></linearGradient></defs></svg><div class="rv"><b>${done}/${total}</b><span>pass</span></div>`;}
function renderHome(){
  const h=new Date().getHours();greetTxt.textContent=h<5?'God natt':h<10?'God morgon':h<17?'Hej':h<22?'God kväll':'God natt';
  helloTxt.textContent=S.name||'Välkommen';
  homeSub.textContent=S.plan?(S.plan.name+' · vecka '+(curWi()+1)+'/'+S.plan.weeks.length+((curMod().label&&!/^Vecka/.test(curMod().label))?' · '+curMod().label:'')):'Standardupplägg · '+(S.freq||4)+' pass/vecka';
  const lw=logsThisWeek(),pl=plannedThisWeek();weekRing.innerHTML=ringSvg(Math.min(lw.length,pl),pl);
  // veckoremsa
  const mon=mondayOf(new Date()),ti=todayIdx();
  const stdDays=!S.plan?(DAYS[S.freq]||DAYS[4]):null;applyHomeLayout();
  weekStrip.innerHTML=DAYN.map((d,i)=>{const dt=new Date(mon.getTime()+i*864e5),ds=dt.toLocaleDateString('sv-SE');
    const planned=S.plan?(curDays()[i]||[]):(stdDays.includes(d)?[{k:'std'}]:[]);
    const done=S.logs.filter(l=>l.date===ds).length;
    const icons=planned.map(x=>x.k!=='std'&&kindOf(x.k)==='cardio'?'c':'s');
    return `<div class="wsd ${i===ti?'today':''} ${done?'done':''} ${i<ti&&planned.length&&!done?'miss':''}" onclick="goSub('train','schema')"><span class="wl">${d.slice(0,1)}</span><span class="wn">${dt.getDate()}</span><span class="wdots">${done?ic('check'):icons.length?icons.map(c=>`<i class="${c}"></i>`).join(''):'<i class="r"></i>'}</span></div>`;}).join('');
  // känsla
  feelBtns.innerHTML=FEEL.map(([v,l])=>`<button class="${S.readiness===v||(S.readiness>v-1&&S.readiness<v+1&&!FEEL.some(f=>f[0]===S.readiness))?'on':''}" onclick="setR(${v});document.getElementById('rSl').value=${v}"><b>${v}</b><span>${l}</span></button>`).join('');
  // passkortet
  const rest=isRestToday(),card=!rest&&kindOf(S.sessionKey)==='cardio';
  heroKick.textContent=rest?'Idag':card?'Dagens konditionspass':'Dagens pass';
  todayCard.classList.toggle('rest',rest);todayCard.classList.toggle('cardioc',card);
  if(rest){sessionMeta.innerHTML='';exSum.textContent='Träna ändå?';}
  else if(card){sessionMeta.innerHTML=`<span>${ic('clock')}${cardioMin(S.sessionKey)} min</span><span>${ic('flame')}${(CARDIO[cT(S.sessionKey).cardio.proto]||CARDIO.z2).short}</span>`;exSum.textContent='Upplägg';}
  else{const t=currentSession(),mus=[...new Set(t.flatMap(e=>(EX[e.id]||{m:[]}).m))].slice(0,3);
    sessionMeta.innerHTML=`<span>${ic('list')}${t.length} övningar</span><span>${ic('clock')}ca ${estMin(t)} min</span>${mus.length?`<span>${ic('target')}${mus.join(', ')}</span>`:''}`;exSum.textContent='Övningar ('+t.length+')';}
  renderWhy();
  if((S.prof||{}).sleep&&S.prof.sleep<=6&&!isRestToday())coachToday.innerHTML+=` · Du sover ofta kort – sömnbrist bromsar muskeluppbyggnaden ${srcTag(['lamon'])}`;
  // svit
  const st=weekStreak();tileStreak.textContent=st+' v';tileStreakSub.textContent=st?'veckor i rad med träning':'Kör ett pass för att starta';
  // dagens fakta
  const doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5),a=ARTS[doy%ARTS.length],c=CATS[a.cat];
  tipCard.innerHTML=`<div class="row between"><div class="kt" style="margin:0">${ic('book')} Dagens fakta</div><span class="ev ${a.ev}">${a.ev}</span></div><div class="tt">${a.keys[0]}</div><div class="muted" style="font-size:12.5px;line-height:1.45">${a.lead}</div><button class="btn o sm" style="margin-top:10px" onclick="openArt('${a.id}')">Läs: ${a.t} ${ic('chev')}</button>`;
}
