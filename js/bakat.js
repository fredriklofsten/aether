/* Aether – telefonens bakåtknapp
   Appen lägger en extra post i webbläsarens historik. När man trycker bakåt fångar vi det
   och gör ett steg bakåt i appen i stället för att stänga den:
   öppet fönster → stängs · undersida → föregående sida · annan flik → Idag · Idag → "tryck igen för att stänga" */

let backExitArmed=0;
function backTrap(){try{history.pushState({aether:'trap'},'');}catch(e){}}
function backInit(){
  try{history.replaceState({aether:'root'},'');}catch(e){}
  backTrap();
  window.addEventListener('popstate',onBack);
  /* Chrome på Android hoppar över historikposter som skapats utan att man rört skärmen.
     Därför läggs fällan dit igen vid första tryckningen om den saknas. */
  const rearm=()=>{if(!history.state||history.state.aether!=='trap')backTrap();};
  window.addEventListener('pointerdown',rearm,{capture:true,passive:true});
  window.addEventListener('keydown',rearm,{capture:true});
}
function onBack(){
  // 1. Stäng öppna fönster (bottenark)
  const open=[...document.querySelectorAll('.modal.on')];
  if(open.length){
    open.forEach(m=>{if(m.id==='scanModal'&&typeof closeScan==='function')closeScan();else m.classList.remove('on');});
    return backTrap();
  }
  // 2. Startguiden: föregående steg
  if(onboard.classList.contains('active')&&typeof OBS!=='undefined'&&OBS>0){OBS--;renderOB();scrollTo(0,0);return backTrap();}
  // 3. Inne i appen
  if(main.classList.contains('active')){
    const isSub=curTab.startsWith('m-')||curTab==='art'||curTab==='sheet'||curTab==='menu';
    if(isSub){if(curTab==='menu')tab('today');else goBack();return backTrap();}
    if(curTab!=='today'){tab('today');return backTrap();}
  }
  // 4. På Idag (eller startskärmen): tryck två gånger för att stänga
  if(Date.now()-backExitArmed<2500){history.back();return;}
  backExitArmed=Date.now();toast('Tryck bakåt igen för att stänga');backTrap();
}
backInit();
