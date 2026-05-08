import{j as e,C as o,c as d}from"./iframe-C4NFeGrN.js";import{O as t}from"./OptimizedGlassCore-pFwkcNDS.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CcJXKEC9.js";function l({left:s,right:i,sideBySide:n=!0,className:c}){return e.jsx("div",{"data-glass-component":!0,className:d("w-full",c),children:n?e.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-3",children:[e.jsx(t,{elevation:"level1",className:"glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto",children:e.jsx(o,{children:e.jsx("pre",{className:"glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all",children:s})})}),e.jsx(t,{elevation:"level1",className:"glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto",children:e.jsx(o,{children:e.jsx("pre",{className:"glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all",children:i})})})]}):e.jsx(t,{elevation:"level1",className:"glass-radius-lg glass-p-3 glass-border glass-border-white/15 glass-overflow-auto",children:e.jsx("pre",{className:"glass-text-xs glass-text-primary-glass-opacity-80 glass-whitespace-pre-wrap glass-break-all",children:i})})})}try{l.displayName="GlassDiffViewer",l.__docgenInfo={description:"",displayName:"GlassDiffViewer",props:{left:{defaultValue:null,description:"",name:"left",required:!0,type:{name:"string"}},right:{defaultValue:null,description:"",name:"right",required:!0,type:{name:"string"}},sideBySide:{defaultValue:{value:"true"},description:"",name:"sideBySide",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const f={title:"Data + Visualization/Glass Diff Viewer",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassdiffviewer component."}}},decorators:[s=>e.jsx("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(900px, calc(100vw - 64px))",overflowX:"auto"},children:e.jsx(s,{})})],argTypes:{className:{control:"text",description:"Additional CSS classes"},left:{control:"text",description:"Left content to compare"},right:{control:"text",description:"Right content to compare"},sideBySide:{control:"boolean",description:"Display content side by side"}},args:{className:"",left:`function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item?.price;
  }
  return total;
}`,right:`function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item?.price;
  }, 0);
}`,sideBySide:!0}},a={args:{}},r={render:s=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(l,{...s})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDiffViewer {...args} />
    </div>
}`,...r.parameters?.docs?.source}}};const x=["Default","Variants"];export{a as Default,r as Variants,x as __namedExportsOrder,f as default};
