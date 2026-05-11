import{j as s}from"./iframe-CCVHZjui.js";import{G as t}from"./GlassAppShell-Desb8qVt.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassContainer-DFrH4gM0.js";import"./LiquidGlassMaterial-CE3NhfG1.js";import"./LiquidGlassLayerProvider-C8_KLYLy.js";import"./GlassAchievementSystem-Dn_4VNrl.js";import"./a11y-DYpJNAyD.js";import"./OptimizedGlassCore-D_hfAzIe.js";import"./deviceCapabilities-WGQt4yIJ.js";import"./GlassBiometricAdaptation-DQDXImLm.js";import"./MotionPreferenceContext-CryyGTeI.js";import"./GlassEyeTracking-Bw6bKOhQ.js";import"./GlassPredictiveEngine-BnvkiC0B.js";import"./GlassSpatialAudio-DmhcDjFY.js";import"./GlassStack-oSOXFEJV.js";import"./MotionFramer-D3JMoYt9.js";import"./utilsCore-CP_vVdbb.js";const O={title:"Surfaces/App Shells + Layout/Glass App Shell",component:t,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Application shell framed as a compact product dashboard."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},r=s.jsxs("header",{className:"glass-flex glass-items-center glass-justify-between glass-border-b glass-border-white/25 glass-bg-white/65 glass-px-5 glass-py-3",children:[s.jsxs("div",{children:[s.jsx("div",{className:"glass-text-sm glass-font-semibold glass-text-primary",children:"Aura Ops"}),s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:"North America workspace"})]}),s.jsx("button",{className:"glass-rounded-lg glass-bg-blue-600 glass-px-3 glass-py-2 glass-text-sm glass-font-medium glass-text-white",children:"New report"})]}),m=s.jsx("nav",{className:"glass-flex glass-h-full glass-w-56 glass-flex-col glass-gap-2 glass-border-r glass-border-white/25 glass-bg-white/55 glass-p-4",children:["Overview","Pipelines","Customers","Settings"].map((l,a)=>s.jsx("a",{href:"#",className:["glass-rounded-lg glass-px-3 glass-py-2 glass-text-sm glass-font-medium",a===0?"glass-bg-blue-100 glass-text-blue-800":"glass-text-secondary"].join(" "),children:l},l))}),e={render:l=>s.jsx("div",{className:"glass-flex glass-min-h-screen glass-w-full glass-items-center glass-justify-center glass-p-6",children:s.jsx(t,{...l,header:r,sidebar:m,padding:"lg",maxWidth:"full",className:"glass-h-[640px] glass-w-full glass-max-w-6xl glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/35 glass-bg-white/45 glass-shadow-2xl",children:s.jsxs("section",{className:"glass-space-y-5",children:[s.jsxs("div",{children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Today"}),s.jsx("h1",{className:"glass-text-2xl glass-font-semibold glass-text-primary",children:"Service dashboard"})]}),s.jsx("div",{className:"glass-grid glass-grid-cols-3 glass-gap-4",children:[["SLA","99.98%","On target"],["Deploys","12","3 pending"],["Alerts","4","2 assigned"]].map(([a,i,d])=>s.jsxs("article",{className:"glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm",children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:a}),s.jsx("div",{className:"glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary",children:i}),s.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-secondary",children:d})]},a))}),s.jsxs("div",{className:"glass-rounded-xl glass-bg-white/70 glass-p-5 glass-shadow-sm",children:[s.jsx("h2",{className:"glass-text-base glass-font-semibold glass-text-primary",children:"Active work"}),s.jsx("div",{className:"glass-mt-4 glass-space-y-3",children:["Billing migration","Search latency review","Partner sync"].map(a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-rounded-lg glass-bg-white/60 glass-p-3",children:[s.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:a}),s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:"In progress"})]},a))})]})]})})}),args:{className:""}},g={render:l=>s.jsx("div",{className:"glass-grid glass-min-h-screen glass-w-full glass-place-items-center glass-p-6",children:s.jsx(t,{...l,variant:"floating",header:r,padding:"md",className:"glass-h-[520px] glass-w-full glass-max-w-4xl glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/35 glass-bg-white/50 glass-shadow-xl",children:s.jsx("div",{className:"glass-grid glass-grid-cols-2 glass-gap-4",children:["Floating shell","Minimal content"].map(a=>s.jsxs("div",{className:"glass-rounded-xl glass-bg-white/70 glass-p-5",children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary",children:a}),s.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-secondary",children:"The shell owns page chrome while story content stays inside the viewport."})]},a))})})}),args:{className:""}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-min-h-screen glass-w-full glass-items-center glass-justify-center glass-p-6">
      <GlassAppShell {...args} header={shellHeader} sidebar={shellSidebar} padding="lg" maxWidth="full" className="glass-h-[640px] glass-w-full glass-max-w-6xl glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/35 glass-bg-white/45 glass-shadow-2xl">
        <section className="glass-space-y-5">
          <div>
            <p className="glass-text-sm glass-text-secondary">Today</p>
            <h1 className="glass-text-2xl glass-font-semibold glass-text-primary">
              Service dashboard
            </h1>
          </div>
          <div className="glass-grid glass-grid-cols-3 glass-gap-4">
            {[['SLA', '99.98%', 'On target'], ['Deploys', '12', '3 pending'], ['Alerts', '4', '2 assigned']].map(([label, value, note]) => <article key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
                <p className="glass-text-sm glass-text-secondary">{label}</p>
                <div className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">{value}</div>
                <p className="glass-mt-2 glass-text-sm glass-text-secondary">{note}</p>
              </article>)}
          </div>
          <div className="glass-rounded-xl glass-bg-white/70 glass-p-5 glass-shadow-sm">
            <h2 className="glass-text-base glass-font-semibold glass-text-primary">Active work</h2>
            <div className="glass-mt-4 glass-space-y-3">
              {['Billing migration', 'Search latency review', 'Partner sync'].map(item => <div key={item} className="glass-flex glass-items-center glass-justify-between glass-rounded-lg glass-bg-white/60 glass-p-3">
                  <span className="glass-text-sm glass-font-medium glass-text-primary">{item}</span>
                  <span className="glass-text-xs glass-text-secondary">In progress</span>
                </div>)}
            </div>
          </div>
        </section>
      </GlassAppShell>
    </div>,
  args: {
    className: ''
  }
}`,...e.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-grid glass-min-h-screen glass-w-full glass-place-items-center glass-p-6">
      <GlassAppShell {...args} variant="floating" header={shellHeader} padding="md" className="glass-h-[520px] glass-w-full glass-max-w-4xl glass-overflow-hidden glass-rounded-2xl glass-border glass-border-white/35 glass-bg-white/50 glass-shadow-xl">
        <div className="glass-grid glass-grid-cols-2 glass-gap-4">
          {['Floating shell', 'Minimal content'].map(label => <div key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-5">
              <h3 className="glass-text-base glass-font-semibold glass-text-primary">{label}</h3>
              <p className="glass-mt-2 glass-text-sm glass-text-secondary">
                The shell owns page chrome while story content stays inside the viewport.
              </p>
            </div>)}
        </div>
      </GlassAppShell>
    </div>,
  args: {
    className: ''
  }
}`,...g.parameters?.docs?.source}}};const T=["Default","Variants"];export{e as Default,g as Variants,T as __namedExportsOrder,O as default};
