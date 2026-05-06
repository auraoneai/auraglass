import{r as Q,j as s,c as m,d as D}from"./iframe-mbNquNNc.js";import{G as ss}from"./GlassBadge-C-NZxFZS.js";import{V as S,H as q}from"./GlassStack-BIz92N6_.js";import{G as as}from"./GlassCore-BPQP4zM0.js";import{M as es}from"./MotionFramer-BekP4wEp.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Dj39LQ52.js";import"./index-vu3jGQGZ.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./GlassPredictiveEngine-D3b8OhcD.js";import"./GlassAchievementSystem-BuLAT0VQ.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./GlassBiometricAdaptation-Cvck8KpT.js";import"./MotionPreferenceContext-BfJvNZar.js";import"./GlassEyeTracking-jVjspFjL.js";import"./GlassSpatialAudio-CRCXq6J3.js";import"./utilsCore-CTDrFk4s.js";const c=Q.forwardRef(({data:a,type:d="bar",variant:_="default",size:R="md",colorScheme:j="default",showLegend:z=!0,showGrid:w=!0,interactive:B=!0,loading:L=!1,actions:N,renderChart:f,className:E,...I},G)=>{const C={sm:{height:"h-32",padding:"glass-p-3",title:"glass-text-sm",subtitle:"glass-text-xs"},md:{height:"h-48",padding:"glass-p-4",title:"glass-text-base",subtitle:"glass-text-sm"},lg:{height:"h-64",padding:"glass-p-6",title:"glass-text-lg",subtitle:"glass-text-base"}},P={default:["var(--glass-color-primary)","var(--glass-color-secondary)","var(--glass-color-success)","var(--glass-color-warning)","var(--glass-color-danger)"],primary:["var(--glass-color-primary)","var(--glass-color-primary-light)","color-mix(in srgb, var(--glass-color-primary) 80%, white)","color-mix(in srgb, var(--glass-color-primary) 60%, white)","color-mix(in srgb, var(--glass-color-primary) 40%, white)"],success:["var(--glass-color-success)","var(--glass-color-success-light)","color-mix(in srgb, var(--glass-color-success) 80%, white)","color-mix(in srgb, var(--glass-color-success) 60%, white)","color-mix(in srgb, var(--glass-color-success) 40%, white)"],warning:["var(--glass-color-warning)","var(--glass-color-warning-light)","color-mix(in srgb, var(--glass-color-warning) 80%, white)","color-mix(in srgb, var(--glass-color-warning) 60%, white)","color-mix(in srgb, var(--glass-color-warning) 40%, white)"],destructive:["var(--glass-color-danger)","var(--glass-color-danger-light)","color-mix(in srgb, var(--glass-color-danger) 80%, white)","color-mix(in srgb, var(--glass-color-danger) 60%, white)","color-mix(in srgb, var(--glass-color-danger) 40%, white)"],rainbow:["var(--glass-color-primary)","var(--glass-color-secondary)","var(--glass-color-success)","var(--glass-color-warning)","var(--glass-color-danger)","var(--glass-color-accent)","var(--glass-color-info)"]},u=C?.[R]||C.md,n=P?.[j]||P.default,V=()=>{if(!a?.dataPoints||a.dataPoints.length===0)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-secondary",children:"No data available"});const t=Math.max(...a.dataPoints.map(r=>r.value));return s.jsx("div",{"data-glass-component":!0,className:"glass-flex glass-items-end glass-justify-between glass-gap-2 glass-h-full",children:a?.dataPoints.map((r,e)=>{const l=r.value/t*100,o=r.color||n[e%(n?.length||0)];return s.jsxs(es,{preset:"slideUp",delay:e*D.DURATION.fast/10,className:"glass-flex-1 glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx("div",{className:`glass-w-full glass-radius-t glass-transition-all glass-duration-[${D.DURATION.normal}ms] hover:glass-opacity-80 glass-cursor-pointer`,style:{height:`${l}%`,backgroundColor:o,minHeight:"4px"},title:`${r.label}: ${r.value}`}),s.jsx("div",{className:"glass-text-xs glass-text-secondary glass-text-center glass-truncate glass-w-full",children:r.label})]},r.label)})})},M=()=>{if(!a?.dataPoints||a.dataPoints.length===0)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-secondary",children:"No data available"});const t=Math.max(...a.dataPoints.map(e=>e.value)),r=a?.dataPoints.map((e,l)=>{const o=l/((a.dataPoints?.length||0)-1)*100,i=100-e.value/t*100;return`${o},${i}`}).join(" ");return s.jsxs("div",{className:"glass-relative glass-h-full glass-w-full",children:[s.jsxs("svg",{className:"glass-w-full glass-h-full",viewBox:"0 0 100 100",preserveAspectRatio:"none",children:[w&&s.jsx("g",{children:Array.from({length:5},(e,l)=>s.jsx("line",{x1:"0",y1:l*25,x2:"100",y2:l*25,stroke:"color-mix(in srgb, var(--glass-white) 18%, transparent)",strokeWidth:"0.5"},l))}),s.jsx("polyline",{points:r,fill:"none",stroke:n?.[0]||"var(--glass-color-primary)",strokeWidth:"2",className:"glass-drop-glass-shadow-sm"}),a?.dataPoints.map((e,l)=>{const o=l/((a.dataPoints?.length||0)-1)*100,i=100-e.value/t*100;return s.jsx("circle",{cx:o,cy:i,r:"2",fill:n?.[0]||"var(--glass-color-primary)",className:"glass-hover-r-3 glass-transition-all glass-cursor-pointer"},l)})]}),s.jsx("div",{className:"glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-flex glass-justify-between",children:a?.dataPoints.map((e,l)=>s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-80",children:e.label},l))})]})},k=()=>{if(!a?.dataPoints||a.dataPoints.length===0)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-secondary",children:"No data available"});const t=a.dataPoints.reduce((e,l)=>e+l.value,0);let r=0;return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("div",{className:"glass-relative",children:s.jsx("svg",{width:"120",height:"120",viewBox:"0 0 120 120",children:a?.dataPoints.map((e,l)=>{const i=e.value/t*360,W=r;r+=i;const T=e.color||n[l%(n?.length||0)],y=60,b=60,g=50,A=W*Math.PI/180,$=(W+i)*Math.PI/180,H=y+g*Math.cos(A),U=b+g*Math.sin(A),X=y+g*Math.cos($),Y=b+g*Math.sin($),Z=i>180?1:0,K=[`M ${y} ${b}`,`L ${H} ${U}`,`A ${g} ${g} 0 ${Z} 1 ${X} ${Y}`,"Z"].join(" ");return s.jsx("path",{d:K,fill:T,className:"hover:glass-opacity-80 glass-transition-opacity glass-cursor-pointer"},l)})})})})},F=()=>{if(!a?.dataPoints||a.dataPoints.length===0)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-secondary glass-text-xs",children:"No data"});const t=Math.max(...a.dataPoints.map(e=>e.value)),r=a?.dataPoints.map((e,l)=>{const o=l/((a.dataPoints?.length||0)-1)*100,i=100-e.value/t*100;return`${o},${i}`}).join(" ");return s.jsx("svg",{className:"glass-w-full glass-h-8",viewBox:"0 0 100 100",preserveAspectRatio:"none",children:s.jsx("polyline",{points:r,fill:"none",stroke:n?.[0]||"var(--glass-color-primary)",strokeWidth:"3",className:"glass-drop-glass-shadow-sm"})})},J=()=>{if(L)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full",children:s.jsx("div",{className:"glass-w-6 glass-h-6 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full glass-animate-spin"})});if(!a)return s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-full glass-text-secondary",children:"No chart data provided"});if(f)return f?f(a,{type:d,colorScheme:j,colors:n,showGrid:w,interactive:B}):s.jsx("div",{children:"Chart not available"});switch(d){case"line":case"area":return M?M():s.jsx("div",{children:"Line chart not available"});case"pie":case"donut":return k?k():s.jsx("div",{children:"Pie chart not available"});case"sparkline":return F();default:return V?V():s.jsx("div",{children:"Bar chart not available"})}},O=()=>!z||d==="sparkline"||!a?.dataPoints||a.dataPoints.length===0?null:s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:a.dataPoints.map((t,r)=>{const e=t.color||n[r%(n?.length||0)];return s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-sm",style:{backgroundColor:e}}),s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:t.label})]},r)})});return s.jsx(as,{ref:G,className:m("w-full h-full glass-radius-lg",u.padding,E),...I,children:s.jsxs(S,{space:"md",className:"glass-h-full",children:[s.jsxs(q,{space:"sm",align:"center",justify:"between",children:[s.jsxs(S,{space:"xs",children:[s.jsx("h3",{className:m("font-medium text-foreground",u.title),children:a?.title||"Chart"}),a?.subtitle&&s.jsx("p",{className:m("glass-text-secondary",u.subtitle),children:a?.subtitle})]}),N&&s.jsx("div",{className:"glass-flex-shrink-0",children:N})]}),a?.summary&&_!=="minimal"&&s.jsxs(q,{space:"sm",align:"center",children:[a?.summary.total&&s.jsx("div",{className:"glass-text-lg glass-font-bold glass-text-primary",children:a?.summary.total.toLocaleString()}),a?.summary.change&&s.jsxs(ss,{variant:a?.summary.trend==="up"?"success":a?.summary.trend==="down"?"error":"outline",size:"xs",children:[a?.summary.change>0?"+":"",a?.summary.change,"%"]})]}),s.jsx("div",{className:m("flex-1",u.height,d==="sparkline"&&"h-auto"),children:J()}),O()]})})});c.displayName="ChartWidget";try{c.displayName="ChartWidget",c.__docgenInfo={description:`ChartWidget component
Displays various chart types with glassmorphism styling`,displayName:"ChartWidget",props:{data:{defaultValue:null,description:"Chart data",name:"data",required:!0,type:{name:"ChartData"}},type:{defaultValue:{value:"bar"},description:"Chart type",name:"type",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"area"'},{value:'"line"'},{value:'"bar"'},{value:'"pie"'},{value:'"donut"'},{value:'"sparkline"'}]}},variant:{defaultValue:{value:"default"},description:"Widget variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"minimal"'},{value:'"featured"'}]}},size:{defaultValue:{value:"md"},description:"Chart size",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},colorScheme:{defaultValue:{value:"default"},description:"Color scheme",name:"colorScheme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"success"'},{value:'"warning"'},{value:'"default"'},{value:'"destructive"'},{value:'"rainbow"'}]}},showLegend:{defaultValue:{value:"true"},description:"Whether to show legend",name:"showLegend",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"true"},description:"Whether to show grid",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"Whether to show values on hover",name:"interactive",required:!1,type:{name:"boolean | undefined"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},actions:{defaultValue:null,description:"Chart actions",name:"actions",required:!1,type:{name:"ReactNode"}},renderChart:{defaultValue:null,description:"Custom chart renderer",name:"renderChart",required:!1,type:{name:"((data: ChartData, config: any) => ReactNode) | undefined"}}}}}catch{}const js={title:"Components/Widgets/ChartWidget",component:c,parameters:{layout:"centered",docs:{description:{component:"A glass morphism chartwidget component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},p={args:{data:{title:"Sample Chart",subtitle:"Monthly data",dataPoints:[{label:"Jan",value:65},{label:"Feb",value:59},{label:"Mar",value:80},{label:"Apr",value:81},{label:"May",value:56},{label:"Jun",value:55}],summary:{total:396,change:12.5,trend:"up"}},type:"bar",size:"md"}},h={render:a=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[s.jsx(c,{...a,type:"bar"}),s.jsx(c,{...a,type:"line"}),s.jsx(c,{...a,type:"pie"}),s.jsx(c,{...a,type:"sparkline"})]}),args:{data:{title:"Chart Variants",dataPoints:[{label:"A",value:45},{label:"B",value:67},{label:"C",value:23},{label:"D",value:89}]},size:"sm"}},v={args:{data:{title:"Empty Chart",dataPoints:[]},type:"bar"}},x={args:{type:"bar"}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      title: 'Sample Chart',
      subtitle: 'Monthly data',
      dataPoints: [{
        label: 'Jan',
        value: 65
      }, {
        label: 'Feb',
        value: 59
      }, {
        label: 'Mar',
        value: 80
      }, {
        label: 'Apr',
        value: 81
      }, {
        label: 'May',
        value: 56
      }, {
        label: 'Jun',
        value: 55
      }],
      summary: {
        total: 396,
        change: 12.5,
        trend: 'up' as const
      }
    },
    type: 'bar',
    size: 'md'
  }
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ChartWidget {...args} type="bar" />
      <ChartWidget {...args} type="line" />
      <ChartWidget {...args} type="pie" />
      <ChartWidget {...args} type="sparkline" />
    </div>,
  args: {
    data: {
      title: 'Chart Variants',
      dataPoints: [{
        label: 'A',
        value: 45
      }, {
        label: 'B',
        value: 67
      }, {
        label: 'C',
        value: 23
      }, {
        label: 'D',
        value: 89
      }]
    },
    size: 'sm'
  }
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      title: 'Empty Chart',
      dataPoints: []
    },
    type: 'bar'
  }
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'bar'
  }
}`,...x.parameters?.docs?.source}}};const ws=["Default","Variants","EmptyData","NoData"];export{p as Default,v as EmptyData,x as NoData,h as Variants,ws as __namedExportsOrder,js as default};
