import{j as s}from"./iframe-CN7unHsM.js";import{G as g}from"./GlassGrid-C9jBfjNu.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-snjFlI8c.js";import"./MotionPreferenceContext-C4z2RG7B.js";const x={title:"Surfaces/App Shells + Layout/Glass Grid",component:g,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"Responsive CSS grid used in dashboard and panel layouts."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},c=[["Revenue","$128.4k","+12.8%"],["Pipeline","42 deals","+6"],["Latency","124ms","-18ms"],["Tickets","17 open","-9"]],e={render:t=>s.jsxs("section",{className:"glass-w-full glass-max-w-5xl glass-rounded-2xl glass-bg-white/60 glass-p-6 glass-shadow-xl",children:[s.jsxs("div",{className:"glass-mb-5 glass-flex glass-items-center glass-justify-between glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary",children:"Operations"}),s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Grid overview"})]}),s.jsx("span",{className:"glass-rounded-full glass-bg-blue-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-blue-700",children:"Live"})]}),s.jsx(g,{...t,cols:4,gap:"md",className:"glass-w-full",children:c.map(([a,r,i])=>s.jsxs("article",{className:"glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm",children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:a}),s.jsx("div",{className:"glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary",children:r}),s.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-green-700",children:i})]},a))})]}),args:{className:""}},l={render:t=>s.jsx("section",{className:"glass-w-full glass-max-w-5xl glass-space-y-4",children:s.jsx(g,{...t,autoFit:!0,minColWidth:"180px",gap:"lg",className:"glass-w-full",children:["Review queue","Health checks","Deployments","Incidents","Budgets","Owners"].map(a=>s.jsxs("div",{className:"glass-min-h-28 glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary",children:a}),s.jsx("p",{className:"glass-mt-2 glass-text-sm glass-text-secondary",children:"Compact content keeps the grid readable across viewport sizes."})]},a))})}),args:{className:""}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <section className="glass-w-full glass-max-w-5xl glass-rounded-2xl glass-bg-white/60 glass-p-6 glass-shadow-xl">
      <div className="glass-mb-5 glass-flex glass-items-center glass-justify-between glass-gap-4">
        <div>
          <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
            Operations
          </p>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
            Grid overview
          </h2>
        </div>
        <span className="glass-rounded-full glass-bg-blue-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-blue-700">
          Live
        </span>
      </div>
      <GlassGrid {...args} cols={4} gap="md" className="glass-w-full">
        {gridCards.map(([label, value, change]) => <article key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
            <p className="glass-text-sm glass-text-secondary">{label}</p>
            <div className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
              {value}
            </div>
            <p className="glass-mt-2 glass-text-sm glass-text-green-700">{change}</p>
          </article>)}
      </GlassGrid>
    </section>,
  args: {
    className: ''
  }
}`,...e.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <section className="glass-w-full glass-max-w-5xl glass-space-y-4">
      <GlassGrid {...args} autoFit minColWidth="180px" gap="lg" className="glass-w-full">
        {['Review queue', 'Health checks', 'Deployments', 'Incidents', 'Budgets', 'Owners'].map(label => <div key={label} className="glass-min-h-28 glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
            <h3 className="glass-text-sm glass-font-semibold glass-text-primary">{label}</h3>
            <p className="glass-mt-2 glass-text-sm glass-text-secondary">
              Compact content keeps the grid readable across viewport sizes.
            </p>
          </div>)}
      </GlassGrid>
    </section>,
  args: {
    className: ''
  }
}`,...l.parameters?.docs?.source}}};const u=["Default","Variants"];export{e as Default,l as Variants,u as __namedExportsOrder,x as default};
