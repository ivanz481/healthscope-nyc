/* Healthscope NYC / Air Pollution mode — modeled estimates, not monitoring data.
   Open-Meteo/CAMS source is fetched via /api/pollution on demand.
   The original 911 map/chart/table remain untouched when that mode is selected. */
(()=>{
 "use strict";
 const host=document.getElementById("geography");
 if(!host)return;
 const byId=id=>document.getElementById(id);
 const emergency=byId("hsGeoEmergency"),pollution=byId("hsGeoPollution");
 const selector=byId("hsPollutant"),state=byId("hsPollutionState"),refresh=byId("hsPollutionRefresh");
 const panel=byId("hsPollutionBoroughPanel"),comparison=byId("hsPollutionComparison");
 const boroughOrder=["Bronx","Brooklyn","Manhattan","Queens","Staten Island"];
 const metrics={
   pm25:{label:"PM2.5",unit:"µg/m³",digits:1},
   pm10:{label:"PM10",unit:"µg/m³",digits:1},
   no2:{label:"NO₂",unit:"µg/m³",digits:1},
   o3:{label:"O₃",unit:"µg/m³",digits:1},
   aqi:{label:"U.S. AQI",unit:"index",digits:0}
 };
 const translations={
   en:{
    emergencyMode:"Emergency response",pollutionMode:"Air pollution",metricLabel:"Air contaminant",
    refresh:"Refresh data",modelLabel:"MODELED AIR QUALITY",
    pointNote:"Estimate at a representative point in the borough",
    modelDisclaimer:"Modeled near a representative borough point, not measured by a sensor or averaged across the borough. Actual levels vary by street and time.",
    comparisonHeading:"Air contaminants by borough",
    comparisonSub:"Estimated concentrations at one reference point per borough.",
    borough:"Borough",aqiHeader:"U.S. AQI",
    sourceCaveat:"Source: Open-Meteo / CAMS (~11 km grid). These are estimates at borough reference points, not measurements or borough averages. Times are NYC local.",
    sourceLink:"Method & source ↗",loading:"Loading current modeled air-quality estimates…",
    ready:"Modeled air quality",missing:"Air-quality estimates are temporarily unavailable. Select Refresh to retry.",stale:"Refresh failed. Showing the last retrieved model data",
    unrecorded:"Model value unavailable",mapDesc:"Explore modeled air pollution near representative borough locations.",
    mapNote:"Schematic borough map. The shading compares model values near a reference point in each borough, not borough-wide averages. The model resolution is approximately 11 km; local conditions may differ.",
    estimated:"Estimate near",at:"NYC local",sourceName:"Open-Meteo / CAMS",mapSideExplanation:"Shading compares modeled reference-point values (not a borough average).",modeled:"model estimate",
    result:"Model data",boroughEstimate:"Reference-point estimate"
   },
   es:{
    emergencyMode:"Respuesta de emergencia",pollutionMode:"Contaminación del aire",metricLabel:"Contaminante",
    refresh:"Actualizar datos",modelLabel:"CALIDAD DEL AIRE ESTIMADA",
    pointNote:"Estimación en un punto representativo del distrito",
    modelDisclaimer:"Estimación del modelo cerca de un punto representativo; no es una medición ni un promedio de todo el distrito. Los niveles varían.",
    comparisonHeading:"Contaminantes por distrito",comparisonSub:"Concentraciones estimadas en un punto de referencia por distrito.",
    borough:"Distrito",aqiHeader:"ICA de EE. UU.",
    sourceCaveat:"Fuente: Open-Meteo / CAMS (malla de ~11 km). Son estimaciones en puntos de referencia, no mediciones ni promedios del distrito. Hora local de NYC.",
    sourceLink:"Fuente y método ↗",loading:"Cargando estimaciones actuales…",
    ready:"Calidad del aire estimada",missing:"Los datos no están disponibles. Pulsa Actualizar datos para reintentar.",stale:"Error al actualizar. Se muestran los últimos datos disponibles",
    unrecorded:"Valor no disponible",mapDesc:"Explora la contaminación estimada cerca de puntos representativos de cada distrito.",
    mapNote:"Mapa esquemático. El sombreado compara valores del modelo en puntos de referencia, no promedios de distritos. La resolución es de unos 11 km.",
    estimated:"Estimación cerca de",at:"hora de NYC",sourceName:"Open-Meteo / CAMS",mapSideExplanation:"Los colores comparan estimaciones en puntos de referencia.",modeled:"estimación",result:"Datos estimados",boroughEstimate:"Estimación puntual"
   },
   "zh-CN":{
    emergencyMode:"紧急响应",pollutionMode:"空气污染",metricLabel:"空气污染物",
    refresh:"刷新数据",modelLabel:"空气质量模型估计",
    pointNote:"该行政区代表性位置的估计值",
    modelDisclaimer:"这些数值是代表性位置附近的模型估计值，并非传感器实测值或整个行政区的平均值。当地污染水平可能不同。",
    comparisonHeading:"各行政区空气污染物",comparisonSub:"比较五个行政区代表性位置的估计浓度。",
    borough:"行政区",aqiHeader:"美国空气质量指数",
    sourceCaveat:"数据来源：Open-Meteo / CAMS（约11公里网格）。代表性位置的模型估计，并非实测值或行政区平均值。时间为纽约当地时间。",
    sourceLink:"数据来源及方法 ↗",loading:"正在加载空气质量估计值…",
    ready:"空气质量模型估计",missing:"暂时无法获取空气质量数据，请点击刷新重试。",stale:"刷新失败，显示上次获取的模型数据",
    unrecorded:"暂无模型数据",mapDesc:"查看纽约市各行政区代表性位置附近的空气污染估计值。",
    mapNote:"此地图为示意图。颜色代表各行政区参考位置的模型数据，并非全区平均值。模型网格约11公里。",
    estimated:"附近估计值：",at:"纽约当地时间",sourceName:"Open-Meteo / CAMS",mapSideExplanation:"地图颜色比较各区参考位置的模型估计值。",modeled:"模型估计",result:"模型数据",boroughEstimate:"参考位置估计值"
   },
   "yue-Hant-HK":{
    emergencyMode:"緊急應變",pollutionMode:"空氣污染",metricLabel:"空氣污染物",
    refresh:"更新數據",modelLabel:"空氣質素模型估計",
    pointNote:"該區代表位置嘅估計值",
    modelDisclaimer:"呢啲數字係代表位置附近嘅模型估計，唔係感應器實測或者全區平均值。實際污染水平可能唔同。",
    comparisonHeading:"各區空氣污染物",comparisonSub:"比較五個行政區代表位置嘅估計濃度。",
    borough:"行政區",aqiHeader:"美國空氣質素指數",
    sourceCaveat:"資料來源：Open-Meteo / CAMS（約11公里網格）。係代表位置嘅模型估計，唔係實測或全區平均值。時間為紐約當地時間。",
    sourceLink:"資料來源及方法 ↗",loading:"載入空氣質素估計中…",
    ready:"空氣質素模型估計",missing:"暫時攞唔到空氣質素資料，請按更新重試。",stale:"更新失敗，顯示上次取得嘅模型數據",
    unrecorded:"暫無模型數據",mapDesc:"睇下各行政區代表位置附近嘅空氣污染估計。",
    mapNote:"呢幅係示意地圖。顏色顯示各區代表位置嘅模型估計，唔係全區平均值。模型網格約11公里。",
    estimated:"附近估計：",at:"紐約當地時間",sourceName:"Open-Meteo / CAMS",mapSideExplanation:"地圖顏色比較各區參考位置嘅模型估計。",modeled:"模型估計",result:"模型數據",boroughEstimate:"參考位置估計值"
   }
 };
 let data=null,active=false,loading=false,lastError=false,lastRetrieved=0;
 const metricsKeys=Object.keys(metrics);
 const originalDesc=byId("hsMapDescription").textContent,
 originalNote=byId("hsMapMethodNote").textContent;
 const originalSource=byId("hsMapSourceName").textContent;
 const originalSideExplanation=byId("hsMapSideExplanation").textContent;
 function language(){
  const key=typeof window.hsCurrentLanguage==="function"?window.hsCurrentLanguage():"en";
  return translations[key]?key:"en";
 }
 function tr(key){return translations[language()][key]||translations.en[key]||key}
 function setText(id,text){const el=byId(id);if(el)el.textContent=text}
 function format(value,key){
  return typeof value==="number"&&Number.isFinite(value)?value.toFixed(metrics[key].digits):"—";
 }
 function stamp(){
  const t=data&&data.boroughs&&data.boroughs[0]?.time;
  return t?String(t).replace("T"," ")+" · "+tr("at"):tr("unrecorded");
 }
 function renderLocale(){
  host.querySelectorAll("[data-hsp-i18n]").forEach(el=>{
   const key=el.dataset.hspI18n;if(key in translations[language()])el.textContent=tr(key);
  });
  if(active){
    setText("hsMapDescription",tr("mapDesc"));
    setText("hsMapMethodNote",tr("mapNote"));
    setText("hsMapSourceName",tr("sourceName"));
    setText("hsMapSideExplanation",tr("mapSideExplanation"));
    renderAll();
  }
 }
 function updateStatus(){
  const pill=byId("statusPollutionPill");
  const dateEl=byId("statusPollutionDate");
  if(pill){
    pill.textContent=loading?"Loading":lastError?(data?"Previous model":"Unavailable"):data?"Model loaded":"On demand";
    pill.className="status-pill "+(data&&!lastError?"live":"cached");
  }
  if(dateEl)dateEl.textContent=data?stamp():lastError?"Model unavailable":"Open Air pollution map";
  if(!active)return;
  state.dataset.status=lastError?"error":loading?"loading":"ready";
  if(loading)state.textContent=tr("loading");
  else if(lastError)state.textContent=data?tr("stale")+" · "+stamp():tr("missing");
  else if(!data)state.textContent=tr("missing");
  else state.textContent=tr("ready")+" · "+stamp();
 }
 function valid(data){
  return data&&data.ok===true&&Array.isArray(data.boroughs)&&data.boroughs.length===5
    &&boroughOrder.every(name=>data.boroughs.some(r=>r.borough===name))
    &&data.boroughs.every(row=>typeof row.time==="string"
      &&metricsKeys.every(key=>row[key]===null||(typeof row[key]==="number"&&Number.isFinite(row[key])&&row[key]>=0)));
 }
 async function load(force=false){
  if(loading)return;
  if(data&&!force&&Date.now()-lastRetrieved<15*60*1000){renderAll();return;}
  loading=true;lastError=false;updateStatus();refresh.disabled=true;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),11000);
  try{
   const response=await fetch("/api/pollution",{headers:{Accept:"application/json"},signal:controller.signal,cache:"no-store"});
   if(!response.ok)throw Error("Upstream unavailable");
   const result=await response.json();
   if(!valid(result))throw Error("Invalid pollution data");
   data=result;lastError=false;lastRetrieved=Date.now();
  }catch(e){
   lastError=true;
  }finally{
   clearTimeout(timeout);loading=false;refresh.disabled=false;updateStatus();renderAll();
  }
 }
 function selected(){return typeof selectedBorough==="string"?selectedBorough:"Brooklyn"}
 function rowFor(name){return data?.boroughs?.find(r=>r.borough===name)||null}
 function renderMap(){
  if(!active)return;
  const key=selector.value;
  const list=boroughOrder.map(name=>({borough:name,value:rowFor(name)?.[key]??null}));
  const nums=list.map(r=>r.value).filter(v=>typeof v==="number");
  const min=nums.length?Math.min(...nums):null,max=nums.length?Math.max(...nums):null;
  for(const row of list){
    const slug=row.borough.replaceAll(" ","-");
    const path=byId("map-"+slug);
    const label=byId("label-"+slug);
    if(path){
      let color="#344957";
      if(row.value!==null&&min!==null){
        const t=max===min?.5:Math.max(0,Math.min(1,(row.value-min)/(max-min)));
        const low=[48,81,103],high=[113,201,214];
        color="rgb("+low.map((v,i)=>Math.round(v+(high[i]-v)*t)).join(",")+")";
      }
      path.style.fill=color;
      path.classList.toggle("selected",row.borough===selected());
      path.setAttribute("aria-label",row.borough+": "+(row.value!==null?format(row.value,key)+" "+metrics[key].unit:tr("unrecorded")));
    }
    if(label)label.textContent=row.value!==null?format(row.value,key):"—";
  }
  setText("legendTitle",metrics[key].label+" · "+tr("modeled"));
  setText("legendRange",min===null?tr("unrecorded"):format(min,key)+" → "+format(max,key)+" "+metrics[key].unit);
  setText("mapSideMetric",metrics[key].label);
  setText("mapDataTag",data?stamp():lastError?tr("missing"):tr("loading"));
 }
 function renderSelected(name){
  if(!active)return;
  const row=rowFor(name),key=selector.value;
  setText("hsPollutionBoroughName",name);
  setText("hsPollutionSelectedValue",row?format(row[key],key):"—");
  setText("hsPollutionSelectedUnit",metrics[key].unit);
  const wrap=byId("hsPollutionMetricList");
  wrap.replaceChildren();
  for(const field of metricsKeys){
    const div=document.createElement("div");div.className="hs-pollution-mini";
    const label=document.createElement("span");label.textContent=metrics[field].label;
    const value=document.createElement("strong");
    value.textContent=row?format(row[field],field):"—";
    div.append(label,value);wrap.append(div);
  }
  renderMap();
  updateTableSelection();
 }
 function updateTableSelection(){
  byId("hsPollutionRows").querySelectorAll("tr").forEach(row=>{
   row.classList.toggle("hs-pollution-row-selected",row.dataset.borough===selected());
  });
 }
 function renderTable(){
  const body=byId("hsPollutionRows");body.replaceChildren();
  for(const name of boroughOrder){
    const dataRow=rowFor(name);
    const row=document.createElement("tr");
    row.dataset.borough=name;
    row.tabIndex=0;
    row.setAttribute("aria-label",name);
    for(const [index,field] of ["borough",...metricsKeys].entries()){
      const cell=document.createElement("td");
      cell.textContent=index===0?name:dataRow?format(dataRow[field],field):"—";
      if(index>0&&field===selector.value)cell.classList.add("hs-pollution-featured");
      row.append(cell);
    }
    row.addEventListener("click",()=>{
      selectedBorough=name;renderSelected(name);
    });
    row.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();selectedBorough=name;renderSelected(name)}
    });
    body.append(row);
  }
  updateTableSelection();
  setText("hsPollutionTimestamp",data?stamp():"—");
 }
 function renderAll(){
  if(!active)return;
  renderSelected(selected());
  renderTable();
  updateStatus();
 }
 function toggle(next){
  active=next;
  host.classList.toggle("hs-pollution-mode",active);
  emergency.classList.toggle("active",!active);emergency.setAttribute("aria-pressed",String(!active));
  pollution.classList.toggle("active",active);pollution.setAttribute("aria-pressed",String(active));
  for(const el of host.querySelectorAll(".hs-geo-emergency-only"))el.hidden=active;
  byId("hsPollutionControls").hidden=!active;
  panel.hidden=!active;comparison.hidden=!active;
  if(active){
   byId("hsMapViewport").classList.add("hs-pollution");
   renderLocale();renderAll();load(Date.now()-lastRetrieved>15*60*1000);
  }else{
   byId("hsMapViewport").classList.remove("hs-pollution");
   setText("hsMapDescription",originalDesc);
   setText("hsMapMethodNote",originalNote);
   setText("hsMapSourceName",originalSource);
   setText("hsMapSideExplanation",originalSideExplanation);
   rerender(); // the original 911 geometry, profile, chart and table
  }
 }
 window.hsPollution={
   get active(){return active},
   renderMap,renderSelected,
   refresh(){return load(true)}
 };
 emergency.addEventListener("click",()=>toggle(false));
 pollution.addEventListener("click",()=>toggle(true));
 selector.addEventListener("change",()=>{if(active)renderAll()});
 refresh.addEventListener("click",()=>load(true));
 const logo=document.querySelector(".shell > aside .brand a.logo");
 if(logo){
   logo.addEventListener("click",e=>{
    e.preventDefault();
    document.querySelector('.nav[data-page="dashboard"]')?.click();
   });
 }
 if(typeof window.hsChangeLanguage==="function"){
   const original=window.hsChangeLanguage;
   window.hsChangeLanguage=function(next){
    const result=original(next);
    renderLocale();
    return result;
   };
 }
 renderLocale();
 updateStatus();
 // Model estimates are refreshed only while their map mode is visible.
 window.setInterval(()=>{
   if(active&&!document.hidden&&Date.now()-lastRetrieved>15*60*1000)load(true);
 },5*60*1000);
 document.addEventListener("visibilitychange",()=>{
   if(!document.hidden&&active&&Date.now()-lastRetrieved>15*60*1000)load(true);
 });
})();
