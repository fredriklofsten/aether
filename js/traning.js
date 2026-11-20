/* Aether – Idag-vyn, passloggning, vilotimer, framsteg, vikt och historik */
function refresh(){
  syncPlan();
  const phase=getPhase(S.week),hs=hrvSt(S.hrv,S.hrvBase),fatigue=calcFatigue(S.logs),muscleVol=calcMuscleVolume(S.logs);
  const a=adj(S.readiness,S.rAvg,hs,phase,fatigue);
  logDecision(a,S.sessionKey);
  let tmpl=currentSession();
  sc.textContent=S.readiness;rAvgShow.textContent=S.rAvg;hrvS.textContent=S.hrv;
  hrvB.textContent=hs==='low'?'Låg':hs==='high'?'Hög':'Normal';hrvB.className='badge '+(hs==='low'?'low':'ok');
  hint.textContent=a.recText;
  const season=SEASON[S.season]||SEASON.normal;
  hdrB.textContent=phase.planLabel!=null?('Vecka '+phase.weekInPhase+'/'+phase.totalWeeks+(phase.planLabel&&!/^Vecka/.test(phase.planLabel)?' · '+phase.planLabel:'')):(PHASE_SV[phase.phase]+' · v'+phase.weekInPhase+'/'+phase.totalWeeks);
  hrvBaseTxt.textContent=S.hrvBase;
  try{const m=macros();tileKcal.textContent=Math.max(0,m.cal-S.loggedKcal*(S.mealDate===new Date().toLocaleDateString('sv-SE')?1:0))+'';tileProt.textContent='kcal kvar · '+m.protein+' g prot';
    const st=fastState();tileFast.textContent=(FAST[S.fast]||FAST.none).label;tileFastSub.textContent=st.txt;}catch(e){}
  const bl=S.bwLog||[];tileBw.textContent=(bl.length?bl[bl.length-1].v:S.bw)+' kg';tileBwSub.textContent=bl.length>1?((bl[bl.length-1].v-bl[0].v>=0?'+':'')+(bl[bl.length-1].v-bl[0].v).toFixed(1)+' kg totalt'):'Logga vikt';
  const eb=effBudget();sName.textContent=sessName(S.sessionKey)+(eb!=='full'?' · '+eb+' min':'');
  if(S.plan){nextInfo.textContent=nextPlanText();}else{const rot=rotation();nextInfo.textContent='Pass '+((S.sIdx||0)%rot.length+1)+' av '+rot.length+' i veckan · Nästa: '+sessName(rot[((S.sIdx||0)+1)%rot.length].k);}
  const tdl=todayList(),doneI=(S.done&&S.done.date===todayStr())?S.done.idx:[];
  daySwitch.innerHTML=S.plan&&tdl.length>1&&!hasOverride()?tdl.map((x,i)=>`<button class="${i===(S.selSlot||0)?'on':''}" onclick="selectSlot(${i})">${doneI.includes(i)?ic('check'):''}${SLOT_TXT[i]} · ${sessName(x.k)}</button>`).join(''):'';
  const rest=isRestToday(),cardio=!rest&&kindOf(S.sessionKey)==='cardio';
  heroCta.style.display=rest?'none':'block';heroCta.textContent=cardio?'Starta & logga konditionspasset':'Starta & logga passet';
  if(rest){sName.textContent='Vilodag';}
  sRpe.textContent='RPE ≤ '+a.rpeCap;sNote.textContent=a.reasons[0]||'';sRpe.style.display=(isRestToday()||kindOf(S.sessionKey)==='cardio')?'none':'';
  if(isRestToday())sNote.textContent='Återhämtning enligt ditt program';else if(S.plan&&!hasOverride()&&S.done&&S.done.date===todayStr()&&S.done.idx.includes(S.selSlot||0))sNote.textContent='✓ Klart – bra jobbat!';else if(kindOf(S.sessionKey)==='cardio')sNote.textContent='Konditionspass';
  timeNote.textContent=S.timeBudget==='20'?'Minimum: bara de viktigaste lyften, 2–3 set.':S.timeBudget==='full'?'Fullt pass enligt schemat.':'Kortare pass – småövningar tas bort först.';
  coachToday.innerHTML=`<strong>Coach:</strong> ${a.reasons[0]||'Kör enligt plan.'}${S.fastedTrain&&S.fastedTrain!=='no'&&S.trainingDay?' · Fastande pass – ät protein efteråt.':''}${isLowDay()?' · Lågdag i fastan – kör hellre lätt eller vila.':''}`;
  const sm=document.getElementById('sessionMeta');
  if(sm){
    const bits=[];
    if(S.timeBudget&&S.timeBudget!=='full') bits.push(S.timeBudget+' min');
    if((S.context||[]).length) bits.push(S.context.length+' context');
    sm.textContent=bits.join(' · ')||'Enligt plan';
  }
  const rm=document.getElementById('recMini');
  if(rm){rm.textContent='Rec '+a.rec.left;rm.className='badge '+(a.rec.left<20?'mid':'ok');}

  // sync chips
  document.querySelectorAll('#ctxChips .chip').forEach(c=>c.classList.toggle('on',(S.context||[]).includes(c.dataset.v)));
  document.querySelectorAll('#timeChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===S.timeBudget));

  const muscles=new Set();const prim=new Set(),sec=new Set();
  if(isRestToday()){
    const wk=curDays().map((l,di)=>l.map(x=>x.k)).flat().filter((k,i,a)=>a.indexOf(k)===i);
    exList.innerHTML=`<p class="muted" style="line-height:1.5;margin:6px 0 10px">Ingen träning schemalagd idag. Vila är när kroppen återhämtar sig och bygger upp sig – sömn och protein gör jobbet. ${srcTag(['lamon'])}</p><div class="kt">Vill du träna ändå?</div>`+wk.map(k=>`<div class="ex" onclick="trainAnyway('${k}')"><div class="ex-name">${sessName(k)}</div><div class="ex-meta">${kindOf(k)==='cardio'?'Kondition':'Styrka'} · tryck för att välja</div></div>`).join('');
  }else if(kindOf(S.sessionKey)==='cardio'){exList.innerHTML=cardioHtml(S.sessionKey);}
  else exList.innerHTML=tmpl.map(e=>{
    const sets=Math.max(1,Math.round(e.sets*a.volumeMod));const rpe=Math.min(e.rpe,a.rpeCap);
    const ex=EX[e.id]||{name:e.id,m:[]};(ex.m||[]).forEach(m=>{muscles.add(m);const k=MUSCLE_MAP[m];if(k)prim.add(k);});
    (ex.sec||[]).forEach(m=>{const k=MUSCLE_MAP[m];if(k&&!prim.has(k))sec.add(k);});
    const prev=S.prev[e.id];let sug='';
    if(prev){const prog=sugW(prev.w,prev.reps,prev.rpe,e.reps[1],rpe,liftHist(S.logs,e.id));const e1=e1rm(prev.w,prev.reps);
      sug=`<div class="ex-meta">Föreslagen <b>${prog.weight??'—'} kg</b> · e1RM ≈ ${e1}${prog.action==='reset'?' · <span class="badge mid">reset</span>':prog.action==='up'?' · ↑':''}</div><div class="ex-meta">${prog.detail}</div>`;}
    const thumb=EX_IMG[e.id]?`<img class="ex-thumb" src="${EX_IMG[e.id]}" alt="" loading="lazy"/>`:`<div class="ex-thumb ph">${ic('dumbbell')}</div>`;
    const sw=e.swapReason?`<div class="swapnote">↻ ${e.swapReason}</div>`:'';
    return `<div class="ex" onclick="openEx('${e.id}',${sets},'${e.reps[0]}-${e.reps[1]}',${rpe},'${e.orig||e.id}')"><div class="ex-row">${thumb}<div class="ex-body"><div class="ex-name">${ex.name}</div>${sw}
      <div class="ex-meta">${sets} × ${e.reps[0]}-${e.reps[1]} @ RPE ${rpe}</div>${sug}
      <div class="tags">${(ex.m||[]).map(m=>`<span class="tag hot">${m}</span>`).join('')}</div></div></div></div>`;
  }).join('');
  dayMus.innerHTML=[...muscles].map(m=>`<span class="tag hot">${m}</span>`).join('');
  bodyFront.innerHTML=svgFront(prim,sec);bodyBack.innerHTML=svgBack(prim,sec);

  // Recovery
  recTxt.textContent=a.rec.left+' / '+a.rec.max;recSub.textContent='kvar denna vecka';
  recBar.style.width=a.rec.pct+'%';recBar.style.background=a.rec.pct<20?'var(--d)':a.rec.pct<40?'var(--w)':'linear-gradient(90deg,var(--p2),var(--p))';
  coachRec.innerHTML=`<strong>Coach:</strong> Budgeten minskar med tunga set. Under 15 → motorn skyddar dig automatiskt.`;

  const fatLabel={very_high:'Mycket hög',high:'Hög',moderate:'Måttlig',low:'Låg',very_low:'Mycket låg'}[fatigue.level];
  const volLines=Object.entries(muscleVol.status).filter(([,s])=>s.sets>0).sort((a,b)=>b[1].sets-a[1].sets).slice(0,5)
    .map(([m,s])=>`<div class="ex-meta">${m}: <b>${s.sets}</b> · ${s.status}</div>`).join('')||'<div class="ex-meta">Inga set loggade 7d.</div>';
  whyBox.innerHTML=`<h4>Varför?</h4>${a.reasons.map(r=>`<div class="reason">${r}</div>`).join('')}
    <div style="margin-top:8px"><h4>Fatigue</h4><span class="badge ${fatigue.level.includes('high')?'mid':'ok'}">${fatLabel}</span> <span class="muted">score ${fatigue.score}</span></div>
    <div style="margin-top:8px"><h4>Volym 7d</h4>${volLines}</div>
    <div class="coach" style="margin-top:8px"><strong>Counterfactual:</strong> ${a.counterfactual}</div>`;

  decLog.innerHTML=(S.decisions||[]).slice(0,5).map(d=>`<div class="dec"><div>${sessName(d.session)} · vol ×${d.volumeMod} · RPE≤${d.rpeCap}
    ${d.feedback===1?' 👍':d.feedback===-1?' 👎':''}</div><div class="t">${(d.reasons||[]).slice(0,2).join(' · ')}</div></div>`).join('')||'<div class="muted">Inga beslut ännu.</div>';

  seasonLabel.textContent=season.label;
  phNameT.textContent=PHASE_SV[phase.phase];phWeekT.textContent=`v${phase.weekInPhase}/${phase.totalWeeks}`;
  phDescT.textContent=PDESC[phase.phase];phBarT.style.width=(phase.weekInPhase/phase.totalWeeks*100)+'%';
  coachPhase.innerHTML=`<strong>Coach:</strong> ${PHASE_COACH[phase.phase]} ${season.note}`;
  try{renderHome();paintIcons(document.getElementById('t-today'));}catch(e){console.error(e);}
}

function feedback(v){
  if(!S.decisions||!S.decisions.length){toast('Inget beslut att betygsätta');return;}
  S.decisions[0].feedback=v;S.feedback=S.feedback||[];S.feedback.push({ts:Date.now(),v});save();refresh();toast(v===1?'Tack – sparat':'Tack – vi tar lärdom');
}

function openEx(id,sets,reps,rpe,orig){
  orig=orig||id;
  const ex=EX[id]||{name:id,m:[],cue:'',coach:''};
  mTitle.textContent=ex.name;mMeta.textContent=`${sets} × ${reps} @ RPE ${rpe}`;
  mTags.innerHTML=(ex.m||[]).map(m=>`<span class="tag hot">${m}</span>`).join('')+(ex.sec||[]).map(m=>`<span class="tag">${m}</span>`).join('');
  const img=EX_IMG[id];
  const imgEl=document.getElementById('mImg'),demo=document.getElementById('mDemo');
  if(img){imgEl.src=img;document.getElementById('mImg2').src=EX_IMG2(id);demo.style.display='block';document.getElementById('mPh').style.display='none';}
  else{demo.style.display='none';document.getElementById('mPh').style.display='flex';document.getElementById('mPh').textContent='Ingen demo-bild · följ stegen';}
  const steps=EX_STEPS[id]||(ex.cue?[ex.cue]:['Kontrollerad teknik genom hela rörelsen']);
  document.getElementById('mSteps').innerHTML=steps.map((t,i)=>`<div class="step"><div class="n">${i+1}</div><div class="t">${t}</div></div>`).join('');
  mCue.textContent='';mCoach.innerHTML=`<strong>Coach:</strong> ${ex.coach||'Kvalitet före kvantitet.'}`;
  // mini muscle highlight for this exercise only
  const prim=new Set(),sec=new Set();
  (ex.m||[]).forEach(m=>{const k=MUSCLE_MAP[m];if(k)prim.add(k);});
  (ex.sec||[]).forEach(m=>{const k=MUSCLE_MAP[m];if(k&&!prim.has(k))sec.add(k);});
  document.getElementById('mBody').innerHTML='<div class="body-wrap" style="margin:0"><div class="body-svg">'+svgFront(prim,sec)+'</div><div class="body-svg">'+svgBack(prim,sec)+'</div></div>';
  document.getElementById('mSwapWrap').style.display='block';
  const alts=alternatives(orig);
  document.getElementById('mSwap').innerHTML=`<div class="swap ${id===orig?'on':''}" onclick="setSwap('${orig}',null)"><span>${EX[orig]?EX[orig].name:orig} <span class="muted">(original)</span></span><span class="muted">${id===orig?'✓':''}</span></div>`+
    alts.map(k=>`<div class="swap ${k===id?'on':''}" onclick="setSwap('${orig}','${k}')"><span>${EX[k].name}</span><span class="muted">${k===id?'✓':EX[k].m.join(', ')}</span></div>`).join('');
  exModal.classList.add('on');
}
function closeM(){exModal.classList.remove('on');}

function renderLog(){
  const phase=getPhase(S.week);const a=adj(S.readiness,S.rAvg,hrvSt(S.hrv,S.hrvBase),phase,calcFatigue(S.logs));
  const tmpl=currentSession();
  logTitle.textContent=sessName(S.sessionKey);
  const isC=kindOf(S.sessionKey)==='cardio'&&!isRestToday();setHead.style.display=isC?'none':'grid';
  if(isRestToday()){coachLog.innerHTML='<strong>Coach:</strong> Vilodag enligt ditt program. Välj ett pass under Idag om du vill träna ändå.';logArea.innerHTML='';return;}
  if(isC){const c=cT(S.sessionKey).cardio,P=CARDIO[c.proto]||CARDIO.z2;
    coachLog.innerHTML='<strong>Coach:</strong> '+P.desc;
    logArea.innerHTML=`<div class="card">${cardioHtml(S.sessionKey)}<div class="edgrid" style="margin-top:10px"><label>Minuter<input type="number" id="cMin" value="${cardioMin(S.sessionKey)}"/></label><label>Ansträngning 1–10<input type="number" id="cRpe" min="1" max="10" value="${P.rpe}"/></label><label>Km (valfritt)<input type="number" id="cKm" step=".1"/></label><label>Snittpuls<input type="number" id="cHr"/></label></div></div>`;
    logMsg.textContent='';logNote.value='';return;}
  coachLog.innerHTML='<strong>Coach:</strong> Max RPE idag: '+a.rpeCap+'. Vikterna är förifyllda från förra gången. ↓ kopierar setet nedåt.';
  logArea.innerHTML=tmpl.map((e,i)=>{
    const sets=Math.max(1,Math.round(e.sets*a.volumeMod));const ex=EX[e.id]||{name:e.id};const prev=S.prev[e.id];const defW=prev?prev.w:'';
    let rows='';for(let s=1;s<=sets;s++)rows+=`<div class="set-row"><span class="muted">${s}</span>
      <input type="number" id="w${i}_${s}" value="${defW}"/><input type="number" id="r${i}_${s}" value="${e.reps[0]}"/>
      <input type="number" id="p${i}_${s}" value="${Math.min(e.rpe,a.rpeCap)}" step=".5"/>
      <button class="btn o sm" style="padding:6px" onclick="copySet(${i},${s},${sets})">↓</button></div>`;
    return `<div class="card"><div class="ex-name">${ex.name}</div><div class="ex-meta">${sets} set</div>
      <div class="quick"><button class="btn o sm" onclick="bump(${i},1,2.5)">+2.5</button>
      <button class="btn o sm" onclick="bump(${i},1,-2.5)">−2.5</button>
      <button class="btn o sm" onclick="startTimer(90)">⏱</button></div>${rows}</div>`;
  }).join('');logMsg.textContent='';logNote.value='';
}
function copySet(i,s,max){if(s>=max)return;['w','r','p'].forEach(k=>document.getElementById(k+i+'_'+(s+1)).value=document.getElementById(k+i+'_'+s).value);toast('Kopierat');}
function bump(i,s,d){const el=document.getElementById('w'+i+'_'+s);if(el)el.value=(+(el.value||0)+d)||'';}
function e1Cat(id){if(['back_squat','front_squat','box_squat'].includes(id))return'squat';if(id==='bench_press'||id==='db_bench'||id==='incline_bench')return'bench';if(id==='rdl'||id==='deadlift')return'rdl';return null;}
function afterSession(){
  if(S.plan){
    const td=todayList();S.done=S.done&&S.done.date===todayStr()?S.done:{date:todayStr(),idx:[]};
    if(hasOverride()){S.override=null;}else{S.done.idx.push(S.selSlot||0);const nx=td.findIndex((x,i)=>!S.done.idx.includes(i));if(nx>=0)S.selSlot=nx;}
    const nx2=todayList().findIndex((x,i)=>!S.done.idx.includes(i));return nx2>=0?'Nästa idag: '+sessName(todayList()[nx2].k):(nextPlanText()||'Bra jobbat!');
  }
  const rot=rotation();S.sIdx=((S.sIdx||0)+1)%rot.length;S.sessionKey=rot[S.sIdx].k;if(S.sIdx===0){S.week=(S.week+1)%12;}
  return 'Nästa: '+sessName(S.sessionKey);
}
function saveLog(){
  if(kindOf(S.sessionKey)==='cardio'&&!isRestToday()){
    const c=cT(S.sessionKey).cardio,min=+cMin.value||0;if(!min){logMsg.textContent='Ange minuter.';return;}
    S.logs.unshift({date:todayStr(),ts:Date.now(),session:S.sessionKey,lifts:[],sets:0,cardio:{proto:c.proto,mod:c.mod,min,rpe:+cRpe.value||null,km:+cKm.value||null,hr:+cHr.value||null},note:logNote.value||'',readiness:S.readiness,context:[...(S.context||[])]});
    S.readinessLog.push({ts:Date.now(),v:S.readiness});if(S.readinessLog.length>30)S.readinessLog=S.readinessLog.slice(-30);
    const nxt=afterSession();save();logMsg.textContent='Sparat ✓';toast('Konditionspass sparat · '+nxt);setTimeout(()=>{tab('today');},600);return;
  }
  const phase=getPhase(S.week);const a=adj(S.readiness,S.rAvg,hrvSt(S.hrv,S.hrvBase),phase,calcFatigue(S.logs));
  const tmpl=currentSession();
  const entry={date:new Date().toLocaleDateString('sv-SE'),ts:Date.now(),session:S.sessionKey,lifts:[],sets:0,note:logNote.value||'',readiness:S.readiness,context:[...(S.context||[])]};
  const best={},catBest={};
  tmpl.forEach((e,i)=>{const sets=Math.max(1,Math.round(e.sets*a.volumeMod));
    for(let s=1;s<=sets;s++){const w=+document.getElementById('w'+i+'_'+s)?.value,r=+document.getElementById('r'+i+'_'+s)?.value,p=+document.getElementById('p'+i+'_'+s)?.value;
      if(w&&r){entry.lifts.push({id:e.id,w,r,p});entry.sets++;S.prev[e.id]={w,reps:r,rpe:p||e.rpe};
        const e1=e1rm(w,r);if(!best[e.id]||e1>best[e.id].e1)best[e.id]={e1,w,r};
        const c=e1Cat(e.id);if(c&&(!catBest[c]||e1>catBest[c]))catBest[c]=e1;}}});
  if(!entry.sets){logMsg.textContent='Fyll i minst ett set (vikt + reps).';logMsg.style.color='var(--w)';return;}
  const newPRs=[];
  Object.entries(best).forEach(([id,b])=>{const old=S.prs[id];if(!old||b.e1>old.e1){if(old)newPRs.push(EX[id].name+' '+b.e1);S.prs[id]={e1:b.e1,w:b.w,r:b.r,date:entry.date};}});
  Object.entries(catBest).forEach(([c,v])=>{S.e1[c]=v;S.e1Hist[c]=[...(S.e1Hist[c]||[]),{ts:Date.now(),v}].slice(-30);});
  if(catBest.squat)S.e1Log=[...S.e1Log,{ts:Date.now(),v:catBest.squat}].slice(-30);
  S.logs.unshift(entry);S.readinessLog.push({ts:Date.now(),v:S.readiness});
  if(S.readinessLog.length>30)S.readinessLog=S.readinessLog.slice(-30);
  const nxt=afterSession();
  save();logMsg.textContent='Sparat ✓';logMsg.style.color='var(--p)';
  toast(newPRs.length?'🏆 Nytt PR: '+newPRs[0]+' kg e1RM':'Pass sparat · '+nxt);
  setTimeout(()=>{tab('today');refresh();},newPRs.length?1400:600);
}
function startTimer(sec){stopTimer();tLeft=sec;timerCard.classList.add('on');tick();timerInt=setInterval(tick,1000);}
function tick(){if(tLeft<=0){stopTimer();toast('Vila klar');return;}timerVal.textContent=String(Math.floor(tLeft/60)).padStart(2,'0')+':'+String(tLeft%60).padStart(2,'0');tLeft--;}
function stopTimer(){if(timerInt)clearInterval(timerInt);timerInt=null;timerCard.classList.remove('on');}

function setFreq(f){S.freq=f;S.sIdx=0;S.sessionKey=rotation()[0].k;save();renderTrain();refresh();toast(f+' pass/vecka');}
function setSplit(s){S.split=s;S.sIdx=0;S.sessionKey=rotation()[0].k;save();renderTrain();refresh();}
function renderTrain(){
  try{renderProgram();}catch(e){console.error(e);}
  ['ul','ppl','fb'].forEach(x=>{const el=document.getElementById('sp-'+x);if(el)el.classList.toggle('on',x===S.split);});
  document.querySelectorAll('#seasonChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===S.season));
  const rot=rotation(),cur=(S.sIdx||0)%rot.length;
  schema.innerHTML=rot.map((x,i)=>`<div class="ex" onclick="pickSession(${i})"><div class="row between"><div class="ex-name">${x.d} · ${sessName(x.k)}</div>${i===cur?'<span class="badge ok">Nästa</span>':''}</div><div class="ex-meta">${resolveSession(x.k).map(e=>(EX[e.id]||{name:e.id}).name).slice(0,3).join(' · ')}…</div></div>`).join('')
    +`<p class="muted" style="margin-top:8px;font-size:11.5px">${S.freq} pass/vecka. Efter sparat pass går appen automatiskt vidare till nästa.</p>`;
  const season=SEASON[S.season]||SEASON.normal;
  coachSeason.innerHTML=`<strong>Coach:</strong> ${season.note}`;
  const phase=getPhase(S.week);
  advanceInfo.textContent=`Du är i ${PHASE_SV[phase.phase].toLowerCase()}, vecka ${phase.weekInPhase} av ${phase.totalWeeks}. ${PDESC[phase.phase]} Appen går fram en vecka automatiskt när du kört alla veckans pass.`;
  let c=0;phaseTimeline.innerHTML='<div class="ph">'+BLOCKS.map(b=>{const on=S.week>=c&&S.week<c+b.weeks;c+=b.weeks;return `<div class="${on?'on':''}" style="flex:${b.weeks}">${PHASE_SV[b.phase]}<br>${b.weeks} v</div>`;}).join('')+'</div>';
  document.querySelectorAll('#freqChips .chip').forEach(x=>x.classList.toggle('on',+x.dataset.v===S.freq));
}
function advanceWeek(){S.week=(S.week+1)%12;save();renderTrain();refresh();toast('Vecka '+S.week);}
function runSim(){
  const f=+simFreq.value;const weeks=4;const setsPerSession=12;const rpe=7.8;
  const weekly=f*setsPerSession*rpe;const total=weekly*weeks*0.7; // decay approx
  let verdict='Hållbart för de flesta.';
  if(f>=6&&S.season==='cut')verdict='Hög risk för under-recovery under cut.';
  else if(total>400)verdict='Hög kumulativ fatigue – planera deload efter 3–4 veckor.';
  else if(f<=3)verdict='Låg frekvens – bra för recovery, långsammare volymackumulation.';
  simOut.style.display='block';
  simOut.innerHTML=`<strong>Simulering ${f} pass/v × ${weeks} v:</strong> Uppskattad belastning ~${Math.round(total)}. ${verdict} Säsong: ${SEASON[S.season].label}.`;
}

function spark(el,values,rel){if(!values||!values.length){el.innerHTML='';return;}const mx=Math.max(...values,1);
  let mn=0;if(rel){const lo=Math.min(...values);mn=lo-Math.max(1,(mx-lo)*0.6);}
  el.innerHTML=values.map(v=>`<i title="${v}" style="height:${Math.max(4,((v-mn)/(mx-mn||1))*52)}px"></i>`).join('');}
function pickE1(el){S.e1View=el.dataset.v;save();renderHist();}
function logBw(){
  const v=+bwIn.value;if(!v||v<30||v>300){toast('Ange vikt i kg');return;}
  const date=new Date().toLocaleDateString('sv-SE');S.bwLog=(S.bwLog||[]).filter(x=>x.date!==date);
  S.bwLog.push({ts:Date.now(),date,v});S.bwLog=S.bwLog.slice(-60);S.bw=v;bwIn.value='';save();renderHist();toast('Vikt '+v+' kg sparad');
}
function renderBw(){
  const L=(S.bwLog||[]);spark(sparkBw,L.slice(-14).map(x=>x.v),true);
  if(L.length<2){bwNote.textContent=L.length?'Startvikt '+L[0].v+' kg. Logga igen om några dagar för trend.':'Logga din vikt 1–3 ggr/vecka, samma tid på dagen.';return;}
  const last=L[L.length-1],ref=[...L].reverse().find(x=>last.ts-x.ts>=6*86400e3)||L[0];
  const days=Math.max(1,(last.ts-ref.ts)/86400e3),perW=(last.v-ref.v)/days*7,pct=perW/last.v*100;
  let tip;
  if(S.goal==='fat_loss'||S.season==='cut')tip=pct<-1?'Snabbt tempo – risk att tappa muskler, ät lite mer.':pct<=-0.4?'Bra tempo för fettförlust (0,5–1 %/v).':'Långsamt – minska ca 150–200 kcal om det står still 2 veckor.';
  else if(S.goal==='hypertrophy'||S.season==='bulk')tip=pct>0.6?'Ökar snabbt – mer fett än muskel, dra ner lite.':pct>=0.15?'Bra tempo för muskeluppbyggnad.':'Står still – öka ca 150 kcal.';
  else tip=Math.abs(pct)<0.3?'Stabilt – passar ditt mål.':'Vikten rör sig – kolla kalorierna.';
  bwNote.textContent=`${last.v} kg · ${perW>=0?'+':''}${perW.toFixed(2)} kg/vecka (${pct>=0?'+':''}${pct.toFixed(1)} %). ${tip}`;
}
function importData(inp){
  const f=inp.files&&inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||typeof o!=='object'||!('logs' in o))throw 0;
      S=migrate(o);save();toast('Data importerad');renderProf();refresh();}
    catch(e){toast('Ogiltig fil');}inp.value='';};
  r.readAsText(f);
}
function renderHist(){
  e1s.textContent=S.e1.squat||'—';e1b.textContent=S.e1.bench||'—';e1d.textContent=S.e1.rdl||'—';
  renderBw();
  const prs=Object.entries(S.prs||{}).filter(([id])=>EX[id]).sort((a,b)=>b[1].e1-a[1].e1);
  prCard.style.display=prs.length?'block':'none';
  prList.innerHTML=prs.slice(0,8).map(([id,p])=>`<div class="pr"><span>${EX[id].name}</span><span><b>${p.w} kg × ${p.r}</b> <span class="muted">· e1RM ${p.e1} · ${p.date}</span></span></div>`).join('');
  document.querySelectorAll('#e1Pick .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===(S.e1View||'squat')));
  const vols=S.logs.slice(0,10).map(l=>l.sets||l.lifts.length).reverse();spark(sparkVol,vols);volNote.textContent=vols.length?`Senaste ${vols.length} pass`:'Logga pass.';
  const rdy=(S.readinessLog||[]).slice(-10).map(x=>x.v);spark(sparkReady,rdy);readyNote.textContent=rdy.length?`${rdy.length} dagar`:'—';
  const e1h=((S.e1Hist||{})[S.e1View||'squat']||[]).slice(-12),e1a=e1h.map(x=>x.v);spark(sparkE1,e1a,true);
  e1Note.textContent=e1a.length>1?`${e1a.length} pass · ${e1a[e1a.length-1]>=e1a[0]?'+':''}${(e1a[e1a.length-1]-e1a[0]).toFixed(1)} kg sedan första`:e1a.length?'1 pass – logga fler för trend':'Inga pass loggade för lyftet ännu.';
  const fat=calcFatigue(S.logs);const mv=calcMuscleVolume(S.logs);
  const over=Object.entries(mv.status).filter(([,s])=>s.status==='over').map(([m])=>m);
  coachProgress.innerHTML=`<strong>Coach:</strong> Fatigue ${fat.level} (${fat.score}). ${over.length?'Över landmärke: '+over.join(', ')+'.':'Volym inom rimliga ramar.'}`;
  histList.innerHTML=S.logs.length?S.logs.slice(0,15).map(l=>`<div class="ex"><div class="ex-name">${sessName(l.session)}</div><div class="ex-meta">${l.date} · ${l.cardio?l.cardio.min+' min kondition'+(l.cardio.km?' · '+l.cardio.km+' km':''):l.lifts.length+' set'} · R${l.readiness}${l.context?.length?' · '+l.context.join(','):''}</div></div>`).join(''):'<div class="empty">Inga pass ännu.</div>';
  const fb=S.feedback||[];const up=fb.filter(x=>x.v===1).length,dn=fb.filter(x=>x.v===-1).length;
  fbStats.textContent=fb.length?`👍 ${up} · 👎 ${dn} (${fb.length} totalt)`:'Ingen feedback ännu – använd knapparna under Idag.';
}
