(() => {
  'use strict';
  const beats = [
    ['PULSE',1,4,'There you are.'],
    ['ECHO',4,1,'Your connection’s stable now.'],
    ['PULSE',1,4,'I’m Pulse. That’s Echo.'],
    ['ECHO',4,2,'Everyone has a Pulse. Yours is how you naturally respond under pressure.'],
    ['PULSE',2,4,'And in here, you can actually see it.'],
    ['ECHO',4,2,'EGO can reveal yours through experience.'],
    ['PULSE',3,4,'Go find something that interests you.'],
    ['ECHO',4,3,'Take your time—you don’t need to make anything happen.']
  ];
  PROLOGUE.splice(0,PROLOGUE.length,...beats.map(([speaker,pulse,echo,text])=>({speaker,pulse:`portrait-${pulse}`,echo:`portrait-${echo}`,text,identified:true})));
  for (const [character,count] of [['pulse',4],['echo',4]]) {
    for(let i=1;i<=count;i++) INTRO_CHARACTER_POSES[character].push(`portrait-${i}`);
  }
  const poseTransitions=new Map();
  const originalSet=setIntroCharacter;
  setIntroCharacter=function(character,pose,options={}) {
    if(!pose.startsWith('portrait-')) return originalSet(character,pose,options);
    const image=document.getElementById(`vn-${character}-character`);
    const wrap=image?.closest('.intro-character');
    if(!image||!wrap||image.dataset.pose===pose)return;
    const request=++stationPoseRequest[character];
    const src=`assets/intro/crossmere/${character}-${pose.slice(9)}${character==='pulse'?'-v2':''}.webp`;
    image.dataset.pose=pose;
    poseTransitions.get(character)?.();
    wrap.querySelector('.station-pose-incoming')?.remove();
    readyStationPose(src).then(ok=>{
      if(request!==stationPoseRequest[character])return;
      if(!ok||options.instant||matchMedia('(prefers-reduced-motion: reduce)').matches){image.src=src;return;}
      const next=image.cloneNode(false);
      next.removeAttribute('id');next.className='station-pose-incoming';next.src=src;next.alt='';next.setAttribute('aria-hidden','true');
      wrap.append(next);
      const timing={duration:180,easing:'ease-in-out',fill:'forwards'};
      const outgoing=image.animate([{opacity:1},{opacity:0}],timing);
      const incoming=next.animate([{opacity:0},{opacity:1}],timing);
      let settled=false;
      const finish=()=>{
        if(settled)return;settled=true;
        image.src=src;
        outgoing.cancel();incoming.cancel();next.remove();
        if(poseTransitions.get(character)===finish)poseTransitions.delete(character);
      };
      poseTransitions.set(character,finish);
      incoming.finished.then(finish,()=>{});

    });
  };
  const originalStart=startPrologue;
  startPrologue=function(...args){const result=originalStart(...args);setIntroCharacter('pulse','portrait-1',{instant:true});setIntroCharacter('echo','portrait-4',{instant:true});document.getElementById('vn-access').textContent='Look around';return result;};
  const background=document.querySelector('#prologue .intro-background');
  background.src='assets/intro/crossmere/station.webp';background.loading='eager';
  document.querySelector('#prologue .station-loop-video')?.remove();
  setIntroCharacter('pulse','portrait-1',{instant:true});setIntroCharacter('echo','portrait-4',{instant:true});
  warmStationPoses=()=>{for(const [character,count] of [['pulse',4],['echo',4]])for(let i=1;i<=count;i++)readyStationPose(`assets/intro/crossmere/${character}-${i}${character==='pulse'?'-v2':''}.webp`);};
  document.getElementById('vn-access').textContent='Look around';
  document.getElementById('vn-not-yet').hidden=true;
  window.Aetheridge.districts.Station.name='Crossmere';
  window.Aetheridge.places.station.name='Crossmere Station · Forecourt';
})();
