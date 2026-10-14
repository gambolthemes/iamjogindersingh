import React,{useRef,useState} from 'react';
import {profile} from './profile';

const services=['AI / Claude development','Website','Web app / SaaS','UI / UX design','Email design','Something else'];
const timelines=['Not sure yet','As soon as possible','Within 1 month','In 2–3 months','Just exploring'];
const MAX=1500;
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function validate(d){
  const e={};
  if(!d.name.trim())e.name='Please tell me your name.';
  if(!d.email.trim())e.email='Please enter your email.';
  else if(!emailOk(d.email.trim()))e.email='That email doesn’t look right.';
  if(d.message.trim().length<10)e.message='Please add a few details (at least 10 characters).';
  return e;
}

function read(form){
  const f=new FormData(form);
  return {name:f.get('name')||'',email:f.get('email')||'',phone:f.get('phone')||'',services:f.getAll('services'),timeline:f.get('timeline')||'',message:f.get('message')||'',website:f.get('website')||''};
}

function Field({id,label,optional,error,children}){
  return <div className="field"><label htmlFor={id}><span>{label}{optional?<em>optional</em>:<b aria-hidden="true"> *</b>}</span></label>{children}{error&&<span className="field-error" id={id+'-error'}>{error}</span>}</div>;
}

export default function ContactForm(){
  const form=useRef(null);
  const [errors,setErrors]=useState({});
  const [status,setStatus]=useState('idle'); // idle | sending | sent | mailto | error | unconfigured
  const [length,setLength]=useState(0);
  const [sentName,setSentName]=useState('');

  const bind=id=>({id,name:id,'aria-invalid':errors[id]?'true':undefined,'aria-describedby':errors[id]?id+'-error':undefined,onChange:()=>errors[id]&&setErrors(v=>({...v,[id]:undefined}))});

  async function submit(e){
    e.preventDefault();
    const data=read(e.currentTarget);
    const found=validate(data);
    setErrors(found);
    const first=Object.keys(found)[0];
    if(first){form.current.elements[first]?.focus();return}
    if(data.website){setStatus('sent');return} // honeypot filled: pretend success
    setSentName(data.name.trim().split(' ')[0]);
    const subject='Project enquiry from '+data.name.trim();
    if(profile.formEndpoint){
      setStatus('sending');
      try{
        // FormData is a simple request: no CORS preflight, and it is what form services such as Web3Forms expect.
        const body=new FormData();
        const interest=data.services.join(', ');
        // Form services print the field names as labels in the email, so use readable names and a clear order.
        const fields=profile.formKey
          ?{name:data.name,email:data.email,'Phone / WhatsApp':data.phone,'Interested in':interest,Timeline:data.timeline,Message:data.message,subject:'New enquiry: '+data.name+(interest?' · '+interest:''),from_name:'Portfolio Enquiry',access_key:profile.formKey}
          :{name:data.name,email:data.email,phone:data.phone,services:interest,timeline:data.timeline,message:data.message,subject};
        for(const k in fields)if(fields[k])body.append(k,fields[k]);
        const r=await fetch(profile.formEndpoint,{method:'POST',headers:{Accept:'application/json'},body});
        const result=await r.json().catch(()=>null);
        if(!r.ok||(result&&result.success===false))throw new Error((result&&result.message)||'HTTP '+r.status);
        setStatus('sent');
      }catch{setStatus('error')}
    }else if(profile.email){
      const lines=['Name: '+data.name,'Email: '+data.email];
      if(data.phone)lines.push('Phone: '+data.phone);
      if(data.services.length)lines.push('Interested in: '+data.services.join(', '));
      if(data.timeline)lines.push('Timeline: '+data.timeline);
      lines.push('',data.message);
      location.href='mailto:'+profile.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
      setStatus('mailto');
    }else setStatus('unconfigured');
  }

  function reset(){setStatus('idle');setErrors({});setLength(0)}

  if(status==='sent'||status==='mailto')return <div className="enquiry thanks" role="status"><div className="thanks-mark" aria-hidden="true">✓</div><h3>{status==='sent'?'Thank you'+(sentName?', '+sentName:'')+'!':'Almost there'+(sentName?', '+sentName:'')+'!'}</h3><p>{status==='sent'?'Your enquiry has been sent. I’ll get back to you on the email you provided.':'Your email app should open with your enquiry ready. Press send there to finish.'}</p><button type="button" className="button" onClick={reset}>Send another enquiry</button></div>;

  const sending=status==='sending';
  return <form className="enquiry" ref={form} onSubmit={submit} noValidate>
    <h3>Tell me about your project</h3>
    <p className="enquiry-intro">A few details help me understand what you need. Fields marked * are required.</p>
    <div className="field-row">
      <Field id="name" label="Your name" error={errors.name}><input {...bind('name')} autoComplete="name" placeholder="Jane Doe" required/></Field>
      <Field id="email" label="Email" error={errors.email}><input {...bind('email')} type="email" autoComplete="email" placeholder="you@example.com" required/></Field>
    </div>
    <div className="field-row">
      <Field id="phone" label="Phone / WhatsApp" optional><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 …"/></Field>
      <Field id="timeline" label="Timeline" optional><select id="timeline" name="timeline" defaultValue=""><option value="">Select…</option>{timelines.map(t=><option key={t}>{t}</option>)}</select></Field>
    </div>
    <fieldset className="field"><legend>I’m interested in <em>optional</em></legend><div className="choices">{services.map(s=><label className="choice" key={s}><input type="checkbox" name="services" value={s}/><span>{s}</span></label>)}</div></fieldset>
    <Field id="message" label="Your message" error={errors.message}><textarea {...bind('message')} rows="5" maxLength={MAX} placeholder="What are you building, who is it for, and what would you like help with?" required onChange={e=>{setLength(e.target.value.length);errors.message&&setErrors(v=>({...v,message:undefined}))}}/><span className="count" aria-hidden="true">{length} / {MAX}</span></Field>
    <div className="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <div className="form-foot"><button className="button black" type="submit" disabled={sending}>{sending?'Sending…':'Send enquiry →'}</button></div>
    <div role="status" aria-live="polite" className="form-status">
      {status==='error'&&<p className="form-alert">Sorry, your message couldn’t be sent. Please try again in a moment.</p>}
      {status==='unconfigured'&&<p className="form-alert">The contact form isn’t connected yet, so nothing was sent. Please check back soon.</p>}
    </div>
  </form>;
}
