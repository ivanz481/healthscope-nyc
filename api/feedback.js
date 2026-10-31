// Healthscope NYC feedback intake.
// Deploy on Vercel. Set RESEND_API_KEY, FEEDBACK_TO_EMAIL and FEEDBACK_FROM_EMAIL
// as server-side environment variables; never expose these in index.html.
const categories={
  suggestion:"Suggestion / idea",
  bug:"Bug or broken feature",
  data:"Data accuracy or source",
  accessibility:"Accessibility / translation",
  other:"Other feedback"
};

const emailRE=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const clean=(v,max)=>typeof v==="string"?v.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"").slice(0,max):"";

export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method==="GET"){
    // Exposes only whether delivery is available, never addresses or API keys.
    return res.status(200).json({
      ok:true,
      enabled:Boolean(process.env.RESEND_API_KEY&&process.env.FEEDBACK_TO_EMAIL&&process.env.FEEDBACK_FROM_EMAIL)
    });
  }
  if(req.method!=="POST"){
    res.setHeader("Allow","GET, POST");
    return res.status(405).json({ok:false,error:"Method not allowed."});
  }
  // Reject cross-site browser submissions; public API still requires anti-spam safeguards.
  const origin=req.headers.origin;
  if(origin){
    try{
      if(new URL(origin).host!==req.headers.host)
        return res.status(403).json({ok:false,error:"Invalid request origin."});
    }catch{return res.status(403).json({ok:false,error:"Invalid origin."});}
  }
  if(!/^application\/json\b/i.test(req.headers["content-type"]||""))
    return res.status(415).json({ok:false,error:"Use JSON."});
  const size=Number(req.headers["content-length"]||0);
  if(size>12000)return res.status(413).json({ok:false,error:"Feedback is too long."});

  let body=req.body;
  if(typeof body==="string"){
    try{body=JSON.parse(body)}catch{return res.status(400).json({ok:false,error:"Invalid message."});}
  }
  if(!body||typeof body!=="object"||Array.isArray(body))
    return res.status(400).json({ok:false,error:"Invalid form."});

  // Form honeypot: automated submissions are acknowledged without sending an email.
  if(clean(body.website,100))return res.status(200).json({ok:true});
  const type=clean(body.type,30);
  const message=clean(body.message,4001);
  const name=clean(body.name,100);
  const email=clean(body.email,180);
  const rating=clean(body.rating,2);
  const page=clean(body.page,100);
  const locale=clean(body.locale,25);
  if(!Object.prototype.hasOwnProperty.call(categories,type))
    return res.status(400).json({ok:false,error:"Select a valid feedback category."});
  if(message.length<12||message.length>4000)
    return res.status(400).json({ok:false,error:"Please write 12 to 4,000 characters."});
  if(email&&!emailRE.test(email))
    return res.status(400).json({ok:false,error:"Please provide a valid email address."});
  if(rating&&!["1","2","3","4","5"].includes(rating))
    return res.status(400).json({ok:false,error:"Invalid rating."});
  const sentAt=Number(body.startedAt);
  if(!Number.isFinite(sentAt)||Date.now()-sentAt<1800||Date.now()-sentAt>86400000)
    return res.status(400).json({ok:false,error:"Please reload the form and try again."});

  const apiKey=process.env.RESEND_API_KEY;
  const recipient=process.env.FEEDBACK_TO_EMAIL;
  const sender=process.env.FEEDBACK_FROM_EMAIL;
  if(!apiKey||!recipient||!sender)
    return res.status(503).json({ok:false,error:"Feedback email delivery is being configured. Please try again later."});

  const details=[
    "Healthscope NYC — new visitor feedback",
    "Category: "+categories[type],
    "Rating: "+(rating?rating+"/5":"Not provided"),
    "Name: "+(name||"Anonymous"),
    "Reply email: "+(email||"Not provided"),
    "Page: "+(page||"Not provided"),
    "Language: "+(locale||"Not provided"),
    "Submitted: "+new Date().toISOString(),
    "",
    "Message:",
    message
  ].join("\n");

  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    let response;
    try{
      response=await fetch("https://api.resend.com/emails",{
        method:"POST",
        signal:controller.signal,
        headers:{
          Authorization:"Bearer "+apiKey,
          "Content-Type":"application/json",
          "User-Agent":"HealthscopeNYC-feedback/1.0"
        },
        body:JSON.stringify({
          from:sender,
          to:[recipient],
          subject:"[Healthscope NYC] "+categories[type],
          text:details,
          ...(email?{reply_to:email}:{})
        })
      });
    }finally{clearTimeout(timeout);}
    if(!response.ok){
      console.error("Feedback provider rejected request:",response.status);
      return res.status(502).json({ok:false,error:"We couldn't send your feedback. Please try again later."});
    }
    return res.status(200).json({ok:true});
  }catch(err){
    console.error("Feedback delivery unavailable:",err?.name||"Error");
    return res.status(502).json({ok:false,error:"Feedback service is temporarily unavailable. Please try again later."});
  }
}
