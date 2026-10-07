import{j as e,r as p}from"./iframe-RsoZoStf.js";import{a as m,I as d,C as c,u}from"./IntelligentColorSystem-hFS68J0a.js";import"./preload-helper-PPVm8Dsz.js";const f={title:"AI + Intelligence/Intelligent Color System",component:m,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Direct stories for every visual IntelligentColorSystem export, mounted on neutral liquid glass with no surrogate showcase layer."}}},tags:["autodocs"]},x={boxSizing:"border-box",display:"grid",minHeight:"100vh",minWidth:0,padding:"clamp(20px, 6vw, 72px)",placeItems:"center",width:"100%"};function s({children:o}){return e.jsx("div",{style:x,children:e.jsx("div",{style:{minWidth:0,width:"min(100%, 760px)"},children:o})})}function a({children:o}){const{adaptToPalette:l,updateConfig:i}=u();return p.useEffect(()=>{i({seasonalAdaptation:!1,timeBasedShifts:!1});const g=window.requestAnimationFrame(()=>{l({brightness:.45,contrast:.72,dominantColors:["#737373"],mood:"calm",saturation:0,temperature:"neutral"})});return()=>window.cancelAnimationFrame(g)},[l,i]),o}function C(){return e.jsx(d,{children:e.jsx(a,{children:e.jsxs("section",{className:"glass-foundation-complete glass-radius-3xl glass-p-8 glass-shadow-soft-xl",children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary",children:"Adaptive palette context"}),e.jsx("h2",{className:"glass-mt-2 glass-text-3xl glass-font-semibold glass-text-primary",children:"Material stays neutral"}),e.jsx("p",{className:"glass-mt-3 glass-max-w-xl glass-text-base glass-leading-relaxed glass-text-secondary",children:"Color intelligence is available to descendants while the supporting surface remains clear, restrained liquid glass."})]})})})}const t={name:"IntelligentColorSystem",render:()=>e.jsx(s,{children:e.jsx(m,{className:"glass-w-full",children:e.jsx(a,{children:e.jsx(c,{})})})})},r={name:"IntelligentColorProvider",render:()=>e.jsx(s,{children:e.jsx(C,{})})},n={name:"ColorAdaptationDemo",render:()=>e.jsx(s,{children:e.jsx(d,{children:e.jsx(a,{children:e.jsx(c,{})})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "IntelligentColorSystem",
  render: () => <StoryStage>
      <IntelligentColorSystemComponent className="glass-w-full">
        <DeterministicNeutralPalette>
          <ColorAdaptationDemoComponent />
        </DeterministicNeutralPalette>
      </IntelligentColorSystemComponent>
    </StoryStage>
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "IntelligentColorProvider",
  render: () => <StoryStage>
      <ProviderPreview />
    </StoryStage>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "ColorAdaptationDemo",
  render: () => <StoryStage>
      <IntelligentColorProviderComponent>
        <DeterministicNeutralPalette>
          <ColorAdaptationDemoComponent />
        </DeterministicNeutralPalette>
      </IntelligentColorProviderComponent>
    </StoryStage>
}`,...n.parameters?.docs?.source}}};const I=["IntelligentColorSystem","IntelligentColorProvider","ColorAdaptationDemo"];export{n as ColorAdaptationDemo,r as IntelligentColorProvider,t as IntelligentColorSystem,I as __namedExportsOrder,f as default};
