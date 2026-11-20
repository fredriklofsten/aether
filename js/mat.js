/* Aether – Matdagbok: sök i Livsmedelsverkets databas, skanna streckkod (Open Food Facts), logga per måltid */

ICONS.scan='<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M8 8v8M11 8v8M14 8v8M17 8v8"/>';
ICONS.plus='<path d="M12 5v14M5 12h14"/>';
ICONS.star='<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>';

const MEAL_TYPES=['Frukost','Lunch','Middag','Mellanmål'];
function mealTypeNow(){const h=new Date().getHours();return h<10?'Frukost':h<14?'Lunch':h<17?'Mellanmål':h<21?'Middag':'Mellanmål';}
const todayKey=()=>new Date().toLocaleDateString('sv-SE');
const r1=x=>Math.round(x*10)/10;

/* ---------- Tillstånd ---------- */
function matInit(){
  if(!S.foodHist||typeof S.foodHist!=='object')S.foodHist={};
  if(!Array.isArray(S.myFoods))S.myFoods=[];
  if(!Array.isArray(S.recentFoods))S.recentFoods=[];
}
function dayTotals(list){return list.reduce((s,x)=>({k:s.k+(x.k||0),p:s.p+(x.p||0),c:s.c+(x.c||0),f:s.f+(x.f||0)}),{k:0,p:0,c:0,f:0});}
/* Spara gårdagens summa i historiken innan dagen nollställs */
function matRollover(){
  matInit();const t=todayKey();
  if(S.mealDate&&S.mealDate!==t&&S.meals&&S.meals.length){const s=dayTotals(S.meals);S.foodHist[S.mealDate]={k:Math.round(s.k),p:Math.round(s.p),c:Math.round(s.c),f:Math.round(s.f),n:S.meals.length};}
  if(S.mealDate!==t){S.meals=[];S.loggedKcal=0;S.mealDate=t;save();}
  // håll historiken till ett år
  const keys=Object.keys(S.foodHist).sort();if(keys.length>366)keys.slice(0,keys.length-366).forEach(k=>delete S.foodHist[k]);
}
function logFood(e){
  matRollover();
  const x={d:e.d||'Måltid',k:Math.round(e.k||0),p:r1(e.p||0),c:r1(e.c||0),f:r1(e.f||0),mt:e.mt||mealTypeNow()};
  if(e.g)x.g=e.g;if(e.fid)x.fid=e.fid;
  S.meals.push(x);S.loggedKcal=Math.round(dayTotals(S.meals).k);
  S.foodHist[todayKey()]={...dayTotals(S.meals),n:S.meals.length};
  ['k','p','c','f'].forEach(k=>S.foodHist[todayKey()][k]=Math.round(S.foodHist[todayKey()][k]));
  if(e.fid){S.recentFoods=[e.fid,...S.recentFoods.filter(z=>z!==e.fid)].slice(0,12);}
  save();renderKost();refresh();toast('+'+x.k+' kcal · '+x.mt.toLowerCase());
}
function delMeal(i){S.meals.splice(i,1);S.loggedKcal=Math.round(dayTotals(S.meals).k);S.foodHist[todayKey()]={...dayTotals(S.meals),n:S.meals.length};save();renderKost();refresh();}
function moveMeal(i,mt){S.meals[i].mt=mt;save();renderKost();}

/* ---------- Livsmedelsdatabasen (laddas först när den behövs) ---------- */
let LV=null,lvLoading=null;
function loadLivsmedel(){
  if(LV)return Promise.resolve(LV);
  if(lvLoading)return lvLoading;
  lvLoading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='js/data/livsmedel.js';
    s.onload=()=>{LV=LIVSMEDEL.map(r=>({id:'slv'+r[6],n:r[0],k:r[1],p:r[2],f:r[3],c:r[4],fib:r[5],src:'Livsmedelsverket',lc:r[0].toLowerCase()}));res(LV);};
    s.onerror=()=>{lvLoading=null;rej();};document.head.appendChild(s);});
  return lvLoading;
}
function myFoodObj(m){return{id:m.id,n:m.n,k:m.k,p:m.p,f:m.f,c:m.c,fib:m.fib||0,src:m.src||'Egen',ean:m.ean,brand:m.brand,serv:m.serv,lc:(m.n+' '+(m.brand||'')).toLowerCase()};}
function foodById(id){
  const m=(S.myFoods||[]).find(x=>x.id===id);if(m)return myFoodObj(m);
  return LV?LV.find(x=>x.id===id):null;
}
/* vardagsord → Livsmedelsverkets benämning */
const FOOD_SYN={'nötfärs':'nöt färs','köttfärs':'nöt färs','blandfärs':'blandfärs','keso':'cottage','kesella':'kvarg','knäckebröd':'hårt bröd','knäcke':'hårt bröd','kycklingfilé':'kyckling bröstfilé','kycklingbröst':'kyckling bröstfilé','fläskfilé':'fläskfilé','räkor':'räka','ägg':'ägg','proteinpulver':'vassle','havre':'havregryn','gröt':'gröt','mellanmjölk':'mellanmjölk','lättmjölk':'lättmjölk','jasminris':'ris jasmin','basmatiris':'ris basmati'};
/* vanliga basvaror visas först */
const FOOD_POP=['kyckling bröstfilé rå u. skinn','kyckling bröstfilé färsk stekt u. skinn','ägg kokt','ägg rått','havregryn fullkorn','mjölk fett 3% berikad','mellanmjölk fett 1,5% berikad','lättmjölk fett 0,5% berikad','banan','äpple m. skal','ris jasmin kokt m. salt','ris basmati kokt m. salt','pasta kokt u. salt','pasta fullkorn okokt','potatis höst kokt m. salt','nöt färs rå fett 10%','nöt färs rå fett 15%','lax odlad norge fjordlax rå','kvarg naturell fett 0,2%','yoghurt naturell fett 3% berikad','färskost cottage cheese naturell fett 4%','broccoli','blåbär','avokado','olivolja','smör fett 80%','jordnötssmör','tonfisk i vatten konserv. avrunnen','torsk rå','gris fläskfilé rå','ost hårdost fett 17%','ost hårdost fett 28%','filmjölk fett 3% berikad','sötpotatis rå','linser torkade','tofu fast','kaffe bryggt'];
const FOOD_POP_SET=new Set(FOOD_POP);
const FOOD_LOW=/\b(mage|lever|hjärta|njure|tunga|talg|späck|ister|barnmat|barngröt|välling|restaurang|gatukök)\b/;
function foodMatch(q){
  const words=q.toLowerCase().split(/\s+/).filter(Boolean).map(w=>FOOD_SYN[w]||w).join(' ').split(' ');if(!words.length)return[];
  const pool=[...(S.myFoods||[]).map(myFoodObj),...(LV||[])];
  const rec=new Set(S.recentFoods||[]);
  const toks=x=>x._t||(x._t=x.lc.split(/[\s,.()%-]+/));
  const wordHit=(x,w)=>toks(x).some(tk=>tk.startsWith(w));
  let hits=pool.filter(x=>words.every(w=>wordHit(x,w)));
  if(hits.length<5)hits=[...new Set([...hits,...pool.filter(x=>words.every(w=>x.lc.includes(w)))])];
  return hits.map(x=>{
    let s=0;const tk=toks(x);
    if(x.lc.startsWith(words[0]))s-=40;if(tk[0]===words[0])s-=25;
    if(rec.has(x.id))s-=60;if(x.src!=='Livsmedelsverket')s-=30;if(FOOD_POP_SET.has(x.lc))s-=45;
    if(FOOD_LOW.test(x.lc))s+=40;if(/ m\. /.test(x.lc))s+=8;
    s+=x.n.length/5;return[s,x];
  }).sort((a,b)=>a[0]-b[0]).slice(0,30).map(z=>z[1]);
}
let fsTimer=null;
function foodSearch(){
  clearTimeout(fsTimer);
  fsTimer=setTimeout(()=>{
    const q=foodQ.value.trim();
    if(!q){renderFoodRecent();return;}
    if(!LV){foodRes.innerHTML='<div class="muted fsl">Laddar livsmedelsdatabasen…</div>';loadLivsmedel().then(foodSearch).catch(()=>{foodRes.innerHTML='<div class="muted fsl">Kunde inte ladda databasen.</div>';});return;}
    const list=foodMatch(q);
    foodRes.innerHTML=list.length?list.map(foodRow).join(''):`<div class="empty">Inget hittades för "${escH(q)}". <button class="btn o sm" onclick="openEgen(foodQ.value)">Lägg till som eget livsmedel</button></div>`;
  },120);
}
function escH(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function foodRow(x){
  const tag=x.src==='Livsmedelsverket'?'':`<span class="ftag">${x.ean?'Streckkod':'Egen'}</span>`;
  return `<div class="frow" onclick="openFood('${x.id}')"><div class="fn">${escH(x.n)}${x.brand?` <span class="muted">· ${escH(x.brand)}</span>`:''} ${tag}</div><div class="fm">${x.k} kcal · P ${x.p} · K ${x.c} · F ${x.f} <span class="muted">/100 g</span></div></div>`;
}
function renderFoodRecent(){
  const ids=(S.recentFoods||[]).slice(0,8);
  if(!ids.length){foodRes.innerHTML='';return;}
  const show=()=>{const l=ids.map(foodById).filter(Boolean);foodRes.innerHTML=l.length?'<div class="fsl muted">Senaste</div>'+l.map(foodRow).join(''):'';};
  if(ids.some(i=>i.startsWith('slv'))&&!LV){loadLivsmedel().then(show).catch(()=>{});}else show();
}

/* ---------- Mängd & måltid ---------- */
let curFood=null,curG=100,curMt=null;
function openFood(id){
  const x=foodById(id);if(!x)return;curFood=x;curG=x.serv||100;curMt=curMt||mealTypeNow();
  fmTitle.textContent=x.n;fmSrc.innerHTML=(x.brand?escH(x.brand)+' · ':'')+(x.src==='Livsmedelsverket'?'Livsmedelsverkets livsmedelsdatabas':x.src==='Open Food Facts'?'Open Food Facts (streckkod '+escH(x.ean||'')+')':'Eget livsmedel');
  fmG.value=curG;renderFoodModal();foodModal.classList.add('on');setTimeout(()=>fmG.select(),50);
}
function setG(g){curG=g;fmG.value=g;renderFoodModal();}
function renderFoodModal(){
  const x=curFood;if(!x)return;const g=+fmG.value||0;curG=g;const q=g/100;
  const presets=[...new Set([x.serv,50,100,150,200,300].filter(Boolean))].sort((a,b)=>a-b);
  fmChips.innerHTML=presets.map(v=>`<div class="chip ${v===g?'on':''}" onclick="setG(${v})">${v} g${v===x.serv?' · portion':''}</div>`).join('');
  fmMt.innerHTML=MEAL_TYPES.map(m=>`<div class="chip ${m===curMt?'on':''}" onclick="curMt='${m}';renderFoodModal()">${m}</div>`).join('');
  fmTot.innerHTML=`<div class="fmk"><b>${Math.round(x.k*q)}</b><span>kcal</span></div><div class="fmk"><b>${r1(x.p*q)}</b><span>protein</span></div><div class="fmk"><b>${r1(x.c*q)}</b><span>kolhydr.</span></div><div class="fmk"><b>${r1(x.f*q)}</b><span>fett</span></div>`;
}
function addFood(){
  const x=curFood;const g=+fmG.value||0;if(!x||!g){toast('Ange mängd');return;}const q=g/100;
  logFood({d:x.n+' · '+g+' g',k:x.k*q,p:x.p*q,c:x.c*q,f:x.f*q,g,fid:x.id,mt:curMt});
  closeFood();foodQ.value='';renderFoodRecent();
}
function closeFood(){foodModal.classList.remove('on');}

/* ---------- Egen mat / snabbinmatning ---------- */
function openEgen(name,ean){
  egModal.classList.add('on');egName.value=name||'';egEan.value=ean||'';['egK','egP','egC','egF','egServ'].forEach(i=>document.getElementById(i).value='');
  egHint.textContent=ean?'Produkten fanns inte i Open Food Facts. Skriv av näringsvärdena per 100 g från förpackningen – nästa gång du skannar den hittas den direkt.':'Skriv värden per 100 g. Livsmedlet sparas så att du hittar det i sökningen nästa gång.';
}
function saveEgen(){
  const n=egName.value.trim(),k=+egK.value;if(!n||!k){toast('Ange namn och kcal');return;}
  const m={id:'my'+Date.now().toString(36),n,k:Math.round(k),p:+egP.value||0,c:+egC.value||0,f:+egF.value||0,src:'Egen',ean:egEan.value||undefined,serv:+egServ.value||undefined};
  matInit();S.myFoods.unshift(m);save();egModal.classList.remove('on');openFood(m.id);
}
/* gamla snabbfältet (kcal + protein direkt) */
function addMeal(){const d=mealD.value||'Måltid',k=+mealK.value||0,p=+mealP.value||0;if(!k){toast('Ange kcal');return;}logFood({d,k,p});mealD.value='';mealK.value='';mealP.value='';}
function quickMeal(i){const x=MEALS[i];logFood({d:x.d,k:x.k,p:x.p,c:x.c,f:x.f,mt:cap(x.when)});}
function logMeal(id){const m=buildMeal(MEAL_T.find(x=>x.id===id));if(!m)return;logFood({d:m.d,k:m.k,p:m.p,c:m.c,f:m.f,mt:MEAL_TYPES.includes(cap(m.when))?cap(m.when):mealTypeNow()});}
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;

/* ---------- Streckkod ---------- */
let scanStream=null,scanLoop=null,zxReader=null;
async function openScan(){
  scanModal.classList.add('on');scanEan.value='';scanMsg.textContent='Startar kameran…';scanVid.parentElement.style.display='block';
  try{
    if('BarcodeDetector' in window){
      const det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});
      scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
      scanVid.srcObject=scanStream;await scanVid.play();scanMsg.textContent='Rikta kameran mot streckkoden';
      const tickScan=async()=>{if(!scanStream)return;try{const c=await det.detect(scanVid);if(c.length){gotCode(c[0].rawValue);return;}}catch(e){}scanLoop=requestAnimationFrame(tickScan);};
      tickScan();
    }else{
      await loadZxing();
      zxReader=new ZXing.BrowserMultiFormatReader();scanMsg.textContent='Rikta kameran mot streckkoden';
      const pr=zxReader.decodeFromVideoDevice(null,scanVid,(res)=>{if(res)gotCode(res.getText());});
      if(pr&&pr.catch)pr.catch(()=>{scanVid.parentElement.style.display='none';scanMsg.textContent='Kameran gick inte att starta. Skriv in siffrorna under streckkoden i stället.';});
    }
  }catch(e){scanVid.parentElement.style.display='none';scanMsg.textContent='Kameran gick inte att starta. Skriv in siffrorna under streckkoden i stället.';}
}
function loadZxing(){return new Promise((res,rej)=>{if(window.ZXing)return res();const s=document.createElement('script');s.src='https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
function stopScan(){
  if(scanLoop)cancelAnimationFrame(scanLoop);scanLoop=null;
  if(zxReader){try{zxReader.reset();}catch(e){}zxReader=null;}
  if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null;}
}
function closeScan(){stopScan();scanModal.classList.remove('on');}
function gotCode(code){stopScan();if(navigator.vibrate)navigator.vibrate(60);scanEan.value=code;lookupEan(code);}
async function lookupEan(code){
  code=String(code||scanEan.value).replace(/\D/g,'');if(code.length<8){toast('Ange hela streckkoden');return;}
  matInit();
  const local=S.myFoods.find(m=>m.ean===code);if(local){closeScan();openFood(local.id);return;}
  scanMsg.textContent='Söker '+code+'…';
  try{
    const r=await fetch('https://world.openfoodfacts.org/api/v2/product/'+code+'.json?fields=product_name,product_name_sv,brands,nutriments,serving_quantity');
    const j=await r.json();const p=j.product,n=p&&p.nutriments;
    if(!j.status||!n||n['energy-kcal_100g']==null)throw 'nf';
    const m={id:'off'+code,ean:code,n:p.product_name_sv||p.product_name||('Produkt '+code),brand:(p.brands||'').split(',')[0].trim()||undefined,
      k:Math.round(n['energy-kcal_100g']),p:r1(n.proteins_100g||0),c:r1(n.carbohydrates_100g||0),f:r1(n.fat_100g||0),fib:r1(n.fiber_100g||0),serv:Math.round(+p.serving_quantity)||undefined,src:'Open Food Facts'};
    S.myFoods=[m,...S.myFoods.filter(x=>x.id!==m.id)];save();closeScan();openFood(m.id);
  }catch(e){
    if(e==='nf'){closeScan();openEgen('',code);}
    else scanMsg.textContent='Ingen kontakt med produktdatabasen. Kontrollera internet och försök igen.';
  }
}

/* ---------- Dagbok ---------- */
function renderDagbok(m){
  matRollover();
  const t=dayTotals(S.meals),left=m.cal-Math.round(t.k),pct=Math.min(1,t.k/m.cal);
  const R=44,C=2*Math.PI*R,over=left<0;
  const bar=(lbl,v,goal,col)=>`<div class="dbm"><div class="row between"><span>${lbl}</span><span><b>${Math.round(v)}</b><span class="muted"> / ${goal} g</span></span></div><div class="bar"><div class="fill" style="width:${Math.min(100,v/goal*100)}%;background:${col}"></div></div></div>`;
  dbSum.innerHTML=`<div class="dbtop"><div class="dbring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}" class="rbg"/><circle cx="50" cy="50" r="${R}" class="rfg" style="opacity:${t.k>0?1:0};stroke:${over?'var(--d)':'var(--p)'};stroke-dasharray:${C*pct} ${C}"/></svg><div class="dbc"><b>${Math.abs(left).toLocaleString('sv-SE')}</b><span>${over?'kcal över':'kcal kvar'}</span></div></div>
    <div class="dbeq"><div><span class="muted">Mål</span><b>${m.cal.toLocaleString('sv-SE')}</b></div><div><span class="muted">− Mat</span><b>${Math.round(t.k).toLocaleString('sv-SE')}</b></div><div class="eqr"><span class="muted">= Kvar</span><b style="color:${over?'var(--d)':'var(--p)'}">${left.toLocaleString('sv-SE')}</b></div></div></div>
    ${bar('Protein',t.p,m.protein,'var(--p)')}${bar('Kolhydrater',t.c,m.carbs,'#818cf8')}${bar('Fett',t.f,m.fat,'#f472b6')}`;
  // måltidsgrupper
  const groups=MEAL_TYPES.map(mt=>{const items=S.meals.map((x,i)=>[x,i]).filter(([x])=>(x.mt||'Mellanmål')===mt);const s=dayTotals(items.map(z=>z[0]));
    return `<div class="mgrp"><div class="mgh"><b>${mt}</b><span class="muted">${items.length?Math.round(s.k)+' kcal':''}</span><button class="iconbtn sm" onclick="quickAdd('${mt}')" aria-label="Lägg till i ${mt}">${ic('plus')}</button></div>
      ${items.map(([x,i])=>`<div class="mrow"><div><div>${escH(x.d)}</div><div class="muted" style="font-size:11.5px">${x.k} kcal${x.p?' · P '+Math.round(x.p):''}${x.c?' · K '+Math.round(x.c):''}${x.f?' · F '+Math.round(x.f):''}</div></div><button class="btn g sm" onclick="delMeal(${i})" aria-label="Ta bort">✕</button></div>`).join('')}</div>`;}).join('');
  meals.innerHTML=groups;
  // senaste 7 dagarna
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const k=d.toLocaleDateString('sv-SE');return{k,lbl:'SMTOTFL'[d.getDay()],v:k===todayKey()?Math.round(t.k):((S.foodHist||{})[k]||{}).k||0};});
  const mx=Math.max(m.cal*1.15,...days.map(d=>d.v));const logged=days.filter(d=>d.v>0);
  weekFood.innerHTML=`<div class="row between" style="margin-bottom:6px"><span class="muted" style="font-size:12px">Senaste 7 dagarna</span><span class="muted" style="font-size:12px">${logged.length?'snitt '+Math.round(logged.reduce((s,d)=>s+d.v,0)/logged.length).toLocaleString('sv-SE')+' kcal':''}</span></div>
    <div class="wkbars"><div class="goal" style="bottom:${m.cal/mx*100}%"></div>${days.map(d=>`<div class="wb"><div class="wbf ${d.k===todayKey()?'on':''}" style="height:${d.v/mx*100}%"></div><span>${d.lbl}</span></div>`).join('')}</div>`;
}
function quickAdd(mt){curMt=mt;foodQ.focus();foodQ.scrollIntoView({behavior:'smooth',block:'center'});toast('Sök eller skanna – läggs i '+mt.toLowerCase());}
