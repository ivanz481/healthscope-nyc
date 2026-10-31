/*
 Healthscope NYC / Intro & daily wellness note.
 No external trackers, no new API calls and no client secrets.
 Sources: CDC and NIH/NIA; general educational information only.
*/
(()=>{
 "use strict";
 const intro=document.getElementById("hsIntro");
 const langScreen=document.getElementById("hsLanguageScreen");
 const loading=document.getElementById("hsLoading");
 const root=document.documentElement;
 if(!intro||!langScreen||!loading)return;
 const tips=[
  {
   source:"CDC", url:"https://www.cdc.gov/physical-activity-basics/adding-adults/",
   en:{title:"A little movement adds up.",text:"Even a short walk counts toward being active. For adults, 150 minutes of moderate activity each week is a useful goal."},
   es:{title:"Cada movimiento cuenta.",text:"Incluso una caminata breve cuenta. Para adultos, una meta recomendada es 150 minutos semanales de actividad moderada."},
   "zh-CN":{title:"每天动一动，积少成多。",text:"即使是短时间散步也有益健康。成年人可争取每周进行至少150分钟中等强度活动。"},
   "yue-Hant-HK":{title:"每日郁一郁，積少成多。",text:"就算只係行一陣路都算運動。成年人可以每星期以最少150分鐘中等強度活動為目標。"}
  },
  {
   source:"CDC", url:"https://www.cdc.gov/sleep/about/index.html",
   en:{title:"Make room for rest.",text:"Most adults need at least 7 hours of sleep. A consistent bedtime and wake-up time can help you rest better."},
   es:{title:"Dale espacio al descanso.",text:"La mayoría de los adultos necesita al menos 7 horas de sueño. Mantener horarios regulares puede mejorar el descanso."},
   "zh-CN":{title:"给睡眠留足时间。",text:"大多数成年人每晚需要至少7小时睡眠。规律的入睡和起床时间有助于改善睡眠。"},
   "yue-Hant-HK":{title:"畀自己足夠嘅休息時間。",text:"大部分成年人每晚需要最少7小時睡眠。固定瞓覺同起身時間有助改善睡眠。"}
  },
  {
   source:"CDC", url:"https://www.cdc.gov/clean-hands/about/",
   en:{title:"20 seconds makes a difference.",text:"Wash your hands with soap and water, scrubbing for at least 20 seconds, to help remove germs."},
   es:{title:"20 segundos importan.",text:"Lávate las manos con agua y jabón, frotando durante al menos 20 segundos para eliminar gérmenes."},
   "zh-CN":{title:"认真洗手20秒。",text:"用肥皂和清水洗手，并至少搓洗20秒，有助于清除手上的病菌。"},
   "yue-Hant-HK":{title:"認真洗手20秒。",text:"用梘液同清水洗手，最少搓洗20秒，有助清除手上嘅病菌。"}
  },
  {
   source:"CDC", url:"https://www.cdc.gov/high-blood-pressure/measure/",
   en:{title:"Know your blood pressure.",text:"High blood pressure often has no warning signs. Getting it measured is the way to know your numbers."},
   es:{title:"Conoce tu presión arterial.",text:"La presión alta a menudo no presenta síntomas. Medirla es la forma de conocer tus valores."},
   "zh-CN":{title:"了解自己的血压。",text:"高血压往往没有明显症状。定期测量血压，有助于了解自己的健康状况。"},
   "yue-Hant-HK":{title:"了解自己嘅血壓。",text:"高血壓好多時冇明顯徵兆。定期量度血壓，有助掌握自己嘅健康情況。"}
  },
  {
   source:"NIH · NIA", url:"https://www.nia.nih.gov/health/brain-health/cognitive-health-and-older-adults",
   en:{title:"Connection is part of well-being.",text:"Staying in touch with friends, family and neighbors helps reduce isolation and may support cognitive health as we age."},
   es:{title:"La conexión también es bienestar.",text:"Mantener contacto con amigos, familiares y vecinos ayuda a reducir el aislamiento y puede apoyar la salud cognitiva al envejecer."},
   "zh-CN":{title:"社交联系也关乎健康。",text:"与朋友、家人和邻居保持联系有助于减少孤独感，也可能有益于老年认知健康。"},
   "yue-Hant-HK":{title:"同人保持聯繫，都係健康一部分。",text:"同朋友、屋企人同街坊保持聯繫，有助減少孤獨感，亦可能對年長人士嘅認知健康有幫助。"}
  },
  {
   source:"CDC", url:"https://www.cdc.gov/physical-activity-basics/guidelines/adults.html",
   en:{title:"Strength belongs in your week.",text:"Activity guidance for adults includes muscle-strengthening exercises on at least two days each week."},
   es:{title:"Haz espacio para fortalecer músculos.",text:"Las recomendaciones para adultos incluyen ejercicios de fortalecimiento muscular al menos dos días por semana."},
   "zh-CN":{title:"每周也要练练力量。",text:"成年人运动指南建议每周至少两天进行肌肉力量训练。"},
   "yue-Hant-HK":{title:"每星期都要練下肌肉。",text:"成年人運動指引建議每星期最少兩日做肌肉強化運動。"}
  },
  {
   source:"CDC", url:"https://www.cdc.gov/sleep/about/index.html",
   en:{title:"A calmer evening can help.",text:"A quiet, cool bedroom and limiting screen use before bed can support better sleep habits."},
   es:{title:"Una noche más tranquila ayuda.",text:"Una habitación tranquila y fresca y menos pantallas antes de dormir favorecen buenos hábitos de sueño."},
   "zh-CN":{title:"睡前放松，从环境开始。",text:"保持卧室安静、凉爽，并在睡前减少电子屏幕使用，有助于培养良好睡眠习惯。"},
   "yue-Hant-HK":{title:"瞓覺之前，放鬆吓。",text:"保持睡房安靜同涼爽，瞓覺前少用電子屏幕，有助培養良好睡眠習慣。"}
  }
 ];
 const ui={
   en:{kicker:"HEALTH TIP OF THE DAY",link:"Official source ↗"},
   es:{kicker:"CONSEJO DE SALUD DEL DÍA",link:"Fuente oficial ↗"},
   "zh-CN":{kicker:"每日健康小贴士",link:"查看官方来源 ↗"},
   "yue-Hant-HK":{kicker:"每日健康小貼士",link:"查看官方資料 ↗"}
 };
 const langCodes={en:"en-US",es:"es-US","zh-CN":"zh-CN","yue-Hant-HK":"zh-HK"};
 function currentLanguage(){
  const v=typeof window.hsCurrentLanguage==="function"?window.hsCurrentLanguage():"en";
  return Object.hasOwn(ui,v)?v:"en";
 }
 function dayToken(){
  const d=new Date();
  return {year:d.getFullYear(),month:d.getMonth(),day:d.getDate(),date:d};
 }
 function chooseTip(){
  const day=dayToken();
  const epoch=Math.floor(Date.UTC(day.year,day.month,day.day)/86400000);
  return {tip:tips[((epoch%tips.length)+tips.length)%tips.length],date:day.date,key:epoch};
 }
 let lastKey="";
 function renderTips(locale,force=false){
  const l=ui[locale]?locale:"en";
  const {tip,date,key}=chooseTip();
  if(!force&&lastKey===l+":"+key)return;
  lastKey=l+":"+key;
  const localized=tip[l]||tip.en;
  const stamp=new Intl.DateTimeFormat(langCodes[l],{month:"short",day:"numeric"}).format(date);
  document.querySelectorAll("[data-hx-tip-kicker]").forEach(el=>{el.textContent=ui[l].kicker});
  document.querySelectorAll("[data-hx-tip-date]").forEach(el=>{el.textContent=stamp});
  document.querySelectorAll("[data-hx-tip-title]").forEach(el=>{el.textContent=localized.title});
  document.querySelectorAll("[data-hx-tip-desc]").forEach(el=>{el.textContent=localized.text});
  document.querySelectorAll("[data-hx-tip-link]").forEach(el=>{
   el.textContent=ui[l].link+" "+tip.source;
   el.href=tip.url;
   el.setAttribute("aria-label",ui[l].link.replace("↗","").trim()+" — "+tip.source);
  });
 }
 const choices=langScreen.querySelectorAll("[data-hs-language]");
 function highlightChoice(lang){
  choices.forEach(el=>el.classList.toggle("hx-preferred",el.dataset.hsLanguage===lang));
 }
 // Exact final logo asset is split into moving fragments to make the letter
 // strokes coalesce into the selected HS design, not a replacement mock logo.
 function assembleLogo(){
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const tile=loading.querySelector(".hs-mark-glass");
  const final=tile&&tile.querySelector("img.hs-mark-art");
  if(!tile||!final||!final.src)return;
  const ns="http://www.w3.org/2000/svg";
  const wire=document.createElementNS(ns,"svg");
  wire.setAttribute("viewBox","0 0 112 112");
  wire.setAttribute("class","hx-wire");
  wire.setAttribute("aria-hidden","true");
  const paths=[
   {d:"M28 24 L28 84",delay:".06s",x:"-40px",y:"-32px",a:"-12deg"},
   {d:"M52 21 L52 83",delay:".18s",x:"27px",y:"-31px",a:"13deg"},
   {d:"M28 51 L52 51",delay:".34s",x:"-24px",y:"24px",a:"-6deg",c:"hx-hb"},
   {d:"M86 30 C76 20 61 25 62 39 C63 51 87 48 86 66 C85 82 64 85 60 74",delay:".4s",x:"37px",y:"16px",a:"12deg",c:"hx-shape"},
   {d:"M23 22 Q61 3 94 27",delay:".47s",x:"-6px",y:"-24px",a:"-9deg",c:"hx-satellite"}
  ];
  for(const p of paths){
   const path=document.createElementNS(ns,"path");
   path.setAttribute("d",p.d);
   if(p.c)path.setAttribute("class",p.c);
   path.style.setProperty("--hx-delay",p.delay);
   path.style.setProperty("--hx-x",p.x);
   path.style.setProperty("--hx-y",p.y);
   path.style.setProperty("--hx-angle",p.a);
   wire.appendChild(path);
  }
  tile.insertBefore(wire,final);
  const destinations=[
   ["-55px","-39px","-15deg",".31s","inset(0 50% 50% 0)"],
   ["49px","-45px","14deg",".39s","inset(0 0 50% 50%)"],
   ["-48px","46px","12deg",".46s","inset(50% 50% 0 0)"],
   ["58px","42px","-12deg",".54s","inset(50% 0 0 50%)"]
  ];
  for(const [x,y,a,delay,clip] of destinations){
   const piece=document.createElement("img");
   piece.src=final.src;piece.alt="";piece.setAttribute("aria-hidden","true");
   piece.decoding="async";piece.className="hx-piece";
   piece.style.setProperty("--hx-x",x);
   piece.style.setProperty("--hx-y",y);
   piece.style.setProperty("--hx-angle",a);
   piece.style.setProperty("--hx-delay",delay);
   piece.style.clipPath=clip;
   tile.insertBefore(piece,final);
  }
  const ring=document.createElement("span");
  ring.className="hx-completion-ring";
  ring.setAttribute("aria-hidden","true");
  tile.insertBefore(ring,final);
  loading.classList.add("hx-enhanced");
 }
 renderTips(currentLanguage(),true);
 highlightChoice(currentLanguage());
 const originalChangeLanguage=window.hsChangeLanguage;
 if(typeof originalChangeLanguage==="function"){
  window.hsChangeLanguage=function(lang){
    const result=originalChangeLanguage(lang);
    renderTips(currentLanguage(),true);
    highlightChoice(currentLanguage());
    return result;
  };
 }
 assembleLogo();
 // Keep an already-open dashboard's note accurate after a calendar-day change.
 const refresh=setInterval(()=>renderTips(currentLanguage()),60000);
 window.addEventListener("pagehide",()=>clearInterval(refresh),{once:true});
})();
