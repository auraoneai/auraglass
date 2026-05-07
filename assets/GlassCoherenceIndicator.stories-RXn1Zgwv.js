import{r as u,b as Ie,j as e,c as a,m as G,d as U}from"./iframe-CToTmdO0.js";import{u as Pe}from"./a11y-E_E8Udq3.js";import{u as je}from"./useMotionPreference-BhLipaJT.js";import{c as Se}from"./createGlassStyle-BfWnO-qv.js";import{O as De}from"./OptimizedGlassCore-tBAFSalT.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BEZRvwEn.js";const y={0:"var(--glass-color-error)",90:"var(--glass-color-info)",180:"var(--glass-color-primary)",270:"var(--glass-color-success)"},h=(o,d=0)=>{const l=typeof o=="number"?o:typeof o=="string"&&o.trim()!==""?Number(o):d;return Number.isFinite(l)?l:d},t=(o,d=0,l=1,q=0)=>{const F=h(o,q);return Math.min(l,Math.max(d,F))},Q=o=>{const l=h(o)%(2*Math.PI)/(2*Math.PI)*360;return l<45||l>=315?y[0]:l<135?y[90]:l<225?y[180]:y[270]},B=u.forwardRef(({coherenceLevel:o,phase:d=0,decoherenceRate:l=.02,entanglementStrength:q=0,historicalData:F=[],showPhaseIndicator:re=!0,showWaveVisualization:oe=!0,showDecoherenceRate:ce=!0,showEntanglement:le=!0,realTimeMode:v=!1,coherenceThreshold:ie=.3,alertOnDecoherence:$=!0,animationSpeed:he=1,onCoherenceLoss:J,onPhaseChange:K,className:de="",...ue},me)=>{const ge=t(o),pe=h(d),w=t(l,0,1,.02),m=t(q),g=t(ie,0,1,.3),H=h(he,1),_=Ie(),[c,fe]=u.useState(ge),[i,ve]=u.useState(pe),[Ve,we]=u.useState(0),[X,Y]=u.useState(!1),[Z,xe]=u.useState(F);Pe("glass-coherence-indicator");const{shouldAnimate:ee}=je();u.useEffect(()=>{if(!v)return;const s=setInterval(()=>{fe(r=>{const n=(Math.random()-.5)*.1,f=t(r)*(1-w),p=Math.max(0,Math.min(1,f+n));return p<g&&r>=g?(Y(!0),$&&J?.(p)):p>=g&&Y(!1),p}),ve(r=>{const n=(h(r)+.1*H)%(2*Math.PI);return K?.(n),n}),we(r=>r+.1*H)},100);return()=>clearInterval(s)},[v,w,g,$,H,J,K]),u.useEffect(()=>{if(v){const s={timestamp:Date.now(),coherence:t(c),phase:h(i),amplitude:t(c),frequency:1,decoherenceRate:w,entanglementStrength:m};xe(r=>[...r.slice(-49),s])}},[c,i,v,w,m]);const x=u.useMemo(()=>{const s=t(c);return s>=.8?{label:"Highly Coherent",color:"var(--glass-color-success)"}:s>=.5?{label:"Moderately Coherent",color:"var(--glass-color-warning)"}:s>=.2?{label:"Low Coherence",color:"var(--glass-color-danger)"}:{label:"Decoherent",color:"var(--glass-color-danger)"}},[c]),Me=()=>{const r=u.useMemo(()=>Array.from({length:100},(n,f)=>{const p=f/100*4*Math.PI,ae=t(c),se=h(i),ne=ae*Math.sin(p+se),te=m*ae*Math.sin(p+se+Math.PI/2);return{x:f/100*300,y1:50+ne*30,y2:50+te*20,combined:50+(ne+te*.5)*25}}),[c,i,m,100]);return e.jsxs("svg",{width:"300",height:"100",className:a("glass-border glass-border-primary glass-radius glass-surface-dark"),children:[e.jsx("defs",{children:e.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:e.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"var(--glass-bg-default)",strokeWidth:"1"})})}),e.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"}),e.jsx("line",{x1:"0",y1:"50",x2:"300",y2:"50",stroke:"var(--glass-bg-hover)",strokeWidth:"1",strokeDasharray:"5,5"}),e.jsx("path",{d:`M ${r.map(n=>`${n.x} ${n.y1}`).join(" L ")}`,fill:"none",stroke:Q(i),strokeWidth:"2",opacity:t(c)}),m>0&&e.jsx("path",{d:`M ${r.map(n=>`${n.x} ${n.y2}`).join(" L ")}`,fill:"none",stroke:"var(--glass-color-secondary)",strokeWidth:"1.5",opacity:m*.8,strokeDasharray:"3,3"}),m>.3&&e.jsx("path",{d:`M ${r.map(n=>`${n.x} ${n.combined}`).join(" L ")}`,fill:"none",stroke:"var(--glass-white)",strokeWidth:"1",opacity:.6}),X&&e.jsx("g",{opacity:"0.7",children:Array.from({length:20},(n,f)=>e.jsx("circle",{cx:Math.random()*300,cy:Math.random()*100,r:Math.random()*3+1,fill:"var(--glass-color-danger)",opacity:Math.random()*.8,children:e.jsx("animate",{attributeName:"opacity",values:"0;0.8;0",dur:`${1+Math.random()}s`,repeatCount:"indefinite"})},f))})]})},M={x:48+Math.cos(h(i)-Math.PI/2)*(30*t(c)),y:48+Math.sin(h(i)-Math.PI/2)*(30*t(c))},ye=()=>e.jsxs("div",{className:a("glass-relative glass-w-24 glass-h-24"),children:[e.jsxs("svg",{width:"96",height:"96",className:a("glass-absolute glass-inset-0"),children:[e.jsx("circle",{cx:"48",cy:"48",r:"40",fill:"none",stroke:"var(--glass-bg-hover)",strokeWidth:"2"}),[0,90,180,270].map(s=>e.jsxs("g",{children:[e.jsx("line",{x1:48+Math.cos(s*Math.PI/180)*35,y1:48+Math.sin(s*Math.PI/180)*35,x2:48+Math.cos(s*Math.PI/180)*42,y2:48+Math.sin(s*Math.PI/180)*42,stroke:"var(--glass-border-hover)",strokeWidth:"2"}),e.jsxs("text",{x:48+Math.cos(s*Math.PI/180)*30,y:48+Math.sin(s*Math.PI/180)*30+3,textAnchor:"middle",fontSize:"10",fill:"color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)",children:[s,"°"]})]},s)),e.jsx(G.line,{x1:"48",y1:"48",x2:M.x,y2:M.y,stroke:Q(i),strokeWidth:"3",strokeLinecap:"round",animate:_?{}:{x2:M.x,y2:M.y},transition:ee?{duration:U.DURATION.fast/1e3}:{duration:0}}),e.jsx("circle",{cx:"48",cy:"48",r:"3",fill:Q(i)})]}),e.jsx("div",{className:a("glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"),children:e.jsx("div",{className:a("glass-text-center"),children:e.jsxs("div",{className:a("glass-text-xs glass-text-primary glass-font-medium"),children:[(h(i)*180/Math.PI).toFixed(0),"°"]})})})]});return e.jsxs(De,{ref:me,variant:"frosted",className:a("glass-p-4 glass-space-y-4",de),...ue,children:[e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between"),children:[e.jsxs("div",{children:[e.jsx("h3",{className:a("glass-text-lg glass-font-semibold glass-text-primary"),children:"Quantum Coherence"}),e.jsx("p",{className:a("glass-text-sm glass-text-secondary"),children:x.label})]}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-4"),children:[X&&$&&e.jsxs(G.div,{className:a("glass-flex glass-items-center glass-space-x-1 glass-text-danger"),animate:_?{}:{opacity:[1,.5,1]},transition:_?{duration:0}:{duration:U.DURATION.slower/1e3,repeat:1/0},children:[e.jsx("span",{children:"⚠️"}),e.jsx("span",{className:a("glass-text-xs glass-font-medium"),children:"Decoherence"})]}),v&&e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-1 glass-text-success"),children:[e.jsx("div",{className:a("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")}),e.jsx("span",{className:a("glass-text-xs"),children:"Live"})]})]})]}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-6"),children:[e.jsxs("div",{className:a("glass-flex-1"),children:[e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between glass-mb-2"),children:[e.jsx("span",{className:a("glass-text-sm glass-text-primary"),children:"Coherence Level"}),e.jsxs("span",{className:a("glass-text-sm glass-font-medium glass-text-primary"),children:[(t(c)*100).toFixed(1),"%"]})]}),e.jsxs("div",{className:a("glass-relative glass-h-4 glass-surface-subtle glass-radius-full glass-overflow-hidden"),children:[e.jsx(G.div,{className:a("glass-h-full glass-radius-full"),style:{background:`linear-gradient(90deg, ${x.color} 0%, ${x.color}80 100%)`},animate:{width:`${t(c)*100}%`},transition:ee?{duration:U.DURATION.normal/1e3}:{duration:0}}),e.jsx("div",{className:a("glass-absolute glass-top-0 glass-h-full glass-w-0.5 glass-surface-muted"),style:{left:`${g*100}%`}})]}),e.jsxs("div",{className:a("glass-flex glass-justify-between glass-mt-1 glass-text-xs glass-text-muted"),children:[e.jsx("span",{children:"0%"}),e.jsxs("span",{children:["Threshold (",(g*100).toFixed(0),"%)"]}),e.jsx("span",{children:"100%"})]})]}),re&&e.jsx(ye,{})]}),oe&&e.jsxs("div",{children:[e.jsx("h4",{className:a("glass-text-sm glass-font-medium glass-text-primary glass-mb-2"),children:"Wave Function"}),e.jsx(Me,{})]}),e.jsxs("div",{className:a("glass-p-3 glass-radius-lg glass-border glass-border-subtle glass-space-y-2",Se({blur:"sm",opacity:.6}).background),children:[e.jsxs("div",{className:a("glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm"),children:[e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Phase:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(h(i)*180/Math.PI).toFixed(1),"°"]})]}),ce&&e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Decoherence:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(w*100).toFixed(2),"%/s"]})]}),le&&m>0&&e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Entanglement:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(m*100).toFixed(0),"%"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Status:"}),e.jsx("div",{className:a("glass-font-medium"),style:{color:x.color},children:t(c)>=g?"Stable":"Unstable"})]})]}),Z.length>10&&e.jsx("div",{className:a("glass-pt-2 glass-border-t glass-border-subtle"),children:e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-secondary"),children:[e.jsx("span",{children:"Avg Coherence (1m):"}),e.jsxs("span",{children:[(Z.slice(-10).reduce((s,r)=>s+r.coherence,0)/10*100).toFixed(1),"%"]})]})})]})]})});try{B.displayName="GlassCoherenceIndicator",B.__docgenInfo={description:"",displayName:"GlassCoherenceIndicator",props:{coherenceLevel:{defaultValue:null,description:"",name:"coherenceLevel",required:!0,type:{name:"number"}},phase:{defaultValue:{value:"0"},description:"",name:"phase",required:!1,type:{name:"number | undefined"}},decoherenceRate:{defaultValue:{value:"0.02"},description:"",name:"decoherenceRate",required:!1,type:{name:"number | undefined"}},entanglementStrength:{defaultValue:{value:"0"},description:"",name:"entanglementStrength",required:!1,type:{name:"number | undefined"}},historicalData:{defaultValue:{value:"[]"},description:"",name:"historicalData",required:!1,type:{name:"CoherenceData[] | undefined"}},showPhaseIndicator:{defaultValue:{value:"true"},description:"",name:"showPhaseIndicator",required:!1,type:{name:"boolean | undefined"}},showWaveVisualization:{defaultValue:{value:"true"},description:"",name:"showWaveVisualization",required:!1,type:{name:"boolean | undefined"}},showDecoherenceRate:{defaultValue:{value:"true"},description:"",name:"showDecoherenceRate",required:!1,type:{name:"boolean | undefined"}},showEntanglement:{defaultValue:{value:"true"},description:"",name:"showEntanglement",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},coherenceThreshold:{defaultValue:{value:"0.3"},description:"",name:"coherenceThreshold",required:!1,type:{name:"number | undefined"}},alertOnDecoherence:{defaultValue:{value:"true"},description:"",name:"alertOnDecoherence",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},onCoherenceLoss:{defaultValue:null,description:"",name:"onCoherenceLoss",required:!1,type:{name:"((coherenceLevel: number) => void) | undefined"}},onPhaseChange:{defaultValue:null,description:"",name:"onPhaseChange",required:!1,type:{name:"((phase: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const Re=Array.from({length:20},(o,d)=>({timestamp:Date.now()-(20-d)*1e3,coherence:.8-Math.random()*.3,phase:d*.3%(2*Math.PI),amplitude:.7+Math.random()*.2,frequency:1,decoherenceRate:.02+Math.random()*.01,entanglementStrength:Math.random()*.5})),Ce={title:"Effects + Advanced/Glass Coherence Indicator",component:B,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{coherenceLevel:{control:{type:"range",min:0,max:1,step:.1}},phase:{control:{type:"range",min:0,max:6.28,step:.1}},decoherenceRate:{control:{type:"range",min:0,max:.1,step:.005}},entanglementStrength:{control:{type:"range",min:0,max:1,step:.1}},coherenceThreshold:{control:{type:"range",min:.1,max:.9,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}}}},I={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:.3,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0}},P={args:{coherenceLevel:.95,phase:0,decoherenceRate:.01,entanglementStrength:.8,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,realTimeMode:!1}},j={args:{coherenceLevel:.2,phase:Math.PI,decoherenceRate:.08,entanglementStrength:.1,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,alertOnDecoherence:!0}},S={args:{coherenceLevel:.6,phase:Math.PI/2,decoherenceRate:.03,entanglementStrength:.4,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,alertOnDecoherence:!0}},D={args:{coherenceLevel:.8,phase:0,decoherenceRate:.1,entanglementStrength:.2,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,alertOnDecoherence:!0}},R={args:{coherenceLevel:.9,phase:Math.PI/6,decoherenceRate:.005,entanglementStrength:.6,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0}},V={args:{coherenceLevel:.8,phase:Math.PI/3,decoherenceRate:.02,entanglementStrength:.9,showPhaseIndicator:!0,showWaveVisualization:!0,showEntanglement:!0,realTimeMode:!0}},b={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:0,showPhaseIndicator:!0,showWaveVisualization:!0,showEntanglement:!1}},L={args:{coherenceLevel:.5,showPhaseIndicator:!1,showWaveVisualization:!1,showDecoherenceRate:!1,showEntanglement:!1}},T={args:{coherenceLevel:.8,phase:Math.PI*1.5,showPhaseIndicator:!0,showWaveVisualization:!1,showDecoherenceRate:!1,showEntanglement:!1,realTimeMode:!0,animationSpeed:2}},N={args:{coherenceLevel:.6,phase:Math.PI/2,entanglementStrength:.4,showPhaseIndicator:!1,showWaveVisualization:!0,showDecoherenceRate:!1,showEntanglement:!1,realTimeMode:!0}},W={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:.3,historicalData:Re,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,realTimeMode:!0}},z={args:{coherenceLevel:.25,phase:Math.PI,decoherenceRate:.05,coherenceThreshold:.3,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},E={args:{coherenceLevel:.8,phase:0,decoherenceRate:.02,entanglementStrength:.5,animationSpeed:3,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0}},C={args:{coherenceLevel:.7,phase:Math.PI/6,decoherenceRate:.02,entanglementStrength:.4,animationSpeed:.3,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0}},O={args:{coherenceLevel:.6,phase:Math.PI/4,decoherenceRate:.03,coherenceThreshold:.7,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},k={args:{coherenceLevel:.4,phase:Math.PI/2,decoherenceRate:.04,coherenceThreshold:.2,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},A={args:{coherenceLevel:.1,phase:Math.PI*1.7,decoherenceRate:.08,entanglementStrength:.05,coherenceThreshold:.3,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,realTimeMode:!1}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0.3,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true
  }
}`,...I.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.95,
    phase: 0,
    decoherenceRate: 0.01,
    entanglementStrength: 0.8,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    realTimeMode: false
  }
}`,...P.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.2,
    phase: Math.PI,
    decoherenceRate: 0.08,
    entanglementStrength: 0.1,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    alertOnDecoherence: true
  }
}`,...j.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 2,
    decoherenceRate: 0.03,
    entanglementStrength: 0.4,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    alertOnDecoherence: true
  }
}`,...S.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.8,
    phase: 0,
    decoherenceRate: 0.1,
    entanglementStrength: 0.2,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    alertOnDecoherence: true
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.9,
    phase: Math.PI / 6,
    decoherenceRate: 0.005,
    entanglementStrength: 0.6,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true
  }
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.8,
    phase: Math.PI / 3,
    decoherenceRate: 0.02,
    entanglementStrength: 0.9,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showEntanglement: true,
    realTimeMode: true
  }
}`,...V.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showEntanglement: false
  }
}`,...b.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.5,
    showPhaseIndicator: false,
    showWaveVisualization: false,
    showDecoherenceRate: false,
    showEntanglement: false
  }
}`,...L.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.8,
    phase: Math.PI * 1.5,
    showPhaseIndicator: true,
    showWaveVisualization: false,
    showDecoherenceRate: false,
    showEntanglement: false,
    realTimeMode: true,
    animationSpeed: 2
  }
}`,...T.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 2,
    entanglementStrength: 0.4,
    showPhaseIndicator: false,
    showWaveVisualization: true,
    showDecoherenceRate: false,
    showEntanglement: false,
    realTimeMode: true
  }
}`,...N.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0.3,
    historicalData: mockHistoricalData,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    realTimeMode: true
  }
}`,...W.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.25,
    phase: Math.PI,
    decoherenceRate: 0.05,
    coherenceThreshold: 0.3,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true
  }
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.8,
    phase: 0,
    decoherenceRate: 0.02,
    entanglementStrength: 0.5,
    animationSpeed: 3,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true
  }
}`,...E.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 6,
    decoherenceRate: 0.02,
    entanglementStrength: 0.4,
    animationSpeed: 0.3,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true
  }
}`,...C.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 4,
    decoherenceRate: 0.03,
    coherenceThreshold: 0.7,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true
  }
}`,...O.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.4,
    phase: Math.PI / 2,
    decoherenceRate: 0.04,
    coherenceThreshold: 0.2,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true
  }
}`,...k.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.1,
    phase: Math.PI * 1.7,
    decoherenceRate: 0.08,
    entanglementStrength: 0.05,
    coherenceThreshold: 0.3,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    realTimeMode: false
  }
}`,...A.parameters?.docs?.source}}};const Oe=["Default","HighCoherence","LowCoherence","RealTimeMode","FastDecoherence","SlowDecoherence","HighEntanglement","NoEntanglement","MinimalView","PhaseIndicatorOnly","WaveVisualizationOnly","WithHistoricalData","CriticalThreshold","FastAnimation","SlowAnimation","HighThreshold","LowThreshold","DecoherentState"];export{z as CriticalThreshold,A as DecoherentState,I as Default,E as FastAnimation,D as FastDecoherence,P as HighCoherence,V as HighEntanglement,O as HighThreshold,j as LowCoherence,k as LowThreshold,L as MinimalView,b as NoEntanglement,T as PhaseIndicatorOnly,S as RealTimeMode,C as SlowAnimation,R as SlowDecoherence,N as WaveVisualizationOnly,W as WithHistoricalData,Oe as __namedExportsOrder,Ce as default};
