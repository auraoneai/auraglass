import{r as c,b as ue,h as me,j as e,c as a,m as q,d as A}from"./iframe-DpweptvF.js";import{u as ge}from"./useMotionPreference-GPoScSOr.js";import{c as pe}from"./createGlassStyle-BfWnO-qv.js";import{O as ve}from"./OptimizedGlassCore-UOg4NIOz.js";import"./preload-helper-PPVm8Dsz.js";const f={0:"var(--glass-color-error)",90:"var(--glass-color-info)",180:"var(--glass-color-primary)",270:"var(--glass-color-success)"},$=m=>{const l=m%(2*Math.PI)/(2*Math.PI)*360;return l<45||l>=315?f[0]:l<135?f[90]:l<225?f[180]:f[270]},H=c.forwardRef(({coherenceLevel:m,phase:l=0,decoherenceRate:g=.02,entanglementStrength:i=0,historicalData:Y=[],showPhaseIndicator:Z=!0,showWaveVisualization:ee=!0,showDecoherenceRate:ae=!0,showEntanglement:se=!0,realTimeMode:p=!1,coherenceThreshold:h=.3,alertOnDecoherence:C=!0,animationSpeed:O=1,onCoherenceLoss:_,onPhaseChange:F,className:re="",...ne},te)=>{const k=ue(),[s,oe]=c.useState(m),[t,ce]=c.useState(l),[we,le]=c.useState(0),[G,U]=c.useState(!1),[Q,ie]=c.useState(Y);me("glass-coherence-indicator");const{shouldAnimate:B}=ge();c.useEffect(()=>{if(!p)return;const r=setInterval(()=>{oe(o=>{const n=(Math.random()-.5)*.1,u=o*(1-g),d=Math.max(0,Math.min(1,u+n));return d<h&&o>=h?(U(!0),C&&_?.(d)):d>=h&&U(!1),d}),ce(o=>{const n=(o+.1*O)%(2*Math.PI);return F?.(n),n}),le(o=>o+.1*O)},100);return()=>clearInterval(r)},[p,g,h,C,O,_,F]),c.useEffect(()=>{if(p){const r={timestamp:Date.now(),coherence:s,phase:t,amplitude:s,frequency:1,decoherenceRate:g,entanglementStrength:i};ie(o=>[...o.slice(-49),r])}},[s,t,p,g,i]);const v=c.useMemo(()=>s>=.8?{label:"Highly Coherent",color:"var(--glass-color-success)"}:s>=.5?{label:"Moderately Coherent",color:"var(--glass-color-warning)"}:s>=.2?{label:"Low Coherence",color:"var(--glass-color-danger)"}:{label:"Decoherent",color:"var(--glass-color-danger)"},[s]),he=()=>{const o=c.useMemo(()=>Array.from({length:100},(n,u)=>{const d=u/100*4*Math.PI,J=s,K=J*Math.sin(d+t),X=i*J*Math.sin(d+t+Math.PI/2);return{x:u/100*300,y1:50+K*30,y2:50+X*20,combined:50+(K+X*.5)*25}}),[s,t,i,100]);return e.jsxs("svg",{width:"300",height:"100",className:a("glass-border glass-border-primary glass-radius glass-surface-dark"),children:[e.jsx("defs",{children:e.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:e.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"var(--glass-bg-default)",strokeWidth:"1"})})}),e.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"}),e.jsx("line",{x1:"0",y1:"50",x2:"300",y2:"50",stroke:"var(--glass-bg-hover)",strokeWidth:"1",strokeDasharray:"5,5"}),e.jsx("path",{d:`M ${o.map(n=>`${n.x} ${n.y1}`).join(" L ")}`,fill:"none",stroke:$(t),strokeWidth:"2",opacity:s}),i>0&&e.jsx("path",{d:`M ${o.map(n=>`${n.x} ${n.y2}`).join(" L ")}`,fill:"none",stroke:"var(--glass-color-secondary)",strokeWidth:"1.5",opacity:i*.8,strokeDasharray:"3,3"}),i>.3&&e.jsx("path",{d:`M ${o.map(n=>`${n.x} ${n.combined}`).join(" L ")}`,fill:"none",stroke:"var(--glass-white)",strokeWidth:"1",opacity:.6}),G&&e.jsx("g",{opacity:"0.7",children:Array.from({length:20},(n,u)=>e.jsx("circle",{cx:Math.random()*300,cy:Math.random()*100,r:Math.random()*3+1,fill:"var(--glass-color-danger)",opacity:Math.random()*.8,children:e.jsx("animate",{attributeName:"opacity",values:"0;0.8;0",dur:`${1+Math.random()}s`,repeatCount:"indefinite"})},u))})]})},de=()=>e.jsxs("div",{className:a("glass-relative glass-w-24 glass-h-24"),children:[e.jsxs("svg",{width:"96",height:"96",className:a("glass-absolute glass-inset-0"),children:[e.jsx("circle",{cx:"48",cy:"48",r:"40",fill:"none",stroke:"var(--glass-bg-hover)",strokeWidth:"2"}),[0,90,180,270].map(r=>e.jsxs("g",{children:[e.jsx("line",{x1:48+Math.cos(r*Math.PI/180)*35,y1:48+Math.sin(r*Math.PI/180)*35,x2:48+Math.cos(r*Math.PI/180)*42,y2:48+Math.sin(r*Math.PI/180)*42,stroke:"var(--glass-border-hover)",strokeWidth:"2"}),e.jsxs("text",{x:48+Math.cos(r*Math.PI/180)*30,y:48+Math.sin(r*Math.PI/180)*30+3,textAnchor:"middle",fontSize:"10",fill:"color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)",children:[r,"°"]})]},r)),e.jsx(q.line,{x1:"48",y1:"48",x2:48+Math.cos(t-Math.PI/2)*(30*s),y2:48+Math.sin(t-Math.PI/2)*(30*s),stroke:$(t),strokeWidth:"3",strokeLinecap:"round",animate:k?{}:{x2:48+Math.cos(t-Math.PI/2)*(30*s),y2:48+Math.sin(t-Math.PI/2)*(30*s)},transition:B?{duration:A.DURATION.fast/1e3}:{duration:0}}),e.jsx("circle",{cx:"48",cy:"48",r:"3",fill:$(t)})]}),e.jsx("div",{className:a("glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"),children:e.jsx("div",{className:a("glass-text-center"),children:e.jsxs("div",{className:a("glass-text-xs glass-text-primary glass-font-medium"),children:[(t*180/Math.PI).toFixed(0),"°"]})})})]});return e.jsxs(ve,{ref:te,variant:"frosted",className:a("glass-p-4 glass-space-y-4",re),...ne,children:[e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between"),children:[e.jsxs("div",{children:[e.jsx("h3",{className:a("glass-text-lg glass-font-semibold glass-text-primary"),children:"Quantum Coherence"}),e.jsx("p",{className:a("glass-text-sm glass-text-secondary"),children:v.label})]}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-4"),children:[G&&C&&e.jsxs(q.div,{className:a("glass-flex glass-items-center glass-space-x-1 glass-text-danger"),animate:k?{}:{opacity:[1,.5,1]},transition:k?{duration:0}:{duration:A.DURATION.slower/1e3,repeat:1/0},children:[e.jsx("span",{children:"⚠️"}),e.jsx("span",{className:a("glass-text-xs glass-font-medium"),children:"Decoherence"})]}),p&&e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-1 glass-text-success"),children:[e.jsx("div",{className:a("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")}),e.jsx("span",{className:a("glass-text-xs"),children:"Live"})]})]})]}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-space-x-6"),children:[e.jsxs("div",{className:a("glass-flex-1"),children:[e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between glass-mb-2"),children:[e.jsx("span",{className:a("glass-text-sm glass-text-primary"),children:"Coherence Level"}),e.jsxs("span",{className:a("glass-text-sm glass-font-medium glass-text-primary"),children:[(s*100).toFixed(1),"%"]})]}),e.jsxs("div",{className:a("glass-relative glass-h-4 glass-surface-subtle glass-radius-full glass-overflow-hidden"),children:[e.jsx(q.div,{className:a("glass-h-full glass-radius-full"),style:{background:`linear-gradient(90deg, ${v.color} 0%, ${v.color}80 100%)`},animate:{width:`${s*100}%`},transition:B?{duration:A.DURATION.normal/1e3}:{duration:0}}),e.jsx("div",{className:a("glass-absolute glass-top-0 glass-h-full glass-w-0.5 glass-surface-muted"),style:{left:`${h*100}%`}})]}),e.jsxs("div",{className:a("glass-flex glass-justify-between glass-mt-1 glass-text-xs glass-text-muted"),children:[e.jsx("span",{children:"0%"}),e.jsxs("span",{children:["Threshold (",(h*100).toFixed(0),"%)"]}),e.jsx("span",{children:"100%"})]})]}),Z&&e.jsx(de,{})]}),ee&&e.jsxs("div",{children:[e.jsx("h4",{className:a("glass-text-sm glass-font-medium glass-text-primary glass-mb-2"),children:"Wave Function"}),e.jsx(he,{})]}),e.jsxs("div",{className:a("glass-p-3 glass-radius-lg glass-border glass-border-subtle glass-space-y-2",pe({blur:"sm",opacity:.6}).background),children:[e.jsxs("div",{className:a("glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm"),children:[e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Phase:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(t*180/Math.PI).toFixed(1),"°"]})]}),ae&&e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Decoherence:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(g*100).toFixed(2),"%/s"]})]}),se&&i>0&&e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Entanglement:"}),e.jsxs("div",{className:a("glass-text-primary glass-font-medium"),children:[(i*100).toFixed(0),"%"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:a("glass-text-secondary"),children:"Status:"}),e.jsx("div",{className:a("glass-font-medium"),style:{color:v.color},children:s>=h?"Stable":"Unstable"})]})]}),Q.length>10&&e.jsx("div",{className:a("glass-pt-2 glass-border-t glass-border-subtle"),children:e.jsxs("div",{className:a("glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-secondary"),children:[e.jsx("span",{children:"Avg Coherence (1m):"}),e.jsxs("span",{children:[(Q.slice(-10).reduce((r,o)=>r+o.coherence,0)/10*100).toFixed(1),"%"]})]})})]})]})});try{H.displayName="GlassCoherenceIndicator",H.__docgenInfo={description:"",displayName:"GlassCoherenceIndicator",props:{coherenceLevel:{defaultValue:null,description:"",name:"coherenceLevel",required:!0,type:{name:"number"}},phase:{defaultValue:{value:"0"},description:"",name:"phase",required:!1,type:{name:"number | undefined"}},decoherenceRate:{defaultValue:{value:"0.02"},description:"",name:"decoherenceRate",required:!1,type:{name:"number | undefined"}},entanglementStrength:{defaultValue:{value:"0"},description:"",name:"entanglementStrength",required:!1,type:{name:"number | undefined"}},historicalData:{defaultValue:{value:"[]"},description:"",name:"historicalData",required:!1,type:{name:"CoherenceData[] | undefined"}},showPhaseIndicator:{defaultValue:{value:"true"},description:"",name:"showPhaseIndicator",required:!1,type:{name:"boolean | undefined"}},showWaveVisualization:{defaultValue:{value:"true"},description:"",name:"showWaveVisualization",required:!1,type:{name:"boolean | undefined"}},showDecoherenceRate:{defaultValue:{value:"true"},description:"",name:"showDecoherenceRate",required:!1,type:{name:"boolean | undefined"}},showEntanglement:{defaultValue:{value:"true"},description:"",name:"showEntanglement",required:!1,type:{name:"boolean | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},coherenceThreshold:{defaultValue:{value:"0.3"},description:"",name:"coherenceThreshold",required:!1,type:{name:"number | undefined"}},alertOnDecoherence:{defaultValue:{value:"true"},description:"",name:"alertOnDecoherence",required:!1,type:{name:"boolean | undefined"}},animationSpeed:{defaultValue:{value:"1"},description:"",name:"animationSpeed",required:!1,type:{name:"number | undefined"}},onCoherenceLoss:{defaultValue:null,description:"",name:"onCoherenceLoss",required:!1,type:{name:"((coherenceLevel: number) => void) | undefined"}},onPhaseChange:{defaultValue:null,description:"",name:"onPhaseChange",required:!1,type:{name:"((phase: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const fe=Array.from({length:20},(m,l)=>({timestamp:Date.now()-(20-l)*1e3,coherence:.8-Math.random()*.3,phase:l*.3%(2*Math.PI),amplitude:.7+Math.random()*.2,frequency:1,decoherenceRate:.02+Math.random()*.01,entanglementStrength:Math.random()*.5})),je={title:"Glass UI/Quantum/GlassCoherenceIndicator",component:H,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{coherenceLevel:{control:{type:"range",min:0,max:1,step:.1}},phase:{control:{type:"range",min:0,max:6.28,step:.1}},decoherenceRate:{control:{type:"range",min:0,max:.1,step:.005}},entanglementStrength:{control:{type:"range",min:0,max:1,step:.1}},coherenceThreshold:{control:{type:"range",min:.1,max:.9,step:.1}},animationSpeed:{control:{type:"range",min:.1,max:3,step:.1}}}},w={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:.3,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0}},x={args:{coherenceLevel:.95,phase:0,decoherenceRate:.01,entanglementStrength:.8,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,realTimeMode:!1}},M={args:{coherenceLevel:.2,phase:Math.PI,decoherenceRate:.08,entanglementStrength:.1,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,alertOnDecoherence:!0}},I={args:{coherenceLevel:.6,phase:Math.PI/2,decoherenceRate:.03,entanglementStrength:.4,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,alertOnDecoherence:!0}},y={args:{coherenceLevel:.8,phase:0,decoherenceRate:.1,entanglementStrength:.2,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,alertOnDecoherence:!0}},P={args:{coherenceLevel:.9,phase:Math.PI/6,decoherenceRate:.005,entanglementStrength:.6,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0}},j={args:{coherenceLevel:.8,phase:Math.PI/3,decoherenceRate:.02,entanglementStrength:.9,showPhaseIndicator:!0,showWaveVisualization:!0,showEntanglement:!0,realTimeMode:!0}},D={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:0,showPhaseIndicator:!0,showWaveVisualization:!0,showEntanglement:!1}},S={args:{coherenceLevel:.5,showPhaseIndicator:!1,showWaveVisualization:!1,showDecoherenceRate:!1,showEntanglement:!1}},R={args:{coherenceLevel:.8,phase:Math.PI*1.5,showPhaseIndicator:!0,showWaveVisualization:!1,showDecoherenceRate:!1,showEntanglement:!1,realTimeMode:!0,animationSpeed:2}},V={args:{coherenceLevel:.6,phase:Math.PI/2,entanglementStrength:.4,showPhaseIndicator:!1,showWaveVisualization:!0,showDecoherenceRate:!1,showEntanglement:!1,realTimeMode:!0}},L={args:{coherenceLevel:.7,phase:Math.PI/4,decoherenceRate:.02,entanglementStrength:.3,historicalData:fe,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,showEntanglement:!0,realTimeMode:!0}},b={args:{coherenceLevel:.25,phase:Math.PI,decoherenceRate:.05,coherenceThreshold:.3,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},W={args:{coherenceLevel:.8,phase:0,decoherenceRate:.02,entanglementStrength:.5,animationSpeed:3,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0}},N={args:{coherenceLevel:.7,phase:Math.PI/6,decoherenceRate:.02,entanglementStrength:.4,animationSpeed:.3,realTimeMode:!0,showPhaseIndicator:!0,showWaveVisualization:!0}},T={args:{coherenceLevel:.6,phase:Math.PI/4,decoherenceRate:.03,coherenceThreshold:.7,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},z={args:{coherenceLevel:.4,phase:Math.PI/2,decoherenceRate:.04,coherenceThreshold:.2,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,realTimeMode:!0}},E={args:{coherenceLevel:.1,phase:Math.PI*1.7,decoherenceRate:.08,entanglementStrength:.05,coherenceThreshold:.3,alertOnDecoherence:!0,showPhaseIndicator:!0,showWaveVisualization:!0,showDecoherenceRate:!0,realTimeMode:!1}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showEntanglement: false
  }
}`,...D.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    coherenceLevel: 0.5,
    showPhaseIndicator: false,
    showWaveVisualization: false,
    showDecoherenceRate: false,
    showEntanglement: false
  }
}`,...S.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};const De=["Default","HighCoherence","LowCoherence","RealTimeMode","FastDecoherence","SlowDecoherence","HighEntanglement","NoEntanglement","MinimalView","PhaseIndicatorOnly","WaveVisualizationOnly","WithHistoricalData","CriticalThreshold","FastAnimation","SlowAnimation","HighThreshold","LowThreshold","DecoherentState"];export{b as CriticalThreshold,E as DecoherentState,w as Default,W as FastAnimation,y as FastDecoherence,x as HighCoherence,j as HighEntanglement,T as HighThreshold,M as LowCoherence,z as LowThreshold,S as MinimalView,D as NoEntanglement,R as PhaseIndicatorOnly,I as RealTimeMode,N as SlowAnimation,P as SlowDecoherence,V as WaveVisualizationOnly,L as WithHistoricalData,De as __namedExportsOrder,je as default};
