import{j as t,r as n}from"./iframe-RsoZoStf.js";import{G as c}from"./GlassButton-BmzykaoH.js";import{a,b as m,u as l}from"./GlassToast-B1jiwyNj.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./a11y-WSL2JlLl.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassSpatialAudio-nY9QSvQ1.js";import"./MotionFramer-tKl7gvze.js";import"./utilsCore-DLcXNkaQ.js";import"./components-DwI53NlZ.js";const z={title:"Data + Visualization/Glass Toast Provider",component:a,parameters:{layout:"fullscreen",previewSurface:"component"},args:{children:null}},p=({seed:e})=>{const{addToast:s}=l(),i=n.useRef(!1);return n.useEffect(()=>{i.current||(i.current=!0,s({title:"Workspace published",description:"Northstar Studio is now available to every collaborator.",type:"success",duration:0}))},[s,e]),t.jsx(c,{type:"button",onClick:()=>s({title:"Changes saved",description:"Your workspace settings are up to date.",type:"info",duration:0}),children:"Show another toast"})},d=({children:e})=>t.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:e}),o={name:"GlassToastProvider",render:()=>t.jsx(a,{position:"bottom-right",duration:0,children:t.jsx(d,{children:t.jsx(p,{seed:"provider"})})})},r={name:"GlassToastViewport",render:()=>t.jsx(a,{position:"bottom-right",duration:0,children:t.jsxs(d,{children:[t.jsx(p,{seed:"viewport"}),t.jsx(m,{position:"top-right"})]})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "GlassToastProvider",
  render: () => <ToastProvider position="bottom-right" duration={0}>
      <StoryStage>
        <ToastLauncher seed="provider" />
      </StoryStage>
    </ToastProvider>
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "GlassToastViewport",
  render: () => <ToastProvider position="bottom-right" duration={0}>
      <StoryStage>
        <ToastLauncher seed="viewport" />
        <ToastViewport position="top-right" />
      </StoryStage>
    </ToastProvider>
}`,...r.parameters?.docs?.source}}};const C=["GlassToastProvider","GlassToastViewport"];export{o as GlassToastProvider,r as GlassToastViewport,C as __namedExportsOrder,z as default};
