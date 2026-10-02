import{j as e,c as d}from"./iframe-DFMMcocb.js";import{O as p}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const o=[{id:"alpha",nodes:["Q1","Q8"],fidelity:.93,phaseCorrelation:.84,state:"entangled",latency:4.2},{id:"beta",nodes:["Q3","Q11"],fidelity:.68,phaseCorrelation:.49,state:"decohering",latency:7.8},{id:"gamma",nodes:["Q2","Q5"],fidelity:.81,phaseCorrelation:.73,state:"entangled",latency:5.4},{id:"delta",nodes:["Q7","Q12"],fidelity:.39,phaseCorrelation:.31,state:"collapsed",latency:9.1}],h={entangled:"border-emerald-400/60 bg-emerald-500/10 text-emerald-200",decohering:"border-amber-400/60 bg-amber-400/10 text-amber-100",collapsed:"border-rose-400/60 bg-rose-500/10 text-rose-100"};function r({className:n,pairs:a=o,highlightThreshold:g=.7}){const m=a.length>0?a:o;return e.jsxs(p,{role:"table","aria-label":"Quantum entanglement visualizer",className:d("glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6","bg-gradient-to-br from-white/10 via-purple-500/15 to-white/5",n),children:[e.jsxs("header",{children:[e.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Quantum Entanglement Visualizer"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Monitor fidelity, phase correlation, and decoherence risk for entangled qubit pairs."})]}),e.jsx("div",{className:"glass-grid glass-gap-4 lg:glass-grid-cols-2",children:m.map(s=>{const i=s.state??(s.fidelity>=g?"entangled":s.fidelity>=.5?"decohering":"collapsed");return e.jsxs("div",{className:d("rounded-2xl border bg-white/5 p-4 text-primary/85 backdrop-blur transition","border-white/10 hover:border-white/30",h[i]),children:[e.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"glass-text-xs glass-uppercase glass-tracking-wide glass-text-primary-glass-opacity-60",children:"Pair"}),e.jsxs("div",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:[s.nodes[0]," ↔ ",s.nodes[1]]})]}),e.jsx("span",{className:"glass-radius-full glass-px-3 glass-py-1 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",children:i})]}),e.jsxs("dl",{className:"glass-mt-4 glass-grid glass-gap-3 glass-text-xs glass-text-primary-opacity-70",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("dt",{children:"Fidelity"}),e.jsxs("dd",{className:"glass-font-semibold glass-text-primary-glass-opacity-90",children:[(s.fidelity*100).toFixed(1),"%"]})]}),e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("dt",{children:"Phase correlation"}),e.jsxs("dd",{className:"glass-font-semibold glass-text-primary-glass-opacity-90",children:[(s.phaseCorrelation*100).toFixed(1),"%"]})]}),typeof s.latency=="number"&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("dt",{children:"Latency"}),e.jsxs("dd",{className:"glass-font-semibold glass-text-primary-glass-opacity-80",children:[s.latency.toFixed(1)," μs"]})]})]}),e.jsx("div",{className:"glass-mt-4 glass-h-2 glass-w-full glass-overflow-hidden glass-radius-full glass-surface-subtle/10",children:e.jsx("div",{className:"glass-h-full glass-radius-full glass-gradient-primary glass-gradient-primary glass-gradient-primary",style:{width:`${s.fidelity*100}%`}})})]},s.id)})})]})}try{r.displayName="QuantumEntanglementVisualizer",r.__docgenInfo={description:"",displayName:"QuantumEntanglementVisualizer",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},pairs:{defaultValue:{value:`[
  {
    id: "alpha",
    nodes: ["Q1", "Q8"],
    fidelity: 0.93,
    phaseCorrelation: 0.84,
    state: "entangled",
    latency: 4.2,
  },
  {
    id: "beta",
    nodes: ["Q3", "Q11"],
    fidelity: 0.68,
    phaseCorrelation: 0.49,
    state: "decohering",
    latency: 7.8,
  },
  {
    id: "gamma",
    nodes: ["Q2", "Q5"],
    fidelity: 0.81,
    phaseCorrelation: 0.73,
    state: "entangled",
    latency: 5.4,
  },
  {
    id: "delta",
    nodes: ["Q7", "Q12"],
    fidelity: 0.39,
    phaseCorrelation: 0.31,
    state: "collapsed",
    latency: 9.1,
  },
]`},description:"",name:"pairs",required:!1,type:{name:"QuantumEntanglementPair[] | undefined"}},highlightThreshold:{defaultValue:{value:"0.7"},description:"",name:"highlightThreshold",required:!1,type:{name:"number | undefined"}}}}}catch{}const c=[{id:"qubit-a1",nodes:["Q1","Q9"],fidelity:.96,phaseCorrelation:.9,state:"entangled",latency:3.8},{id:"qubit-b4",nodes:["Q4","Q12"],fidelity:.72,phaseCorrelation:.61,state:"decohering",latency:6.4},{id:"qubit-c2",nodes:["Q2","Q7"],fidelity:.84,phaseCorrelation:.79,state:"entangled",latency:4.9},{id:"qubit-d6",nodes:["Q6","Q14"],fidelity:.41,phaseCorrelation:.33,state:"collapsed",latency:8.7}],b={title:"Effects + Advanced/Quantum Entanglement Visualizer",component:r,parameters:{layout:"fullscreen",docs:{description:{component:"Direct rendering of the public QuantumEntanglementVisualizer export across entangled, decohering, and collapsed states."}}},tags:["autodocs"],argTypes:{highlightThreshold:{control:{type:"range",min:0,max:1,step:.05}}}},t={args:{pairs:c,highlightThreshold:.7}},l={args:{pairs:c.map(({state:n,...a})=>a),highlightThreshold:.75}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    pairs: representativePairs,
    highlightThreshold: 0.7
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    pairs: representativePairs.map(({
      state: _state,
      ...pair
    }) => pair),
    highlightThreshold: 0.75
  }
}`,...l.parameters?.docs?.source}}};const Q=["Default","DerivedStates"];export{t as Default,l as DerivedStates,Q as __namedExportsOrder,b as default};
