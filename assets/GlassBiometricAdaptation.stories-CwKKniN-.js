import{j as e}from"./iframe-RsoZoStf.js";import{G as g,a as m,b as u,c as h,B as f,d as v}from"./GlassBiometricAdaptation-B9HDXiFX.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-WSL2JlLl.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";const D={title:"Effects + Advanced/Glass Biometric Adaptation",component:g,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"Actual public biometric-adaptation exports with hardware initialization disabled for deterministic, privacy-safe Storybook rendering."}}},tags:["autodocs"]},b={alignItems:"center",display:"flex",justifyContent:"center",minHeight:"min(760px, 100vh)",padding:"clamp(24px, 6vw, 72px)",width:"100%"},y={borderRadius:28,boxSizing:"border-box",maxWidth:680,padding:"clamp(20px, 5vw, 44px)",width:"min(100%, calc(100vw - 32px))"};function a({children:s}){return e.jsx("div",{style:b,children:s})}function c({eyebrow:s,title:t,description:x}){return e.jsxs("div",{className:"glass-space-y-3",style:{minWidth:0},children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary",children:s}),e.jsx("h2",{className:"glass-font-semibold glass-text-primary",style:{fontSize:"clamp(1.45rem, 7vw, 1.875rem)",overflowWrap:"anywhere"},children:t}),e.jsx("p",{className:"glass-text-base glass-leading-relaxed glass-text-secondary",children:x})]})}function p({children:s}){return e.jsx(m,{autoInitialize:!1,children:e.jsx("div",{className:"glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl",style:y,children:s})})}function w(){const t=new f({enableAudioAdaptation:!1,responseSpeed:800,sensitivity:.7}).getProfile();return e.jsxs(p,{children:[e.jsx(c,{eyebrow:"Runtime engine",title:"BiometricAdaptationEngine",description:"The exported engine is instantiated directly and exposes a local, uninitialized profile without requesting sensors or Bluetooth access."}),e.jsxs("dl",{className:"glass-mt-6 glass-grid glass-gap-3",style:{gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))"},children:[e.jsxs("div",{className:"glass-surface-subtle glass-radius-xl glass-p-4",children:[e.jsx("dt",{className:"glass-text-xs glass-text-tertiary",children:"Baseline pulse"}),e.jsxs("dd",{className:"glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary",children:[t.baselineHeartRate," bpm"]})]}),e.jsxs("div",{className:"glass-surface-subtle glass-radius-xl glass-p-4",children:[e.jsx("dt",{className:"glass-text-xs glass-text-tertiary",children:"Stored readings"}),e.jsx("dd",{className:"glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary",children:t.history.length})]})]})]})}function S(){const s=new v({enableAudioAdaptation:!1,sensitivity:.8});return e.jsxs(p,{children:[e.jsx(c,{eyebrow:"Signal interpreter",title:"BiometricStressDetector",description:"The exported detector is exercised before initialization, demonstrating its safe zero-signal baseline without attaching device listeners."}),e.jsxs("div",{className:"glass-mt-6 glass-grid glass-gap-3",style:{gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))"},children:[e.jsxs("div",{className:"glass-surface-subtle glass-radius-xl glass-p-4",children:[e.jsx("p",{className:"glass-text-xs glass-text-tertiary",children:"Stress level"}),e.jsxs("p",{className:"glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary",children:[Math.round(s.getStressLevel()*100),"%"]})]}),e.jsxs("div",{className:"glass-surface-subtle glass-radius-xl glass-p-4",children:[e.jsx("p",{className:"glass-text-xs glass-text-tertiary",children:"Confidence"}),e.jsxs("p",{className:"glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary",children:[Math.round(s.getConfidence()*100),"%"]})]})]})]})}const r={name:"GlassBiometricAdaptation",render:()=>e.jsx(a,{children:e.jsx("div",{className:"glass-w-full glass-max-w-2xl",children:e.jsx(g,{autoInitialize:!1,showDashboard:!1,settings:{enableAudioAdaptation:!1}})})})},i={name:"GlassBiometricAdaptationProvider",render:()=>e.jsx(a,{children:e.jsx(p,{children:e.jsx(c,{eyebrow:"Privacy-safe context",title:"Biometric provider ready",description:"The real provider is mounted with automatic hardware initialization disabled and supplies its stable baseline context to this surface."})})})},n={name:"GlassStressResponsive",render:()=>e.jsx(a,{children:e.jsx(m,{autoInitialize:!1,children:e.jsx(h,{adaptationType:"all","aria-label":"Stress-responsive planning surface",className:"glass-w-full glass-max-w-2xl glass-shadow-soft-xl",children:e.jsx("div",{className:"glass-p-8",children:e.jsx(c,{eyebrow:"Calm by default",title:"Stress-responsive workspace",description:"The actual adaptive wrapper starts from a neutral baseline and can respond when verified biometric readings become available."})})})})})},o={name:"GlassBiometricDashboard",render:()=>e.jsx(a,{children:e.jsx(m,{autoInitialize:!1,children:e.jsx("div",{className:"glass-relative glass-h-80 glass-w-full glass-max-w-2xl",children:e.jsx(u,{"aria-label":"Biometric monitoring dashboard preview",className:"glass-shadow-soft-xl"})})})})},l={name:"BiometricAdaptationEngine",render:()=>e.jsx(a,{children:e.jsx(w,{})})},d={name:"BiometricStressDetector",render:()=>e.jsx(a,{children:e.jsx(S,{})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "GlassBiometricAdaptation",
  render: () => <StoryFrame>
      <div className="glass-w-full glass-max-w-2xl">
        <GlassBiometricAdaptationComponent autoInitialize={false} showDashboard={false} settings={{
        enableAudioAdaptation: false
      }} />
      </div>
    </StoryFrame>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassBiometricAdaptationProvider",
  render: () => <StoryFrame>
      <ProviderSurface>
        <BiometricCopy eyebrow="Privacy-safe context" title="Biometric provider ready" description="The real provider is mounted with automatic hardware initialization disabled and supplies its stable baseline context to this surface." />
      </ProviderSurface>
    </StoryFrame>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "GlassStressResponsive",
  render: () => <StoryFrame>
      <GlassBiometricAdaptationProviderComponent autoInitialize={false}>
        <GlassStressResponsiveComponent adaptationType="all" aria-label="Stress-responsive planning surface" className="glass-w-full glass-max-w-2xl glass-shadow-soft-xl">
          <div className="glass-p-8">
            <BiometricCopy eyebrow="Calm by default" title="Stress-responsive workspace" description="The actual adaptive wrapper starts from a neutral baseline and can respond when verified biometric readings become available." />
          </div>
        </GlassStressResponsiveComponent>
      </GlassBiometricAdaptationProviderComponent>
    </StoryFrame>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "GlassBiometricDashboard",
  render: () => <StoryFrame>
      <GlassBiometricAdaptationProviderComponent autoInitialize={false}>
        <div className="glass-relative glass-h-80 glass-w-full glass-max-w-2xl">
          <GlassBiometricDashboardComponent aria-label="Biometric monitoring dashboard preview" className="glass-shadow-soft-xl" />
        </div>
      </GlassBiometricAdaptationProviderComponent>
    </StoryFrame>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "BiometricAdaptationEngine",
  render: () => <StoryFrame>
      <AdaptationEnginePreview />
    </StoryFrame>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "BiometricStressDetector",
  render: () => <StoryFrame>
      <StressDetectorPreview />
    </StoryFrame>
}`,...d.parameters?.docs?.source}}};const z=["GlassBiometricAdaptation","GlassBiometricAdaptationProvider","GlassStressResponsive","GlassBiometricDashboard","BiometricAdaptationEngine","BiometricStressDetector"];export{l as BiometricAdaptationEngine,d as BiometricStressDetector,r as GlassBiometricAdaptation,i as GlassBiometricAdaptationProvider,o as GlassBiometricDashboard,n as GlassStressResponsive,z as __namedExportsOrder,D as default};
