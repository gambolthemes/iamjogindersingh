import React,{useEffect,useRef,useState} from 'react';
import Icon from './Icon';

// The stage is drawn in a fixed 1600 x 400 space, centred and clipped by the hero.
const W=1600,H=400,STEP=6;
const phrases=['AI Developer','Websites','SaaS Products','AI-powered Tools','UI / UX Design','Email Design','Laravel Apps','Made in Punjab'];
const gap='\u00A0\u00A0|\u00A0\u00A0'; // non-breaking so SVG doesn't collapse the spaces
const cycle=phrases.join(gap)+gap;
const wave=x=>215-48*Math.sin(2*Math.PI*(x-800)/1300);

const points=[];
for(let x=-100;x<=W+100;x+=STEP)points.push([x,wave(x)]);
const path='M'+points.map(([x,y])=>x.toFixed(1)+' '+y.toFixed(1)).join('L');
const length=points.reduce((s,p,i)=>i?s+Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]):0,0);
const SPEED=45; // px per second

const cards=[
  {cx:350,w:240,h:170,rot:-5,kind:'figma',delay:'-1s'},
  {cx:800,w:250,h:310,rot:3,img:'hero-headshot.jpg',pos:'50% 12%',delay:'-3s'},
  {cx:1250,w:215,h:172,rot:5,kind:'code',delay:'-2s'},
];

// A small design-tool mock (canvas, frame, selection handles, named cursor). Drawn in code, no screenshot.
function DesignCard(){
  const handle=(x,y)=><rect key={x+'-'+y} x={x-2.5} y={y-2.5} width="5" height="5" rx="1" fill="#fff" stroke="#0d99ff" strokeWidth="1"/>;
  return <svg className="design-card" viewBox="0 0 240 170" fontFamily="'DM Sans',Arial,sans-serif">
    <defs>
      <pattern id="dc-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#d3d3d6"/></pattern>
      <linearGradient id="dc-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d6f2e4"/><stop offset="1" stopColor="#f6d3bd"/></linearGradient>
    </defs>
    <rect width="240" height="170" fill="#f1f1f3"/>
    <rect width="240" height="170" fill="url(#dc-dots)"/>
    {/* toolbar with the five-shape design mark */}
    <rect x="62" y="9" width="116" height="24" rx="12" fill="#fff" stroke="#e1e1e5"/>
    <g transform="translate(76 14) scale(0.58)">
      <path d="M8 0H4a4 4 0 0 0 0 8h4z" fill="#f24e1e"/><path d="M8 0h4a4 4 0 0 1 0 8H8z" fill="#ff7262"/>
      <path d="M8 8H4a4 4 0 0 0 0 8h4z" fill="#a259ff"/><circle cx="12" cy="12" r="4" fill="#1abcfe"/>
      <path d="M8 16H4a4 4 0 1 0 4 4z" fill="#0acf83"/>
    </g>
    <g fill="#c9c9ce"><rect x="100" y="17.5" width="14" height="7" rx="3.5"/><rect x="120" y="17.5" width="14" height="7" rx="3.5"/><rect x="140" y="17.5" width="14" height="7" rx="3.5"/></g>
    <circle cx="165" cy="21" r="5" fill="#b9e6d3"/>
    {/* design frame */}
    <text x="24" y="50" fontSize="7.5" fill="#8a8a92">Hero / Desktop</text>
    <rect x="24" y="54" width="132" height="100" rx="3" fill="#fff" stroke="#e1e1e5"/>
    <rect x="34" y="63" width="52" height="7" rx="3" fill="#1c2b22"/>
    <rect x="34" y="75" width="72" height="5" rx="2.5" fill="#cfd2d6"/>
    <rect x="34" y="84" width="60" height="5" rx="2.5" fill="#cfd2d6"/>
    <rect x="34" y="100" width="44" height="14" rx="7" fill="#b9e6d3"/>
    <rect x="106" y="94" width="42" height="52" rx="4" fill="url(#dc-img)"/>
    <circle cx="127" cy="112" r="7" fill="#367d65" opacity="0.85"/>
    {/* selection around the button */}
    <rect x="34" y="100" width="44" height="14" fill="none" stroke="#0d99ff" strokeWidth="1"/>
    {handle(34,100)}{handle(78,100)}{handle(34,114)}{handle(78,114)}
    <rect x="46" y="118" width="20" height="9" rx="2" fill="#0d99ff"/><text x="56" y="124.6" fontSize="5.5" fill="#fff" textAnchor="middle">44 × 14</text>
    {/* colour styles panel */}
    <rect x="168" y="46" width="64" height="108" rx="4" fill="#fff" stroke="#e1e1e5"/>
    <text x="176" y="59" fontSize="7" fontWeight="700" fill="#2a2a2e">Colors</text>
    {[['#b9e6d3','Mint'],['#367d65','Green'],['#1c2b22','Ink'],['#f6d3bd','Peach']].map(([c,n],i)=><g key={n} transform={'translate(0 '+(i*20)+')'}><rect x="176" y="68" width="14" height="14" rx="3" fill={c} stroke="#e1e1e5"/><text x="195" y="78.5" fontSize="7" fill="#55555c">{n}</text></g>)}
    {/* cursor with a name tag */}
    <path d="M92 118 l0 14 l4-3.5 l3 7 l3-1.4 l-3-6.8 l5.2-.3z" fill="#0d99ff" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
    <rect x="102" y="136" width="46" height="12" rx="6" fill="#0d99ff"/><text x="125" y="144.3" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle">Joginder</text>
  </svg>;
}
function CodeCard(){
  return <div className="code-card"><div className="code-bar"><i/><i/><i/><span>developer.js</span></div><pre><span className="k">const</span> dev = {'{'}{'\n'}  name: <span className="s">'Joginder'</span>,{'\n'}  role: <span className="s">'AI Developer'</span>,{'\n'}  craft: [<span className="s">'UI'</span>, <span className="s">'Code'</span>],{'\n'}{'}'};{'\n'}<span className="k">ship</span>(dev);</pre></div>;
}
function Flower(){
  return <svg className="blob smile" viewBox="-30 -30 60 60" aria-hidden="true"><g fill="#f6d3bd">{[0,60,120,180,240,300].map(a=><circle key={a} r="13" cx={19*Math.cos(a*Math.PI/180)} cy={19*Math.sin(a*Math.PI/180)}/>)}<circle r="20"/></g><g fill="#1c2b22"><circle cx="-6" cy="-5" r="2.6"/><circle cx="6" cy="-5" r="2.6"/><path d="M-8 3q8 8 16 0" fill="none" stroke="#1c2b22" strokeWidth="3" strokeLinecap="round"/></g></svg>;
}
function Clover(){
  return <svg className="blob clover" viewBox="-30 -30 60 60" aria-hidden="true"><g fill="#367d65">{[0,90,180,270].map(a=><circle key={a} r="15" cx={15*Math.cos(a*Math.PI/180)} cy={15*Math.sin(a*Math.PI/180)}/>)}<circle r="14"/></g></svg>;
}

const mid=cards[1],midTop=wave(mid.cx)-mid.h/2;

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
        {c.kind==='code'?<CodeCard/>:c.kind==='figma'?<DesignCard/>:<img src={'./'+c.img} alt="" style={{objectPosition:c.pos}} decoding="async"/>}
      </div>;
    })}
    <div className="badge-pos" style={{left:mid.cx+mid.w/2-30,top:midTop-18}}><span className="chip-badge"><Icon name="sparkles"/></span></div>
    <div className="badge-pos" style={{left:mid.cx-mid.w/2-38,top:midTop+mid.h-78,animationDelay:'-2s'}}><span className="chip-badge alt"><Icon name="code"/></span></div>
    <div className="blob-pos" style={{left:cards[0].cx-cards[0].w/2-30,top:wave(cards[0].cx)-cards[0].h/2-60}}><Flower/></div>
    <div className="blob-pos" style={{left:cards[2].cx-cards[2].w/2-34,top:wave(cards[2].cx)-cards[2].h/2-56}}><Clover/></div>
  </div></div>;
}
