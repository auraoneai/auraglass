import{j as e}from"./iframe-RsoZoStf.js";import{O as d,C as u,E as h,G as x,I as y}from"./OrganicAnimationEngine-CDjqZdLr.js";import"./preload-helper-PPVm8Dsz.js";import"./use-animation-D1HPY59W.js";import"./use-spring-D_EG1I68.js";import"./use-motion-value-aOYkBdRR.js";const j={title:"Foundations/Motion/Organic Animation Engine",component:d,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Direct coverage for OrganicAnimationEngine and its four specialized public animation exports using fixed motion settings and neutral liquid-glass content."}}},tags:["autodocs"],args:{children:null}},b={alignItems:"center",background:"radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.98), transparent 35%), radial-gradient(circle at 80% 78%, rgba(255, 255, 255, 0.42), transparent 32%), linear-gradient(145deg, #f4f4f3 0%, #fafafa 52%, #e7e7e5 100%)",boxSizing:"border-box",display:"flex",justifyContent:"center",minHeight:"100dvh",padding:"clamp(20px, 5vw, 64px)",width:"100%"},n={enableAdaptiveSpeed:!1,enableMicroInteractions:!1,enablePhysics:!1,performanceLevel:"low",showDebugHud:!1};function t({children:m}){return e.jsx("main",{"data-bg":"light",style:b,children:e.jsx("div",{style:{minWidth:0,width:"min(100%, 680px)"},children:m})})}function i({eyebrow:m,title:p,description:g}){return e.jsxs("article",{className:"glass-p-8 glass-space-y-4",children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary",children:m}),e.jsx("h2",{className:"glass-text-3xl glass-font-semibold glass-text-primary",children:p}),e.jsx("p",{className:"glass-text-base glass-leading-relaxed glass-text-secondary",children:g})]})}const a="glass-foundation-complete glass-bg-black/20 glass-w-full glass-radius-2xl glass-shadow-soft-xl",o={name:"OrganicAnimationEngine",render:()=>e.jsx(t,{children:e.jsx(d,{...n,emotionalContext:"calm",sequences:[],className:a,children:e.jsx(i,{eyebrow:"Deterministic baseline",title:"Organic motion, held at rest",description:"The public engine is mounted directly with its physics and interaction channels disabled so material geometry can be inspected consistently at every viewport."})})})},s={name:"GentleAnimation",render:()=>e.jsx(t,{children:e.jsx(x,{...n,emotionalContext:"calm",className:a,children:e.jsx(i,{eyebrow:"Gentle sequence",title:"A quiet breathing rhythm",description:"The specialized gentle export applies its predefined calm sequence to the same bounded, neutral liquid-glass surface."})})})},r={name:"EnergeticAnimation",render:()=>e.jsx(t,{children:e.jsx(h,{...n,emotionalContext:"energetic",className:a,children:e.jsx(i,{eyebrow:"Energetic sequence",title:"Responsive motion with restraint",description:"The energetic public export is rendered without pointer-driven physics, keeping its authored sequence isolated and reviewable."})})})},c={name:"InteractiveAnimation",render:()=>e.jsx(t,{children:e.jsx(y,{...n,emotionalContext:"focused",className:a,children:e.jsx(i,{eyebrow:"Interaction sequence",title:"Focused by design",description:"The real interactive wrapper remains mounted while hover, click, and physics responses are intentionally disabled for a stable baseline."})})})},l={name:"ContemplativeAnimation",render:()=>e.jsx(t,{children:e.jsx(u,{...n,emotionalContext:"contemplative",className:a,children:e.jsx(i,{eyebrow:"Contemplative sequence",title:"Slow movement, clear hierarchy",description:"The contemplative public export uses its authored drift sequence over a responsive surface with no decorative color contamination."})})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "OrganicAnimationEngine",
  render: () => <StoryFrame>
      <OrganicAnimationEngineComponent {...deterministicMotionProps} emotionalContext="calm" sequences={[]} className={engineClassName}>
        <MotionSpecimen eyebrow="Deterministic baseline" title="Organic motion, held at rest" description="The public engine is mounted directly with its physics and interaction channels disabled so material geometry can be inspected consistently at every viewport." />
      </OrganicAnimationEngineComponent>
    </StoryFrame>
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "GentleAnimation",
  render: () => <StoryFrame>
      <GentleAnimationComponent {...deterministicMotionProps} emotionalContext="calm" className={engineClassName}>
        <MotionSpecimen eyebrow="Gentle sequence" title="A quiet breathing rhythm" description="The specialized gentle export applies its predefined calm sequence to the same bounded, neutral liquid-glass surface." />
      </GentleAnimationComponent>
    </StoryFrame>
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "EnergeticAnimation",
  render: () => <StoryFrame>
      <EnergeticAnimationComponent {...deterministicMotionProps} emotionalContext="energetic" className={engineClassName}>
        <MotionSpecimen eyebrow="Energetic sequence" title="Responsive motion with restraint" description="The energetic public export is rendered without pointer-driven physics, keeping its authored sequence isolated and reviewable." />
      </EnergeticAnimationComponent>
    </StoryFrame>
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "InteractiveAnimation",
  render: () => <StoryFrame>
      <InteractiveAnimationComponent {...deterministicMotionProps} emotionalContext="focused" className={engineClassName}>
        <MotionSpecimen eyebrow="Interaction sequence" title="Focused by design" description="The real interactive wrapper remains mounted while hover, click, and physics responses are intentionally disabled for a stable baseline." />
      </InteractiveAnimationComponent>
    </StoryFrame>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "ContemplativeAnimation",
  render: () => <StoryFrame>
      <ContemplativeAnimationComponent {...deterministicMotionProps} emotionalContext="contemplative" className={engineClassName}>
        <MotionSpecimen eyebrow="Contemplative sequence" title="Slow movement, clear hierarchy" description="The contemplative public export uses its authored drift sequence over a responsive surface with no decorative color contamination." />
      </ContemplativeAnimationComponent>
    </StoryFrame>
}`,...l.parameters?.docs?.source}}};const q=["OrganicAnimationEngine","GentleAnimation","EnergeticAnimation","InteractiveAnimation","ContemplativeAnimation"];export{l as ContemplativeAnimation,r as EnergeticAnimation,s as GentleAnimation,c as InteractiveAnimation,o as OrganicAnimationEngine,q as __namedExportsOrder,j as default};
