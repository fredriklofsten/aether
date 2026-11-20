/* Aether – telefonens bakåtknapp
   Webbläsarens historik speglar hur man rör sig i appen: varje sida man öppnar och varje fönster
   (bottenark) blir en post. Bakåt går då ett steg tillbaka i appen i stället för att stänga den.

   Viktigt för Chrome på Android: poster som skapas utan att man rört skärmen hoppas över när man
   trycker bakåt. Därför skapas nya poster bara direkt efter en tryckning (userActivation). */

let backBusy=false;
const hasTap=()=>!navigator.userActivation||navigator.userActivation.isActive;
function histPush(st){try{if(hasTap())history.pushState(st,'');else history.replaceState(st,'');}catch(e){}}
function anyModal(){return document.querySelector('.modal.on');}

/* Sidbyten */
const _tabBack=tab;
tab=function(t){
  const before=curTab;
  _tabBack.apply(this,arguments);
  if(backBusy||!main.classList.contains('active')||curTab===before)return;
  histPush({aether:1,t:curTab});
};

/* Fönster som öppnas och stängs */
const modalObs=new MutationObserver(list=>{
  if(backBusy)return;
  for(const m of list){
    const el=m.target,on=el.classList.contains('on'),was=(m.oldValue||'').split(/\s+/).includes('on');
    if(on&&!was)histPush({aether:1,t:curTab,m:el.id});
    else if(!on&&was&&history.state&&history.state.m===el.id){backBusy=true;history.back();setTimeout(()=>backBusy=false,400);}
  }
});
document.querySelectorAll('.modal').forEach(el=>modalObs.observe(el,{attributes:true,attributeFilter:['class'],attributeOldValue:true}));

/* Bakåt trycktes */
window.addEventListener('popstate',e=>{
  if(backBusy)return;   // vi backade själva när ett fönster stängdes med knapp
  backBusy=true;
  try{
    const open=anyModal();
    if(open){if(open.id==='scanModal'&&typeof closeScan==='function')closeScan();document.querySelectorAll('.modal.on').forEach(m=>m.classList.remove('on'));}
    else if(onboard.classList.contains('active')&&typeof OBS!=='undefined'&&OBS>0){OBS--;renderOB();scrollTo(0,0);}
    const st=e.state||{};
    if(main.classList.contains('active')){
      const target=st.t||'today';
      if(target!==curTab)tab(target,true);
      if(st.root&&!open)toast('Tryck bakåt igen för att stänga appen');
    }
  }finally{setTimeout(()=>backBusy=false,50);}
});

/* Startpunkt: Idag är botten. Vid första tryckningen läggs ett skydd ovanpå,
   så att bakåt på Idag först bara visar "tryck igen" i stället för att stänga. */
try{history.replaceState({aether:1,t:'today',root:1},'');}catch(e){}
window.addEventListener('pointerdown',()=>{
  const s=history.state;
  if(s&&s.root&&main.classList.contains('active'))try{history.pushState({aether:1,t:curTab},'');}catch(e){}
},{capture:true,passive:true});
