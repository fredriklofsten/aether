/* Aether – Profil, tema, startguide, hemskärmslayout */
/* ===================== PROFIL, TEMA, STARTGUIDE, HEMSKÄRM ===================== */
const ACCENTS={teal:['Turkos','#5eead4','#2dd4bf','#0d9488','#0f766e'],violet:['Lila','#c4b5fd','#a78bfa','#7c3aed','#6d28d9'],blue:['Blå','#93c5fd','#60a5fa','#2563eb','#1d4ed8'],rose:['Rosa','#fda4af','#fb7185','#e11d48','#be123c'],orange:['Orange','#fdba74','#fb923c','#ea580c','#c2410c'],lime:['Lime','#bef264','#a3e635','#65a30d','#4d7c0f'],gold:['Guld','#fcd34d','#fbbf24','#d97706','#b45309']};
function themeMode(){const t=(S.ui||{}).theme||'dark';return t==='auto'?(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t;}
function applyTheme(){
  const ui=S.ui||{},a=ACCENTS[ui.accent]||ACCENTS.teal,light=themeMode()==='light',r=document.documentElement;
  r.dataset.theme=light?'light':'dark';r.dataset.font=ui.font==='large'?'large':'normal';
  r.style.setProperty('--p',light?a[3]:a[1]);r.style.setProperty('--p2',light?a[4]:a[2]);r.style.setProperty('--onp',light?'#ffffff':'#06120f');
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=light?'#f3f5f9':'#080a0f';
  try{renderAvatar();}catch(e){}
}
function initials(){const n=(S.name||'').trim();if(!n)return'?';const p=n.split(/\s+/);return((p[0][0]||'')+(p.length>1?p[p.length-1][0]:'')).toUpperCase();}
function renderAvatar(){if(window.setBtn)setBtn.innerHTML=`<span class="av sm">${initials()}</span>`;}

/* ---------- bindningar för formulär ---------- */
let RR=()=>renderSheet();
function pget(path){return path.split('.').reduce((o,k)=>o==null?o:o[k],S);}
function pset(path,v,rr){
  const ks=path.split('.');let o=S;for(let i=0;i<ks.length-1;i++){if(o[ks[i]]==null||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
  o[ks[ks.length-1]]=v;onPset(path,v);save();if(rr)RR();else flashSaved();
}
function onPset(path,v){
  const today=todayStr();
  if(path==='bw'&&v){S.bwLog=(S.bwLog||[]).filter(x=>x.date!==today);S.bwLog.push({ts:Date.now(),date:today,v});}
  if(['waist','neck','hip','prof.chest','prof.arm','prof.thigh'].includes(path)){S.measLog=(S.measLog||[]);let e=S.measLog.find(x=>x.date===today);if(!e){e={date:today,ts:Date.now()};S.measLog.push(e);}e[path.replace('prof.','')]=v;S.measLog=S.measLog.slice(-60);}
  if(path.startsWith('ui.'))applyTheme();
  if(path==='name')renderAvatar();
  if(path==='freq'&&!S.plan){S.sIdx=0;S.sessionKey=rotation()[0].k;}
}
let _fs;function flashSaved(){const el=document.getElementById('savedFlag');if(!el)return;el.classList.add('on');clearTimeout(_fs);_fs=setTimeout(()=>el.classList.remove('on'),1100);}
const esc=v=>String(v==null?'':v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const F={
  num:(l,p,o={})=>`<div class="fld"><label class="f">${l}</label><div class="inunit"><input type="number" inputmode="decimal" step="${o.step||1}" ${o.min!=null?`min="${o.min}"`:''} ${o.max!=null?`max="${o.max}"`:''} placeholder="${o.ph||''}" value="${pget(p)??''}" onchange="pset('${p}',this.value===''?null:+this.value${o.rr?',true':''})"/>${o.unit?`<span>${o.unit}</span>`:''}</div>${o.help?`<p class="fh">${o.help}</p>`:''}</div>`,
  text:(l,p,o={})=>`<div class="fld"><label class="f">${l}</label>${o.area?`<textarea rows="3" placeholder="${o.ph||''}" onchange="pset('${p}',this.value)">${esc(pget(p))}</textarea>`:`<input type="${o.type||'text'}" placeholder="${o.ph||''}" value="${esc(pget(p))}" onchange="pset('${p}',this.value)"/>`}${o.help?`<p class="fh">${o.help}</p>`:''}</div>`,
  chips:(l,p,opts,o={})=>{const cur=pget(p);return `<div class="fld"><label class="f">${l}</label><div class="chips">${opts.map(([v,t])=>{const on=o.multi?(cur||[]).includes(v):cur===v;return `<div class="chip ${on?'on':''}" onclick='${o.multi?`ptoggle("${p}",${JSON.stringify(v)})`:`pset("${p}",${JSON.stringify(v)},true)`}'>${t}</div>`;}).join('')}</div>${o.help?`<p class="fh">${o.help}</p>`:''}</div>`;},
  cards:(l,p,opts)=>{const cur=pget(p);return `<div class="fld">${l?`<label class="f">${l}</label>`:''}<div class="fgrid g2">${opts.map(([v,t,i,sub])=>`<div class="fo ${cur===v?'on':''}" onclick='pset("${p}",${JSON.stringify(v)},true)'>${i?ic(i):''}<b>${t}</b>${sub?`<span>${sub}</span>`:''}</div>`).join('')}</div></div>`;}
};
function ptoggle(p,v){const a=(pget(p)||[]).slice();const i=a.indexOf(v);if(i>=0)a.splice(i,1);else{a.push(v);if(p==='prof.focus'&&a.length>3){a.shift();toast('Max tre fokusområden');}}pset(p,a,true);}
const SAVED='<div class="saved" id="savedFlag">'+'✓ Sparat'+'</div>';

/* ---------- fullständighet ---------- */
function profChecks(){const P=S.prof||{};return[
  ['Namn',!!S.name&&S.name!=='Demo','about'],['Kön, ålder & längd',!!(S.sex&&S.age&&S.height),'about'],['Vikt',!!S.bw,'body'],['Fettprocent eller midjemått',!!(S.bf||S.waist),'body'],
  ['Mål',!!S.goal,'goals'],['Målvikt',!!S.goalW,'goals'],['Ditt varför',!!(P.why&&P.why.trim()),'goals'],
  ['Erfarenhet',!!S.exp,'train'],['Utrustning & tid',!!(P.equip&&P.len),'train'],['Sömn',!!P.sleep,'health'],['Kosthållning',!!P.diet,'diet']];}
function profPct(){const c=profChecks();return Math.round(c.filter(x=>x[1]).length/c.length*100);}

/* ---------- profilhubb ---------- */
const PROF_ORDER=['about','body','goals','train','health','diet'];
const PROF_META={about:['user','Om mig'],body:['scale','Kropp & mått'],goals:['target','Mål & motivation'],train:['dumbbell','Träning'],health:['moon','Hälsa & återhämtning'],diet:['food','Kost']};
function profSummary(k){
  const P=S.prof||{},j=a=>a.filter(Boolean).join(' · ')||'<span class="muted">Inte ifyllt än</span>';
  const EXP={beginner:'Under 1 år',intermediate:'1–3 år',advanced:'Över 3 år'},EQ={gym:'Gym',db:'Hantlar',bw:'Kroppsvikt'},DIET={omni:'Allätare',flex:'Flexitarian',pesc:'Pescetarian',veg:'Vegetarian',vegan:'Vegan'},ST={low:'låg stress',mid:'medelstress',high:'hög stress'};
  if(k==='about')return j([S.name&&S.name!=='Demo'?esc(S.name):'',S.sex==='f'?'Kvinna':S.sex==='m'?'Man':'',S.age?S.age+' år':'',S.height?S.height+' cm':'']);
  if(k==='body'){const bc=bodyComp();return j([S.bw?S.bw+' kg':'',bc.bf!=null?'fett '+bc.bf+' %':'',S.waist?'midja '+S.waist+' cm':'']);}
  if(k==='goals')return j([GOAL_LBL[S.goal]||'',S.goalW?'målvikt '+S.goalW+' kg':'',P.deadline?'till '+new Date(P.deadline).toLocaleDateString('sv-SE',{day:'numeric',month:'short'}):'']);
  if(k==='train')return j([EXP[S.exp]||'',S.freq?S.freq+' dagar/v':'',P.len?P.len+' min':'',EQ[P.equip]||'',(P.focus||[]).length?'fokus: '+P.focus.map(f=>FOCUS_LBL[f]).join(', '):'']);
  if(k==='health')return j([P.sleep?'sömn '+(P.sleep>=9?'9+':P.sleep)+' h':'',ST[P.stress]||'',(S.limits||[]).length?'känsligt: '+S.limits.join(', '):'']);
  if(k==='diet')return j([DIET[P.diet]||'',P.meals?P.meals+' mål/dag':'',(P.allergies||[]).length?(P.allergies.length+' allergi'+(P.allergies.length>1?'er':'')):'']);
  return '';
}
/* Botten på varje profilsida: steg, föregående/nästa och Klar */
function profFooter(k){
  const i=PROF_ORDER.indexOf(k);if(i<0)return `<button class="btn p full pdone" onclick="goBack()">${ic('check')}<span>Klar</span></button>`;
  const prev=PROF_ORDER[i-1],next=PROF_ORDER[i+1];
  return `<div class="pfoot"><div class="pdots">${PROF_ORDER.map((x,n)=>`<i class="${n===i?'on':''}" onclick="profGo('${x}')"></i>`).join('')}</div>
    <div class="row" style="gap:8px">${prev?`<button class="btn o" style="flex:1" onclick="profGo('${prev}')">← ${PROF_META[prev][1]}</button>`:''}${next?`<button class="btn o" style="flex:1" onclick="profGo('${next}')">${PROF_META[next][1]} →</button>`:''}</div>
    <button class="btn p full pdone" onclick="goBack()">${ic('check')}<span>Klar – tillbaka till profilen</span></button><p class="muted" style="text-align:center;font-size:11.5px;margin-top:8px">Allt sparas automatiskt när du ändrar något.</p></div>`;
}
function profSheet(k){return()=>{const r=PROF_SHEETS[k]();const i=PROF_ORDER.indexOf(k);return{...r,s:(i>=0?'Steg '+(i+1)+' av '+PROF_ORDER.length+' · ':'')+(r.s||''),h:r.h+profFooter(k)};};}
function profGo(k){RR=()=>renderSheet();if(curTab==='sheet'&&SH.length){SH[SH.length-1]=profSheet(k);renderSheet();window.scrollTo(0,0);}else openProf(k);}
const GOAL_LBL={fat_loss:'Gå ner i fett',hypertrophy:'Bygga muskler',recomp:'Båda samtidigt',strength:'Bli starkare',maintain:'Behålla',endurance:'Bättre kondition'};
function renderProfileHub(){
  const P=S.prof||{},pct=profPct(),miss=profChecks().filter(x=>!x[1]),bc=bodyComp();
  const r=22,c=2*Math.PI*r;
  profHub.innerHTML=`<div class="card phead">
    <div class="row" style="gap:14px"><div class="av lg">${initials()}</div><div style="flex:1;min-width:0"><div class="pn">${esc(S.name||'Din profil')}</div><div class="muted">${GOAL_LBL[S.goal]||'Inget mål valt'}${S.goalW?` · ${S.bw} → ${S.goalW} kg`:''}</div>${(P.focus||[]).length?`<div class="pfocus">${P.focus.slice(0,3).map(f=>`<span>${FOCUS_LBL[f]||f}</span>`).join('')}</div>`:''}</div>
    <div class="pring"><svg viewBox="0 0 52 52" width="52" height="52"><circle cx="26" cy="26" r="${r}" fill="none" stroke="var(--sf3)" stroke-width="5"/><circle cx="26" cy="26" r="${r}" fill="none" stroke="var(--p)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct/100)}" transform="rotate(-90 26 26)"/></svg><b>${pct}%</b></div></div>
    <div class="pstats" style="margin-bottom:0">${[['Vikt',S.bw?S.bw+' kg':'—'],['Längd',S.height?S.height+' cm':'—'],['Ålder',S.age||'—'],['Fett',bc.bf!=null?bc.bf+' %':'—']].map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
    ${miss.length?`<div class="pmiss" onclick="openProf('${miss[0][2]}')">${ic('info')}<span>Fyll i <b>${miss[0][0].toLowerCase()}</b>${miss.length>1?` och ${miss.length-1} till`:''} för mer personliga råd</span>${ic('chev')}</div>`:`<div class="pmiss done">${ic('check')}<span>Profilen är komplett – råden är anpassade efter dig</span></div>`}
  </div>
  <div class="kt">Din profil <span class="kt-h">tryck på en rad för att ändra</span></div>
  <div class="mlist psec">${PROF_ORDER.map((k,n)=>{const [ic_,t_]=PROF_META[k],sum=profSummary(k),ok=profChecks().filter(x=>x[2]===k).every(x=>x[1]);
    return `<div class="mi" onclick="openProf('${k}')"><span class="mic">${ic(ic_)}</span><div style="min-width:0;flex:1"><b>${t_}</b><div class="psum">${sum}</div></div><span class="pst ${ok?'ok':'todo'}">${ok?ic('check'):'Fyll i'}</span></div>`;}).join('')}</div>
  <div class="kt" style="margin-top:16px">Anpassa appen</div>
  <div class="mlist">${[['look','compass','Utseende','Ljust/mörkt tema, färg, textstorlek'],['home','home','Hemskärm','Välj och sortera korten']].map(([k,i,t,d])=>`<div class="mi" onclick="openProf('${k}')"><span class="mic">${ic(i)}</span><div><b>${t}</b><div class="muted">${d}</div></div><span class="chev">${ic('chev')}</span></div>`).join('')}</div>
  <div class="kt" style="margin-top:16px">Hjälp & data</div>
  <div class="mlist">${[['m-guide','compass','Så funkar appen'],['m-ord','chat','Ordlista'],['m-src','flask','Evidens & källor'],['m-data','database','Data & backup']].map(([k,i,t])=>`<div class="mi" onclick="tab('${k}')"><span class="mic">${ic(i)}</span><div><b>${t}</b></div><span class="chev">${ic('chev')}</span></div>`).join('')}</div>
  <p class="muted" style="text-align:center;margin-top:14px;font-size:11px">Aether v9 · All data sparas bara på din enhet · Ersätter inte råd från vården</p>`;
}
function openProf(k){RR=()=>renderSheet();openSheet(profSheet(k));}
const PROF_SHEETS={
 about:()=>({t:'Om mig',s:'Grunduppgifter',h:SAVED+F.text('Namn','name',{ph:'Ditt namn'})+F.chips('Kön','sex',[['m','Man'],['f','Kvinna']],{help:'Används i formler för energibehov och fettprocent.'})+`<div class="g3">${F.num('Ålder','age',{unit:'år',min:13,max:99})}${F.num('Längd','height',{unit:'cm',min:120,max:230})}${F.num('Vikt','bw',{unit:'kg',step:.1,rr:true})}</div>`}),
 body:()=>{const bc=bodyComp(),ml=(S.measLog||[]).slice(-4).reverse();return{t:'Kropp & mått',s:'Uppdateras i dina beräkningar direkt',h:SAVED+
   `<div class="g2c">${F.num('Vikt idag','bw',{unit:'kg',step:.1,rr:true})}${F.num('Målvikt','goalW',{unit:'kg',step:.5,rr:true})}</div>`+
   F.chips('Fettprocent','bfMode',[['none','Vet inte'],['tape','Mät med måttband'],['known','Jag vet min %']])+
   (S.bfMode==='known'?F.num('Fettprocent','bf',{unit:'%',step:.5,rr:true,help:'Från DEXA, InBody eller kaliper.'}):'')+
   `<div class="kt" style="margin-top:14px">Kroppsmått</div><div class="g3">${F.num('Midja','waist',{unit:'cm',step:.5,rr:true})}${F.num('Hals','neck',{unit:'cm',step:.5,rr:true})}${S.sex==='f'?F.num('Höft','hip',{unit:'cm',step:.5,rr:true}):''}</div>
    <div class="g3">${F.num('Bröst','prof.chest',{unit:'cm',step:.5})}${F.num('Överarm','prof.arm',{unit:'cm',step:.5})}${F.num('Lår','prof.thigh',{unit:'cm',step:.5})}</div>
    <p class="fh">Mät på morgonen, avslappnad. Midja ${S.sex==='f'?'vid smalaste stället':'i höjd med naveln'}, hals under struphuvudet.</p>`+
   `<div class="card" style="margin-top:12px"><div class="row" style="gap:6px">${[['Fett',bc.bf!=null?bc.bf+' %':'—'],['Fettfri massa',bc.ffm?bc.ffm+' kg':'—'],['BMI',bc.bmi]].map(([l,v])=>`<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>${bc.src==='tape'?`<p class="fh" style="margin-top:8px">Fettprocent uppskattad med måttband (US Navy-metoden), felmarginal ca ±3–4 procentenheter. ${srcTag(['navy'])}</p>`:''}</div>`+
   (ml.length?`<div class="kt" style="margin-top:12px">Senaste mätningar</div><div class="card">${ml.map(e=>`<div class="plan-row"><span class="muted">${e.date}</span><span>${['waist','neck','hip','chest','arm','thigh'].filter(k=>e[k]).map(k=>({waist:'midja',neck:'hals',hip:'höft',chest:'bröst',arm:'arm',thigh:'lår'})[k]+' '+e[k]).join(' · ')}</span></div>`).join('')}</div>`:'')};},
 goals:()=>{const P=S.prof||{};let pace='';
   if(S.goalW&&P.deadline){const wk=Math.max(1,(new Date(P.deadline)-Date.now())/(7*864e5)),need=(S.goalW-S.bw)/wk,pct=need/S.bw*100;
     if(need<0){const a=Math.abs(pct);pace=`<div class="coach ${a>1?'warnbox':''}" style="margin-top:8px">Det kräver ca <b>${Math.abs(need).toFixed(2).replace('.',',')} kg/vecka</b> (${a.toFixed(1).replace('.',',')} % av kroppsvikten) i ${Math.round(wk)} veckor. ${a>1?'Det är snabbare än rekommenderat (0,5–1 %/vecka) och ökar risken att tappa muskler – överväg ett senare datum.':a<0.5?'Lugnt tempo – bra för att behålla muskler.':'Inom rekommenderat tempo (0,5–1 %/vecka).'} ${srcTag(['helms_prep','garthe'])}</div>`;}
     else if(need>0){pace=`<div class="coach" style="margin-top:8px">Det kräver ca <b>${need.toFixed(2).replace('.',',')} kg/vecka</b> (${(pct*4.3).toFixed(1).replace('.',',')} % per månad). Rimlig ökning beror på erfarenhet: ca 1–1,5 %/mån för nybörjare, 0,25–0,5 %/mån för vana. ${srcTag(['iraki'])}</div>`;}}
   return{t:'Mål & motivation',s:'Styr kost, program och tips',h:SAVED+
   F.cards('Vad vill du främst uppnå?','goal',[['fat_loss','Gå ner i fett','flame'],['hypertrophy','Bygga muskler','dumbbell'],['recomp','Båda samtidigt','refresh'],['strength','Bli starkare','zap'],['maintain','Behålla & må bra','target']])+
   F.chips('Takt','rate',[['slow','Lugn'],['std','Rekommenderad'],['fast','Snabb']])+
   `<div class="g2c">${F.num('Målvikt','goalW',{unit:'kg',step:.5,rr:true})}${F.text('Måldatum (valfritt)','prof.deadline',{type:'date'})}</div>`+pace+
   F.text('Ditt varför','prof.why',{area:true,ph:'T.ex. orka leka med barnen, känna mig stark på jobbet, springa Göteborgsvarvet…',help:'Visas på hemskärmen som påminnelse när motivationen tryter.'})+
   F.chips('Säsong just nu','season',[['normal','Normal'],['cut','Deff'],['bulk','Bulk'],['vacation','Semester'],['competition','Tävling']])};},
 train:()=>({t:'Träning',s:'Används när ditt program byggs',h:SAVED+
   F.chips('Erfarenhet av styrketräning','exp',[['beginner','Under 1 år'],['intermediate','1–3 år'],['advanced','Över 3 år']])+
   F.chips('Träningsdagar per vecka','freq',[2,3,4,5,6,7].map(n=>[n,String(n)]))+
   F.chips('Tid per pass','prof.len',[[30,'30 min'],[45,'45 min'],[60,'60 min'],[75,'75 min'],[90,'90 min']])+
   F.chips('Utrustning','prof.equip',[['gym','Gym'],['db','Hantlar hemma'],['bw','Bara kroppsvikt']])+
   F.chips('Vad vill du träna mest?','prof.focus',Object.entries(FOCUS_LBL),{multi:true,help:'Välj upp till tre. De får en extra övning och fler set i programmet. Skapa sedan ett nytt program med knappen längst ner.'})+
   F.chips('Vad gillar du att träna?','prof.likes',[['styrka','Styrka'],['löpning','Löpning'],['cykel','Cykel'],['simning','Simning'],['rodd','Rodd'],['promenad','Promenader'],['rörlighet','Yoga/rörlighet'],['grupp','Gruppträning'],['lagsport','Lagsport']],{multi:true})+
   `<button class="btn p full" onclick="openGenFromProfile()">${ic('target')}<span>Skapa program från min profil</span></button>`}),
 health:()=>({t:'Hälsa & återhämtning',s:'Anpassar passen och råden',h:SAVED+
   F.chips('Begränsningar / känsliga områden','limits',[['axel','Axel'],['knä','Knä'],['ländrygg','Ländrygg'],['armbåge','Armbåge']],{multi:true,help:'Övningar som brukar belasta området byts ut automatiskt.'})+
   F.chips('Sömn en vanlig natt','prof.sleep',[[5,'≤5 h'],[6,'6 h'],[7,'7 h'],[8,'8 h'],[9,'9+ h']])+
   F.chips('Stressnivå i vardagen','prof.stress',[['low','Låg'],['mid','Medel'],['high','Hög']])+
   F.chips('Aktivitet utanför träningen','act',[[1.4,'Stillasittande'],[1.55,'Måttligt aktiv'],[1.7,'Fysiskt jobb']],{help:'Påverkar ditt beräknade energibehov.'})+
   `<p class="fh" style="margin-top:10px">${ic('info')} Har du en skada eller sjukdom – rådgör med vården innan du ändrar träning eller kost.</p>`}),
 diet:()=>({t:'Kost',s:'Påverkar måltidsförslag och inköpslista',h:SAVED+
   F.chips('Kosthållning','prof.diet',[['omni','Allätare'],['flex','Flexitarian'],['pesc','Pescetarian'],['veg','Vegetarian'],['vegan','Vegan']])+
   (()=>{const no=(S.prof.noProt||[]),blk=DIET_BLOCK[S.prof.diet]||[];return `<div class="fld"><label class="f">Proteinkällor jag äter</label><div class="chips">${PGROUPS.filter(([g])=>!blk.includes(g)).map(([g,l])=>`<div class="chip ${no.includes(g)?'':'on'}" onclick="ptoggle('prof.noProt','${g}')">${l}</div>`).join('')}</div><p class="fh">Avmarkera det du inte äter – det försvinner ur förslag och inköpslista.</p></div>`;})()+
   F.chips('Föredrar helst','prof.favProt',[[null,'Blandat'],['kyckling','Kyckling'],['kött','Kött'],['fisk','Fisk'],['växt','Vegetariskt']])+
   F.chips('Allergier & intoleranser','prof.allergies',ALLERGENS,{multi:true,help:'Måltider och baser med allergenet tas bort eller byts mot ett alternativ (t.ex. glutenfri pasta).'})+
   F.text('Annan allergi eller sådant du undviker','prof.allergyOther',{ph:'T.ex. selleri, senap, kiwi'})+
   `<p class="fh">${ic('alert')} Vid svår allergi: följ råd från vården eller dietist och läs alltid innehållsförteckningen.</p>`+
   F.chips('Måltider per dag','prof.meals',[[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']],{help:'Används för att fördela proteinet. 3–4 mål är bra för muskeluppbyggnad.'})+
   `<button class="btn o full" onclick="SH=[];goSub('kost','fasta')">Ställ in fasta</button><button class="btn o full" onclick="SH=[];goSub('kost','kropp')">Se din kostplan</button>`}),
 look:()=>({t:'Utseende',s:'Gör appen till din',h:SAVED+
   F.cards('Tema','ui.theme',[['dark','Mörkt','moon'],['light','Ljust','sun'],['auto','Följ telefonen','refresh']])+
   `<div class="fld"><label class="f">Färg</label><div class="swatches">${Object.entries(ACCENTS).map(([k,a])=>`<button class="sw ${(S.ui.accent||'teal')===k?'on':''}" style="--c:${a[2]}" onclick="pset('ui.accent','${k}',true)"><i></i><span>${a[0]}</span></button>`).join('')}</div></div>`+
   F.chips('Textstorlek','ui.font',[['normal','Normal'],['large','Större']])}),
 home:()=>{const H=S.ui.home;return{t:'Hemskärm',s:'Välj vad som visas och i vilken ordning',h:
   `<div class="mlist">${H.order.map((k,i)=>`<div class="mi hrow"><span class="mic">${ic(HOME_SEC[k][1])}</span><div><b>${HOME_SEC[k][0]}</b><div class="muted">${HOME_SEC[k][2]}</div></div>
     <div class="row" style="gap:4px"><button class="btn o sm" onclick="homeMove(${i},-1)" ${i===0?'disabled':''}>↑</button><button class="btn o sm" onclick="homeMove(${i},1)" ${i===H.order.length-1?'disabled':''}>↓</button>
     <button class="tgl ${H.hidden.includes(k)?'':'on'}" onclick="homeToggle('${k}')" aria-label="Visa"><i></i></button></div></div>`).join('')}</div>
   <button class="btn o full" onclick="S.ui.home=defaultHome();save();RR();applyHomeLayout()">Återställ standard</button>`};}
};
/* ---------- hemskärmens kort ---------- */
const HOME_SEC={week:['Veckoremsa','calendar','Veckans dagar och klara pass'],checkin:['Dagsform','zap','Snabb incheckning varje dag'],hero:['Dagens pass','dumbbell','Passkort med startknapp'],why:['Mål & varför','target','Din motivation och målvikt'],tiles:['Snabbrutor','list','Kost, fasta, vikt och svit'],tip:['Dagens fakta','book','Ny kunskap varje dag'],adjust:['Justera & förklaring','info','Anpassa passet och se varför']};
function defaultHome(){return{order:['week','checkin','hero','why','tiles','tip','adjust'],hidden:[]};}
function homeMove(i,d){const o=S.ui.home.order,j=i+d;if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];save();RR();applyHomeLayout();}
function homeToggle(k){const h=S.ui.home.hidden,i=h.indexOf(k);if(i>=0)h.splice(i,1);else{if(k==='hero'&&!confirmHeroHide())return;h.push(k);}save();RR();applyHomeLayout();}
function confirmHeroHide(){toast('Dagens pass döljs – starta pass via Träna');return true;}
function applyHomeLayout(){
  const pad=document.querySelector('#t-today .pad');if(!pad)return;const H=S.ui.home;
  H.order.forEach(k=>{const el=pad.querySelector(`[data-hs="${k}"]`);if(el){pad.appendChild(el);el.style.display=H.hidden.includes(k)?'none':'';}});
}
function renderWhy(){
  const el=document.getElementById('whyCard');if(!el)return;const P=S.prof||{};
  const start=(S.bwLog&&S.bwLog.length)?S.bwLog[0].v:S.bw;
  let prog='';
  if(S.goalW&&start&&start!==S.goalW){const tot=S.goalW-start,done=S.bw-start,pct=Math.max(0,Math.min(100,done/tot*100));
    prog=`<div class="row between" style="font-size:12px;margin-top:10px"><span class="muted">Start ${start} kg</span><b>${S.bw} kg</b><span class="muted">Mål ${S.goalW} kg</span></div><div class="bar" style="margin-top:6px"><div class="fill" style="width:${pct}%;background:linear-gradient(90deg,var(--p2),var(--p))"></div></div>
      <div class="muted" style="font-size:11.5px;margin-top:6px">${Math.round(pct)} % av vägen${P.deadline?` · ${Math.max(0,Math.ceil((new Date(P.deadline)-Date.now())/864e5))} dagar kvar till ${P.deadline}`:''}</div>`;}
  if(!P.why&&!S.goalW){el.innerHTML=`<div class="row" style="gap:12px;cursor:pointer" onclick="openProf('goals')"><div class="aic">${ic('target')}</div><div style="flex:1"><b style="font-size:14px">Sätt ditt mål och ditt varför</b><div class="muted" style="font-size:12px">Ger tydligare riktning och bättre råd</div></div>${ic('chev')}</div>`;return;}
  el.innerHTML=`<div class="row between"><div class="kt" style="margin:0">${ic('target')} ${GOAL_LBL[S.goal]||'Mitt mål'}</div><button class="btn o sm" onclick="openProf('goals')">Ändra</button></div>${P.why?`<div class="whyq">”${esc(P.why)}”</div>`:''}${prog}`;
}
/* ---------- startguide ---------- */
let OBS=0;const OB_N=6;
function renderOB(){
  RR=renderOB;const P=S.prof;
  const steps=[
   ()=>`<div class="obhero"><div class="av xl">${initials()}</div><h1>Välkommen till Aether</h1><p>Din personliga coach för träning, kost och fasta – byggd på forskning. Det tar ca 2 minuter.</p></div>`+F.text('Vad heter du?','name',{ph:'Förnamn'})+
     `<div class="fld"><label class="f">Välj din färg</label><div class="swatches">${Object.entries(ACCENTS).map(([k,a])=>`<button class="sw ${(S.ui.accent||'teal')===k?'on':''}" style="--c:${a[2]}" onclick="pset('ui.accent','${k}',true)"><i></i><span>${a[0]}</span></button>`).join('')}</div></div>`+F.chips('Tema','ui.theme',[['dark','Mörkt'],['light','Ljust'],['auto','Som telefonen']]),
   ()=>`<h2 class="obt">Om dig</h2><p class="obp">Används för att räkna ut ditt energibehov.</p>`+F.chips('Kön','sex',[['m','Man'],['f','Kvinna']])+`<div class="g3">${F.num('Ålder','age',{unit:'år'})}${F.num('Längd','height',{unit:'cm'})}${F.num('Vikt','bw',{unit:'kg',step:.1})}</div>`+F.chips('Aktivitet utanför träningen','act',[[1.4,'Stillasittande'],[1.55,'Måttligt aktiv'],[1.7,'Fysiskt jobb']]),
   ()=>`<h2 class="obt">Ditt mål</h2><p class="obp">Vad vill du främst uppnå?</p>`+F.cards('','goal',[['fat_loss','Gå ner i fett','flame'],['hypertrophy','Bygga muskler','dumbbell'],['recomp','Båda samtidigt','refresh'],['strength','Bli starkare','zap'],['maintain','Behålla & må bra','target']])+`<div class="g2c">${F.num('Målvikt (valfritt)','goalW',{unit:'kg',step:.5})}${F.text('Måldatum (valfritt)','prof.deadline',{type:'date'})}</div>`+F.text('Ditt varför (valfritt)','prof.why',{area:true,ph:'Varför är det här viktigt för dig?'}),
   ()=>`<h2 class="obt">Träning</h2><p class="obp">Så bygger vi ett program som passar din vardag.</p>`+F.chips('Erfarenhet','exp',[['beginner','Under 1 år'],['intermediate','1–3 år'],['advanced','Över 3 år']])+F.chips('Dagar per vecka','freq',[2,3,4,5,6,7].map(n=>[n,String(n)]))+F.chips('Tid per pass','prof.len',[[30,'30 min'],[45,'45 min'],[60,'60 min'],[75,'75 min']])+F.chips('Utrustning','prof.equip',[['gym','Gym'],['db','Hantlar hemma'],['bw','Bara kroppsvikt']])+F.chips('Vad vill du träna mest? (valfritt, upp till 3)','prof.focus',Object.entries(FOCUS_LBL),{multi:true})+F.chips('Gillar du även…','prof.likes',[['löpning','Löpning'],['cykel','Cykel'],['simning','Simning'],['rodd','Rodd'],['promenad','Promenader']],{multi:true}),
   ()=>`<h2 class="obt">Hälsa & kost</h2><p class="obp">Så anpassar vi övningar och måltider.</p>`+F.chips('Känsliga områden','limits',[['axel','Axel'],['knä','Knä'],['ländrygg','Ländrygg'],['armbåge','Armbåge']],{multi:true})+F.chips('Sömn en vanlig natt','prof.sleep',[[5,'≤5 h'],[6,'6 h'],[7,'7 h'],[8,'8 h'],[9,'9+ h']])+F.chips('Kosthållning','prof.diet',[['omni','Allätare'],['flex','Flexitarian'],['pesc','Pescetarian'],['veg','Vegetarian'],['vegan','Vegan']])+F.chips('Allergier & intoleranser','prof.allergies',ALLERGENS,{multi:true}),
   ()=>{const G=genFromProfile();const Pg=buildProgram(G);return `<div class="obhero"><div class="av xl">${ic('check')}</div><h1>Klart, ${esc(S.name||'')}!</h1><p>Det här har vi byggt åt dig:</p></div>
     <div class="card"><div class="plan-row"><span class="muted">Program</span><b>${Pg.name}</b></div><div class="plan-row"><span class="muted">Pass i veckan</span><b>${Pg.weeks[0].days.reduce((a,l)=>a+l.length,0)}</b></div><div class="plan-row"><span class="muted">Energibehov</span><b>${energyPlan().tdee} kcal/dag</b></div><div class="plan-row"><span class="muted">Protein</span><b>${macros().protein} g/dag</b></div></div>
     <p class="fh">Allt kan ändras under din profil (cirkeln uppe till höger).</p>`;}
  ];
  obBox.innerHTML=`<div class="obbar"><div style="width:${(OBS+1)/OB_N*100}%"></div></div><div class="obstep">Steg ${OBS+1} av ${OB_N}</div>`+steps[OBS]()+
   `<div class="obnav">${OBS>0?`<button class="btn o" onclick="OBS--;renderOB();scrollTo(0,0)">Tillbaka</button>`:'<span></span>'}${OBS<OB_N-1?`<button class="btn p" onclick="OBS++;renderOB();scrollTo(0,0)">Nästa</button>`:`<button class="btn p" onclick="obFinish(true)">Skapa mitt program</button>`}</div>`;
}
function genFromProfile(){const P=S.prof||{},likes=P.likes||[];
  return{goal:{fat_loss:'fat_loss',hypertrophy:'hypertrophy',recomp:'hypertrophy',strength:'strength',maintain:'health'}[S.goal]||'hypertrophy',days:Math.min(7,Math.max(2,S.freq||4)),len:P.len||60,eq:P.equip||'gym',exp:S.exp||'beginner',dbl:false,focus:(P.focus||[]).slice(),
    mod:likes.includes('löpning')?'Löpning':likes.includes('cykel')?'Cykel':likes.includes('rodd')?'Rodd':likes.includes('simning')?'Simning':likes.includes('promenad')?'Promenad':'Valfri',weeks:8,light:'auto',prev:null};}
function openGenFromProfile(){openGen();}
function obFinish(withPlan){
  S.sIdx=0;if(S.bw&&!(S.bwLog||[]).length)S.bwLog=[{ts:Date.now(),date:todayStr(),v:S.bw}];
  if(withPlan!==false){const G=genFromProfile(),P=buildProgram(G);S.customT=Object.fromEntries(Object.entries(S.customT||{}).filter(([k])=>!k.startsWith('g_')));Object.assign(S.customT,P.T);S.plan={name:P.name,goal:P.goal,weeks:P.weeks,start:mondayOf(new Date()).toISOString()};S.planView=0;S.selSlot=0;}
  else{S.plan=null;}
  S.sessionKey=rotation()[0].k;S.onboarded=true;save();RR=()=>renderSheet();
  onboard.classList.remove('active');main.classList.add('active');tab('today');toast(withPlan!==false?'Ditt program är klart':'Välkommen');
}
/* ---------- kost efter kosthållning ---------- */
const DIET_EX={omni:[],flex:[],pesc:['m'],veg:['m','f'],vegan:['m','f','d','e']};
function dietOk(tags){const ex=DIET_EX[(S.prof||{}).diet]||[];return !(tags||[]).some(t=>ex.includes(t));}
