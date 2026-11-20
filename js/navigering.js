/* Aether – Start, flikar, undermenyer, dagsform och kroppskartor */
function start(cont){splash.classList.remove('active');if(cont&&load()){main.classList.add('active');tab('today');toast('Välkommen tillbaka');}else{OBS=0;onboard.classList.add('active');renderOB();}}
function chip(el,g){document.querySelectorAll('#'+g+' .chip').forEach(c=>c.classList.remove('on'));el.classList.add('on');}
function finishOB(){
  S.name=document.getElementById('ob-name').value||'Demo';S.goal=document.querySelector('#ob-goal .chip.on').dataset.v;
  S.season=document.querySelector('#ob-season .chip.on').dataset.v;
  S.freq=+document.querySelector('#ob-freq .chip.on').dataset.v;
  S.split=document.querySelector('#ob-split .chip.on').dataset.v;
  S.bw=+document.getElementById('ob-bw').value||82;
  S.sex=document.querySelector('#ob-sex .chip.on').dataset.v;S.age=+document.getElementById('ob-age').value||30;S.height=+document.getElementById('ob-h').value||178;
  S.limits=[...document.querySelectorAll('#ob-lim .chip.on')].map(c=>c.dataset.v);
  S.sIdx=0;S.sessionKey=rotation()[0].k;if(S.bw)S.bwLog=[{ts:Date.now(),date:new Date().toLocaleDateString('sv-SE'),v:S.bw}];save();
  onboard.classList.remove('active');main.classList.add('active');tab('today');toast('Program skapat');
}
const SUBS={train:'logga',kost:'idag'};
const PAGE_TITLE={today:'Idag',train:'Träna',kost:'Kost',hist:'Framsteg',learn:'Kunskap',art:'Kunskap',menu:'Profil','m-prof':'Profil','m-data':'Data & backup','m-guide':'Så funkar appen','m-ord':'Ordlista','m-src':'Evidens & källor'};
const PAGE_SUB={learn:'Forskningen bakom råden',menu:'Om dig, mål och inställningar',train:'',kost:''};
const NAV_OF={art:'learn',sheet:'train'};
let curTab='today',backTo=null;
function tab(t,fromBack){
  document.querySelectorAll('.tp').forEach(p=>p.style.display='none');
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  const el=document.getElementById('t-'+t);if(!el)return;el.style.display='block';
  const isSub=t.startsWith('m-')||t==='art'||t==='sheet';
  if(!fromBack){backTo=isSub?((t==='art'||t==='sheet')?(curTab===t?backTo:curTab):'menu'):null;}
  curTab=t;
  const navT=t.startsWith('m-')||t==='menu'?null:t==='sheet'?(backTo&&!backTo.startsWith('m-')&&backTo!=='menu'?(NAV_OF[backTo]||backTo):null):(NAV_OF[t]||t);
  const n=navT&&document.querySelector(`.ni[data-t="${navT}"]`);if(n)n.classList.add('active');
  backBtn.style.display=isSub?'flex':'none';setBtn.style.display=(t==='menu'||isSub)?'none':'flex';
  hdrB.style.display=t==='today'?'block':'none';
  pTitle.textContent=PAGE_TITLE[t]||'';const ds=new Date().toLocaleDateString('sv-SE',{weekday:'long',day:'numeric',month:'long'});pSub.textContent=t==='today'?ds.charAt(0).toUpperCase()+ds.slice(1):(PAGE_SUB[t]||'');
  window.scrollTo(0,0);
  if(t==='today')refresh();
  if(t==='train')sub('train',SUBS.train);if(t==='kost')sub('kost',SUBS.kost);
  if(t==='hist')renderHist();if(t==='menu')renderProfileHub();if(t==='m-prof')renderProf();if(t==='learn')renderLearn();
  if(t==='m-guide')renderGuide();if(t==='m-ord')renderOrd();if(t==='m-src')renderSrc();
  if(t==='m-data')wipeBox.style.display='none';
}
function goBack(){if(curTab==='sheet'&&SH.length>1){SH.pop();renderSheet();window.scrollTo(0,0);return;}SH=[];const b=backTo||'today';backTo=null;tab(b,true);}
function sub(g,s){
  SUBS[g]=s;
  document.querySelectorAll(`.seg[data-g="${g}"] button`).forEach(b=>b.classList.toggle('on',b.dataset.s===s));
  document.querySelectorAll(`.sp[data-g="${g}"]`).forEach(p=>p.classList.toggle('on',p.dataset.s===s));
  if(g==='train'){if(s==='logga')renderLog();if(s==='schema'||s==='period')renderTrain();if(s==='ovn')renderLib();}
  if(g==='kost')renderKost();
  if(g==='train'&&s==='schema')trainLearn.innerHTML=artLinks('traning',6);
}
function goSub(g,s){SUBS[g]=s;tab(g);}
function wipeAsk(){wipeBox.style.display='block';}
function setR(v){S.readiness=v;S.hrv=+(hrvIn.value)||S.hrv;save();refresh();}
function toggleCtx(el){const v=el.dataset.v;el.classList.toggle('on');S.context=S.context||[];if(el.classList.contains('on')){if(!S.context.includes(v))S.context.push(v);}else S.context=S.context.filter(x=>x!==v);save();refresh();}
function setTime(el){document.querySelectorAll('#timeChips .chip').forEach(c=>c.classList.remove('on'));el.classList.add('on');S.timeBudget=el.dataset.v;save();refresh();}
function setSeason(el){document.querySelectorAll('#seasonChips .chip').forEach(c=>c.classList.remove('on'));el.classList.add('on');S.season=el.dataset.v;save();renderTrain();refresh();}

function svgFront(p,s){const on=id=>`class="muscle ${p.has(id)?'on':s.has(id)?'sec':''}"`;return `<svg viewBox="0 0 120 280"><ellipse cx="60" cy="22" rx="16" ry="18" fill="#3d4658"/><rect x="48" y="38" width="24" height="10" rx="3" fill="#3d4658"/><path ${on('shoulders')} d="M28 52 L48 48 L48 70 L32 78 Z"/><path ${on('shoulders')} d="M92 52 L72 48 L72 70 L88 78 Z"/><path ${on('chest')} d="M48 50 L72 50 L74 78 L46 78 Z"/><path ${on('core')} d="M48 78 L72 78 L70 120 L50 120 Z"/><path ${on('biceps')} d="M22 78 L32 78 L34 115 L20 112 Z"/><path ${on('biceps')} d="M98 78 L88 78 L86 115 L100 112 Z"/><path ${on('quads')} d="M48 120 L58 120 L60 195 L46 195 Z"/><path ${on('quads')} d="M62 120 L72 120 L74 195 L60 195 Z"/><path ${on('calves')} d="M46 195 L58 195 L57 250 L48 250 Z"/><path ${on('calves')} d="M62 195 L74 195 L72 250 L63 250 Z"/></svg>`;}
function svgBack(p,s){const on=id=>`class="muscle ${p.has(id)?'on':s.has(id)?'sec':''}"`;return `<svg viewBox="0 0 120 280"><ellipse cx="60" cy="22" rx="16" ry="18" fill="#3d4658"/><rect x="48" y="38" width="24" height="10" rx="3" fill="#3d4658"/><path ${on('shoulders')} d="M28 52 L48 48 L48 70 L32 78 Z"/><path ${on('shoulders')} d="M92 52 L72 48 L72 70 L88 78 Z"/><path ${on('upperback')} d="M46 50 L74 50 L72 85 L48 85 Z"/><path ${on('lats')} d="M40 70 L48 68 L50 115 L36 100 Z"/><path ${on('lats')} d="M80 70 L72 68 L70 115 L84 100 Z"/><path ${on('glutes')} d="M46 122 L74 122 L72 155 L48 155 Z"/><path ${on('hams')} d="M48 155 L58 155 L58 200 L46 200 Z"/><path ${on('hams')} d="M62 155 L72 155 L74 200 L62 200 Z"/><path ${on('calves')} d="M46 200 L58 200 L57 250 L48 250 Z"/><path ${on('calves')} d="M62 200 L74 200 L72 250 L63 250 Z"/></svg>`;}
