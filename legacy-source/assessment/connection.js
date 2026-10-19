
/* The connection opens directly into the station; no designation form. */
window.enterEgoStation=function({cinematic=true}={}){
 if(document.body.classList.contains('station-arriving'))return;
 document.body.classList.add('station-arriving');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const arrive=()=>{window.stopEgoOpeningVoice?.();document.body.classList.add('terminal-awake','cinematic-entered');startPrologue();};
 if(!cinematic||reduced){arrive();document.body.classList.remove('station-arriving');return;}
 const veil=document.createElement('div');veil.className='prism-arrival';veil.setAttribute('aria-hidden','true');
 veil.innerHTML='<div class="prism-arrival-colors"></div><div class="prism-arrival-pearl"></div><div class="prism-arrival-rays"></div>';
 document.body.append(veil);
 const skip=document.createElement('button');skip.type='button';skip.className='prism-arrival-skip';skip.textContent='Skip transition';document.body.append(skip);
 let arrived=false,ended=false;
 const reveal=()=>{if(arrived)return;arrived=true;arrive();};
 const end=()=>{if(ended)return;ended=true;reveal();veil.remove();skip.remove();document.body.classList.remove('station-arriving');document.removeEventListener('keydown',escape);};
 const escape=e=>{if(e.key==='Escape'){e.preventDefault();end();}};
 skip.addEventListener('click',end);document.addEventListener('keydown',escape);
 setTimeout(reveal,1700);setTimeout(end,4300);
};
/* A single shared state drives the emblem, city, lettering and contact dialogue. */
window.initSystemBoot = function ({skip=false}={}) {
 const boot=document.getElementById('system-boot');if(!boot)return;
 const key='egoCheck.boot.v239',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const asset='assets/connection/';let phase='attempt',finished=false,replyCount=0,timers=[];
 const sounds={connect:new Audio('assets/ego-check-system/EGO_DeviceConnect.wav'),error:new Audio('assets/ego-check-system/EGO_Error.wav'),disconnect:new Audio('assets/ego-check-system/EGO_DeviceDisconnect.wav')};
 const effect=name=>{const a=sounds[name];if(!a||!audioSettings.enabled||audioSettings.sfxVolume<=0)return;a.volume=Math.min(.8,audioSettings.sfxVolume*.8);a.currentTime=0;a.play().catch(()=>{});};
 const later=(fn,ms)=>timers.push(setTimeout(()=>{if(!finished)fn()},ms));
 let seen=false;try{seen=sessionStorage.getItem(key)==='complete'}catch(_){}
 if(skip||(seen&&!new URLSearchParams(location.search).has('intro'))||isCreatorStandalone()){document.body.dataset.connectionPhase='connected';document.body.classList.add('terminal-awake','cinematic-entered');boot.remove();if(typeof syncMusicConsoleLock==='function')syncMusicConsoleLock();if(!isCreatorStandalone()&&document.body.dataset.screen==='gateway')window.enterEgoStation({cinematic:false});return}
 document.body.classList.add('booting','system-boot-active');
 boot.className='system-boot signal-wakeup';boot.setAttribute('role','dialog');boot.setAttribute('aria-modal','true');boot.setAttribute('aria-label','Wake the EGO Check system');
 boot.innerHTML=`<div class="wake-map" aria-hidden="true"><img class="wake-terrain" src="${asset}aetheridge-dream.webp" alt="">${['anchor','flow','shift','surge','flux'].map(p=>`<img class="wake-district wake-${p}" src="${asset}aetheridge-dream.webp" alt="">`).join('')}</div><div class="wake-aurora" aria-hidden="true"></div><div class="wake-clouds" aria-hidden="true"></div><svg class="wake-wings" viewBox="0 0 1000 500" aria-hidden="true"><defs><linearGradient id="wingLight"><stop stop-color="#7abaff" stop-opacity="0"/><stop offset=".5" stop-color="#fff0ce"/><stop offset="1" stop-color="#e0edff" stop-opacity="0"/></linearGradient></defs>${Array.from({length:7},(_,i)=>`<path d="M500 290 Q${300-i*17} ${270-i*20} ${90+i*26} ${80+i*22} M500 290 Q${700+i*17} ${270-i*20} ${910-i*26} ${80+i*22}"/>`).join("")}</svg><img class="wake-city-heart" src="${asset}aetheridge-dream.webp" alt="" aria-hidden="true"><div class="wake-shade" aria-hidden="true"></div><div class="wake-dust" aria-hidden="true">${Array.from({length:24},(_,i)=>`<i style="--dust-x:${(i*37+11)%100}%;--dust-y:${(i*23+9)%100}%;--dust-delay:-${i*.7}s;--dust-duration:${12+i%7}s"></i>`).join('')}</div><svg class="wake-routes" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path class="wake-route wake-route-anchor" d="M790 490 L590 535 L455 558 L321 493 L263 395 L313 337 L418 355"/><path class="wake-route wake-route-flow" d="M790 490 L827 584 L962 648 L966 802 L878 873 L681 825 L565 686"/><path class="wake-route wake-route-shift" d="M790 490 L758 429 L738 302 L630 261 L535 300 L454 394 L500 474 L640 505"/><path class="wake-route wake-route-surge" d="M790 490 L1032 464 L1247 454 L1370 387 L1257 296 L1063 278 L1014 352"/><path class="wake-route wake-route-flux" d="M790 490 L805 298 L816 208 L880 143 L964 174 L1033 247"/></svg><header class="wake-header"><span>EC // SIGNAL INTERFACE</span><span id="wake-link">CONTACT PENDING</span></header><div class="wake-center"><div class="wake-emblem" aria-hidden="true">${['core','null','apex','prism'].map(p=>`<img class="wake-logo wake-logo-${p}" src="${asset+p}.webp" alt="" ${p==='core'?'fetchpriority="high"':''}>`).join('')}<i class="wake-halo"></i><i class="wake-voice-ring"></i><i class="wake-contact-ring"></i><i class="wake-wave"></i><i class="wake-wave wake-wave-second"></i><i class="wake-facet-light"></i></div><h1>EGO CHECK</h1><p id="wake-status" role="status">Connecting…</p><p id="wake-detail">An external signal is trying to reach you.</p><div class="wake-channel" aria-label="Core channels" hidden>${['Anchor','Flow','Shift','Surge','Flux'].map(p=>`<span data-channel="${p.toLowerCase()}">${p}</span>`).join('')}</div></div><section class="wake-dialogue" aria-label="Talk to the system"><small>YOU</small><p id="wake-thought"></p><div id="wake-actions"></div></section><footer class="wake-footer"><span id="wake-footer-state">EXTERNAL CONTACT // SEARCHING</span><button id="wake-skip" type="button">Skip opening</button></footer>`;
 const get=id=>document.getElementById(id),actions=get('wake-actions'),dialogue=boot.querySelector('.wake-dialogue');
 const app=get('app');const wasInert=app?.inert;if(app)app.inert=true;
 const colors={attempt:'#a599f7',null:'#80749a',apex:'#f4cc65',anchor:'#67e1a2',flow:'#66bdff',shift:'#ba8aff',surge:'#ff758c',flux:'#ffae6b',prism:'#e5dcff'};
 const set=(next,status,detail)=>{phase=next;boot.classList.remove('text-arrive');requestAnimationFrame(()=>{if(!finished)boot.classList.add('text-arrive')});boot.classList.remove('pulse-beat');requestAnimationFrame(()=>{if(!finished)boot.classList.add('pulse-beat')});boot.dataset.phase=next;document.body.dataset.connectionPhase=next;boot.style.setProperty('--wake-color',colors[next]);get('wake-status').textContent=status;get('wake-detail').textContent=detail;get('wake-link').textContent=next==='null'?'OFFLINE':next==='prism'?'CONNECTED':next==='apex'?'SIGNAL HELD':'CONNECTING';get('wake-footer-state').textContent=next==='null'?'COMMUNICATION CHANNEL // SILENT':next==='prism'?'AETHERIDGE // ONLINE':'AETHERIDGE // RESTORING';};
 const finish=(value)=>{if(finished)return;if(value!=='enter')window.stopEgoOpeningVoice?.();finished=true;window.stopEgoHeartbeat?.();timers.forEach(clearTimeout);try{sessionStorage.setItem(key,'complete')}catch(_){}boot.classList.add('complete');boot.setAttribute('aria-hidden','true');document.body.classList.remove('booting','system-boot-active');document.body.dataset.connectionPhase='connected';document.body.classList.add('terminal-awake','cinematic-entered');if(typeof syncMusicConsoleLock==='function')syncMusicConsoleLock();const gatewayStatus=get('gateway-status');if(gatewayStatus?.lastChild)gatewayStatus.lastChild.textContent=' LOCAL TERMINAL // ONLINE';if(app)app.inert=wasInert;window.enterEgoStation({cinematic:value==='enter'});setTimeout(()=>boot.remove(),1100);document.removeEventListener('keydown',keyboard);document.removeEventListener('pointermove',look);document.removeEventListener('ego-voice-cue',voiceCue);document.removeEventListener('ego-voice-progress',progress);document.removeEventListener('ego-voice-unavailable',fallback);};
 let fullscreenRequested=false;
 const requestOpeningFullscreen=()=>{if(fullscreenRequested)return;fullscreenRequested=true;if(document.fullscreenElement||document.webkitFullscreenElement)return;const root=document.documentElement;try{const request=root.requestFullscreen||root.webkitRequestFullscreen;if(request){const result=request.call(root);result?.catch?.(()=>{});}}catch(_){} };
 const choose=(lines,handler)=>{actions.replaceChildren();for(const [label,value] of lines){const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>{requestOpeningFullscreen();handler(value,label);});actions.append(button)}dialogue.classList.add('visible');actions.querySelector('button')?.focus({preventScroll:true});};
 const sound=()=>{effect('disconnect');if(typeof playSignalLock==='function')playSignalLock();};
 const revealPrism=()=>{if(finished||phase==='prism'||phase==='null'||phase==='attempt')return;set('prism','Connected.','Aetheridge is coming alive.');boot.classList.add('all-connected');if(typeof playReveal==='function')playReveal();if(typeof switchToPlayerMusic==='function')switchToPlayerMusic();};
 const voiceCue=()=>revealPrism();document.addEventListener('ego-voice-cue',voiceCue);
 const look=e=>{if(reduced||phase==='null'||phase==='apex')return;boot.style.setProperty('--look-x',`${(e.clientX/innerWidth-.5)*5}px`);boot.style.setProperty('--look-y',`${(e.clientY/innerHeight-.5)*5}px`);};document.addEventListener('pointermove',look,{passive:true});

 let sequenceStarted=false,channelIndex=0,entryScheduled=false,fallbackTimer=null;
 const channels=['anchor','flow','shift','surge','flux'];
 const showEntry=()=>{if(entryScheduled||finished)return;entryScheduled=true;later(()=>{finish('enter');},reduced?250:1800);};
 const advance=time=>{
  if(!sequenceStarted||finished)return;
  while(channelIndex<5&&time>=2.2+channelIndex*1.65){
   const p=channels[channelIndex++];set(p,'Aetheridge is waking.',p[0].toUpperCase()+p.slice(1)+'.');
   boot.classList.add('revealed-'+p);boot.querySelector('[data-channel="'+p+'"]').classList.add('online');boot.querySelector('.wake-route-'+p)?.classList.add('online');
  }
  if(time>=11.8){revealPrism();showEntry();}
 };
 const progress=e=>advance(e.detail.time);
 const fallback=()=>{if(!sequenceStarted||fallbackTimer)return;let elapsed=0;fallbackTimer=setInterval(()=>{if(finished){clearInterval(fallbackTimer);return;}if(document.hidden)return;elapsed+=.1;advance(elapsed);},100);timers.push(fallbackTimer);};
 document.addEventListener('ego-voice-progress',progress);document.addEventListener('ego-voice-unavailable',fallback);
 const awaken=()=>{if(phase!=='null')return;sequenceStarted=true;readyStationPose('assets/intro/station-beat-1.webp');readyStationPose('assets/intro/station-beat-2.webp');actions.replaceChildren();dialogue.classList.remove('visible');set('apex','Something is still here.','');effect('connect');
  get('wake-link').textContent='CREATOR TRACE // RECOVERED';boot.querySelector('.wake-channel').hidden=false;
  window.startEgoHeartbeat?.();if(!window.startEgoOpeningVoice?.())fallback();
 };
 const reply=(value,label)=>{window.prepareEgoOpeningVoice?.();replyCount++;boot.classList.remove('contact-transmitting');requestAnimationFrame(()=>boot.classList.add('contact-transmitting'));get('wake-thought').textContent=label;actions.replaceChildren();sound();get('wake-status').textContent='…';get('wake-detail').textContent='';
  later(()=>{get('wake-status').textContent=value==='question'?'EGO Check.':'…Contact received.';get('wake-detail').textContent=value==='question'?'Connection incomplete.':'Your signal reached the system.';get('wake-thought').textContent='';boot.classList.add('contact-received');choose([['Can you hear me?','hear']],()=>{actions.replaceChildren();get('wake-thought').textContent='Can you hear me?';get('wake-status').textContent='Yes.';get('wake-detail').textContent='Keep the channel open?';if(typeof playSignalLock==='function')playSignalLock();later(()=>choose([["I’m here.",'here'],['Restore Signal','restore']],awaken),reduced?150:650);});},reduced?250:1000);
 };
 const offline=()=>{set('null','Connection lost.','No response.');effect('error');later(()=>effect('disconnect'),250);get('wake-thought').textContent='';choose([["Hello?",'contact'],['What is this?','question']],reply);};
 const keyboard=event=>{if(event.key==='Escape'){event.preventDefault();finish();return}if(event.key==='Tab'){const buttons=[...boot.querySelectorAll('button')].filter(b=>b.offsetParent!==null);const first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}};
 get('wake-skip').addEventListener('click',finish);document.addEventListener('keydown',keyboard);set('attempt','Connecting…','Establishing contact.');get('wake-skip').focus();later(offline,reduced?400:2300);
};
window.initOpeningBoot = window.initSystemBoot;
/* Keep the recovered city present at the terminal, behind readable surfaces. */
const connectedMap=document.createElement('div');connectedMap.className='connected-city-map';connectedMap.setAttribute('aria-hidden','true');document.body.prepend(connectedMap);

/* The recording itself drives the glow; no microphone or speech recognition is used. */
(()=>{
 const voice=new Audio('assets/connection/raylene-creator-trace.mp3');voice.preload='auto';voice.load();
 const control=document.createElement('button');control.type='button';control.className='raylene-voice-control';control.hidden=true;control.textContent='Pause creator trace';control.setAttribute('aria-label','Pause recovered creator voice');document.body.append(control);
 let started=false,monitor=null,audioContext=null,analyser=null,waveform=null,spectrum=null,frame=null,energy=0,air=0,lastBloom=0,cued=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let lastVisualFrame=0;
 const visualStyle=()=>document.querySelector('.signal-wakeup')?.style||document.body.style;
 window.prepareEgoOpeningVoice=()=>{if(voice.readyState===0)voice.load();};
 const updateMusic=()=>{if(typeof activeMusic==='function'&&typeof musicTargetVolume==='function')activeMusic().volume=musicTargetVolume();};
 const resetVisual=()=>{cancelAnimationFrame(frame);frame=null;energy=0;visualStyle().setProperty('--voice-energy','0');visualStyle().setProperty('--voice-air','0');document.body.classList.remove('creator-voice-present');};
 const followVoice=(timestamp=0)=>{
  if(voice.paused||voice.ended){resetVisual();return;}
  if(timestamp&&timestamp-lastVisualFrame<33){frame=requestAnimationFrame(followVoice);return;}lastVisualFrame=timestamp;
  let rms=0;if(analyser){analyser.getByteTimeDomainData(waveform);for(const sample of waveform)rms+=((sample-128)/128)**2;rms=Math.sqrt(rms/waveform.length);}
  let shimmer=0;if(analyser&&spectrum){analyser.getByteFrequencyData(spectrum);for(let i=12;i<70;i++)shimmer+=spectrum[i]/255;shimmer/=58;}air+=(shimmer-air)*.1;visualStyle().setProperty('--voice-air',reduced?'0':air.toFixed(3));
  const target=Math.min(1,Math.max(0,(rms-.004)*9));energy+=(target-energy)*(target>energy?.18:.07);
  if(!reduced&&target>.16&&target-energy>.045&&performance.now()-lastBloom>1100){lastBloom=performance.now();const field=document.querySelector('.signal-wakeup');if(field){field.classList.remove('voice-bloom');requestAnimationFrame(()=>{if(field.isConnected)field.classList.add('voice-bloom');});}}
  visualStyle().setProperty('--voice-energy',reduced?'0':energy.toFixed(3));document.body.classList.toggle('creator-voice-present',energy>.025);
  document.dispatchEvent(new CustomEvent('ego-voice-progress',{detail:{time:voice.currentTime}}));
  if(!cued&&voice.currentTime>=11.8){cued=true;document.dispatchEvent(new CustomEvent('ego-voice-cue'));}
  frame=requestAnimationFrame(followVoice);
 };
 const prepareAnalysis=()=>{
  if(!audioContext){try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(AudioCtx){audioContext=new AudioCtx();const source=audioContext.createMediaElementSource(voice);analyser=audioContext.createAnalyser();analyser.fftSize=512;waveform=new Uint8Array(analyser.fftSize);spectrum=new Uint8Array(analyser.frequencyBinCount);analyser.smoothingTimeConstant=.72;source.connect(analyser);analyser.connect(audioContext.destination);}}catch(_){analyser=null;}}
  audioContext?.resume().catch(()=>{});
 };
 const sync=()=>{window.egoOpeningVoiceActive=!voice.paused&&!voice.ended;window.egoOpeningVoicePaused=voice.paused&&!voice.ended&&voice.currentTime>0;control.textContent=voice.paused?'Resume creator trace':'Pause creator trace';control.setAttribute('aria-label',control.textContent);control.setAttribute('aria-pressed',String(!voice.paused));updateMusic();if(voice.paused)resetVisual();else if(frame===null)followVoice();};
 window.stopEgoOpeningVoice=()=>{voice.pause();voice.currentTime=0;control.hidden=true;window.egoOpeningVoiceActive=false;clearInterval(monitor);monitor=null;resetVisual();audioContext?.suspend().catch(()=>{});updateMusic();};
 const play=()=>{prepareAnalysis();voice.play().then(()=>{control.hidden=false;sync();}).catch(()=>{control.hidden=false;control.textContent='Play creator trace';control.setAttribute('aria-label','Play creator trace');document.dispatchEvent(new CustomEvent('ego-voice-unavailable'));});};
 window.startEgoOpeningVoice=()=>{if(started||!audioSettings.enabled||audioSettings.sfxVolume<=0)return false;started=true;voice.volume=Math.min(.85,Math.max(0,audioSettings.sfxVolume));play();monitor=setInterval(()=>{if(!audioSettings.enabled||(!document.body.classList.contains('system-boot-active')&&document.body.dataset.screen!=='gateway')){window.stopEgoOpeningVoice();return}voice.volume=Math.min(.85,Math.max(0,audioSettings.sfxVolume));updateMusic();if(document.hidden&&musicBoxUi.muteWhenUnfocused){voice.pause();sync();}},500);return true;};
 control.addEventListener('click',()=>{if(voice.paused){if(audioSettings.enabled)play();}else{voice.pause();sync();}});
 voice.addEventListener('error',()=>document.dispatchEvent(new CustomEvent('ego-voice-unavailable')));
 voice.addEventListener('ended',()=>{document.dispatchEvent(new CustomEvent('ego-voice-progress',{detail:{time:Math.max(11.8,voice.currentTime)}}));window.stopEgoOpeningVoice();});voice.addEventListener('pause',sync);voice.addEventListener('playing',sync);
})();


/* One heartbeat launches the light envelope and schedules the matching sound. */
(()=>{
 let ctx=null,timer=null,running=false,nodes=new Set(),animations=[];
 const envelope=[{opacity:0,offset:0},{opacity:.38,offset:.08},{opacity:.06,offset:.18},{opacity:.28,offset:.26},{opacity:0,offset:1}];
 const beat=()=>{
  if(!running||document.hidden||window.egoOpeningVoicePaused)return;
  const field=document.querySelector('.signal-wakeup');
  if(!field||!['anchor','flow','shift','surge','flux','prism'].includes(field.dataset.phase))return;
  animations=animations.filter(a=>a.playState!=='finished');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const city=field.querySelector('.wake-city-heart'),ring=field.querySelector('.wake-contact-ring'),halo=field.querySelector('.wake-halo');
   for(const [el,frames] of [[city,envelope],[ring,[{opacity:.6,transform:'scale(.88)'},{opacity:0,transform:'scale(1.9)'}]],[halo,[{opacity:.15,transform:'scale(1)'},{opacity:.55,transform:'scale(1.045)',offset:.08},{opacity:.18,transform:'scale(1.01)',offset:.18},{opacity:.4,transform:'scale(1.035)',offset:.26},{opacity:.15,transform:'scale(1)'}]]]){
    if(el?.animate)animations.push(el.animate(frames,{duration:1300,easing:'linear'}));
   }
  }
  if(!ctx||ctx.state!=='running'||!audioSettings.enabled)return;
  const volume=Math.max(0,Math.min(1,audioSettings.sfxVolume))*.105;if(!volume)return;
  for(const [delay,strength] of [[0,1],[.234,.65]]){
   const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+.02+delay;
   osc.type='triangle';osc.frequency.setValueAtTime(110,t);osc.frequency.exponentialRampToValueAtTime(52,t+.18);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume*strength,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+.22);
   osc.connect(gain);gain.connect(ctx.destination);nodes.add(osc);osc.onended=()=>{nodes.delete(osc);osc.disconnect();gain.disconnect();};osc.start(t);osc.stop(t+.25);
  }
 };
 window.startEgoHeartbeat=()=>{if(running)return;running=true;window.egoOpeningVoicePaused=false;try{const AC=window.AudioContext||window.webkitAudioContext;if(AC){ctx??=new AC();ctx.resume().catch(()=>{});}}catch(_){}timer=setInterval(beat,1400);};
 window.stopEgoHeartbeat=()=>{running=false;clearInterval(timer);timer=null;animations.forEach(a=>a.cancel());animations=[];for(const osc of nodes){try{osc.stop();}catch(_){}}nodes.clear();ctx?.suspend().catch(()=>{});};
})();
