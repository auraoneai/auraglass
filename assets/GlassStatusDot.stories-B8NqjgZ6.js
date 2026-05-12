import{j as t,c as i}from"./iframe-B_p7zla-.js";import"./preload-helper-PPVm8Dsz.js";function r({status:e="ok",size:o=8,className:l}){const n=e==="ok"?"bg-emerald-400":e==="warn"?"bg-amber-400":e==="error"?"bg-red-400":e==="busy"?"bg-blue-400":"bg-slate-400";return t.jsx("span",{className:i("glass-inline-block glass-radius-full",n,l),style:{width:o,height:o}})}try{r.displayName="GlassStatusDot",r.__docgenInfo={description:"",displayName:"GlassStatusDot",props:{status:{defaultValue:{value:"ok"},description:"",name:"status",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"error"'},{value:'"offline"'},{value:'"busy"'},{value:'"ok"'},{value:'"warn"'}]}},size:{defaultValue:{value:"8"},description:"",name:"size",required:!1,type:{name:"number | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const d={title:"Data + Visualization/Glass Status Dot",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassstatusdot component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},s={args:{status:"ok",size:12}},a={render:e=>t.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:t.jsx(r,{...e})}),args:{status:"error",size:16}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'ok',
    size: 12
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStatusDot {...args} />
    </div>,
  args: {
    status: 'error',
    size: 16
  }
}`,...a.parameters?.docs?.source}}};const p=["Default","Variants"];export{s as Default,a as Variants,p as __namedExportsOrder,d as default};
