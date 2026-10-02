import{f as w}from"./index-DdjpOZjl.js";import{a as v,r as l,j as e,c as p}from"./iframe-DFMMcocb.js";import{O as b}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const m=[{id:"quantum-loop",name:"Quantum Loop",pattern:"spiral-clockwise",dimensions:[{axis:"x",weight:.4,sensitivity:.7},{axis:"y",weight:.4,sensitivity:.7},{axis:"z",weight:.2,sensitivity:.6},{axis:"rotation",weight:.3,sensitivity:.8}],description:"Circular gesture with rising elevation and gentle rotation.",baselineConfidence:.82},{id:"phase-shift",name:"Phase Shift",pattern:"figure-eight",dimensions:[{axis:"time",weight:.2,sensitivity:.5},{axis:"pressure",weight:.25,sensitivity:.6},{axis:"x",weight:.35,sensitivity:.65},{axis:"y",weight:.35,sensitivity:.65}],description:"Alternating infinity loop signalling intent to switch contexts.",baselineConfidence:.74},{id:"portal-drag",name:"Portal Drag",pattern:"arc-downward",dimensions:[{axis:"z",weight:.5,sensitivity:.8},{axis:"pressure",weight:.3,sensitivity:.7},{axis:"time",weight:.2,sensitivity:.45}],description:"Pull motion to reveal immersive overlays.",baselineConfidence:.69}],j={x:"Lateral",y:"Vertical",z:"Depth",time:"Temporal",pressure:"Pressure",rotation:"Rotation"};function o({gestures:i=m,onRecognize:c,className:x,showConfidence:d=!0}){const h=v(),[r,f]=l.useState(null),g=l.useMemo(()=>i.length>0?i:m,[i]),y=l.useCallback(s=>{f(s.id),c?.(s)},[c]);return e.jsxs(b,{role:"application","aria-label":"Multi-dimensional gesture recognizer",className:p("glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6","bg-gradient-to-br from-white/10 via-indigo-500/15 to-white/5",x),children:[e.jsxs("header",{className:"glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Multi-dimensional Gesture Recognizer"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Analyse six-axis motion patterns with adaptive sensitivity tuning."})]}),d&&r&&e.jsxs("span",{className:"glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/10 glass-px-3 glass-py-1 glass-text-xs glass-text-primary-glass-opacity-80",children:["Active gesture:"," ",g.find(s=>s.id===r)?.name??"—"]})]}),e.jsx("div",{className:"glass-grid glass-gap-4 lg:glass-grid-cols-3",children:g.map(s=>e.jsxs("button",{type:"button",onClick:()=>y(s),className:p("relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition","hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 glass-focus glass-touch-target glass-contrast-guard",r===s.id?"border-sky-400/60 shadow-[0_0_30px_-10px_rgba(125,211,252,0.8)]":void 0),children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:s.name}),e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:s.description})]}),e.jsxs("dl",{className:"glass-grid glass-gap-2 glass-text-xs glass-text-primary-opacity-70",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("dt",{className:"glass-uppercase glass-tracking-wide",children:"Pattern"}),e.jsx("dd",{className:"glass-font-semibold glass-text-primary-opacity-85",children:s.pattern})]}),d&&e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsx("dt",{className:"glass-uppercase glass-tracking-wide",children:"Baseline confidence"}),e.jsxs("dd",{className:"glass-font-semibold glass-text-primary",children:[(Math.min(.99,Math.max(0,s.baselineConfidence??.5))*100).toFixed(0),"%"]})]})]}),e.jsxs("div",{className:"glass-mt-auto glass-space-y-2",children:[e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-50",children:[e.jsx("span",{children:"Dimensional weights"}),!h&&e.jsxs("span",{className:"glass-font-semibold glass-text-primary-opacity-70",children:[s.dimensions.length," axes"]})]}),e.jsx("ul",{className:"glass-grid glass-gap-2 glass-text-xs glass-text-primary",children:s.dimensions.map(t=>e.jsxs("li",{className:"glass-flex glass-items-center glass-justify-between glass-radius-xl glass-border glass-border-white/5 glass-surface-subtle/5 glass-px-3 glass-py-2",children:[e.jsx("span",{className:"glass-font-medium glass-text-primary-opacity-85",children:j[t.axis]}),e.jsxs("span",{className:"glass-text-primary-glass-opacity-60",children:["Weight ",(t.weight??.25).toFixed(2)," | Sens"," ",(t.sensitivity??.5).toFixed(2)]})]},`${s.id}-${t.axis}`))})]})]},s.id))})]})}try{o.displayName="MultiDimensionalGestureRecognizer",o.__docgenInfo={description:"",displayName:"MultiDimensionalGestureRecognizer",props:{gestures:{defaultValue:{value:`[
  {
    id: "quantum-loop",
    name: "Quantum Loop",
    pattern: "spiral-clockwise",
    dimensions: [
      { axis: "x", weight: 0.4, sensitivity: 0.7 },
      { axis: "y", weight: 0.4, sensitivity: 0.7 },
      { axis: "z", weight: 0.2, sensitivity: 0.6 },
      { axis: "rotation", weight: 0.3, sensitivity: 0.8 },
    ],
    description: "Circular gesture with rising elevation and gentle rotation.",
    baselineConfidence: 0.82,
  },
  {
    id: "phase-shift",
    name: "Phase Shift",
    pattern: "figure-eight",
    dimensions: [
      { axis: "time", weight: 0.2, sensitivity: 0.5 },
      { axis: "pressure", weight: 0.25, sensitivity: 0.6 },
      { axis: "x", weight: 0.35, sensitivity: 0.65 },
      { axis: "y", weight: 0.35, sensitivity: 0.65 },
    ],
    description:
      "Alternating infinity loop signalling intent to switch contexts.",
    baselineConfidence: 0.74,
  },
  {
    id: "portal-drag",
    name: "Portal Drag",
    pattern: "arc-downward",
    dimensions: [
      { axis: "z", weight: 0.5, sensitivity: 0.8 },
      { axis: "pressure", weight: 0.3, sensitivity: 0.7 },
      { axis: "time", weight: 0.2, sensitivity: 0.45 },
    ],
    description: "Pull motion to reveal immersive overlays.",
    baselineConfidence: 0.69,
  },
]`},description:"",name:"gestures",required:!1,type:{name:"GestureDefinition[] | undefined"}},onRecognize:{defaultValue:null,description:"",name:"onRecognize",required:!1,type:{name:"((gesture: GestureDefinition) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},showConfidence:{defaultValue:{value:"true"},description:"",name:"showConfidence",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const u=[{id:"orbit-select",name:"Orbit Select",pattern:"clockwise-orbit",dimensions:[{axis:"x",weight:.42,sensitivity:.78},{axis:"y",weight:.38,sensitivity:.74},{axis:"z",weight:.2,sensitivity:.61},{axis:"rotation",weight:.31,sensitivity:.82}],description:"Circular selection gesture with a controlled depth rise.",baselineConfidence:.89},{id:"focus-shift",name:"Focus Shift",pattern:"figure-eight",dimensions:[{axis:"x",weight:.36,sensitivity:.67},{axis:"y",weight:.36,sensitivity:.67},{axis:"time",weight:.18,sensitivity:.56},{axis:"pressure",weight:.25,sensitivity:.64}],description:"Alternating loop that transfers focus between workspaces.",baselineConfidence:.81},{id:"depth-pull",name:"Depth Pull",pattern:"arc-toward-user",dimensions:[{axis:"z",weight:.52,sensitivity:.84},{axis:"pressure",weight:.3,sensitivity:.72},{axis:"time",weight:.18,sensitivity:.49}],description:"Pull motion that reveals a contextual command surface.",baselineConfidence:.76}],_={title:"Effects + Advanced/Multi Dimensional Gesture Recognizer",component:o,parameters:{layout:"fullscreen",docs:{description:{component:"Direct rendering of the public MultiDimensionalGestureRecognizer export with representative six-axis input patterns."}}},tags:["autodocs"],args:{onRecognize:w()},argTypes:{onRecognize:{action:void 0}}},a={args:{gestures:u,showConfidence:!0}},n={args:{gestures:u,showConfidence:!1}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    gestures: representativeGestures,
    showConfidence: true
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    gestures: representativeGestures,
    showConfidence: false
  }
}`,...n.parameters?.docs?.source}}};const M=["Default","Simplified"];export{a as Default,n as Simplified,M as __namedExportsOrder,_ as default};
