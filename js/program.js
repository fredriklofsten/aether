/* Aether – Träningsprogram: veckoschema, dubbelpass, generator */
/* ===================== TRÄNINGSPROGRAM: veckoschema, dubbelpass, generator ===================== */
const EXEQ={back_squat:'gym',front_squat:'gym',rdl:'gym',hip_thrust:'db',deadlift:'gym',bench_press:'gym',incline_bench:'gym',barbell_row:'gym',cable_row:'gym',ohp:'gym',db_ohp:'db',pullup:'bw',lat_pulldown:'gym',walking_lunge:'bw',leg_curl:'gym',calf_raise:'bw',face_pull:'gym',tricep_pushdown:'gym',barbell_curl:'gym',db_bench:'db',landmine_press:'gym',chest_supported_row:'db',leg_press:'gym',box_squat:'gym',hammer_curl:'db',back_extension:'gym',
 goblet_squat:'db',bw_squat:'bw',bulgarian_split_squat:'bw',step_up:'bw',db_rdl:'db',single_leg_rdl:'bw',glute_bridge:'bw',nordic_curl:'bw',push_up:'bw',pike_push_up:'bw',inverted_row:'bw',db_row:'db',db_incline_press:'db',lateral_raise:'db',db_rear_fly:'db',db_curl:'db',overhead_tricep_ext:'db',bench_dip:'bw',plank:'bw',dead_bug:'bw',hanging_leg_raise:'bw',leg_extension:'gym',cable_fly:'gym',chin_up:'bw',kettlebell_swing:'db'};
const EQ_TXT={gym:'Gym',db:'Hantlar hemma',bw:'Kroppsvikt'};
function eqOk(id,eq){const e=EXEQ[id]||'gym';if(eq==='gym')return true;if(eq==='db')return e!=='gym';return e==='bw';}
const NEW_EX={
 goblet_squat:{name:'Goblet Squat',m:['Quadriceps','Glutes'],sec:['Core'],cue:'Hantel mot bröstet, sitt mellan hälarna.',coach:'Bra knäböj för nybörjare och hemmaträning.',priority:1,steps:['Håll en hantel lodrätt mot bröstet','Sitt ner mellan hälarna med rak rygg','Knän följer tårna','Pressa upp genom hela foten']},
 bw_squat:{name:'Knäböj (kroppsvikt)',m:['Quadriceps','Glutes'],sec:[],cue:'Djupt och kontrollerat.',coach:'Långsamt nedåt (3 s) gör den tyngre.',priority:1,steps:['Fötter axelbrett','Sitt så djupt du kan med rak rygg','Pressa upp']},
 bulgarian_split_squat:{name:'Bulgarisk utfallsböj',m:['Quadriceps','Glutes'],sec:['Hamstrings'],cue:'Bakre fot på bänk, sänk rakt ner.',coach:'Tung övning även utan vikter.',priority:1,steps:['Bakre foten på bänk/stol','Sänk bakre knät mot golvet','Främre knä över foten','Pressa upp genom främre hälen']},
 step_up:{name:'Step-up',m:['Quadriceps','Glutes'],sec:[],cue:'Kliv upp med hela foten på lådan.',coach:'Pressa med det övre benet, inte det nedre.',priority:2,steps:['Hela foten på låda/bänk','Kliv upp utan att skjuta ifrån med bakre benet','Sänk kontrollerat']},
 db_rdl:{name:'Rumänsk marklyft (hantlar)',m:['Hamstrings','Glutes'],sec:['Lower Back'],cue:'Höften bakåt, hantlar nära benen.',coach:'Stretch i baksida lår.',priority:1,steps:['Hantlar framför låren','Skjut höften bakåt med rak rygg','Känn stretch i baksida lår','Res dig genom att föra höften framåt']},
 single_leg_rdl:{name:'Enbens marklyft',m:['Hamstrings','Glutes'],sec:['Core'],cue:'Fäll framåt på ett ben, höften rak.',coach:'Balans och baksida i ett.',priority:2,steps:['Stå på ett ben','Fäll framåt, andra benet bakåt','Höften parallell med golvet','Res dig kontrollerat']},
 glute_bridge:{name:'Höftlyft (golv)',m:['Glutes'],sec:['Hamstrings'],cue:'Pressa höften upp, kläm sätet.',coach:'Gör den enbent för mer belastning.',priority:3,steps:['Ligg på rygg, fötter i golvet','Pressa upp höften','Pausa och sänk']},
 nordic_curl:{name:'Nordic curl',m:['Hamstrings'],sec:[],cue:'Fäll framåt långsamt med fötterna fixerade.',coach:'Mycket tung – för vana.',priority:3,steps:['Fötterna fixerade, knä på mjukt underlag','Fäll framåt så långsamt du kan','Ta emot med händerna och tryck tillbaka']},
 push_up:{name:'Armhävning',m:['Chest'],sec:['Triceps','Shoulders'],cue:'Kroppen rak som en planka.',coach:'Höj fötterna för svårare, händerna för lättare.',priority:1,steps:['Händerna lite bredare än axlarna','Kroppen rak','Sänk bröstet mot golvet','Pressa upp']},
 pike_push_up:{name:'Pike push-up',m:['Shoulders'],sec:['Triceps'],cue:'Höften högt, huvudet mot golvet.',coach:'Axelpress utan vikter.',priority:1,steps:['Händer och fötter i golvet, höften högt','Sänk huvudet mot golvet mellan händerna','Pressa upp']},
 inverted_row:{name:'Inverterad rodd',m:['Upper Back','Lats'],sec:['Biceps'],cue:'Dra bröstet mot stången/bordskanten.',coach:'Ju plattare kropp desto tyngre.',priority:1,steps:['Häng under en stång eller stadigt bord','Kroppen rak','Dra bröstet upp','Sänk kontrollerat']},
 db_row:{name:'Hantelrodd',m:['Upper Back','Lats'],sec:['Biceps'],cue:'Dra hanteln mot höften.',coach:'Stöd mot bänk för rak rygg.',priority:1,steps:['Ena handen och knät på bänk','Dra hanteln mot höften','Sänk till full sträckning']},
 db_incline_press:{name:'Lutande hantelpress',m:['Chest'],sec:['Shoulders','Triceps'],cue:'Bänk 30–45°.',coach:'Övre bröst.',priority:2,steps:['Bänk i 30–45°','Pressa hantlarna upp','Sänk till stretch i bröstet']},
 lateral_raise:{name:'Sidolyft',m:['Shoulders'],sec:[],cue:'Lyft ut åt sidan till axelhöjd.',coach:'Lätt vikt, kontrollerat.',priority:3,steps:['Hantlar vid sidorna','Lyft ut till axelhöjd','Sänk långsamt']},
 db_rear_fly:{name:'Omvända flyes',m:['Rear Delts','Upper Back'],sec:[],cue:'Framåtlutad, lyft ut åt sidan.',coach:'Bakre axel och hållning.',priority:3,steps:['Luta framåt med rak rygg','Lyft hantlarna ut åt sidan','Kläm skulderbladen']},
 db_curl:{name:'Hantelcurl',m:['Biceps'],sec:[],cue:'Armbågar stilla.',coach:'Långsamt nedåt.',priority:3,steps:['Armbågar mot sidorna','Curl upp','Sänk kontrollerat']},
 overhead_tricep_ext:{name:'Triceps över huvud',m:['Triceps'],sec:[],cue:'Sänk hanteln bakom huvudet.',coach:'Lång triceps-stretch.',priority:3,steps:['Håll en hantel över huvudet','Sänk bakom huvudet','Sträck armarna']},
 bench_dip:{name:'Bänkdips',m:['Triceps'],sec:['Chest'],cue:'Händerna på bänk bakom dig.',coach:'Gå inte för djupt om axeln känns.',priority:3,steps:['Händerna på bänkkanten','Sänk kroppen genom att böja armbågarna','Pressa upp']},
 plank:{name:'Planka',m:['Core'],sec:[],cue:'Rak kropp, spänd mage.',coach:'30–60 s per set.',priority:3,steps:['Underarmar i golvet','Kroppen rak från huvud till häl','Håll']},
 dead_bug:{name:'Dead bug',m:['Core'],sec:[],cue:'Ländryggen mot golvet.',coach:'Långsamt och kontrollerat.',priority:3,steps:['Ligg på rygg, armar och ben upp','Sträck motsatt arm och ben','Håll ländryggen i golvet']},
 hanging_leg_raise:{name:'Hängande benlyft',m:['Core'],sec:[],cue:'Lyft benen utan att gunga.',coach:'Böj knäna för lättare variant.',priority:3,steps:['Häng i stång','Lyft knän/ben mot bröstet','Sänk långsamt']},
 leg_extension:{name:'Benspark',m:['Quadriceps'],sec:[],cue:'Full sträckning, långsamt ned.',coach:'Isolerar framsida lår.',priority:3,steps:['Justera dynan över vristen','Sträck benen','Sänk långsamt']},
 cable_fly:{name:'Kabelflyes',m:['Chest'],sec:[],cue:'Lätt böj i armbågen, kram ihop.',coach:'Bröststretch.',priority:3,steps:['Kablarna i axelhöjd','För ihop händerna framför bröstet','Tillbaka till stretch']},
 chin_up:{name:'Chin-up',m:['Lats','Biceps'],sec:[],cue:'Underhandsgrepp, hakan över.',coach:'Mer biceps än pull-up.',priority:1,steps:['Underhandsgrepp axelbrett','Dra upp tills hakan är över','Sänk till full häng']},
 kettlebell_swing:{name:'Kettlebell swing',m:['Glutes','Hamstrings'],sec:['Core'],cue:'Explosiv höftrörelse.',coach:'Kraft från höften, inte armarna.',priority:2,steps:['Kettlebell mellan benen','Skjut höften bakåt','Explodera framåt med höften','Låt klotet svinga till brösthöjd']}
};
Object.entries(NEW_EX).forEach(([k,v])=>{const{steps,...rest}=v;EX[k]=rest;EX_STEPS[k]=steps;});
Object.assign(MUSCLE_MAP,{'Rear Delts':'reardelt'});

const CARDIO={
 z2:{n:'Zon 2 – lugn distans',short:'Zon 2',rpe:4,desc:'Jämnt, lugnt tempo där du kan prata i hela meningar (ca 60–75 % av maxpuls).',steps:['5 min lätt start','Håll ett tempo där du kan prata','Avsluta med 5 min lugnt'],src:['who','milanovic']},
 int44:{n:'4×4-intervaller',short:'4×4',rpe:8,desc:'Fyra intervaller à 4 min hårt (85–95 % av maxpuls, svårt att prata) med 3 min lugn aktiv vila.',steps:['10 min uppvärmning','4 min hårt – 3 min lugnt, ×4','5 min nedvarvning'],src:['helgerud','milanovic']},
 int1515:{n:'15/15-intervaller',short:'15/15',rpe:8,desc:'15 sekunder hårt följt av 15 sekunder lugnt, upprepat i block.',steps:['10 min uppvärmning','15 s hårt / 15 s lugnt i 2 block à 8–10 min, 3 min vila mellan','5 min nedvarvning'],src:['helgerud','milanovic']},
 easy:{n:'Återhämtning',short:'Lätt',rpe:2,desc:'Mycket lugn promenad, cykeltur eller simning. Ska kännas lätt.',steps:['20–40 min i lugnt tempo','Fokusera på att röra dig, inte prestera'],src:['who']}
};
const MODS=['Valfri','Löpning','Cykel','Rodd','Promenad','Simning','Crosstrainer'];
const DAYN_L=['Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag','Söndag'];
const SLOT_TXT=['Pass 1','Pass 2'];

function todayIdx(){return(new Date().getDay()+6)%7;}
function todayStr(){return new Date().toLocaleDateString('sv-SE');}
function isoWeek(d){d=d||new Date();const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()*100+Math.ceil(((t-y)/864e5+1)/7);}
function cT(k){return(S.customT||{})[k];}
function getT(k){return TEMPLATES[k]||(cT(k)&&cT(k).ex)||[];}
function kindOf(k){return(cT(k)&&cT(k).kind)||'strength';}
function mondayOf(d){d=new Date(d);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function weekDiff(d){return Math.round((mondayOf(d)-mondayOf(S.plan.start))/(7*864e5));}
function wiOf(d){const n=S.plan.weeks.length,x=weekDiff(d);return((x%n)+n)%n;}
function curWi(){return S.plan?wiOf(new Date()):0;}
function blockRound(){return S.plan?Math.floor(Math.max(0,weekDiff(new Date()))/S.plan.weeks.length)+1:1;}
function curDays(){return S.plan.weeks[curWi()].days;}
function curMod(){return S.plan?(S.plan.weeks[curWi()].mod||{}):{};}
function vWi(){const n=S.plan.weeks.length;let v=S.planView;if(v==null||v<0||v>=n){v=curWi();S.planView=v;}return v;}
function vDays(){return S.plan.weeks[vWi()].days;}
function vMod(){return S.plan.weeks[vWi()].mod||{};}
function roleOf(e){return e.role||((EX[e.id]||{}).priority===1?'m':(EX[e.id]||{}).priority===2?'s':'a');}
function weekAdjust(list,mod){
  if(!mod||(!mod.deload&&!mod.setAdd&&mod.rpe==null&&!mod.reps))return list;
  return list.map(e=>{const r=roleOf(e),o={...e};
    if(mod.deload){o.sets=Math.max(1,Math.round(e.sets*0.6));o.rpe=Math.min(e.rpe,6.5);return o;}
    if(r!=='a'&&mod.setAdd)o.sets=Math.min(5,e.sets+mod.setAdd);
    if(mod.rpe!=null)o.rpe=r==='a'?Math.min(9.5,mod.rpe+0.5):mod.rpe;
    if(mod.reps&&r==='m')o.reps=mod.reps.slice();
    return o;});
}
function cardioMin(k,mod){const c=cT(k).cardio;mod=mod||curMod();return Math.round(c.min*(mod.cMul||1)*(mod.deload?0.6:1)/5)*5||c.min;}
function todayList(){return S.plan?(curDays()[todayIdx()]||[]):[];}
function hasOverride(){return S.override&&S.override.date===todayStr();}
function isRestToday(){return !!S.plan&&!todayList().length&&!hasOverride();}
function syncPlan(){
  if(!S.plan)return;
  const d=todayStr();if(!S.done||S.done.date!==d)S.done={date:d,idx:[]};
  const wk=isoWeek();if(S.weekStamp==null)S.weekStamp=wk;else if(wk!==S.weekStamp){S.weekStamp=wk;S.week=(S.week+1)%12;}
  if(hasOverride()){S.sessionKey=S.override.k;return;}
  const td=todayList();
  if(td.length){let i=S.selSlot||0;if(i>=td.length)i=0;S.selSlot=i;S.sessionKey=td[i].k;}
}
function selectSlot(i){S.selSlot=i;S.override=null;save();refresh();}
function trainAnyway(k){S.override={date:todayStr(),k};save();refresh();toast(sessName(k));}
function nextPlanText(){
  if(!S.plan)return'';const ti=todayIdx();
  for(let o=1;o<=7;o++){const dt=new Date(Date.now()+o*864e5),di=(ti+o)%7,l=S.plan.weeks[wiOf(dt)].days[di]||[];if(l.length)return(o===1?'Imorgon':DAYN_L[di])+': '+l.map(x=>sessName(x.k)).join(' + ');}
  return'';
}
function cardioHtml(k){
  const c=cT(k).cardio,P=CARDIO[c.proto]||CARDIO.z2,cm=cardioMin(k,arguments[1]);
  return `<div class="cardio"><div class="row" style="gap:10px;margin-bottom:8px"><div class="aic">${ic('flame')}</div><div><div class="ex-name">${P.n}</div><div class="ex-meta">${c.mod&&c.mod!=='Valfri'?c.mod+' · ':''}${cm} min · ansträngning ca ${P.rpe}/10</div></div></div>
    <p class="muted" style="font-size:13px;line-height:1.5">${P.desc} ${srcTag(P.src)}</p>
    ${P.steps.map((t,i)=>`<div class="step"><div class="n">${i+1}</div><div class="t">${t}</div></div>`).join('')}</div>`;
}

/* ---------- sheet-system (undersidor med egen historik) ---------- */
let SH=[];
function openSheet(fn){if(curTab!=='sheet'){SH=[fn];tab('sheet');}else SH.push(fn);renderSheet();window.scrollTo(0,0);}
function renderSheet(){const r=SH[SH.length-1]();sheetBox.innerHTML=r.h;pTitle.textContent=r.t;pSub.textContent=r.s||'';}
function closeSheets(){SH=[];goBack();}

/* ---------- programvy ---------- */
function weekStats(days,mod){mod=mod||{};
  let str=0,cmin=0;const mus={};
  days.forEach(l=>l.forEach(x=>{if(kindOf(x.k)==='cardio'){cmin+=cardioMin(x.k,mod);}else{str++;weekAdjust(getT(x.k),mod).forEach(e=>{const ex=EX[e.id];if(!ex)return;ex.m.forEach(m=>mus[m]=(mus[m]||0)+e.sets);(ex.sec||[]).forEach(m=>mus[m]=(mus[m]||0)+e.sets*.5);});}}));
  const sdays=days.filter(l=>l.some(x=>kindOf(x.k)!=='cardio')).length;
  return{str,sdays,cmin,mus,dbl:days.filter(l=>l.length>1).length,rest:days.filter(l=>!l.length).length};
}
function renderProgram(){
  stdBox.style.display=S.plan?'none':'block';
  if(!S.plan){
    progBox.innerHTML=`<div class="card glow"><h4>Ditt träningsprogram</h4><p class="muted" style="line-height:1.5;margin-bottom:6px">Du kör just nu ett standardupplägg som roterar. Skapa ett program efter ditt mål – eller bygg ett eget veckoschema med upp till två pass per dag.</p>
      <button class="btn p full" onclick="openGen()">${ic('target')}<span>Skapa program efter mål</span></button>
      <button class="btn o full" onclick="newEmptyPlan()">Bygg eget veckoschema</button></div>`;return;
  }
  const vw=vWi(),cw=curWi(),nW=S.plan.weeks.length,vm=vMod(),st=weekStats(vDays(),vm),ti=vw===cw?todayIdx():-1;
  const top=Object.entries(st.mus).filter(([m])=>VOLUME_LANDMARKS[m]).sort((a,b)=>b[1]-a[1]);
  const lowM=top.filter(([m,v])=>v<10).map(([m])=>m);
  progBox.innerHTML=`<div class="card glow">
    <div class="row between"><div><div class="kt" style="margin:0">Ditt program</div><div style="font-size:17px;font-weight:700;margin-top:2px">${S.plan.name||'Mitt schema'}</div></div><button class="iconbtn" onclick="openGen()" aria-label="Nytt program">${ic('refresh')}</button></div>
    <div class="blk"><div class="row between" style="font-size:12px"><span><b>Vecka ${cw+1}</b> av ${nW}${blockRound()>1?' · varv '+blockRound():''}</span><span class="muted">${(S.plan.weeks[cw].mod||{}).label||''}</span></div><div class="bar" style="margin-top:6px"><div class="fill" style="width:${(cw+1)/nW*100}%;background:linear-gradient(90deg,var(--p2),var(--p))"></div></div></div>
    <div class="pstats"><div><b>${st.str}</b><span>styrkepass</span></div><div><b>${st.cmin}</b><span>min kondition</span></div><div><b>${st.dbl}</b><span>dubbelpass</span></div><div><b>${st.rest}</b><span>vilodagar</span></div></div>
    <div class="checks">
      <div class="chk ${st.sdays>=2?'good':'bad'}">${ic(st.sdays>=2?'check':'info')}<span>Styrka ${st.sdays} dagar/v · WHO: minst 2 ${srcTag(['who'])}</span></div>
      <div class="chk ${st.cmin>=150?'good':'bad'}">${ic(st.cmin>=150?'check':'info')}<span>Kondition ${st.cmin} min/v · WHO: 150–300 måttlig ${srcTag(['who'])}</span></div>
      <div class="chk ${!lowM.length?'good':'bad'}">${ic(!lowM.length?'check':'info')}<span>${lowM.length?'Under 10 set/vecka: '+lowM.slice(0,4).join(', '):'Alla stora muskler har ≥10 set/vecka'} ${srcTag(['sch_vol'])}</span></div>
    </div>
  </div>
  <div class="card"><div class="row between"><h4 style="margin:0">Veckoschema</h4><span class="muted" style="font-size:11.5px">${vm.label||''}${vm.deload?' · lättare':''}</span></div>
    <div class="wkbar">${S.plan.weeks.map((w,i)=>`<button class="${i===vw?'on':''} ${w.mod&&w.mod.deload?'dl':''}" onclick="S.planView=${i};renderProgram()">V${i+1}${i===cw?'<i></i>':''}</button>`).join('')}<button class="add" onclick="addWeek()">+</button></div>
    <div class="wkmod">${modDesc(vm)}</div>
    <div class="chips" style="margin:6px 0 4px">${[['normal','Normal'],['up','Tyngre'],['deload','Lättare']].map(([k,l])=>`<div class="chip ${modType(vm)===k?'on':''}" onclick="setWeekType('${k}')" style="padding:5px 10px;font-size:11.5px">${l}</div>`).join('')}</div>
    ${vDays().map((l,di)=>`<div class="wday ${di===ti?'today':''}"><div class="wd">${DAYN[di]}${di===ti?'<span>idag</span>':''}</div><div class="wsess">${l.length?l.map((x,si)=>`<div class="spill ${kindOf(x.k)}" onclick="openSess(${di},${si})">${ic(kindOf(x.k)==='cardio'?'flame':'dumbbell')}<span>${l.length>1?SLOT_TXT[si]+': ':''}${sessName(x.k)}</span></div>`).join(''):'<span class="muted" style="font-size:12.5px">Vila</span>'}${l.length<2?`<button class="addp" onclick="openAdd(${di})" aria-label="Lägg till pass">+</button>`:''}</div></div>`).join('')}
    <p class="muted" style="font-size:11.5px;margin-top:8px">Tryck på ett pass för att se, ändra eller flytta det. Max två pass per dag. Ändringar gäller vecka ${vw+1}.</p>
    <div class="row" style="gap:6px;margin-top:8px"><button class="btn o sm" style="flex:1" onclick="copyWeekAll()">Kopiera till alla veckor</button>${nW>1?`<button class="btn o sm" style="flex:1;color:var(--d)" onclick="delWeek()">Ta bort vecka ${vw+1}</button>`:''}</div></div>
  <div class="card"><button class="btn o full" onclick="endPlan()" style="color:var(--d)">Avsluta programmet (tillbaka till standard)</button></div>`;
}
function modType(m){return m.deload?'deload':(m.setAdd||m.rpe>=8.5)?'up':'normal';}
function modDesc(m){if(m.deload)return 'Lättare vecka: ca 40 % färre set och RPE högst 6,5 – för återhämtning.';const b=[];if(m.setAdd)b.push('+'+m.setAdd+' set på baslyft');if(m.rpe!=null)b.push('RPE '+String(m.rpe).replace('.',','));if(m.reps)b.push('baslyft '+m.reps[0]+'–'+m.reps[1]+' reps');if(m.cMul&&m.cMul!==1)b.push('kondition '+(m.cMul>1?'+':'')+Math.round((m.cMul-1)*100)+' %');return b.length?b.join(' · '):'Passen som de är skrivna.';}
function setWeekType(t){const w=S.plan.weeks[vWi()],lbl=(w.mod&&w.mod.label)||('Vecka '+(vWi()+1));w.mod=t==='deload'?{label:'Lätt vecka',deload:true}:t==='up'?{label:'Tyngre',setAdd:1,rpe:8.5}:{label:lbl==='Lätt vecka'||lbl==='Tyngre'?'Vecka '+(vWi()+1):lbl};save();renderProgram();refresh();}
function addWeek(){if(S.plan.weeks.length>=16){toast('Max 16 veckor');return;}const src=S.plan.weeks[vWi()];S.plan.weeks.push({days:JSON.parse(JSON.stringify(src.days)),mod:{label:'Vecka '+(S.plan.weeks.length+1)}});S.planView=S.plan.weeks.length-1;save();renderProgram();toast('Vecka '+S.plan.weeks.length+' tillagd (kopia)');}
function delWeek(){if(S.plan.weeks.length<2)return;const cw=curWi();S.plan.weeks.splice(vWi(),1);S.planView=Math.min(vWi(),S.plan.weeks.length-1);save();renderProgram();refresh();toast('Veckan borttagen');}
function copyWeekAll(){const src=JSON.stringify(vDays());S.plan.weeks.forEach(w=>w.days=JSON.parse(src));save();renderProgram();refresh();toast('Kopierat till alla '+S.plan.weeks.length+' veckor');}
function newEmptyPlan(){S.plan={name:'Mitt schema',goal:null,weeks:[{days:[[],[],[],[],[],[],[]],mod:{label:'Vecka 1'}}],start:mondayOf(new Date()).toISOString()};S.planView=0;S.selSlot=0;save();renderProgram();refresh();toast('Tomt schema skapat – lägg till pass');}
function endPlan(){S.plan=null;S.override=null;S.sessionKey=rotation()[0].k;save();renderProgram();refresh();toast('Tillbaka till standardupplägg');}

/* ---------- lägga till / visa pass ---------- */
function openAdd(di){openSheet(()=>{
  const own=Object.entries(S.customT||{}).filter(([k,v])=>!v.hidden);
  const opt=(k)=>`<div class="acard" onclick="addToDay(${di},'${k}')"><div class="aic">${ic(kindOf(k)==='cardio'?'flame':'dumbbell')}</div><div class="abody"><div class="at">${sessName(k)}</div><div class="am">${kindOf(k)==='cardio'?cT(k).cardio.min+' min':getT(k).length+' övningar'}</div></div><span class="chev">${ic('chev')}</span></div>`;
  return{t:'Lägg till pass',s:DAYN_L[di]+' · vecka '+(vWi()+1)+((vDays()[di]||[]).length?' · pass 2 (dubbelpass)':''),h:
   ((vDays()[di]||[]).length?`<div class="coach" style="margin-bottom:10px"><strong>Dubbelpass:</strong> Lägg minst 3 timmar mellan passen. Kondition och styrka i samma pass kan minska explosiv styrka något. ${srcTag(['schumann'])}</div>`:'')+
   `<div class="mlist"><div class="acard" onclick="newSess(${di},'strength')"><div class="aic">${ic('dumbbell')}</div><div class="abody"><div class="at">Nytt styrkepass</div><div class="am">Välj övningar själv</div></div><span class="chev">${ic('chev')}</span></div>
    <div class="acard" onclick="newSess(${di},'cardio')"><div class="aic">${ic('flame')}</div><div class="abody"><div class="at">Nytt konditionspass</div><div class="am">Zon 2, 4×4, 15/15 eller lätt</div></div><span class="chev">${ic('chev')}</span></div></div>
   ${own.length?`<div class="kt" style="margin-top:16px">Dina pass</div><div class="mlist">${own.map(([k])=>opt(k)).join('')}</div>`:''}
   <div class="kt" style="margin-top:16px">Färdiga mallar</div><div class="mlist">${Object.keys(TEMPLATES).map(opt).join('')}</div>`};});}
function addToDay(di,k){const l=vDays()[di];if(l.length>=2){toast('Max två pass per dag');return;}l.push({k});save();SH=[];goBack();renderProgram();refresh();toast(l.length>1?'Dubbelpass – minst 3 h mellan passen':'Pass tillagt');}
function openSess(di,si){openSheet(()=>{
  const x=vDays()[di][si];if(!x)return{t:'Pass',h:''};const k=x.k,card=kindOf(k)==='cardio';
  const body=card?cardioHtml(k,vMod()):weekAdjust(getT(k),vMod()).map(e=>`<div class="ex" onclick="openLib('${e.id}')"><div class="ex-name">${(EX[e.id]||{name:e.id}).name}</div><div class="ex-meta">${e.sets} × ${e.reps[0]}–${e.reps[1]} @ RPE ${e.rpe}${e.note?' · '+e.note:''}</div></div>`).join('');
  return{t:sessName(k),s:DAYN_L[di]+' · vecka '+(vWi()+1)+(vDays()[di].length>1?' · '+SLOT_TXT[si]:''),h:`<div class="card">${body||'<div class="empty">Inga övningar ännu.</div>'}</div>
   <button class="btn p full" onclick="editSess('${k}',${di},${si})">${cT(k)?'Redigera passet':'Gör en egen kopia och redigera'}</button>
   <button class="btn o full" onclick="trainAnyway('${k}');closeSheets();tab('today')">Kör det här passet idag</button>
   <div class="card" style="margin-top:12px"><h4>Flytta till</h4><div class="chips">${DAYN.map((d,i)=>`<div class="chip ${i===di?'on':''}" onclick="moveSess(${di},${si},${i})">${d}</div>`).join('')}</div></div>
   <button class="btn o full" style="color:var(--d)" onclick="removeSess(${di},${si})">Ta bort från ${DAYN_L[di].toLowerCase()}</button>`};});}
function moveSess(di,si,to){if(to===di)return;const t=vDays()[to];if(t.length>=2){toast(DAYN[to]+' har redan två pass');return;}const [x]=vDays()[di].splice(si,1);t.push(x);save();SH=[];goBack();renderProgram();refresh();toast('Flyttat till '+DAYN_L[to].toLowerCase());}
function removeSess(di,si){vDays()[di].splice(si,1);save();SH=[];goBack();renderProgram();refresh();toast('Borttaget');}

/* ---------- passredigerare ---------- */
let ED=null;
function newSess(di,kind){const k='c_'+Date.now().toString(36);ED={k,di,isNew:true,d:kind==='cardio'?{n:'Kondition',kind:'cardio',cardio:{proto:'z2',min:40,mod:'Valfri'}}:{n:'Mitt styrkepass',kind:'strength',ex:[]}};openSheet(edSheet);}
function editSess(k,di,si){
  let key=k,d;
  if(cT(k))d=JSON.parse(JSON.stringify(cT(k)));else{key='c_'+Date.now().toString(36);d={n:sessName(k)+' (egen)',kind:'strength',ex:JSON.parse(JSON.stringify(TEMPLATES[k]||[]))};}
  ED={k:key,orig:k,di,si,isNew:!cT(k),d};openSheet(edSheet);
}
function edSheet(){
  const d=ED.d;let h=`<label class="f" style="margin-top:0">Namn på passet</label><input value="${(d.n||'').replace(/"/g,'&quot;')}" oninput="ED.d.n=this.value"/>`;
  if(d.kind==='cardio'){
    const c=d.cardio;
    h+=`<label class="f">Typ</label><div class="fgrid">${Object.entries(CARDIO).map(([k,P])=>`<div class="fo ${c.proto===k?'on':''}" onclick="ED.d.cardio.proto='${k}';if('${k}'==='int44'||'${k}'==='int1515')ED.d.cardio.min=Math.max(ED.d.cardio.min,35);renderSheet()"><b>${P.short}</b><span>${k==='z2'?'lugnt':k==='easy'?'vila':'hårt'}</span></div>`).join('')}</div>
      <p class="muted" style="font-size:12.5px;line-height:1.5;margin-top:8px">${CARDIO[c.proto].desc} ${srcTag(CARDIO[c.proto].src)}</p>
      <label class="f">Aktivitet</label><div class="chips">${MODS.map(m=>`<div class="chip ${c.mod===m?'on':''}" onclick="ED.d.cardio.mod='${m}';renderSheet()">${m}</div>`).join('')}</div>
      <label class="f">Minuter</label><div class="chips">${[20,30,40,45,60,75,90].map(m=>`<div class="chip ${+c.min===m?'on':''}" onclick="ED.d.cardio.min=${m};renderSheet()">${m}</div>`).join('')}</div>`;
  }else{
    h+=`<div class="kt" style="margin-top:14px">Övningar</div>${d.ex.length?'':'<div class="empty">Lägg till din första övning.</div>'}
      ${d.ex.map((e,i)=>`<div class="edrow"><div class="row between"><b style="font-size:13.5px">${(EX[e.id]||{name:e.id}).name}</b><div class="row" style="gap:4px"><button class="btn o sm" onclick="edMove(${i},-1)">↑</button><button class="btn o sm" onclick="edMove(${i},1)">↓</button><button class="btn o sm" style="color:var(--d)" onclick="ED.d.ex.splice(${i},1);renderSheet()">✕</button></div></div>
        <div class="edgrid"><label>Set<input type="number" min="1" max="10" value="${e.sets}" onchange="ED.d.ex[${i}].sets=+this.value||1"/></label><label>Reps från<input type="number" min="1" value="${e.reps[0]}" onchange="ED.d.ex[${i}].reps[0]=+this.value||1"/></label><label>till<input type="number" min="1" value="${e.reps[1]}" onchange="ED.d.ex[${i}].reps[1]=+this.value||1"/></label><label>RPE<input type="number" step=".5" min="5" max="10" value="${e.rpe}" onchange="ED.d.ex[${i}].rpe=+this.value||8"/></label></div></div>`).join('')}
      <button class="btn o full" onclick="openSheet(pickSheet)">+ Lägg till övning</button>
      <p class="muted" style="font-size:11.5px;margin-top:8px">Tips: tunga baslyft först, småövningar sist. ${srcTag(['acsm'])}</p>`;
  }
  h+=`<button class="btn p full" onclick="saveSess()">Spara passet</button>`;
  return{t:ED.isNew&&!ED.orig?'Nytt pass':'Redigera pass',s:d.kind==='cardio'?'Kondition':'Styrka',h};
}
function edMove(i,d){const a=ED.d.ex,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];renderSheet();}
function saveSess(){
  const d=ED.d;if(d.kind!=='cardio'&&!d.ex.length){toast('Lägg till minst en övning');return;}
  S.customT=S.customT||{};S.customT[ED.k]=d;
  if(ED.isNew&&!ED.orig){vDays()[ED.di].push({k:ED.k});}
  else if(ED.orig&&ED.orig!==ED.k){const x=vDays()[ED.di][ED.si];if(x)x.k=ED.k;}
  save();SH=[];goBack();renderProgram();refresh();toast('Passet sparat');
}
let pickQ='',pickEq='alla',pickMus='Alla';
function pickSheet(){
  const mus=['Alla',...new Set(Object.values(EX).flatMap(e=>e.m))];
  const list=Object.entries(EX).filter(([k,e])=>(pickEq==='alla'||eqOk(k,pickEq))&&(pickMus==='Alla'||e.m.includes(pickMus))&&(!pickQ||(e.name+' '+e.m.join(' ')).toLowerCase().includes(pickQ)));
  return{t:'Välj övning',s:list.length+' övningar',h:`<div class="searchbox">${ic('search')}<input placeholder="Sök övning eller muskel…" value="${pickQ}" oninput="pickQ=this.value.toLowerCase();clearTimeout(window._pq);window._pq=setTimeout(()=>{renderSheet();const i=sheetBox.querySelector('input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)"/></div>
   <div class="chips" style="margin:10px 0 4px">${[['alla','All utrustning'],['gym','Gym'],['db','Hantlar'],['bw','Kroppsvikt']].map(([k,l])=>`<div class="chip ${pickEq===k?'on':''}" onclick="pickEq='${k}';renderSheet()">${l}</div>`).join('')}</div>
   <div class="chips" style="margin-bottom:10px">${mus.map(m=>`<div class="chip ${pickMus===m?'on':''}" onclick="pickMus='${m}';renderSheet()" style="padding:5px 9px;font-size:11px">${m}</div>`).join('')}</div>
   <div class="mlist">${list.map(([k,e])=>`<div class="acard" onclick="ED.d.ex.push({id:'${k}',sets:3,reps:${e.priority===1?'[6,10]':'[10,15]'},rpe:8});SH.pop();renderSheet();toast('${e.name.replace(/'/g,"")} tillagd')"><div class="aic">${ic('dumbbell')}</div><div class="abody"><div class="at">${e.name}</div><div class="am">${e.m.join(', ')} · ${EQ_TXT[EXEQ[k]||'gym']}</div></div><span class="chev">+</span></div>`).join('')||'<div class="empty">Inga träffar.</div>'}</div>`};
}

/* ---------- programgenerator ---------- */
const GOALS_T={hypertrophy:['Bygga muskler','dumbbell'],strength:['Bli starkare','zap'],fat_loss:['Gå ner i fett','flame'],endurance:['Bättre kondition','refresh'],health:['Hälsa & allround','target']};
let GEN=null;
function openGen(){
  GEN=genFromProfile();
  openSheet(genSheet);
}
function gFocus(k){const a=(GEN.focus||[]).slice(),i=a.indexOf(k);if(i>=0)a.splice(i,1);else{a.push(k);if(a.length>3)a.shift();}GEN.focus=a;GEN.prev=null;S.prof=S.prof||{};S.prof.focus=a.slice();save();renderSheet();}
function gset(k,v){GEN[k]=v;GEN.prev=null;renderSheet();}
function genSheet(){
  const g=GEN,ch=(k,opts)=>`<div class="chips">${opts.map(([v,l])=>`<div class="chip ${g[k]===v?'on':''}" onclick="gset('${k}',${typeof v==='string'?`'${v}'`:v})">${l}</div>`).join('')}</div>`;
  let h=`<div class="kt">Mål</div><div class="fgrid g2">${Object.entries(GOALS_T).map(([k,[l,i]])=>`<div class="fo ${g.goal===k?'on':''}" onclick="gset('goal','${k}')">${ic(i)}<b>${l}</b></div>`).join('')}</div>
   <label class="f">Träningsdagar per vecka</label>${ch('days',[2,3,4,5,6,7].map(n=>[n,n]))}
   <label class="f">Tid per pass</label>${ch('len',[[30,'30 min'],[45,'45 min'],[60,'60 min'],[75,'75 min'],[90,'90 min']])}
   <label class="f">Utrustning</label>${ch('eq',[['gym','Gym'],['db','Hantlar hemma'],['bw','Bara kroppsvikt']])}
   <label class="f">Erfarenhet</label>${ch('exp',[['beginner','Under 1 år'],['intermediate','1–3 år'],['advanced','Över 3 år']])}
   <label class="f">Fokusområden (upp till 3)</label><div class="chips">${Object.entries(FOCUS_LBL).map(([k,l])=>`<div class="chip ${(g.focus||[]).includes(k)?'on':''}" onclick="gFocus('${k}')">${l}</div>`).join('')}</div>
   <label class="f">Konditionsform</label>${ch('mod',MODS.map(m=>[m,m]))}
   <label class="f">Dubbelpass (två pass samma dag)</label>${ch('dbl',[[false,'Nej'],[true,'Ja, tillåt']])}
   <label class="f">Programlängd</label>${ch('weeks',[[1,'1 vecka'],[4,'4 veckor'],[6,'6 veckor'],[8,'8 veckor'],[12,'12 veckor']])}
   ${g.weeks>1?`<label class="f">Lättare vecka</label>${ch('light',[['auto','Auto (vid 8+ v)'],['end','Sist i blocket'],['none','Ingen']])}`:''}
   <button class="btn p full" onclick="GEN.prev=buildProgram(GEN);renderSheet();setTimeout(()=>document.getElementById('genPrev')?.scrollIntoView({behavior:'smooth'}),50)">Skapa förslag</button>`;
  if(g.prev){const P=g.prev;
    h+=`<div id="genPrev" class="card glow" style="margin-top:14px"><div class="kt">Förslag</div><div style="font-size:17px;font-weight:700;margin-bottom:8px">${P.name}</div>
     ${P.weeks.length>1?`<div class="kt">Progression vecka för vecka</div><div class="ptab">${P.weeks.map((w,i)=>`<div class="${w.mod.deload?'dl':''}"><b>V${i+1}</b><span>${w.mod.label}</span><em>${modDesc(w.mod)}</em></div>`).join('')}</div><div class="kt" style="margin-top:12px">Veckoschema</div>`:''}
     ${P.weeks[0].days.map((l,di)=>`<div class="wday"><div class="wd">${DAYN[di]}</div><div class="wsess">${l.length?l.map((x,si)=>`<div class="spill ${P.T[x.k].kind}">${ic(P.T[x.k].kind==='cardio'?'flame':'dumbbell')}<span>${l.length>1?SLOT_TXT[si]+': ':''}${P.T[x.k].n}</span></div>`).join(''):'<span class="muted" style="font-size:12.5px">Vila</span>'}</div></div>`).join('')}
     <div class="kt" style="margin-top:14px">Därför ser det ut så här</div>${P.notes.map(n=>`<div class="tip">${n.t} ${srcTag(n.s)}</div>`).join('')}
     <div class="kt" style="margin-top:14px">Passen</div>${Object.values(P.T).filter(t=>t.kind!=='cardio').map(t=>`<details class="acc"><summary>${t.n} · ${t.ex.length} övningar · ca ${t.est} min</summary><div class="acc-body">${t.ex.map(e=>`<div class="ex-meta" style="padding:4px 0"><b style="color:var(--t)">${EX[e.id].name}</b> – ${e.sets} × ${e.reps[0]}–${e.reps[1]} @ RPE ${e.rpe}${e.note?' · '+e.note:''}</div>`).join('')}</div></details>`).join('')}
     <button class="btn p full" onclick="applyGen()">Använd programmet</button>
     <p class="muted" style="font-size:11.5px;margin-top:8px">Allt kan ändras efteråt: flytta, byt övningar eller lägg till pass.</p></div>`;}
  return{t:'Skapa program',s:'Efter mål, tid och utrustning',h};
}
const SPREAD={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,4,5],6:[0,1,2,3,4,5],7:[0,1,2,3,4,5,6]};
const SPLITS={1:['FA'],2:['FA','FB'],3:['FA','FB','FC'],4:['U','L','U2','L2'],5:['U','L','PU','PL','LG'],6:['PU','PL','LG','PU2','PL2','LG2']};
const STYPE={FA:['Helkropp A',[['squat','m'],['hpush','m'],['hpull','m'],['hinge','s'],['vpush','a'],['core','a']]],
 FB:['Helkropp B',[['hinge','m'],['vpull','m'],['vpush','m'],['single','s'],['incline','a'],['reardelt','a']]],
 FC:['Helkropp C',[['squat2','m'],['incline','m'],['hpull2','m'],['hamcurl','a'],['biceps','a'],['triceps','a']]],
 U:['Överkropp A',[['hpush','m'],['hpull','m'],['vpush','s'],['vpull','s'],['lateral','a'],['biceps','a'],['triceps','a']]],
 U2:['Överkropp B',[['incline','m'],['vpull','m'],['hpull2','s'],['vpush2','s'],['reardelt','a'],['biceps','a'],['triceps','a']]],
 L:['Underkropp A',[['squat','m'],['hinge','s'],['single','s'],['hamcurl','a'],['calves','a'],['core','a']]],
 L2:['Underkropp B',[['hinge','m'],['squat2','s'],['single','s'],['quadiso','a'],['calves','a'],['core','a']]],
 PU:['Push A',[['hpush','m'],['vpush','s'],['incline','s'],['lateral','a'],['triceps','a']]],
 PU2:['Push B',[['incline','m'],['vpush2','s'],['hpush2','s'],['lateral','a'],['triceps','a']]],
 PL:['Pull A',[['vpull','m'],['hpull','s'],['reardelt','a'],['biceps','a'],['core','a']]],
 PL2:['Pull B',[['hpull2','m'],['vpull2','s'],['reardelt','a'],['biceps','a']]],
 LG:['Ben A',[['squat','m'],['hinge','s'],['single','s'],['hamcurl','a'],['calves','a']]],
 LG2:['Ben B',[['hinge','m'],['squat2','s'],['single','s'],['quadiso','a'],['calves','a']]]};
const PAT={squat:['back_squat','goblet_squat','bw_squat'],squat2:['front_squat','leg_press','bulgarian_split_squat','goblet_squat'],hinge:['rdl','db_rdl','single_leg_rdl'],single:['walking_lunge','bulgarian_split_squat','step_up'],
 hpush:['bench_press','db_bench','push_up'],hpush2:['db_bench','push_up'],incline:['incline_bench','db_incline_press','bench_dip'],hpull:['barbell_row','db_row','inverted_row'],hpull2:['cable_row','chest_supported_row','inverted_row'],
 vpull:['pullup','inverted_row'],vpull2:['lat_pulldown','chin_up','inverted_row'],vpush:['ohp','db_ohp','pike_push_up'],vpush2:['db_ohp','landmine_press','pike_push_up'],lateral:['lateral_raise'],reardelt:['face_pull','db_rear_fly'],
 biceps:['barbell_curl','db_curl','chin_up'],triceps:['tricep_pushdown','overhead_tricep_ext','bench_dip'],hamcurl:['leg_curl','nordic_curl','glute_bridge'],quadiso:['leg_extension','step_up'],calves:['calf_raise'],core:['hanging_leg_raise','plank','dead_bug']};
function pickEx(pat,G,used){
  let opts=PAT[pat]||[];
  if(pat==='hinge'&&G.goal==='strength'&&G.eq==='gym')opts=['deadlift',...opts];
  if(pat==='hamcurl'&&G.exp!=='advanced')opts=opts.filter(x=>x!=='nordic_curl');
  return opts.find(id=>EX[id]&&eqOk(id,G.eq)&&!used.has(id))||null;
}
const FOCUS_MUS={chest:['Chest'],back:['Upper Back','Lats','Back'],shoulders:['Shoulders','Rear Delts'],arms:['Biceps','Triceps'],legs:['Quadriceps','Hamstrings','Calves'],glutes:['Glutes'],core:['Core']};
const FOCUS_LBL={chest:'Bröst',back:'Rygg',shoulders:'Axlar',arms:'Armar',legs:'Ben',glutes:'Säte',core:'Bål/mage'};
function buildProgram(G){
  const n=G.days,beg=G.exp==='beginner';
  let s,cWant;
  if(G.goal==='hypertrophy'){s=Math.min(n,6);cWant=n>=7?1:0;}
  else if(G.goal==='strength'){s=Math.min(n,5);cWant=Math.max(0,n-5);}
  else if(G.goal==='fat_loss'){s=n<=3?n:Math.min(4,n-1);cWant=Math.max(2,n-s);}
  else if(G.goal==='endurance'){s=n>=3?2:1;cWant=Math.max(2,n-s);}
  else{s=Math.min(n,3);cWant=Math.max(2,n-s);}
  if(beg&&s>4){s=4;}
  const order=SPREAD[n];const sd=[];for(let j=0;j<s;j++){const d=order[Math.round(j*n/s)];if(!sd.includes(d))sd.push(d);}
  const free=order.filter(d=>!sd.includes(d));
  const T={},days=[[],[],[],[],[],[],[]],notes=[];
  // --- styrka
  const types=SPLITS[sd.length]||SPLITS[3];
  const freqPer=sd.length>=4?2:sd.length;
  const wk={hypertrophy:{beginner:10,intermediate:14,advanced:18},strength:{beginner:9,intermediate:11,advanced:13},fat_loss:{beginner:10,intermediate:12,advanced:14},endurance:{beginner:6,intermediate:6,advanced:8},health:{beginner:6,intermediate:8,advanced:8}}[G.goal][G.exp];
  const R={strength:{m:[3,6],s:[5,8],a:[8,12],rest:{m:3,s:2.5,a:1.5}},hypertrophy:{m:[6,10],s:[8,12],a:[10,15],rest:{m:2.5,s:2,a:1.5}},fat_loss:{m:[6,10],s:[8,12],a:[10,15],rest:{m:2,s:1.5,a:1}},endurance:{m:[8,12],s:[10,15],a:[12,15],rest:{m:1.5,s:1.5,a:1}},health:{m:[8,12],s:[8,12],a:[10,15],rest:{m:2,s:1.5,a:1}}}[G.goal];
  types.forEach((ty,i)=>{
    const [nm,pats]=STYPE[ty];const used=new Set();const ex=[];
    pats.forEach(([p,role])=>{const id=pickEx(p,G,used);if(!id)return;used.add(id);
      let sets=role==='m'?Math.round(wk/freqPer*(G.goal==='strength'?0.6:0.5)):role==='s'?Math.round(wk/freqPer*0.35):(G.goal==='hypertrophy'&&!beg?3:2);
      sets=Math.max(2,Math.min(role==='m'?5:4,sets));
      let reps=R[role].slice();if(beg&&G.goal!=='strength'&&role!=='a')reps=[8,12];if(beg&&G.goal==='strength'&&role==='m')reps=[5,8];
      if(['plank'].includes(id))reps=[30,60];
      const rpe=beg?7.5:(role==='a'?8.5:8);
      const note=(id==='pullup'||id==='chin_up')&&G.eq!=='gym'?'kräver räcke':id==='plank'?'sekunder':'';
      ex.push({id,sets,reps,rpe,role,note});});
    const k='g_'+ty+'_'+i;T[k]={n:nm,kind:'strength',gen:true,ex};
    days[sd[i]].push({k});
  });
  // --- fokusområden: extra övning för de muskelgrupper man vill prioritera
  const sKeys=Object.keys(T);
  const focus=(G.focus||[]).filter(f=>FOCUS_MUS[f]).slice(0,3);
  focus.forEach(f=>{
    const mus=FOCUS_MUS[f],inG=e=>mus.includes((EX[e.id]?.m||[])[0]);
    const hits=s=>T[s].ex.some(e=>(EX[e.id]?.m||[]).some(m=>mus.includes(m)));
    let targets=sKeys.filter(hits);if(!targets.length)targets=sKeys.slice();
    targets.slice(0,Math.max(2,freqPer)).forEach(s=>{
      const ex=T[s].ex,own=ex.filter(inG);
      // 1) befintliga övningar för muskelgruppen: +1 set och skyddas när passet kortas
      own.forEach(e=>{e.focus=true;if(e.role!=='m'&&e.sets<4)e.sets++;});
      // 2) saknas en egen övning för gruppen i passet: lägg till en
      if(own.filter(e=>e.role!=='m').length<(f==='arms'?2:1)){
        const used=new Set(ex.map(e=>e.id));
        const pick=m0=>Object.keys(EX).filter(x=>!used.has(x)&&eqOk(x,G.eq)&&(EX[x].m||[])[0]===m0).sort((a,b)=>(EX[b].priority||3)-(EX[a].priority||3))[0];
        const want=f==='arms'?['Biceps','Triceps'].filter(m=>!own.some(e=>EX[e.id].m[0]===m)):[mus.find(m=>pick(m))];
        want.forEach(m0=>{const id=m0&&pick(m0);if(!id)return;used.add(id);
          const item={id,sets:3,reps:R.a.slice(),rpe:beg?7.5:8.5,role:'a',note:id==='plank'?'fokus · sekunder':'fokus',focus:true};
          if(id==='plank')item.reps=[30,60];
          const at=ex.findIndex(e=>e.role==='a');if(at<0)ex.push(item);else ex.splice(at,0,item);});
      }
    });
  });
  if(focus.length)notes.unshift({t:'Extra volym för '+focus.map(f=>FOCUS_LBL[f].toLowerCase()).join(', ')+' – dina fokusområden får fler set och skyddas när passen kortas till din tid.',s:[]});
  // --- passlängd: korta ner tills passet ryms i vald tid (fokusövningar tas bort sist)
  sKeys.forEach(s=>{const ex=T[s].ex;
    const est=()=>Math.round(8+ex.reduce((t,e)=>t+e.sets*(R.rest[e.role]+0.8),0));
    let guard=0;while(est()>G.len&&guard++<40){
      const acc=ex.map((e,i)=>[e,i]).filter(([e])=>e.role==='a'),plain=acc.filter(([e])=>!e.focus);
      if(plain.length&&acc.length>1&&est()-G.len>8){ex.splice(plain.pop()[1],1);continue;}
      const big=[...ex].sort((a,b)=>(a.focus?1:0)-(b.focus?1:0)||({a:0,s:1,m:2}[a.role]-{a:0,s:1,m:2}[b.role])).find(e=>e.sets>2);
      if(big){big.sets--;continue;}
      if(ex.length>3){const drop=[...ex.keys()].reverse().find(i=>!ex[i].focus&&ex[i].role!=='m');ex.splice(drop!=null?drop:ex.length-1,1);}else break;}
    T[s].ex=ex.map(e=>{const c={...e};delete c.focus;return c;});T[s].est=est();});
  // --- kondition
  const cmin={fat_loss:40,endurance:45,health:Math.min(60,Math.max(30,Math.ceil(150/Math.max(1,cWant)/5)*5)),hypertrophy:30,strength:30}[G.goal];
  const protos=[];
  for(let j=0;j<cWant;j++){
    let p='z2';
    if(G.goal==='endurance'){if(j===0)p='int44';else if(j===2&&cWant>=4)p='int1515';}
    else if(G.goal==='fat_loss'&&j===1&&!beg)p='int44';
    else if((G.goal==='hypertrophy'||G.goal==='strength'))p='easy';
    protos.push(p);
  }
  let cPlaced=0,cExtra=0;
  protos.forEach((p,j)=>{
    const k='g_c'+j;let min=p==='int44'||p==='int1515'?35:cmin;if(G.goal==='endurance'&&p==='z2'&&j===protos.length-1&&protos.length>=3)min=Math.min(90,G.len+15);
    min=Math.min(min,Math.max(20,G.len));
    T[k]={n:CARDIO[p].n+(p==='z2'||p==='easy'?' · '+min+' min':''),kind:'cardio',gen:true,cardio:{proto:p,min,mod:G.mod}};
    if(cPlaced<free.length){days[free[cPlaced++]].push({k});}
    else if(G.dbl){const cand=sd.filter(d=>days[d].length<2&&!/Under|Ben/.test(T[days[d][0].k].n));const d=(cand.length?cand:sd.filter(d=>days[d].length<2))[cExtra%Math.max(1,(cand.length||sd.length))];if(d!=null){days[d].push({k});cExtra++;}else delete T[k];}
    else delete T[k];
  });
  // --- förklaringar
  const nS=sd.length,cTot=Object.values(T).filter(t=>t.kind==='cardio').reduce((a,t)=>a+t.cardio.min,0);
  notes.push({t:`${nS} styrkepass/vecka. Varje stor muskel tränas ca ${freqPer>=2?'2':'1'} gång${freqPer>=2?'er':''} per vecka – minst två gånger ger mer tillväxt än en.`,s:['sch_freq','acsm']});
  if(G.goal==='hypertrophy'||G.goal==='fat_loss')notes.push({t:`Ca ${wk} set per muskel och vecka. Fler set ger mer muskeltillväxt; ≥10 gav bäst effekt i forskningen.${beg?' Som nybörjare räcker lägre volym i början.':''}`,s:['sch_vol']});
  if(G.goal==='strength')notes.push({t:'Tunga baslyft med 3–6 reps och längre vila (ca 3 min). Tyngre vikter ger mest maxstyrka.',s:['currier','acsm','sch_rest']});
  else if(G.goal==='hypertrophy')notes.push({t:'Vi blandar 6–15 reps. Muskler växer lika bra med tunga som lätta vikter när seten körs nära failure.',s:['currier','sch_load']});
  if(beg)notes.push({t:'Nybörjare: 8–12 reps och 2–4 pass/vecka räcker långt. Öka vikten gradvis när du klarar reps-taket.',s:['acsm']});
  notes.push({t:'Stanna 1–3 reps före failure (RPE 7–9). Att köra till failure gav ingen tydlig extra effekt.',s:['refalo']});
  if(cTot)notes.push({t:`Kondition ${cTot} min/vecka${G.goal==='health'||G.goal==='fat_loss'?' – WHO rekommenderar 150–300 min måttlig aktivitet':''}.${protos.some(p=>p.startsWith('int'))?' Intervaller förbättrar konditionen (VO₂max) mer än lugn träning, men båda ger stora förbättringar.':''}`,s:protos.some(p=>p.startsWith('int'))?['who','milanovic','helgerud']:['who']});
  if(cExtra)notes.push({t:`${cExtra} dubbelpass: konditionen ligger som pass 2 på överkroppsdagar. Lägg minst 3 timmar mellan passen.`,s:['schumann']});
  else if(protos.length>Object.values(T).filter(t=>t.kind==='cardio').length)notes.push({t:'Alla konditionspass fick inte plats. Tillåt dubbelpass eller lägg till fler dagar för att få med dem.',s:[]});
  if(n===7)notes.push({t:'Sju dagar: minst en dag är lätt återhämtning. Sömn och vila är när kroppen bygger upp sig.',s:['lamon']});
  const mods=weekMods(G);
  if(mods.length>1){
    if(G.goal==='strength')notes.push({t:G.exp==='beginner'?'Linjär progression: färre reps och tyngre vikter vecka för vecka. Periodiserad träning gav mer maxstyrka än träning utan variation.':'Varierande veckor (volym/tung). Hos tränade gav varierad (böljande) periodisering mest maxstyrka.',s:['williams','moesgaard']});
    else if(G.goal==='hypertrophy')notes.push({t:'Volymen ökar gradvis (+1–2 set på baslyften) och ansträngningen stiger. Periodiseringsmodellen i sig spelar liten roll för muskeltillväxt – det viktiga är gradvis ökning.',s:['moesgaard','sch_vol','acsm']});
    else notes.push({t:'Belastningen ökar gradvis över veckorna'+(G.goal==='endurance'||G.goal==='fat_loss'||G.goal==='health'?', även konditionsminuterna':'')+'.',s:['acsm']});
    if(mods.some(m=>m.deload))notes.push({t:'Sista veckan är lättare. Det är valfritt: en studie fann att en helt träningsfri vecka varken gav mer muskler eller styrka – därför är veckan lättare, inte ledig.',s:['coleman']});
  }
  return{name:GOALS_T[G.goal][0]+' · '+n+' dagar'+(mods.length>1?' · '+mods.length+' v':''),goal:G.goal,days,weeks:mods.map(m=>({days:JSON.parse(JSON.stringify(days)),mod:m})),T,notes};
}
function weekMods(G){
  const n=G.weeks||1,beg=G.exp==='beginner';if(n<=1)return[{label:'Vecka 1'}];
  const dl=G.light==='end'||(G.light==='auto'&&n>=8);const W=n-(dl?1:0);const out=[];
  for(let i=0;i<W;i++){const t=W>1?i/(W-1):0,r5=x=>Math.round(x*2)/2;let m;
    if(G.goal==='hypertrophy'){const sa=Math.min(beg?1:2,Math.floor(i/Math.max(1,Math.ceil(W/3))));m={label:['Bas','Bygg','Topp'][sa]||'Topp',setAdd:sa,rpe:r5(beg?7+t:7.5+t*1.5)};}
    else if(G.goal==='strength'){
      if(beg){const ph=t<.34?0:t<.67?1:2;m={label:['Bas','Tyngre','Tyngst'][ph],reps:[[6,8],[5,6],[3,5]][ph],rpe:r5(7.5+t)};}
      else m=i%2===0?{label:'Volym',reps:[6,8],rpe:r5(7.5+t*.5)}:{label:'Tung',reps:[3,5],rpe:r5(8+t*.5)};}
    else if(G.goal==='fat_loss')m={label:'Vecka '+(i+1),rpe:r5(7.5+t),cMul:Math.round((1+t*.25)*100)/100};
    else if(G.goal==='endurance')m={label:t<.5?'Bygg':'Topp',rpe:7.5,cMul:Math.round((1+t*.3)*100)/100};
    else m={label:t<.34?'Start':t<.67?'Bygg':'Full',rpe:r5(7+t),cMul:Math.round((.8+t*.3)*100)/100};
    out.push(m);}
  if(dl)out.push({label:'Lätt vecka',deload:true});
  return out;
}
function applyGen(){
  const P=GEN.prev;if(!P)return;
  S.customT=Object.fromEntries(Object.entries(S.customT||{}).filter(([k])=>!k.startsWith('g_')));
  Object.assign(S.customT,P.T);
  S.plan={name:P.name,goal:P.goal,weeks:P.weeks,start:mondayOf(new Date()).toISOString()};S.planView=0;S.selSlot=0;S.override=null;S.exp=GEN.exp;
  save();SH=[];tab('train',true);sub('train','schema');refresh();toast('Programmet är aktivt');
}
