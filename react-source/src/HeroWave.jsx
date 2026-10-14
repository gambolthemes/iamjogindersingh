import React,{useEffect,useRef,useState} from 'react';

// The stage is drawn in a fixed 1600 x 400 space, centred and clipped by the hero.
const W=1600,H=400,STEP=6;
const phrases=['AI Claude Developer','Websites','SaaS Products','AI-powered Tools','UI / UX Design','Email Design','Laravel Apps','Made in Punjab'];
const gap='\u00A0\u00A0|\u00A0\u00A0'; // non-breaking so SVG doesn't collapse the spaces
const cycle=phrases.join(gap)+gap;
const wave=x=>215-48*Math.sin(2*Math.PI*(x-800)/1300);

const points=[];
for(let x=-100;x<=W+100;x+=STEP)points.push([x,wave(x)]);
const path='M'+points.map(([x,y])=>x.toFixed(1)+' '+y.toFixed(1)).join('L');
const length=points.reduce((s,p,i)=>i?s+Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]):0,0);
const SPEED=45; // px per second

const cards=[
  {cx:350,w:170,h:200,rot:-5,img:'ht-sticker-studio.jpg',pos:'45% 40%',delay:'-1s'},
  {cx:800,w:250,h:310,rot:3,img:null,pos:'50% 8%',delay:'-3s'},
  {cx:1250,w:170,h:200,rot:5,img:'birthdayapp.jpg',pos:'50% 30%',delay:'-2s'},
];

function Flower(){
  return <svg className="blob smile" viewBox="-30 -30 60 60" aria-hidden="true"><g fill="#f6d3bd">{[0,60,120,180,240,300].map(a=><circle key={a} r="13" cx={19*Math.cos(a*Math.PI/180)} cy={19*Math.sin(a*Math.PI/180)}/>)}<circle r="20"/></g><g fill="#1c2b22"><circle cx="-6" cy="-5" r="2.6"/><circle cx="6" cy="-5" r="2.6"/><path d="M-8 3q8 8 16 0" fill="none" stroke="#1c2b22" strokeWidth="3" strokeLinecap="round"/></g></svg>;
}
function Clover(){
  return <svg className="blob clover" viewBox="-30 -30 60 60" aria-hidden="true"><g fill="#367d65">{[0,90,180,270].map(a=><circle key={a} r="15" cx={15*Math.cos(a*Math.PI/180)} cy={15*Math.sin(a*Math.PI/180)}/>)}<circle r="14"/></g></svg>;
}

export default function HeroWave(){
  const [still,setStill]=useState(false);
  const [cyc,setCyc]=useState(960); // measured length of one text cycle; replaced once fonts load
  const probe=useRef(null);
  useEffect(()=>{
    setStill(matchMedia('(prefers-reduced-motion: reduce)').matches);
    let live=true;
    const measure=()=>{const n=probe.current?.getComputedTextLength();if(live&&n)setCyc(n)};
    measure();document.fonts?.ready.then(measure);
    return()=>{live=false};
  },[]);
  const repeats=Math.ceil((length+cyc)/cyc)+1;
  return <div className="wave-stage" aria-hidden="true"><div className="wave-inner" style={{width:W,height:H}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs><path id="wave-path" d={path}/></defs>
      <use href="#wave-path" fill="none" stroke="#367d65" strokeWidth="46"/>
      <text ref={probe} className="wave-text" visibility="hidden" y="-100">{cycle}</text>
      <text className="wave-text" dy="7">
        <textPath href="#wave-path" startOffset="0">
          {still?null:<animate attributeName="startOffset" from="0" to={-cyc} dur={cyc/SPEED+'s'} repeatCount="indefinite"/>}
          {cycle.repeat(repeats)}
        </textPath>
      </text>
    </svg>
    {cards.map((c,i)=>{
      const left=c.cx-c.w/2,top=wave(c.cx)-c.h/2-(i===1?0:6);
      return <div key={i} className="wave-card" style={{left,top,width:c.w,height:c.h,'--rot':c.rot+'deg',animationDelay:c.delay}}>
        <img src={'./'+(c.img?'work/'+c.img:'portrait.jpg')} alt="" style={{objectPosition:c.pos}} decoding="async"/>
      </div>;
    })}
    <div className="blob-pos" style={{left:cards[0].cx-cards[0].w/2-30,top:wave(cards[0].cx)-cards[0].h/2-60}}><Flower/></div>
    <div className="blob-pos" style={{left:cards[2].cx-cards[2].w/2-34,top:wave(cards[2].cx)-cards[2].h/2-56}}><Clover/></div>
  </div></div>;
}
