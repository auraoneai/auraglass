import{r as w,j as e,c as u}from"./iframe-Cqi-9gHA.js";import{O as j}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";const f=[{id:"input",label:"Input Layer",weights:[[.12,-.34,.52],[.41,-.67,.18],[.09,.23,-.12]],activation:[.64,.31,.78]},{id:"hidden",label:"Hidden Layer",weights:[[.43,-.58,.72,-.19],[-.27,.35,-.49,.63],[.11,.08,-.14,.21]],activation:[.52,.61,.47,.34]},{id:"output",label:"Output Layer",weights:[[.25,-.19],[-.38,.44],[.57,-.22],[-.29,.31]],activation:[.71,.29]}],v=(t,c,g)=>Math.min(g,Math.max(c,t));function p({layers:t=f,className:c,highlightThreshold:g=.75,precision:y=2,compact:l=!1,contained:m=!1,maxHeight:n}){const h=w.useMemo(()=>(t.length>0?t:f).map(i=>({...i,weights:i.weights.map(s=>s.map(r=>v(r,-1,1))),activation:i.activation?.map(s=>v(s,0,1))})),[t]);return e.jsxs(j,{role:"figure","aria-label":"Neural weight visualization",className:u("glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6","bg-gradient-to-br from-white/10 via-white/5 to-white/8",(l||m)&&"glass-overflow-auto",c),style:{...n!==void 0||l||m?{maxHeight:typeof(n??240)=="number"?`${n??240}px`:n}:null},children:[!l&&e.jsxs("header",{children:[e.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Neural Weight Visualization"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Inspect synaptic strength, signed values, and activation overlays."})]}),e.jsx("div",{className:u("glass-grid glass-gap-4",l?"glass-grid-cols-1":"lg:glass-grid-cols-3"),children:(l?h.slice(0,1):h).map(a=>e.jsxs("div",{className:"glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 glass-backdrop-blur",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-sm glass-text-primary-glass-opacity-80",children:[e.jsx("h3",{className:"glass-font-semibold glass-text-primary",children:a.label}),a.activation&&e.jsxs("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["Activation avg"," ",(a.activation.reduce((i,s)=>i+s,0)/a.activation.length).toFixed(2)]})]}),e.jsx("div",{className:"glass-mt-3 glass-overflow-hidden glass-radius-xl glass-border glass-border-white/10",children:e.jsx("table",{className:"glass-min-w-full glass-border-collapse",children:e.jsx("tbody",{children:a.weights.map((i,s)=>e.jsx("tr",{className:"glass-divide-x glass-divide-white-opacity-5",children:i.map((r,N)=>{const x=Math.abs(r)>=g;return e.jsx("td",{className:u("px-2 py-3 text-center text-xs font-semibold text-slate-800 transition",x&&"shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]"),style:{background:x?"linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(226,232,240,0.42) 100%)":"linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(241,245,249,0.32) 100%)"},children:r.toFixed(y)},`${a.id}-${s}-${N}`)})},`${a.id}-row-${s}`))})})}),!l&&a.activation&&e.jsxs("div",{className:"glass-mt-4 glass-space-y-2 glass-text-xs glass-text-primary-opacity-70",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-uppercase glass-tracking-wide",children:[e.jsx("span",{children:"Activation Levels"}),e.jsxs("span",{children:["Max ",Math.max(...a.activation).toFixed(2)]})]}),e.jsx("div",{className:"glass-flex glass-gap-2",children:a.activation.map((i,s)=>e.jsxs("div",{className:"glass-flex-1",children:[e.jsx("div",{className:"glass-h-16 glass-overflow-hidden glass-radius-full glass-surface-subtle/10",children:e.jsx("div",{className:"glass-h-full glass-w-full glass-radius-full glass-surface-primary/70",style:{height:`${i*100}%`}})}),e.jsxs("div",{className:"glass-mt-1 glass-text-center glass-text-10px glass-text-primary-glass-opacity-60",children:["n",s+1]})]},`${a.id}-activation-${s}`))})]})]},a.id))})]})}try{p.displayName="NeuralWeightVisualization",p.__docgenInfo={description:"",displayName:"NeuralWeightVisualization",props:{layers:{defaultValue:{value:`[
  {
    id: "input",
    label: "Input Layer",
    weights: [
      [0.12, -0.34, 0.52],
      [0.41, -0.67, 0.18],
      [0.09, 0.23, -0.12],
    ],
    activation: [0.64, 0.31, 0.78],
  },
  {
    id: "hidden",
    label: "Hidden Layer",
    weights: [
      [0.43, -0.58, 0.72, -0.19],
      [-0.27, 0.35, -0.49, 0.63],
      [0.11, 0.08, -0.14, 0.21],
    ],
    activation: [0.52, 0.61, 0.47, 0.34],
  },
  {
    id: "output",
    label: "Output Layer",
    weights: [
      [0.25, -0.19],
      [-0.38, 0.44],
      [0.57, -0.22],
      [-0.29, 0.31],
    ],
    activation: [0.71, 0.29],
  },
]`},description:"",name:"layers",required:!1,type:{name:"NeuralWeightMatrix[] | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},highlightThreshold:{defaultValue:{value:"0.75"},description:"",name:"highlightThreshold",required:!1,type:{name:"number | undefined"}},precision:{defaultValue:{value:"2"},description:"",name:"precision",required:!1,type:{name:"number | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const b=[{id:"sensor-array",label:"Sensor Array",weights:[[.84,-.31,.46],[-.18,.72,.29],[.37,.15,-.63]],activation:[.84,.58,.72]},{id:"reasoning-core",label:"Reasoning Core",weights:[[.61,-.42,.78,-.16],[-.33,.56,.24,.67],[.19,.38,-.51,.45]],activation:[.76,.64,.53,.81]},{id:"decision-layer",label:"Decision Layer",weights:[[.73,-.22],[.48,.31],[-.41,.69],[.27,-.35]],activation:[.88,.42]}],$={title:"AI + Intelligence/Neural Weight Visualization",component:p,parameters:{layout:"fullscreen",docs:{description:{component:"Direct rendering of the public NeuralWeightVisualization export with deterministic weights and activation data."}}},tags:["autodocs"],argTypes:{highlightThreshold:{control:{type:"range",min:0,max:1,step:.05}},precision:{control:{type:"range",min:0,max:4,step:1}},maxHeight:{control:!1}}},o={args:{layers:b,highlightThreshold:.7,precision:2,compact:!1,contained:!1}},d={args:{layers:b,highlightThreshold:.7,precision:2,compact:!0,contained:!0,maxHeight:320}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    layers: representativeLayers,
    highlightThreshold: 0.7,
    precision: 2,
    compact: false,
    contained: false
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    layers: representativeLayers,
    highlightThreshold: 0.7,
    precision: 2,
    compact: true,
    contained: true,
    maxHeight: 320
  }
}`,...d.parameters?.docs?.source}}};const q=["Default","Compact"];export{d as Compact,o as Default,q as __namedExportsOrder,$ as default};
