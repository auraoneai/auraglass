import{r as d,b as ce,d as f,j as a,e as re,m as _}from"./iframe-DuFCckax.js";import{u as de}from"./a11y-BVXyQ8aU.js";import{u as me}from"./useMotionPreference-BRWo7C-p.js";import{c as G}from"./createGlassStyle-BfWnO-qv.js";import{O as ge}from"./OptimizedGlassCore-Dfu3jw2K.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-8v_R2xci.js";const ae=(s,m,p)=>{const b=Math.sqrt(2*m),w=m/(2*Math.PI);return Math.sin(b*s-w*p)},he=(s,m,p)=>{if(s>=m)return 1;const b=Math.sqrt(2*(m-s));return Math.exp(-2*b*p)},g={error:s=>`rgba(239, 68, 68, ${s})`,info:s=>`rgba(14, 165, 233, ${s})`,secondary:s=>`rgba(168, 85, 247, ${s})`,white:s=>`rgba(255, 255, 255, ${s})`,hover:"rgba(255, 255, 255, 0.22)"},I=d.forwardRef(({quantumStates:s=[],barriers:m=[],showWaveFunction:p=!0,showTunnelingProbability:b=!0,showEnergyLevels:w=!0,showBarriers:U=!0,animateTransitions:fe=!0,tunnelingSpeed:J=1,waveAmplitude:R=20,coherenceDecay:we=.02,realTimeMode:$=!1,onStateTransition:K,onTunnelingEvent:X,className:ne="",...te},ie)=>{const x=ce(),Y=d.useRef(null),[h,oe]=d.useState(0),[y,Z]=d.useState([]),[O,ee]=d.useState(new Set),[z,H]=d.useState([]);de("glass-quantum-tunnel");const{shouldAnimate:le}=me();d.useEffect(()=>{if(s.length===0){H([]);return}const n=s.map((e,r)=>({id:`particle-${e.id}`,x:e.position.x,y:e.position.y,energy:e.energy,wavePhase:Math.random()*Math.PI*2,tunneling:!1}));H(n)},[s]),d.useEffect(()=>{if(s.length===0)return;const n=setInterval(()=>{oe(e=>e+.1*J)},f.DURATION.fast);return()=>clearInterval(n)},[J,s.length]),d.useEffect(()=>{if(!$||s.length===0)return;const n=setInterval(()=>{s.forEach(e=>{e.isActive&&e.connections.forEach(r=>{const o=s.find(u=>u.id===r);if(!o)return;const t=m.find(u=>Math.abs(u.position.x-(e.position.x+o.position.x)/2)<u.width/2);let i=1;t&&(i=he(e.energy,t.height,t.width)),Math.random()<i*.1&&(Z(u=>[...u,{from:e.id,to:r,progress:0,probability:i,startTime:h}]),X?.(i),K?.(e.id,r))})})},f.DURATION.slower*3);return()=>clearInterval(n)},[$,s,m,h,X,K]),d.useEffect(()=>{s.length!==0&&Z(n=>n.map(e=>({...e,progress:Math.min(1,(h-e.startTime)/5)})).filter(e=>e.progress<1))},[h,s.length]),d.useEffect(()=>{s.length!==0&&H(n=>n.map(e=>{const r=s.find(i=>i.id===e.id.replace("particle-",""));if(!r)return e;const o=(e.wavePhase+.1)%(2*Math.PI),t=y.find(i=>i.from===r.id&&i.progress<1);if(t){const i=s.find(u=>u.id===t.to);if(i)return{...e,x:r.position.x+(i.position.x-r.position.x)*t.progress,y:r.position.y+(i.position.y-r.position.y)*t.progress,wavePhase:o,tunneling:!0,targetState:t.to}}return{...e,x:r.position.x,y:r.position.y,wavePhase:o,tunneling:!1,targetState:void 0}}))},[s,y,h]),d.useEffect(()=>{const n=Y.current;if(!n)return;const e=n.getContext("2d");e&&(e.clearRect(0,0,n.width,n.height),U&&m.forEach(r=>{e.fillStyle=g.error(r.transparency),e.fillRect(r.position.x-r.width/2,50,r.width,r.height),e.fillStyle=g.white(.8),e.font="12px Arial",e.textAlign="center",e.fillText(`${r.height.toFixed(1)} eV`,r.position.x,45)}),w&&s.forEach(r=>{const o=200-r.energy*20;e.strokeStyle=g.info(.6),e.lineWidth=2,e.setLineDash&&e.setLineDash([5,5]),e.beginPath(),e.moveTo(r.position.x-30,o),e.lineTo(r.position.x+30,o),e.stroke(),e.setLineDash&&e.setLineDash([])}),p&&z.forEach(r=>{const o=s.find(t=>t.id===r.id.replace("particle-",""));if(o){e.strokeStyle=r.tunneling?g.secondary(.8):g.info(.6),e.lineWidth=2,e.beginPath();for(let t=-50;t<=50;t+=2){const i=ae(t/10,o.energy,h+r.wavePhase),u=o.position.y+i*R;t===-50?e.moveTo(r.x+t,u):e.lineTo(r.x+t,u)}e.stroke(),e.fillStyle=r.tunneling?g.secondary(.2):g.info(.2),e.beginPath(),e.moveTo(r.x-50,o.position.y);for(let t=-50;t<=50;t+=2){const i=ae(t/10,o.energy,h+r.wavePhase),u=o.position.y+Math.abs(i)*R*.5;e.lineTo(r.x+t,u)}e.lineTo(r.x+50,o.position.y),e.closePath(),e.fill()}}),z.forEach(r=>{const o=r.tunneling?8:6,t=r.tunneling?.9:.7;e.beginPath(),e.arc(r.x,r.y,o,0,2*Math.PI);const i=e.createRadialGradient(r.x,r.y,0,r.x,r.y,o);if(i.addColorStop(0,g.white(t)),i.addColorStop(1,g.info(t*.3)),e.fillStyle=i,e.fill(),r.tunneling)for(let u=1;u<=3;u++)e.beginPath(),e.arc(r.x,r.y,o+u*4,0,2*Math.PI),e.strokeStyle=g.secondary(.3/u),e.lineWidth=2,e.stroke()}),s.forEach(r=>{r.connections.forEach(o=>{const t=s.find(i=>i.id===o);t&&(e.strokeStyle=g.hover,e.lineWidth=1,e.setLineDash([3,3]),e.beginPath(),e.moveTo(r.position.x,r.position.y),e.lineTo(t.position.x,t.position.y),e.stroke(),e.setLineDash&&e.setLineDash([]))})}))},[s,z,m,h,p,w,U,R]);const ue=n=>{ee(e=>new Set(e).add(n))},se=d.useMemo(()=>s.reduce((n,e)=>n+e.tunnelingProbability,0)/s.length,[s]);return a.jsx(ge,{"data-glass-component":!0,ref:ie,variant:"frosted",className:`relative ${ne}`,role:"region","aria-label":"Quantum tunneling visualization",...te,children:a.jsxs("div",{className:"glass-p-6 glass-space-y-4",children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Quantum Tunnel"}),a.jsxs("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:[s.length," quantum states • ",m.length," ","barriers"]})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[a.jsxs("div",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:["T: ",(se*100).toFixed(1),"%"]}),$&&a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1 glass-text-primary",children:[a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),a.jsx("span",{className:"glass-text-xs",children:"Live"})]})]})]}),a.jsxs("div",{className:"glass-relative",children:[a.jsx("canvas",{ref:Y,width:800,height:300,className:"glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20"}),a.jsx(re,{children:s.map(n=>a.jsxs(_.div,{className:`
                    absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2
                    ${G({opacity:.7}).background}
                    border border-white/20 rounded-lg p-2
                  `,style:{left:n.position.x,top:n.position.y},initial:{opacity:0,scale:.8},animate:x?{}:{opacity:n.isActive?1:.5,scale:O.has(n.id)?1.2:1},whileHover:{scale:1.1},onClick:()=>ue(n.id),transition:le?{duration:f.DURATION.normal/1e3}:{duration:0},children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[n.icon&&a.jsx("span",{className:"glass-text-lg",children:n.icon}),a.jsxs("div",{children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90",children:n.label}),b&&a.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["T: ",(n.tunnelingProbability*100).toFixed(1),"%"]})]})]}),O.has(n.id)&&a.jsx(_.div,{className:"glass-absolute glass-top-1 glass--right-1 glass-w-3 glass-h-3 glass-surface-green glass-radius-full",initial:{scale:0},animate:x?{}:{scale:1},transition:x?{duration:0}:{duration:f.DURATION.fast/1e3}})]},n.id))}),a.jsx(re,{children:y.map(n=>{const e=s.find(i=>i.id===n.from),r=s.find(i=>i.id===n.to);if(!e||!r)return null;const o=e.position.x+(r.position.x-e.position.x)*n.progress,t=e.position.y+(r.position.y-e.position.y)*n.progress;return a.jsxs(_.div,{className:"glass-absolute glass-pointer-events-none",style:{left:o,top:t,transform:"translate(-50%, -50%)"},initial:{opacity:0,scale:.5},animate:x?{}:{opacity:1,scale:1},exit:{opacity:0,scale:.5},children:[a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-pink glass-radius-full glass-shadow-lg glass-animate-pulse"}),a.jsxs("div",{className:"glass-absolute glass--bottom-8 glass--left-1-2 glass-transform glass--translate-x-1-2 glass-text-xs glass-text-pink-300 glass-whitespace-nowrap",children:["Tunneling: ",(n.probability*100).toFixed(1),"%"]})]},`${n.from}-${n.to}-${n.startTime}`)})})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[a.jsx("div",{className:"glass-flex glass-items-center glass-space-x-4",children:a.jsx("button",{onClick:()=>ee(new Set),className:`
                  px-3 py-1 rounded text-sm font-medium transition-colors duration-[${f.DURATION.fast}ms]
                  ${G({opacity:.7}).background}
                  border border-white/20 text-white/70 hover:text-white
                `,children:"Reset Measurements"})}),a.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-6 glass-text-sm glass-text-primary-glass-opacity-60",children:[a.jsxs("div",{children:["Time: ",h.toFixed(1)]}),a.jsxs("div",{children:["Active: ",y.length]}),a.jsxs("div",{children:["Measured: ",O.size]})]})]}),a.jsxs("div",{className:`
            p-4 rounded-lg border border-white/10 space-y-3
            ${G({opacity:.7}).background}
          `,children:[a.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-90",children:"Quantum Statistics"}),a.jsxs("div",{className:"glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm",children:[a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Avg Tunneling:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[(se*100).toFixed(1),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Wave Coherence:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[(Math.cos(h*.5)*50+50).toFixed(0),"%"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Energy Spread:"}),a.jsxs("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:[s.length>0?(Math.max(...s.map(n=>n.energy))-Math.min(...s.map(n=>n.energy))).toFixed(1):"0"," ","eV"]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60",children:"Barrier Count:"}),a.jsx("div",{className:"glass-text-primary-glass-opacity-90 glass-font-medium",children:m.length})]})]}),y.length>0&&a.jsxs("div",{className:"glass-space-y-1",children:[a.jsx("span",{className:"glass-text-primary-glass-opacity-60 glass-text-sm",children:"Active Tunneling:"}),a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-1",children:y.slice(-3).map((n,e)=>a.jsxs("div",{className:"glass-px-2 glass-py-1 glass-text-xs glass-surface-pink/20 glass-text-pink-300 glass-radius glass-border glass-border-pink-400/20",children:[n.from," → ",n.to," (",(n.probability*100).toFixed(0),"%)"]},e))})]})]})]})})});I.displayName="GlassQuantumTunnel";try{I.displayName="GlassQuantumTunnel",I.__docgenInfo={description:"",displayName:"GlassQuantumTunnel",props:{quantumStates:{defaultValue:{value:"[]"},description:"",name:"quantumStates",required:!1,type:{name:"QuantumState[] | undefined"}},barriers:{defaultValue:{value:"[]"},description:"",name:"barriers",required:!1,type:{name:"TunnelBarrier[] | undefined"}},showWaveFunction:{defaultValue:{value:"true"},description:"",name:"showWaveFunction",required:!1,type:{name:"boolean | undefined"}},showTunnelingProbability:{defaultValue:{value:"true"},description:"",name:"showTunnelingProbability",required:!1,type:{name:"boolean | undefined"}},showEnergyLevels:{defaultValue:{value:"true"},description:"",name:"showEnergyLevels",required:!1,type:{name:"boolean | undefined"}},showBarriers:{defaultValue:{value:"true"},description:"",name:"showBarriers",required:!1,type:{name:"boolean | undefined"}},animateTransitions:{defaultValue:{value:"true"},description:"",name:"animateTransitions",required:!1,type:{name:"boolean | undefined"}},tunnelingSpeed:{defaultValue:{value:"1"},description:"",name:"tunnelingSpeed",required:!1,type:{name:"number | undefined"}},waveAmplitude:{defaultValue:{value:"20"},description:"",name:"waveAmplitude",required:!1,type:{name:"number | undefined"}},coherenceDecay:{defaultValue:{value:"0.02"},description:"",name:"coherenceDecay",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},onStateTransition:{defaultValue:null,description:"",name:"onStateTransition",required:!1,type:{name:"((fromId: string, toId: string) => void) | undefined"}},onTunnelingEvent:{defaultValue:null,description:"",name:"onTunnelingEvent",required:!1,type:{name:"((probability: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const l=[{id:"state1",label:"Ground State",icon:"⚪",position:{x:100,y:150,z:0},waveFunction:.8,energy:1,barrierHeight:3,tunnelingProbability:.3,isActive:!0,connections:["state2","state3"]},{id:"state2",label:"Excited State",icon:"🔴",position:{x:300,y:100,z:0},waveFunction:.6,energy:2.5,barrierHeight:3,tunnelingProbability:.7,isActive:!0,connections:["state1","state4"]},{id:"state3",label:"Metastable",icon:"🟡",position:{x:200,y:200,z:0},waveFunction:-.4,energy:1.8,barrierHeight:4,tunnelingProbability:.5,isActive:!0,connections:["state1","state4"]},{id:"state4",label:"High Energy",icon:"🔵",position:{x:500,y:120,z:0},waveFunction:.9,energy:4,barrierHeight:2,tunnelingProbability:.9,isActive:!0,connections:["state2","state3"]}],c=[{id:"barrier1",height:3,width:30,position:{x:200,y:0},transparency:.6,quantumCoherence:.8},{id:"barrier2",height:4,width:40,position:{x:400,y:0},transparency:.7,quantumCoherence:.6}],pe=l.map(s=>({...s,energy:s.energy+2,tunnelingProbability:Math.min(.95,s.tunnelingProbability+.3)})),ye=l.map(s=>({...s,energy:Math.max(.5,s.energy-1),tunnelingProbability:Math.max(.1,s.tunnelingProbability-.4)})),be=[...l,{id:"state5",label:"Virtual State",icon:"👻",position:{x:150,y:250,z:0},waveFunction:.3,energy:.8,barrierHeight:5,tunnelingProbability:.2,isActive:!0,connections:["state1","state3"]},{id:"state6",label:"Resonance",icon:"⭐",position:{x:350,y:180,z:0},waveFunction:-.7,energy:3.2,barrierHeight:1.5,tunnelingProbability:.8,isActive:!0,connections:["state2","state4","state5"]}],ke={title:"Effects + Advanced/Glass Quantum Tunnel",component:I,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{tunnelingSpeed:{control:{type:"range",min:.1,max:3,step:.1}},waveAmplitude:{control:{type:"range",min:5,max:50,step:5}},coherenceDecay:{control:{type:"range",min:0,max:.1,step:.005}}}},v={args:{quantumStates:l,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,animateTransitions:!0,realTimeMode:!0}},T={args:{quantumStates:l,barriers:c,realTimeMode:!0,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,animateTransitions:!0,tunnelingSpeed:1.5}},S={args:{quantumStates:pe,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},P={args:{quantumStates:ye,barriers:c,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},M={args:{quantumStates:l,barriers:[],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!1,realTimeMode:!0}},F={args:{quantumStates:l,barriers:c,showWaveFunction:!0,showTunnelingProbability:!1,showEnergyLevels:!1,showBarriers:!1,realTimeMode:!0}},k={args:{quantumStates:l,barriers:c,showWaveFunction:!1,showTunnelingProbability:!1,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!1}},j={args:{quantumStates:l,barriers:c,showWaveFunction:!1,showTunnelingProbability:!1,showEnergyLevels:!1,showBarriers:!1,animateTransitions:!1,realTimeMode:!1}},E={args:{quantumStates:be,barriers:[...c,{id:"barrier3",height:2.5,width:25,position:{x:250,y:0},transparency:.5,quantumCoherence:.9}],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0,realTimeMode:!0}},N={args:{quantumStates:l,barriers:c,tunnelingSpeed:3,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},B={args:{quantumStates:l,barriers:c,tunnelingSpeed:.3,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},W={args:{quantumStates:l,barriers:c,waveAmplitude:40,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},L={args:{quantumStates:l,barriers:c,waveAmplitude:10,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},q={args:{quantumStates:l,barriers:c,coherenceDecay:.08,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},A={args:{quantumStates:l,barriers:c,coherenceDecay:.01,showWaveFunction:!0,showTunnelingProbability:!0,realTimeMode:!0}},Q={args:{quantumStates:l,barriers:c.map(s=>({...s,width:s.width*2,height:s.height*1.5})),showWaveFunction:!0,showTunnelingProbability:!0,showBarriers:!0,realTimeMode:!0}},D={args:{quantumStates:l,barriers:c.map(s=>({...s,width:Math.max(5,s.width*.3),height:s.height*.7})),showWaveFunction:!0,showTunnelingProbability:!0,showBarriers:!0,realTimeMode:!0}},C={args:{quantumStates:[l[0]],barriers:[],showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,realTimeMode:!1}},V={args:{quantumStates:l,barriers:c,realTimeMode:!1,animateTransitions:!1,showWaveFunction:!0,showTunnelingProbability:!0,showEnergyLevels:!0,showBarriers:!0}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: highEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...S.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: lowEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true
  }
}`,...P.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: false,
    realTimeMode: true
  }
}`,...M.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: false,
    showEnergyLevels: false,
    showBarriers: false,
    realTimeMode: true
  }
}`,...F.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: false,
    showTunnelingProbability: false,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: false
  }
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 0.3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 40,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...W.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 10,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...L.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.08,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...q.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.01,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true
  }
}`,...A.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    quantumStates: [mockQuantumStates[0]],
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    realTimeMode: false
  }
}`,...C.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};const je=["Default","RealTimeMode","HighEnergyStates","LowEnergyStates","NoBarriers","WaveFunctionOnly","EnergyLevelsOnly","MinimalVisualization","ComplexSystem","FastTunneling","SlowTunneling","HighAmplitude","LowAmplitude","FastCoherenceDecay","SlowCoherenceDecay","ThickBarriers","ThinBarriers","SingleState","StaticMode"];export{E as ComplexSystem,v as Default,k as EnergyLevelsOnly,q as FastCoherenceDecay,N as FastTunneling,W as HighAmplitude,S as HighEnergyStates,L as LowAmplitude,P as LowEnergyStates,j as MinimalVisualization,M as NoBarriers,T as RealTimeMode,C as SingleState,A as SlowCoherenceDecay,B as SlowTunneling,V as StaticMode,Q as ThickBarriers,D as ThinBarriers,F as WaveFunctionOnly,je as __namedExportsOrder,ke as default};
