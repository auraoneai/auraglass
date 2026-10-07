import{r as h,j as s,R as b,c as N}from"./iframe-RsoZoStf.js";import{u as w}from"./a11y-WSL2JlLl.js";import{u as v}from"./MotionPreferenceContext-B3rOXnSa.js";import"./preload-helper-PPVm8Dsz.js";const a=h.forwardRef(({columns:e=3,gap:t=12,children:o,className:i,respectMotionPreference:c=!0,"aria-label":d="Masonry layout",role:m="grid",...g},p)=>{const u=w(),{prefersReducedMotion:x}=v(),n=c&&!x;return s.jsx("div",{ref:p,id:u,className:N("w-full",n&&"motion-safe:transition-all motion-reduce:transition-none",i),style:{columnCount:e,columnGap:t},"aria-label":d,role:m,...g,children:b.Children.map(o,(f,y)=>s.jsx("div",{role:"gridcell",style:{breakInside:"avoid",marginBottom:t},className:n?"motion-safe:transition-all motion-reduce:transition-none":"",children:f},y))})});a.displayName="GlassMasonry";try{a.displayName="GlassMasonry",a.__docgenInfo={description:`GlassMasonry component
CSS Masonry layout for displaying content in a column-based grid`,displayName:"GlassMasonry",props:{columns:{defaultValue:{value:"3"},description:"Number of columns in the masonry layout",name:"columns",required:!1,type:{name:"number | undefined"}},gap:{defaultValue:{value:"12"},description:"Gap between items in pixels",name:"gap",required:!1,type:{name:"number | undefined"}},children:{defaultValue:null,description:"Content to render in the masonry layout",name:"children",required:!0,type:{name:"ReactNode"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect user's motion preferences",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:{value:"Masonry layout"},description:"Accessibility label for screen readers",name:"aria-label",required:!1,type:{name:"string | undefined"}},role:{defaultValue:{value:"grid"},description:"Accessibility role for semantic meaning",name:"role",required:!1,type:{name:"string | undefined"}}}}}catch{}const _={title:"Surfaces/App Shells + Layout/Glass Masonry",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmasonry component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},l={render:e=>s.jsxs(a,{...e,className:"glass-neutral-level1 glass-w-full glass-max-w-4xl glass-rounded-2xl glass-p-5 glass-shadow-xl",children:[s.jsxs("div",{className:"glass-rounded-xl glass-bg-white/65 glass-p-4",children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary",children:"Compact cards"}),s.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-secondary",children:"Masonry keeps dense content scannable."})]}),s.jsxs("div",{className:"glass-rounded-xl glass-bg-white/70 glass-p-4",children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary",children:"Balanced columns"}),s.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-secondary",children:"Variable heights flow into stable columns."})]}),s.jsxs("div",{className:"glass-rounded-xl glass-bg-white/60 glass-p-4",children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary",children:"Responsive flow"}),s.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-secondary",children:"Breakpoints reflow without clipping."})]})]}),args:{className:""}},r={render:e=>s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:s.jsx(a,{...e,children:"Default"})}),args:{}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <GlassMasonry {...args} className="glass-neutral-level1 glass-w-full glass-max-w-4xl glass-rounded-2xl glass-p-5 glass-shadow-xl">
      <div className="glass-rounded-xl glass-bg-white/65 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Compact cards</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Masonry keeps dense content scannable.</p>
      </div>
      <div className="glass-rounded-xl glass-bg-white/70 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Balanced columns</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Variable heights flow into stable columns.</p>
      </div>
      <div className="glass-rounded-xl glass-bg-white/60 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Responsive flow</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Breakpoints reflow without clipping.</p>
      </div>
    </GlassMasonry>,
  args: {
    className: ''
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassMasonry {...args}>
        Default
      </GlassMasonry>
    </div>,
  args: {}
}`,...r.parameters?.docs?.source}}};const R=["Default","Variants"];export{l as Default,r as Variants,R as __namedExportsOrder,_ as default};
