import{j as s}from"./iframe-CToTmdO0.js";import{G as t}from"./GlassLineChart-DpWpIXXL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXoB3NGu.js";import"./GlassCard-zcXhHX7Z.js";import"./LiquidGlassMaterial-BG5wKcQI.js";import"./LiquidGlassLayerProvider-CSLyvOJZ.js";import"./OptimizedGlassCore-tBAFSalT.js";import"./deviceCapabilities-BEZRvwEn.js";import"./MotionFramer-BcMY4Q2P.js";import"./utilsCore-B3C7amq2.js";const i=[{id:"revenue",name:"Revenue",color:"var(--glass-color-primary)",data:[{x:"Jan",y:92},{x:"Feb",y:118},{x:"Mar",y:132},{x:"Apr",y:126},{x:"May",y:148},{x:"Jun",y:171}]},{id:"target",name:"Target",color:"var(--glass-color-success)",data:[{x:"Jan",y:100},{x:"Feb",y:112},{x:"Mar",y:124},{x:"Apr",y:136},{x:"May",y:148},{x:"Jun",y:160}]}],o=({children:e})=>s.jsx("div",{className:"glass-w-full glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-5 glass-shadow-xl",style:{width:"min(920px, calc(100vw - 48px))",overflowX:"auto"},children:e}),y={title:"Data + Visualization/Glass Line Chart",component:t,parameters:{layout:"padded",previewSurface:"app",docs:{description:{component:"Glass line chart with multiple series, readable axes, legend, and hoverable data points."}}},argTypes:{showGrid:{control:"boolean"},showPoints:{control:"boolean"},showLegend:{control:"boolean"},showTooltips:{control:"boolean"}},args:{title:"Pipeline velocity",series:i,width:760,height:360,showGrid:!0,showPoints:!0,showLegend:!0,showTooltips:!0,yAxisLabel:"Bookings",formatYValue:e=>`${Math.round(e)}k`}},a={render:e=>s.jsx(o,{children:s.jsx(t,{...e})})},r={render:e=>s.jsxs("div",{className:"glass-grid glass-gap-5 lg:glass-grid-cols-2",children:[s.jsx(o,{children:s.jsx(t,{...e,title:"With points and legend",width:560,height:320})}),s.jsx(o,{children:s.jsx(t,{...e,title:"Minimal trend",width:560,height:320,showPoints:!1,showLegend:!1,showGrid:!1})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <ChartFrame>
      <GlassLineChart {...args} />
    </ChartFrame>
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-gap-5 lg:glass-grid-cols-2">
      <ChartFrame>
        <GlassLineChart {...args} title="With points and legend" width={560} height={320} />
      </ChartFrame>
      <ChartFrame>
        <GlassLineChart {...args} title="Minimal trend" width={560} height={320} showPoints={false} showLegend={false} showGrid={false} />
      </ChartFrame>
    </div>
}`,...r.parameters?.docs?.source}}};const f=["Default","Variants"];export{a as Default,r as Variants,f as __namedExportsOrder,y as default};
