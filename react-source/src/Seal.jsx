import React,{useEffect,useRef} from 'react';

// Round badge: the text runs around the circle and turns slowly; "JS" stays still in the middle.
const SEP=' · '; // non-breaking so SVG keeps the spaces
const ring=['DESIGN','CODE','CREATE','AI','PUNJAB','INDIA'].join(SEP)+SEP;
const R=48,C=2*Math.PI*R;

export default function Seal(){
  const text=useRef(null);
  useEffect(()=>{
    // Stretch the letter spacing so the words fill the whole circle exactly, whatever font is used.
    let live=true;
    const fit=()=>{
      const el=text.current;if(!el||!live)return;
      el.style.letterSpacing='0px';
      const n=el.getComputedTextLength();
      if(n)el.style.letterSpacing=((C-n)/ring.length)+'px';
    };
    fit();document.fonts?.ready.then(fit);
    return()=>{live=false};
  },[]);
  return <div className="seal-badge" aria-hidden="true">
    <svg viewBox="0 0 132 132">
      <defs><path id="seal-circle" d={`M66 66m-${R} 0a${R} ${R} 0 1 1 ${2*R} 0a${R} ${R} 0 1 1 -${2*R} 0`}/></defs>
      <circle cx="66" cy="66" r="64" fill="#b9e6d3" stroke="#000" strokeWidth="3"/>
      <g className="seal-ring">
        <text ref={text} className="seal-text"><textPath href="#seal-circle" startOffset="0">{ring}</textPath></text>
      </g>
      <circle cx="66" cy="66" r="30" fill="#000"/>
      <text x="66" y="76.5" textAnchor="middle" className="seal-js">JS</text>
    </svg>
  </div>;
}
