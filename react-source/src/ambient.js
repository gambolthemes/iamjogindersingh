// Soft ambient music generated in the browser with the Web Audio API: slow pad chords, an occasional
// bell note and a long reverb. No audio file is needed, so there is nothing to license or download.
// If profile.music points to an audio file, that file is played (looped) instead.
const hz=m=>440*Math.pow(2,(m-69)/12);
const CHORDS=[[48,52,55,59],[45,48,52,55],[41,45,48,52],[43,47,50,52]]; // Cmaj7, Am7, Fmaj7, G6
const BELLS=[72,74,76,79,81,84]; // C major pentatonic
const CHORD_SECONDS=8;
const VOLUME=0.5;      // generated music
const FILE_VOLUME=0.45; // music file (already normalised to a soft level)

function impulse(ctx,seconds,decay){
  const len=Math.floor(ctx.sampleRate*seconds),buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay)}
  return buf;
}

export function createAmbient(src){
  const AC=window.AudioContext||window.webkitAudioContext;
  let ctx=null,master=null,bus=null,analyser=null,data=null,scheduler=null,audio=null;
  let playing=false,wantsSound=false,nextChord=0,nextBell=0,chordIndex=0;
  const listeners=new Set();
  const emit=()=>listeners.forEach(f=>f(playing));

  function build(){
    ctx=new AC();
    master=ctx.createGain();master.gain.value=0;
    analyser=ctx.createAnalyser();analyser.fftSize=512;analyser.smoothingTimeConstant=0.8;
    data=new Uint8Array(analyser.frequencyBinCount);
    bus=ctx.createGain();
    const dry=ctx.createGain();dry.gain.value=0.7;
    const verb=ctx.createConvolver();verb.buffer=impulse(ctx,3.4,2.4);
    const wet=ctx.createGain();wet.gain.value=0.55;
    bus.connect(dry);dry.connect(master);
    bus.connect(verb);verb.connect(wet);wet.connect(master);
    master.connect(analyser);analyser.connect(ctx.destination);
  }

  function pad(freq,t,len,peak){
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1100;lp.Q.value=0.3;
    const env=ctx.createGain();
    env.gain.setValueAtTime(0,t);env.gain.linearRampToValueAtTime(peak,t+len*0.38);env.gain.linearRampToValueAtTime(0,t+len);
    lp.connect(env);env.connect(bus);
    [['triangle',-6],['sine',6]].forEach(([type,cents])=>{
      const o=ctx.createOscillator();o.type=type;o.frequency.value=freq;o.detune.value=cents;
      o.connect(lp);o.start(t);o.stop(t+len+0.1);
    });
  }

  function bell(freq,t){
    const o=ctx.createOscillator();o.type='sine';o.frequency.value=freq;
    const env=ctx.createGain();
    env.gain.setValueAtTime(0,t);env.gain.linearRampToValueAtTime(0.05,t+0.02);env.gain.exponentialRampToValueAtTime(0.0001,t+3.6);
    o.connect(env);env.connect(bus);o.start(t);o.stop(t+3.7);
  }

  function tick(){
    if(!ctx||ctx.state==='closed')return;
    const now=ctx.currentTime;
    while(nextChord<now+2){
      CHORDS[chordIndex%CHORDS.length].forEach(m=>pad(hz(m),nextChord,CHORD_SECONDS+1.5,0.035));
      pad(hz(CHORDS[chordIndex%CHORDS.length][0]-12),nextChord,CHORD_SECONDS+1.5,0.03);
      chordIndex++;nextChord+=CHORD_SECONDS;
    }
    while(nextBell<now+2){
      if(Math.random()>0.25)bell(hz(BELLS[Math.floor(Math.random()*BELLS.length)]),nextBell);
      nextBell+=2.5+Math.random()*3.5;
    }
  }

  async function start(){
    if(!AC||playing)return;
    wantsSound=true;playing=true;emit(); // the button reacts at once, even while a music file is still loading
    if(!ctx||ctx.state==='closed')build();
    const c=ctx;
    await c.resume();
    let file=null;
    if(src){
      const el=new Audio(src);el.loop=true;el.preload='auto';audio=el;
      try{
        c.createMediaElementSource(el).connect(master);
        await el.play();file=el;
      }catch{if(audio===el)audio=null} // file missing or blocked: use the generated music instead
    }
    if(ctx!==c)return; // stopped while loading
    if(!file){
      nextChord=c.currentTime+0.1;nextBell=c.currentTime+3;chordIndex=0;
      tick();scheduler=setInterval(tick,1000);
    }
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setTargetAtTime(file?FILE_VOLUME:VOLUME,c.currentTime,1.2); // slow fade in
  }

  function stop(){
    if(!playing)return;
    wantsSound=false;playing=false;emit();
    clearInterval(scheduler);scheduler=null;
    const c=ctx,a=audio,m=master;
    ctx=null;audio=null; // a quick restart builds a fresh context instead of reusing this one
    c.resume();m.gain.cancelScheduledValues(c.currentTime);
    m.gain.setTargetAtTime(0,c.currentTime,0.35); // fade out, then free the audio device
    setTimeout(()=>{if(a)a.pause();if(c.state!=='closed')c.close()},1800);
  }

  // Pause while the tab is hidden, continue when it comes back.
  document.addEventListener('visibilitychange',()=>{
    if(!ctx||ctx.state==='closed')return;
    if(document.hidden)ctx.suspend();else if(wantsSound)ctx.resume();
  });

  return {
    supported:!!AC,
    start,stop,
    subscribe(f){listeners.add(f);return()=>listeners.delete(f)},
    // Three loudness values (0..1) for low, middle and high frequencies, for the animated icon.
    levels(){
      if(!analyser||!playing)return null;
      analyser.getByteFrequencyData(data);
      const avg=(a,b)=>{let s=0;for(let i=a;i<b;i++)s+=data[i];return s/(b-a)/255};
      return [avg(1,5),avg(5,13),avg(13,41)];
    },
  };
}
