import{r as V,j as s,c as a}from"./iframe-B2YkWo0R.js";import{G as L}from"./GlassCore-CC8JkFKn.js";import{G as W}from"./GlassBadge-BaOo3NrR.js";import{V as c,H as l}from"./GlassStack-DVhFZwaS.js";import{M as _}from"./MotionFramer-BYVTsMJM.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Dgh6WqMj.js";import"./index-n9X50j_c.js";import"./LiquidGlassMaterial-DIoSyT1w.js";import"./LiquidGlassLayerProvider-DpO-dbvQ.js";import"./a11y-Bb31ansd.js";import"./GlassPredictiveEngine-Bfsuuf7W.js";import"./GlassAchievementSystem-BKwelFxF.js";import"./OptimizedGlassCore-CYII0g9k.js";import"./deviceCapabilities-DmRU0S_3.js";import"./GlassBiometricAdaptation-TYjF8UXx.js";import"./MotionPreferenceContext-C6GeG4Di.js";import"./GlassEyeTracking-DkLkTBcn.js";import"./GlassSpatialAudio-nYsj51EH.js";import"./utilsCore-jPC74JRq.js";const i=V.forwardRef(({data:e,variant:t="default",size:v="md",colorScheme:f="default",showTrend:g=!0,showTarget:b=!1,trendIcons:y,className:w,...j},N)=>{const S={sm:{value:"glass-text-lg",label:"glass-text-xs",icon:"glass-text-lg",padding:"glass-p-3"},md:{value:"glass-text-2xl",label:"glass-text-sm",icon:"glass-text-xl",padding:"glass-p-4"},lg:{value:"text-3xl",label:"glass-text-base",icon:"glass-text-2xl",padding:"glass-p-6"}},M={default:{value:"text-foreground",change:{up:"text-success",down:"text-destructive",neutral:"glass-text-secondary"},icon:"glass-text-secondary",background:""},primary:{value:"text-primary",change:{up:"text-success",down:"text-destructive",neutral:"glass-text-secondary"},icon:"text-primary/70",background:"bg-primary/5"},success:{value:"text-success",change:{up:"text-success",down:"text-destructive",neutral:"glass-text-secondary"},icon:"text-success/70",background:"bg-success/5"},warning:{value:"text-warning",change:{up:"text-success",down:"text-destructive",neutral:"glass-text-secondary"},icon:"text-warning/70",background:"bg-warning/5"},destructive:{value:"text-destructive",change:{up:"text-success",down:"text-destructive",neutral:"glass-text-secondary"},icon:"text-destructive/70",background:"bg-destructive/5"}},r=S?.[v],n=M?.[f],k=y||{up:"↗️",down:"↘️",neutral:"→"},o=x=>typeof x=="number"?new Intl.NumberFormat().format(x):x,m=()=>e?.trend?k?.[e?.trend]:null,p=()=>e?.change?e?.change>0?n.change.up:e?.change<0?n.change.down:n.change.neutral:n.change.neutral,h=()=>!e?.target||typeof e?.value!="number"?0:Math.min(e?.value/e?.target*100,100),T=()=>{switch(t){case"minimal":return s.jsxs(l,{"data-glass-component":!0,space:"sm",align:"center",children:[e?.icon&&s.jsx("div",{className:a(r.icon,n.icon),children:e?.icon}),s.jsxs(c,{space:"none",children:[s.jsxs("div",{className:a("font-bold",r.value,n.value),children:[o(e?.value),e?.unit]}),s.jsx("div",{className:a("glass-text-secondary",r.label),children:e?.label||"Metric"})]}),g&&e?.change&&s.jsxs(W,{variant:"outline",size:"xs",className:p(),children:[m()," ",e?.change>0?"+":"",e?.change,"%"]})]});case"featured":return s.jsxs(c,{space:"md",children:[s.jsxs(l,{space:"sm",align:"center",justify:"between",children:[s.jsx("div",{className:a("glass-text-secondary",r.label),children:e?.label||"Metric"}),e?.icon&&s.jsx("div",{className:a(r.icon,n.icon),children:e?.icon})]}),s.jsxs(c,{space:"xs",children:[s.jsxs("div",{className:a("font-bold",r.value,n.value),children:[o(e?.value),e?.unit]}),b&&e?.target&&s.jsxs("div",{className:"glass-w-full",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-secondary glass-mb-1",children:[s.jsx("span",{children:"Progress"}),s.jsxs("span",{children:[Math.round(h()),"%"]})]}),s.jsx("div",{className:"glass-w-full glass-surface-subtle glass-radius-full glass-h-2",children:s.jsx(_,{className:a("h-full glass-radius-full transition-all duration-500",h()>=100?"bg-success":"bg-primary"),style:{width:`${h()}%`}})})]})]}),g&&(e?.change||e?.changeLabel)&&s.jsxs(l,{space:"sm",align:"center",children:[e?.change&&s.jsxs("div",{className:a("glass-text-xs font-medium flex items-center glass-gap-1",p()),children:[s.jsx("span",{children:m()}),s.jsxs("span",{children:[e?.change>0?"+":"",e?.change,"%"]})]}),e?.changeLabel&&s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.changeLabel})]}),e?.description&&s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.description})]});case"compact":return s.jsxs(l,{space:"sm",align:"center",justify:"between",children:[s.jsxs(c,{space:"none",children:[s.jsxs("div",{className:a("font-bold glass-text-lg",n.value),children:[o(e?.value),e?.unit]}),s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:e?.label||"Metric"})]}),e?.icon&&s.jsx("div",{className:a("glass-text-lg",n.icon),children:e?.icon})]});default:return s.jsxs(c,{space:"md",children:[s.jsxs(l,{space:"sm",align:"center",justify:"between",children:[s.jsx("div",{className:a("glass-text-secondary",r.label),children:e?.label||"Metric"}),e?.icon&&s.jsx("div",{className:a(r.icon,n.icon),children:e?.icon})]}),s.jsxs("div",{className:a("font-bold",r.value,n.value),children:[o(e?.value),e?.unit]}),g&&e?.change&&s.jsxs(l,{space:"sm",align:"center",children:[s.jsxs("div",{className:a("glass-text-sm font-medium flex items-center glass-gap-1",p()),children:[s.jsx("span",{children:m()}),s.jsxs("span",{children:[e?.change>0?"+":"",e?.change,"%"]})]}),e?.changeLabel&&s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:e?.changeLabel})]})]})}};return s.jsx(L,{ref:N,className:a("w-full h-full glass-radius-lg",r.padding,n.background,w),...j,children:T()})});i.displayName="MetricWidget";try{i.displayName="MetricWidget",i.__docgenInfo={description:`MetricWidget component
Display key metrics with trends and targets`,displayName:"MetricWidget",props:{data:{defaultValue:null,description:"Metric data",name:"data",required:!0,type:{name:"MetricData"}},variant:{defaultValue:{value:"default"},description:"Widget variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"compact"'},{value:'"minimal"'},{value:'"featured"'}]}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},colorScheme:{defaultValue:{value:"default"},description:"Color scheme",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"destructive"'}]}},showTrend:{defaultValue:{value:"true"},description:"Whether to show trend indicator",name:"showTrend",required:!1,type:{name:"boolean | undefined"}},showTarget:{defaultValue:{value:"false"},description:"Whether to show target progress",name:"showTarget",required:!1,type:{name:"boolean | undefined"}},trendIcons:{defaultValue:null,description:"Custom trend icons",name:"trendIcons",required:!1,type:{name:'{ up: ReactNode; down: ReactNode; neutral: ReactNode; intent?: "primary" | "neutral" | "success" | "warning" | "danger" | "info" | undefined; elevation?: "level1" | ... 3 more ... | undefined; tier?: "medium" | ... 2 more ... | undefined; } | undefined'}}}}}catch{}const Z={title:"Workflows/Metric Widget",component:i,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Metric widget shown with real values, trend, and target progress."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},u={args:{data:{label:"Monthly revenue",value:"$128.4k",change:12.8,changeLabel:"vs last month",trend:"up",target:15e4,description:"Booked recurring revenue"},variant:"featured",size:"lg",colorScheme:"primary",showTrend:!0,showTarget:!0}},d={render:e=>s.jsx("div",{className:"glass-grid glass-w-[900px] glass-grid-cols-3 glass-gap-4",children:[{label:"Conversion",value:"8.7%",change:1.4,trend:"up",colorScheme:"success"},{label:"Open risk",value:"14",change:-3,trend:"down",colorScheme:"warning"},{label:"Latency",value:"124ms",change:-18,trend:"down",colorScheme:"primary"}].map(t=>s.jsx(i,{...e,data:{label:t.label,value:t.value,change:t.change,changeLabel:"period delta",trend:t.trend,target:100},colorScheme:t.colorScheme,showTarget:!0},t.label))}),args:{variant:"default",size:"md"}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const ee=["Default","Variants"];export{u as Default,d as Variants,ee as __namedExportsOrder,Z as default};
