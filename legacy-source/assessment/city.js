"use strict";
/* Each view is a fixed first-person background; connectors are real route nodes. */
const CITY_PATH=[
 "1","1-to-2","2","3","4","5",
 "6","7","8","8-to-9","9","9-to-10","9-to-10-2","10",
 "11","11-to-12","12","12-to-13","13","13-to-14","14",
 "15","16","16-to-17","17","17-to-18","17-to-18-2","18",
 "19","19-to-20","20","20-to-21","21","21-to-22","22",
 "23","24","24-to-25","25"
];
const CITY_NAMES={
 "1":"Central Station · Platform","1-to-2":"Station · Concourse passage",
 "2":"Central Station · Concourse","3":"Central Station · Main hall",
 "4":"Station exit","5":"Central Plaza",
 "6":"Westbound boulevard","7":"Anchor · Neighborhood square",
 "8":"Anchor · Residential lane","8-to-9":"Anchor · Shopfront",
 "9":"Anchor · Neighborhood shop","9-to-10":"Southbound tram stop",
 "9-to-10-2":"Riverside tram arrival","10":"Descent toward the river",
 "11":"Flow · Promenade","11-to-12":"Bridge entrance",
 "12":"Flow · Bridge approach","12-to-13":"Bridge descent",
 "13":"Flow · Music venue","13-to-14":"Riverside climb",
 "14":"Shift · Side street","15":"Shift · Arts street",
 "16":"Shift · Workshop passage","16-to-17":"Studio entrance",
 "17":"Shift · Creation space","17-to-18":"Leaving the studios",
 "17-to-18-2":"Central crossing","18":"Eastbound crossing",
 "19":"Surge · Public square","19-to-20":"Broadcast café entrance",
 "20":"Surge · Broadcast café","20-to-21":"Café exit",
 "21":"Surge · Residential street","21-to-22":"Northeast connecting street",
 "22":"Northern street","23":"Flux · Market square",
 "24":"Flux · Market lanes","24-to-25":"Courtyard entrance",
 "25":"Flux · Event courtyard"
};
const CITY_DISTRICTS=[
 {id:"6",name:"Anchor",direction:"West",color:"#55d889"},
 {id:"10",name:"Flow",direction:"South",color:"#55bfff"},
 {id:"14",name:"Shift",direction:"Central-west",color:"#b383f8"},
 {id:"18",name:"Surge",direction:"East",color:"#fa6478"},
 {id:"22",name:"Flux",direction:"North",color:"#ffb36a"}
];
const CITY_STORAGE="egoCheck.cityLocation.v1";
let cityLocation="1",cityHistory=[],cityMoving=false,cityFromRecord=false;
function cityImage(id){return "assets/city/"+id+".webp"}
function cityClock(){
 const clock=document.getElementById("city-clock");if(clock)clock.textContent=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date());
}
function cityWatch(open,{focus=true}={}){
 const drawer=document.getElementById("city-core"),button=document.getElementById("city-watch-toggle");
 if(!drawer||!button)return;drawer.hidden=!open;button.setAttribute("aria-expanded",String(open));
 if(open){
  document.getElementById("city-core-name").textContent=playerName(playerRecord);
  document.getElementById("city-core-reading").textContent=playerRecord?.core?.name+" Core Pulse · "+(playerRecord?.lean?.name||"")+" lean";
  document.getElementById("city-core-close").focus({preventScroll:true});
 }else if(focus)button.focus({preventScroll:true});
}
function cityRender(){
 const index=CITY_PATH.indexOf(cityLocation),next=CITY_PATH[index+1];
 document.getElementById("city-location").textContent=CITY_NAMES[cityLocation]||"Aetheridge";
 document.getElementById("city-image").alt=(CITY_NAMES[cityLocation]||"Aetheridge")+" from your point of view";
 document.getElementById("city-back").disabled=!cityHistory.length&&index===0;
 const forward=document.getElementById("city-forward");
 forward.hidden=cityLocation==="5";forward.disabled=!next;
 forward.textContent=next?"Continue toward "+CITY_NAMES[next]+" →":"Return to Central Plaza →";
 if(!next){forward.hidden=false;forward.disabled=false}
 const panel=document.getElementById("city-route-panel");
 panel.replaceChildren();
 if(cityLocation==="5"){
  const heading=document.createElement("p");heading.textContent="Choose a street, or stay and look around.";panel.append(heading);
  const routes=document.createElement("div");routes.className="city-districts";
  CITY_DISTRICTS.forEach(d=>{
   const button=document.createElement("button");button.type="button";
   button.style.setProperty("--route-color",d.color);
   button.innerHTML="<small></small><strong></strong><span aria-hidden='true'>→</span>";
   button.querySelector("small").textContent=d.direction;
   button.querySelector("strong").textContent=d.name;
   button.addEventListener("click",()=>cityMove(d.id));
   routes.append(button);
  });panel.append(routes);
  const pilot=document.createElement("button");pilot.type="button";
  pilot.textContent="Preview Xar & Stable encounter";
  pilot.style.cssText="margin-top:12px;padding:12px 16px;border:1px solid #bb8c82;border-radius:9px;background:#30415d;color:#f6ebe3;font:inherit;cursor:pointer";
  pilot.addEventListener("click",()=>{window.location.href="pilot-prototype.html"});
  panel.append(pilot);
 }else{
  const line=document.createElement("p");
  line.textContent=cityLocation==="25"?"The city keeps going. You can return to the plaza or revisit a street.":"Follow the street ahead, or step back.";
  panel.append(line);
 }
 cityClock();
}
function cityMove(id,{remember=true,instant=false}={}){
 if(cityMoving||!CITY_NAMES[id]||id===cityLocation)return;
 cityWatch(false,{focus:false});
 if(remember)cityHistory.push(cityLocation);
 const next=document.getElementById("city-image-next"),current=document.getElementById("city-image");
 const preload=new Image();cityMoving=true;
 preload.onload=()=>{
  next.src=preload.src;
  if(instant||matchMedia("(prefers-reduced-motion: reduce)").matches){
   current.src=preload.src;next.classList.remove("visible");cityLocation=id;cityMoving=false;sessionStorage.setItem(CITY_STORAGE,id);cityRender();return;
  }
  requestAnimationFrame(()=>next.classList.add("visible"));
  setTimeout(()=>{
   current.src=preload.src;next.classList.remove("visible");
   cityLocation=id;cityMoving=false;sessionStorage.setItem(CITY_STORAGE,id);cityRender();
  },360);
 };
 preload.onerror=()=>{cityMoving=false;document.getElementById("city-route-panel").textContent="This route could not load. Try again."};
 preload.src=cityImage(id);
}
function cityOpen(id="1"){
 if(!playerRecord)return;
 cityLocation=CITY_NAMES[id]?id:"1";cityHistory=[];
 document.getElementById("city-image").src=cityImage(cityLocation);
 document.getElementById("city-image-next").classList.remove("visible");
 document.getElementById("city-core").hidden=true;
 document.getElementById("city-watch-toggle").setAttribute("aria-expanded","false");
 sessionStorage.setItem(CITY_STORAGE,cityLocation);
 document.body.classList.remove("station-core-active");
 show("city");cityRender();
 (document.getElementById("city-forward").hidden?document.getElementById("city-watch-toggle"):document.getElementById("city-forward")).focus({preventScroll:true});
}
function enterCityFromStation(){cityOpen("1")}
function resumeCity(){cityOpen(sessionStorage.getItem(CITY_STORAGE)||"1")}
function cityBack(){
 if(cityMoving)return;
 const index=CITY_PATH.indexOf(cityLocation);
 const target=cityHistory.pop()||CITY_PATH[Math.max(0,index-1)];
 if(target&&target!==cityLocation)cityMove(target,{remember:false});
}
function cityToRecord(){
 cityFromRecord=true;cityWatch(false);openPlayerArchive();
 document.getElementById("city-return").hidden=false;
}
document.getElementById("city-forward").addEventListener("click",()=>{
 if(cityLocation==="25"){cityMove("5");return}
 const next=CITY_PATH[CITY_PATH.indexOf(cityLocation)+1];if(next)cityMove(next);
});
document.getElementById("city-back").addEventListener("click",cityBack);
document.getElementById("city-watch-toggle").addEventListener("click",()=>cityWatch(document.getElementById("city-core").hidden));
document.getElementById("city-core-close").addEventListener("click",()=>cityWatch(false));
document.getElementById("city-core-record").addEventListener("click",cityToRecord);
document.getElementById("city-core-plaza").addEventListener("click",()=>cityMove("5"));
document.getElementById("city-core-station").addEventListener("click",()=>cityMove("1"));
document.getElementById("city-core-archive").addEventListener("click",()=>{
 cityWatch(false,{focus:false});goHome();setWatchOpen(true);
 document.getElementById("city-resume").focus({preventScroll:true});
});
document.getElementById("city-enter-result").addEventListener("click",()=>cityOpen("1"));
document.getElementById("city-return").addEventListener("click",()=>resumeCity());
document.getElementById("city-resume").addEventListener("click",()=>resumeCity());
document.addEventListener("keydown",event=>{
 if(document.body.dataset.screen!=="city")return;
 if(event.key==="Escape"&&!document.getElementById("city-core").hidden){event.preventDefault();cityWatch(false)}
 if(event.target.closest("button, input, textarea, select"))return;
 if(event.key==="ArrowRight"){event.preventDefault();document.getElementById("city-forward").click()}
 if(event.key==="ArrowLeft"){event.preventDefault();cityBack()}
});
setInterval(()=>{if(document.body.dataset.screen==="city")cityClock()},15000);
