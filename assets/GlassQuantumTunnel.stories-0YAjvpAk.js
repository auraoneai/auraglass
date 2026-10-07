import{r as g,a as ce,b as w,j as a,d as re,m as G}from"./iframe-RsoZoStf.js";import{u as ge}from"./a11y-WSL2JlLl.js";import{u as de}from"./useMotionPreference-CDEdIw_0.js";import{O as me}from"./OptimizedGlassCore-IzbAukgr.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CB0YcTGX.js";const ne=(s,d,p)=>{const y=Math.sqrt(2*d),x=d/(2*Math.PI);return Math.sin(y*s-x*p)},he=(s,d,p)=>{if(s>=d)return 1;const y=Math.sqrt(2*(d-s));return Math.exp(-2*y*p)},m={error:s=>`rgba(100, 116, 139, ${Math.min(.48,s)})`,info:s=>`rgba(148, 163, 184, ${s})`,secondary:s=>`rgba(203, 213, 225, ${s})`,white:s=>`rgba(241, 245, 249, ${s})`,hover:"rgba(100, 116, 139, 0.28)"},v={background:"linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",backgroundColor:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.18)",color:"var(--glass-theme-text, var(--glass-text-primary))",backdropFilter:"blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",WebkitBackdropFilter:"blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",boxShadow:"0 12px 32px rgba(15, 23, 42, 0.12)"},R=g.forwardRef(({quantumStates:s=[],barriers:d=[],showWaveFunction:p=!0,showTunnelingProbability:y=!0,showEnergyLevels:x=!0,showBarriers:U=!0,animateTransitions:xe=!0,tunnelingSpeed:J=1,waveAmplitude:$=20,coherenceDecay:fe=.02,realTimeMode:z=!1,onStateTransition:K,onTunnelingEvent:X,className:te="",...ie},oe)=>{const f=ce(),Y=g.useRef(null),[h,le]=g.useState(0),[b,Z]=g.useState([]),[O,ee]=g.useState(new Set),[H,_]=g.useState([]);ge("glass-quantum-tunnel");const{shouldAnimate:ue}=de();g.useEffect(()=>{if(s.length===0){_([]);return}const n=s.map((e,r)=>({id:`particle-${e.id}`,x:e.position.x,y:e.position.y,energy:e.energy,wavePhase:Math.random()*Math.PI*2,tunneling:!1}));_(n)},[s]),g.useEffect(()=>{if(s.length===0)return;const n=setInterval(()=>{le(e=>e+.1*J)},w.DURATION.fast);return()=>clearInterval(n)},[J,s.length]),g.useEffect(()=>{if(!z||s.length===0)return;const n=setInterval(()=>{s.forEach(e=>{e.isActive&&e.connections.forEach(r=>{const o=s.find(u=>u.id===r);if(!o)return;const t=d.find(u=>Math.abs(u.position.x-(e.position.x+o.position.x)/2)<u.width/2);let i=1;t&&(i=he(e.energy,t.height,t.width)),Math.random()<i*.1&&(Z(u=>[...u,{from:e.id,to:r,progress:0,probability:i,startTime:h}]),X?.(i),K?.(e.id,r))})})},w.DURATION.slower*3);return()=>clearInterval(n)},[z,s,d,h,X,K]),g.useEffect(()=>{s.length!==0&&Z(n=>n.map(e=>({...e,progress:Math.min(1,(h-e.startTime)/5)})).filter(e=>e.progress<1))},[h,s.length]),g.useEffect(()=>{s.length!==0&&_(n=>n.map(e=>{const r=s.find(i=>i.id===e.id.replace("particle-",""));if(!r)return e;const o=(e.wavePhase+.1)%(2*Math.PI),t=b.find(i=>i.from===r.id&&i.progress<1);if(t){const i=s.find(u=>u.id===t.to);if(i)return{...e,x:r.position.x+(i.position.x-r.position.x)*t.progress,y:r.position.y+(i.position.y-r.position.y)*t.progress,wavePhase:o,tunneling:!0,targetState:t.to}}return{...e,x:r.position.x,y:r.position.y,wavePhase:o,tunneling:!1,targetState:void 0}}))},[s,b,h]),g.useEffect(()=>{const n=Y.current;if(!n)return;const e=n.getContext("2d");e&&(e.clearRect(0,0,n.width,n.height),U&&d.forEach(r=>{e.fillStyle=m.error(r.transparency),e.fillRect(r.position.x-r.width/2,50,r.width,r.height),e.fillStyle=m.white(.8),e.font="12px Arial",e.textAlign="center",e.fillText(`${r.height.toFixed(1)} eV`,r.position.x,45)}),x&&s.forEach(r=>{const o=200-r.energy*20;e.strokeStyle=m.info(.6),e.lineWidth=2,e.setLineDash&&e.setLineDash([5,5]),e.beginPath(),e.moveTo(r.position.x-30,o),e.lineTo(r.position.x+30,o),e.stroke(),e.setLineDash&&e.setLineDash([])}),p&&H.forEach(r=>{const o=s.find(t=>t.id===r.id.replace("particle-",""));if(o){e.strokeStyle=r.tunneling?m.secondary(.8):m.info(.6),e.lineWidth=2,e.beginPath();for(let t=-50;t<=50;t+=2){const i=ne(t/10,o.energy,h+r.wavePhase),u=o.position.y+i*$;t===-50?e.moveTo(r.x+t,u):e.lineTo(r.x+t,u)}e.stroke(),e.fillStyle=r.tunneling?m.secondary(.2):m.info(.2),e.beginPath(),e.moveTo(r.x-50,o.position.y);for(let t=-50;t<=50;t+=2){const i=ne(t/10,o.energy,h+r.wavePhase),u=o.position.y+Math.abs(i)*$*.5;e.lineTo(r.x+t,u)}e.lineTo(r.x+50,o.position.y),e.closePath(),e.fill()}}),H.forEach(r=>{const o=r.tunneling?8:6,t=r.tunneling?.9:.7;e.beginPath(),e.arc(r.x,r.y,o,0,2*Math.PI);const i=e.createRadialGradient(r.x,r.y,0,r.x,r.y,o);if(i.addColorStop(0,m.white(t)),i.addColorStop(1,m.info(t*.3)),e.fillStyle=i,e.fill(),r.tunneling)for(let u=1;u<=3;u++)e.beginPath(),e.arc(r.x,r.y,o+u*4,0,2*Math.PI),e.strokeStyle=m.secondary(.3/u),e.lineWidth=2,e.stroke()}),s.forEach(r=>{r.connections.forEach(o=>{const t=s.find(i=>i.id===o);t&&(e.strokeStyle=m.hover,e.lineWidth=1,e.setLineDash([3,3]),e.beginPath(),e.moveTo(r.position.x,r.position.y),e.lineTo(t.position.x,t.position.y),e.stroke(),e.setLineDash&&e.setLineDash([]))})}))},[s,H,d,h,p,x,U,$]);const se=n=>{ee(e=>new Set(e).add(n))},ae=g.useMemo(()=>s.reduce((n,e)=>n+e.tunnelingProbability,0)/Math.max(1,s.length),[s]);return a.jsx(me,{"data-glass-component":!0,ref:oe,variant:"frosted",className:`relative ${te}`,role:"region","aria-label":"Quantum tunneling visualization",...ie,children:a.jsxs("div",{className:"glass-p-6 glass-space-y-4",children:[a.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between glass-flex-wrap glass-gap-3",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Quantum Tunnel"}),a.jsxs("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:[s.length," quantum states • ",d.length," ","barriers"]})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[a.jsxs("div",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:["T: ",(ae*100).toFixed(1),"%"]}),z&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Live"})]})]})]}),a.jsxs("div",{className:"glass-relative",children:[a.jsx("style",{children:`
              .glass-quantum-tunnel-state-rail {
                display: none;
              }

              @media (max-width: 520px) {
                .glass-quantum-tunnel-canvas-state {
                  display: none !important;
                }

                .glass-quantum-tunnel-state-rail {
                  display: grid;
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                  gap: 8px;
                  margin-top: 12px;
                  width: 100%;
                }
              }
            `}),a.jsx("canvas",{ref:Y,width:800,height:300,className:"glass-border glass-border-subtle glass-radius-lg",style:{width:"100%",maxWidth:"100%",height:"auto",display:"block",background:"rgba(255, 255, 255, 0.22)"}}),a.jsx(re,{children:s.map(n=>a.jsxs(G.div,{className:"glass-quantum-tunnel-canvas-state glass-absolute glass-cursor-pointer glass-radius-lg glass-p-2",style:{left:`${n.position.x/800*100}%`,top:`${Math.min(88,Math.max(14,(n.position.y+32)/300*100))}%`,transform:"translate(-50%, -50%)",minWidth:86,maxWidth:128,zIndex:2,...v},initial:{opacity:0,scale:.8},animate:f?{}:{opacity:n.isActive?1:.5,scale:O.has(n.id)?1.2:1},whileHover:{scale:1.1},onClick:()=>se(n.id),transition:ue?{duration:w.DURATION.normal/1e3}:{duration:0},children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[n.icon&&a.jsx("span",{className:"glass-text-lg",children:n.icon}),a.jsxs("div",{children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:n.label}),y&&a.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["T: ",(n.tunnelingProbability*100).toFixed(1),"%"]})]})]}),O.has(n.id)&&a.jsx(G.div,{className:"glass-absolute glass-top-1 glass--right-1 glass-w-3 glass-h-3 glass-surface-green glass-radius-full",initial:{scale:0},animate:f?{}:{scale:1},transition:f?{duration:0}:{duration:w.DURATION.fast/1e3}})]},n.id))}),a.jsx("div",{className:"glass-quantum-tunnel-state-rail","aria-label":"Quantum states",children:s.map(n=>a.jsx("button",{type:"button",className:"glass-radius-lg glass-p-2 glass-text-left glass-focus glass-touch-target",style:{...v,appearance:"none",minWidth:0,width:"100%"},onClick:()=>se(n.id),children:a.jsxs("span",{className:"glass-flex glass-items-center glass-gap-2",children:[n.icon&&a.jsx("span",{className:"glass-text-base","aria-hidden":"true",children:n.icon}),a.jsxs("span",{style:{minWidth:0},children:[a.jsx("span",{className:"glass-block glass-text-xs glass-font-medium glass-text-primary",children:n.label}),y&&a.jsxs("span",{className:"glass-block glass-text-xs glass-text-secondary",children:["T: ",(n.tunnelingProbability*100).toFixed(1),"%"]})]})]})},`compact-${n.id}`))}),a.jsx(re,{children:b.map(n=>{const e=s.find(i=>i.id===n.from),r=s.find(i=>i.id===n.to);if(!e||!r)return null;const o=e.position.x+(r.position.x-e.position.x)*n.progress,t=e.position.y+(r.position.y-e.position.y)*n.progress;return a.jsx(G.div,{className:"glass-absolute glass-pointer-events-none",style:{left:`${o/800*100}%`,top:`${t/300*100}%`,transform:"translate(-50%, -50%)"},initial:{opacity:0,scale:.5},animate:f?{}:{opacity:1,scale:1},exit:{opacity:0,scale:.5},children:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-radius-full glass-shadow-lg",style:{background:"var(--glass-theme-text-secondary, var(--glass-text-secondary))"},"aria-label":`Tunneling ${(n.probability*100).toFixed(1)} percent`})},`${n.from}-${n.to}-${n.startTime}`)})})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-flex-wrap glass-gap-3",children:[a.jsx("div",{className:"glass-flex glass-items-center glass-space-x-4",children:a.jsx("button",{onClick:()=>ee(new Set),className:"glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-focus",style:v,children:"Reset Measurements"})}),a.jsxs("div",{className:"glass-flex glass-items-center glass-flex-wrap glass-gap-4 glass-text-sm glass-text-secondary",children:[a.jsxs("div",{children:["Time: ",h.toFixed(1)]}),a.jsxs("div",{children:["Active: ",b.length]}),a.jsxs("div",{children:["Measured: ",O.size]})]})]}),a.jsxs("div",{className:"glass-p-4 glass-radius-lg glass-space-y-3",style:v,children:[a.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-90",children:"Quantum Statistics"}),a.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Avg Tunneling:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[(ae*100).toFixed(1),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Wave Coherence:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[(Math.cos(h*.5)*50+50).toFixed(0),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Energy Spread:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[s.length>0?(Math.max(...s.map(n=>n.energy))-Math.min(...s.map(n=>n.energy))).toFixed(1):"0"," ","eV"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Barrier Count:"}),a.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:d.length})]})]}),b.length>0&&a.jsxs("div",{className:"glass-space-y-1",children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm",children:"Active Tunneling:"}),a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:b.slice(-3).map((n,e)=>a.jsxs("div",{className:"glass-px-2 glass-py-1 glass-text-xs glass-text-secondary glass-radius glass-border glass-border-subtle",style:{background:"rgba(255, 255, 255, 0.42)"},children:[n.from," → ",n.to," (",(n.probability*100).toFixed(0),"%)"]},e))})]})]})]})})});R.displayName="GlassQuantumTunnel";try{R.displayName="GlassQuantumTunnel",R.__docgenInfo={description:"",displayName:"GlassQuantumTunnel",props:{quantumStates:{defaultValue:{value:"[]"},description:"",name:"quantumStates",required:!1,type:{name:"QuantumState[] | undefined"}},barriers:{defaultValue:{value:"[]"},description:"",name:"barriers",required:!1,type:{name:"TunnelBarrier[] | undefined"}},showWaveFunction:{defaultValue:{value:"true"},description:"",name:"showWaveFunction",required:!1,type:{name:"boolean | undefined"}},showTunnelingProbability:{defaultValue:{value:"true"},description:"",name:"showTunnelingProbability",required:!1,type:{name:"boolean | undefined"}},showEnergyLevels:{defaultValue:{value:"true"},description:"",name:"showEnergyLevels",required:!1,type:{name:"boolean | undefined"}},showBarriers:{defaultValue:{value:"true"},description:"",name:"showBarriers",required:!1,type:{name:"boolean | undefined"}},animateTransitions:{defaultValue:{value:"true"},description:"",name:"animateTransitions",required:!1,type:{name:"boolean | undefined"}},tunnelingSpeed:{defaultValue:{value:"1"},description:"",name:"tunnelingSpeed",required:!1,type:{name:"number | undefined"}},waveAmplitude:{defaultValue:{value:"20"},description:"",name:"waveAmplitude",required:!1,type:{name:"number | undefined"}},coherenceDecay:{defaultValue:{value:"0.02"},description:"",name:"coherenceDecay",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},onStateTransition:{defaultValue:null,description:"",name:"onStateTransition",required:!1,type:{name:"((fromId: string, toId: string) => void) | undefined"}},onTunnelingEvent:{defaultValue:null,description:"",name:"onTunnelingEvent",required:!1,type:{name:"((probability: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const l=[{id:"state1",label:"Ground State",icon:"⚪",position:{x:100,y:150,z:0},waveFunction:.8,energy:1,barrierHeight:3,tunnelingProbability:.3,isActive:!0,connections:["state2","state3"]},{id:"state2",label:"Excited State",icon:"🔴",position:{x:300,y:100,z:0},waveFunction:.6,energy:2.5,barrierHeight:3,tunnelingProbability:.7,isActive:!0,connections:["state1","state4"]},{id:"state3",label:"Metastable",icon:"🟡",position:{x:200,y:200,z:0},waveFunction:-.4,energy:1.8,barrierHeight:4,tunnelingProbability:.5,isActive:!0,connections:["state1","state4"]},{id:"state4",label:"High Energy",icon:"🔵",position:{x:500,y:120,z:0},waveFunction:.9,energy:4,barrierHeight:2,tunnelingProbability:.9,isActive:!0,connections:["state2","state3"]}],c=[{id:"barrier1",height:3,width:30,position:{x:200,y:0},transparency:.6,quantumCoherence:.8},{id:"barrier2",height:4,width:40,position:{x:400,y:0},transparency:.7,quantumCoherence:.6}],pe=l.map(s=>({...s,energy:s.energy+2,tunnelingProbability:Math.min(.95,s.tunnelingProbability+.3)})),ye=l.map(s=>({...s,energy:Math.max(.5,s.energy-1),tunnelingProbability:Math.max(.1,s.tunnelingProbability-.4)})),be=[...l,{id:"state5",label:"Virtual State",icon:"👻",position:{x:150,y:250,z:0},waveFunction:.3,energy:.8,barrierHeight:5,tunnelingProbability:.2,isActive:!0,connections:["state1","state3"]},{id:"state6",label:"Resonance",icon:"⭐",position:{x:350,y:180,z:0},waveFunction:-.7,energy:3.2,barrierHeight:1.5,tunnelingProbability:.8,isActive:!0,connections:["state2","state4","state5"]}],Fe={title:"Effects + Advanced/Glass Quantum Tunnel",component:R,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{tunnelingSpeed:{control:{type:"range",min:.1,max:3,step:.1}},waveAmplitude:{control:{type:"range",min:5,max:50,step:5}},coherenceDecay:{control:{type:"range",min:0,max:.1,step:.005}}}},T={args:{quantumStates:l,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,animateTransitions:!0,realTimeMode:!0}},S={args:{quantumStates:l,barriers:c,realTimeMode:!0,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,animateTransitions:!0,tunnelingSpeed:1.5}},M={args:{quantumStates:pe,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},P={args:{quantumStates:ye,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},F={args:{quantumStates:l,barriers:[],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!1,realTimeMode:!0}},j={args:{quantumStates:l,barriers:c,showWaveFunction:!0,showTunnelingProbability:!1,showEnergyLevels:!1,showBarriers:!1,realTimeMode:!0}},k={args:{quantumStates:l,barriers:c,showWaveFunction:!1,showTunnelingProbability:!1,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!1}},N={args:{quantumStates:l,barriers:c,showWaveFunction:!1,showTunnelingProbability:!1,showEnergyLevels:!1,showBarriers:!1,animateTransitions:!1,realTimeMode:!1}},E={args:{quantumStates:be,barriers:[...c,{id:"barrier3",height:2.5,width:25,position:{x:250,y:0},transparency:.5,quantumCoherence:.9}],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},W={args:{quantumStates:l,barriers:c,tunnelingSpeed:3,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},B={args:{quantumStates:l,barriers:c,tunnelingSpeed:.3,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},q={args:{quantumStates:l,barriers:c,waveAmplitude:40,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},L={args:{quantumStates:l,barriers:c,waveAmplitude:10,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},A={args:{quantumStates:l,barriers:c,coherenceDecay:.08,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},Q={args:{quantumStates:l,barriers:c,coherenceDecay:.01,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},D={args:{quantumStates:l,barriers:c.map(s=>({...s,width:s.width*2,height:s.height*1.5})),showWaveFunction:!0,showTunnelingProbability:!0,showBarriers:!0,realTimeMode:!0}},C={args:{quantumStates:l,barriers:c.map(s=>({...s,width:Math.max(5,s.width*.3),height:s.height*.7})),showWaveFunction:!0,showTunnelingProbability:!0,showBarriers:!0,realTimeMode:!0}},V={args:{quantumStates:[l[0]],barriers:[],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,realTimeMode:!1}},I={args:{quantumStates:l,barriers:c,realTimeMode:!1,animateTransitions:!1,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    animateTransitions: true,
    realTimeMode: true
  }
}`,...T.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    realTimeMode: true,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    animateTransitions: true,
    tunnelingSpeed: 1.5
  }
}`,...S.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: highEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...M.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: lowEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...P.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: false,
    realTimeMode: true
  }
}`,...F.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: false,
    showEnergyLevels: false,
    showBarriers: false,
    realTimeMode: true
  }
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: false,
    showTunnelingProbability: false,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: false
  }
}`,...k.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: false,
    showTunnelingProbability: false,
    showEnergyLevels: false,
    showBarriers: false,
    animateTransitions: false,
    realTimeMode: false
  }
}`,...N.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: complexSystem,
    barriers: [...mockBarriers, {
      id: 'barrier3',
      height: 2.5,
      width: 25,
      position: {
        x: 250,
        y: 0
      },
      transparency: 0.5,
      quantumCoherence: 0.9
    }],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...E.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 0.3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...B.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 40,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...q.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 10,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.08,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...A.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.01,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...Q.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers.map(barrier => ({
      ...barrier,
      width: barrier.width * 2,
      height: barrier.height * 1.5
    })),
    showWaveFunction: true,
    showTunnelingProbability: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...D.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers.map(barrier => ({
      ...barrier,
      width: Math.max(5, barrier.width * 0.3),
      height: barrier.height * 0.7
    })),
    showWaveFunction: true,
    showTunnelingProbability: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...C.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: [mockQuantumStates[0]],
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    realTimeMode: false
  }
}`,...V.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    realTimeMode: false,
    animateTransitions: false,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true
  }
}`,...I.parameters?.docs?.source}}};const je=["Default","RealTimeMode","HighEnergyStates","LowEnergyStates","NoBarriers","WaveFunctionOnly","EnergyLevelsOnly","MinimalVisualization","ComplexSystem","FastTunneling","SlowTunneling","HighAmplitude","LowAmplitude","FastCoherenceDecay","SlowCoherenceDecay","ThickBarriers","ThinBarriers","SingleState","StaticMode"];export{E as ComplexSystem,T as Default,k as EnergyLevelsOnly,A as FastCoherenceDecay,W as FastTunneling,q as HighAmplitude,M as HighEnergyStates,L as LowAmplitude,P as LowEnergyStates,N as MinimalVisualization,F as NoBarriers,S as RealTimeMode,V as SingleState,Q as SlowCoherenceDecay,B as SlowTunneling,I as StaticMode,D as ThickBarriers,C as ThinBarriers,j as WaveFunctionOnly,je as __namedExportsOrder,Fe as default};
