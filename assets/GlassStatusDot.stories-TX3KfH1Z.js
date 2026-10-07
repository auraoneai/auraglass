import{j as a,c as i}from"./iframe-RsoZoStf.js";import"./preload-helper-PPVm8Dsz.js";function e({status:s="ok",size:t=8,className:o}){const n=s==="ok"?"bg-emerald-400":s==="warn"?"bg-amber-400":s==="error"?"bg-red-400":s==="busy"?"bg-blue-400":"bg-slate-400";return a.jsx("span",{className:i("glass-inline-block glass-radius-full",n,o),style:{width:t,height:t}})}try{e.displayName="GlassStatusDot",e.__docgenInfo={description:"",displayName:"GlassStatusDot",props:{status:{defaultValue:{value:"ok"},description:"",name:"status",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"error"'},{value:'"offline"'},{value:'"busy"'},{value:'"ok"'},{value:'"warn"'}]}},size:{defaultValue:{value:"8"},description:"",name:"size",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const u={title:"Data + Visualization/Glass Status Dot",component:e,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassstatusdot component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},r={render:s=>a.jsx("div",{className:"glass-neutral-level1 glass-rounded-2xl glass-p-6",children:a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[a.jsx(e,{...s}),a.jsx("span",{className:"glass-text-sm glass-text-primary",children:"Service operational"})]})}),args:{status:"ok",size:12}},l={render:s=>a.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:a.jsx(e,{...s})}),args:{status:"error",size:16}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-2xl glass-p-6">
      <div className="glass-flex glass-items-center glass-gap-3">
        <GlassStatusDot {...args} />
        <span className="glass-text-sm glass-text-primary">Service operational</span>
      </div>
    </div>,
  args: {
    status: 'ok',
    size: 12
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStatusDot {...args} />
    </div>,
  args: {
    status: 'error',
    size: 16
  }
}`,...l.parameters?.docs?.source}}};const m=["Default","Variants"];export{r as Default,l as Variants,m as __namedExportsOrder,u as default};
