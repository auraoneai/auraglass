import{j as e,r as l}from"./iframe-DFMMcocb.js";import{G as h,a as m,b as p,u as v,c as u}from"./GlassAchievementSystem-BqTd0FRN.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-Q0mX7KvA.js";import"./OptimizedGlassCore-1D6AE-uZ.js";import"./deviceCapabilities-iDxBLJQX.js";const S={title:"Effects + Advanced/Glass Achievement System",component:h,parameters:{layout:"fullscreen",previewSurface:"component",docs:{description:{component:"The real achievement exports, mounted individually with live provider state and deterministic Storybook content."}}},tags:["autodocs"]},c=({children:s})=>e.jsx("main",{style:{minHeight:"100vh",padding:"clamp(1.25rem, 5vw, 4rem)",color:"rgba(15, 23, 42, 0.92)",background:"radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.98), transparent 32%), linear-gradient(145deg, #ececec 0%, #fafafa 50%, #e2e2e2 100%)"},children:e.jsx("div",{style:{width:"min(100%, 58rem)",margin:"0 auto"},children:s})}),d=({eyebrow:s,title:r,children:t})=>e.jsxs("section",{className:"glass-surface-primary glass-blur-backdrop glass-border glass-border-white/20 glass-radius-2xl glass-p-6 glass-space-y-3",children:[e.jsx("p",{className:"glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide",children:s}),e.jsx("h2",{className:"glass-text-2xl glass-text-primary glass-font-semibold",children:r}),e.jsx("p",{className:"glass-text-sm glass-text-secondary",children:t??"Progress, unlocks, and rewards update through live context."})]});function g(){const{progress:s,notifications:r}=v();return e.jsxs(d,{eyebrow:"Live provider context",title:s?`Level ${s.level}`:"Calibrating progress",children:[s?.stats.totalInteractions??0," interactions and"," ",r.length," queued notifications."]})}function f(){const{progress:s,recordAction:r}=v(),t=l.useRef(!1);return l.useEffect(()=>{!s||t.current||(t.current=!0,r("click",{component:"storybook-achievement-preview"}))},[s,r]),e.jsxs(e.Fragment,{children:[e.jsx(d,{eyebrow:"Live notification",title:"Achievement unlocked",children:"The actual notification export is triggered from the achievement engine after its provider initializes."}),e.jsx(u,{position:"top-right"})]})}const n={name:"GlassAchievementSystem",render:()=>e.jsx(c,{children:e.jsx(h,{userId:`storybook-achievement-system-${Date.now()}`,showDashboard:!1,showNotifications:!1})})},a={name:"GlassAchievementProvider",render:()=>e.jsx(c,{children:e.jsx(m,{userId:`storybook-achievement-provider-${Date.now()}`,children:e.jsx(g,{})})})},o={name:"GlassAchievementDashboard",render:()=>e.jsxs(c,{children:[e.jsx(d,{eyebrow:"Achievement telemetry",title:"Progress dashboard",children:"The actual dashboard export is mounted below with live initialized progress."}),e.jsx(m,{userId:`storybook-achievement-dashboard-${Date.now()}`,children:e.jsx(p,{show:!0})})]})},i={name:"GlassAchievementNotifications",render:()=>e.jsx(c,{children:e.jsx(m,{userId:`storybook-achievement-notifications-${Date.now()}`,children:e.jsx(f,{})})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "GlassAchievementSystem",
  render: () => <Scene>
      <GlassAchievementSystemComponent userId={\`storybook-achievement-system-\${Date.now()}\`} showDashboard={false} showNotifications={false} />
    </Scene>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "GlassAchievementProvider",
  render: () => <Scene>
      <GlassAchievementProviderComponent userId={\`storybook-achievement-provider-\${Date.now()}\`}>
        <AchievementProviderConsumer />
      </GlassAchievementProviderComponent>
    </Scene>
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "GlassAchievementDashboard",
  render: () => <Scene>
      <DemoSurface eyebrow="Achievement telemetry" title="Progress dashboard">
        The actual dashboard export is mounted below with live initialized
        progress.
      </DemoSurface>
      <GlassAchievementProviderComponent userId={\`storybook-achievement-dashboard-\${Date.now()}\`}>
        <GlassAchievementDashboardComponent show />
      </GlassAchievementProviderComponent>
    </Scene>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "GlassAchievementNotifications",
  render: () => <Scene>
      <GlassAchievementProviderComponent userId={\`storybook-achievement-notifications-\${Date.now()}\`}>
        <NotificationTrigger />
      </GlassAchievementProviderComponent>
    </Scene>
}`,...i.parameters?.docs?.source}}};const j=["GlassAchievementSystem","GlassAchievementProvider","GlassAchievementDashboard","GlassAchievementNotifications"];export{o as GlassAchievementDashboard,i as GlassAchievementNotifications,a as GlassAchievementProvider,n as GlassAchievementSystem,j as __namedExportsOrder,S as default};
