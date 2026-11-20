/* Aether – Måltider: välj protein + allergifilter */
/* ===================== MÅLTIDER: välj protein + allergifilter ===================== */
// Ungefärliga näringsvärden per portion (avrundade typvärden, jfr Livsmedelsverkets livsmedelsdatabas)
const PROT={
  kyckling:{n:'Kycklingfilé 150 g',g:'kyckling',k:165,p:34,c:0,f:3,a:[]},
  kalkon:{n:'Kalkonfilé 150 g',g:'kyckling',k:160,p:35,c:0,f:2,a:[]},
  notfars:{n:'Nötfärs 10 % 150 g',g:'kött',k:260,p:30,c:0,f:15,a:[]},
  flask:{n:'Fläskfilé 150 g',g:'kött',k:190,p:33,c:0,f:6,a:[]},
  lax:{n:'Lax 150 g',g:'fisk',k:300,p:30,c:0,f:20,a:['fisk']},
  torsk:{n:'Torsk 150 g',g:'fisk',k:120,p:27,c:0,f:1,a:['fisk']},
  tonfisk:{n:'Tonfisk i vatten 1 burk',g:'fisk',k:110,p:25,c:0,f:1,a:['fisk']},
  rakor:{n:'Räkor 150 g',g:'skaldjur',k:130,p:28,c:0,f:2,a:['skaldjur']},
  agg:{n:'3 ägg',g:'ägg',k:210,p:18,c:1,f:15,a:['ägg']},
  kvarg:{n:'Kvarg 250 g',g:'mejeri',k:160,p:30,c:10,f:1,a:['mjölk','laktos']},
  keso:{n:'Keso 200 g',g:'mejeri',k:160,p:26,c:6,f:4,a:['mjölk','laktos']},
  laktosfrikvarg:{n:'Laktosfri kvarg 250 g',g:'mejeri',k:160,p:30,c:10,f:1,a:['mjölk']},
  whey:{n:'Whey 30 g',g:'mejeri',k:120,p:24,c:2,f:2,a:['mjölk','laktos']},
  artprotein:{n:'Ärtproteinpulver 30 g',g:'växt',k:115,p:24,c:1,f:2,a:[]},
  tofu:{n:'Tofu 200 g',g:'växt',k:240,p:26,c:4,f:14,a:['soja']},
  tempeh:{n:'Tempeh 150 g',g:'växt',k:290,p:30,c:14,f:16,a:['soja']},
  bonor:{n:'Bönor/linser 250 g (kokta)',g:'växt',k:280,p:20,c:45,f:1,a:[]},
  sojayog:{n:'Sojayoghurt 250 g',g:'växt',k:130,p:9,c:6,f:6,a:['soja']}
};
const BASES={
  ris:{n:'ris + broccoli',k:260,p:6,c:55,f:1,a:[]},
  potatis:{n:'potatis + sallad',k:220,p:5,c:45,f:3,a:[]},
  pasta:{n:'pasta + tomatsås',k:330,p:11,c:64,f:3,a:['gluten'],gf:'glutenfri pasta + tomatsås'},
  quinoa:{n:'quinoa + spenat',k:250,p:9,c:42,f:4,a:[]},
  bulgur:{n:'bulgur + ugnsrotsaker',k:290,p:9,c:58,f:2,a:['gluten'],gf:'hirs + ugnsrotsaker'},
  wok:{n:'nudlar + wokgrönsaker',k:300,p:9,c:55,f:5,a:['gluten','soja'],gf:'risnudlar + wokgrönsaker (glutenfri soja)'},
  havre:{n:'havregryn + bär',k:230,p:7,c:38,f:4,a:['gluten'],gf:'glutenfri havre + bär'},
  frukt:{n:'banan + bär',k:150,p:2,c:35,f:1,a:[]},
  notter:{n:'frukt + nötter',k:260,p:6,c:22,f:16,a:['nötter'],alt:'frukt + pumpafrön'},
  sallad:{n:'stor sallad + bröd',k:250,p:8,c:35,f:8,a:['gluten'],gf:'stor sallad + glutenfritt bröd'}
};
const MEAL_T=[
  {id:'f1',when:'Frukost',base:'havre',opts:['kvarg','laktosfrikvarg','sojayog','agg','whey','artprotein']},
  {id:'f2',when:'Frukost',base:'frukt',opts:['agg','keso','kvarg','tofu','sojayog']},
  {id:'l1',when:'Lunch',base:'ris',opts:['kyckling','notfars','lax','tofu','rakor','bonor']},
  {id:'l2',when:'Lunch',base:'sallad',opts:['kyckling','tonfisk','agg','bonor','rakor','tofu']},
  {id:'m1',when:'Middag',base:'potatis',opts:['lax','flask','kyckling','torsk','bonor','tofu']},
  {id:'m2',when:'Middag',base:'pasta',opts:['notfars','kalkon','rakor','bonor','tofu','kyckling']},
  {id:'m3',when:'Middag',base:'wok',opts:['kyckling','rakor','flask','tempeh','tofu']},
  {id:'m4',when:'Middag',base:'bulgur',opts:['torsk','kyckling','notfars','bonor','tempeh']},
  {id:'s1',when:'Mellanmål',base:'notter',opts:['kvarg','laktosfrikvarg','keso','sojayog','artprotein']},
  {id:'p1',when:'Runt passet',base:'frukt',opts:['whey','artprotein','kvarg','sojayog']}
];
const ALLERGENS=[['mjölk','Mjölkprotein'],['laktos','Laktos'],['ägg','Ägg'],['fisk','Fisk'],['skaldjur','Skaldjur'],['nötter','Nötter'],['jordnötter','Jordnötter'],['gluten','Gluten'],['soja','Soja'],['sesam','Sesam']];
const PGROUPS=[['kyckling','Kyckling/kalkon'],['kött','Kött'],['fisk','Fisk'],['skaldjur','Skaldjur'],['ägg','Ägg'],['mejeri','Mejeri'],['växt','Vegetariskt (baljväxter, soja)']];
const DIET_BLOCK={omni:[],flex:[],pesc:['kyckling','kött'],veg:['kyckling','kött','fisk','skaldjur'],vegan:['kyckling','kött','fisk','skaldjur','ägg','mejeri']};
function allergies(){return(S.prof||{}).allergies||[];}
function protOk(id){const P=PROT[id],pr=S.prof||{};if(!P)return false;
  if((DIET_BLOCK[pr.diet]||[]).includes(P.g))return false;
  if((pr.noProt||[]).includes(P.g))return false;
  return !P.a.some(x=>allergies().includes(x));}
function baseFor(id){const b=BASES[id],al=allergies();let n=b.n,a=b.a;
  if(a.includes('gluten')&&al.includes('gluten')){if(!b.gf)return null;n=b.gf;a=a.filter(x=>x!=='gluten');if(id==='wok')a=a.filter(x=>x!=='soja'||!al.includes('soja'));}
  if(a.includes('nötter')&&(al.includes('nötter')||al.includes('jordnötter'))){if(!b.alt)return null;n=b.alt;a=a.filter(x=>x!=='nötter');}
  if(a.some(x=>al.includes(x)))return null;return{...b,n,a};}
function mealOptions(t){return t.opts.filter(protOk);}
function mealFilterOk(pid){const f=S.mealFilter||'alla';if(f==='alla')return true;const g=PROT[pid].g;return f==='veg'?(g==='växt'||g==='ägg'||g==='mejeri'):g===f;}
function buildMeal(t){
  const base=baseFor(t.base);if(!base)return null;
  let opts=mealOptions(t);if(!opts.length)return null;
  const f=S.mealFilter||'alla';if(f!=='alla'){const fo=opts.filter(mealFilterOk);if(!fo.length)return null;opts=fo;}
  const fav=(S.prof||{}).favProt;
  let pid=(S.mealPick||{})[t.id];if(!opts.includes(pid))pid=(fav&&opts.find(o=>PROT[o].g===fav))||opts[0];
  const P=PROT[pid];
  return{id:t.id,when:t.when,pid,opts,d:(x=>x.charAt(0).toUpperCase()+x.slice(1))(P.n.replace(/ \d.*$/,'').replace(/^\d+ /,''))+' + '+base.n,portion:P.n,k:P.k+base.k,p:P.p+base.p,c:P.c+base.c,f:P.f+base.f};
}
const SLOTS=['Frukost','Lunch','Middag','Mellanmål','Runt passet'];
function daySlots(){const n=Math.max(2,Math.min(6,(S.prof||{}).meals||4));if(n===2)return['Lunch','Middag'];return SLOTS.slice(0,Math.min(5,n));}
function slotMeals(when){return MEAL_T.filter(t=>t.when===when).map(buildMeal).filter(Boolean);}
function slotPick(when){const l=slotMeals(when);if(!l.length)return null;const id=(S.mealAlt||{})[when];return l.find(m=>m.id===id)||l[0];}
function nextDish(when){const l=slotMeals(when);if(l.length<2)return;const cur=slotPick(when),i=(l.findIndex(m=>m.id===cur.id)+1)%l.length;S.mealAlt=S.mealAlt||{};S.mealAlt[when]=l[i].id;save();renderKost();}
function dayMenu(){return daySlots().map(w=>({w,m:slotPick(w),n:slotMeals(w).length}));}
function swapMeal(id,dir){const t=MEAL_T.find(x=>x.id===id),m=buildMeal(t);if(!m||m.opts.length<2)return;const i=(m.opts.indexOf(m.pid)+(dir||1)+m.opts.length)%m.opts.length;S.mealPick=S.mealPick||{};S.mealPick[id]=m.opts[i];save();renderKost();}
function pickMealProt(id,pid){S.mealPick=S.mealPick||{};S.mealPick[id]=pid;save();renderKost();}
function logMeal(id){const m=buildMeal(MEAL_T.find(x=>x.id===id));if(!m)return;S.meals.push({d:m.d,k:m.k,p:m.p});S.loggedKcal+=m.k;save();renderKost();refresh();toast('+'+m.k+' kcal · '+m.p+' g protein');}
const GLYPH={kyckling:'🍗',kött:'🥩',fisk:'🐟',skaldjur:'🦐',ägg:'🥚',mejeri:'🥛',växt:'🌱'};
function renderMeals(){
  const fl=[['alla','Alla'],['kyckling','Kyckling'],['kött','Kött'],['fisk','Fisk'],['veg','Vegetariskt']].filter(([k])=>k==='alla'||(k==='veg'?true:!((DIET_BLOCK[(S.prof||{}).diet]||[]).includes(k)||((S.prof||{}).noProt||[]).includes(k))));
  mealFilt.innerHTML=fl.map(([k,l])=>`<div class="chip ${(S.mealFilter||'alla')===k?'on':''}" onclick="S.mealFilter='${k}';save();renderKost()">${l}</div>`).join('');
  const menu=dayMenu(),got=menu.filter(x=>x.m);
  const tk=got.reduce((t,x)=>t+x.m.k,0),tp=got.reduce((t,x)=>t+x.m.p,0),tgt=macros();
  mealEx.innerHTML=(got.length?`<div class="msum"><span>Dagens meny: <b>${tk} kcal</b> · <b>${tp} g protein</b></span><span class="muted">mål ${tgt.cal} kcal · ${tgt.protein} g</span>${tk<tgt.cal*0.85?`<span class="fh" style="width:100%;margin:2px 0 0">Ca ${Math.round((tgt.cal-tk)/10)*10} kcal kvar till målet – ta större portioner kolhydrater (ris, potatis, pasta, havre), lägg till ett mellanmål eller öka måltider per dag.</span>`:tk>tgt.cal*1.1?`<span class="fh" style="width:100%;margin:2px 0 0">Menyn ligger över målet – ta mindre portioner av kolhydrater och fett.</span>`:''}</div>`:'')+menu.map(({w,m,n})=>m?`<div class="meal">
    <div class="row between"><span class="mw">${w}</span><span class="muted" style="font-size:11.5px">${m.k} kcal · ${m.p} g protein</span></div>
    <div class="row between" style="gap:8px;align-items:flex-start"><div class="md">${m.d}</div>${n>1?`<button class="btn o sm" style="flex-shrink:0" onclick="nextDish('${w}')">${ic('refresh')} Byt rätt</button>`:''}</div>
    <div class="mprots">${m.opts.map(o=>`<button class="${o===m.pid?'on':''}" onclick="pickMealProt('${m.id}','${o}')" title="${PROT[o].n}">${(x=>x.charAt(0).toUpperCase()+x.slice(1))(PROT[o].n.replace(/ \d.*$/,'').replace(/^\d+ /,''))}</button>`).join('')}</div>
    <div class="row between" style="margin-top:8px"><span class="muted" style="font-size:11px">${m.portion}</span><button class="btn p sm" onclick="logMeal('${m.id}')">+ Logga</button></div></div>`
    :`<div class="meal"><span class="mw">${w}</span><div class="muted" style="font-size:12.5px;margin-top:4px">Inget förslag matchar dina val${(S.mealFilter||'alla')!=='alla'?' och filtret':''}.</div></div>`).join('')+
    `<p class="fh" style="margin-top:6px">${daySlots().length} måltider per dag – ändra under Profil → Kost.</p>`;
  const al=allergies(),oth=((S.prof||{}).allergyOther||'').trim();
  mealAllergy.innerHTML=(al.length||oth)?`<div class="allerg">${ic('alert')}<span>Filtrerat för: <b>${[...al.map(a=>(ALLERGENS.find(x=>x[0]===a)||[a,a])[1].toLowerCase()),oth].filter(Boolean).join(', ')}</b>. Läs alltid innehållsförteckningen – förslagen kan inte garantera att en produkt saknar spår av allergener.${oth?' Annan allergi filtreras inte automatiskt.':''}</span></div>`:'';
}
function shopItems(){
  const list=dayMenu().map(x=>x.m).filter(Boolean),out=new Map();
  list.forEach(m=>{const x=PROT[m.pid].n.replace(/ \d.*$/,'').replace(/^\d+ /,'');out.set(x.charAt(0).toUpperCase()+x.slice(1),1);});
  const al=allergies();
  Object.keys(BASES).forEach(k=>{const b=baseFor(k);if(b&&list.some(m=>MEAL_T.find(t=>t.id===m.id).base===k))b.n.split(' + ').forEach(x=>out.set(x.charAt(0).toUpperCase()+x.slice(1),1));});
  ['Olivolja','Frysta grönsaker','Kreatin monohydrat'].forEach(x=>out.set(x,1));
  return[...out.keys()];
}

function renderProf(){pName.value=S.name;pBw.value=S.bw;pGoal.value=S.goal;pWeek.value=S.week;
  pSex.value=S.sex||'m';pAge.value=S.age||30;pH.value=S.height||178;pAct.value=String(S.act||1.55);
  document.querySelectorAll('#pLim .chip').forEach(c=>c.classList.toggle('on',(S.limits||[]).includes(c.dataset.v)));
  const lines=limitSwapList();limNote.textContent=lines.length?'Aktiva byten: '+lines.join(' · '):'Inga automatiska byten.';}
function saveProf(){const oldF=S.freq;S.name=pName.value;S.bw=+pBw.value||82;S.goal=pGoal.value;S.week=Math.max(0,Math.min(11,+pWeek.value||0));
  S.sex=pSex.value;S.age=+pAge.value||30;S.height=+pH.value||178;S.act=+pAct.value||1.55;
  S.limits=[...document.querySelectorAll('#pLim .chip.on')].map(c=>c.dataset.v);
  if(oldF!==S.freq){S.sIdx=0;S.sessionKey=rotation()[0].k;}
  save();renderProf();toast('Sparat');refresh();}
function exportData(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='aether-export-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  toast('JSON exporterad');
}
