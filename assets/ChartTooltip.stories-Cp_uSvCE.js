import{j as t}from"./iframe-OZreUAtx.js";import{C as o}from"./ChartTooltip-CTPLgxnM.js";import"./preload-helper-PPVm8Dsz.js";const n={title:"Components/Components/ChartTooltip",component:o,parameters:{layout:"centered",docs:{description:{component:"A glass morphism charttooltip component."}}},argTypes:{qualityTier:{control:{type:"select"},options:["low","medium","high","ultra"],description:"Quality tier"},tooltipStyle:{control:{type:"select"},options:["frosted","minimal","detailed"],description:"Tooltip style"},followCursor:{control:"boolean",description:"Follow cursor"}},args:{qualityTier:"medium",tooltipStyle:"frosted",followCursor:!1}},a={args:{tooltipData:{datasetIndex:0,dataIndex:0,x:100,y:150,value:{dataset:"Revenue",label:"January",value:12500,color:"var(--glass-color-primary)"}}}},e={render:s=>t.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[t.jsx(o,{...s,tooltipStyle:"frosted"}),t.jsx(o,{...s,tooltipStyle:"minimal"}),t.jsx(o,{...s,tooltipStyle:"detailed"})]}),args:{tooltipData:{datasetIndex:0,dataIndex:1,x:200,y:120,value:{dataset:"Profit",label:"February",value:8750,color:"var(--glass-color-success)"}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const d=["Default","Variants"];export{a as Default,e as Variants,d as __namedExportsOrder,n as default};
