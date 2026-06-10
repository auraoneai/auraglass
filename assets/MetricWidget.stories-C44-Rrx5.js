import{r as V,j as s,c as a}from"./iframe-GrkikuRp.js";import{G as L}from"./GlassCore-DvO25cbE.js";import{G as W}from"./GlassBadge-DRtWSiTp.js";import{V as c,H as t}from"./GlassStack-DrW2XuZ8.js";import{M as _}from"./MotionFramer-0RDYG5R5.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-D11IFtlb.js";import"./LiquidGlassMaterial-QJo0sijf.js";import"./LiquidGlassLayerProvider-B3OXnDJ0.js";import"./a11y-CCC13-1v.js";import"./GlassPredictiveEngine-Cet71K7v.js";import"./GlassAchievementSystem-F37YjtOd.js";import"./OptimizedGlassCore-BK6ui_Z7.js";import"./deviceCapabilities-Cdjfew4F.js";import"./GlassBiometricAdaptation-xyUwR8ZA.js";import"./MotionPreferenceContext-BJCiJfFd.js";import"./GlassEyeTracking-DnsWplSi.js";import"./GlassSpatialAudio--c49q0dU.js";import"./utilsCore-C85LumCN.js";const i=V.forwardRef(({data:e,variant:r="default",size:v="md",colorScheme:f="default",showTrend:u=!0,showTarget:y=!1,trendIcons:b,className:w,...j},N)=>{const S={sm:{value:"glass-text-lg",label:"glass-text-xs",icon:"glass-text-lg",padding:"glass-p-3"},md:{value:"glass-text-2xl",label:"glass-text-sm",icon:"glass-text-xl",padding:"glass-p-4"},lg:{value:"glass-text-3xl",label:"glass-text-base",icon:"glass-text-2xl",padding:"glass-p-6"}},M={default:{value:"glass-text-primary",change:{up:"glass-text-success",down:"glass-text-danger",neutral:"glass-text-secondary"},icon:"glass-text-secondary",background:""},primary:{value:"glass-text-primary",change:{up:"glass-text-success",down:"glass-text-danger",neutral:"glass-text-secondary"},icon:"glass-text-primary/70",background:"glass-surface-primary/5"},success:{value:"glass-text-success",change:{up:"glass-text-success",down:"glass-text-danger",neutral:"glass-text-secondary"},icon:"glass-text-success/70",background:"glass-surface-success/5"},warning:{value:"glass-text-warning",change:{up:"glass-text-success",down:"glass-text-danger",neutral:"glass-text-secondary"},icon:"glass-text-warning/70",background:"glass-surface-warning/5"},destructive:{value:"glass-text-danger",change:{up:"glass-text-success",down:"glass-text-danger",neutral:"glass-text-secondary"},icon:"glass-text-danger/70",background:"glass-surface-danger/5"}},l=S?.[v],n=M?.[f],k=b||{up:"↗️",down:"↘️",neutral:"→"},o=x=>typeof x=="number"?new Intl.NumberFormat().format(x):x,m=()=>e?.trend?k?.[e?.trend]:null,p=()=>e?.change?e?.change>0?n.change.up:e?.change<0?n.change.down:n.change.neutral:n.change.neutral,h=()=>!e?.target||typeof e?.value!="number"?0:Math.min(e?.value/e?.target*100,100),T=()=>{switch(r){case"minimal":return s.jsxs(t,{"data-glass-component":!0,space:"sm",align:"center",children:[e?.icon&&s.jsx("div",{className:a(l.icon,n.icon),children:e?.icon}),s.jsxs(c,{space:"none",children:[s.jsxs("div",{className:a("glass-font-bold",l.value,n.value),children:[o(e?.value),e?.unit]}),s.jsx("div",{className:a("glass-text-secondary",l.label),children:e?.label||"Metric"})]}),u&&e?.change&&s.jsxs(W,{variant:"outline",size:"xs",className:p(),children:[m()," ",e?.change>0?"+":"",e?.change,"%"]})]});case"featured":return s.jsxs(c,{space:"md",children:[s.jsxs(t,{space:"sm",align:"center",justify:"between",children:[s.jsx("div",{className:a("glass-text-secondary",l.label),children:e?.label||"Metric"}),e?.icon&&s.jsx("div",{className:a(l.icon,n.icon),children:e?.icon})]}),s.jsxs(c,{space:"xs",children:[s.jsxs("div",{className:a("glass-font-bold",l.value,n.value),children:[o(e?.value),e?.unit]}),y&&e?.target&&s.jsxs("div",{className:"glass-w-full",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mb-1",children:[s.jsx("span",{children:"Progress"}),s.jsxs("span",{children:[Math.round(h()),"%"]})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle glass-radius-full glass-h-2",children:s.jsx(_,{className:a("glass-h-full glass-radius-full glass-transition-all glass-duration-500",h()>=100?"glass-surface-success":"glass-surface-primary"),style:{width:`${h()}%`}})})]})]}),u&&(e?.change||e?.changeLabel)&&s.jsxs(t,{space:"sm",align:"center",children:[e?.change&&s.jsxs("div",{className:a("glass-text-xs glass-font-medium glass-flex glass-items-center glass-gap-1",p()),children:[s.jsx("span",{children:m()}),s.jsxs("span",{children:[e?.change>0?"+":"",e?.change,"%"]})]}),e?.changeLabel&&s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.changeLabel})]}),e?.description&&s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.description})]});case"compact":return s.jsxs(t,{space:"sm",align:"center",justify:"between",children:[s.jsxs(c,{space:"none",children:[s.jsxs("div",{className:a("glass-font-bold glass-text-lg",n.value),children:[o(e?.value),e?.unit]}),s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.label||"Metric"})]}),e?.icon&&s.jsx("div",{className:a("glass-text-lg",n.icon),children:e?.icon})]});default:return s.jsxs(c,{space:"md",children:[s.jsxs(t,{space:"sm",align:"center",justify:"between",children:[s.jsx("div",{className:a("glass-text-secondary",l.label),children:e?.label||"Metric"}),e?.icon&&s.jsx("div",{className:a(l.icon,n.icon),children:e?.icon})]}),s.jsxs("div",{className:a("glass-font-bold",l.value,n.value),children:[o(e?.value),e?.unit]}),u&&e?.change&&s.jsxs(t,{space:"sm",align:"center",children:[s.jsxs("div",{className:a("glass-text-sm glass-font-medium glass-flex glass-items-center glass-gap-1",p()),children:[s.jsx("span",{children:m()}),s.jsxs("span",{children:[e?.change>0?"+":"",e?.change,"%"]})]}),e?.changeLabel&&s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:e?.changeLabel})]})]})}};return s.jsx(L,{ref:N,className:a("glass-w-full glass-h-full glass-radius-lg glass-min-w-0",l.padding,n.background,w),...j,children:T()})});i.displayName="MetricWidget";try{i.displayName="MetricWidget",i.__docgenInfo={description:`MetricWidget component
Display key metrics with trends and targets`,displayName:"MetricWidget",props:{data:{defaultValue:null,description:"Metric data",name:"data",required:!0,type:{name:"MetricData"}},variant:{defaultValue:{value:"default"},description:"Widget variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"compact"'},{value:'"minimal"'},{value:'"featured"'}]}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},colorScheme:{defaultValue:{value:"default"},description:"Color scheme",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"primary"'},{value:'"destructive"'},{value:'"success"'},{value:'"warning"'}]}},showTrend:{defaultValue:{value:"true"},description:"Whether to show trend indicator",name:"showTrend",required:!1,type:{name:"boolean | undefined"}},showTarget:{defaultValue:{value:"false"},description:"Whether to show target progress",name:"showTarget",required:!1,type:{name:"boolean | undefined"}},trendIcons:{defaultValue:null,description:"Custom trend icons",name:"trendIcons",required:!1,type:{name:'{ up: ReactNode; down: ReactNode; neutral: ReactNode; intent?: "primary" | "success" | "warning" | "neutral" | "danger" | "info" | undefined; elevation?: "level1" | ... 3 more ... | undefined; tier?: "medium" | ... 2 more ... | undefined; } | undefined'}}}}}catch{}const Y={title:"Workflows/Metric Widget",component:i,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Metric widget shown with real values, trend, and target progress."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},g={args:{data:{label:"Monthly revenue",value:"$128.4k",change:12.8,changeLabel:"vs last month",trend:"up",target:15e4,description:"Booked recurring revenue"},variant:"featured",size:"lg",colorScheme:"primary",showTrend:!0,showTarget:!0}},d={render:e=>s.jsx("div",{className:"glass-grid glass-w-[900px] glass-grid-cols-3 glass-gap-4",children:[{label:"Conversion",value:"8.7%",change:1.4,trend:"up",colorScheme:"success"},{label:"Open risk",value:"14",change:-3,trend:"down",colorScheme:"warning"},{label:"Latency",value:"124ms",change:-18,trend:"down",colorScheme:"primary"}].map(r=>s.jsx(i,{...e,data:{label:r.label,value:r.value,change:r.change,changeLabel:"period delta",trend:r.trend,target:100},colorScheme:r.colorScheme,showTarget:!0},r.label))}),args:{variant:"default",size:"md"}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      label: 'Monthly revenue',
      value: '$128.4k',
      change: 12.8,
      changeLabel: 'vs last month',
      trend: 'up',
      target: 150000,
      description: 'Booked recurring revenue'
    },
    variant: 'featured',
    size: 'lg',
    colorScheme: 'primary',
    showTrend: true,
    showTarget: true
  }
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-grid glass-w-[900px] glass-grid-cols-3 glass-gap-4">
      {[{
      label: 'Conversion',
      value: '8.7%',
      change: 1.4,
      trend: 'up',
      colorScheme: 'success'
    }, {
      label: 'Open risk',
      value: '14',
      change: -3,
      trend: 'down',
      colorScheme: 'warning'
    }, {
      label: 'Latency',
      value: '124ms',
      change: -18,
      trend: 'down',
      colorScheme: 'primary'
    }].map(metric => <MetricWidget key={metric.label} {...args} data={{
      label: metric.label,
      value: metric.value,
      change: metric.change,
      changeLabel: 'period delta',
      trend: metric.trend as any,
      target: 100
    }} colorScheme={metric.colorScheme as any} showTarget />)}
    </div>,
  args: {
    variant: 'default',
    size: 'md'
  }
}`,...d.parameters?.docs?.source}}};const Z=["Default","Variants"];export{g as Default,d as Variants,Z as __namedExportsOrder,Y as default};
