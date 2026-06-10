import{f as ce}from"./index-CLSxArU-.js";import{r as c,b as Ee,j as a,e as Le,c as h,m as M}from"./iframe-DuFCckax.js";import{u as Be}from"./soundDesign-BpBl8BTS.js";import{u as We}from"./a11y-BVXyQ8aU.js";import{u as qe}from"./useMotionPreference-BRWo7C-p.js";import{c as ue}from"./createGlassStyle-BfWnO-qv.js";import{O as Re}from"./OptimizedGlassCore-Dfu3jw2K.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-8v_R2xci.js";const A={low:"var(--glass-gray-600)",medium:"var(--glass-color-success)",high:"var(--glass-color-warning)",peak:"var(--glass-color-danger)"},le=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],Q=c.forwardRef(({participants:n,currentUserId:v,showAvatars:de=!0,showNames:me=!0,showMuteStatus:Z=!0,showConnectionStatus:pe=!0,waveformStyle:ee="bars",sensitivity:se=1,smoothing:z=.8,colorMode:ge="participant",maxBars:y=32,animationSpeed:ae=1,realTimeMode:w=!1,soundVisualization:re=!0,showVoiceActivity:H=!0,compactMode:u=!1,onParticipantClick:fe,onMuteToggle:he,className:ve="",...we},ye)=>{const xe=Ee(),[Se,Me]=c.useState({}),[Ae,ke]=c.useState({}),[p,Ce]=c.useState(n),x=c.useRef(),te=c.useRef(p),ne=c.useRef({maxBars:y,smoothing:z}),{play:oe}=Be();We("glass-voice-waveform");const{shouldAnimate:Y}=qe(),Ne=(e,s)=>{const r=[],t=e*se;for(let i=0;i<s;i++){const m=i/s*Math.PI*4;let d=Math.sin(m)*t;d+=(Math.random()-.5)*t*.3,d*=Math.max(.1,1-i/s*.7),r.push(Math.max(0,Math.min(1,d)))}return r};c.useEffect(()=>{if(!w)return;const e=setInterval(()=>{Ce(s=>s.map(r=>{if(!r.isConnected)return r;const t=r.isSpeaking,i=Math.random()<.3,m=i?Math.random()*.8+.2:Math.random()*.1;return!t&&i&&re&&oe("notification"),{...r,isSpeaking:i,audioLevel:m,lastActivity:i?Date.now():r.lastActivity}}))},200);return()=>clearInterval(e)},[w,re,oe]),c.useEffect(()=>{te.current=p},[p]),c.useEffect(()=>{ne.current={maxBars:y,smoothing:z}},[y,z]),c.useEffect(()=>{if(!w)return;let e=!0;const s=()=>{if(!e)return;const{maxBars:r,smoothing:t}=ne.current,i=te.current;Me(m=>{const d={};return i.forEach(l=>{const g=m[l.id]||new Array(r).fill(0);if(l.isSpeaking&&l.audioLevel>.1){const f=Ne(l.audioLevel,r),J=g.map((X,K)=>X*t+f[K]*(1-t));d[l.id]=J}else d[l.id]=g.map(f=>f*.9)}),d}),x.current=requestAnimationFrame(s)};return x.current=requestAnimationFrame(s),()=>{e=!1,x.current&&cancelAnimationFrame(x.current)}},[w]),c.useEffect(()=>{H&&ke(e=>{const s={...e},r=Date.now();return p.forEach(t=>{s[t.id]||(s[t.id]=[]);const i=s[t.id];t.isSpeaking&&i.push(r),s[t.id]=i.filter(m=>r-m<3e4)}),s})},[p,H]);const S=(e,s)=>{switch(ge){case"activity":return e.isSpeaking?e.audioLevel<.3?A.medium:e.audioLevel<.6?A.high:A.peak:A.low;case"rainbow":return le[s%le.length];default:return e.color}},be=({participant:e})=>{const s=Ae[e.id]||[],r=s.length/10;return a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[a.jsx("div",{className:"glass-flex glass-space-x-0.5",children:[0,1,2,3,4].map(t=>a.jsx("div",{className:"glass-w-1 glass-h-3 glass-radius-full",style:{background:r>t*.2?"rgba(74, 222, 128, 0.92)":"rgba(255, 255, 255, 0.2)",transition:"all 300ms ease"}},t))}),a.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.length>0?`${s.length}`:"0"})]})},Ie=({participant:e,data:s})=>a.jsx("div",{className:"glass-flex glass-items-end glass-space-x-1 glass-h-12",children:s.map((r,t)=>a.jsx(M.div,{className:"glass-radius-full",style:{width:u?"2px":"3px",backgroundColor:S(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(2,r*48)}px`,opacity:e.isSpeaking?.8:.3},transition:Y?{duration:.1*ae,ease:"easeOut"}:{duration:0}},t))}),je=({participant:e,data:s})=>a.jsx("svg",{width:u?120:200,height:48,className:"glass-overflow-visible",children:a.jsx("path",{d:`M 0 24 ${s.map((r,t)=>`L ${t/(s.length-1)*(u?120:200)} ${24-r*20}`).join(" ")} L ${u?120:200} 24`,fill:"none",stroke:S(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3})}),Ue=({participant:e,data:s})=>{const r=u?20:30,t=r+5,i=r+5;return a.jsx("svg",{width:(r+5)*2,height:(r+5)*2,className:"glass-overflow-visible",children:s.map((m,d)=>{const l=d/s.length*Math.PI*2-Math.PI/2,g=r*.6,f=g+m*r*.4,J=t+Math.cos(l)*g,X=i+Math.sin(l)*g,K=t+Math.cos(l)*f,Te=i+Math.sin(l)*f;return a.jsx("line",{x1:J,y1:X,x2:K,y2:Te,stroke:S(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3},d)})})},De=({participant:e,data:s})=>a.jsx("div",{className:"glass-flex glass-items-end glass-justify-center glass-space-x-px glass-h-12 glass-w-32",children:s.map((r,t)=>a.jsx(M.div,{className:"glass-radius-full",style:{width:`${100/s.length}%`,backgroundColor:S(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(1,r*48)}px`},transition:Y?{duration:.1*ae}:{duration:0}},t))}),Ve=e=>{const s=Se[e.id]||new Array(y).fill(0);switch(ee){case"waves":return a.jsx(je,{participant:e,data:s});case"circular":return a.jsx(Ue,{participant:e,data:s});case"spectrum":return a.jsx(De,{participant:e,data:s});default:return a.jsx(Ie,{participant:e,data:s})}},Fe=({participant:e,index:s})=>a.jsxs(M.div,{className:"glass-flex glass-items-center glass-space-x-3 glass-p-3 glass-radius-lg glass-cursor-pointer glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:{background:ue({blur:"sm",opacity:.8}).background,boxShadow:e.isSpeaking?"0 0 0 2px color-mix(in srgb, var(--glass-color-success, #22c55e) 55%, transparent)":void 0,transitionDuration:"200ms"},onClick:()=>fe?.(e.id),whileHover:{scale:1.02},whileTap:{scale:.98},children:[de&&a.jsxs("div",{className:"glass-relative",children:[a.jsx("div",{className:h("glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-semibold glass-overflow-hidden",u?"glass-w-8 glass-h-8":"glass-w-12 glass-h-12"),style:{background:ue({blur:"sm",opacity:.8}).background},children:e.avatar?a.jsx("img",{src:e.avatar,alt:e.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.name.charAt(0).toUpperCase()}),pe&&a.jsx("div",{className:h("glass-absolute glass-w-3 glass-h-3 glass-radius-full glass-border-2 glass-border-white",e.isConnected?"glass-surface-success":"glass-surface-danger"),style:{right:-4,bottom:-4}}),e.isSpeaking&&a.jsx(M.div,{className:"glass-absolute glass-top-1 glass-w-4 glass-h-4 glass-surface-success glass-radius-full",style:{right:-4},animate:xe?{}:{scale:[1,1.2,1]},transition:Y?{duration:.8,repeat:1/0}:{duration:0}})]}),a.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[me&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[a.jsxs("p",{className:h("glass-font-medium glass-text-primary glass-truncate",u?"glass-text-sm":"glass-text-base"),children:[e.name,e.id===v&&" (You)"]}),Z&&e.isMuted&&a.jsx("span",{className:"glass-text-primary glass-text-xs",children:"🔇"})]}),H&&!u&&a.jsx(be,{participant:e})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[Ve(e),Z&&!u&&a.jsx("button",{onClick:r=>{r.stopPropagation(),he?.(e.id)},className:h("glass-p-1 glass-radius glass-text-sm glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",e.isMuted?"glass-text-danger":"glass-text-secondary"),children:e.isMuted?"🔇":"🎤"})]})]}),ie=p.filter(e=>e.isSpeaking).length,Pe=p.filter(e=>e.isConnected).length;return a.jsxs(Re,{ref:ye,intensity:"subtle",className:h("glass-p-4 glass-space-y-4",ve),...we,children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[a.jsxs("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:["Voice Chat (",Pe,")"]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-sm glass-text-primary-glass-opacity-60",children:[ie>0&&a.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),a.jsxs("span",{children:[ie," speaking"]})]}),w&&a.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-primary glass-radius-full glass-animate-pulse"}),a.jsx("span",{children:"Live"})]})]})]}),a.jsx("div",{className:h("glass-space-y-2",u&&"glass-max-h-64 glass-overflow-y-auto"),children:a.jsx(Le,{children:p.sort((e,s)=>e.isSpeaking&&!s.isSpeaking?-1:!e.isSpeaking&&s.isSpeaking?1:e.isConnected&&!s.isConnected?-1:!e.isConnected&&s.isConnected?1:e.name.localeCompare(s.name)).map((e,s)=>a.jsx(Fe,{participant:e,index:s},e.id))})}),!u&&a.jsxs("div",{className:"glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",children:[a.jsxs("span",{children:["Waveform: ",ee]}),a.jsxs("span",{children:["Sensitivity: ",se]})]})]})});try{Q.displayName="GlassVoiceWaveform",Q.__docgenInfo={description:"",displayName:"GlassVoiceWaveform",props:{participants:{defaultValue:null,description:"",name:"participants",required:!0,type:{name:"VoiceParticipant[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showMuteStatus:{defaultValue:{value:"true"},description:"",name:"showMuteStatus",required:!1,type:{name:"boolean | undefined"}},showConnectionStatus:{defaultValue:{value:"true"},description:"",name:"showConnectionStatus",required:!1,type:{name:"boolean | undefined"}},waveformStyle:{defaultValue:{value:"bars"},description:"",name:"waveformStyle",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"bars"'},{value:'"circular"'},{value:'"spectrum"'},{value:'"waves"'}]}},sensitivity:{defaultValue:{value:"1"},description:"",name:"sensitivity",required:!1,type:{name:"number | undefined"}},smoothing:{defaultValue:{value:"0.8"},description:"",name:"smoothing",required:!1,type:{name:"number | undefined"}},colorMode:{defaultValue:{value:"participant"},description:"",name:"colorMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"rainbow"'},{value:'"activity"'},{value:'"participant"'}]}},maxBars:{defaultValue:{value:"32"},description:"",name:"maxBars",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},soundVisualization:{defaultValue:{value:"true"},description:"",name:"soundVisualization",required:!1,type:{name:"boolean | undefined"}},showVoiceActivity:{defaultValue:{value:"true"},description:"",name:"showVoiceActivity",required:!1,type:{name:"boolean | undefined"}},compactMode:{defaultValue:{value:"false"},description:"",name:"compactMode",required:!1,type:{name:"boolean | undefined"}},onParticipantClick:{defaultValue:null,description:"",name:"onParticipantClick",required:!1,type:{name:"((participantId: string) => void) | undefined"}},onMuteToggle:{defaultValue:null,description:"",name:"onMuteToggle",required:!1,type:{name:"((participantId: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"1",name:"Alice Johnson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#FF6B6B",isSpeaking:!0,isMuted:!1,audioLevel:.7,lastActivity:Date.now(),isConnected:!0},{id:"2",name:"Bob Smith",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#4ECDC4",isSpeaking:!1,isMuted:!1,audioLevel:.1,lastActivity:Date.now()-5e3,isConnected:!0},{id:"3",name:"Carol Davis",color:"#45B7D1",isSpeaking:!0,isMuted:!1,audioLevel:.9,lastActivity:Date.now()-1e3,isConnected:!0},{id:"4",name:"David Wilson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",color:"#96CEB4",isSpeaking:!1,isMuted:!0,audioLevel:0,lastActivity:Date.now()-1e4,isConnected:!0},{id:"5",name:"Emma Brown",color:"#FECA57",isSpeaking:!1,isMuted:!1,audioLevel:.3,lastActivity:Date.now()-3e3,isConnected:!1},{id:"current",name:"You",color:"#FF9FF3",isSpeaking:!1,isMuted:!1,audioLevel:0,lastActivity:Date.now(),isConnected:!0}],Qe={title:"Workflows/Glass Voice Waveform",component:Q,parameters:{layout:"centered"},tags:["autodocs"],args:{onParticipantClick:ce(),onMuteToggle:ce()},argTypes:{waveformStyle:{control:{type:"select"},options:["bars","waves","circular","spectrum"]},colorMode:{control:{type:"select"},options:["participant","activity","rainbow"]},sensitivity:{control:{type:"range",min:.1,max:2,step:.1}},smoothing:{control:{type:"range",min:0,max:1,step:.1}},maxBars:{control:{type:"range",min:8,max:64,step:4}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}}}},k={args:{participants:o,currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0,showConnectionStatus:!0,showVoiceActivity:!0}},C={args:{participants:o,currentUserId:"current",waveformStyle:"bars",showAvatars:!0,showNames:!0,realTimeMode:!0}},N={args:{participants:o,currentUserId:"current",waveformStyle:"waves",showAvatars:!0,showNames:!0,realTimeMode:!0}},b={args:{participants:o,currentUserId:"current",waveformStyle:"circular",showAvatars:!0,showNames:!0,realTimeMode:!0}},I={args:{participants:o,currentUserId:"current",waveformStyle:"spectrum",showAvatars:!0,showNames:!0,realTimeMode:!0}},j={args:{participants:o,currentUserId:"current",realTimeMode:!0,soundVisualization:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},U={args:{participants:o,currentUserId:"current",colorMode:"activity",realTimeMode:!0,showAvatars:!0,showNames:!0}},D={args:{participants:o,currentUserId:"current",colorMode:"rainbow",realTimeMode:!0,showAvatars:!0,showNames:!0}},V={args:{participants:o,currentUserId:"current",compactMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!1}},F={args:{participants:o,currentUserId:"current",showAvatars:!1,showNames:!1,showMuteStatus:!1,showConnectionStatus:!1,showVoiceActivity:!1,waveformStyle:"bars"}},P={args:{participants:o.map(n=>({...n,isSpeaking:["1","3","5"].includes(n.id),audioLevel:["1","3","5"].includes(n.id)?Math.random()*.8+.2:.05})),currentUserId:"current",realTimeMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},T={args:{participants:o.map(n=>({...n,isMuted:["2","4","current"].includes(n.id),isSpeaking:!1,audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0}},E={args:{participants:o.map(n=>({...n,isConnected:!["4","5"].includes(n.id),isSpeaking:n.isConnected?n.isSpeaking:!1,audioLevel:n.isConnected?n.audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showConnectionStatus:!0}},L={args:{participants:o,currentUserId:"current",sensitivity:2,realTimeMode:!0,showAvatars:!0,showNames:!0}},B={args:{participants:o,currentUserId:"current",smoothing:.2,realTimeMode:!0,showAvatars:!0,showNames:!0}},W={args:{participants:o,currentUserId:"current",maxBars:64,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},q={args:{participants:o,currentUserId:"current",maxBars:8,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},R={args:{participants:o,currentUserId:"current",animationSpeed:3,realTimeMode:!0,showAvatars:!0,showNames:!0}},_={args:{participants:o,currentUserId:"current",animationSpeed:.3,realTimeMode:!0,showAvatars:!0,showNames:!0}},$={args:{participants:[o.find(n=>n.id==="current")],currentUserId:"current",showAvatars:!0,showNames:!0,showVoiceActivity:!0}},G={args:{participants:[...o,...Array.from({length:8},(n,v)=>({id:`extra-${v}`,name:`User ${v+7}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF","#5F27CD","#00D2D3"][v],isSpeaking:Math.random()>.7,isMuted:Math.random()>.8,audioLevel:Math.random()*.8,lastActivity:Date.now()-Math.random()*1e4,isConnected:Math.random()>.1}))],currentUserId:"current",realTimeMode:!0,compactMode:!0,showAvatars:!0,showNames:!0}},O={args:{participants:o,currentUserId:"current",soundVisualization:!1,realTimeMode:!0,showAvatars:!0,showNames:!0}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true,
    showConnectionStatus: true,
    showVoiceActivity: true
  }
}`,...k.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'bars',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'waves',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'circular',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...b.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'rainbow',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...D.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    compactMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: false
  }
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    sensitivity: 2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...L.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    smoothing: 0.2,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    maxBars: 64,
    waveformStyle: 'bars',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...W.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 0.3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    participants: [mockParticipants.find(p => p.id === 'current')!],
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,...$.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};const Ze=["Default","BarWaveform","WaveWaveform","CircularWaveform","SpectrumWaveform","RealTimeMode","ActivityColorMode","RainbowColorMode","CompactMode","MinimalInterface","ActiveSpeakers","MutedUsers","DisconnectedUsers","HighSensitivity","LowSmoothing","ManyBars","FewBars","FastAnimation","SlowAnimation","SoloCall","LargeGroup","SilentMode"];export{P as ActiveSpeakers,U as ActivityColorMode,C as BarWaveform,b as CircularWaveform,V as CompactMode,k as Default,E as DisconnectedUsers,R as FastAnimation,q as FewBars,L as HighSensitivity,G as LargeGroup,B as LowSmoothing,W as ManyBars,F as MinimalInterface,T as MutedUsers,D as RainbowColorMode,j as RealTimeMode,O as SilentMode,_ as SlowAnimation,$ as SoloCall,I as SpectrumWaveform,N as WaveWaveform,Ze as __namedExportsOrder,Qe as default};
