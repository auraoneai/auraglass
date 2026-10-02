import{j as e}from"./iframe-DFMMcocb.js";import{u as m}from"./index-DdjpOZjl.js";import{G as o,a as c,b as d}from"./GlassPredictiveEngine-D_3E50m3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const t=({children:n})=>e.jsx("div",{style:{boxSizing:"border-box",display:"grid",minHeight:"100vh",minWidth:0,padding:"clamp(24px, 6vw, 72px)",placeItems:"center",width:"100%"},children:e.jsx("div",{style:{minWidth:0,width:"min(100%, 720px)"},children:n})}),l=async n=>{const a=n.querySelector("button");a&&await m.click(a)},G={title:"AI + Intelligence/Glass Predictive Engine",component:o,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Direct stories for every public visual export in GlassPredictiveEngine: the complete engine, its provider, and the provider-backed prediction indicator."}}},tags:["autodocs"]},r={name:"GlassPredictiveEngine",render:()=>e.jsx(t,{children:e.jsx(o,{showIndicator:!1})})},i={name:"GlassPredictiveEngineProvider",render:()=>e.jsx(t,{children:e.jsx(c,{children:e.jsx(d,{})})}),play:async({canvasElement:n})=>l(n)},s={name:"GlassPredictionIndicator",render:()=>e.jsx(t,{children:e.jsx(c,{children:e.jsx(d,{showInsights:!0,maxPredictions:5})})}),play:async({canvasElement:n})=>l(n)};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "GlassPredictiveEngine",
  render: () => <StoryStage>
      <ActualGlassPredictiveEngine showIndicator={false} />
    </StoryStage>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassPredictiveEngineProvider",
  render: () => <StoryStage>
      <ActualGlassPredictiveEngineProvider>
        <ActualGlassPredictionIndicator />
      </ActualGlassPredictiveEngineProvider>
    </StoryStage>,
  play: async ({
    canvasElement
  }) => openPredictionPanel(canvasElement)
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "GlassPredictionIndicator",
  render: () => <StoryStage>
      <ActualGlassPredictiveEngineProvider>
        <ActualGlassPredictionIndicator showInsights maxPredictions={5} />
      </ActualGlassPredictiveEngineProvider>
    </StoryStage>,
  play: async ({
    canvasElement
  }) => openPredictionPanel(canvasElement)
}`,...s.parameters?.docs?.source}}};const E=["GlassPredictiveEngine","GlassPredictiveEngineProvider","GlassPredictionIndicator"];export{s as GlassPredictionIndicator,r as GlassPredictiveEngine,i as GlassPredictiveEngineProvider,E as __namedExportsOrder,G as default};
