import{j as e}from"./iframe-CToTmdO0.js";import{G as r}from"./GlassBarChart-sxxE84U6.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCard-zcXhHX7Z.js";import"./LiquidGlassMaterial-BG5wKcQI.js";import"./LiquidGlassLayerProvider-CSLyvOJZ.js";import"./OptimizedGlassCore-tBAFSalT.js";import"./deviceCapabilities-BEZRvwEn.js";import"./MotionFramer-BcMY4Q2P.js";import"./utilsCore-B3C7amq2.js";const u={title:"Data + Visualization/Glass Bar Chart",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassbarchart component."}}},argTypes:{showGrid:{control:"boolean",description:"Show grid lines"},showDataLabels:{control:"boolean",description:"Show data labels on bars"},showLegend:{control:"boolean",description:"Show legend"}},args:{showGrid:!0,showDataLabels:!0,showLegend:!0}},t=[{id:"series1",name:"Series 1",data:[{x:"Jan",y:10},{x:"Feb",y:15},{x:"Mar",y:12},{x:"Apr",y:18}]},{id:"series2",name:"Series 2",data:[{x:"Jan",y:8},{x:"Feb",y:12},{x:"Mar",y:16},{x:"Apr",y:14}]}],s={args:{series:t,width:400,height:300}},a={render:o=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[e.jsx(r,{...o,showGrid:!0,showDataLabels:!0}),e.jsx(r,{...o,showGrid:!1,showDataLabels:!1,showLegend:!1})]}),args:{series:t,width:400,height:300}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleData,
    width: 400,
    height: 300
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-8">
      <GlassBarChart {...args} showGrid={true} showDataLabels={true} />
      <GlassBarChart {...args} showGrid={false} showDataLabels={false} showLegend={false} />
    </div>,
  args: {
    series: sampleData,
    width: 400,
    height: 300
  }
}`,...a.parameters?.docs?.source}}};const x=["Default","Variants"];export{s as Default,a as Variants,x as __namedExportsOrder,u as default};
