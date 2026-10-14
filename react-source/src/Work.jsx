import React,{useState} from 'react';
import {clientWork,hubtoolify,gambolthemes} from './profile';

const tints=['mint','peach','lilac','sky','butter','rose'];
const host=url=>{const u=new URL(url);return (u.host+(u.pathname==='/'?'':u.pathname)).replace(/^www./,'')};

function Card({name,url,image,meta,description,cover,index=0}){
  const label=name+(meta?', '+meta:'')+' (opens in a new tab)';
  return <article className="work-card">
    <a href={url} target="_blank" rel="noreferrer" aria-label={label}>
      {cover
        ? <div className="shot cover"><img src={'./work/'+image} alt={name+' preview'} loading="lazy" decoding="async"/><span className="visit" aria-hidden="true">Visit ↗</span></div>
        : <div className={'shot stage '+tints[index%tints.length]}><div className="win"><div className="win-bar" aria-hidden="true"><i/><i/><i/><span>{host(url)}</span></div><img src={'./work/'+image} alt={name+' homepage screenshot'} loading="lazy" decoding="async"/></div><span className="visit" aria-hidden="true">Visit ↗</span></div>}
      <div className="work-caption"><h3>{name}</h3>{meta&&<small>{meta}</small>}{description&&<p>{description}</p>}</div>
    </a>
  </article>;
}

export function ClientWork(){
  return <section id="portfolio" className="work content-section">
    <div className="section-heading"><div className="kicker">Client work 👍</div><h2>Websites I’ve built<br/><span className="outline">take a look</span></h2></div>
    <div className="work-grid">{clientWork.map((p,i)=><Card key={p.url} index={i} {...p} meta="Client project"/>)}</div>
    <p className="work-note">More work, always in progress…</p>
    <div className="collaborate"><h3>A designer’s eye. A developer’s mindset. <br/>I work with your team to turn thoughtful <br/>ideas into useful digital products.</h3><a href="#contact">Let’s work together 👋</a></div>
  </section>;
}

export function PersonalWork(){
  const [type,setType]=useState('All');
  const {products}=gambolthemes;
  const types=['All',...new Set(products.map(p=>p.type))];
  const count=t=>t==='All'?products.length:products.filter(p=>p.type===t).length;
  const shown=type==='All'?products:products.filter(p=>p.type===type);
  return <section id="shop" className="products content-section">
    <div className="section-heading"><div className="kicker">Made by me</div><h2>Personal work <span className="outline">& products</span></h2></div>
    <div className="group-head"><h3>HubToolify</h3><a className="underlined" href={hubtoolify.url} target="_blank" rel="noreferrer">hubtoolify.com ↗</a></div>
    <p className="group-intro">My own product: online tools, icons, stickers and creative editors, built to make everyday work a little easier.</p>
    <div className="work-grid">{hubtoolify.tools.map((t,i)=><Card key={t.path} index={i+2} name={t.name} url={hubtoolify.url+t.path} image={t.image} description={t.description} meta="HubToolify"/>)}</div>
    <div className="group-head"><h3>Gambolthemes</h3><a className="underlined" href={gambolthemes.url} target="_blank" rel="noreferrer">All {products.length} products ↗</a></div>
    <p className="group-intro">Templates and scripts I’ve published on Gambolthemes, from HTML and PSD templates to Laravel platforms.</p>
    <div className="chips" role="group" aria-label="Filter products by type">{types.map(t=><button key={t} type="button" aria-pressed={type===t} onClick={()=>setType(t)}>{t} <span>{count(t)}</span></button>)}</div>
    <div className="work-grid">{shown.map(p=><Card key={p.slug} cover name={p.name} url={gambolthemes.url+'/'+p.slug} image={p.image} description={p.subtitle} meta={p.type}/>)}</div>
    <div className="product-bottom"><p>Great products start with a good conversation.<br/>Let’s bring your next idea to life.</p><a className="button black" href="#contact">Discuss a project</a></div>
  </section>;
}
