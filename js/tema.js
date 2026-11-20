/* Aether – Hemskärmens tre mätare (inspirerat av WHOOP:s Recovery/Strain/Sleep-dials) */

function dialSvg(pct,color){
  const r=40,c=2*Math.PI*r,arc=.75,len=c*arc,p=Math.max(0,Math.min(1,pct));
  return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="dtrack" stroke-dasharray="${len} ${c}" transform="rotate(135 50 50)"/><circle cx="50" cy="50" r="${r}" class="dval" stroke="${color}" stroke-dasharray="${len*p} ${c}" transform="rotate(135 50 50)" style="opacity:${p>0?1:0}"/></svg>`;
}
function readinessInfo(v){
  if(v<=4)return{c:'var(--d)',t:'Vila mer'};
  if(v<=6)return{c:'var(--w)',t:'Ta det lugnt'};
  return{c:'var(--ok,#4ade80)',t:'Redo att köra'};
}
function renderDials(){
  const el=document.getElementById('dials');if(!el)return;
  const r=S.readiness||7,ri=readinessInfo(r);
  let eaten=0,goal=0;try{const m=macros();goal=m.cal;eaten=(S.mealDate===new Date().toLocaleDateString('sv-SE'))?Math.round((S.meals||[]).reduce((s,x)=>s+(x.k||0),0)):0;}catch(e){}
  const lw=Math.min(logsThisWeek().length,plannedThisWeek()),pl=plannedThisWeek();
  const d=(pct,col,val,unit,lbl,sub,on)=>`<button class="dial" onclick="${on}"><div class="dring">${dialSvg(pct,col)}<div class="dv"><b>${val}</b><span>${unit}</span></div></div><div class="dl">${lbl}</div><div class="ds">${sub}</div></button>`;
  el.innerHTML=
    d(r/10,ri.c,Math.round(r*10),'%','Dagsform',ri.t,"const c=document.querySelector('.checkin');if(c&&c.offsetParent)c.scrollIntoView({behavior:'smooth',block:'center'})")+
    d(goal?eaten/goal:0,eaten>goal?'var(--d)':'var(--p)',eaten.toLocaleString('sv-SE'),'kcal','Kost',goal?'av '+goal.toLocaleString('sv-SE'):'',"goSub('kost','idag')")+
    d(pl?lw/pl:0,'var(--a)',lw+'/'+pl,'pass','Veckan',lw>=pl&&pl?'Klart!':(pl-lw)+' kvar',"goSub('train','schema')");
}
const _renderHomeOrig=renderHome;renderHome=function(){_renderHomeOrig.apply(this,arguments);renderDials();};
