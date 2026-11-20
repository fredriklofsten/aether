/* Aether – Kost- och fastemotor (evidensbaserad) */
/* ===================== KOST- & FASTEMOTOR (evidensbaserad) ===================== */
const SRC={
  mifflin:{t:'Mifflin MD m.fl. 1990, Am J Clin Nutr',d:'Formel för vilometabolism (BMR) från vikt, längd, ålder och kön. Används när fettprocent saknas.'},
  katch:{t:'Katch–McArdle-formeln (McArdle, Katch & Katch, Exercise Physiology)',d:'BMR från fettfri massa (370 + 21,6 × FFM). Mer träffsäker när fettprocenten är känd.'},
  navy:{t:'Hodgdon & Beckett 1984, Naval Health Research Center',d:'Uppskattar fettprocent från midja, hals (och höft för kvinnor) och längd. Felmarginal ca ±3–4 procentenheter.'},
  morton:{t:'Morton RW m.fl. 2018, Br J Sports Med (meta-analys)',d:'Protein över ca 1,6 g/kg/dag gav ingen ytterligare muskelökning i snitt; övre gräns i analysen ca 2,2 g/kg.'},
  issn_prot:{t:'Jäger R m.fl. 2017, J Int Soc Sports Nutr (ISSN-ståndpunkt)',d:'1,4–2,0 g/kg/dag för de flesta tränande; 20–40 g protein per mål; högre intag kan behövas i kaloriunderskott.'},
  helms:{t:'Helms ER m.fl. 2014, Int J Sport Nutr Exerc Metab',d:'Systematisk översikt: 2,3–3,1 g protein per kg fettfri massa under kaloriunderskott hos smala styrketränande.'},
  helms_prep:{t:'Helms ER, Aragon AA, Fitschen PJ 2014, J Int Soc Sports Nutr',d:'Rekommenderar viktnedgång på 0,5–1 % av kroppsvikten per vecka för att bevara muskelmassa.'},
  garthe:{t:'Garthe I m.fl. 2011, Int J Sport Nutr Exerc Metab',d:'Elitidrottare med styrketräning: gruppen som siktade på 0,7 %/vecka ökade sin fettfria massa och styrka, vilket gruppen som siktade på 1,4 %/vecka inte gjorde. Vid uppföljning efter 12 månader fanns ingen skillnad kvar.'},
  sch_ar:{t:'Schoenfeld BJ & Aragon AA 2018, J Int Soc Sports Nutr',d:'Föreslår ca 0,4 g/kg protein per mål fördelat på minst 4 mål för att maximera muskeluppbyggnad.'},
  iraki:{t:'Iraki J m.fl. 2019, Sports',d:'Off-season för kroppsbyggare: måttligt kaloriöverskott och långsam viktökning för att begränsa fettökning.'},
  barakat:{t:'Barakat C m.fl. 2020, Strength Cond J',d:'Rekomposition (fett ner och muskler upp samtidigt) är väl dokumenterad, särskilt hos nybörjare, återkommande och personer med högre fettprocent.'},
  kerksick:{t:'Kerksick CM m.fl. 2017, J Int Soc Sports Nutr (ISSN, näringstiming)',d:'Totalt intag av energi och protein är viktigast; protein inom några timmar före/efter passet är rimligt men timing är sekundärt.'},
  moro:{t:'Moro T m.fl. 2016, J Transl Med',d:'34 styrketränade män, 8 veckor, samma kalorier i båda grupperna. 16:8 (ätfönster 13–20) minskade fettmassan och bibehöll muskelmassa och styrka. Testosteron och IGF-1 sjönk i fastegruppen.'},
  tinsley19:{t:'Tinsley GM m.fl. 2019, Am J Clin Nutr',d:'Styrketränade kvinnor, 8 veckor. Ätfönster 12–20 gav samma ökning av muskelmassa och styrka som vanlig kost. Båda grupperna åt ca 1,6 g protein/kg.'},
  tinsley17:{t:'Tinsley GM m.fl. 2017, Eur J Sport Sci',d:'Unga män, 8 veckor. 4 timmars ätfönster de fyra dagar/vecka de inte tränade. Ingen negativ effekt på muskelmassa eller styrka, men de åt mindre totalt. Liten studie.'},
  lowe:{t:'Lowe DA m.fl. 2020, JAMA Intern Med (TREAT)',d:'116 vuxna med övervikt, 12 veckor. 16:8 (ätfönster 12–20) utan andra ändringar gav inte mer viktnedgång än tre mål om dagen. I den uppmätta gruppen var ca 65 % av viktnedgången fettfri massa (normalt 20–30 %).'},
  stote:{t:'Stote KS m.fl. 2007, Am J Clin Nutr',d:'Normalviktiga, 8 veckor, samma kalorier. En måltid per dag gav något mindre fettmassa men mer hunger, högre blodtryck och högre LDL-kolesterol än tre mål.'},
  harvie:{t:'Harvie MN m.fl. 2011, Int J Obes',d:'107 kvinnor med övervikt, 6 månader. Två dagar/vecka med ca 650 kcal gav liknande viktnedgång som 25 % kaloriminskning varje dag.'},
  trep:{t:'Trepanowski JF m.fl. 2017, JAMA Intern Med',d:'100 vuxna med fetma, 1 år. Varannandagsfasta (25 %/125 %) gav samma viktnedgång som daglig kaloribegränsning (−6,8 % efter 6 mån), men fler hoppade av (38 % mot 29 %) och LDL var högre efter 12 mån.'},
  kreider:{t:'Kreider RB m.fl. 2017, J Int Soc Sports Nutr (ISSN, kreatin)',d:'Kreatinmonohydrat 3–5 g/dag ökar styrka och muskelmassa vid träning; välstuderat och säkert för friska.'},
  guest:{t:'Guest NS m.fl. 2021, J Int Soc Sports Nutr (ISSN, koffein)',d:'Koffein ca 3–6 mg/kg 30–60 min före träning förbättrar prestation; lägre doser kan räcka.'},
  nnr:{t:'Nordiska näringsrekommendationer 2023',d:'Vuxna rekommenderas minst 25–35 g fiber per dag.'},
  anton:{t:'Anton SD m.fl. 2018, Obesity',d:'Översikt: den "metabola switchen" – när leverns glykogen tar slut och kroppen börjar använda fettsyror och ketoner – inträffar oftast efter mer än 12 timmar utan mat.'},
  sch_vol:{t:'Schoenfeld BJ, Ogborn D, Krieger JW 2017, J Sports Sci (meta-analys)',d:'Fler set per vecka ger mer muskeltillväxt (dos–respons). Minst ca 10 set per muskel och vecka gav bäst resultat i analysen.'},
  sch_load:{t:'Schoenfeld BJ m.fl. 2017, J Strength Cond Res (meta-analys)',d:'Lätta (≤60 % av max) och tunga vikter gav lika mycket muskeltillväxt när seten kördes nära utmattning. Maxstyrkan ökade mer med tunga vikter.'},
  sch_freq:{t:'Schoenfeld BJ, Ogborn D, Krieger JW 2016, Sports Med (meta-analys)',d:'Att träna en muskel minst två gånger per vecka gav mer tillväxt än en gång. Om tre gånger är bättre än två är oklart.'},
  sch_rest:{t:'Schoenfeld BJ m.fl. 2016, J Strength Cond Res',d:'21 tränade män, 8 veckor. 3 minuters vila mellan set gav mer styrka och muskeltillväxt än 1 minut.'},
  refalo:{t:'Refalo MC m.fl. 2023, Sports Med (meta-analys)',d:'Att köra varje set till failure gav ingen tydlig fördel för muskeltillväxt jämfört med att stanna strax innan. Att träna nära failure är dock viktigt.'},
  schumann:{t:'Schumann M m.fl. 2022, Sports Med (meta-analys, 43 studier)',d:'Kondition plus styrketräning minskade inte muskeltillväxt eller maxstyrka. Explosiv styrka kunde påverkas något, mest när båda gjordes i samma pass.'},
  lamon:{t:'Lamon S m.fl. 2021, Physiol Rep',d:'En natt helt utan sömn minskade muskelproteinsyntesen med 18 %, höjde kortisol med 21 % och sänkte testosteron med 24 %.'},
  parr:{t:'Parr EB m.fl. 2014, PLoS One',d:'Alkohol efter träning minskade muskelproteinsyntesen, även när protein intogs samtidigt.'},
  who:{t:'Bull FC m.fl. 2020, Br J Sports Med (WHO:s riktlinjer)',d:'Vuxna bör ha 150–300 min måttlig eller 75–150 min hög intensitet konditionsaktivitet per vecka, plus muskelstärkande träning minst 2 dagar per vecka.'},
  acsm:{t:'ACSM 2009, Med Sci Sports Exerc (progressionsmodeller)',d:'Nybörjare: 8–12 RM och 2–3 pass/vecka; medel 3–4; vana 4–5. Stora muskler och flerledsövningar före små. Tung styrketräning (1–6 RM) med 3–5 min vila.'},
  currier:{t:'Currier BS m.fl. 2023, Br J Sports Med (nätverksmeta-analys)',d:'Nästan 200 studier, över 5 000 personer. All styrketräning – även med kroppsvikt – gav mer styrka och muskler än ingen träning. Tunga vikter gav mest styrka; muskeltillväxten var likartad oavsett belastning, och flera set rankades högst.'},
  milanovic:{t:'Milanović Z m.fl. 2015, Sports Med (meta-analys)',d:'Både intervaller och vanlig uthållighetsträning gav stora förbättringar av VO₂max hos friska vuxna; intervaller gav något större förbättring.'},
  helgerud:{t:'Helgerud J m.fl. 2007, Med Sci Sports Exerc',d:'40 män, 3 pass/vecka i 8 veckor med samma totala arbete. 4×4 min och 15/15 s intervaller ökade VO₂max mer än lugn distans och tröskelträning.'},
  williams:{t:'Williams TD m.fl. 2017, Sports Med (meta-analys)',d:'18 studier: periodiserad styrketräning gav större ökning av maxstyrka (1RM) än träning utan planerad variation – en måttlig effekt.'},
  moesgaard:{t:'Moesgaard L m.fl. 2022, Sports Med (meta-analys)',d:'35 studier med samma totala volym: periodisering gav mer maxstyrka men inte mer muskeltillväxt. Hos tränade gav varierad (böljande) periodisering mest styrka.'},
  coleman:{t:'Coleman M m.fl. 2024, PeerJ',d:'Tränade personer som tog en helt träningsfri vecka mitt i ett 9-veckorsprogram fick lika mycket muskeltillväxt men något mindre styrkeökning än de som tränade på.'},
  slv_d:{t:'Livsmedelsverket – D-vitamin',d:'Rekommenderat intag 10 µg/dag för vuxna (20 µg över 75 år). Tillskott rekommenderas till vissa grupper, t.ex. de som får lite sol eller inte äter fisk eller berikade produkter. Vuxna bör inte få i sig mer än 100 µg/dag.'}
};
const FAST={
  none:{label:'Ingen',sub:'äta fritt',type:'none',win:null,meals:4,ev:'A',src:['kerksick'],text:'Ät när det passar. Totalt intag av energi och protein styr resultatet – inte klockan.'},
  '12_12':{label:'12:12',sub:'nattfasta',type:'tre',win:12,meals:4,ev:'B',src:['kerksick'],text:'12 timmars nattfasta – i praktiken vanlig dygnsrytm utan kvällsätande. Lätt att hålla och inga kända nackdelar för muskler.'},
  '14_10':{label:'14:10',sub:'mild',type:'tre',win:10,meals:3,ev:'B',src:['moro','tinsley19'],text:'Mjuk variant av 16:8. Bra start. Liknande resultat som 16:8 kan förväntas så länge kalorier och protein stämmer.'},
  '16_8':{label:'16:8',sub:'vanligast',type:'tre',win:8,meals:3,ev:'A',src:['moro','tinsley19','lowe'],text:'Bäst studerat tillsammans med styrketräning: hos män och kvinnor som tränade bibehölls eller ökade muskler och styrka när proteinet var tillräckligt. Utan styrketräning (TREAT-studien) var en stor del av viktnedgången muskler.'},
  '18_6':{label:'18:6',sub:'krävande',type:'tre',win:6,meals:2,ev:'C',src:['sch_ar','tinsley17'],text:'Kort fönster gör det svårt att få i sig nog med protein och mat. Fungerar för fettminskning, mindre lämpligt för att bygga muskler.'},
  '20_4':{label:'20:4',sub:'"warrior"',type:'tre',win:4,meals:2,ev:'C',src:['tinsley17','sch_ar'],text:'En liten studie (4 h fönster fyra dagar/vecka) såg ingen negativ effekt på muskler eller styrka, men deltagarna åt mindre. Svårt att nå proteinmålet varje dag. Mest för fettminskning hos vana.'},
  omad:{label:'OMAD',sub:'1 mål/dag',type:'tre',win:1,meals:1,ev:'D',src:['stote','sch_ar'],text:'En måltid per dag. I den enda kontrollerade studien gav den mer hunger, högre blodtryck och högre LDL-kolesterol. Proteinet går inte att fördela. Avråds om du vill bygga muskler.'},
  '5_2':{label:'5:2',sub:'2 lågdagar',type:'days',meals:3,ev:'B',src:['harvie'],text:'Fem vanliga dagar och två dagar med ca 25 % av energibehovet. Lika effektivt som daglig kaloribegränsning. Lägg lågdagarna på vilodagar.'},
  adf:{label:'Varannan dag',sub:'ADF',type:'adf',meals:3,ev:'C',src:['trep'],text:'Lågdag (ca 25 %) varannan dag. Inte bättre än vanlig kaloribegränsning och många hoppar av. Undvik tunga pass på lågdagar.'}
};
const EV_TXT={A:'Stark evidens med styrketräning',B:'Stöd, mest från viktminskningsstudier',C:'Begränsad/blandad evidens',D:'Mycket svag evidens'};
const DAYN=['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];
const GOAL_TXT={fat_loss:'Gå ner i fett',hypertrophy:'Bygga muskler',recomp:'Båda samtidigt',strength:'Bli starkare',maintain:'Behålla'};
const EXP_GAIN={beginner:[1,1.5],intermediate:[0.5,1],advanced:[0.25,0.5]}; // % kroppsvikt/månad (Helms/Aragon-pyramiden, Iraki 2019)
const RATE_MUL={slow:0.7,std:1,fast:1.3};
const SHOP=[['Kyckling, nötfärs',['m']],['Lax, torsk, tonfisk',['f']],['Ägg',['e']],['Kvarg / grekisk yoghurt',['d']],['Tofu, tempeh, sojayoghurt',[]],['Bönor, linser, kikärtor',[]],['Havregryn, quinoa, bulgur',[]],['Ris, potatis, pasta',[]],['Broccoli & frysta grönsaker',[]],['Bananer & bär',[]],['Whey eller ärtprotein (vid behov)',[]],['Olivolja, nötter, frön',[]],['Kreatin monohydrat',[]]];

function srcTag(ids){return(ids||[]).map(id=>`<span class="src" onclick="showSrc('${id}')">[${Object.keys(SRC).indexOf(id)+1}]</span>`).join('');}
function showSrc(id){const s=SRC[id];if(!s)return;hTitle.textContent='Källa ['+(Object.keys(SRC).indexOf(id)+1)+']';hBody.innerHTML=`<b>${s.t}</b><br>${s.d}<br><br><span class="muted">Alla källor finns under Meny → Evidens & källor.</span>`;helpModal.classList.add('on');}

function navyBf(){
  const h=S.height,w=S.waist,n=S.neck,hip=S.hip;if(!h||!w||!n)return null;
  let bf;
  if(S.sex==='f'){if(!hip||w+hip-n<=0)return null;bf=495/(1.29579-0.35004*Math.log10(w+hip-n)+0.22100*Math.log10(h))-450;}
  else{if(w-n<=0)return null;bf=495/(1.0324-0.19077*Math.log10(w-n)+0.15456*Math.log10(h))-450;}
  return bf>3&&bf<60?Math.round(bf*10)/10:null;
}
function bodyComp(){
  let bf=null,src='none';
  if(S.bfMode==='known'&&S.bf>2&&S.bf<60){bf=S.bf;src='known';}
  else if(S.bfMode==='tape'){bf=navyBf();if(bf)src='tape';}
  const f=S.sex==='f';
  const cut=f?[18,23,28,32]:[10,15,20,25];
  let cat=null,catTxt='okänd';
  if(bf!=null){cat=bf<cut[0]?0:bf<cut[1]?1:bf<cut[2]?2:bf<cut[3]?3:4;catTxt=['mycket låg','låg','medel','förhöjd','hög'][cat];}
  const bmi=S.bw/Math.pow((S.height||178)/100,2);
  if(cat==null){cat=bmi>=30?4:bmi>=27?3:2;} // grov uppskattning utan fett%
  const ffm=bf!=null?Math.round(S.bw*(1-bf/100)*10)/10:null;
  return{bf,src,cat,catTxt,ffm,bmi:Math.round(bmi*10)/10};
}
function isLowDay(d){
  const f=FAST[S.fast]||FAST.none;d=d||new Date();
  if(f.type==='days')return(S.fastDays||[]).includes((d.getDay()+6)%7);
  if(f.type==='adf'){const n=Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5);return(n+(S.adfOff||0))%2===0;}
  return false;
}
function energyPlan(){
  const bc=bodyComp();
  const bmr=bc.ffm?370+21.6*bc.ffm:10*S.bw+6.25*(S.height||178)-5*(S.age||30)+(S.sex==='f'?-161:5);
  const tdee=Math.round(bmr*(S.act||1.55));
  const rm=RATE_MUL[S.rate||'std'],exp=S.exp||'beginner';
  let delta=0,ratePct=null,gainRange=null,notes=[],srcs=[];
  const g=S.goal;
  if(g==='fat_loss'){
    const base=[0.4,0.5,0.7,0.8,1.0][bc.cat];
    ratePct=Math.min(bc.cat<=1?0.8:1.25,base*rm);
    delta=-Math.round(ratePct/100*S.bw*7700/7);
    delta=Math.max(delta,-Math.round(tdee*(bc.cat<=1?0.2:0.3)),-1000);
    ratePct=Math.round(-delta*7/7700/S.bw*1000)/10;
    srcs=['helms_prep','garthe'];
    if(bc.cat===0)notes.push('Du är redan mycket smal – en lång deff ökar risken att tappa muskler och energi. Överväg att behålla istället.');
  }else if(g==='hypertrophy'){
    gainRange=EXP_GAIN[exp];
    let pct=({beginner:0.15,intermediate:0.1,advanced:0.05})[exp]*rm;
    if(bc.cat>=3){pct=Math.min(pct,0.05);notes.push('Med förhöjd fettprocent ger "båda samtidigt" eller en kort deff ofta bättre resultat än att bulka.');srcs.push('barakat');}
    delta=Math.round(tdee*pct);srcs.unshift('iraki');
  }else if(g==='recomp'){
    delta=Math.round(tdee*[0,0,-0.05,-0.1,-0.15][bc.cat]*rm);srcs=['barakat'];
    if(exp==='advanced'&&bc.cat<=1)notes.push('Som van och smal går rekomposition mycket långsamt. Växla hellre mellan korta bulk- och deffperioder.');
  }else if(g==='strength'){delta=exp==='beginner'?Math.round(tdee*0.05):0;srcs=['kerksick'];}
  return{bc,bmr:Math.round(bmr),tdee,delta,ratePct,gainRange,notes,srcs,bmrSrc:bc.ffm?'katch':'mifflin'};
}
function macros(){
  const phase=getPhase(S.week);
  const ep=energyPlan(),bc=ep.bc;
  const a=adj(S.readiness,S.rAvg,hrvSt(S.hrv,S.hrvBase),phase,calcFatigue(S.logs));
  const tmpl=currentSession();
  const load=S.trainingDay?plannedLoad(tmpl,a.volumeMod):0;
  let dayMod=0;
  if(S.trainingDay){if(load>90)dayMod=100;else if(load>60)dayMod=50;}else dayMod=-120;
  if(phase.phase==='deload')dayMod-=80;
  const f=FAST[S.fast]||FAST.none;const low=isLowDay();
  let cal=ep.tdee+ep.delta+dayMod;
  const floor=Math.max(S.sex==='f'?1200:1400,Math.round(ep.bmr));
  if(!low)cal=Math.max(floor,cal);
  // Protein
  const deficit=ep.delta<0;
  let protein,pBasis;
  if(bc.ffm&&deficit&&bc.cat<=2){protein=bc.ffm*2.6;pBasis='2,6 g/kg fettfri massa (smal i underskott)';}
  else if(bc.ffm&&bc.cat>=3){protein=bc.ffm*(deficit?2.4:2.2);pBasis=(deficit?'2,4':'2,2')+' g/kg fettfri massa (räknas på FFM vid högre fett%)';}
  else{
    const refW=bc.bmi>=30?25*Math.pow((S.height||178)/100,2):S.bw;
    const k=deficit?2.0:S.goal==='recomp'?2.0:S.goal==='maintain'?1.6:1.8;
    protein=refW*k;pBasis=k.toString().replace('.',',')+' g/kg '+(bc.bmi>=30?'av vikt vid BMI 25':'kroppsvikt');
  }
  protein=Math.round(protein);
  let fatKg=deficit?0.6:0.8,fat=Math.round(S.bw*fatKg);
  if(low){ // 5:2 / ADF lågdag ≈ 25 % av behovet
    cal=Math.round(ep.tdee*0.25/10)*10;
    protein=Math.min(protein,Math.round(cal*0.5/4));fat=Math.round(cal*0.3/9);
  }else{
    fat=Math.max(fat,Math.round(cal*0.2/9));fat=Math.min(fat,Math.round(cal*0.35/9));
  }
  const carbs=Math.max(low?20:80,Math.round((cal-protein*4-fat*9)/4));
  const fiber=Math.min(40,Math.max(25,Math.round(cal/1000*14)));
  const pm=(S.prof||{}).meals;const mealsN=low?2:(f.type==='none'?(pm||f.meals):Math.min(f.meals,pm||f.meals));
  const proteinPerMeal=Math.round(protein/mealsN);
  return{cal,protein,carbs,fat,fiber,ep,bc,phase,load:+load.toFixed(0),pBasis,proteinPerMeal,mealsN,f,low,fatKg,dayMod};
}
function nutritionCoach(m){
  const tips=[];const f=m.f,bw=S.bw;
  const T=(t,s)=>tips.push({t,s});
  T(`Protein ${m.protein} g/dag (${m.pBasis}).`,m.bc.ffm&&m.ep.delta<0?['helms','morton']:['morton','issn_prot']);
  if(m.proteinPerMeal/bw>0.55&&m.mealsN<=2)T(`Med ${m.mealsN} mål blir det ${m.proteinPerMeal} g protein per mål – det går, men 3–4 mål à ~${Math.round(bw*0.4)} g är mer optimalt för muskler.`,['sch_ar']);
  else T(`Fördela proteinet på ${m.mealsN} mål à ca ${m.proteinPerMeal} g.`,['sch_ar','issn_prot']);
  if(S.goal==='fat_loss')T(`Sikta på ca ${String(m.ep.ratePct).replace('.',',')} % av kroppsvikten per vecka (≈${(m.ep.ratePct/100*bw).toFixed(1).replace('.',',')} kg). Långsammare = mer muskler kvar.`,['helms_prep','garthe']);
  if(S.goal==='hypertrophy'&&m.ep.gainRange)T(`Rimlig viktökning för din erfarenhet: ${m.ep.gainRange[0]}–${m.ep.gainRange[1]} % per månad (≈${(m.ep.gainRange[0]/100*bw).toFixed(1)}–${(m.ep.gainRange[1]/100*bw).toFixed(1)} kg). Går det fortare är det mest fett.`,['iraki']);
  if(S.goal==='recomp')T('Ät nära underhåll, högt protein och träna progressivt. Vågen står ofta still – följ midjemått och styrka istället.',['barakat']);
  m.ep.notes.forEach(n=>T(n,m.ep.srcs));
  if(f.type!=='none')T('Fasta fungerar främst genom att du äter mindre totalt. Det finns ingen extra fettförbränning när kalorier och protein matchas.',['moro','lowe']);
  if(f.type!=='none'&&(S.goal==='hypertrophy')&&['18_6','20_4','omad','adf'].includes(S.fast))T(`${f.label} gör det svårt att äta i överskott. För att bygga muskler: välj 16:8 eller kortare fasta.`,f.src);
  if(m.low)T('Lågdag idag: prioritera protein (kött, fisk, ägg, kvarg) och grönsaker. Kör vila eller lätt pass.',['harvie']);
  if(S.trainingDay&&!m.low)T(m.load>=60?'Tungt pass idag: 20–40 g protein plus kolhydrater 1–3 h före och liknande efter.':'Lättare pass: ett proteinrikt mål efter passet räcker.',['kerksick']);
  if(!S.trainingDay)T('Vilodag: behåll proteinet – sänk främst kolhydraterna något.',['kerksick']);
  if(m.carbs/bw<2&&S.trainingDay&&!m.low)T(`Kolhydraterna är låga (${(m.carbs/bw).toFixed(1)} g/kg). Det kan sänka prestationen vid hög volym.`,['kerksick']);
  T(`Fibrer minst ${m.fiber} g/dag – grönsaker, baljväxter, fullkorn, bär.`,['nnr']);
  T('Kreatin 3–5 g/dag, när som helst på dagen (bryter inte fastan nämnvärt).',['kreider']);
  if((S.context||[]).includes('poor_sleep'))T('Dålig sömn sänker kroppens förmåga att bygga muskler. Undvik stort underskott idag och prioritera protein.',['lamon']);
  if((S.context||[]).includes('sick'))T('Sjuk: ät och drick – pausa fastan tills du mår bättre.',[]);
  let peri;
  if(m.low)peri='Lågdag: hoppa över tunga pass. Om du tränar – lägg passet nära en proteinrik måltid.';
  else if(!S.trainingDay)peri='Vilodag: jämn fördelning av protein över dagen.';
  else if(S.fastedTrain==='morning')peri='Morgonpass fastande: ingen frukost krävs. Ät 20–40 g protein inom ca 2 h efter passet'+(m.load>=60?' plus kolhydrater.':'.');
  else if(S.fastedTrain==='late')peri='Pass sent i fastan: prestationen kan sjunka vid tunga/långa pass. Bryt fastan direkt efter med 30–40 g protein + kolhydrater, eller flytta fönstret så att passet hamnar tidigt i det.';
  else peri=m.load>=60?'Före passet: 20–40 g protein + 30–60 g kolhydrater (1–3 h innan). Efter: liknande inom några timmar.':'Valfritt mål före; proteinrikt mål efter passet.';
  const supplements=[['Kreatin 3–5 g/dag',['kreider']],['Koffein ca 3 mg/kg 30–60 min före pass om du tål det (inte sent på dagen)',['guest']],['Proteinpulver bara om du inte når proteinmålet med mat',['issn_prot']],['D-vitamin 10 µg/dag om du får lite sol eller inte äter fisk/berikade livsmedel – inte över 100 µg/dag',['slv_d']]];
  return{tips,peri,supplements};
}
function setFast(k){S.fast=k;if(FAST[k].type==='days'&&!(S.fastDays||[]).length)S.fastDays=[1,3];save();renderKost();refresh();}
function setFasted(el){S.fastedTrain=el.dataset.v;save();renderKost();refresh();}
function setWin(){S.winStart=+winStart.value;save();renderKost();refresh();}
function setTrainHour(){S.trainHour=+trainHour.value;save();renderKost();}
function suggestWin(){
  const f=FAST[S.fast]||FAST.none;if(f.type!=='tre'){toast('Välj ett tidsfönster först (t.ex. 16:8)');return;}
  const th=S.trainHour??17;let st;
  if(S.fastedTrain==='morning')st=th+1;else st=Math.max(6,th-2);
  if(st+f.win>23)st=Math.max(6,23-f.win);
  S.winStart=Math.min(22,st);save();renderKost();refresh();toast('Fönster '+fmtH(S.winStart)+'–'+fmtH(S.winStart+f.win));
}
function toggleFastDay(i){S.fastDays=S.fastDays||[];if(S.fastDays.includes(i))S.fastDays=S.fastDays.filter(x=>x!==i);else{if(S.fastDays.length>=2){toast('Max 2 lågdagar – avmarkera en först');return;}S.fastDays.push(i);}save();renderKost();refresh();}
function flipAdf(){S.adfOff=((S.adfOff||0)+1)%2;save();renderKost();refresh();}
function fmtH(h){h=((h%24)+24)%24;const hh=Math.floor(h),mm=Math.round((h-hh)*60);return String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');}
function fastState(){
  const f=FAST[S.fast]||FAST.none;const now=new Date();const h=now.getHours()+now.getMinutes()/60;
  if(f.type==='none')return{txt:'Ingen fasta',sub:'Ät när det passar dig'};
  if(f.type!=='tre'){const low=isLowDay();return{txt:low?'Lågdag idag':'Vanlig dag',sub:low?'Ca 25 % av ditt behov':'Ät enligt dagens mål'};}
  const s=S.winStart??12,e=s+f.win;
  const inWin=(h>=s&&h<e)||(e>24&&h<e-24);
  let left;
  if(inWin)left=(e-h+24)%24;else left=(s-h+24)%24;
  const lt=Math.floor(left)+' h '+Math.round((left%1)*60)+' min';
  return inWin?{txt:'Ätfönstret är öppet',sub:'Stänger om '+lt+' ('+fmtH(e)+')',open:true}:{txt:'Du fastar',sub:'Fönstret öppnar om '+lt+' ('+fmtH(s)+')',open:false};
}
function setTrainDay(v){S.trainingDay=v;save();renderKost();}
function setGoal(el){S.goal=el.dataset.v;save();renderKost();refresh();}
function setRate(el){S.rate=el.dataset.v;save();renderKost();}
function setExp(el){S.exp=el.dataset.v;save();renderKost();}
function setBfMode(el){S.bfMode=el.dataset.v;save();renderKost();}
function bodyIn(){
  const n=id=>{const v=+document.getElementById(id).value;return v||null;};
  if(n('kBw'))S.bw=n('kBw');if(n('kH'))S.height=n('kH');
  S.bf=n('bfIn');S.waist=n('tWaist');S.neck=n('tNeck');S.hip=n('tHip');save();renderKost();
}
function renderBody(){
  const m=macros(),ep=m.ep,bc=m.bc;
  bBf.textContent=bc.bf!=null?bc.bf+' %':'—';bFfm.textContent=bc.ffm?bc.ffm+' kg':'—';bTdee.textContent=ep.tdee.toLocaleString('sv-SE');
  const rows=[];
  rows.push(['Mål',GOAL_TXT[S.goal]||S.goal]);
  rows.push(['Fettprocent',bc.bf!=null?`${bc.bf} % · ${bc.catTxt}${bc.src==='tape'?' (måttband ±3–4)':''}`:`okänd · BMI ${bc.bmi} används som grov ledning`]);
  rows.push(['Vilometabolism',`${ep.bmr} kcal ${srcTag([ep.bmrSrc])}`]);
  rows.push(['Underhåll (inkl. aktivitet)',`${ep.tdee} kcal`]);
  rows.push([ep.delta<0?'Underskott':'Överskott',`${ep.delta>0?'+':''}${ep.delta} kcal/dag`]);
  if(ep.ratePct)rows.push(['Takt',`−${ep.ratePct} %/vecka ≈ ${(ep.ratePct/100*S.bw).toFixed(2)} kg ${srcTag(['helms_prep','garthe'])}`]);
  if(ep.gainRange)rows.push(['Förväntad ökning',`${ep.gainRange[0]}–${ep.gainRange[1]} %/månad ${srcTag(['iraki'])}`]);
  rows.push(['Protein',`${m.protein} g ${srcTag(bc.ffm&&ep.delta<0?['helms']:['morton'])}`]);
  // tidslinje
  let tl='';
  if(S.goalW){
    const diff=S.goalW-S.bw;
    if(S.goal==='fat_loss'&&diff<0&&ep.ratePct){const wk=Math.ceil(-diff/(ep.ratePct/100*S.bw));tl=`Till ${S.goalW} kg: ca <b>${wk} veckor</b> (${new Date(Date.now()+wk*7*864e5).toLocaleDateString('sv-SE')}). Planera en vecka på underhåll var 8–12:e vecka.`;
      if(bc.ffm){const tbf=Math.max(3,(1-(bc.ffm)/S.goalW)*100);tl+=` Vid ${S.goalW} kg ≈ ${tbf.toFixed(0)} % fett om du behåller musklerna.`;}}
    else if(S.goal==='hypertrophy'&&diff>0&&ep.gainRange){const mid=(ep.gainRange[0]+ep.gainRange[1])/2/100*S.bw;const mo=Math.ceil(diff/mid);tl=`Till ${S.goalW} kg: ca <b>${mo} månader</b> i lugn takt.`;}
    else tl='Målvikten passar inte riktigt ihop med målet du valt – kolla båda.';
  }
  planOut.innerHTML=rows.map(r=>`<div class="plan-row"><span class="muted">${r[0]}</span><span>${r[1]}</span></div>`).join('')+(tl?`<div class="coach" style="margin-top:8px">${tl}</div>`:'')+
    ep.notes.map(n=>`<div class="coach" style="margin-top:8px"><strong>Obs:</strong> ${n} ${srcTag(ep.srcs)}</div>`).join('');
}
function renderKost(){
  const m=macros(),coach=nutritionCoach(m),f=m.f;
  tdChip.classList.toggle('on',S.trainingDay);rdChip.classList.toggle('on',!S.trainingDay);
  kcal.textContent=m.cal.toLocaleString('sv-SE');
  pg.textContent=m.protein+' g';cg.textContent=m.carbs+' g';fg.textContent=m.fat+' g';
  fibG.textContent=m.fiber+' g';protMeal.textContent=m.proteinPerMeal+' g × '+m.mealsN;
  nReason.textContent=`${GOAL_TXT[S.goal]} · ${S.trainingDay?'träningsdag':'vilodag'} · fasta ${f.label}${m.low?' (lågdag)':''}`;
  const tot=m.protein*4+m.carbs*4+m.fat*9;
  pb.style.width=(m.protein*4/tot*100)+'%';cb.style.width=(m.carbs*4/tot*100)+'%';fb.style.width=(m.fat*9/tot*100)+'%';
  coachKost.innerHTML=`<strong>Kostcoach:</strong> ${coach.tips[0].t} ${srcTag(coach.tips[0].s)}`;
  renderMeals();
  renderDagbok(m);
  if(!foodQ.value)renderFoodRecent();
  // Fasta
  const st=fastState();
  fastStatus.innerHTML=`<div class="row between"><div><div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.5px">Just nu</div><div style="font-size:18px;font-weight:700;margin-top:2px;color:${st.open===false?'var(--a)':'var(--p)'}">${st.txt}</div><div class="muted">${st.sub}</div></div><div class="badge ok">${f.label}</div></div>`;
  fastGrid.innerHTML=Object.entries(FAST).map(([k,x])=>`<div class="fo ${S.fast===k?'on':''}" onclick="setFast('${k}')"><b>${x.label}</b><span>${x.sub}</span></div>`).join('');
  fastInfo.innerHTML=`<div><span class="ev ${f.ev}">Evidens ${f.ev}</span><span class="muted" style="font-size:11.5px">${EV_TXT[f.ev]}</span></div><p style="font-size:13px;line-height:1.5;color:var(--t2);margin-top:6px">${f.text} ${srcTag(f.src)}</p>`;
  winCard.style.display=f.type==='tre'?'block':'none';
  if(f.type==='tre'){
    if(!winStart.options.length){for(let h=5;h<=22;h++){winStart.add(new Option(fmtH(h),h));}for(let h=5;h<=22;h++){trainHour.add(new Option(fmtH(h),h));}}
    winStart.value=S.winStart??12;trainHour.value=S.trainHour??17;
    const s=S.winStart??12,e=s+f.win,now=new Date(),nh=now.getHours()+now.getMinutes()/60,th=S.trainHour??17;
    const seg=(a,b)=>`<div class="eat" style="left:${a/24*100}%;width:${(b-a)/24*100}%"></div>`;
    winBar.innerHTML=(e<=24?seg(s,e):seg(s,24)+seg(0,e-24))+`<div class="trn" style="left:${(th+0.5)/24*100}%">${ic('dumbbell')}</div><div class="now" style="left:${nh/24*100}%"></div>`+
      [0,6,12,18,24].map(x=>`<div class="lbl" style="left:${x/24*100}%">${x}</div>`).join('');
  }
  daysCard.style.display=f.type==='days'||f.type==='adf'?'block':'none';
  if(f.type==='days'){daysTitle.textContent='Välj 2 lågdagar';fastDayChips.innerHTML=DAYN.map((d,i)=>`<div class="chip ${(S.fastDays||[]).includes(i)?'on':''}" onclick="toggleFastDay(${i})">${d}</div>`).join('');
    const rest=rotation().map(r=>r.d);const clash=(S.fastDays||[]).filter(i=>rest.includes(DAYN[i]));
    daysNote.textContent=clash.length?'⚠ '+clash.map(i=>DAYN[i]).join(', ')+' är träningsdag i ditt schema – välj hellre vilodagar.':'Bra – lågdagarna ligger på vilodagar. Inte två lågdagar i rad.';}
  if(f.type==='adf'){daysTitle.textContent='Varannandagsfasta';fastDayChips.innerHTML=`<div class="chip on">${isLowDay()?'Idag: lågdag':'Idag: vanlig dag'}</div><div class="chip" onclick="flipAdf()">Byt dag</div>`;daysNote.textContent='Lågdagar ca 25 % av ditt energibehov. Lägg tunga pass på vanliga dagar.';}
  document.querySelectorAll('#fastedChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===(S.fastedTrain||'no')));
  fastedNote.innerHTML={no:'Ät ett mål 1–3 timmar före passet. Bäst för tunga och långa pass.',
    morning:`Det finns få studier på styrketräning direkt efter nattens fasta. Det som är väl belagt är att dagens totala energi och protein betyder mest – ät 20–40 g protein inom några timmar efter passet. Märker du sämre prestation, ät något litet före. ${srcTag(['kerksick'])}`,
    late:`Efter 14+ timmar utan mat kan prestationen sjunka vid tunga pass. Flytta hellre ätfönstret så att passet hamnar i början av det. ${srcTag(['kerksick'])}`}[S.fastedTrain||'no'];
  // Kropp & mål
  document.querySelectorAll('#goalChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===S.goal));
  document.querySelectorAll('#rateChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===(S.rate||'std')));
  document.querySelectorAll('#expChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===(S.exp||'beginner')));
  document.querySelectorAll('#bfModeChips .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===(S.bfMode||'none')));
  bfKnown.style.display=S.bfMode==='known'?'block':'none';bfTape.style.display=S.bfMode==='tape'?'block':'none';
  hipWrap.style.display=S.sex==='f'?'block':'none';
  tapeHow.textContent='Mät på morgonen. Midja: '+(S.sex==='f'?'smalaste stället':'i höjd med naveln')+'. Hals: under struphuvudet.'+(S.sex==='f'?' Höft: bredaste stället.':'')+' ';
  const sv=(id,v)=>{const el=document.getElementById(id);if(document.activeElement!==el)el.value=v??'';};
  sv('kBw',S.bw);sv('kH',S.height);sv('bfIn',S.bf);sv('tWaist',S.waist);sv('tNeck',S.neck);sv('tHip',S.hip);sv('goalW',S.goalW);
  renderBody();
  // Råd
  nAdvice.innerHTML=coach.tips.map(t=>`<div class="tip">${t.t} ${srcTag(t.s)}</div>`).join('');
  periBox.innerHTML=`<div class="coach">${coach.peri}</div>`+coach.supplements.map(s=>`<div class="tip">• ${s[0]} ${srcTag(s[1])}</div>`).join('');
  shopList.innerHTML=shopItems().map(x=>'• '+x).join('<br>')+((S.prof||{}).diet==='vegan'?`<p class="fh" style="margin-top:8px">Vegan: tänk på B12 och kombinera proteinkällor (baljväxter + spannmål) för att nå proteinmålet.</p>`:'');
  fastLearn.innerHTML=artLinks('fasta',6);radLearn.innerHTML=`<div class="mlist">${['kost-protein','kost-takt','kost-kolhydrat','till-kreatin','till-d','myter'].map(id=>artCard(ARTS.find(a=>a.id===id))).join('')}</div>`;
  nutWhy.innerHTML=`<div class="tip">Underhållsbehov = vilometabolism × aktivitetsnivå (${S.act||1.55}). ${srcTag([m.ep.bmrSrc])}</div>
    <div class="tip">Mål-kalorier = underhåll ${m.ep.delta>=0?'+':''}${m.ep.delta} (mål) ${m.dayMod>=0?'+':''}${m.dayMod} (dagens träning)${m.low?' → lågdag 25 %':''}.</div>
    <div class="tip">Fett minst ${String(m.fatKg).replace('.',',')} g/kg och 20–35 % av energin; resten blir kolhydrater (${(m.carbs/S.bw).toFixed(1)} g/kg).</div>
    <div class="tip">Fibrer ≈ 14 g per 1000 kcal, minst 25 g. ${srcTag(['nnr'])}</div>`;
}
