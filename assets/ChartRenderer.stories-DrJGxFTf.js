import{j as s}from"./iframe-CXbhLBXA.js";import{C as e}from"./ChartRenderer-DpfQsTGE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DdkFm4DK.js";import"./chartColors-BWAT40aU.js";const c={title:"Data + Visualization/Chart Renderer",component:e,parameters:{layout:"centered",docs:{description:{component:"A glass morphism chartrenderer component."}}},argTypes:{chartType:{control:{type:"select"},options:["line","bar","area","pie","scatter","heatmap","radar"],description:"Type of chart to render"},qualityTier:{control:{type:"select"},options:["low","medium","high","ultra"],description:"Quality tier for rendering"},glassVariant:{control:{type:"select"},options:["frosted","dynamic","clear","tinted","luminous"],description:"Glass morphism variant"}},args:{chartType:"line",qualityTier:"medium",glassVariant:"frosted"}},a={args:{chartType:"line",datasets:[{label:"Sample Data",data:[10,20,15,25,30,20],borderColor:"var(--glass-color-primary)",backgroundColor:"rgba(59, 130, 246, 0.18)"}]}},r={render:t=>s.jsx("div",{className:"glass-flex glass-flex-col glass-gap-4",children:s.jsx("div",{className:"glass-relative glass-w-80 h-40 glass-surface-subtle/20 glass-radius-md glass-border glass-p-4 glass-contrast-guard",children:s.jsx(e,{...t,datasets:[{label:"Sample Chart",data:[10,20,15,25,30,20],borderColor:"var(--glass-color-primary)",backgroundColor:"rgba(59, 130, 246, 0.18)"}]})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    chartType: 'line',
    datasets: [{
      label: 'Sample Data',
      data: [10, 20, 15, 25, 30, 20],
      borderColor: 'var(--glass-color-primary)',
      backgroundColor: 'rgba(59, 130, 246, 0.18)'
    }]
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-4">
      <div className="glass-relative glass-w-80 h-40 glass-surface-subtle/20 glass-radius-md glass-border glass-p-4 glass-contrast-guard">
        <ChartRenderer {...args} datasets={[{
        label: 'Sample Chart',
        data: [10, 20, 15, 25, 30, 20],
        borderColor: 'var(--glass-color-primary)',
        backgroundColor: 'rgba(59, 130, 246, 0.18)'
      }]} />
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const p=["Default","Variants"];export{a as Default,r as Variants,p as __namedExportsOrder,c as default};
