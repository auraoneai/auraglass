import{r as m,b as Ne,j as s,c as a,e as Qe,m as y}from"./iframe-CdDNbo2v.js";import{u as Pe}from"./a11y-B__vCKol.js";import{u as je}from"./useMotionPreference-DU21n6zE.js";import{c as v}from"./createGlassStyle-BfWnO-qv.js";import{O as Me}from"./OptimizedGlassCore-B1nsxF3j.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CLkD7xxk.js";const d={superposition:"#4F46E5",entangled:"#EC4899"},Fe={sine:(r,c)=>Math.sin(r*c),cosine:(r,c)=>Math.cos(r*c),complex:(r,c)=>Math.sin(r*c)*Math.cos(r*c/2),damped:(r,c)=>Math.sin(r*c)*Math.exp(-r*.1)},q=m.forwardRef(({menuStates:r=[],isObserved:c=!1,measurementType:Z="collapse",coherenceDecay:G=.02,entanglementStrength:ee=.5,visualizeWaveFunction:V=!0,showProbabilities:se=!0,showQuantumNoise:ae=!0,maxSuperpositions:te=8,onStateCollapse:ne,onMeasurement:re,onEntanglement:oe,className:ie="",...le},ue)=>{const g=Ne(),[i,b]=m.useState(r),[We,R]=m.useState(null),[l,U]=m.useState(null),[p,ce]=m.useState(0),[me,de]=m.useState([]);Pe("glass-superposition-menu");const{shouldAnimate:pe}=je(),Y=e=>pe?e:{duration:0};m.useEffect(()=>{const e=setInterval(()=>{ce(t=>t+.1)},16);return()=>clearInterval(e)},[]),m.useEffect(()=>{if(c||l)return;const e=setInterval(()=>{b(t=>t.map(n=>({...n,coherence:Math.max(0,n.coherence-G),probability:n.coherence>.1?n.probability+(Math.random()-.5)*.02:n.probability*.98})).map(n=>({...n,probability:Math.max(.01,Math.min(1,n.probability))})))},100);return()=>clearInterval(e)},[c,l,G]),m.useEffect(()=>{const e=i.reduce((t,n)=>t+n.probability,0);e>0&&b(t=>t.map(n=>({...n,probability:n.probability/e})))},[i.length]);const B=e=>{R(Date.now());let t;if(e)t=i.find(n=>n.id===e);else{const n=Math.random();let u=0;t=i.find(h=>(u+=h.probability*h.probability,n<=u))||i[0]}Z==="collapse"&&(U(t.id),b([{...t,probability:1,coherence:0}])),de(n=>[...n,{type:"measurement",stateId:t.id,timestamp:Date.now(),probability:t.probability}]),ne?.(t.id),re?.(i)},ge=e=>{b(t=>t.map(n=>e.includes(n.id)?{...n,entangled:e.filter(u=>u!==n.id),coherence:Math.min(1,n.coherence+.2)}:n)),oe?.(e)},he=e=>l?e.id===l?1:.1:.3+e.probability*.7,J=e=>l&&e.id!==l?.5:.8+e.probability*.4,_=e=>p*(1+e.energy*.5)+e.probability*Math.PI,be=({state:e,index:t})=>{const n=m.useMemo(()=>{const h=e.probability*20,O=.5+e.energy*.3,L=_(e);return Array.from({length:50},(K,X)=>{const xe=X/50*4*Math.PI,we=h*Fe.complex(xe+L,O);return{x:X/50*200,y:we+25}})},[e,p]);return s.jsxs("svg",{className:a("glass-absolute glass-inset-0 glass-pointer-events-none"),width:"200",height:"50",style:{zIndex:-1},children:[s.jsx("path",{d:`M ${n.map(u=>`${u.x} ${u.y}`).join(" L ")}`,stroke:e.entangled?.length?d.entangled:d.superposition,strokeWidth:"2",fill:"none",opacity:e.coherence*.6,strokeDasharray:e.coherence<.5?"5,5":"none"}),s.jsx("path",{d:`M ${n.map(u=>`${u.x} ${25+Math.abs(u.y-25)*.3}`).join(" L ")}`,fill:e.entangled?.length?d.entangled:d.superposition,opacity:e.probability*.2})]})},ye=Array.from({length:20},(e,t)=>({left:t*13%100,top:t*29%100,delay:t*37%3})),ve=()=>s.jsx("div",{className:a("glass-absolute glass-inset-0 glass-pointer-events-none"),children:ye.map((e,t)=>s.jsx(y.div,{className:a("glass-absolute glass-w-1 glass-h-1 glass-surface-muted glass-radius-full"),style:{left:`${e.left}%`,top:`${e.top}%`},animate:g?{}:{opacity:[.1,.5,.1],scale:[.5,1,.5]},transition:g?{duration:0}:{duration:3,repeat:1/0,delay:e.delay}},t))}),Se=()=>s.jsx("svg",{className:a("glass-absolute glass-inset-0 glass-pointer-events-none"),"data-glass-overlay":"true",style:{zIndex:10},children:i.map(e=>e.entangled?.map(t=>{const n=i.find(K=>K.id===t);if(!n)return null;const u=i.indexOf(e),h=i.indexOf(n),O=u*80+40,L=h*80+40;return s.jsx(y.line,{x1:"50",y1:O,x2:"150",y2:L,stroke:d.entangled,strokeWidth:"2",opacity:ee,strokeDasharray:"10,5",animate:g?{}:{strokeDashoffset:[0,15]},transition:g?{duration:0}:{duration:1,repeat:1/0,ease:"linear"}},`${e.id}-${t}`)})).filter(Boolean)}),fe=({state:e,index:t})=>s.jsx(y.div,{className:a("glass-relative"),initial:{opacity:0,scale:.5},animate:g?{}:{opacity:he(e),scale:J(e),y:c?0:Math.sin(_(e))*5,rotateY:V?Math.sin(_(e))*10:0},transition:Y({duration:.3,type:l?"spring":"tween"}),whileHover:{scale:J(e)*1.05,rotateY:0},onClick:()=>B(e.id),children:s.jsxs("div",{className:a("glass-relative glass-p-4 glass-radius-lg glass-cursor-pointer glass-border-2 glass-transition-all glass-duration-300",v({variant:"default",opacity:e.coherence}),l===e.id?"glass-border-success glass-surface-success":e.entangled?.length?"glass-border-accent glass-surface-accent":"glass-border-primary glass-surface-primary"),style:{boxShadow:`0 0 ${e.probability*20}px ${e.entangled?.length?d.entangled:d.superposition}40`},children:[V&&!l&&s.jsx(be,{state:e,index:t}),s.jsxs("div",{className:a("glass-relative glass-z-10"),children:[s.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-3"),children:[e.icon&&s.jsx("span",{className:a("glass-text-2xl"),children:e.icon}),s.jsxs("div",{className:a("glass-flex-1"),children:[s.jsx("h3",{className:a("glass-text-primary glass-font-medium"),children:e.label}),se&&s.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-2 glass-text-sm glass-text-secondary"),children:[s.jsxs("span",{children:["P: ",(e.probability*100).toFixed(1),"%"]}),s.jsx("span",{children:"•"}),s.jsxs("span",{children:["C: ",(e.coherence*100).toFixed(0),"%"]}),e.entangled?.length&&s.jsxs(s.Fragment,{children:[s.jsx("span",{children:"•"}),s.jsxs("span",{className:a("glass-text-accent"),children:["⚛ ",e.entangled.length]})]})]})]})]}),s.jsxs("div",{className:a("glass-mt-2 glass-flex glass-space-x-2"),children:[s.jsx("div",{className:a("glass-h-1 glass-surface-primary glass-radius-full"),style:{width:`${e.probability*100}%`}}),s.jsx("div",{className:a("glass-h-1 glass-surface-info glass-radius-full glass-opacity-60"),style:{width:`${e.coherence*100}%`}})]})]}),!l&&s.jsx(y.div,{className:a("glass-absolute glass-inset-0 glass-radius-lg glass-pointer-events-none"),animate:{background:[`radial-gradient(circle at ${50+Math.sin(p)*20}% ${50+Math.cos(p*.7)*20}%, 
                   ${d.superposition}20 0%, transparent 50%)`,`radial-gradient(circle at ${50+Math.sin(p+Math.PI)*20}% ${50+Math.cos(p*.7+Math.PI)*20}%, 
                   ${d.superposition}20 0%, transparent 50%)`]},transition:g?{duration:0}:{duration:3,repeat:1/0,ease:"linear"}})]})}),A=l?i.filter(e=>e.id===l):i.slice(0,te);return s.jsxs(Me,{"data-glass-component":!0,ref:ue,variant:"frosted",className:a("glass-relative glass-p-6 glass-space-y-4 glass-text-white",ie),style:{color:"rgba(255, 255, 255, 0.95)",backgroundColor:"var(--glass-primary-level3-surface)"},role:"region","aria-label":"Quantum superposition menu",...le,children:[ae&&s.jsx(ve,{}),V&&s.jsx(Se,{}),s.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between"),children:[s.jsxs("div",{children:[s.jsx("h2",{className:a("glass-text-xl glass-font-semibold glass-text-primary"),children:"Quantum Menu"}),s.jsx("p",{className:a("glass-text-sm glass-text-secondary"),children:l?"State Collapsed":`${A.length} superposition${A.length!==1?"s":""}`})]}),s.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-4"),children:[!l&&s.jsxs(s.Fragment,{children:[s.jsx("button",{onClick:()=>B(),className:a("glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",v({variant:"default"}),"glass-text-primary hover:glass-text-white glass-border glass-border-primary hover:glass-border-white"),style:{color:"rgba(255, 255, 255, 0.95)",backgroundColor:"var(--glass-primary-level3-surface)",borderColor:"rgba(255, 255, 255, 0.28)"},children:"🔬 Measure"}),s.jsx("button",{onClick:()=>{const e=i.sort(()=>Math.random()-.5).slice(0,2).map(t=>t.id);ge(e)},className:a("glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",v({variant:"default"}),"glass-text-accent hover:glass-text-accent-light glass-border glass-border-accent hover:glass-border-accent-light"),style:{color:"rgba(255, 255, 255, 0.95)",backgroundColor:"var(--glass-primary-level3-surface)",borderColor:"rgba(236, 72, 153, 0.42)"},children:"⚛ Entangle"})]}),s.jsxs("div",{className:a("glass-text-sm glass-text-muted"),children:["t: ",p.toFixed(1)]})]})]}),s.jsx("div",{className:a("glass-space-y-3"),children:s.jsx(Qe,{children:A.map((e,t)=>s.jsx(fe,{state:e,index:t},e.id))})}),s.jsx("div",{className:a("glass-p-4 glass-radius-lg glass-border glass-border-subtle",v({variant:"default"})),children:s.jsxs("div",{className:a("glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm"),children:[s.jsxs("div",{children:[s.jsx("span",{className:a("glass-text-secondary"),children:"Total Coherence:"}),s.jsxs("span",{className:a("glass-ml-2 glass-text-primary"),children:[(i.reduce((e,t)=>e+t.coherence,0)/i.length*100).toFixed(1),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:a("glass-text-secondary"),children:"Entangled Pairs:"}),s.jsx("span",{className:a("glass-ml-2 glass-text-primary"),children:i.filter(e=>e.entangled?.length).length/2})]}),s.jsxs("div",{children:[s.jsx("span",{className:a("glass-text-secondary"),children:"Measurements:"}),s.jsx("span",{className:a("glass-ml-2 glass-text-primary"),children:me.filter(e=>e.type==="measurement").length})]}),s.jsxs("div",{children:[s.jsx("span",{className:a("glass-text-secondary"),children:"State:"}),s.jsx("span",{className:a("glass-ml-2 glass-text-primary"),children:l?"Collapsed":"Superposition"})]})]})}),l&&s.jsx(y.button,{onClick:()=>{U(null),b(r),R(null)},className:a("glass-w-full glass-p-3 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",v({variant:"default"}),"glass-text-info hover:glass-text-info-light glass-border glass-border-info hover:glass-border-info-light"),style:{color:"rgba(255, 255, 255, 0.95)",backgroundColor:"var(--glass-primary-level3-surface)",borderColor:"rgba(59, 130, 246, 0.42)"},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:Y({delay:.5}),children:"🔄 Reset Quantum State"})]})});q.displayName="GlassSuperpositionalMenu";try{q.displayName="GlassSuperpositionalMenu",q.__docgenInfo={description:"",displayName:"GlassSuperpositionalMenu",props:{menuStates:{defaultValue:{value:"[]"},description:"",name:"menuStates",required:!1,type:{name:"QuantumMenuState[] | undefined"}},isObserved:{defaultValue:{value:"false"},description:"",name:"isObserved",required:!1,type:{name:"boolean | undefined"}},measurementType:{defaultValue:{value:"collapse"},description:"",name:"measurementType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"collapse"'},{value:'"decoherence"'},{value:'"interference"'}]}},coherenceDecay:{defaultValue:{value:"0.02"},description:"",name:"coherenceDecay",required:!1,type:{name:"number | undefined"}},entanglementStrength:{defaultValue:{value:"0.5"},description:"",name:"entanglementStrength",required:!1,type:{name:"number | undefined"}},visualizeWaveFunction:{defaultValue:{value:"true"},description:"",name:"visualizeWaveFunction",required:!1,type:{name:"boolean | undefined"}},showProbabilities:{defaultValue:{value:"true"},description:"",name:"showProbabilities",required:!1,type:{name:"boolean | undefined"}},showQuantumNoise:{defaultValue:{value:"true"},description:"",name:"showQuantumNoise",required:!1,type:{name:"boolean | undefined"}},maxSuperpositions:{defaultValue:{value:"8"},description:"",name:"maxSuperpositions",required:!1,type:{name:"number | undefined"}},onStateCollapse:{defaultValue:null,description:"",name:"onStateCollapse",required:!1,type:{name:"((stateId: string) => void) | undefined"}},onMeasurement:{defaultValue:null,description:"",name:"onMeasurement",required:!1,type:{name:"((states: QuantumMenuState[]) => void) | undefined"}},onEntanglement:{defaultValue:null,description:"",name:"onEntanglement",required:!1,type:{name:"((stateIds: string[]) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"state1",label:"Navigation Menu",icon:"🧭",probability:.3,energy:.8,coherence:.9,subStates:[{id:"nav1",label:"Home",probability:.4,energy:.2,coherence:.8},{id:"nav2",label:"About",probability:.3,energy:.3,coherence:.7},{id:"nav3",label:"Contact",probability:.3,energy:.4,coherence:.6}]},{id:"state2",label:"Settings Panel",icon:"⚙️",probability:.25,energy:.6,coherence:.85},{id:"state3",label:"User Profile",icon:"👤",probability:.2,energy:.4,coherence:.8},{id:"state4",label:"Search Interface",icon:"🔍",probability:.15,energy:.7,coherence:.75},{id:"state5",label:"Notifications",icon:"🔔",probability:.1,energy:.9,coherence:.7}],H=[{id:"particle1",label:"Spin Up",icon:"⬆️",probability:.5,energy:.5,coherence:.9,entangled:["particle2"]},{id:"particle2",label:"Spin Down",icon:"⬇️",probability:.5,energy:.5,coherence:.9,entangled:["particle1"]},{id:"photon1",label:"Polarization A",icon:"💫",probability:.4,energy:.8,coherence:.85,entangled:["photon2"]},{id:"photon2",label:"Polarization B",icon:"⭐",probability:.6,energy:.8,coherence:.85,entangled:["photon1"]}],ze=[{id:"complex1",label:"Main Dashboard",icon:"📊",probability:.4,energy:.6,coherence:.9,subStates:[{id:"dash1",label:"Analytics",probability:.5,energy:.4,coherence:.8},{id:"dash2",label:"Reports",probability:.3,energy:.5,coherence:.7},{id:"dash3",label:"Metrics",probability:.2,energy:.6,coherence:.6}]},{id:"complex2",label:"File Manager",icon:"📁",probability:.3,energy:.4,coherence:.8,entangled:["complex3"]},{id:"complex3",label:"Data Processor",icon:"⚡",probability:.2,energy:.8,coherence:.75,entangled:["complex2"]},{id:"complex4",label:"AI Assistant",icon:"🤖",probability:.1,energy:.9,coherence:.6}],qe={title:"Effects + Advanced/Glass Superpositional Menu",component:q,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{measurementType:{control:{type:"select"},options:["collapse","decoherence","interference"]},coherenceDecay:{control:{type:"range",min:0,max:.1,step:.005}},entanglementStrength:{control:{type:"range",min:0,max:1,step:.1}},maxSuperpositions:{control:{type:"range",min:2,max:10,step:1}}}},S={args:{menuStates:o,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},f={args:{menuStates:o,isObserved:!0,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!1}},x={args:{menuStates:H,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0,entanglementStrength:.8}},w={args:{menuStates:o,coherenceDecay:.05,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},N={args:{menuStates:o,coherenceDecay:.01,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},Q={args:{menuStates:o,measurementType:"collapse",visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},P={args:{menuStates:o,measurementType:"decoherence",coherenceDecay:.03,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},j={args:{menuStates:o,measurementType:"interference",visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},M={args:{menuStates:o,visualizeWaveFunction:!1,showProbabilities:!1,showQuantumNoise:!1}},F={args:{menuStates:ze,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0,entanglementStrength:.6}},z={args:{menuStates:o,maxSuperpositions:3,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},W={args:{menuStates:o.map(r=>({...r,coherence:.95})),coherenceDecay:.01,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},k={args:{menuStates:o.map(r=>({...r,coherence:.3})),coherenceDecay:.04,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},C={args:{menuStates:o.map(r=>({...r,probability:.2})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},D={args:{menuStates:[{...o[0],probability:.7},{...o[1],probability:.2},{...o[2],probability:.08},{...o[3],probability:.02}],visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},E={args:{menuStates:o.map(r=>({...r,energy:.9})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},I={args:{menuStates:o.map(r=>({...r,energy:.1})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},$={args:{menuStates:H,entanglementStrength:1,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},T={args:{menuStates:H,entanglementStrength:.2,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    isObserved: true,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: false
  }
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
    entanglementStrength: 0.8
  }
}`,...x.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    coherenceDecay: 0.05,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...w.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    coherenceDecay: 0.01,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...N.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'collapse',
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...Q.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'decoherence',
    coherenceDecay: 0.03,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...P.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'interference',
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...j.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    visualizeWaveFunction: false,
    showProbabilities: false,
    showQuantumNoise: false
  }
}`,...M.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: complexStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
    entanglementStrength: 0.6
  }
}`,...F.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    maxSuperpositions: 3,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...z.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      coherence: 0.95
    })),
    coherenceDecay: 0.01,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...W.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      coherence: 0.3
    })),
    coherenceDecay: 0.04,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...k.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      probability: 0.2
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...C.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: [{
      ...mockQuantumStates[0],
      probability: 0.7
    }, {
      ...mockQuantumStates[1],
      probability: 0.2
    }, {
      ...mockQuantumStates[2],
      probability: 0.08
    }, {
      ...mockQuantumStates[3],
      probability: 0.02
    }],
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.9
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.1
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...I.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    entanglementStrength: 1.0,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...$.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    entanglementStrength: 0.2,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...T.parameters?.docs?.source}}};const Ve=["Default","ObservedState","EntangledSystem","FastDecoherence","SlowDecoherence","CollapseMode","DecoherenceMode","InterferenceMode","MinimalVisualization","ComplexSystem","LimitedSuperpositions","HighCoherence","LowCoherence","UniformProbabilities","SkewedProbabilities","HighEnergyStates","LowEnergyStates","StrongEntanglement","WeakEntanglement"];export{Q as CollapseMode,F as ComplexSystem,P as DecoherenceMode,S as Default,x as EntangledSystem,w as FastDecoherence,W as HighCoherence,E as HighEnergyStates,j as InterferenceMode,z as LimitedSuperpositions,k as LowCoherence,I as LowEnergyStates,M as MinimalVisualization,f as ObservedState,D as SkewedProbabilities,N as SlowDecoherence,$ as StrongEntanglement,C as UniformProbabilities,T as WeakEntanglement,Ve as __namedExportsOrder,qe as default};
