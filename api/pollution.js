// Healthscope NYC: modeled air-quality estimates near representative borough locations.
// Source: Open-Meteo Air Quality API (CAMS model; nominal ~11 km resolution).
// This is NOT a regulatory monitor, borough average, or street-level measurement.
// https://open-meteo.com/en/docs/air-quality-api
const BOROUGHS=[
 {name:"Bronx",lat:40.8505,lon:-73.8664},
 {name:"Brooklyn",lat:40.6782,lon:-73.9442},
 {name:"Manhattan",lat:40.7831,lon:-73.9712},
 {name:"Queens",lat:40.7282,lon:-73.7949},
 {name:"Staten Island",lat:40.5795,lon:-74.1502}
];
const METRICS=["pm2_5","pm10","nitrogen_dioxide","ozone","us_aqi"];
function cleanNumber(value,max){
  const n=Number(value);
  return value===null||value===undefined||value===""||!Number.isFinite(n)||n<0||n>max?null:Math.round(n*10)/10;
}
export default async function handler(req,res){
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){
    res.setHeader("Allow","GET");
    return res.status(405).json({ok:false,error:"Method not allowed."});
  }
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8500);
  try{
    const params=new URLSearchParams({
      latitude:BOROUGHS.map(b=>b.lat).join(","),
      longitude:BOROUGHS.map(b=>b.lon).join(","),
      current:METRICS.join(","),
      timezone:"America/New_York"
    });
    const upstream=await fetch("https://air-quality-api.open-meteo.com/v1/air-quality?"+params,{
      signal:controller.signal,headers:{"Accept":"application/json"}
    });
    if(!upstream.ok)throw new Error("Upstream returned "+upstream.status);
    const payload=await upstream.json();
    const records=Array.isArray(payload)?payload:[payload];
    if(records.length!==BOROUGHS.length)throw new Error("Incomplete borough response");
    const points=records.map((record,i)=>{
      const current=record&&record.current;
      if(!current||typeof current.time!=="string"||Number.isNaN(Date.parse(current.time)))
        throw new Error("Missing model timestamp");
      return {
        borough:BOROUGHS[i].name,
        coordinates:{latitude:BOROUGHS[i].lat,longitude:BOROUGHS[i].lon},
        time:current.time,
        pm25:cleanNumber(current.pm2_5,2000),
        pm10:cleanNumber(current.pm10,3000),
        no2:cleanNumber(current.nitrogen_dioxide,3000),
        o3:cleanNumber(current.ozone,3000),
        aqi:cleanNumber(current.us_aqi,500)
      };
    });
    if(points.every(row=>["pm25","pm10","no2","o3","aqi"].every(key=>row[key]===null)))
      throw new Error("No modeled values available");
    res.setHeader("Cache-Control","public, s-maxage=900, stale-while-revalidate=900");
    return res.status(200).json({
      ok:true,source:"Open-Meteo Air Quality API (CAMS modeled estimates)",
      sourceUrl:"https://open-meteo.com/en/docs/air-quality-api",
      updatedAt:new Date().toISOString(),
      coverage:"Representative points in five NYC boroughs; grid-model estimates, not borough averages, local monitors, or block-level readings.",
      units:{pm25:"µg/m³",pm10:"µg/m³",no2:"µg/m³",o3:"µg/m³",aqi:"US AQI"},
      boroughs:points
    });
  }catch(error){
    console.warn("Air pollution model temporarily unavailable",error instanceof Error?error.message:String(error));
    res.setHeader("Cache-Control","no-store");
    return res.status(503).json({ok:false,error:"Air-quality estimates are temporarily unavailable. Please try again."});
  }finally{
    clearTimeout(timer);
  }
}