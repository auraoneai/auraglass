import{R as h,j as e,c as y}from"./iframe-FdJLCixk.js";import{O as N}from"./OptimizedGlassCore-DXYTmyU1.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-B5v4J8AJ.js";const l=h.forwardRef(({className:a,elevation:s="level1",variant:m="default",interactive:u=!1,padding:n="md",children:p,...v},x)=>{const f=()=>{switch(m){case"primary":return"primary";case"success":return"success";case"warning":return"warning";case"error":return"danger";default:return"neutral"}};return e.jsx(N,{"data-glass-component":!0,ref:x,elevation:s,intent:f(),interactive:u,className:y("relative overflow-hidden transition-all duration-200",n==="none"?"glass-p-0":n==="sm"?"glass-p-2":n==="md"?"glass-p-4":n==="lg"?"glass-p-6":n==="xl"?"p-8":"glass-p-4",a),...v,children:p})});l.displayName="GlassPanel";try{l.displayName="GlassPanel",l.__docgenInfo={description:`GlassPanel component
A glassmorphism panel using the proper PerformantGlass primitive`,displayName:"GlassPanel",props:{variant:{defaultValue:{value:"default"},description:"Panel variant style",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"error"'}]}},elevation:{defaultValue:{value:"level1"},description:"Panel elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},interactive:{defaultValue:{value:"false"},description:"Whether the panel is interactive",name:"interactive",required:!1,type:{name:"boolean | undefined"}},padding:{defaultValue:{value:"md"},description:"Panel padding",name:"padding",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},children:{defaultValue:null,description:"Panel content",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:null,description:"Custom CSS classes",name:"className",required:!1,type:{name:"string | undefined"}},as:{defaultValue:null,description:"The HTML element or component to render as",name:"as",required:!1,type:{name:"ElementType<any, keyof IntrinsicElements> | undefined"}},border:{defaultValue:null,description:"Border configuration",name:"border",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"none"'},{value:'"medium"'},{value:'"glow"'},{value:'"subtle"'},{value:'"gradient"'},{value:'"neon"'},{value:'"dynamic"'},{value:'"particle"'}]}},animation:{defaultValue:null,description:"Animation preset",name:"animation",required:!1,type:{name:"string | undefined"}},tint:{defaultValue:null,description:"Glass tint color",name:"tint",required:!1,type:{name:"string | undefined"}},intent:{defaultValue:null,description:"Glass intent (replaces variant)",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"neutral"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"info"'}]}},tier:{defaultValue:null,description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}},rounded:{defaultValue:null,description:"Border radius",name:"rounded",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'},{value:'"full"'}]}},glow:{defaultValue:null,description:"Enable glow effect",name:"glow",required:!1,type:{name:"boolean | undefined"}},glowColor:{defaultValue:null,description:"Glow color",name:"glowColor",required:!1,type:{name:"string | undefined"}},glowIntensity:{defaultValue:null,description:"Glow intensity",name:"glowIntensity",required:!1,type:{name:"number | undefined"}},hover:{defaultValue:null,description:"Enable hover effects",name:"hover",required:!1,type:{name:"boolean | undefined"}},optimization:{defaultValue:null,description:"Performance optimization level",name:"optimization",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}},hardwareAcceleration:{defaultValue:null,description:"Enable hardware acceleration",name:"hardwareAcceleration",required:!1,type:{name:"boolean | undefined"}},intensity:{defaultValue:null,description:"Glass intensity (blur strength level)",name:"intensity",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"medium"'},{value:'"ultra"'},{value:'"subtle"'},{value:'"intense"'},{value:'"extreme"'}]}},depth:{defaultValue:null,description:"Glass depth effect",name:"depth",required:!1,type:{name:'number | "medium" | "extreme" | "shallow" | "deep" | undefined'}},blur:{defaultValue:null,description:"Blur intensity for backdrop-filter",name:"blur",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"strong"'},{value:'"none"'},{value:'"medium"'},{value:'"subtle"'},{value:'"intense"'}]}},press:{defaultValue:null,description:"Enable press effect",name:"press",required:!1,type:{name:"boolean | undefined"}},performanceMode:{defaultValue:null,description:"Performance mode",name:"performanceMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"ultra"'},{value:'"high"'},{value:'"low"'},{value:'"balanced"'}]}},liftOnHover:{defaultValue:null,description:"Enable lift on hover effect",name:"liftOnHover",required:!1,type:{name:"boolean | undefined"}},hoverSheen:{defaultValue:null,description:"Enable hover sheen effect",name:"hoverSheen",required:!1,type:{name:"boolean | undefined"}},lighting:{defaultValue:null,description:"Lighting effect",name:"lighting",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"none"'},{value:'"ambient"'},{value:'"directional"'},{value:'"point"'},{value:'"spot"'},{value:'"iridescent"'},{value:'"volumetric"'},{value:'"caustic"'},{value:'"natural"'},{value:'"studio"'}]}},caustics:{defaultValue:null,description:"Advanced visual flags (filtered from DOM)",name:"caustics",required:!1,type:{name:"boolean | undefined"}},chromatic:{defaultValue:null,description:"",name:"chromatic",required:!1,type:{name:"boolean | undefined"}},parallax:{defaultValue:null,description:"",name:"parallax",required:!1,type:{name:"boolean | undefined"}},refraction:{defaultValue:null,description:"",name:"refraction",required:!1,type:{name:"boolean | undefined"}},adaptive:{defaultValue:null,description:"",name:"adaptive",required:!1,type:{name:"boolean | undefined"}},magnet:{defaultValue:null,description:"",name:"magnet",required:!1,type:{name:"boolean | undefined"}},cursorHighlight:{defaultValue:null,description:"",name:"cursorHighlight",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const V={title:"Controls/Inputs/glass panel",component:l,parameters:{layout:"centered",docs:{description:{component:"A versatile glass morphism panel component for organizing content with various styles and elevations."}}},argTypes:{variant:{control:{type:"select"},options:["default","primary","success","warning","error"],description:"Panel variant style"},elevation:{control:{type:"select"},options:["level1","level2","level3","level4"],description:"Panel elevation level"},padding:{control:{type:"select"},options:["none","sm","md","lg","xl"],description:"Panel padding"},interactive:{control:"boolean",description:"Whether the panel is interactive"}},args:{variant:"default",elevation:"level1",padding:"md",interactive:!1}},t={args:{elevation:"level3",style:{width:"min(260px, calc(100vw - 32px))",color:"#0f172a",background:"rgba(255, 255, 255, 0.86)"},children:e.jsxs("div",{className:"glass-text-center",style:{color:"#0f172a"},children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Default Panel"}),e.jsx("p",{className:"glass-text-sm",style:{color:"#334155"},children:"This is a standard glass panel."})]})}},i={render:a=>e.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 max-w-6xl",children:["default","primary","success","warning","error"].map(s=>e.jsx(l,{...a,variant:s,children:e.jsxs("div",{className:"glass-text-center",children:[e.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-capitalize glass-mb-2",children:[s," Panel"]}),e.jsxs("p",{className:"glass-text-xs opacity-70",children:["This is a ",s," variant panel."]})]})},s))}),args:{children:null}},r={render:a=>e.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 max-w-5xl",children:["level1","level2","level3","level4"].map(s=>e.jsx(l,{...a,elevation:s,children:e.jsxs("div",{className:"glass-text-center",children:[e.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-mb-2 glass-capitalize",children:[s," Elevation"]}),e.jsxs("p",{className:"glass-text-xs opacity-70",children:["Panel with ",s," elevation."]})]})},s))}),args:{children:null}},d={render:a=>e.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 max-w-4xl",children:["none","sm","md","lg","xl"].map(s=>e.jsx(l,{...a,padding:s,children:e.jsxs("div",{className:"glass-text-center",children:[e.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-mb-2 glass-capitalize",children:[s," Padding"]}),e.jsxs("p",{className:"glass-text-xs opacity-70",children:["Panel with ",s," padding."]}),s==="none"&&e.jsx("p",{className:"glass-text-xs opacity-60 glass-mt-1",children:"No padding applied"})]})},s))}),args:{children:null}},c={args:{interactive:!0,children:e.jsxs("div",{className:"glass-text-center glass-cursor-pointer",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Interactive Panel"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Hover over this panel to see the interactive effects."}),e.jsx("div",{className:"glass-mt-4 glass-text-xs opacity-60",children:"Click me!"})]})}},o={args:{variant:"primary",elevation:"level3",padding:"lg",children:e.jsxs("div",{className:"glass-auto-gap glass-auto-gap-lg",children:[e.jsxs("div",{className:"glass-text-center",children:[e.jsx("h3",{className:"glass-text-xl glass-font-bold glass-mb-2",children:"Premium Panel"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"This panel showcases the full capabilities of the GlassPanel component with primary variant, high elevation, and generous padding."})]}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-4 mt-6",children:[e.jsxs("div",{className:"glass-text-center glass-p-3 glass-surface-subtle/10 glass-radius-lg",children:[e.jsx("div",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:"42"}),e.jsx("div",{className:"glass-text-xs opacity-70",children:"Active Users"})]}),e.jsxs("div",{className:"glass-text-center glass-p-3 glass-surface-subtle/10 glass-radius-lg",children:[e.jsx("div",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:"89%"}),e.jsx("div",{className:"glass-text-xs opacity-70",children:"Completion Rate"})]})]}),e.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-2 pt-2",children:[e.jsx("span",{className:"glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs",children:"Responsive"}),e.jsx("span",{className:"glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs",children:"Interactive"}),e.jsx("span",{className:"glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs",children:"Accessible"})]})]})}},g={render:a=>e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 max-w-7xl",children:[e.jsx(l,{...a,variant:"primary",elevation:"level2",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"📊"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Analytics"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"View detailed analytics and insights"})]})}),e.jsx(l,{...a,variant:"success",elevation:"level2",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"💰"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Revenue"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Track financial performance"})]})}),e.jsx(l,{...a,variant:"warning",elevation:"level2",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"👥"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Users"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Manage user accounts and permissions"})]})}),e.jsx(l,{...a,variant:"error",elevation:"level1",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"⚠️"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Alerts"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Monitor system alerts and notifications"})]})}),e.jsx(l,{...a,variant:"default",elevation:"level1",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"🔧"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Settings"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Configure system preferences"})]})}),e.jsx(l,{...a,variant:"primary",elevation:"level1",children:e.jsxs("div",{className:"glass-text-center",children:[e.jsx("div",{className:"glass-text-3xl glass-mb-2",children:"📈"}),e.jsx("h4",{className:"glass-text-lg glass-font-semibold glass-mb-1",children:"Reports"}),e.jsx("p",{className:"glass-text-sm opacity-80",children:"Generate and view reports"})]})})]}),args:{children:null}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    elevation: 'level3',
    style: {
      width: 'min(260px, calc(100vw - 32px))',
      color: '#0f172a',
      background: 'rgba(255, 255, 255, 0.86)'
    },
    children: <div className="glass-text-center" style={{
      color: '#0f172a'
    }}>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">
          Default Panel
        </h3>
        <p className="glass-text-sm" style={{
        color: '#334155'
      }}>
          This is a standard glass panel.
        </p>
      </div>
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 max-w-6xl">
      {(['default', 'primary', 'success', 'warning', 'error'] as const).map(variant => <GlassPanel key={variant} {...args} variant={variant}>
          <div className="glass-text-center">
            <h4 className="glass-text-sm glass-font-medium glass-capitalize glass-mb-2">{variant} Panel</h4>
            <p className="glass-text-xs opacity-70">This is a {variant} variant panel.</p>
          </div>
        </GlassPanel>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 max-w-5xl">
      {(['level1', 'level2', 'level3', 'level4'] as const).map(elevation => <GlassPanel key={elevation} {...args} elevation={elevation}>
          <div className="glass-text-center">
            <h4 className="glass-text-sm glass-font-medium glass-mb-2 glass-capitalize">{elevation} Elevation</h4>
            <p className="glass-text-xs opacity-70">Panel with {elevation} elevation.</p>
          </div>
        </GlassPanel>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...r.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 max-w-4xl">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map(padding => <GlassPanel key={padding} {...args} padding={padding}>
          <div className="glass-text-center">
            <h4 className="glass-text-sm glass-font-medium glass-mb-2 glass-capitalize">{padding} Padding</h4>
            <p className="glass-text-xs opacity-70">Panel with {padding} padding.</p>
            {padding === 'none' && <p className="glass-text-xs opacity-60 glass-mt-1">No padding applied</p>}
          </div>
        </GlassPanel>)}
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    interactive: true,
    children: <div className="glass-text-center glass-cursor-pointer">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Interactive Panel</h3>
        <p className="glass-text-sm opacity-80">Hover over this panel to see the interactive effects.</p>
        <div className="glass-mt-4 glass-text-xs opacity-60">Click me!</div>
      </div>
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    elevation: 'level3',
    padding: 'lg',
    children: <div className="glass-auto-gap glass-auto-gap-lg">
        <div className="glass-text-center">
          <h3 className="glass-text-xl glass-font-bold glass-mb-2">Premium Panel</h3>
          <p className="glass-text-sm opacity-80">
            This panel showcases the full capabilities of the GlassPanel component
            with primary variant, high elevation, and generous padding.
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-2 glass-gap-4 mt-6">
          <div className="glass-text-center glass-p-3 glass-surface-subtle/10 glass-radius-lg">
            <div className="glass-text-lg glass-font-semibold glass-text-primary">42</div>
            <div className="glass-text-xs opacity-70">Active Users</div>
          </div>
          <div className="glass-text-center glass-p-3 glass-surface-subtle/10 glass-radius-lg">
            <div className="glass-text-lg glass-font-semibold glass-text-primary">89%</div>
            <div className="glass-text-xs opacity-70">Completion Rate</div>
          </div>
        </div>

        <div className="glass-flex glass-justify-center glass-gap-2 pt-2">
          <span className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs">Responsive</span>
          <span className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs">Interactive</span>
          <span className="glass-px-3 glass-py-1 glass-surface-subtle/20 glass-radius-full glass-text-xs">Accessible</span>
        </div>
      </div>
  }
}`,...o.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6 max-w-7xl">
      <GlassPanel {...args} variant="primary" elevation="level2">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">📊</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Analytics</h4>
          <p className="glass-text-sm opacity-80">View detailed analytics and insights</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="success" elevation="level2">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">💰</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Revenue</h4>
          <p className="glass-text-sm opacity-80">Track financial performance</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="warning" elevation="level2">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">👥</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Users</h4>
          <p className="glass-text-sm opacity-80">Manage user accounts and permissions</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="error" elevation="level1">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">⚠️</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Alerts</h4>
          <p className="glass-text-sm opacity-80">Monitor system alerts and notifications</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="default" elevation="level1">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">🔧</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Settings</h4>
          <p className="glass-text-sm opacity-80">Configure system preferences</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="primary" elevation="level1">
        <div className="glass-text-center">
          <div className="glass-text-3xl glass-mb-2">📈</div>
          <h4 className="glass-text-lg glass-font-semibold glass-mb-1">Reports</h4>
          <p className="glass-text-sm opacity-80">Generate and view reports</p>
        </div>
      </GlassPanel>
    </div>,
  args: {
    children: null // Will be overridden in render
  }
}`,...g.parameters?.docs?.source}}};const G=["Default","Variants","Elevations","PaddingSizes","Interactive","ContentShowcase","DashboardLayout"];export{o as ContentShowcase,g as DashboardLayout,t as Default,r as Elevations,c as Interactive,d as PaddingSizes,i as Variants,G as __namedExportsOrder,V as default};
