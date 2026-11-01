/*
 Healthscope NYC Field Notes — accessible editorial copy.
 The visitor-facing headlines are translated independently of the site's
 original dictionary so all existing 4-language reporting stays intact.
*/
(()=>{
 "use strict";
 const dictionaries={
  en:{
   edition:"FIELD NOTES / PUBLIC HEALTH",
   headlineA:"A closer look at",
   headlineB:"the city we share.",
   intro:"Five boroughs, countless stories. Explore the patterns behind New York City’s health, with published data, clear context, and a way back to every source.",
   statKicker:"BOROUGH INDEX",
   statCaption:"New York City's five boroughs. One connected picture of public health.",
   noteA:"OFFICIAL DATA",
   noteB:"PUBLIC CONTEXT",
   noteC:"OPEN TO EVERYONE",
   footerBrand:"HEALTHSCOPE NYC  /  A CITY HEALTH ATLAS",
   footerNote:"Built to make public-health information easier to explore. Data retains its original publication dates and sources. Not medical advice.",
   footerStamp:"NEW YORK CITY  /  FIELD NOTES"
  },
  es:{
   edition:"NOTAS DE CAMPO / SALUD PÚBLICA",
   headlineA:"Una mirada más cercana",
   headlineB:"a nuestra ciudad.",
   intro:"Cinco distritos y un sinfín de historias. Explora las tendencias de salud de Nueva York con datos publicados, contexto claro y enlaces a cada fuente.",
   statKicker:"ÍNDICE DE DISTRITOS",
   statCaption:"Los cinco distritos de Nueva York. Una visión conectada de la salud pública.",
   noteA:"DATOS OFICIALES",
   noteB:"CONTEXTO PÚBLICO",
   noteC:"ABIERTO A TODOS",
   footerBrand:"HEALTHSCOPE NYC / ATLAS DE SALUD URBANA",
   footerNote:"Creado para facilitar el acceso a información de salud pública. Los datos conservan sus fechas y fuentes de publicación. No constituye asesoramiento médico.",
   footerStamp:"NUEVA YORK / NOTAS DE CAMPO"
  },
  "zh-CN":{
   edition:"城市观察 / 公共卫生",
   headlineA:"从不同视角，",
   headlineB:"看见我们的城市。",
   intro:"五大行政区，万千真实故事。通过已发布的数据、清晰的背景说明和原始来源，了解纽约市的公共卫生趋势。",
   statKicker:"行政区索引",
   statCaption:"纽约市五大行政区，共同勾勒城市公共卫生图景。",
   noteA:"官方数据",
   noteB:"公开信息",
   noteC:"人人可用",
   footerBrand:"HEALTHSCOPE NYC / 城市健康图鉴",
   footerNote:"让公共卫生信息更易查阅。数据保留原始发布日期及来源。本网站不提供医疗建议。",
   footerStamp:"纽约市 / 城市观察"
  },
  "yue-Hant-HK":{
   edition:"城市觀察 / 公共衞生",
   headlineA:"換個角度，",
   headlineB:"睇清我哋嘅城市。",
   intro:"五個行政區，有無數個故事。透過已發佈嘅數據、清楚嘅背景資料同原始來源，了解紐約市嘅公共衞生趨勢。",
   statKicker:"行政區索引",
   statCaption:"紐約市五個行政區，一齊拼出城市公共衞生嘅全貌。",
   noteA:"官方數據",
   noteB:"公開資訊",
   noteC:"人人可用",
   footerBrand:"HEALTHSCOPE NYC / 城市健康圖鑑",
   footerNote:"令公共衞生資訊更容易查閱。數據保留原有發佈日期同來源。網站內容唔係醫療建議。",
   footerStamp:"紐約市 / 城市觀察"
  }
 };
 function lang(){
   const code=typeof window.hsCurrentLanguage==="function"?window.hsCurrentLanguage():"en";
   return dictionaries[code]?code:"en";
 }
 function render(code){
   const dictionary=dictionaries[code]||dictionaries.en;
   document.querySelectorAll("[data-hf]").forEach(element=>{
     const key=element.getAttribute("data-hf");
     if(Object.hasOwn(dictionary,key)&&element.textContent!==dictionary[key]){
       element.textContent=dictionary[key];
     }
   });
 }
 render(lang());
 if(typeof window.hsChangeLanguage==="function"){
   const originalChange=window.hsChangeLanguage;
   window.hsChangeLanguage=function(locale){
     const result=originalChange(locale);
     render(lang());
     return result;
   };
 }
 // Keep the currently selected chapter understandable to screen readers.
 const nav=document.querySelectorAll(".shell > aside .nav[data-page]");
 function updateCurrent(){
   nav.forEach(btn=>{
     if(btn.classList.contains("active"))btn.setAttribute("aria-current","page");
     else btn.removeAttribute("aria-current");
   });
 }
 updateCurrent();
 for(const item of nav){
   item.addEventListener("click",updateCurrent);
 }
})();
