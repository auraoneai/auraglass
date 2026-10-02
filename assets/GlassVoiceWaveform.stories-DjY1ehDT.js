import{f as ce}from"./index-DdjpOZjl.js";import{r as l,a as Le,j as s,d as We,c as v,m as M}from"./iframe-DFMMcocb.js";import{u as Be}from"./soundDesign-DAOJZn7H.js";import{u as qe}from"./a11y-Q0mX7KvA.js";import{u as Re}from"./useMotionPreference-CXubJTNb.js";import{c as le}from"./createGlassStyle-Cr0Un8y6.js";import{J as ue,z as $e}from"./components-Ue9Uo88O.js";import{O as _e}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const A={low:"var(--glass-gray-600)",medium:"hsl(var(--glass-color-success))",high:"hsl(var(--glass-color-warning))",peak:"hsl(var(--glass-color-danger))"},de=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],Q=l.forwardRef(({participants:n,currentUserId:w,showAvatars:me=!0,showNames:pe=!0,showMuteStatus:Z=!0,showConnectionStatus:ge=!0,waveformStyle:ee="bars",sensitivity:se=1,smoothing:z=.8,colorMode:he="participant",maxBars:g=32,animationSpeed:ae=1,realTimeMode:y=!1,soundVisualization:re=!0,showVoiceActivity:H=!0,compactMode:u=!1,onParticipantClick:fe,onMuteToggle:ve,className:we="",...ye},xe)=>{const Se=Le(),[Me,Ae]=l.useState({}),[be,ke]=l.useState({}),[p,Ne]=l.useState(n),x=l.useRef(),te=l.useRef(p),ne=l.useRef({maxBars:g,smoothing:z}),{play:oe}=Be();qe("glass-voice-waveform");const{shouldAnimate:Y}=Re(),Ce=(e,a)=>{const r=[],t=e*se;for(let i=0;i<a;i++){const d=i/a*Math.PI*4;let c=Math.sin(d)*t;c+=(Math.random()-.5)*t*.3,c*=Math.max(.1,1-i/a*.7),r.push(Math.max(0,Math.min(1,c)))}return r};l.useEffect(()=>{if(!y)return;const e=setInterval(()=>{Ne(a=>a.map(r=>{if(!r.isConnected)return r;const t=r.isSpeaking,i=Math.random()<.3,d=i?Math.random()*.8+.2:Math.random()*.1;return!t&&i&&re&&oe("notification"),{...r,isSpeaking:i,audioLevel:d,lastActivity:i?Date.now():r.lastActivity}}))},200);return()=>clearInterval(e)},[y,re,oe]),l.useEffect(()=>{te.current=p},[p]),l.useEffect(()=>{ne.current={maxBars:g,smoothing:z}},[g,z]),l.useEffect(()=>{if(!y)return;let e=!0;const a=()=>{if(!e)return;const{maxBars:r,smoothing:t}=ne.current,i=te.current;Ae(d=>{const c={};return i.forEach(m=>{const h=d[m.id]||new Array(r).fill(0);if(m.isSpeaking&&m.audioLevel>.1){const f=Ce(m.audioLevel,r),J=h.map((X,K)=>X*t+f[K]*(1-t));c[m.id]=J}else c[m.id]=h.map(f=>f*.9)}),c}),x.current=requestAnimationFrame(a)};return x.current=requestAnimationFrame(a),()=>{e=!1,x.current&&cancelAnimationFrame(x.current)}},[y]),l.useEffect(()=>{H&&ke(e=>{const a={...e},r=Date.now();return p.forEach(t=>{a[t.id]||(a[t.id]=[]);const i=a[t.id];t.isSpeaking&&i.push(r),a[t.id]=i.filter(d=>r-d<3e4)}),a})},[p,H]);const S=(e,a)=>{switch(he){case"activity":return e.isSpeaking?e.audioLevel<.3?A.medium:e.audioLevel<.6?A.high:A.peak:A.low;case"rainbow":return de[a%de.length];default:return e.color}},Ie=({participant:e})=>{const a=be[e.id]||[],r=a.length/10;return s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[s.jsx("div",{className:"glass-flex glass-space-x-0.5",children:[0,1,2,3,4].map(t=>s.jsx("div",{className:"glass-w-1 glass-h-3 glass-radius-full",style:{background:r>t*.2?"rgba(71,85,105,.84)":"rgba(148,163,184,.22)",transition:"all 300ms ease"}},t))}),s.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:a.length>0?`${a.length}`:"0"})]})},je=({participant:e,data:a})=>s.jsx("div",{className:"glass-flex glass-items-end glass-space-x-1 glass-h-12",children:a.map((r,t)=>s.jsx(M.div,{className:"glass-radius-full",style:{width:u?"2px":"3px",backgroundColor:S(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(2,r*48)}px`,opacity:e.isSpeaking?.8:.3},transition:Y?{duration:.1*ae,ease:"easeOut"}:{duration:0}},t))}),Ue=({participant:e,data:a})=>s.jsx("svg",{width:u?120:200,height:48,className:"glass-overflow-visible",children:s.jsx("path",{d:`M 0 24 ${a.map((r,t)=>`L ${t/(a.length-1)*(u?120:200)} ${24-r*20}`).join(" ")} L ${u?120:200} 24`,fill:"none",stroke:S(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3})}),Ve=({participant:e,data:a})=>{const r=u?20:30,t=r+5,i=r+5;return s.jsx("svg",{width:(r+5)*2,height:(r+5)*2,className:"glass-overflow-visible",children:a.map((d,c)=>{const m=c/a.length*Math.PI*2-Math.PI/2,h=r*.6,f=h+d*r*.4,J=t+Math.cos(m)*h,X=i+Math.sin(m)*h,K=t+Math.cos(m)*f,Fe=i+Math.sin(m)*f;return s.jsx("line",{x1:J,y1:X,x2:K,y2:Fe,stroke:S(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3},c)})})},De=({participant:e,data:a})=>s.jsx("div",{className:"glass-flex glass-items-end glass-justify-center glass-space-x-px glass-h-12 glass-w-32",children:a.map((r,t)=>s.jsx(M.div,{className:"glass-radius-full",style:{width:`${100/a.length}%`,backgroundColor:S(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(1,r*48)}px`},transition:Y?{duration:.1*ae}:{duration:0}},t))}),Pe=e=>{const a=Me[e.id]||Array.from({length:g},(r,t)=>{const i=t/Math.max(1,g-1)*Math.PI*3,d=.28+Math.sin(t/g*Math.PI)*.72,c=.22+Math.abs(Math.sin(i))*.7;return Math.min(1,c*d*Math.max(.28,e.audioLevel))});switch(ee){case"waves":return s.jsx(Ue,{participant:e,data:a});case"circular":return s.jsx(Ve,{participant:e,data:a});case"spectrum":return s.jsx(De,{participant:e,data:a});default:return s.jsx(je,{participant:e,data:a})}},Te=({participant:e,index:a})=>s.jsxs(M.div,{className:"glass-flex glass-items-center glass-space-x-3 glass-p-3 glass-radius-lg glass-cursor-pointer glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:{background:le({blur:"sm",opacity:.8}).background,boxShadow:e.isSpeaking?"0 0 0 1px rgba(71,85,105,.42), 0 12px 30px rgba(15,23,42,.1)":"0 10px 24px rgba(15,23,42,.07)",border:"1px solid rgba(148,163,184,.25)",transitionDuration:"200ms"},whileHover:{scale:1.02},children:[s.jsxs("button",{type:"button",onClick:()=>fe?.(e.id),className:"glass-flex glass-flex-1 glass-min-w-0 glass-items-center glass-space-x-3 glass-bg-transparent glass-border-0 glass-p-0 glass-text-left glass-focus","aria-label":`Select ${e.name}`,children:[me&&s.jsxs("div",{className:"glass-relative",children:[s.jsx("div",{className:v("glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-semibold glass-overflow-hidden",u?"glass-w-8 glass-h-8":"glass-w-12 glass-h-12"),style:{background:le({blur:"sm",opacity:.8}).background},children:e.avatar?s.jsx("img",{src:e.avatar,alt:e.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.name.charAt(0).toUpperCase()}),ge&&s.jsx("div",{className:v("glass-absolute glass-w-3 glass-h-3 glass-radius-full glass-border-2 glass-border-white"),style:{right:-4,bottom:-4,background:e.isConnected?"rgba(71,85,105,.88)":"rgba(148,163,184,.62)"}}),e.isSpeaking&&s.jsx(M.div,{className:"glass-absolute glass-top-1 glass-w-4 glass-h-4 glass-radius-full",style:{right:-4,background:"rgba(71,85,105,.88)"},animate:Se?{}:{scale:[1,1.2,1]},transition:Y?{duration:.8,repeat:1/0}:{duration:0}})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[pe&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[s.jsxs("p",{className:v("glass-font-medium glass-text-primary glass-truncate",u?"glass-text-sm":"glass-text-base"),children:[e.name,e.id===w&&" (You)"]}),Z&&e.isMuted&&s.jsx(ue,{className:"glass-h-3.5 glass-w-3.5","aria-label":"Muted"})]}),H&&!u&&s.jsx(Ie,{participant:e})]}),Pe(e)]}),Z&&!u&&s.jsx("button",{type:"button",onClick:()=>ve?.(e.id),className:v("glass-p-1 glass-radius glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard glass-flex-shrink-0","glass-text-primary"),"aria-label":`${e.isMuted?"Unmute":"Mute"} ${e.name}`,children:e.isMuted?s.jsx(ue,{className:"glass-h-4 glass-w-4","aria-hidden":"true"}):s.jsx($e,{className:"glass-h-4 glass-w-4","aria-hidden":"true"})})]}),ie=p.filter(e=>e.isSpeaking).length,Ee=p.filter(e=>e.isConnected).length;return s.jsxs(_e,{ref:xe,intensity:"subtle",className:v("glass-p-4 glass-space-y-4",we),style:{background:"linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",backgroundColor:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.18)",boxShadow:"0 24px 64px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.18)",color:"var(--glass-theme-text, var(--glass-text-primary))"},...ye,children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:["Voice Chat (",Ee,")"]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-sm glass-text-primary-glass-opacity-60",children:[ie>0&&s.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),s.jsxs("span",{children:[ie," speaking"]})]}),y&&s.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-animate-pulse"}),s.jsx("span",{children:"Live"})]})]})]}),s.jsx("div",{className:v("glass-space-y-2",u&&"glass-max-h-64 glass-overflow-y-auto"),children:s.jsx(We,{children:p.sort((e,a)=>e.isSpeaking&&!a.isSpeaking?-1:!e.isSpeaking&&a.isSpeaking?1:e.isConnected&&!a.isConnected?-1:!e.isConnected&&a.isConnected?1:e.name.localeCompare(a.name)).map((e,a)=>s.jsx(Te,{participant:e,index:a},e.id))})}),!u&&s.jsxs("div",{className:"glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",children:[s.jsxs("span",{children:["Waveform: ",ee]}),s.jsxs("span",{children:["Sensitivity: ",se]})]})]})});try{Q.displayName="GlassVoiceWaveform",Q.__docgenInfo={description:"",displayName:"GlassVoiceWaveform",props:{participants:{defaultValue:null,description:"",name:"participants",required:!0,type:{name:"VoiceParticipant[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showMuteStatus:{defaultValue:{value:"true"},description:"",name:"showMuteStatus",required:!1,type:{name:"boolean | undefined"}},showConnectionStatus:{defaultValue:{value:"true"},description:"",name:"showConnectionStatus",required:!1,type:{name:"boolean | undefined"}},waveformStyle:{defaultValue:{value:"bars"},description:"",name:"waveformStyle",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"waves"'},{value:'"bars"'},{value:'"circular"'},{value:'"spectrum"'}]}},sensitivity:{defaultValue:{value:"1"},description:"",name:"sensitivity",required:!1,type:{name:"number | undefined"}},smoothing:{defaultValue:{value:"0.8"},description:"",name:"smoothing",required:!1,type:{name:"number | undefined"}},colorMode:{defaultValue:{value:"participant"},description:"",name:"colorMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"rainbow"'},{value:'"activity"'},{value:'"participant"'}]}},maxBars:{defaultValue:{value:"32"},description:"",name:"maxBars",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},soundVisualization:{defaultValue:{value:"true"},description:"",name:"soundVisualization",required:!1,type:{name:"boolean | undefined"}},showVoiceActivity:{defaultValue:{value:"true"},description:"",name:"showVoiceActivity",required:!1,type:{name:"boolean | undefined"}},compactMode:{defaultValue:{value:"false"},description:"",name:"compactMode",required:!1,type:{name:"boolean | undefined"}},onParticipantClick:{defaultValue:null,description:"",name:"onParticipantClick",required:!1,type:{name:"((participantId: string) => void) | undefined"}},onMuteToggle:{defaultValue:null,description:"",name:"onMuteToggle",required:!1,type:{name:"((participantId: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"1",name:"Alice Johnson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%2364758b%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#475569",isSpeaking:!0,isMuted:!1,audioLevel:.7,lastActivity:Date.now(),isConnected:!0},{id:"2",name:"Bob Smith",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%23718096%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#64748b",isSpeaking:!1,isMuted:!1,audioLevel:.1,lastActivity:Date.now()-5e3,isConnected:!0},{id:"3",name:"Carol Davis",color:"#334155",isSpeaking:!0,isMuted:!1,audioLevel:.9,lastActivity:Date.now()-1e3,isConnected:!0},{id:"4",name:"David Wilson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%2394a3b8%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#94a3b8",isSpeaking:!1,isMuted:!0,audioLevel:0,lastActivity:Date.now()-1e4,isConnected:!0},{id:"5",name:"Emma Brown",color:"#64748b",isSpeaking:!1,isMuted:!1,audioLevel:.3,lastActivity:Date.now()-3e3,isConnected:!1},{id:"current",name:"You",color:"#475569",isSpeaking:!1,isMuted:!1,audioLevel:0,lastActivity:Date.now(),isConnected:!0}],ss={title:"Workflows/Glass Voice Waveform",component:Q,parameters:{layout:"centered"},tags:["autodocs"],args:{onParticipantClick:ce(),onMuteToggle:ce()},argTypes:{waveformStyle:{control:{type:"select"},options:["bars","waves","circular","spectrum"]},colorMode:{control:{type:"select"},options:["participant","activity","rainbow"]},sensitivity:{control:{type:"range",min:.1,max:2,step:.1}},smoothing:{control:{type:"range",min:0,max:1,step:.1}},maxBars:{control:{type:"range",min:8,max:64,step:4}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}}}},b={args:{participants:o,currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0,showConnectionStatus:!0,showVoiceActivity:!0}},k={args:{participants:o,currentUserId:"current",waveformStyle:"bars",showAvatars:!0,showNames:!0,realTimeMode:!0}},N={args:{participants:o,currentUserId:"current",waveformStyle:"waves",showAvatars:!0,showNames:!0,realTimeMode:!0}},C={args:{participants:o,currentUserId:"current",waveformStyle:"circular",showAvatars:!0,showNames:!0,realTimeMode:!0}},I={args:{participants:o,currentUserId:"current",waveformStyle:"spectrum",showAvatars:!0,showNames:!0,realTimeMode:!0}},j={args:{participants:o,currentUserId:"current",realTimeMode:!0,soundVisualization:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},U={args:{participants:o,currentUserId:"current",colorMode:"activity",realTimeMode:!0,showAvatars:!0,showNames:!0}},V={args:{participants:o,currentUserId:"current",colorMode:"rainbow",realTimeMode:!0,showAvatars:!0,showNames:!0}},D={args:{participants:o,currentUserId:"current",compactMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!1}},P={args:{participants:o,currentUserId:"current",showAvatars:!1,showNames:!1,showMuteStatus:!1,showConnectionStatus:!1,showVoiceActivity:!1,waveformStyle:"bars"}},T={args:{participants:o.map(n=>({...n,isSpeaking:["1","3","5"].includes(n.id),audioLevel:["1","3","5"].includes(n.id)?Math.random()*.8+.2:.05})),currentUserId:"current",realTimeMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},E={args:{participants:o.map(n=>({...n,isMuted:["2","4","current"].includes(n.id),isSpeaking:!1,audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0}},F={args:{participants:o.map(n=>({...n,isConnected:!["4","5"].includes(n.id),isSpeaking:n.isConnected?n.isSpeaking:!1,audioLevel:n.isConnected?n.audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showConnectionStatus:!0}},L={args:{participants:o,currentUserId:"current",sensitivity:2,realTimeMode:!0,showAvatars:!0,showNames:!0}},W={args:{participants:o,currentUserId:"current",smoothing:.2,realTimeMode:!0,showAvatars:!0,showNames:!0}},B={args:{participants:o,currentUserId:"current",maxBars:64,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},q={args:{participants:o,currentUserId:"current",maxBars:8,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},R={args:{participants:o,currentUserId:"current",animationSpeed:3,realTimeMode:!0,showAvatars:!0,showNames:!0}},$={args:{participants:o,currentUserId:"current",animationSpeed:.3,realTimeMode:!0,showAvatars:!0,showNames:!0}},_={args:{participants:[o.find(n=>n.id==="current")],currentUserId:"current",showAvatars:!0,showNames:!0,showVoiceActivity:!0}},G={args:{participants:[...o,...Array.from({length:8},(n,w)=>({id:`extra-${w}`,name:`User ${w+7}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF","#5F27CD","#00D2D3"][w],isSpeaking:Math.random()>.7,isMuted:Math.random()>.8,audioLevel:Math.random()*.8,lastActivity:Date.now()-Math.random()*1e4,isConnected:Math.random()>.1}))],currentUserId:"current",realTimeMode:!0,compactMode:!0,showAvatars:!0,showNames:!0}},O={args:{participants:o,currentUserId:"current",soundVisualization:!1,realTimeMode:!0,showAvatars:!0,showNames:!0}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true,
    showConnectionStatus: true,
    showVoiceActivity: true
  }
}`,...b.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'bars',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'waves',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'circular',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...C.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'spectrum',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    realTimeMode: true,
    soundVisualization: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,...j.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'activity',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...U.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'rainbow',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...V.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    compactMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: false
  }
}`,...D.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: false,
    showNames: false,
    showMuteStatus: false,
    showConnectionStatus: false,
    showVoiceActivity: false,
    waveformStyle: 'bars'
  }
}`,...P.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isSpeaking: ['1', '3', '5'].includes(p.id),
      audioLevel: ['1', '3', '5'].includes(p.id) ? Math.random() * 0.8 + 0.2 : 0.05
    })),
    currentUserId: 'current',
    realTimeMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isMuted: ['2', '4', 'current'].includes(p.id),
      isSpeaking: false,
      audioLevel: 0
    })),
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true
  }
}`,...E.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants.map(p => ({
      ...p,
      isConnected: !['4', '5'].includes(p.id),
      isSpeaking: p.isConnected ? p.isSpeaking : false,
      audioLevel: p.isConnected ? p.audioLevel : 0
    })),
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showConnectionStatus: true
  }
}`,...F.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    sensitivity: 2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...L.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    smoothing: 0.2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    maxBars: 64,
    waveformStyle: 'bars',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...B.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    maxBars: 8,
    waveformStyle: 'bars',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...q.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...R.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 0.3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...$.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    participants: [mockParticipants.find(p => p.id === 'current')!],
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    participants: [...mockParticipants, ...Array.from({
      length: 8
    }, (_, i) => ({
      id: \`extra-\${i}\`,
      name: \`User \${i + 7}\`,
      color: ['#EE5A6F', '#0FB9B1', '#3867D6', '#1DD1A1', '#FD79A8', '#54A0FF', '#5F27CD', '#00D2D3'][i],
      isSpeaking: Math.random() > 0.7,
      isMuted: Math.random() > 0.8,
      audioLevel: Math.random() * 0.8,
      lastActivity: Date.now() - Math.random() * 10000,
      isConnected: Math.random() > 0.1
    }))],
    currentUserId: 'current',
    realTimeMode: true,
    compactMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...G.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    soundVisualization: false,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...O.parameters?.docs?.source}}};const as=["Default","BarWaveform","WaveWaveform","CircularWaveform","SpectrumWaveform","RealTimeMode","ActivityColorMode","RainbowColorMode","CompactMode","MinimalInterface","ActiveSpeakers","MutedUsers","DisconnectedUsers","HighSensitivity","LowSmoothing","ManyBars","FewBars","FastAnimation","SlowAnimation","SoloCall","LargeGroup","SilentMode"];export{T as ActiveSpeakers,U as ActivityColorMode,k as BarWaveform,C as CircularWaveform,D as CompactMode,b as Default,F as DisconnectedUsers,R as FastAnimation,q as FewBars,L as HighSensitivity,G as LargeGroup,W as LowSmoothing,B as ManyBars,P as MinimalInterface,E as MutedUsers,V as RainbowColorMode,j as RealTimeMode,O as SilentMode,$ as SlowAnimation,_ as SoloCall,I as SpectrumWaveform,N as WaveWaveform,as as __namedExportsOrder,ss as default};
