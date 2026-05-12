import{j as a}from"./iframe-DMS_w3ti.js";import{C as o}from"./ChartTooltip-B0L1qKDE.js";import"./preload-helper-PPVm8Dsz.js";import"./chartColors-BWAT40aU.js";const d={title:"Data + Visualization/Chart Tooltip",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism charttooltip component."}}},argTypes:{qualityTier:{control:{type:"select"},options:["low","medium","high","ultra"],description:"Quality tier"},tooltipStyle:{control:{type:"select"},options:["frosted","minimal","detailed"],description:"Tooltip style"},followCursor:{control:"boolean",description:"Follow cursor"}},args:{qualityTier:"medium",tooltipStyle:"frosted",followCursor:!1}},t={args:{tooltipData:{datasetIndex:0,dataIndex:0,x:100,y:150,value:{dataset:"Revenue",label:"January",value:12500,color:"var(--glass-color-primary)"}}}},e={render:r=>a.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[a.jsx(o,{...r,tooltipStyle:"frosted"}),a.jsx(o,{...r,tooltipStyle:"minimal"}),a.jsx(o,{...r,tooltipStyle:"detailed"})]}),args:{tooltipData:{datasetIndex:0,dataIndex:1,x:200,y:120,value:{dataset:"Profit",label:"February",value:8750,color:"var(--glass-color-success)"}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    tooltipData: {
      datasetIndex: 0,
      dataIndex: 0,
      x: 100,
      y: 150,
      value: {
        dataset: 'Revenue',
        label: 'January',
        value: 12500,
        color: 'var(--glass-color-primary)'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-8">
      <ChartTooltip {...args} tooltipStyle="frosted" />
      <ChartTooltip {...args} tooltipStyle="minimal" />
      <ChartTooltip {...args} tooltipStyle="detailed" />
    </div>,
  args: {
    tooltipData: {
      datasetIndex: 0,
      dataIndex: 1,
      x: 200,
      y: 120,
      value: {
        dataset: 'Profit',
        label: 'February',
        value: 8750,
        color: 'var(--glass-color-success)'
      }
    }
  }
}`,...e.parameters?.docs?.source}}};const p=["Default","Variants"];export{t as Default,e as Variants,p as __namedExportsOrder,d as default};
