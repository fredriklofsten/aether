/* Aether – Hjälp, ordlista, guide och övningsbibliotek */
/* ===================== HJÄLP, ORDLISTA, GUIDE, BIBLIOTEK ===================== */
const HELP={
  dagsform:['Dagsform','Skatta hur pigg och stark du känner dig idag, 1–10. Appen väger ihop dagens siffra (60 %) med ditt snitt (40 %) och justerar antal set och hur tungt du ska köra. 7 = vanlig dag.'],
  hrv:['HRV','Hjärtfrekvensvariabilitet från klocka/ring. Om dagens värde är mer än 10 % under din baslinje sänker appen volymen lite. Valfritt – hoppa över om du inte mäter.'],
  rpe:['RPE – hur tungt var setet?','RPE 10 = du kunde inte göra en rep till. RPE 9 = 1 rep kvar. RPE 8 = 2 reps kvar. RPE 7 = 3 reps kvar. Appen visar max-RPE för dagen – stanna där även om det känns lätt.'],
  budget:['Återhämtningsbudget','Ett enkelt mått på hur mycket träning du gjort senaste 7 dagarna (startar på 100). Varje set drar av lite. Under 15 gör appen passen lättare automatiskt för att du inte ska köra slut på dig.'],
  fas:['Träningsfaser','Programmet går i en 12-veckorscykel: Uppbyggnad (5 v, mer volym) → Styrka (4 v, tyngre) → Topp (2 v, tungt och lite) → Återhämtning (1 v, lätt). Det kallas periodisering och ger bättre resultat än att köra likadant hela tiden.'],
  split:['Upplägg','Över/Under: varannat pass ben, varannat överkropp. Push/Pull/Ben: tryck, drag och ben på olika dagar. Helkropp: hela kroppen varje pass – bra vid 3 pass/vecka.'],
  season:['Säsong','Påverkar hur mycket du tränar. Deff = något mindre volym. Bulk = lite mer. Semester = kort underhåll. Tävling = färre, mer specifika set. Ditt kostmål ställer du under Kost → Kropp & mål.'],
  logga:['Så loggar du','Fyll i vikt och reps för varje set du gör. RPE är hur tungt det kändes (se ?). ↓ kopierar setet till nästa rad. +2,5/−2,5 ändrar vikten på första setet. Spara när du är klar – appen går då vidare till nästa pass och föreslår vikter nästa gång.'],
  e1rm:['Beräknad max (e1RM)','En uppskattning av hur mycket du skulle klara en enda gång, räknat från vikt × reps (Epley-formeln). Du behöver aldrig testa max – siffran visar om du blir starkare.'],
  exp:['Träningserfarenhet','Räkna år av regelbunden styrketräning. Ju längre du tränat, desto långsammare kan du bygga muskler – därför sätter appen ett mindre kaloriöverskott för vana.'],
  fettprocent:['Fettprocent','Om fettprocenten är känd räknar appen på din fettfria massa (muskler, skelett, organ) vilket ger bättre förbränning- och proteinsiffror. Måttband (marinens metod) duger bra för att följa trenden.'],
  fasta:['Fasta','Tidsbegränsat ätande (t.ex. 16:8 = fasta 16 h, ät inom 8 h) eller lågkaloridagar (5:2). Alla metoder fungerar genom att du äter mindre totalt. Bokstaven visar hur stark forskningen är för den som styrketränar.']
};
const GLOSS=[['Dagsform (readiness)','Din egen skattning 1–10 av hur pigg du är.'],['RPE','Hur tungt ett set kändes, 1–10. 8 = två reps kvar.'],['e1RM','Beräknat max för en repetition.'],['Set / reps','Ett set = en omgång. Reps = antal lyft i omgången.'],['Volym','Antal hårda set per muskel och vecka.'],['MEV / MAV / MRV','Minsta effektiva, optimala och maximala återhämtningsbara volym per muskel.'],['Deload','Planerad lätt vecka för återhämtning.'],['Periodisering','Att variera träningen i faser över tid.'],['Progressiv överbelastning','Att gradvis öka vikt eller reps.'],['Deff / cut','Period med kaloriunderskott för att tappa fett.'],['Bulk','Period med kaloriöverskott för att bygga muskler.'],['Rekomposition','Tappa fett och bygga muskler samtidigt.'],['TDEE / underhåll','Hur många kalorier du gör av med per dag totalt.'],['BMR','Vilometabolism – kalorier kroppen gör av med i vila.'],['FFM','Fettfri massa – allt utom fett.'],['TRE','Tidsbegränsat ätande, t.ex. 16:8.'],['HRV','Hjärtfrekvensvariabilitet – mått på återhämtning.']];
function help(k){const h=HELP[k];if(!h)return;hTitle.textContent=h[0];hBody.innerHTML=h[1];helpModal.classList.add('on');}
function renderOrd(){ordBox.innerHTML=GLOSS.map(g=>`<div class="tip"><b>${g[0]}</b><br>${g[1]}</div>`).join('');}
function renderSrc(){srcBox.innerHTML='<p class="muted" style="margin-bottom:6px;font-size:12px">Siffrorna i Kost och Fasta bygger på dessa studier och ståndpunkter. Siffrorna i [ ] i appen pekar hit. Råden ersätter inte vård eller dietist.</p>'+
  Object.values(SRC).map((x,i)=>`<div class="tip"><b>[${i+1}] ${x.t}</b><br>${x.d}</div>`).join('')+
  `<div class="tip"><b>Evidensnivåer för fasta</b><br>${Object.entries(EV_TXT).map(([k,v])=>`<span class="ev ${k}">${k}</span> ${v}`).join('<br>')}</div>`;}
function renderGuide(){
  const st=[['Skatta din dagsform','Varje morgon: dra reglaget på Idag. Appen anpassar passet direkt.'],['Kolla dagens pass','Tryck på en övning för instruktioner, bild och för att byta övning.'],['Logga passet','Tryck "Starta & logga passet". Fyll i vikt, reps och RPE. Spara.'],['Ställ in kosten','Kost → Kropp & mål: välj mål, takt och mät gärna fettprocent. Då räknas kalorier och protein ut.'],['Välj fasta (valfritt)','Kost → Fasta: välj metod och ätfönster. Status visas på startsidan.'],['Följ framstegen','Logga vikten 1–3 ggr/vecka under Framsteg. Där syns rekord och styrkekurvor.'],['Lär dig mer','Under Kunskap finns korta artiklar om fasta, kost, träning och återhämtning – alla med källor.']];
  guideBox.innerHTML='<div class="card">'+st.map((x,i)=>`<div class="gstep"><div class="n">${i+1}</div><div><b>${x[0]}</b><div class="muted">${x[1]}</div></div></div>`).join('')+'</div>'+
  '<div class="card"><h4>Tips</h4><div class="tip">Ser du en <button class="q">?</button> – tryck för förklaring.</div><div class="tip">Profil, mål och data hittar du under kugghjulet uppe till höger.</div><div class="tip">Datan sparas bara i din webbläsare – exportera en backup ibland.</div></div>';
}
let libMus='Alla',libEq='alla';
function renderLib(){
  const mus=['Alla',...new Set(Object.values(EX).flatMap(e=>e.m))];
  libMus=mus.includes(libMus)?libMus:'Alla';
  document.getElementById('libMus').innerHTML=mus.map(m=>`<div class="chip ${m===libMus?'on':''}" onclick="libMus='${m}';renderLib()">${m}</div>`).join('');
  libEqChips.innerHTML=[['alla','All utrustning'],['gym','Gym'],['db','Hantlar'],['bw','Kroppsvikt']].map(([k,l])=>`<div class="chip ${libEq===k?'on':''}" onclick="libEq='${k}';renderLib()">${l}</div>`).join('');
  const q=(libQ.value||'').toLowerCase();
  const list=Object.entries(EX).filter(([k,e])=>(libEq==='alla'||eqOk(k,libEq))&&(libMus==='Alla'||e.m.includes(libMus))&&(!q||(e.name+' '+e.m.join(' ')+' '+(e.sec||[]).join(' ')).toLowerCase().includes(q)));
  libList.innerHTML=list.map(([k,e])=>{const th=EX_IMG[k]?`<img class="ex-thumb" src="${EX_THUMB(k)}" alt="" loading="lazy"/>`:`<div class="ex-thumb ph">${ic('dumbbell')}</div>`;
    return `<div class="ex" onclick="openLib('${k}')"><div class="ex-row">${th}<div class="ex-body"><div class="ex-name">${e.name}</div><div class="ex-meta">${e.cue}</div><div class="tags">${e.m.map(m=>`<span class="tag hot">${m}</span>`).join('')}</div></div></div></div>`;}).join('')||'<div class="empty">Ingen övning hittades.</div>';
}
function openLib(k){openEx(k,'','','',k);mMeta.textContent='Övningsbibliotek';document.getElementById('mSwapWrap').style.display='none';}
