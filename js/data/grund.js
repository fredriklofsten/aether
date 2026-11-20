/* Aether – Grunddata: block, faser, övningar, mallar, måltider, muskelkarta */
const BLOCKS=[{phase:'accumulation',weeks:5,rpe:[6.5,8]},{phase:'transmutation',weeks:4,rpe:[7.5,8.5]},{phase:'realization',weeks:2,rpe:[8,9.5]},{phase:'deload',weeks:1,rpe:[5,7]}];
const PDESC={accumulation:'Fler set med måttlig vikt – bygger muskler och arbetskapacitet.',transmutation:'Färre set, tyngre vikter – omvandlar muskler till styrka.',realization:'Tungt och lite – du blir som starkast.',deload:'Lätt vecka – kroppen hinner återhämta sig och bli starkare.'};
const PHASE_SV={accumulation:'Uppbyggnad',transmutation:'Styrka',realization:'Topp',deload:'Återhämtning'};
const PHASE_COACH={accumulation:'Samla kvalitetsssets. Teknik före maxvikter.',transmutation:'Färre set, tyngre last. Vila mellan tunga set.',realization:'Kom fräsch. Undvik onödig volym.',deload:'Medvetet lätt – absorption, inte PR.'};
const SEASON={
  normal:{label:'Normal',vol:1,cal:0,note:'Balanserad progression.'},
  cut:{label:'Deff',vol:0.9,cal:-350,note:'Något lägre volym, högt protein, prioritera recovery.'},
  bulk:{label:'Bulk',vol:1.08,cal:350,note:'Mer utrymme för volym och surplus.'},
  vacation:{label:'Semester',vol:0.7,cal:0,note:'Underhåll. Korta pass, behåll vanan.'},
  competition:{label:'Tävling',vol:0.75,cal:0,note:'Specificitet och fräschhet före träningsvolym.'}
};
const VOLUME_LANDMARKS={Quadriceps:[8,16,22],Glutes:[6,14,20],Hamstrings:[6,12,18],Chest:[8,14,20],'Upper Back':[8,16,22],Lats:[8,14,20],Shoulders:[6,12,18],Triceps:[4,10,16],Biceps:[4,10,16],Calves:[6,14,20]};
const EX={
  back_squat:{name:'Back Squat',m:['Quadriceps','Glutes'],sec:['Core'],cue:'Bröst upp, djup till parallellt, pressa genom foten.',coach:'Bålspänning hela vägen.',priority:1},
  front_squat:{name:'Front Squat',m:['Quadriceps','Core'],sec:['Glutes'],cue:'Armbågar högt, bål spänd.',coach:'Mer framsida lår och core.',priority:2},
  rdl:{name:'Romanian Deadlift',m:['Hamstrings','Glutes'],sec:['Lower Back'],cue:'Höft bak, stång nära, neutral rygg.',coach:'Stoppa innan ryggen rundas.',priority:1},
  hip_thrust:{name:'Hip Thrust',m:['Glutes'],sec:['Hamstrings'],cue:'Full extension, kläm glutes.',coach:'Pausa i toppen.',priority:2},
  deadlift:{name:'Deadlift',m:['Hamstrings','Back'],sec:['Glutes'],cue:'Stång över mittfot, pressa golvet.',coach:'Teknik före ego.',priority:1},
  bench_press:{name:'Bench Press',m:['Chest'],sec:['Triceps'],cue:'Skulderblad ihop, stång till nedre bröst.',coach:'Kontrollera nerstället.',priority:1},
  incline_bench:{name:'Incline Bench',m:['Chest'],sec:['Triceps'],cue:'30–45° lutning.',coach:'Övre bröst-fokus.',priority:2},
  barbell_row:{name:'Barbell Row',m:['Upper Back','Lats'],sec:['Biceps'],cue:'Hinge, dra till nedre bröst.',coach:'Dra med armbågarna.',priority:1},
  cable_row:{name:'Cable Row',m:['Upper Back','Lats'],sec:['Biceps'],cue:'Dra mot magen, kläm skulderblad.',coach:'Stabil bål.',priority:2},
  ohp:{name:'Overhead Press',m:['Shoulders'],sec:['Triceps'],cue:'Press rakt upp, bål spänd.',coach:'Undvik svank.',priority:1},
  db_ohp:{name:'DB Shoulder Press',m:['Shoulders'],sec:['Triceps'],cue:'Från axelhöjd upp.',coach:'Bra om stång känns fel.',priority:2},
  pullup:{name:'Pull-up',m:['Lats'],sec:['Biceps'],cue:'Full häng, armbågar mot höft.',coach:'Band om behövs.',priority:1},
  lat_pulldown:{name:'Lat Pulldown',m:['Lats'],sec:['Biceps'],cue:'Dra till övre bröst.',coach:'Tänk armbågar i fickorna.',priority:2},
  walking_lunge:{name:'Walking Lunge',m:['Quadriceps','Glutes'],sec:['Hamstrings'],cue:'Långt steg, 90°.',coach:'Längre steg = mer glute.',priority:2},
  leg_curl:{name:'Leg Curl',m:['Hamstrings'],sec:[],cue:'Kontrollerad, full kontraktion.',coach:'Fyll på hamstring-volym.',priority:3},
  calf_raise:{name:'Calf Raise',m:['Calves'],sec:[],cue:'Full stretch, paus i topp.',coach:'Högre reps fungerar ofta.',priority:3},
  face_pull:{name:'Face Pull',m:['Rear Delts','Upper Back'],sec:[],cue:'Dra mot ansikte, armbågar högt.',coach:'Axelhälsa.',priority:3},
  tricep_pushdown:{name:'Tricep Pushdown',m:['Triceps'],sec:[],cue:'Armbågar stilla.',coach:'Isolera triceps.',priority:3},
  barbell_curl:{name:'Barbell Curl',m:['Biceps'],sec:[],cue:'Kontrollerad curl.',coach:'Långsam excentrisk.',priority:3},
  db_bench:{name:'DB Bench Press',m:['Chest'],sec:['Triceps'],cue:'Hantlar, fri handledsvinkel.',coach:'Snällare mot axlarna än stång.',priority:1},
  landmine_press:{name:'Landmine Press',m:['Shoulders','Chest'],sec:['Triceps'],cue:'Pressa snett uppåt, bål spänd.',coach:'Axelvänligt alternativ till press över huvudet.',priority:1},
  chest_supported_row:{name:'Chest-Supported Row',m:['Upper Back','Lats'],sec:['Biceps'],cue:'Bröst mot bänk, dra armbågar bakåt.',coach:'Avlastar ländryggen helt.',priority:1},
  leg_press:{name:'Leg Press',m:['Quadriceps','Glutes'],sec:[],cue:'Fötter mitt på plattan, kontrollerat djup.',coach:'Stabilt och ryggvänligt.',priority:1},
  box_squat:{name:'Box Squat',m:['Quadriceps','Glutes'],sec:['Core'],cue:'Sitt bakåt till lådan, pressa upp.',coach:'Lådan styr djupet – snällare mot knät.',priority:1},
  hammer_curl:{name:'Hammer Curl',m:['Biceps'],sec:[],cue:'Neutralt grepp, armbågar stilla.',coach:'Mindre påfrestning på armbågen.',priority:3},
  back_extension:{name:'Back Extension',m:['Glutes','Hamstrings'],sec:['Lower Back'],cue:'Böj i höften, inte i ryggen.',coach:'Lätt och kontrollerat.',priority:2}
};
const TEMPLATES={
  lower_heavy:[{id:'back_squat',sets:4,reps:[4,6],rpe:8},{id:'rdl',sets:3,reps:[6,8],rpe:7.5},{id:'walking_lunge',sets:3,reps:[8,10],rpe:7.5},{id:'leg_curl',sets:3,reps:[10,12],rpe:7.5},{id:'calf_raise',sets:3,reps:[12,15],rpe:7.5}],
  upper_heavy:[{id:'bench_press',sets:4,reps:[4,6],rpe:8},{id:'barbell_row',sets:4,reps:[6,8],rpe:7.5},{id:'ohp',sets:3,reps:[6,8],rpe:7.5},{id:'pullup',sets:3,reps:[6,10],rpe:7.5},{id:'face_pull',sets:3,reps:[12,15],rpe:7}],
  lower_volume:[{id:'front_squat',sets:4,reps:[8,10],rpe:7.5},{id:'hip_thrust',sets:3,reps:[8,12],rpe:7.5},{id:'walking_lunge',sets:3,reps:[10,12],rpe:7},{id:'leg_curl',sets:3,reps:[12,15],rpe:7.5},{id:'calf_raise',sets:4,reps:[12,15],rpe:7.5}],
  upper_volume:[{id:'incline_bench',sets:4,reps:[8,10],rpe:7.5},{id:'cable_row',sets:4,reps:[8,12],rpe:7.5},{id:'db_ohp',sets:3,reps:[8,12],rpe:7},{id:'lat_pulldown',sets:3,reps:[8,12],rpe:7.5},{id:'face_pull',sets:3,reps:[12,15],rpe:7}],
  full_a:[{id:'back_squat',sets:3,reps:[5,8],rpe:7.5},{id:'bench_press',sets:3,reps:[5,8],rpe:7.5},{id:'barbell_row',sets:3,reps:[6,10],rpe:7.5},{id:'rdl',sets:2,reps:[8,10],rpe:7.5},{id:'ohp',sets:2,reps:[8,10],rpe:7}],
  full_b:[{id:'deadlift',sets:3,reps:[4,6],rpe:8},{id:'pullup',sets:3,reps:[6,10],rpe:7.5},{id:'incline_bench',sets:3,reps:[8,10],rpe:7.5},{id:'walking_lunge',sets:2,reps:[8,10],rpe:7.5},{id:'face_pull',sets:3,reps:[12,15],rpe:7}],
  ppl_push:[{id:'bench_press',sets:4,reps:[5,8],rpe:8},{id:'ohp',sets:3,reps:[6,10],rpe:7.5},{id:'incline_bench',sets:3,reps:[8,12],rpe:7.5},{id:'tricep_pushdown',sets:3,reps:[10,15],rpe:7.5}],
  ppl_pull:[{id:'pullup',sets:4,reps:[5,10],rpe:8},{id:'barbell_row',sets:4,reps:[6,10],rpe:7.5},{id:'face_pull',sets:3,reps:[12,15],rpe:7},{id:'barbell_curl',sets:3,reps:[8,12],rpe:7.5}],
  ppl_legs:[{id:'back_squat',sets:4,reps:[5,8],rpe:8},{id:'rdl',sets:3,reps:[6,10],rpe:7.5},{id:'walking_lunge',sets:3,reps:[8,12],rpe:7.5},{id:'leg_curl',sets:3,reps:[10,15],rpe:7.5},{id:'calf_raise',sets:3,reps:[12,15],rpe:7.5}]
};
const SCHEMAS={
  ul:[{d:'Mån',k:'lower_heavy',n:'Lower Heavy'},{d:'Tis',k:'upper_heavy',n:'Upper Heavy'},{d:'Tor',k:'lower_volume',n:'Lower Volume'},{d:'Fre',k:'upper_volume',n:'Upper Volume'}],
  ppl:[{d:'Mån',k:'ppl_push',n:'Push'},{d:'Tis',k:'ppl_pull',n:'Pull'},{d:'Ons',k:'ppl_legs',n:'Legs'},{d:'Fre',k:'ppl_push',n:'Push'},{d:'Lör',k:'ppl_pull',n:'Pull'}],
  fb:[{d:'Mån',k:'full_a',n:'Full A'},{d:'Ons',k:'full_b',n:'Full B'},{d:'Fre',k:'full_a',n:'Full A'}]
};
const MEALS=[
  {d:'Havre + ägg + bär + yoghurt',k:550,p:35,c:55,f:18,when:'frukost',t:['e','d']},
  {d:'Kyckling + ris + broccoli',k:650,p:45,c:65,f:12,when:'lunch',t:['m']},
  {d:'Lax + potatis + sallad',k:620,p:40,c:45,f:22,when:'middag',t:['f']},
  {d:'Grekisk yoghurt + nötter + honung',k:400,p:28,c:30,f:16,when:'mellanmål',t:['d']},
  {d:'Whey + banan + havre',k:380,p:32,c:45,f:6,when:'peri',t:['d']},
  {d:'Köttfärs + pasta + grönsaker',k:700,p:40,c:70,f:20,when:'middag',t:['m']},
  {d:'Tofu/bönor + ris + grönt',k:580,p:28,c:70,f:14,when:'lunch',t:[]},
  {d:'Kvarg + havre + äpple + kanel',k:420,p:34,c:52,f:6,when:'frukost',t:['d']},
  {d:'Linsgryta + quinoa + spenat',k:560,p:30,c:78,f:12,when:'middag',t:[]},
  {d:'Sojayoghurt + müsli + pumpafrön',k:430,p:24,c:48,f:15,when:'mellanmål',t:[]},
  {d:'Tempeh + nudlar + wokgrönsaker',k:620,p:36,c:66,f:20,when:'middag',t:[]},
  {d:'Ärtproteinshake + banan',k:300,p:28,c:35,f:4,when:'peri',t:[]},
  {d:'Torsk + bulgur + ugnsrotsaker',k:560,p:42,c:62,f:10,when:'middag',t:['f']},
  {d:'Omelett (3 ägg) + keso + grönt',k:430,p:38,c:8,f:26,when:'frukost',t:['e','d']}
];
const MUSCLE_MAP={'Quadriceps':'quads','Glutes':'glutes','Hamstrings':'hams','Chest':'chest','Upper Back':'upperback','Lats':'lats','Shoulders':'shoulders','Rear Delts':'reardelt','Triceps':'triceps','Biceps':'biceps','Core':'core','Calves':'calves','Lower Back':'lowerback','Back':'upperback'};


const EX_IMG={back_squat:'images/back_squat.jpg',rdl:'images/rdl.jpg',bench_press:'images/bench_press.jpg',pullup:'images/pullup.jpg',ohp:'images/ohp.jpg',incline_bench:'images/bench_press.jpg',deadlift:'images/rdl.jpg',front_squat:'images/back_squat.jpg',db_ohp:'images/ohp.jpg'};
const EX_STEPS={
  back_squat:['Stång på övre trapezius, fötter ca axelbrett','Andas in, böj höft och knä till minst parallellt','Knän följer tårna, bröst upp','Pressa genom hela foten tillbaka upp'],
  front_squat:['Stång på framsida axlar, armbågar högt','Håll bålen hård, sjunk djupt','Pressa upp utan att tappa armbågarna'],
  rdl:['Lätt böj i knäna, stång mot låren','Skjut höften bakåt, rygg neutral','Känn stretch i hamstrings','Återgå genom att sträcka höften'],
  deadlift:['Stång över mittfot, grepp utanför ben','Spänn rygg och bål innan lyftet','Pressa golvet, stång nära kroppen','Lås höft och knä i toppen'],
  hip_thrust:['Skulderblad mot bänk, stång över höft','Fötter i golvet, knä ca 90° i topp','Pressa höften till full extension','Pausa och sänk kontrollerat'],
  bench_press:['Skulderblad ihop, fötter i golvet','Sänk stången till nedre bröst','Armbågar ca 45–70° från kroppen','Pressa upp stabilt till raka armar'],
  incline_bench:['Bänk 30–45°, stabil bas','Sänk till övre bröst','Pressa upp utan att tappa spänning i axlar'],
  barbell_row:['Hinge framåt, rygg plan','Dra stång till nedre bröst/övre mage','Kläm skulderblad, sänk kontrollerat'],
  cable_row:['Rak rygg, lätt böjda knän','Dra handtag mot magen','Kläm ihop skulderbladen'],
  ohp:['Stång i axelhöjd, grepp utanför axlar','Spänn glutes och bål','Pressa rakt upp, huvudet fram när stång passerar','Lås ut och sänk kontrollerat'],
  db_ohp:['Hantlar i axelhöjd','Pressa upp utan överdriven svank','Sänk långsamt till start'],
  pullup:['Full häng, grepp något bredare än axlar','Dra armbågar mot höfterna','Haka över stången','Sänk till full häng'],
  lat_pulldown:['Dra stång till övre bröst','Tänk armbågar i fickorna','Kontrollera återgången'],
  walking_lunge:['Kliv långt fram, sänk bakre knä','Främre knä stabilt över fot','Tryck genom främre häl och kliv vidare'],
  leg_curl:['Anklar under dynan, höft stabil','Böj knä fullt, kläm hamstrings','Sänk långsamt'],
  calf_raise:['Full stretch i botten','Pressa upp på tå, paus i topp','Sänk kontrollerat'],
  face_pull:['Drag mot ansiktet, armbågar högt','Rotera lätt utåt i slutläget','Kontrollera tillbaka'],
  tricep_pushdown:['Armbågar intill kroppen','Sträck ut armbågarna fullt','Undvik att gunga bålen'],
  barbell_curl:['Armbågar stilla vid sidorna','Curl upp utan gungning','Sänk långsamt (excentrisk)'],
  db_bench:['Ligg med hantlar i bröstnivå, skulderblad ihop','Pressa upp och lätt inåt','Sänk kontrollerat till stretch i bröstet'],
  landmine_press:['Stångänden i axelhöjd, stå i lätt utfallsställning','Pressa snett uppåt-framåt','Sänk kontrollerat tillbaka till axeln'],
  chest_supported_row:['Ligg med bröstet mot lutande bänk','Dra hantlarna mot höften','Kläm skulderbladen, sänk långsamt'],
  leg_press:['Rygg och bäcken mot dynan','Sänk tills knän ca 90° utan att bäckenet lyfter','Pressa genom hela foten'],
  box_squat:['Låda bakom dig i lagom höjd','Sitt bakåt kontrollerat, rör lådan lätt','Pressa upp genom foten'],
  hammer_curl:['Neutralt grepp (tummar upp)','Curl utan att gunga','Sänk långsamt'],
  back_extension:['Höften vid dynans kant','Sänk överkroppen genom att böja i höften','Res dig med glutes till rak linje – inte längre']
};
const SESSION_NAMES={lower_heavy:'Underkropp tung',upper_heavy:'Överkropp tung',lower_volume:'Underkropp volym',upper_volume:'Överkropp volym',full_a:'Helkropp A',full_b:'Helkropp B',ppl_push:'Push',ppl_pull:'Pull',ppl_legs:'Ben'};
const ROTATIONS={ul:['lower_heavy','upper_heavy','lower_volume','upper_volume'],ppl:['ppl_push','ppl_pull','ppl_legs'],fb:['full_a','full_b']};
const DAYS={2:['Mån','Tor'],7:['Mån','Tis','Ons','Tor','Fre','Lör','Sön'],3:['Mån','Ons','Fre'],4:['Mån','Tis','Tor','Fre'],5:['Mån','Tis','Ons','Fre','Lör'],6:['Mån','Tis','Ons','Tor','Fre','Lör']};
// Begränsning → kandidater (första som inte redan finns i passet väljs)
const LIMIT_SWAPS={
  'axel':{ohp:['landmine_press'],db_ohp:['landmine_press'],bench_press:['db_bench'],incline_bench:['db_bench','landmine_press'],pullup:['lat_pulldown','cable_row']},
  'knä':{back_squat:['box_squat','hip_thrust'],front_squat:['box_squat','hip_thrust'],walking_lunge:['hip_thrust','back_extension'],box_squat:['hip_thrust']},
  'ländrygg':{back_squat:['leg_press'],front_squat:['leg_press'],box_squat:['leg_press'],deadlift:['hip_thrust','leg_press'],rdl:['back_extension','hip_thrust'],barbell_row:['chest_supported_row','cable_row'],ohp:['db_ohp']},
  'armbåge':{barbell_curl:['hammer_curl'],pullup:['lat_pulldown'],tricep_pushdown:['db_bench']}
};
const LIMIT_LABEL={'axel':'axel','knä':'knä','ländrygg':'ländrygg','armbåge':'armbåge'};
