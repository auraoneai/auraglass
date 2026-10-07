import{r as m,a as Ne,j as s,c as t,d as Qe,m as b}from"./iframe-Cqi-9gHA.js";import{u as Pe}from"./a11y-DBBBNlGj.js";import{u as je}from"./useMotionPreference-fk1VFuMQ.js";import{O as Me}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";const y={superposition:"rgba(51, 65, 85, 0.72)",entangled:"rgba(100, 116, 139, 0.72)"},v={background:"linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",backgroundColor:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.18)",color:"var(--glass-theme-text, var(--glass-text-primary))",backdropFilter:"blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",WebkitBackdropFilter:"blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",boxShadow:"0 12px 30px rgba(15, 23, 42, 0.1)"},Fe={sine:(r,c)=>Math.sin(r*c),cosine:(r,c)=>Math.cos(r*c),complex:(r,c)=>Math.sin(r*c)*Math.cos(r*c/2),damped:(r,c)=>Math.sin(r*c)*Math.exp(-r*.1)},q=m.forwardRef(({menuStates:r=[],isObserved:c=!1,measurementType:Z="collapse",coherenceDecay:L=.02,entanglementStrength:ee=.5,visualizeWaveFunction:G=!0,showProbabilities:se=!0,showQuantumNoise:ae=!0,maxSuperpositions:te=8,onStateCollapse:ne,onMeasurement:re,onEntanglement:ie,className:oe="",...le},ue)=>{const p=Ne(),[o,h]=m.useState(r),[We,R]=m.useState(null),[l,U]=m.useState(null),[d,ce]=m.useState(0),[me,de]=m.useState([]),V=Pe("glass-superposition-menu"),{shouldAnimate:pe}=je(),B=e=>pe?e:{duration:0};m.useEffect(()=>{const e=setInterval(()=>{ce(a=>a+.1)},16);return()=>clearInterval(e)},[]),m.useEffect(()=>{if(c||l)return;const e=setInterval(()=>{h(a=>a.map(n=>({...n,coherence:Math.max(0,n.coherence-L),probability:n.coherence>.1?n.probability+(Math.random()-.5)*.02:n.probability*.98})).map(n=>({...n,probability:Math.max(.01,Math.min(1,n.probability))})))},100);return()=>clearInterval(e)},[c,l,L]),m.useEffect(()=>{const e=o.reduce((a,n)=>a+n.probability,0);e>0&&h(a=>a.map(n=>({...n,probability:n.probability/e})))},[o.length]);const Y=e=>{R(Date.now());let a;if(e)a=o.find(n=>n.id===e);else{const n=Math.random();let u=0;a=o.find(g=>(u+=g.probability*g.probability,n<=u))||o[0]}Z==="collapse"&&(U(a.id),h([{...a,probability:1,coherence:0}])),de(n=>[...n,{type:"measurement",stateId:a.id,timestamp:Date.now(),probability:a.probability}]),ne?.(a.id),re?.(o)},ge=e=>{h(a=>a.map(n=>e.includes(n.id)?{...n,entangled:e.filter(u=>u!==n.id),coherence:Math.min(1,n.coherence+.2)}:n)),ie?.(e)},he=e=>l?e.id===l?1:.1:1,J=e=>d*(1+e.energy*.5)+e.probability*Math.PI,be=({state:e,index:a})=>{const n=m.useMemo(()=>{const g=e.probability*20,_=.5+e.energy*.3,O=J(e);return Array.from({length:50},(K,X)=>{const fe=X/50*4*Math.PI,we=g*Fe.complex(fe+O,_);return{x:X/50*200,y:we+25}})},[e,d]);return s.jsxs("svg",{className:"glass-w-full glass-h-full glass-pointer-events-none",viewBox:"0 0 200 50",preserveAspectRatio:"none","aria-hidden":"true",children:[s.jsx("path",{d:`M ${n.map(u=>`${u.x} ${u.y}`).join(" L ")}`,stroke:e.entangled?.length?y.entangled:y.superposition,strokeWidth:"2",fill:"none",opacity:e.coherence*.6,strokeDasharray:e.coherence<.5?"5,5":"none"}),s.jsx("path",{d:`M ${n.map(u=>`${u.x} ${25+Math.abs(u.y-25)*.3}`).join(" L ")}`,fill:e.entangled?.length?y.entangled:y.superposition,opacity:e.probability*.2})]})},ye=Array.from({length:20},(e,a)=>({left:a*13%100,top:a*29%100,delay:a*37%3})),ve=()=>s.jsx("div",{className:t("glass-absolute glass-inset-0 glass-pointer-events-none"),children:ye.map((e,a)=>s.jsx(b.div,{className:t("glass-absolute glass-w-1 glass-h-1 glass-surface-muted glass-radius-full"),style:{left:`${e.left}%`,top:`${e.top}%`},animate:p?{}:{opacity:[.1,.5,.1],scale:[.5,1,.5]},transition:p?{duration:0}:{duration:3,repeat:1/0,delay:e.delay}},a))}),xe=()=>s.jsx("svg",{className:t("glass-absolute glass-inset-0 glass-pointer-events-none"),"data-glass-overlay":"true",style:{zIndex:0,opacity:.18},children:o.map(e=>e.entangled?.map(a=>{const n=o.find(K=>K.id===a);if(!n)return null;const u=o.indexOf(e),g=o.indexOf(n),_=u*80+40,O=g*80+40;return s.jsx(b.line,{x1:"50",y1:_,x2:"150",y2:O,stroke:y.entangled,strokeWidth:"2",opacity:ee,strokeDasharray:"10,5",animate:p?{}:{strokeDashoffset:[0,15]},transition:p?{duration:0}:{duration:1,repeat:1/0,ease:"linear"}},`${e.id}-${a}`)})).filter(Boolean)}),Se=({state:e,index:a})=>s.jsx(b.div,{className:"glass-relative",initial:{opacity:1},animate:p?{}:{opacity:he(e),y:c?0:Math.sin(J(e))*1.5},transition:B({duration:.3,type:l?"spring":"tween"}),whileHover:{y:-1},onClick:()=>Y(e.id),children:s.jsxs("div",{className:t("glass-relative glass-p-4 glass-radius-lg glass-cursor-pointer glass-border-2 glass-transition-all glass-duration-300","glass-border-subtle glass-surface-subtle"),style:{...v,boxShadow:`0 10px ${18+e.probability*12}px rgba(15, 23, 42, ${.08+e.probability*.06})`},children:[s.jsxs("div",{className:t("glass-relative glass-z-10"),children:[s.jsxs("div",{className:t("glass-flex glass-items-center glass-space-x-3"),children:[e.icon&&s.jsx("span",{style:{fontSize:18,lineHeight:1},"aria-hidden":"true",children:e.icon}),s.jsxs("div",{className:t("glass-flex-1"),children:[s.jsx("h3",{className:t("glass-text-primary glass-font-medium"),children:e.label}),se&&s.jsxs("div",{className:t("glass-flex glass-items-center glass-flex-wrap glass-gap-2 glass-text-sm glass-text-secondary"),children:[s.jsxs("span",{children:["P: ",(e.probability*100).toFixed(1),"%"]}),s.jsx("span",{children:"•"}),s.jsxs("span",{children:["C: ",(e.coherence*100).toFixed(0),"%"]}),e.entangled?.length&&s.jsxs(s.Fragment,{children:[s.jsx("span",{children:"•"}),s.jsxs("span",{className:t("glass-text-accent"),children:["⚛ ",e.entangled.length]})]})]})]})]}),s.jsxs("div",{className:t("glass-mt-2 glass-flex glass-space-x-2"),children:[s.jsx("div",{className:t("glass-h-1 glass-surface-primary glass-radius-full"),style:{width:`${e.probability*100}%`}}),s.jsx("div",{className:t("glass-h-1 glass-surface-info glass-radius-full glass-opacity-60"),style:{width:`${e.coherence*100}%`}})]}),G&&!l&&s.jsx("div",{className:"glass-mt-3 glass-w-full glass-overflow-hidden glass-radius",style:{height:34,background:"rgba(226, 232, 240, 0.42)"},children:s.jsx(be,{state:e,index:a})})]}),!l&&s.jsx(b.div,{className:t("glass-absolute glass-inset-0 glass-radius-lg glass-pointer-events-none"),animate:{background:[`radial-gradient(circle at ${50+Math.sin(d)*20}% ${50+Math.cos(d*.7)*20}%, rgba(100, 116, 139, 0.10) 0%, transparent 50%)`,`radial-gradient(circle at ${50+Math.sin(d+Math.PI)*20}% ${50+Math.cos(d*.7+Math.PI)*20}%, rgba(100, 116, 139, 0.10) 0%, transparent 50%)`]},transition:p?{duration:0}:{duration:3,repeat:1/0,ease:"linear"}})]})}),A=l?o.filter(e=>e.id===l):o.slice(0,te);return s.jsxs(Me,{"data-glass-component":!0,ref:ue,variant:"frosted",className:t("glass-relative glass-p-6 glass-space-y-4 glass-text-primary",oe),style:{color:"var(--glass-theme-text, var(--glass-text-primary))",backgroundColor:"rgba(255, 255, 255, 0.3)"},role:"region","aria-label":"Quantum superposition menu",...le,children:[ae&&s.jsx(ve,{}),G&&o.some(e=>e.entangled?.length)&&s.jsx(xe,{}),s.jsxs("div",{className:t("glass-flex glass-items-start glass-justify-between glass-flex-wrap glass-gap-4"),children:[s.jsxs("div",{children:[s.jsx("h2",{className:t("glass-text-xl glass-font-semibold glass-text-primary"),children:"Quantum Menu"}),s.jsx("p",{className:t("glass-text-sm glass-text-secondary"),children:l?"State Collapsed":`${A.length} superposition${A.length!==1?"s":""}`})]}),s.jsxs("div",{className:t("glass-flex glass-items-center glass-flex-wrap glass-gap-3"),children:[!l&&s.jsxs(s.Fragment,{children:[s.jsx("button",{"aria-expanded":"true","aria-controls":`${V}-states`,onClick:()=>Y(),className:t("glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200","glass-text-primary hover:glass-text-white glass-border glass-border-primary hover:glass-border-white"),style:{...v},children:"🔬 Measure"}),s.jsx("button",{"aria-expanded":"true","aria-controls":`${V}-states`,onClick:()=>{const e=o.sort(()=>Math.random()-.5).slice(0,2).map(a=>a.id);ge(e)},className:t("glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200","glass-text-accent hover:glass-text-accent-light glass-border glass-border-accent hover:glass-border-accent-light"),style:{...v},children:"⚛ Entangle"})]}),s.jsxs("div",{className:t("glass-text-sm glass-text-secondary"),children:["t: ",d.toFixed(1)]})]})]}),s.jsx("div",{id:`${V}-states`,role:"menu","aria-label":"Available quantum states",className:t("glass-space-y-3"),children:s.jsx(Qe,{children:A.map((e,a)=>s.jsx(Se,{state:e,index:a},e.id))})}),s.jsx("div",{className:t("glass-p-4 glass-radius-lg glass-border glass-border-subtle"),style:v,children:s.jsxs("div",{className:t("glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm"),children:[s.jsxs("div",{children:[s.jsx("span",{className:t("glass-text-secondary"),children:"Total Coherence:"}),s.jsxs("span",{className:t("glass-ml-2 glass-text-primary"),children:[(o.reduce((e,a)=>e+a.coherence,0)/o.length*100).toFixed(1),"%"]})]}),s.jsxs("div",{children:[s.jsx("span",{className:t("glass-text-secondary"),children:"Entangled Pairs:"}),s.jsx("span",{className:t("glass-ml-2 glass-text-primary"),children:o.filter(e=>e.entangled?.length).length/2})]}),s.jsxs("div",{children:[s.jsx("span",{className:t("glass-text-secondary"),children:"Measurements:"}),s.jsx("span",{className:t("glass-ml-2 glass-text-primary"),children:me.filter(e=>e.type==="measurement").length})]}),s.jsxs("div",{children:[s.jsx("span",{className:t("glass-text-secondary"),children:"State:"}),s.jsx("span",{className:t("glass-ml-2 glass-text-primary"),children:l?"Collapsed":"Superposition"})]})]})}),l&&s.jsx(b.button,{onClick:()=>{U(null),h(r),R(null)},className:t("glass-w-full glass-p-3 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200","glass-text-info hover:glass-text-info-light glass-border glass-border-info hover:glass-border-info-light"),style:{...v},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:B({delay:.5}),children:"🔄 Reset Quantum State"})]})});q.displayName="GlassSuperpositionalMenu";try{q.displayName="GlassSuperpositionalMenu",q.__docgenInfo={description:"",displayName:"GlassSuperpositionalMenu",props:{menuStates:{defaultValue:{value:"[]"},description:"",name:"menuStates",required:!1,type:{name:"QuantumMenuState[] | undefined"}},isObserved:{defaultValue:{value:"false"},description:"",name:"isObserved",required:!1,type:{name:"boolean | undefined"}},measurementType:{defaultValue:{value:"collapse"},description:"",name:"measurementType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"collapse"'},{value:'"decoherence"'},{value:'"interference"'}]}},coherenceDecay:{defaultValue:{value:"0.02"},description:"",name:"coherenceDecay",required:!1,type:{name:"number | undefined"}},entanglementStrength:{defaultValue:{value:"0.5"},description:"",name:"entanglementStrength",required:!1,type:{name:"number | undefined"}},visualizeWaveFunction:{defaultValue:{value:"true"},description:"",name:"visualizeWaveFunction",required:!1,type:{name:"boolean | undefined"}},showProbabilities:{defaultValue:{value:"true"},description:"",name:"showProbabilities",required:!1,type:{name:"boolean | undefined"}},showQuantumNoise:{defaultValue:{value:"true"},description:"",name:"showQuantumNoise",required:!1,type:{name:"boolean | undefined"}},maxSuperpositions:{defaultValue:{value:"8"},description:"",name:"maxSuperpositions",required:!1,type:{name:"number | undefined"}},onStateCollapse:{defaultValue:null,description:"",name:"onStateCollapse",required:!1,type:{name:"((stateId: string) => void) | undefined"}},onMeasurement:{defaultValue:null,description:"",name:"onMeasurement",required:!1,type:{name:"((states: QuantumMenuState[]) => void) | undefined"}},onEntanglement:{defaultValue:null,description:"",name:"onEntanglement",required:!1,type:{name:"((stateIds: string[]) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const i=[{id:"state1",label:"Navigation Menu",icon:"🧭",probability:.3,energy:.8,coherence:.9,subStates:[{id:"nav1",label:"Home",probability:.4,energy:.2,coherence:.8},{id:"nav2",label:"About",probability:.3,energy:.3,coherence:.7},{id:"nav3",label:"Contact",probability:.3,energy:.4,coherence:.6}]},{id:"state2",label:"Settings Panel",icon:"⚙️",probability:.25,energy:.6,coherence:.85},{id:"state3",label:"User Profile",icon:"👤",probability:.2,energy:.4,coherence:.8},{id:"state4",label:"Search Interface",icon:"🔍",probability:.15,energy:.7,coherence:.75},{id:"state5",label:"Notifications",icon:"🔔",probability:.1,energy:.9,coherence:.7}],H=[{id:"particle1",label:"Spin Up",icon:"⬆️",probability:.5,energy:.5,coherence:.9,entangled:["particle2"]},{id:"particle2",label:"Spin Down",icon:"⬇️",probability:.5,energy:.5,coherence:.9,entangled:["particle1"]},{id:"photon1",label:"Polarization A",icon:"💫",probability:.4,energy:.8,coherence:.85,entangled:["photon2"]},{id:"photon2",label:"Polarization B",icon:"⭐",probability:.6,energy:.8,coherence:.85,entangled:["photon1"]}],ze=[{id:"complex1",label:"Main Dashboard",icon:"📊",probability:.4,energy:.6,coherence:.9,subStates:[{id:"dash1",label:"Analytics",probability:.5,energy:.4,coherence:.8},{id:"dash2",label:"Reports",probability:.3,energy:.5,coherence:.7},{id:"dash3",label:"Metrics",probability:.2,energy:.6,coherence:.6}]},{id:"complex2",label:"File Manager",icon:"📁",probability:.3,energy:.4,coherence:.8,entangled:["complex3"]},{id:"complex3",label:"Data Processor",icon:"⚡",probability:.2,energy:.8,coherence:.75,entangled:["complex2"]},{id:"complex4",label:"AI Assistant",icon:"🤖",probability:.1,energy:.9,coherence:.6}],Te={title:"Effects + Advanced/Glass Superpositional Menu",component:q,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{measurementType:{control:{type:"select"},options:["collapse","decoherence","interference"]},coherenceDecay:{control:{type:"range",min:0,max:.1,step:.005}},entanglementStrength:{control:{type:"range",min:0,max:1,step:.1}},maxSuperpositions:{control:{type:"range",min:2,max:10,step:1}}}},x={args:{menuStates:i,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},S={args:{menuStates:i,isObserved:!0,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!1}},f={args:{menuStates:H,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0,entanglementStrength:.8}},w={args:{menuStates:i,coherenceDecay:.05,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},N={args:{menuStates:i,coherenceDecay:.01,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},Q={args:{menuStates:i,measurementType:"collapse",visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},P={args:{menuStates:i,measurementType:"decoherence",coherenceDecay:.03,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},j={args:{menuStates:i,measurementType:"interference",visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},M={args:{menuStates:i,visualizeWaveFunction:!1,showProbabilities:!1,showQuantumNoise:!1}},F={args:{menuStates:ze,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0,entanglementStrength:.6}},z={args:{menuStates:i,maxSuperpositions:3,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},W={args:{menuStates:i.map(r=>({...r,coherence:.95})),coherenceDecay:.01,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},k={args:{menuStates:i.map(r=>({...r,coherence:.3})),coherenceDecay:.04,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},D={args:{menuStates:i.map(r=>({...r,probability:.2})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},C={args:{menuStates:[{...i[0],probability:.7},{...i[1],probability:.2},{...i[2],probability:.08},{...i[3],probability:.02}],visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},E={args:{menuStates:i.map(r=>({...r,energy:.9})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},$={args:{menuStates:i.map(r=>({...r,energy:.1})),visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},I={args:{menuStates:H,entanglementStrength:1,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}},T={args:{menuStates:H,entanglementStrength:.2,visualizeWaveFunction:!0,showProbabilities:!0,showQuantumNoise:!0}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...x.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates,
    isObserved: true,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: false
  }
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
    entanglementStrength: 0.8
  }
}`,...f.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      probability: 0.2
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...D.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.9
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...E.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.1
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...$.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    entanglementStrength: 1.0,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...I.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    menuStates: entangledStates,
    entanglementStrength: 0.2,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true
  }
}`,...T.parameters?.docs?.source}}};const qe=["Default","ObservedState","EntangledSystem","FastDecoherence","SlowDecoherence","CollapseMode","DecoherenceMode","InterferenceMode","MinimalVisualization","ComplexSystem","LimitedSuperpositions","HighCoherence","LowCoherence","UniformProbabilities","SkewedProbabilities","HighEnergyStates","LowEnergyStates","StrongEntanglement","WeakEntanglement"];export{Q as CollapseMode,F as ComplexSystem,P as DecoherenceMode,x as Default,f as EntangledSystem,w as FastDecoherence,W as HighCoherence,E as HighEnergyStates,j as InterferenceMode,z as LimitedSuperpositions,k as LowCoherence,$ as LowEnergyStates,M as MinimalVisualization,S as ObservedState,C as SkewedProbabilities,N as SlowDecoherence,I as StrongEntanglement,D as UniformProbabilities,T as WeakEntanglement,qe as __namedExportsOrder,Te as default};
