import React,{useEffect,useRef,useState} from 'react';
import {createAmbient} from './ambient';
import {profile} from './profile';

const ambient=createAmbient(profile.music||'');
const KEY='js-music';
const read=()=>{try{return localStorage.getItem(KEY)}catch{return null}};
const save=v=>{try{localStorage.setItem(KEY,v)}catch{}};
const IDLE=[3,5.5,3.5],BANDS=[1.0,2.2,5.5];

export default function MusicToggle(){
  const [on,setOn]=useState(false);
  const bars=useRef([]);

  useEffect(()=>{
    const unsub=ambient.subscribe(setOn);
    // Browsers only allow sound after a click. If the visitor had music on last time, start it at their first click/key.
    let cleanup=()=>{};
    if(read()==='on'){
      const go=e=>{if(e.target.closest&&e.target.closest('.music-btn'))return;cleanup();ambient.start()};
      window.addEventListener('pointerdown',go);window.addEventListener('keydown',go);
      cleanup=()=>{window.removeEventListener('pointerdown',go);window.removeEventListener('keydown',go)};
    }
    return()=>{unsub();cleanup()};
  },[]);

  // The three bars follow the real loudness of the music.
  useEffect(()=>{
    const paint=hs=>bars.current.forEach((l,i)=>l&&l.setAttribute('y2',String(20-hs[i])));
    const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!on||still){paint(on?[7,10,7]:IDLE);return}
    let raf,t=0,cur=[3,3,3];
    const loop=()=>{
      t+=1;const lv=ambient.levels()||[0,0,0];
      cur=cur.map((c,i)=>{
        const target=3+Math.min(1,lv[i]*BANDS[i])*11+(Math.sin(t/38+i*2)+1)*0.9;
        return c+(target-c)*0.22;
      });
      paint(cur);raf=requestAnimationFrame(loop);
    };
    loop();
    return()=>cancelAnimationFrame(raf);
  },[on]);

  if(!ambient.supported)return null;
  const toggle=async()=>{
    if(on){ambient.stop();save('off')}
    else{await ambient.start();save('on')}
  };
  return <button type="button" className={'music-btn'+(on?' on':'')} aria-pressed={on} aria-label={on?'Pause soft music':'Play soft music'} onClick={toggle}>
    <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3.5 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0Z" fill="currentColor" stroke="none" opacity="0.2"/>
      <path className="note" d="M3.5 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0ZM8.5 17.5V5l6.5 2.2"/>
      {[18.5,22,25.5].map((x,i)=><line key={x} ref={el=>bars.current[i]=el} x1={x} x2={x} y1="20" y2={20-IDLE[i]} strokeWidth="1.9"/>)}
    </svg>
    <span className="tip">{on?'Music on':'Soft music'}</span>
    <small className="state">{on?'On':'Off'}</small>
  </button>;
}
