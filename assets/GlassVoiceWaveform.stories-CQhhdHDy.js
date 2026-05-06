import{f as ie}from"./index-CLSxArU-.js";import{r as c,b as Te,h as Le,j as r,e as Be,m as S}from"./iframe-OZreUAtx.js";import{u as We}from"./soundDesign-CS6RtZ5F.js";import{u as qe}from"./useMotionPreference-C9fYZmaT.js";import{c as ce}from"./createGlassStyle-BfWnO-qv.js";import{O as $e}from"./OptimizedGlassCore-DAQZMOh8.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";const M={low:"var(--glass-gray-600)",medium:"var(--glass-color-success)",high:"var(--glass-color-warning)",peak:"var(--glass-color-danger)"},ue=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43"],K=c.forwardRef(({participants:n,currentUserId:f,showAvatars:le=!0,showNames:de=!0,showMuteStatus:Q=!0,showConnectionStatus:me=!0,waveformStyle:Z="bars",sensitivity:ee=1,smoothing:O=.8,colorMode:pe="participant",maxBars:w=32,animationSpeed:se=1,realTimeMode:v=!1,soundVisualization:re=!0,showVoiceActivity:z=!0,compactMode:u=!1,onParticipantClick:ge,onMuteToggle:he,className:fe="",...ve},we)=>{const ye=Te(),[xe,Se]=c.useState({}),[Me,Ae]=c.useState({}),[p,Ne]=c.useState(n),y=c.useRef(),ae=c.useRef(p),te=c.useRef({maxBars:w,smoothing:O}),{play:ne}=We();Le("glass-voice-waveform");const{shouldAnimate:H}=qe(),ke=(e,s)=>{const a=[],t=e*ee;for(let i=0;i<s;i++){const m=i/s*Math.PI*4;let d=Math.sin(m)*t;d+=(Math.random()-.5)*t*.3,d*=Math.max(.1,1-i/s*.7),a.push(Math.max(0,Math.min(1,d)))}return a};c.useEffect(()=>{if(!v)return;const e=setInterval(()=>{Ne(s=>s.map(a=>{if(!a.isConnected)return a;const t=a.isSpeaking,i=Math.random()<.3,m=i?Math.random()*.8+.2:Math.random()*.1;return!t&&i&&re&&ne("notification"),{...a,isSpeaking:i,audioLevel:m,lastActivity:i?Date.now():a.lastActivity}}))},200);return()=>clearInterval(e)},[v,re,ne]),c.useEffect(()=>{ae.current=p},[p]),c.useEffect(()=>{te.current={maxBars:w,smoothing:O}},[w,O]),c.useEffect(()=>{if(!v)return;let e=!0;const s=()=>{if(!e)return;const{maxBars:a,smoothing:t}=te.current,i=ae.current;Se(m=>{const d={};return i.forEach(l=>{const g=m[l.id]||new Array(a).fill(0);if(l.isSpeaking&&l.audioLevel>.1){const h=ke(l.audioLevel,a),Y=g.map((J,X)=>J*t+h[X]*(1-t));d[l.id]=Y}else d[l.id]=g.map(h=>h*.9)}),d}),y.current=requestAnimationFrame(s)};return y.current=requestAnimationFrame(s),()=>{e=!1,y.current&&cancelAnimationFrame(y.current)}},[v]),c.useEffect(()=>{z&&Ae(e=>{const s={...e},a=Date.now();return p.forEach(t=>{s[t.id]||(s[t.id]=[]);const i=s[t.id];t.isSpeaking&&i.push(a),s[t.id]=i.filter(m=>a-m<3e4)}),s})},[p,z]);const x=(e,s)=>{switch(pe){case"activity":return e.isSpeaking?e.audioLevel<.3?M.medium:e.audioLevel<.6?M.high:M.peak:M.low;case"rainbow":return ue[s%ue.length];default:return e.color}},Ce=({participant:e})=>{const s=Me[e.id]||[],a=s.length/10;return r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-flex glass-space-x-0.5",children:[0,1,2,3,4].map(t=>r.jsx("div",{className:`
                  w-1 h-3 rounded-full transition-all duration-300
                  ${a>t*.2?"bg-green-400":"bg-white/20"}
                `},t))}),r.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.length>0?`${s.length}`:"0"})]})},be=({participant:e,data:s})=>r.jsx("div",{className:"glass-flex glass-items-end glass-space-x-1 glass-h-12",children:s.map((a,t)=>r.jsx(S.div,{className:"glass-bg-transparent glass-radius-full",style:{width:u?"2px":"3px",color:x(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(2,a*48)}px`,opacity:e.isSpeaking?.8:.3},transition:H?{duration:.1*se,ease:"easeOut"}:{duration:0}},t))}),Ie=({participant:e,data:s})=>r.jsx("svg",{width:u?120:200,height:48,className:"glass-overflow-visible",children:r.jsx("path",{d:`M 0 24 ${s.map((a,t)=>`L ${t/(s.length-1)*(u?120:200)} ${24-a*20}`).join(" ")} L ${u?120:200} 24`,fill:"none",stroke:x(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3})}),Ue=({participant:e,data:s})=>{const a=u?20:30,t=a+5,i=a+5;return r.jsx("svg",{width:(a+5)*2,height:(a+5)*2,className:"glass-overflow-visible",children:s.map((m,d)=>{const l=d/s.length*Math.PI*2-Math.PI/2,g=a*.6,h=g+m*a*.4,Y=t+Math.cos(l)*g,J=i+Math.sin(l)*g,X=t+Math.cos(l)*h,Pe=i+Math.sin(l)*h;return r.jsx("line",{x1:Y,y1:J,x2:X,y2:Pe,stroke:x(e,n.indexOf(e)),strokeWidth:"2",opacity:e.isSpeaking?.8:.3},d)})})},je=({participant:e,data:s})=>r.jsx("div",{className:"glass-flex glass-items-end glass-justify-center glass-space-x-px glass-h-12 glass-w-32",children:s.map((a,t)=>r.jsx(S.div,{className:"glass-bg-transparent",style:{width:`${100/s.length}%`,color:x(e,n.indexOf(e)),opacity:e.isSpeaking?.8:.3},animate:{height:`${Math.max(1,a*48)}px`},transition:H?{duration:.1*se}:{duration:0}},t))}),De=e=>{const s=xe[e.id]||new Array(w).fill(0);switch(Z){case"waves":return r.jsx(Ie,{participant:e,data:s});case"circular":return r.jsx(Ue,{participant:e,data:s});case"spectrum":return r.jsx(je,{participant:e,data:s});default:return r.jsx(be,{participant:e,data:s})}},Ve=({participant:e,index:s})=>r.jsxs(S.div,{className:`
          flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200
          ${ce({blur:"sm",opacity:.8}).background}
          ${e.isSpeaking?"ring-2 ring-green-400/50":""}
          hover:bg-white/10
        `,onClick:()=>ge?.(e.id),whileHover:{scale:1.02},whileTap:{scale:.98},children:[le&&r.jsxs("div",{className:"glass-relative",children:[r.jsx("div",{className:`
              ${u?"w-8 h-8":"w-12 h-12"}
              rounded-full bg-gradient-to-br from-gray-300 to-gray-500 
              flex items-center justify-center text-white font-semibold
              ${ce({blur:"sm",opacity:.8}).background}
            `,children:e.avatar?r.jsx("img",{src:e.avatar,alt:e.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.name.charAt(0).toUpperCase()}),me&&r.jsx("div",{className:`
                absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                ${e.isConnected?"bg-green-400":"bg-red-400"}
              `}),e.isSpeaking&&r.jsx(S.div,{className:"glass-absolute glass-top-1 glass--right-1 glass-w-4 glass-h-4 glass-surface-green glass-radius-full",animate:ye?{}:{scale:[1,1.2,1]},transition:H?{duration:.8,repeat:1/0}:{duration:0}})]}),r.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[de&&r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[r.jsxs("p",{className:`
                font-medium text-white/90 truncate
                ${u?"text-sm":"text-base"}
              `,children:[e.name,e.id===f&&" (You)"]}),Q&&e.isMuted&&r.jsx("span",{className:"glass-text-primary glass-text-xs",children:"🔇"})]}),z&&!u&&r.jsx(Ce,{participant:e})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[De(e),Q&&!u&&r.jsx("button",{onClick:a=>{a.stopPropagation(),he?.(e.id)},className:`
                p-1 rounded text-sm transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard
                ${e.isMuted?"text-red-400 hover:text-red-300":"text-white/60 hover:text-white"}
              `,children:e.isMuted?"🔇":"🎤"})]})]}),oe=p.filter(e=>e.isSpeaking).length,Fe=p.filter(e=>e.isConnected).length;return r.jsxs($e,{ref:we,intensity:"subtle",className:`p-4 space-y-4 ${fe}`,...ve,children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[r.jsxs("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90",children:["Voice Chat (",Fe,")"]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4 glass-text-sm glass-text-primary-glass-opacity-60",children:[oe>0&&r.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),r.jsxs("span",{children:[oe," speaking"]})]}),v&&r.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-blue glass-radius-full glass-animate-pulse"}),r.jsx("span",{children:"Live"})]})]})]}),r.jsx("div",{className:`
          space-y-2
          ${u?"max-h-64 overflow-y-auto":""}
        `,children:r.jsx(Be,{children:p.sort((e,s)=>e.isSpeaking&&!s.isSpeaking?-1:!e.isSpeaking&&s.isSpeaking?1:e.isConnected&&!s.isConnected?-1:!e.isConnected&&s.isConnected?1:e.name.localeCompare(s.name)).map((e,s)=>r.jsx(Ve,{participant:e,index:s},e.id))})}),!u&&r.jsxs("div",{className:"glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",children:[r.jsxs("span",{children:["Waveform: ",Z]}),r.jsxs("span",{children:["Sensitivity: ",ee]})]})]})});try{K.displayName="GlassVoiceWaveform",K.__docgenInfo={description:"",displayName:"GlassVoiceWaveform",props:{participants:{defaultValue:null,description:"",name:"participants",required:!0,type:{name:"VoiceParticipant[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showMuteStatus:{defaultValue:{value:"true"},description:"",name:"showMuteStatus",required:!1,type:{name:"boolean | undefined"}},showConnectionStatus:{defaultValue:{value:"true"},description:"",name:"showConnectionStatus",required:!1,type:{name:"boolean | undefined"}},waveformStyle:{defaultValue:{value:"bars"},description:"",name:"waveformStyle",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"waves"'},{value:'"bars"'},{value:'"circular"'},{value:'"spectrum"'}]}},sensitivity:{defaultValue:{value:"1"},description:"",name:"sensitivity",required:!1,type:{name:"number | undefined"}},smoothing:{defaultValue:{value:"0.8"},description:"",name:"smoothing",required:!1,type:{name:"number | undefined"}},colorMode:{defaultValue:{value:"participant"},description:"",name:"colorMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"rainbow"'},{value:'"activity"'},{value:'"participant"'}]}},maxBars:{defaultValue:{value:"32"},description:"",name:"maxBars",required:!1,type:{name:"number | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},soundVisualization:{defaultValue:{value:"true"},description:"",name:"soundVisualization",required:!1,type:{name:"boolean | undefined"}},showVoiceActivity:{defaultValue:{value:"true"},description:"",name:"showVoiceActivity",required:!1,type:{name:"boolean | undefined"}},compactMode:{defaultValue:{value:"false"},description:"",name:"compactMode",required:!1,type:{name:"boolean | undefined"}},onParticipantClick:{defaultValue:null,description:"",name:"onParticipantClick",required:!1,type:{name:"((participantId: string) => void) | undefined"}},onMuteToggle:{defaultValue:null,description:"",name:"onMuteToggle",required:!1,type:{name:"((participantId: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"1",name:"Alice Johnson",avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face",color:"#FF6B6B",isSpeaking:!0,isMuted:!1,audioLevel:.7,lastActivity:Date.now(),isConnected:!0},{id:"2",name:"Bob Smith",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",color:"#4ECDC4",isSpeaking:!1,isMuted:!1,audioLevel:.1,lastActivity:Date.now()-5e3,isConnected:!0},{id:"3",name:"Carol Davis",color:"#45B7D1",isSpeaking:!0,isMuted:!1,audioLevel:.9,lastActivity:Date.now()-1e3,isConnected:!0},{id:"4",name:"David Wilson",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face",color:"#96CEB4",isSpeaking:!1,isMuted:!0,audioLevel:0,lastActivity:Date.now()-1e4,isConnected:!0},{id:"5",name:"Emma Brown",color:"#FECA57",isSpeaking:!1,isMuted:!1,audioLevel:.3,lastActivity:Date.now()-3e3,isConnected:!1},{id:"current",name:"You",color:"#FF9FF3",isSpeaking:!1,isMuted:!1,audioLevel:0,lastActivity:Date.now(),isConnected:!0}],Je={title:"Glass UI/Social/GlassVoiceWaveform",component:K,parameters:{layout:"centered"},tags:["autodocs"],args:{onParticipantClick:ie(),onMuteToggle:ie()},argTypes:{waveformStyle:{control:{type:"select"},options:["bars","waves","circular","spectrum"]},colorMode:{control:{type:"select"},options:["participant","activity","rainbow"]},sensitivity:{control:{type:"range",min:.1,max:2,step:.1}},smoothing:{control:{type:"range",min:0,max:1,step:.1}},maxBars:{control:{type:"range",min:8,max:64,step:4}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}}}},A={args:{participants:o,currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0,showConnectionStatus:!0,showVoiceActivity:!0}},N={args:{participants:o,currentUserId:"current",waveformStyle:"bars",showAvatars:!0,showNames:!0,realTimeMode:!0}},k={args:{participants:o,currentUserId:"current",waveformStyle:"waves",showAvatars:!0,showNames:!0,realTimeMode:!0}},C={args:{participants:o,currentUserId:"current",waveformStyle:"circular",showAvatars:!0,showNames:!0,realTimeMode:!0}},b={args:{participants:o,currentUserId:"current",waveformStyle:"spectrum",showAvatars:!0,showNames:!0,realTimeMode:!0}},I={args:{participants:o,currentUserId:"current",realTimeMode:!0,soundVisualization:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},U={args:{participants:o,currentUserId:"current",colorMode:"activity",realTimeMode:!0,showAvatars:!0,showNames:!0}},j={args:{participants:o,currentUserId:"current",colorMode:"rainbow",realTimeMode:!0,showAvatars:!0,showNames:!0}},D={args:{participants:o,currentUserId:"current",compactMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!1}},V={args:{participants:o,currentUserId:"current",showAvatars:!1,showNames:!1,showMuteStatus:!1,showConnectionStatus:!1,showVoiceActivity:!1,waveformStyle:"bars"}},F={args:{participants:o.map(n=>({...n,isSpeaking:["1","3","5"].includes(n.id),audioLevel:["1","3","5"].includes(n.id)?Math.random()*.8+.2:.05})),currentUserId:"current",realTimeMode:!0,showAvatars:!0,showNames:!0,showVoiceActivity:!0}},P={args:{participants:o.map(n=>({...n,isMuted:["2","4","current"].includes(n.id),isSpeaking:!1,audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showMuteStatus:!0}},T={args:{participants:o.map(n=>({...n,isConnected:!["4","5"].includes(n.id),isSpeaking:n.isConnected?n.isSpeaking:!1,audioLevel:n.isConnected?n.audioLevel:0})),currentUserId:"current",showAvatars:!0,showNames:!0,showConnectionStatus:!0}},L={args:{participants:o,currentUserId:"current",sensitivity:2,realTimeMode:!0,showAvatars:!0,showNames:!0}},B={args:{participants:o,currentUserId:"current",smoothing:.2,realTimeMode:!0,showAvatars:!0,showNames:!0}},W={args:{participants:o,currentUserId:"current",maxBars:64,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},q={args:{participants:o,currentUserId:"current",maxBars:8,waveformStyle:"bars",realTimeMode:!0,showAvatars:!0,showNames:!0}},$={args:{participants:o,currentUserId:"current",animationSpeed:3,realTimeMode:!0,showAvatars:!0,showNames:!0}},E={args:{participants:o,currentUserId:"current",animationSpeed:.3,realTimeMode:!0,showAvatars:!0,showNames:!0}},R={args:{participants:[o.find(n=>n.id==="current")],currentUserId:"current",showAvatars:!0,showNames:!0,showVoiceActivity:!0}},_={args:{participants:[...o,...Array.from({length:8},(n,f)=>({id:`extra-${f}`,name:`User ${f+7}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF","#5F27CD","#00D2D3"][f],isSpeaking:Math.random()>.7,isMuted:Math.random()>.8,audioLevel:Math.random()*.8,lastActivity:Date.now()-Math.random()*1e4,isConnected:Math.random()>.1}))],currentUserId:"current",realTimeMode:!0,compactMode:!0,showAvatars:!0,showNames:!0}},G={args:{participants:o,currentUserId:"current",soundVisualization:!1,realTimeMode:!0,showAvatars:!0,showNames:!0}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showMuteStatus: true,
    showConnectionStatus: true,
    showVoiceActivity: true
  }
}`,...A.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'bars',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'waves',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'circular',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...C.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    waveformStyle: 'spectrum',
    showAvatars: true,
    showNames: true,
    realTimeMode: true
  }
}`,...b.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    realTimeMode: true,
    soundVisualization: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,...I.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'activity',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...U.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    colorMode: 'rainbow',
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...j.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    compactMode: true,
    showAvatars: true,
    showNames: true,
    showVoiceActivity: false
  }
}`,...D.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...$.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    animationSpeed: 0.3,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...E.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    participants: [mockParticipants.find(p => p.id === 'current')!],
    currentUserId: 'current',
    showAvatars: true,
    showNames: true,
    showVoiceActivity: true
  }
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    participants: mockParticipants,
    currentUserId: 'current',
    soundVisualization: false,
    realTimeMode: true,
    showAvatars: true,
    showNames: true
  }
}`,...G.parameters?.docs?.source}}};const Xe=["Default","BarWaveform","WaveWaveform","CircularWaveform","SpectrumWaveform","RealTimeMode","ActivityColorMode","RainbowColorMode","CompactMode","MinimalInterface","ActiveSpeakers","MutedUsers","DisconnectedUsers","HighSensitivity","LowSmoothing","ManyBars","FewBars","FastAnimation","SlowAnimation","SoloCall","LargeGroup","SilentMode"];export{F as ActiveSpeakers,U as ActivityColorMode,N as BarWaveform,C as CircularWaveform,D as CompactMode,A as Default,T as DisconnectedUsers,$ as FastAnimation,q as FewBars,L as HighSensitivity,_ as LargeGroup,B as LowSmoothing,W as ManyBars,V as MinimalInterface,P as MutedUsers,j as RainbowColorMode,I as RealTimeMode,G as SilentMode,E as SlowAnimation,R as SoloCall,b as SpectrumWaveform,k as WaveWaveform,Xe as __namedExportsOrder,Je as default};
