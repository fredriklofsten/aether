/* Aether – menyknappen (☰), sidomeny med alla funktioner, och nya fönster (Framsteg-översikt, Kunskap-flikar) */

ICONS.trend='<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>';
ICONS.sparkle='<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>';
ICONS.chef='<path d="M6 13.9A4 4 0 0 1 7 6a5 5 0 0 1 10 0 4 4 0 0 1 1 7.9V20H6zM6 17h12"/>';
ICONS.cart='<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>';
ICONS.trophy='<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4"/>';
ICONS.x='<path d="M6 6l12 12M18 6 6 18"/>';
SUBS.hist=SUBS.hist||'over';SUBS.learn=SUBS.learn||'art';

/* Gamla sidor som nu ligger under Kunskap */
const MOVED={'m-guide':['learn','guide'],'m-ord':['learn','ord'],'m-src':['learn','src']};
const _tabMeny=tab;
tab=function(t,fromBack){
  if(MOVED[t]){SUBS[MOVED[t][0]]=MOVED[t][1];t=MOVED[t][0];}
  _tabMeny.call(this,t,fromBack);
  if(t==='hist')sub('hist',SUBS.hist);
  if(t==='learn')sub('learn',SUBS.learn);
  const sub_=document.getElementById('backBtn').style.display!=='none';
  menuBtn.style.display=sub_?'none':'flex';
  PAGE_SUBTXT();
};
const _subMeny=sub;
sub=function(g,s){
  _subMeny.apply(this,arguments);
  if(g==='hist'&&s==='over')renderOverview();
  if(g==='learn'){if(s==='guide')renderGuide();if(s==='ord')renderOrd();if(s==='src')renderSrc();}
  PAGE_SUBTXT();
};
function PAGE_SUBTXT(){
  const m={hist:{over:'Din utveckling i siffror',kropp:'Vikt och kroppsmått',styrka:'Rekord och styrkekurvor',logg:'Alla loggade pass'},
    learn:{art:'Forskningen bakom råden',guide:'Kom igång med appen',ord:'Ord och begrepp förklarade',src:'Studier och evidensnivåer'},
    kost:{idag:'Logga mat och se dagens mål',maltid:'Förslag anpassade efter dig',fasta:'Ätfönster och fastemetoder',kropp:'Mål, kropp och energibehov',rad:'Kostcoach och inköpslista'},
    train:{logga:'Logga dagens pass',schema:'Ditt veckoschema',ovn:'Alla övningar i muskelgrupper',period:'Faser och säsong'}};
  const g=curTab,s=SUBS[g];if(m[g]&&m[g][s])pSub.textContent=m[g][s];
}

/* ---------- Sidomenyn ---------- */
const DRAWER=[
  ['Snabbval',[
    ['dumbbell','Logga dagens pass',"goSub('train','logga')",'train/logga'],
    ['food','Logga mat',"goSub('kost','idag');setTimeout(()=>{foodQ.focus()},350)"],
    ['scan','Skanna streckkod',"goSub('kost','idag');setTimeout(openScan,350)"],
    ['scale','Logga vikt',"goSub('hist','kropp');setTimeout(()=>{bwIn.focus()},350)"]]],
  ['Träning',[
    ['home','Idag','tab(\'today\')','today'],
    ['dumbbell','Logga pass',"goSub('train','logga')",'train/logga'],
    ['calendar','Program & veckoschema',"goSub('train','schema')",'train/schema'],
    ['list','Övningar',"goSub('train','ovn')",'train/ovn'],
    ['trend','Period & faser',"goSub('train','period')",'train/period'],
    ['sparkle','Skapa nytt program',"openGenFromProfile()"]]],
  ['Kost',[
    ['food','Matdagbok',"goSub('kost','idag')",'kost/idag'],
    ['chef','Måltidsförslag',"goSub('kost','maltid')",'kost/maltid'],
    ['clock','Fasta',"goSub('kost','fasta')",'kost/fasta'],
    ['target','Kropp & energibehov',"goSub('kost','kropp')",'kost/kropp'],
    ['cart','Kostråd & inköpslista',"goSub('kost','rad')",'kost/rad']]],
  ['Framsteg',[
    ['chart','Översikt',"goSub('hist','over')",'hist/over'],
    ['scale','Kroppsvikt',"goSub('hist','kropp')",'hist/kropp'],
    ['trophy','Styrka & rekord',"goSub('hist','styrka')",'hist/styrka'],
    ['list','Passlogg',"goSub('hist','logg')",'hist/logg']]],
  ['Kunskap',[
    ['book','Artiklar',"goSub('learn','art')",'learn/art'],
    ['compass','Så funkar appen',"goSub('learn','guide')",'learn/guide'],
    ['chat','Ordlista',"goSub('learn','ord')",'learn/ord'],
    ['flask','Evidens & källor',"goSub('learn','src')",'learn/src']]],
  ['Inställningar',[
    ['user','Min profil',"tab('menu')",'menu'],
    ['sun','Utseende',"tab('menu');openProf('look')"],
    ['home','Hemskärm',"tab('menu');openProf('home')"],
    ['database','Data & backup',"tab('m-data')",'m-data']]]];
function drawerHere(){return SUBS[curTab]&&['train','kost','hist','learn'].includes(curTab)?curTab+'/'+SUBS[curTab]:curTab;}
function renderDrawer(){
  const here=drawerHere();
  drawerBox.innerHTML=`<div class="dhead"><div class="row" style="gap:12px;cursor:pointer" onclick="closeDrawer();tab('menu')"><div class="av lg">${initials()}</div><div style="min-width:0"><b>${(S.name&&S.name!=='Demo')?S.name.replace(/</g,''):'Din profil'}</b><div class="muted" style="font-size:12px">Visa och ändra profil →</div></div></div><button class="iconbtn" onclick="closeDrawer()" aria-label="Stäng meny">${ic('x')}</button></div>
  ${DRAWER.map(([g,items])=>`<div class="dgrp">${g}</div>${g==='Snabbval'?`<div class="dquick">${items.map(([i,l,a])=>`<button onclick="closeDrawer();${a.replace(/"/g,'&quot;')}"><span>${ic(i)}</span>${l}</button>`).join('')}</div>`:
    items.map(([i,l,a,k])=>`<button class="ditem ${k&&k===here?'on':''}" onclick="closeDrawer();${a.replace(/"/g,'&quot;')}"><span class="dic">${ic(i)}</span><span>${l}</span></button>`).join('')}`).join('')}
  <p class="muted" style="font-size:11px;text-align:center;margin:18px 0 6px">Aether · data sparas bara på din enhet</p>`;
}
function openDrawer(){renderDrawer();drawer.classList.add('on');}
function closeDrawer(){drawer.classList.remove('on');}

/* ---------- Framsteg: Översikt ---------- */
function renderOverview(){
  const L=S.logs||[],now=Date.now(),d30=now-30*864e5,d7=now-7*864e5;
  const strength=L.filter(l=>!l.cardio);
  const m30=L.filter(l=>l.ts>=d30).length,w=logsThisWeek().length,pl=plannedThisWeek();
  // veckor i rad med minst ett pass
  let streak=0;{let mon=mondayOf(new Date()).getTime();if(!L.some(l=>l.ts>=mon))mon-=7*864e5;
    while(L.some(l=>l.ts>=mon&&l.ts<mon+7*864e5)){streak++;mon-=7*864e5;}}
  const sets30=L.filter(l=>l.ts>=d30).reduce((s,l)=>s+(l.sets||0),0);
  const vol30=Math.round(L.filter(l=>l.ts>=d30).reduce((s,l)=>s+(l.lifts||[]).reduce((a,x)=>a+(x.w||0)*(x.r||0),0),0));
  const bw=(S.bwLog||[]).slice().sort((a,b)=>a.ts-b.ts),bwOld=bw.find(x=>x.ts>=d30),bwNew=bw[bw.length-1];
  const bwCh=bwOld&&bwNew&&bwNew!==bwOld?(bwNew.v-bwOld.v):null;
  const prs=Object.entries(S.prs||{}).filter(([id])=>EX[id]),prs30=prs.filter(([,p])=>p.date&&new Date(p.date).getTime()>=d30);
  const fh=S.foodHist||{},food7=Object.entries(fh).filter(([k,v])=>new Date(k).getTime()>=d7&&v.k>0).length;
  const tile=(v,l,s,on)=>`<button class="otile" onclick="${on}"><b>${v}</b><span>${l}</span>${s?`<em>${s}</em>`:''}</button>`;
  const fun=vol30>0?funWeight(vol30):'';
  overBox.innerHTML=`
   <div class="card"><h4>Den här veckan</h4>
     <div class="obar"><div style="width:${pl?Math.min(100,w/pl*100):0}%"></div></div>
     <div class="row between" style="font-size:13px;margin-top:6px"><span><b>${Math.min(w,pl)} av ${pl}</b> pass klara</span><span class="muted">${streak?streak+(streak===1?' vecka':' veckor')+' i rad 🔥':'Kom igång – första passet räknas!'}</span></div></div>
   <div class="ogrid">
     ${tile(m30,'pass senaste 30 d',strength.length?L.length+' totalt':'',"goSub('hist','logg')")}
     ${tile(sets30,'set senaste 30 d','',"goSub('hist','logg')")}
     ${tile(prs.length,'personliga rekord',prs30.length?prs30.length+' nya på 30 d':'',"goSub('hist','styrka')")}
     ${tile(bwNew?bwNew.v+' kg':'—','kroppsvikt',bwCh!=null?(bwCh>0?'+':'')+bwCh.toFixed(1)+' kg på 30 d':'',"goSub('hist','kropp')")}
     ${tile(food7+'/7','dagar med matlogg','',"goSub('kost','idag')")}
     ${tile(S.readiness||'—','dagsform idag','av 10',"tab('today')")}
   </div>
   ${vol30?`<div class="card ofun">${ic('trophy')}<div><b>${vol30.toLocaleString('sv-SE')} kg</b> lyft senaste 30 dagarna<div class="muted" style="font-size:12.5px">${fun}</div></div></div>`:''}
   ${prs.length?`<div class="card"><h4>Senaste rekorden</h4>${prs.sort((a,b)=>new Date(b[1].date)-new Date(a[1].date)).slice(0,3).map(([id,p])=>`<div class="pr"><span>${EX[id].name}</span><span><b>${p.w} kg × ${p.r}</b> <span class="muted">· ${p.date}</span></span></div>`).join('')}<button class="btn o full" style="margin-top:8px" onclick="sub('hist','styrka')">Alla rekord →</button></div>`:''}
   ${!L.length?`<div class="card"><div class="empty">Inga pass loggade ännu.<br><button class="btn p" style="margin-top:10px" onclick="goSub('train','logga')">Logga ditt första pass</button></div></div>`:''}`;
}
function funWeight(kg){
  const T=[[1500,'en personbil'],[5500,'en elefant'],[12000,'en stadsbuss'],[40000,'en blåval'],[180000,'ett jumbojet-plan']];
  let best=null;for(const [w,n] of T)if(kg>=w)best=[w,n];
  if(!best)return 'Motsvarar '+Math.round(kg/80)+' personer på 80 kg.';
  const x=kg/best[0];return 'Det är som att lyfta '+(x>=2?Math.floor(x)+' × ':'')+best[1]+'!';
}
