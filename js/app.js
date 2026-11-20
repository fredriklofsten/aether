/* Aether – Startar appen */
S=migrate(load());
applyTheme();paintIcons();backBtn.innerHTML=ic('back');renderAvatar();applyHomeLayout();
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(S.ui.theme==='auto')applyTheme();});}catch(e){}
try{evLegend.innerHTML=Object.entries(EV_TXT).map(([k,v])=>`<span class="ev ${k}">${k}</span> ${v}`).join('<br>');}catch(e){}
/* Har man redan gjort startguiden går appen direkt till Idag */
if(S.onboarded&&load()){splash.classList.remove('active');main.classList.add('active');tab('today');}
