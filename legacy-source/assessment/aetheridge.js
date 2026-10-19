(() => {
 'use strict';
 const pulses=['Anchor','Flow','Shift','Surge','Flux'];
 const districts={Station:{name:'Central Station',color:'#d8ad51'},Anchor:{name:'Oldridge',color:'#46bc86'},Flow:{name:'Southbank',color:'#48bcec'},Shift:{name:'Crossmere',color:'#ac79ed'},Surge:{name:'Eastmere',color:'#e36979'},Flux:{name:'Northreach',color:'#ef974b'},Crown:{name:'Crownward',color:'#e9bb65'}};
 const places={
 station:{area:'Station',name:'Station Forecourt',text:'You leave the station behind. Footsteps mingle with the low hum of the city.',links:['bell','market','quay'],event:[1]},
 bell:{area:'Anchor',name:'Bell Street',text:'Old shopfronts line the narrow street. A repair shop is opening beside the bakery.',links:['station','copper','market','studio'],event:[2,3]},
 copper:{area:'Anchor',name:'Copper Lane',text:'Delivery parcels sit beside a repair shop. Beyond them, a tram bell sounds down the lane.',links:['bell','quay','quiet'],event:[10,19]},
 quiet:{area:'Anchor',name:'Hearth Lane',text:'A resident waters a window box. Someone unlocks a bicycle and leaves for work.',links:['copper','market']},
 quay:{area:'Flow',name:'Quayside Walk',text:'The river opens below the steps. Two people share a paper bag beside the water.',links:['station','copper','river','tram','bridge']},
 river:{area:'Flow',name:'Riverside Square',text:'People linger beside the river. There is room to stop, watch, or keep walking.',links:['quay','bridge'],event:[5,8,18]},
 tram:{area:'Flow',name:'Ferry Steps Tram Stop',text:'A tram approaches. Commuters gather beside the boarding sign.',links:['quay','bridge'],event:[9]},
 bridge:{area:'Flow',name:'Lantern Bridge',text:'Water catches the light beneath the bridge. A cyclist passes with a quiet bell.',links:['quay','river','tram','market','foundry']},
 market:{area:'Shift',name:'Market Cross',text:'Several streets meet beneath a signpost. Conversations drift from an open café.',links:['station','bell','quiet','bridge','arcade','studio','foundry','council'],event:[6,7]},
 arcade:{area:'Shift',name:'Glass Arcade',text:'Warm light falls through the covered shopping street. A shopkeeper adjusts a sleeve in the window.',links:['market','willow']},
 willow:{area:'Shift',name:'Willow Court',text:'Leaves shift above a small courtyard. You can hear dishes being cleared inside a nearby café.',links:['arcade','foundry']},
 foundry:{area:'Surge',name:'Foundry Street',text:'Voices carry from café terraces. A venue worker tests the sound behind an open door.',links:['bridge','market','willow','cinder','council'],event:[12]},
 cinder:{area:'Surge',name:'Cinder Café Forecourt',text:'A match broadcast plays inside the café. Outside, people continue their conversations.',links:['foundry']},
 studio:{area:'Flux',name:'Paperhouse Studio',text:'Open studios spill onto the pavement. Loose drawings rest on an outdoor display.',links:['bell','market','switchyard'],event:[4,17]},
 switchyard:{area:'Flux',name:'Switchyard Lane',text:'Converted workshops stand beside the old rail line. Music drifts from an upstairs rehearsal.',links:['studio','council']},
 council:{area:'Crown',name:'Council Terrace',text:'Broad steps rise toward the Joint Council. People cross the terrace on their way to appointments.',links:['market','foundry','switchyard','gardens']},
 gardens:{area:'Crown',name:'Crown Gardens',text:'The city hum softens among the trees. A bench faces the distant water.',links:['council']}
 };

 // Location art and routes share the same persistent encounter records.
 Object.assign(places,{
  platform:{area:'Station',name:'Crossmere Platform',text:'Light falls through the long glass canopy. A train waits beside the quiet platform.',links:['station']},
  anchorGate:{area:'Anchor',name:'Anchor Gateway',text:'Mature trees frame the boulevard. Green banners mark the way into the neighborhood.',links:['station','bell']},
  shiftEntrance:{area:'Shift',name:'Shift Entrance',text:'Violet lamps glow beneath an old stone arch. A quiet street opens beyond it.',links:['bridge','arcade']},
  centralStreet:{area:'Crown',name:'Central Side Street',text:'The city settles into a quiet side street. Warm windows overlook the open walkway.',links:['market','council']}
 });
 places.station.links.push('platform','anchorGate');
 places.bell.links.push('anchorGate');
 places.bridge.links.push('shiftEntrance');
 places.arcade.links.push('shiftEntrance','studio');
 places.studio.links.push('arcade');
 places.market.links.push('centralStreet');
 places.council.links.push('centralStreet');
 Object.assign(places.station,{name:'Crossmere Station · Forecourt',text:'Beyond the station doors, a broad plaza opens toward the city. District routes branch between the trees.'});
 Object.assign(places.bell,{name:'Anchor Shopping Street',text:'Independent storefronts and green awnings line the open walking lane. The repair shop sits farther along.'});
 Object.assign(places.copper,{name:'Anchor Repair Shop',text:'The workshop doors stand open. There is room to stop beside the delivery apron.'});
 Object.assign(places.quiet,{name:'Anchor Courtyard',text:'A tree shades the paving between old apartments. The neighborhood hum softens here.'});
 Object.assign(places.tram,{name:'Flow Tram Stop'});
 Object.assign(places.bridge,{name:'Flow Bridge'});
 Object.assign(places.river,{name:'Flow Riverside'});
 Object.assign(places.arcade,{name:'Old District Street',text:'Violet lamps lead between old façades and vintage windows. The center of the street is quiet.'});
 Object.assign(places.studio,{area:'Shift',name:'Shift Studio',text:'A violet-tinted studio window catches the light. Sketches rest beside the open doorway.'});
 Object.assign(places.market,{name:'Quiet Junction',text:'Three streets meet beneath an old signpost. Violet light catches the paving between them.'});
 Object.assign(places.council,{name:'Central Crossing',text:'The streets open into a broad civic plaza. District colors mark the paths branching away.'});
 const locationArt={"platform":"assets/city/locations/crossmere-platform.webp","station":"assets/city/locations/crossmere-forecourt.webp","anchorGate":"assets/city/locations/anchor-gateway.webp","bell":"assets/city/locations/anchor-shopping-street.webp","copper":"assets/city/locations/anchor-repair-shop.webp","quiet":"assets/city/locations/anchor-courtyard.webp","tram":"assets/city/locations/flow-tram-stop.webp","bridge":"assets/city/locations/flow-bridge.webp","river":"assets/city/locations/flow-riverside.webp","shiftEntrance":"assets/city/locations/shift-entrance.webp","arcade":"assets/city/locations/old-district-street.webp","studio":"assets/city/locations/shift-studio.webp","market":"assets/city/locations/quiet-junctionimportant.webp","council":"assets/city/locations/central-crossing.webp","centralStreet":"assets/city/locations/central-side-street.webp","quay":"assets/city/locations/flow-riverside.webp","willow":"assets/city/locations/old-district-street.webp"};

 const encounterPlaces={"1":"station","2":"bell","3":"bell","4":"fluxWorkshop","5":"river","6":"cinder","7":"market","8":"bridge","9":"tram","10":"copper","11":"centralStreet","12":"council","13":"market","14":"market","15":"market","16":"market","17":"fluxWorkshop","18":"river","19":"copper","20":"market"};
 Object.assign(places,{
 fluxWorkshop:{area:'Flux',name:'Flux Workshop Street',text:'Orange light traces inventive workshop additions. Sketches rest on an outdoor display.',links:['switchyard','fluxConnector'],event:[4,17]},
 fluxConnector:{area:'Flux',name:'Flux Northern Connector',text:'An elevated walkway opens onto the city.',links:['fluxWorkshop','fluxGathering']},
 fluxGathering:{area:'Flux',name:'Flux Gathering Space',text:'Suspended lights surround an open gathering space.',links:['fluxConnector']},
 cafeInterior:{area:'Surge',name:'Surge Café Interior',text:'Warm windows and booths frame the open café floor.',links:['cinder','broadcast']},
 broadcast:{area:'Surge',name:'Broadcast Corner',text:'A match plays above the café seating.',links:['cafeInterior']}
 });
 places.switchyard.links.push('fluxWorkshop');places.cinder.links.push('cafeInterior');places.cinder.name='Surge Café Exterior';
 for(const p of Object.values(places))p.event=[];
 for(const [id,key] of Object.entries(encounterPlaces))places[key].event.push(Number(id));
 Object.assign(locationArt,{fluxWorkshop:'assets/city/locations/flux-workshop-street.webp',fluxConnector:'assets/city/locations/flux-northern-connector.webp',fluxGathering:'assets/city/locations/flux-gathering-space.webp',cinder:'assets/city/locations/surge-cafe-exterior.webp',cafeInterior:'assets/city/locations/surge-cafe-interior.webp',broadcast:'assets/city/locations/surge-broadcast-corner.webp'});

 const scene=document.createElement('div');scene.className='ae-scene';scene.setAttribute('aria-hidden','true');
 const sceneImage=document.createElement('img');sceneImage.alt='';sceneImage.decoding='async';scene.append(sceneImage);
 let sceneRequest=0,currentScene='';
 function updateScene(){
  const src=locationArt[s.place]||'';
  if(src===currentScene)return;
  currentScene=src;const request=++sceneRequest;
  if(!src){sceneImage.removeAttribute('src');scene.classList.remove('has-art');return;}
  const preload=new Image();preload.src=src;
  preload.decode().then(()=>{
   if(request!==sceneRequest)return;
   sceneImage.src=src;scene.classList.add('has-art');
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches)sceneImage.animate([{opacity:.3},{opacity:1}],{duration:300,easing:'ease-out'});
  }).catch(()=>{if(request===sceneRequest)scene.classList.remove('has-art');});
 }

 let travelTimer;
 // Each record has exactly one authored response per direction; display order is shuffled.
 const events=[];
 function add(id,area,text,options,replies,extra={}){events.push({id,area,text,options,replies,...extra});}
 add(1,'Station','A barrier blocks the walkway outside the station. A worker fastens its last panel. “Other entrance. Around the building.”', ['Confirm the other entrance is open.','Follow the people taking the detour.','Ask where the upper staircase leads.','Ask the worker to show you the way now.','Suggest moving the sign before the corner.'],['“Yes. Same destination.” He points out a dependable route.','A passerby slows beside you. “This way. I’m heading there too.”','“Upper terrace. You can cross from there.” Another route opens up.','He pauses his work and points you toward the entrance.','He notices the gathering crowd and moves the sign. “Fair point.”']);
 add(2,'Anchor','At a refreshment stand, someone steps ahead of you. “I’m only getting water.”',['“I was next.” Keep your place.','“Go ahead, if it’s quick.”','Ask the attendant to take both orders together.','“Hey. There’s a line.”','“You’re buying mine too, then?”'],['The attendant serves you first. The stranger reluctantly steps back.','They finish quickly and give you a brief nod.','The attendant takes both orders, ending the dispute.','The stranger retreats when the attendant confirms your place.','They hesitate. “Okay, never mind.” They move behind you.']);
 add(3,'Anchor','Someone bursts around the corner. His hand hits the wall beside you as he stops short. His eyes move past your shoulder, searching the street.',['Stay where you are. “Watch where you’re going.”','Step aside. “Just give me some room.”','“Running from something, or looking for someone?”','“Hey! You nearly hit me!”','“Stop. Try looking before you charge around corners.”'],['His jaw tightens. “Fine. Can you move?” He goes around you.','“Yeah.” He shifts away and passes without another look.','“Looking. You seen a girl come through here?” His gaze flicks past you. “Forget it.”','He throws you an irritated glance. “But I didn’t.”','His eyes narrow. “You always give strangers directions?”'],{story:0,end:'He disappears around the next corner. The street carries on around you.'});
 add(4,'Flux','A gust lifts sketches from an open folder. Loose sheets slide toward a water channel. “Oh, come on—”',['Hold down the remaining sheets.','Collect the papers nearest you as they drift.','Move downwind to intercept them.','Catch the sheet about to hit the water.','Use an empty display board to block their path.'],['The artist secures the folder. “That would’ve been everything.”','You gather several together. “The wind always does this here.”','The artist notices your approach and joins you downwind.','“That one took me hours.” They hold the rescued sheet carefully.','The barrier catches several sheets. “Okay. That works.”']);
 add(5,'Flow','Two people organize a balance challenge beside the river. One waves you over. “We need one more. You’re joining.”',['“I’m keeping to my walk.”','“I can watch briefly, but I’m not joining.”','“Do you need a participant or someone keeping track?”','“I’ll try. Show me.”','“Only if everyone carries something awkward.”'],['They accept your refusal, though one rolls their eyes.','They make room beside the activity.','They admit they need someone to count clean crossings.','They clear the starting point for you immediately.','They laugh, then start debating your new rule.']);
 add(6,'Shift','The café attendant hands you the wrong drink. When you point it out, they frown. “That’s what I heard you say.”',['Repeat the original order. “That’s the one I’d like.”','Ask what is in this drink and consider accepting it.','Point to the menu. “Maybe we meant different things.”','“Please change it. I don’t want this.”','“Let’s reset. I’ll show you exactly what I mean.”'],['They remake it, looking unconvinced.','You accept the alternative after checking its ingredients. Their shoulders relax.','“Oh. That one.” They recognize the misunderstanding.','Your direct request gets the replacement started.','You interrupt the argument and order afresh by pointing.']);
 add(7,'Shift','A girl studies a sign at a junction. As you approach, she says, “If you want the bridge, that arrow’s wrong.”',['Check the route on your Watch before moving.','“Which way would you take?”','“Wrong destination, or wrong way of getting there?”','Start toward the steps. “This way?”','“Then let’s fix the sign.”'],['“Good.” She waits while you confirm the route.','“Down the steps. Then left.”','“Wrong level. It sends you above the bridge.”','“After the steps. Not that alley.” She catches your attention.','“Tell someone who can fix it.” She taps the report symbol.'],{story:1,end:'“See you.” She gives you a brief look, then continues down the street.'});
 add(8,'Flow','Two people argue over a challenge boundary. “You saw that, right? Tell him.” You only saw the last moment.',['“I didn’t see enough. Keep to your agreed rules.”','Suggest another attempt they can both accept.','Ask whether they disagree about the line or the meaning of crossing.','“Stop talking over each other. One at a time.”','Cancel the disputed round and mark a new boundary.'],['They return to the original agreement.','They reluctantly agree to repeat the attempt.','They discover they understood the rule differently.','They pause and explain separately.','They abandon the disputed result and redraw the setup.']);
 add(9,'Flow','The tram’s boarding light pulses. Beside you, someone struggles to lift a bulky bag. “Could you—?”',['Steady the bag while they regain their footing.','Carry one end at their pace.','Look for a door with level access.','Take the heavy end immediately. “Come on.”','Signal the attendant to pause boarding.'],['They regain their balance and complete the lift.','You board together, slower than intended.','You take the easier entrance farther along the platform.','The bag gets aboard just before the doors close.','Boarding pauses while staff assist.']);
 add(10,'Anchor','Outside a repair shop, a courier struggles with parcels. “Watch these? Two minutes.” They are already turning away.',['“Two minutes. Then you come back.”','Offer to carry some inside instead.','Ask whether the shop has a trolley.','Call inside for someone to receive the delivery.','“Get someone outside before handing this off.”'],['They acknowledge your limit and hurry inside.','They adjust the delivery around your offer.','A worker brings a trolley out.','A worker comes to take the parcels.','The courier stops and arranges a proper handover.']);
 add(11,'Surge','The impatient stranger scans a narrow passage. He recognizes you. “You. Were you at the junction? Girl there. Short. Which way did she go?”',['“Tell me why before I tell you anything.”','“She’s moved on. Give her a minute.”','“Is she avoiding you, or are you both looking?”','“Why? What do you want with her?”','“Try a message instead of chasing through the streets.”'],['“We have a match.” His expression tightens. “That enough?”','“I’ve given her plenty.” He checks the next street.','“She knows I’m looking.” He leaves the distinction unresolved.','“Finish something.” His tone hardens.','“Already did.” He turns away.'],{story:2,end:'He resumes searching. You continue through the city.'});
 add(12,'Surge','Someone stops you near the fountain. “Tell my companion I’ll be late? They’re waiting in the courtyard. I can’t go back.”',['Ask for the exact message and agree only to deliver it.','“I’m passing nearby. I can do that.”','Help contact them through the Watch instead.','“Which fountain? I’ll go now.”','Arrange one new meeting point instead of a message relay.'],['They give you a clear, limited message.','You adjust your route to help.','They find a direct contact and send the message.','You head off immediately with their message.','They send updated meeting details through a shared contact.']);
 add(13,'Surge','Ahead, the girl turns at a familiar voice. “There you are.” The stranger approaches. “Are we finishing this or not?” She answers, “You’re still looking?”',['“Give her room.” Keep a boundary between them.','Ask her whether she wants you to stay.','“What exactly are you finishing?”','“Hey. Back off for a second.”','Interrupt them. “Explain before this goes anywhere.”'],['“We’re talking,” he says. She adds, “I can answer him.”','“If you want.” She seems at ease, not in need of rescue.','“A match,” she says. “He wants another attempt.”','“You don’t even know what’s happening.” She replies, “Then explain.”','He exhales through his nose. She studies you before explaining.'],{story:3});
 add(14,'Surge','“You keep doing the same thing,” she says. “Then stop avoiding it.” “I’m standing right here, Xar.” He looks at you. “Watch, then.”',['Ask them to state the rules first.','Ask where you should stand.','“What would count as settling this?”','“Fine. Start.”','“I’m not someone you can use to prove a point.”'],['She states their agreed terms. Xar waits, reluctantly.','“There. You can leave whenever.” She points outside the boundary.','“Him accepting the result.” Xar replies, “I accept results.”','Xar turns back to her. “Ready, Stable?”','“You don’t have to be,” she says. Xar looks away.'],{story:4,end:'They both agree to continue. You stand outside the match boundary.'});
 add(15,'Surge','Xar presses forward again. A thin gold fracture spreads beneath his shoe. The sound is wrong. The girl reaches toward you. “Back.”',['Brace on intact ground and offer a steady hand.','Follow her pull along the safe path.','Point out the open passage with intact paving.','Call to the spectators. “Get back!”','Move a courtyard screen across the approach to stop people entering.'],['She uses your support to guide you both farther back.','“Keep coming.” You retreat together.','She checks your route and redirects you through it.','Several spectators move as you retreat with her.','You cut off the approaching crowd, then follow her clear.'],{story:5,end:'She gets you onto intact ground. Pulse appears beside Xar and grips his shoulder. You cannot hear their exchange. The match stops.'});
 add(16,'Surge','The fracture stops spreading. Xar looks down, then at the people around the courtyard. At last, upright and tight-jawed: “I concede.” The girl nods without celebrating.',['Keep everyone back until the ground is safe.','Give them space. “Do either of you need anything?”','“What changed just before it cracked?”','“You nearly got people hurt.”','Stop a spectator restarting the argument. “The match is over.”'],['She stays beside you. Xar studies the fracture instead of arguing.','“A minute,” she says. Xar remains silent.','Xar looks at you. “…I pushed.”','His jaw tightens. “I saw.” He does not look away from the damage.','The girl briefly looks back at you. The crowd disperses.'],{story:6,end:'People begin leaving. You have room to continue your own day.'});
 add(17,'Flux','The artist you helped finds you again. A rescued sketch is damaged. Their repair keeps making it worse.',['Protect what is still intact before repairing it.','Find materials that work with the damage.','Consider making the damage part of the composition.','Start a practical repair together now.','Make a separate piece from the torn section.'],['You preserve the remaining work first.','The artist adapts the repair to the paper’s condition.','They look at the image differently. “Maybe that could belong.”','You begin an attempt together.','The failed repair becomes the start of another creation.'],{after:4,follow:true});
 add(18,'Flow','The river group finds you again. They assume you will join another attempt.',['“I agreed to one attempt. That hasn’t changed.”','Offer a smaller role that fits your time.','Ask why they need you specifically.','“One more. Then I’m leaving.”','Help redesign it so they do not need another passerby.'],['They accept your original limit.','They find a way to include you briefly.','They mainly need someone to demonstrate the crossing.','You act immediately and state your endpoint.','The activity can continue without recruiting someone else.'],{after:5,follow:true});
 add(19,'Anchor','The courier returns late. “Sorry. Can you stay a little longer?”',['“The two minutes are over.”','Offer only the help that fits your route now.','Ask what is actually preventing the handover.','Go inside and resolve the handover now.','Replace the informal favor with a staff collection point.'],['You keep the agreed boundary.','They adjust to the help you can still offer.','You discover a misunderstanding about the delivery entrance.','The shop receives the parcels directly.','They arrange a handover that no longer depends on you waiting.'],{after:10,follow:true});
 add(20,'Shift','You find a familiar face near the junction. The girl notices you. “You got out all right?”',['Ask whether the courtyard has been secured.','Offer to walk without requiring an explanation.','“I think I misunderstood what was happening.”','“I still want an answer about what happened.”','Discuss how to stop another confrontation becoming a spectacle.'],['They answer your practical concern before continuing.','You walk together briefly at their pace.','“Which part?” The conversation opens around what you actually knew.','You receive a direct account of what went wrong.','The conversation turns toward changing the pattern next time.'],{story:7,follow:true,end:'They continue their own day. Aetheridge is still open to you.'});
 let saved={};try{saved=JSON.parse(localStorage.getItem('ego.aetheridge.v1')||'{}')}catch{}
 let s={district:'Station',answers:{},step:0,lastStoryVisit:-10,visits:0,log:[],...saved};
 if(!districts[s.district]||typeof s.answers!=='object'||!s.answers)s={district:'Station',answers:{},step:0,lastStoryVisit:-10,visits:0,log:[]};
 if(!places[s.place])s.place=Object.keys(places).find(k=>places[k].area===s.district)||'station';s.district=places[s.place].area;if(s.step>=4&&s.step<=6){s.matchPlace='market';s.place='market';s.district=places.market.area;}
 const root=document.createElement('section');root.id='aetheridge';root.hidden=true;root.setAttribute('aria-label','Explore Aetheridge');document.body.append(root);
 const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=(text,fn,cls='')=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.onclick=fn;return b};
 function save(){try{localStorage.setItem('ego.aetheridge.v1',JSON.stringify(s))}catch{}}
 function shell(){clearPulseAnalysis();root.dataset.mode='walk';root.innerHTML='<header class="ae-header"><span>AETHERIDGE <small id="ae-location"></small></span><button type="button" id="ae-watch">EGO Watch</button></header><main id="ae-stage"></main>';root.prepend(scene);updateScene();root.style.setProperty('--district',districts[s.district].color);root.querySelector('#ae-location').textContent=districts[s.district].name+' · '+places[s.place].name;root.querySelector('#ae-watch').onclick=watch;}
 function mount(){(document.getElementById('boot-skip')||document.getElementById('wake-skip'))?.click();clearInterval(vnTimer);document.getElementById('prologue').hidden=true;sessionStorage.setItem('egoCheck.stationIntroSeen.v1','true');root.hidden=false;document.body.classList.add('aetheridge-active');shell();if(s.step>=4&&s.step<=6)renderEncounter(events.find(e=>e.story===s.step));else walkFrame();}
 function close(){clearPulseAnalysis();clearTimeout(travelTimer);root.hidden=true;document.body.classList.remove('aetheridge-active');}
 function stage(){return root.querySelector('#ae-stage')}
 function routeButton(key){const dest=places[key];const b=button('',()=>travel(key),'ae-route');b.innerHTML='<span><strong>'+escape(key==='quay'?'Take the steps to the waterfront':key==='studio'?'Walk toward Shift Studio':'Follow the street to '+dest.name)+'</strong><small>'+escape(districts[dest.area].name+' · '+dest.name)+'</small></span><span aria-hidden="true">→</span>';return b;}
 function walkFrame(){clearTimeout(travelTimer);shell();const place=places[s.place];events.filter(eligible).forEach(e=>{const cfg=npcScenes[e.id]||storyScenes[e.id];(cfg?.frames||[]).filter(key=>key!=='artist-helper-1').forEach(key=>prepareActor(key).catch(()=>{}));});stage().innerHTML='<section class="ae-transition"><small>'+escape(districts[s.district].name.toUpperCase())+'</small><h1>'+escape(place.name)+'</h1><p>'+escape(place.text)+'</p></section>';stage().append(button('Look around',()=>encounter(false),'ae-continue'));const nav=document.createElement('nav');nav.className='ae-districts';nav.setAttribute('aria-label','Walking routes');place.links.forEach(k=>nav.append(routeButton(k)));stage().append(nav);}
 function travel(key){clearTimeout(travelTimer);const from=places[s.place];s.place=key;s.district=places[key].area;s.visits++;save();shell();stage().innerHTML='<section class="ae-transition ae-walking"><small>'+escape(from.name.toUpperCase()+' → '+places[key].name.toUpperCase())+'</small><h1>On foot</h1><p>'+escape(places[key].text)+'</p></section>';let done=false;const arrive=()=>{if(done)return;done=true;clearTimeout(travelTimer);encounter(true)};stage().append(button('Arrive now',arrive,'ae-continue'));travelTimer=setTimeout(arrive,1600);}
 function eligible(e){
 if(s.answers[e.id]!==undefined)return false;
 if(e.id===1)return s.place==='station';
 if(s.answers[1]===undefined)return false;
 let key=encounterPlaces[e.id];
 if(e.id===19&&s.answers[12]!==undefined)key='quiet';
 if(e.id===20&&s.answers[16]===1)key='council';
 if(s.place!==key)return false;
 if(e.story!==undefined){
 if(e.story!==s.step)return false;
 if(e.story===0)return s.visits>=1;
 if(e.story===1||e.story===2)return s.visits-s.lastStoryVisit>=2;
 if(e.story===7)return [17,18,19].every(id=>s.answers[id]!==undefined);
 return true;
 }
 if(e.follow)return s.step>=7&&s.answers[e.id===19&&s.answers[12]!==undefined?12:e.after]!==undefined;
 return true;
 }
 function encounter(arriving=false){
 const pool=events.filter(eligible),story=pool.find(e=>e.story!==undefined);
 const e=arriving?story:story||pool[0];
 if(!e){walkFrame();return;}
 if(e.story===3){s.matchPlace='market';save()}renderEncounter(e);
 }
 function variant(e){e={...e,options:[...e.options],replies:[...e.replies]};const a=s.answers[e.after];if(e.id===7&&s.answers[3]===2)e.text+=' You remember the stranger asking about a girl. Could he have meant her?';if(e.id===13&&s.answers[3]===2)e.text+=' The question from the street returns to you: was this who he was looking for?';if(e.id===17){if(a===0){e.text='The artist returns. A sheet is still missing. “Do you remember where it went?”';e.options=['Keep the folder safe while they search.','Search nearby at their pace.','Reconstruct the wind’s direction.','Go to the channel and check immediately.','Ask neighboring stalls to stop and check their displays.'];e.replies=['Nothing else escapes during the search.','You search together without losing more papers.','Your new search direction leads to a sheet under a bench.','You find it caught near the water.','A vendor finds the sheet behind their display.'];}else if(a===4){e.text='The artist tries using your barrier idea for an outdoor display. It keeps tipping over.';e.options=['Secure the existing supports.','Adjust the display to the gusts.','Turn the display to face another direction.','Catch and hold it while they fasten it.','Replace the standing display with a suspended arrangement.'];e.replies=['The original setup finally holds.','The display moves with the wind safely.','A different angle reduces the strain.','You prevent another fall while they finish.','A new arrangement replaces the failing structure.'];}}
 if(e.id===18&&a!==3){if(a===0){e.text='Someone from the river group finds you. “You left. Did we do something?”';e.options=['Repeat that you wanted to keep walking.','Acknowledge their disappointment without changing your plans.','Explain that declining the challenge was not rejecting them.','Say clearly that you do not want to participate.','Challenge the assumption that every invitation needs accepting.'];e.replies=['They understand your original boundary.','“Okay. I just wondered.”','“Oh. I read that wrong.”','They stop pressing for a different answer.','They reconsider how they recruit people.'];}else if(a===4){e.text='Your changed challenge rules caused a dispute. “That wasn’t what you meant, was it?”';e.options=['Restate the rule you actually proposed.','Adjust the rule to what both can manage.','Ask what the challenge is meant to test.','Demonstrate your version now.','Discard that rule and invent a simpler challenge.'];e.replies=['They restart with a shared rule.','Both agree to the adjustment.','They realize they want different kinds of challenge.','Your demonstration clears up the dispute.','The disputed setup is replaced.'];}else{e.text='The river group asks you to settle a disputed result. Both insist you should take their side.';e.options=['Use only the rules everyone agreed.','Seek a compromise both can accept.','Find the different assumptions behind their claims.','Give a direct ruling on what you witnessed.','Void the disputed attempt and change the setup.'];e.replies=['You hold them to their shared agreement.','Both accept a repeat attempt.','Their disagreement becomes clearer.','They hear your account and accept the result.','A clear new boundary prevents the same dispute.'];}}
 if(e.id===19&&s.answers[12]===undefined&&a!==0){e.text=a===2?'The courier’s trolley went to the wrong entrance. They return, frustrated.':'The handover you arranged has stalled. The courier asks you to get involved again.';e.replies=['You keep the limits of your original help.','They adapt to the help you can offer now.','You identify the wrong entrance as the cause.','You get the receiving worker to come outside.','A marked collection point replaces the confusing arrangement.'];}
 if(e.id===19&&s.answers[12]!==undefined){const direct=[2,4].includes(s.answers[12]);e.text=direct?'The new meeting point is inaccessible. The waiting companion asks for help finding another.':'The waiting companion asks, “Could you tell them I’m waiting somewhere else now?”';e.options=['Keep the limits of your original commitment.','Offer help only if it fits your route.','Help them contact each other directly.','Find their companion and settle this now.','Choose one accessible meeting place and end the relays.'];e.replies=['They make another arrangement.','They adapt to the help you can offer.','They establish direct contact.','You resolve the misunderstanding together.','Both agree on one accessible meeting point.'];}
 if(e.id===20&&s.answers[16]===1){e.text='At the crossing, Xar and the girl are separating. She notices you; he recognizes you a moment later.';}
 if(e.id===20&&(s.answers[16]===2||s.answers[16]===3)){e.text='Xar stands alone near the junction, looking back toward the courtyard. “You were there.”';e.replies=['“They closed it off.” He answers before looking away.','He walks beside you briefly without filling the silence.','“…You weren’t the only one.”','“I didn’t stop when I should’ve.” The answer comes reluctantly.','“There shouldn’t be a next time.” He looks back toward the courtyard.'];}else if(e.id===20&&s.answers[16]===4){e.text='The girl catches up near the crossing. “You stopped them starting it again.”';}return e;}
 const npcScenes={
  1:{label:'STATION WORKER',frames:['worker'],intro:['A temporary barrier blocks the walkway beyond the station. A worker is fastening its last panel.','“Other entrance. Around the building.”']},
  2:{label:'CUSTOMER',frames:['customer','worker'],intro:['At a refreshment stand, someone steps in front of you just as the attendant looks up.','“I’m only getting water.”']},
  4:{label:'ARTIST',frames:['artist-1','artist-2','artist-3'],intro:['A gust lifts loose sketches from an open folder. Sheets slide toward a shallow water channel.','“Oh, come on—”'],choice:0,result:1,end:2},
  6:{label:'CAFÉ ATTENDANT',frames:['cafe'],intro:['At a café window, the attendant hands you a different drink. You point it out.','“That’s what I heard you say.”']},
  9:{label:'PASSENGER',frames:['passenger-1','passenger-2','passenger-3'],intro:['The tram’s boarding light begins to pulse. Someone struggles to lift a bulky bag.','“Could you—?”'],choice:1,result:1,end:2},
  10:{label:'COURIER',frames:['courier-1','courier-2','courier-3','repairer'],intro:['Outside the repair shop, a courier struggles to balance several parcels.','“Can you watch these? Two minutes.”','They are already turning toward the doorway.'],choice:1,result:2,end:2},
  12:{label:'MESSENGER',frames:['messenger-1','messenger-2'],intro:['A stranger stops you near the courtyard and asks you to deliver a message.','“They’re waiting by the fountain. I can’t go back.”','They check their Watch and explain where their companion is waiting.'],choice:1,result:1,end:1},
  17:{label:'ARTIST',frames:['artist-helper-1','artist-helper-2','artist-helper-3','artist-helper-4'],choice:1,result:1,end:3}
 };
 // The supplied artwork is composited at render time. Original files stay intact.
 const actorCache=new Map();
 function actorSource(key){return key.startsWith('xar-')||key.startsWith('stable-')?'assets/pilot-prototype/'+key+'.webp':'assets/encounters/'+key+'.webp';}
 function prepareActor(key){
  if(actorCache.has(key))return actorCache.get(key);
  const promise=(async()=>{
   const img=new Image();img.src=actorSource(key);await img.decode();
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);
   const pixels=context.getImageData(0,0,canvas.width,canvas.height),d=pixels.data,w=canvas.width,h=canvas.height;
   // Native alpha portraits need no keying. Opaque backgrounds are neutral checkers or black.
   let nativeAlpha=false;for(let p=3;p<d.length;p+=4)if(d[p]<32){nativeAlpha=true;break;}
   if(!nativeAlpha){
    const dark=d[0]+d[1]+d[2]<90;
    const candidate=p=>{const i=p*4,r=d[i],g=d[i+1],b=d[i+2];return dark?Math.max(r,g,b)<27:Math.max(r,g,b)-Math.min(r,g,b)<13&&Math.min(r,g,b)>174;};
    const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let tail=0,head=0;
    const push=p=>{if(!seen[p]&&candidate(p)){seen[p]=1;queue[tail++]=p;}};
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
    while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);if(x)push(p-1);if(x<w-1)push(p+1);if(y)push(p-w);if(y<h-1)push(p+w);}
    // Checker regions enclosed by flying papers or a hand have the same neutral palette.
    if(!dark)for(let p=0;p<w*h;p++)if(candidate(p))seen[p]=1;
    for(let p=0;p<seen.length;p++)if(seen[p])d[p*4+3]=0;
    context.putImageData(pixels,0,0);
   }
   // Crop only empty margins so wide Xar/Stable canvases share the same camera scale.
   let left=w,top=h,right=0,bottom=0;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>80){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
   const cropped=document.createElement('canvas');cropped.width=Math.max(1,right-left+1);cropped.height=Math.max(1,bottom-top+1);
   cropped.getContext('2d').drawImage(canvas,left,top,cropped.width,cropped.height,0,0,cropped.width,cropped.height);return cropped;
  })();actorCache.set(key,promise);return promise;
 }
 let castRequest=0;
 function npcArtwork(frame,secondary){
  const keys=[frame,secondary].filter(Boolean);
  let cast=root.querySelector('.ae-cast');if(!cast){cast=document.createElement('aside');cast.className='ae-cast';cast.setAttribute('aria-label','Characters in front of you');root.append(cast);}
  cast.dataset.count=keys.length;
  const signature=keys.join('|');if(cast.dataset.signature===signature)return;cast.dataset.signature=signature;const request=++castRequest;
  Promise.all(keys.map(prepareActor)).then(art=>{
   if(request!==castRequest||!cast.isConnected)return;
   cast.replaceChildren();art.forEach((source,i)=>{const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d').drawImage(source,0,0);canvas.className='ae-actor ae-actor-'+(i?'secondary':'primary');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',keys[i].replace(/-\d+$/,'').replaceAll('-',' '));cast.append(canvas);});
  }).catch(()=>{if(request===castRequest)cast.replaceChildren();});
 }
 function sceneArtwork(path){
  root.querySelector('.ae-cast')?.remove();++castRequest;
  let shot=root.querySelector('.ae-cutscene-shot');if(!shot){shot=document.createElement('img');shot.className='ae-cutscene-shot';shot.alt='';root.append(shot);}shot.src=path;
 }
 function clearShot(){root.querySelector('.ae-cutscene-shot')?.remove();}
 const storyScenes={
  3:{label:'STRANGER',frames:['xar-1','xar-2','xar-3'],intro:['Running footsteps approach the corner.','He stops inches from you, his palm striking the wall beside your head. His eyes look past you, searching the street.'],shots:['assets/pilot-collision/01.webp','assets/pilot-collision/02.webp'],choiceShot:'assets/pilot-collision/02.webp',endShot:'assets/pilot-collision/03.webp'},
  7:{label:'GIRL AT THE JUNCTION',frames:['stable-1','stable-2','stable-3'],intro:['A girl studies the sign at the junction. She looks up as you approach.','“If you want the bridge, that arrow’s wrong.”'],choice:1,result:1,end:2},
  11:{label:'STRANGER',frames:['xar-1','xar-2','xar-3'],intro:['The stranger from the corner is searching another passage. He recognizes you.','“You. Were you at the junction? Girl there. Short. Which way did she go?”'],choice:1,result:1,end:2},
  13:{label:'STRANGER & THE GIRL',frames:['xar-4','xar-6'],secondary:'stable-4',intro:['The girl turns at a familiar voice.','“There you are.” He approaches. “Are we finishing this or not?”','“You’re still looking?”'],choice:0,result:1,end:1},
  14:{label:'XAR & THE GIRL',frames:['xar-4','xar-5'],secondary:'stable-5',intro:['“You keep doing the same thing,” she says.','“Then stop avoiding it.”','“I’m standing right here, Xar.” He turns toward you. “Watch, then.”'],choice:0,result:1,end:1},
  15:{label:'GIRL',frames:['stable-5'],intro:['Xar presses forward again.','A sharp sound cuts through the street. A thin gold fracture spreads beneath his shoe.','The girl reaches toward you. “Back.”'],shots:['assets/pilot-crack/01.webp','assets/pilot-crack/02.webp','assets/pilot-crack/05.webp'],choiceShot:'assets/pilot-crack/05.webp',resultShot:'assets/pilot-crack/05.webp',endShot:'assets/pilot-crack/03.webp'},
  16:{label:'XAR & THE GIRL',frames:['xar-7','xar-8'],secondary:'stable-6',intro:['The fracture stops spreading. Xar looks down, then at the people around him.','At last, upright and tight-jawed: “I concede.”','The girl nods without celebrating.'],choice:0,result:0,end:1},
  20:{label:'FAMILIAR FACE',frames:['stable-7','stable-6'],choice:0,result:1,end:0}
 };


 // Narrate the selected action separately from the imperative choice label.
 function narrateChoice(option){
  const spoken={
   '“I was next.” Keep your place.':'You hold your place in line and tell the customer, “I was next.”',
   '“Go ahead, if it’s quick.”':'You let the customer go ahead, provided they keep it quick.',
   '“Hey. There’s a line.”':'You call the customer’s attention to the line.',
   '“You’re buying mine too, then?”':'You suggest that the customer buy your drink too.',
   'Stay where you are. “Watch where you’re going.”':'You stay where you are and tell him to watch where he is going.',
   'Step aside. “Just give me some room.”':'You step aside and ask him to give you some room.',
   '“Running from something, or looking for someone?”':'You ask whether he is running from something or looking for someone.',
   '“Hey! You nearly hit me!”':'You call out that he nearly hit you.',
   '“Stop. Try looking before you charge around corners.”':'You stop him and tell him to look before charging around corners.',
   '“I’m keeping to my walk.”':'You decline the invitation and keep to your walk.',
   '“I can watch briefly, but I’m not joining.”':'You offer to watch briefly while making it clear you will not join.',
   '“Do you need a participant or someone keeping track?”':'You ask whether they need a participant or someone to keep track.',
   '“I’ll try. Show me.”':'You agree to try and ask them to show you how.',
   '“Only if everyone carries something awkward.”':'You propose joining only if everyone carries something awkward.',
   '“Please change it. I don’t want this.”':'You ask the attendant to replace the drink.',
   '“Let’s reset. I’ll show you exactly what I mean.”':'You start the order again, showing the attendant exactly what you mean.',
   '“Which way would you take?”':'You ask her which route she would take.',
   '“Wrong destination, or wrong way of getting there?”':'You ask whether the sign points to the wrong destination or the wrong route.',
   '“Then let’s fix the sign.”':'You suggest fixing the misleading sign.',
   '“I didn’t see enough. Keep to your agreed rules.”':'You explain that you did not see enough and ask them to keep to their agreed rules.',
   '“Stop talking over each other. One at a time.”':'You ask them to stop talking over each other and explain one at a time.',
   '“Two minutes. Then you come back.”':'You agree to watch the parcels for two minutes and ask the courier to return by then.',
   '“Get someone outside before handing this off.”':'You ask the courier to arrange a receiver outside before handing over the parcels.',
   '“Tell me why before I tell you anything.”':'You ask him to explain why he is looking for her before sharing anything.',
   '“She’s moved on. Give her a minute.”':'You tell him she has moved on and ask him to give her a minute.',
   '“Is she avoiding you, or are you both looking?”':'You ask whether she is avoiding him or whether they are both looking for each other.',
   '“Why? What do you want with her?”':'You ask why he is looking for her and what he wants.',
   '“Try a message instead of chasing through the streets.”':'You suggest sending her a message instead of searching the streets.',
   '“I’m passing nearby. I can do that.”':'You agree to deliver the message because you are passing nearby.',
   '“Which fountain? I’ll go now.”':'You ask which fountain they mean and set off to deliver the message.',
   '“Give her room.” Keep a boundary between them.':'You keep a boundary between them and ask him to give her room.',
   '“What exactly are you finishing?”':'You ask what exactly they are trying to finish.',
   '“Hey. Back off for a second.”':'You ask him to back off for a moment.',
   '“What would count as settling this?”':'You ask what would count as settling their disagreement.',
   '“Fine. Start.”':'You agree to watch and tell them to start.',
   '“I’m not someone you can use to prove a point.”':'You make it clear that you will not be used to prove a point.',
   '“What changed just before it cracked?”':'You ask what changed just before the ground cracked.',
   '“You nearly got people hurt.”':'You tell Xar that he nearly got people hurt.',
   '“I agreed to one attempt. That hasn’t changed.”':'You remind the group that you agreed to only one attempt.',
   '“One more. Then I’m leaving.”':'You agree to one more attempt and make it clear you will leave afterward.',
   '“The two minutes are over.”':'You remind the courier that the agreed two minutes are over.',
   '“I think I misunderstood what was happening.”':'You admit that you may have misunderstood what was happening.',
   '“I still want an answer about what happened.”':'You ask for an explanation of what happened.'
  };
  return spoken[option]||'You '+option[0].toLowerCase()+option.slice(1);
 }

 let analysisTimer;
 function pulseChoiceSound(selected=false){
  if(typeof synthTone!=='function')return;
  try{
   const notes=selected?[880,1320]:[660,990,1320];
   notes.forEach((frequency,n)=>synthTone({frequency,endFrequency:frequency*(selected?1.08:1.015),duration:selected?.28:.48,type:'sine',gain:n===0?.025:.012,delay:n*.065}));
  }catch{}
 }
 function clearPulseAnalysis(){
  clearTimeout(analysisTimer);root.querySelector('.ae-analysis')?.remove();root.classList.remove('ae-analysis-active');
  const panel=stage(),header=root.querySelector('.ae-header');if(panel){panel.inert=false;panel.removeAttribute('aria-hidden');}if(header)header.inert=false;
 }
 function showPulseChoices(options,onSelect){
  clearPulseAnalysis();root.classList.add('ae-analysis-active');stage().inert=true;stage().setAttribute('aria-hidden','true');root.querySelector('.ae-header').inert=true;
  const overlay=document.createElement('section');overlay.className='ae-analysis';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','ae-analysis-title');
  const heading=document.createElement('h2');heading.id='ae-analysis-title';heading.textContent='PULSE ANALYSIS';overlay.append(heading);
  const actions=document.createElement('div');actions.className='ae-analysis-options';actions.setAttribute('aria-label','Choose your response');
  const order=[0,1,2,3,4];for(let n=4;n>0;n--){const j=Math.floor(Math.random()*(n+1));[order[n],order[j]]=[order[j],order[n]];}
  let selected=false;
  order.forEach((i,j)=>{
   const b=button(options[i],()=>{if(selected)return;selected=true;b.classList.add('is-selected');actions.querySelectorAll('button').forEach(x=>{x.disabled=true;});pulseChoiceSound(true);onSelect(i);},'ae-analysis-option');
   b.style.setProperty('--choice-delay',j*55+'ms');actions.append(b);
  });
  overlay.append(actions);root.append(overlay);
  overlay.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const buttons=[...actions.querySelectorAll('button:not(:disabled)')];if(!buttons.length){event.preventDefault();return;}const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  actions.querySelector('button').focus({preventScroll:true});pulseChoiceSound();
 }
 function resolvePulseChoice(callback){
  const overlay=root.querySelector('.ae-analysis');if(!overlay){callback();return;}
  overlay.classList.add('is-resolving');
  analysisTimer=setTimeout(()=>{clearPulseAnalysis();callback();stage().querySelector('button')?.focus({preventScroll:true});},matchMedia('(prefers-reduced-motion: reduce)').matches?0:420);
 }

 function playNpcEncounter(original){
  const e=variant(original),cfg={...(npcScenes[e.id]||storyScenes[e.id]||{})};
  if(e.id===2)cfg.secondary='cafe';
  if(e.id===19){cfg.label=s.answers[12]!==undefined?'MESSENGER':'COURIER';cfg.frames=s.answers[12]!==undefined?['messenger-2']:['courier-3'];}
  if(e.id===20&&[2,3].includes(s.answers[16])){cfg.frames=['xar-8','xar-8'];cfg.label='XAR';}
  if(e.id===20&&s.answers[16]===1){cfg.frames=['xar-8'];cfg.secondary='stable-7';cfg.label='XAR & STABLE';}
  shell();root.dataset.mode='cutscene';root.dataset.encounter=e.id;
  let intro=cfg.intro||[e.text],choiceFrame=cfg.choice||0;
  if(e.id===7&&s.answers[3]===2)intro=[...intro,'You remember the stranger asking about a girl. Could he have meant her?'];
  if(e.id===13&&s.answers[3]===2)intro=[...intro,'The question from the street returns to you: was this who he was looking for?'];
  if(e.id===17){choiceFrame=s.answers[4]===0?0:s.answers[4]===4?2:1;intro=['The artists are working together beside their display.',e.text];}
  // The supplied first helper file is empty; use its nearest valid holding-work pose.
  if(e.id===17)cfg.frames=cfg.frames.map(key=>key==='artist-helper-1'?'artist-helper-2':key);
  let beat=0;
  function paint(text,label,frame,shot){
   stage().innerHTML='';if(shot)sceneArtwork(shot);else{clearShot();npcArtwork(cfg.frames?.[frame]||cfg.frames?.[0],e.id===17?'artist-3':cfg.secondary);}
   const box=document.createElement('section');box.className='ae-dialogue';box.setAttribute('aria-live','polite');box.innerHTML=(label?'<small>'+escape(label)+'</small>':'')+'<p>'+escape(text)+'</p>';stage().append(box);
  }
  function advance(){
   if(beat<intro.length){const frame=e.id===17?choiceFrame:Math.min(beat,cfg.choice||0);paint(intro[beat],intro[beat].startsWith('“')?cfg.label||'':'',frame,cfg.shots?.[beat]);beat++;stage().append(button('Continue',advance,'ae-continue'));return;}choices();
  }
  function choices(){
   paint(intro[intro.length-1],intro[intro.length-1].startsWith('“')?cfg.label||'':'',choiceFrame,cfg.choiceShot);
   showPulseChoices(e.options,answer);
  }
  function answer(i){
   if(s.answers[e.id]!==undefined)return;s.answers[e.id]=i;s.followVisits={...s.followVisits,[e.id]:s.visits};if(e.story!==undefined){s.step++;s.lastStoryVisit=s.visits;}s.log.push({id:e.id,text:e.options[i],reply:e.replies[i]});save();
   resolvePulseChoice(()=>{paint(narrateChoice(e.options[i]),'',choiceFrame,cfg.choiceShot);stage().append(button('Continue',()=>{paint(e.replies[i],e.replies[i].startsWith('“')?cfg.label||'':'',cfg.result??choiceFrame,cfg.resultShot||cfg.choiceShot);if(e.id===10&&i>=2)npcArtwork('courier-3','repairer');stage().append(button('Continue',finish,'ae-continue'));},'ae-continue'));});
  }
  function finish(){
   const ending=e.end||({4:'The artist secures the recovered sketches against their chest.',9:'The bag is secure. Boarding continues.',10:'The delivery is arranged.',12:'The arrangement is made.',17:'The artists return to their work.'}[e.id]||'The exchange ends. The street opens ahead of you.');
   paint(ending,'',cfg.end??cfg.result??0,cfg.endShot);
   const continuation=e.story>=3&&e.story<6;
   stage().append(button(continuation?'Continue':'Continue your walk',()=>{s.visits++;save();if(continuation)renderEncounter(events.find(x=>x.story===s.step));else walkFrame();},'ae-continue'));
  }
  advance();
 }
 function renderEncounter(original){return playNpcEncounter(original);}
 function watch(){clearTimeout(travelTimer);shell();stage().innerHTML='<section class="ae-watch"><small>EGO WATCH</small><h1>Your record</h1><p>Your discoveries stay here. Elli’s work is available whenever you want to browse.</p><div id="ae-watch-links"></div><div id="ae-record"></div></section>';const links=root.querySelector('#ae-watch-links');links.append(button('Portfolio · About Elli',()=>{close();selectCreatorTab('overview');show('creator-record')},'ae-continue'));links.append(button('Music',()=>{close();show('song-collection')},'ae-continue'));links.append(button('Return to the city',walkFrame,'ae-continue'));const record=root.querySelector('#ae-record');
 const knownNPCs={1:['Station worker','station'],2:['Refreshment stand','bell'],4:['Artist','fluxWorkshop'],6:['Café attendant','cinder'],9:['Tram passenger','tram'],10:['Courier and repair worker','copper'],12:['Messenger','council']};
 for(const [id,[name,key]] of Object.entries(knownNPCs)){if(s.answers[id]!==undefined)record.innerHTML+='<h2>'+escape(name)+'</h2><p>Met at '+escape(places[key].name)+'.</p>';}
 const map=document.createElement('details');map.className='ae-map';map.innerHTML='<summary>Aetheridge · Streets and districts</summary>';const list=document.createElement('div');Object.entries(districts).forEach(([key,d])=>{const p=document.createElement('p');p.textContent=d.name+' — '+Object.values(places).filter(x=>x.area===key).map(x=>x.name).join(', ');list.append(p)});map.append(list);if(s.answers[3]!==undefined)record.innerHTML+='<h2>'+((s.answers[14]!==undefined)?'Xar':'Encounter near the station')+'</h2><p>A hurried stranger. '+(s.answers[3]===2?'He said he was looking for a girl.':'He left down the street.')+'</p>';if(s.answers[7]!==undefined)record.innerHTML+='<h2>'+(s.answers[14]===3?'Stable':'Encounter at the junction')+'</h2><p>She pointed out a misleading sign.'+(s.answers[15]!==undefined?' Later, she helped you onto intact ground.':'')+'</p>';if(Object.keys(s.answers).length===20){const counts=pulses.map((p,i)=>({p,n:Object.values(s.answers).filter(v=>v===i).length})).sort((a,b)=>b.n-a.n);record.innerHTML+='<h2>Your Pulse observations</h2><p>'+escape(counts[0].n===counts[1].n?'Several directions remain equally prominent. Your record preserves that uncertainty.':counts[0].p+' is the strongest direction in your responses. '+counts[1].p+' is another direction you used.')+'</p>';}else record.innerHTML+='<h2>Your Pulse</h2><p>Observations are still emerging through your experiences.</p>';record.prepend(map);s.log.forEach(l=>{const d=document.createElement('details');d.innerHTML='<summary>'+escape(l.text)+'</summary><p>'+escape(l.reply)+'</p>';record.append(d)});}
 window.Aetheridge={events,encounterPlaces,npcScenes,places,districts,pulses,open:mount,eligible,getState:()=>s};
 // Retain the site's nine station poses and first seven introduction beats.
 PROLOGUE[7]={...PROLOGUE[7],text:'Go look around. There’s plenty to discover.'};
 PROLOGUE[8]={...PROLOGUE[8],text:'Your EGO Watch is ready. Take your time—your Pulse reveals itself through experience. Elli’s work is available whenever you want to browse.'};
 enterCityFromStation=()=>mount();
 cityOpen=()=>mount();
 resumeCity=()=>mount();
 ['city-resume','city-enter-result','city-return','gateway-begin'].forEach(id=>document.getElementById(id)?.addEventListener('click',ev=>{if(id==='gateway-begin'&&sessionStorage.getItem('egoCheck.stationIntroSeen.v1')!=='true')return;ev.preventDefault();ev.stopImmediatePropagation();mount()},{capture:true}));
 showVnChoices=()=>mount();
 ['vn-access','vn-not-yet','vn-skip'].forEach(id=>document.getElementById(id)?.addEventListener('click',ev=>{ev.preventDefault();ev.stopImmediatePropagation();mount()},{capture:true}));
 document.getElementById('vn-access').textContent='Explore Aetheridge';
 const quick=button('Explore Aetheridge',mount,'ae-launch');document.querySelector('.gateway-actions')?.prepend(quick);
 const returnButton=button('EGO Watch · Return to Aetheridge',mount,'ae-return');document.body.append(returnButton);
 document.getElementById('gateway-feedback').textContent='EXPLORE AT YOUR OWN PACE';
 document.getElementById('gateway-lede').textContent='Meet Pulse and Echo, explore Aetheridge, or browse the work behind this world.';
})();

