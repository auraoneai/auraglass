import{j as r}from"./iframe-C2Py7iTP.js";import{C as s}from"./ChartRenderer-DjDH81A0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cm_xt3z-.js";const c={title:"Components/Components/ChartRenderer",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism chartrenderer component."}}},argTypes:{chartType:{control:{type:"select"},options:["line","bar","area","pie","scatter","heatmap","radar"],description:"Type of chart to render"},qualityTier:{control:{type:"select"},options:["low","medium","high","ultra"],description:"Quality tier for rendering"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass morphism variant"}},args:{chartType:"line",qualityTier:"medium",glassVariant:"frosted"}},a={args:{chartType:"line",datasets:[{label:"Sample Data",data:[10,20,15,25,30,20],borderColor:"var(--glass-color-primary)",backgroundColor:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'}]}},e={render:t=>r.jsx("div",{className:"glass-flex glass-flex-col glass-gap-4",children:r.jsx("div",{className:"glass-relative glass-w-80 h-40 glass-surface-subtle/20 glass-radius-md glass-border glass-p-4 glass-contrast-guard",children:r.jsx(s,{...t,datasets:[{label:"Sample Chart",data:[10,20,15,25,30,20],borderColor:"var(--glass-color-primary)",backgroundColor:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'}]})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    chartType: 'line',
    datasets: [{
      label: 'Sample Data',
      data: [10, 20, 15, 25, 30, 20],
      borderColor: 'var(--glass-color-primary)',
      backgroundColor: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'
    }]
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div className="glass-relative glass-w-80 h-40 glass-surface-subtle/20 glass-radius-md glass-border glass-p-4 glass-contrast-guard">
        <ChartRenderer {...args} datasets={[{
        label: 'Sample Chart',
        data: [10, 20, 15, 25, 30, 20],
        borderColor: 'var(--glass-color-primary)',
        backgroundColor: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */'
      }]} />
      </div>
    </div>
}`,...e.parameters?.docs?.source}}};const d=["Default","Variants"];export{a as Default,e as Variants,d as __namedExportsOrder,c as default};
