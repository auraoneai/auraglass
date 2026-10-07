import{j as s}from"./iframe-Cqi-9gHA.js";import{G as g,a as y,b as o,c as f,d as x}from"./GlassEyeTracking-PHKeMwz0.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"Effects + Advanced/Glass Eye Tracking",component:g,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Actual public eye-tracking exports with camera initialization disabled for deterministic, privacy-safe Storybook rendering."}}},tags:["autodocs"]},h={alignItems:"center",display:"flex",justifyContent:"center",minHeight:"min(760px, 100vh)",padding:"clamp(24px, 6vw, 72px)",width:"100%"},c={borderRadius:28,maxWidth:680,padding:"clamp(24px, 5vw, 44px)",width:"100%"};function a({children:e}){return s.jsx("div",{style:h,children:e})}function d({eyebrow:e,title:p,description:u}){return s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary",children:e}),s.jsx("h2",{className:"glass-text-3xl glass-font-semibold glass-text-primary",children:p}),s.jsx("p",{className:"glass-text-base glass-leading-relaxed glass-text-secondary",children:u})]})}function m({children:e}){return s.jsx(o,{autoInitialize:!1,children:s.jsx("div",{className:"glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl",style:c,children:e})})}const r={name:"GlassEyeTracking",render:()=>s.jsx(a,{children:s.jsx("div",{className:"glass-w-full glass-max-w-2xl",children:s.jsx(g,{autoInitialize:!1,showCalibration:!0,showVisualization:!1})})})},i={name:"GlassEyeTrackingProvider",render:()=>s.jsx(a,{children:s.jsx(m,{children:s.jsx(d,{eyebrow:"Camera remains off",title:"Eye-tracking context ready",description:"The actual provider supplies a stable empty interaction state without requesting camera access or loading WebGazer."})})})},n={name:"GlassEyeTrackingCalibration",render:()=>s.jsx(a,{children:s.jsx(m,{children:s.jsx(y,{className:"glass-w-full"})})})},l={name:"GlassGazeResponsive",render:()=>s.jsx(a,{children:s.jsx(o,{autoInitialize:!1,children:s.jsx(f,{regionId:"story-gaze-focus-card",className:"glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl",children:s.jsx("div",{style:c,children:s.jsx(d,{eyebrow:"Registered gaze region",title:"Focus follows attention",description:"The actual responsive wrapper registers this panel as a gaze region while maintaining a neutral state before tracking begins."})})})})})},t={name:"GlassGazeVisualization",render:()=>s.jsx(a,{children:s.jsxs(o,{autoInitialize:!1,children:[s.jsxs("div",{className:"glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl",style:c,children:[s.jsx(d,{eyebrow:"Visualization layer mounted",title:"Gaze overlay standby",description:"The real fixed visualization overlay is active with an empty interaction collection, so no fabricated gaze markers are displayed."}),s.jsxs("div",{className:"glass-mt-6 glass-flex glass-items-center glass-gap-3",children:[s.jsx("span",{className:"glass-h-2 glass-w-2 glass-radius-full glass-surface-success","aria-hidden":!0}),s.jsx("span",{className:"glass-text-sm glass-text-secondary",children:"Waiting for verified gaze events"})]})]}),s.jsx(x,{show:!0})]})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "GlassEyeTracking",
  render: () => <StoryFrame>
      <div className="glass-w-full glass-max-w-2xl">
        <GlassEyeTrackingComponent autoInitialize={false} showCalibration showVisualization={false} />
      </div>
    </StoryFrame>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassEyeTrackingProvider",
  render: () => <StoryFrame>
      <ProviderPanel>
        <EyeTrackingCopy eyebrow="Camera remains off" title="Eye-tracking context ready" description="The actual provider supplies a stable empty interaction state without requesting camera access or loading WebGazer." />
      </ProviderPanel>
    </StoryFrame>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "GlassEyeTrackingCalibration",
  render: () => <StoryFrame>
      <ProviderPanel>
        <GlassEyeTrackingCalibrationComponent className="glass-w-full" />
      </ProviderPanel>
    </StoryFrame>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "GlassGazeResponsive",
  render: () => <StoryFrame>
      <GlassEyeTrackingProviderComponent autoInitialize={false}>
        <GlassGazeResponsiveComponent regionId="story-gaze-focus-card" className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl">
          <div style={panelStyle}>
            <EyeTrackingCopy eyebrow="Registered gaze region" title="Focus follows attention" description="The actual responsive wrapper registers this panel as a gaze region while maintaining a neutral state before tracking begins." />
          </div>
        </GlassGazeResponsiveComponent>
      </GlassEyeTrackingProviderComponent>
    </StoryFrame>
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "GlassGazeVisualization",
  render: () => <StoryFrame>
      <GlassEyeTrackingProviderComponent autoInitialize={false}>
        <div className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl" style={panelStyle}>
          <EyeTrackingCopy eyebrow="Visualization layer mounted" title="Gaze overlay standby" description="The real fixed visualization overlay is active with an empty interaction collection, so no fabricated gaze markers are displayed." />
          <div className="glass-mt-6 glass-flex glass-items-center glass-gap-3">
            <span className="glass-h-2 glass-w-2 glass-radius-full glass-surface-success" aria-hidden />
            <span className="glass-text-sm glass-text-secondary">
              Waiting for verified gaze events
            </span>
          </div>
        </div>
        <GlassGazeVisualizationComponent show />
      </GlassEyeTrackingProviderComponent>
    </StoryFrame>
}`,...t.parameters?.docs?.source}}};const z=["GlassEyeTracking","GlassEyeTrackingProvider","GlassEyeTrackingCalibration","GlassGazeResponsive","GlassGazeVisualization"];export{r as GlassEyeTracking,n as GlassEyeTrackingCalibration,i as GlassEyeTrackingProvider,l as GlassGazeResponsive,t as GlassGazeVisualization,z as __namedExportsOrder,w as default};
