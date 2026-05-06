import{j as e}from"./iframe-DBVOVM-c.js";import{K as s}from"./KpiChart-BuMW4Ex9.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Components/Components/KpiChart",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism kpichart component."}}},argTypes:{kpi:{control:"object",description:"KPI data object"},qualityTier:{control:"select",options:["low","medium","high","ultra"],description:"Quality tier for animations"},color:{control:"color",type:"string",table:{type:{summary:"string"}},description:"Chart color"}},args:{kpi:{value:1250,label:"Revenue",change:12.5,changeLabel:"+12.5%",format:"currency"},qualityTier:"medium",color:"var(--glass-color-primary)"}},r={args:{}},a={render:o=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(s,{...o})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <KpiChart {...args} />
    </div>
}`,...a.parameters?.docs?.source}}};const l=["Default","Variants"];export{r as Default,a as Variants,l as __namedExportsOrder,c as default};
