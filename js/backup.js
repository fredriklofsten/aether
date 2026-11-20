/* Aether – Säker data: automatiska kopior i webbläsaren, backup-fil och påminnelse */

const BK_DB='aether_backup',BK_KEEP=14;
function bkDb(){return new Promise((res,rej)=>{try{const r=indexedDB.open(BK_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('snaps');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});}
async function bkPut(key,val){const db=await bkDb();return new Promise((res,rej)=>{const tx=db.transaction('snaps','readwrite');tx.objectStore('snaps').put(val,key);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});}
async function bkAll(){const db=await bkDb();return new Promise((res,rej)=>{const out=[];const tx=db.transaction('snaps');const c=tx.objectStore('snaps').openCursor();c.onsuccess=()=>{const cur=c.result;if(cur){out.push({key:cur.key,...cur.value});cur.continue();}else res(out.sort((a,b)=>a.key<b.key?1:-1));};c.onerror=()=>rej(c.error);});}
async function bkDel(key){const db=await bkDb();return new Promise(res=>{const tx=db.transaction('snaps','readwrite');tx.objectStore('snaps').delete(key);tx.oncomplete=res;});}
async function bkClear(){try{const db=await bkDb();const tx=db.transaction('snaps','readwrite');tx.objectStore('snaps').clear();}catch(e){}}

/* Spara en kopia per dag, max en gång var 30:e sekund */
let bkTimer=null;
function bkSchedule(){clearTimeout(bkTimer);bkTimer=setTimeout(bkSnapshot,30000);}
async function bkSnapshot(){
  try{
    if(!S||!S.onboarded)return;
    const key=new Date().toLocaleDateString('sv-SE');
    await bkPut(key,{ts:Date.now(),data:JSON.stringify(S),n:(S.logs||[]).length});
    const all=await bkAll();for(const s of all.slice(BK_KEEP))await bkDel(s.key);
  }catch(e){}
}
/* Koppla in i den vanliga save() */
const _saveOrig=save;
save=function(){_saveOrig();bkSchedule();};

/* Be webbläsaren att inte rensa datan automatiskt */
async function bkPersist(){try{if(navigator.storage&&navigator.storage.persist){if(await navigator.storage.persisted())return true;return await navigator.storage.persist();}}catch(e){}return false;}

/* Backup-fil: dela (mobil) eller ladda ner */
async function saveBackupFile(){
  const name='aether-backup-'+new Date().toISOString().slice(0,10)+'.json';
  const json=JSON.stringify(S,null,2);
  S.lastBackup=Date.now();save();
  try{
    const file=new File([json],name,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Aether backup',text:'Säkerhetskopia av min träningsdata'});toast('Backup sparad');renderBackup();refreshBkBanner();return;}
  }catch(e){if(e&&e.name==='AbortError'){S.lastBackup=null;save();return;}}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([json],{type:'application/json'}));a.download=name;a.click();
  toast('Backup-fil nedladdad');renderBackup();refreshBkBanner();
}
function exportData(){saveBackupFile();}

/* Påminnelse på hemskärmen var 7:e dag när det finns data att förlora */
function bkNeeded(){
  if(!S.onboarded)return false;
  const hasData=(S.logs||[]).length||(S.bwLog||[]).length||Object.keys(S.foodHist||{}).length;
  if(!hasData)return false;
  const last=S.lastBackup||0,snooze=S.bkSnooze||0;
  return Date.now()-last>7*864e5&&Date.now()>snooze;
}
function refreshBkBanner(){
  const el=document.getElementById('bkBanner');if(!el)return;
  if(!bkNeeded()){el.style.display='none';return;}
  const d=S.lastBackup?Math.floor((Date.now()-S.lastBackup)/864e5):null;
  el.style.display='block';
  el.innerHTML=`<div class="row" style="gap:12px;align-items:flex-start"><div class="bkic">${ic('database')}</div><div style="flex:1"><div class="ct">Säkerhetskopiera din data</div><p class="muted" style="font-size:12.5px;margin:3px 0 10px">${d===null?'Du har aldrig sparat en backup-fil.':'Senaste backup-filen är '+d+' dagar gammal.'} Spara den i Filer, Drive eller mejla den till dig själv.</p><div class="row" style="gap:8px"><button class="btn p sm" onclick="saveBackupFile()">Spara backup</button><button class="btn g sm" onclick="S.bkSnooze=Date.now()+3*864e5;save();refreshBkBanner()">Senare</button></div></div></div>`;
}

/* Data & backup-sidan */
async function renderBackup(){
  const box=document.getElementById('bkStatus');if(!box)return;
  const pers=navigator.storage&&navigator.storage.persisted?await navigator.storage.persisted().catch(()=>false):false;
  let snaps=[];try{snaps=await bkAll();}catch(e){}
  const last=S.lastBackup?new Date(S.lastBackup).toLocaleDateString('sv-SE',{day:'numeric',month:'short'}):'aldrig';
  const fmt=k=>new Date(k).toLocaleDateString('sv-SE',{weekday:'short',day:'numeric',month:'short'});
  box.innerHTML=`<div class="bkrow"><span>Senaste backup-fil</span><b>${last}</b></div>
    <div class="bkrow"><span>Automatiska kopior i webbläsaren</span><b>${snaps.length} st</b></div>
    <div class="bkrow"><span>Skyddad mot automatisk rensning</span><b style="color:${pers?'var(--p)':'var(--w)'}">${pers?'Ja':'Nej'}</b></div>
    ${snaps.length?`<details class="acc mini"><summary>Återställ en automatisk kopia</summary><div class="acc-body">${snaps.map(s=>`<div class="bkrow"><span>${fmt(s.key)} <span class="muted">· ${s.n} pass</span></span><button class="btn o sm" onclick="bkRestore('${s.key}')">Återställ</button></div>`).join('')}</div></details>`:''}`;
}
async function bkRestore(key){
  const s=(await bkAll()).find(x=>x.key===key);if(!s)return;
  if(!confirmBox('Återställa kopian från '+key+'? Det du gjort efter det försvinner.'))return;
  await bkPut('fore-aterstallning',{ts:Date.now(),data:JSON.stringify(S),n:(S.logs||[]).length});
  S=migrate(JSON.parse(s.data));_saveOrig();toast('Kopia återställd');refresh();renderBackup();
}
function confirmBox(t){try{return window.confirm(t);}catch(e){return true;}}

/* Starta */
bkPersist().then(()=>{if(curTab==='m-data')renderBackup();});
/* Om webbläsarens vanliga lagring tömts men en kopia finns: erbjud återställning på startsidan */
(async()=>{
  if(load())return;
  try{const snaps=await bkAll();if(!snaps.length)return;const s=snaps.find(x=>x.key!=='fore-aterstallning')||snaps[0];
    const el=document.getElementById('bkSplash');if(!el)return;
    el.style.display='block';el.innerHTML=`<p class="muted" style="font-size:13px;margin-bottom:8px">Vi hittade en säkerhetskopia från ${s.key} (${s.n} pass).</p><button class="btn o full" onclick="(async()=>{S=migrate(JSON.parse((await bkAll()).find(x=>x.key==='${s.key}').data));_saveOrig();start(true);})()">Återställ min data</button>`;
  }catch(e){}
})();

/* Visa påminnelsen när hemskärmen ritas om, och status på datasidan */
const _refreshOrig=refresh;refresh=function(){_refreshOrig.apply(this,arguments);refreshBkBanner();};
const _tabOrig=tab;tab=function(t){_tabOrig.apply(this,arguments);if(t==='m-data')renderBackup();};
