import{j as e}from"./iframe-BGoRE5Do.js";import{G as d}from"./GlassCore-CbkFJRZB.js";import"./preload-helper-PPVm8Dsz.js";const u={title:"Foundations/Liquid Glass Primitives/Glass Core",component:d,parameters:{layout:"centered",docs:{description:{component:"The core glass morphism component that provides the foundation for all glass effects in the design system."}}},argTypes:{intent:{control:{type:"select"},options:["neutral","primary","success","warning","danger","info"],description:"Glass semantic intent that affects color theming"},elevation:{control:{type:"select"},options:["level1","level2","level3","level4"],description:"Glass elevation level affecting shadow and blur intensity"},tier:{control:{type:"select"},options:["low","medium","high","ultra"],description:"Performance quality tier for rendering optimization"},radius:{control:{type:"select"},options:["none","sm","md","lg","xl","full"],description:"Border radius of the glass surface"},interactive:{control:"boolean",description:"Enable interactive states (hover, focus, active)"},hoverLift:{control:"boolean",description:"Enable hover lift effect"},focusRing:{control:"boolean",description:"Enable focus ring for accessibility"},press:{control:"boolean",description:"Enable press effect for interactive feedback"}},args:{intent:"neutral",elevation:"level2",tier:"high",radius:"md",interactive:!1,hoverLift:!1,focusRing:!1,press:!1}},r={args:{children:e.jsxs("div",{className:"p-6 text-center",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Default Glass Surface"}),e.jsx("p",{className:"text-sm opacity-80",children:"This is the default glass morphism effect."})]})}},a={render:t=>e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl",children:["neutral","primary","success","warning","danger","info"].map(s=>e.jsx(d,{...t,intent:s,children:e.jsxs("div",{className:"p-4 text-center",children:[e.jsx("h4",{className:"text-sm font-medium capitalize mb-1",children:s}),e.jsx("p",{className:"text-xs opacity-70",children:"Intent"})]})},s))}),args:{children:null}},i={render:t=>e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl",children:["level1","level2","level3","level4"].map(s=>e.jsx(d,{...t,elevation:s,children:e.jsxs("div",{className:"p-4 text-center",children:[e.jsx("h4",{className:"text-sm font-medium capitalize mb-1",children:s}),e.jsx("p",{className:"text-xs opacity-70",children:"Elevation"})]})},s))}),args:{children:null}},l={args:{interactive:!0,hoverLift:!0,focusRing:!0,press:!0,children:e.jsxs("div",{className:"p-6 text-center",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Interactive Glass"}),e.jsx("p",{className:"text-sm opacity-80",children:"Glass surface with interactive effects."})]})}},n={args:{hoverLift:!0,children:e.jsxs("div",{className:"p-6 text-center cursor-pointer",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Hover Lift Effect"}),e.jsx("p",{className:"text-sm opacity-80",children:"Hover over this surface to see the lift effect."})]})}},c={render:t=>e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl",children:["none","sm","md","lg","xl","full"].map(s=>e.jsx(d,{...t,radius:s,children:e.jsxs("div",{className:"p-4 text-center",children:[e.jsx("h4",{className:"text-sm font-medium capitalize mb-1",children:s}),e.jsx("p",{className:"text-xs opacity-70",children:"Radius"})]})},s))}),args:{children:null}},o={args:{intent:"primary",elevation:"level3",interactive:!0,hoverLift:!0,children:e.jsxs("div",{className:"p-8 text-center",children:[e.jsx("div",{className:"w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})})}),e.jsx("h3",{className:"text-xl font-bold mb-2",children:"Premium Glass Effect"}),e.jsx("p",{className:"text-sm opacity-80 mb-4",children:"This showcases the full capabilities of our glass morphism system with crystal variant, heavy blur, purple glow, and hover effects."}),e.jsxs("div",{className:"flex justify-center space-x-2",children:[e.jsx("span",{className:"px-3 py-1 bg-white/20 rounded-full text-xs",children:"Interactive"}),e.jsx("span",{className:"px-3 py-1 bg-white/20 rounded-full text-xs",children:"Responsive"}),e.jsx("span",{className:"px-3 py-1 bg-white/20 rounded-full text-xs",children:"Accessible"})]})]})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Default Glass Surface</h3>
        <p className="text-sm opacity-80">This is the default glass morphism effect.</p>
      </div>
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const).map(intent => <GlassCore key={intent} {...args} intent={intent}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{intent}</h4>
            <p className="text-xs opacity-70">Intent</p>
          </div>
        </GlassCore>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['level1', 'level2', 'level3', 'level4'] as const).map(elevation => <GlassCore key={elevation} {...args} elevation={elevation}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{elevation}</h4>
            <p className="text-xs opacity-70">Elevation</p>
          </div>
        </GlassCore>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    interactive: true,
    hoverLift: true,
    focusRing: true,
    press: true,
    children: <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Interactive Glass</h3>
        <p className="text-sm opacity-80">Glass surface with interactive effects.</p>
      </div>
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    hoverLift: true,
    children: <div className="p-6 text-center cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">Hover Lift Effect</h3>
        <p className="text-sm opacity-80">Hover over this surface to see the lift effect.</p>
      </div>
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map(radius => <GlassCore key={radius} {...args} radius={radius}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{radius}</h4>
            <p className="text-xs opacity-70">Radius</p>
          </div>
        </GlassCore>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    intent: 'primary',
    elevation: 'level3',
    interactive: true,
    hoverLift: true,
    children: <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Premium Glass Effect</h3>
        <p className="text-sm opacity-80 mb-4">
          This showcases the full capabilities of our glass morphism system with crystal variant,
          heavy blur, purple glow, and hover effects.
        </p>
        <div className="flex justify-center space-x-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Interactive</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Responsive</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Accessible</span>
        </div>
      </div>
  }
}`,...o.parameters?.docs?.source}}};const x=["Default","Intents","Elevations","Interactive","HoverLift","DifferentBorderRadii","ContentShowcase"];export{o as ContentShowcase,r as Default,c as DifferentBorderRadii,i as Elevations,n as HoverLift,a as Intents,l as Interactive,x as __namedExportsOrder,u as default};
