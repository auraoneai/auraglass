import{j as x,R as g}from"./iframe-CWR0-zUi.js";import{G as S}from"./GlassAreaChart-hpe6ZcjN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C8nFFv6f.js";import"./GlassCard-D3Kh_OCQ.js";import"./LiquidGlassMaterial-C3sWBx_W.js";import"./LiquidGlassLayerProvider-CP44SBEZ.js";import"./OptimizedGlassCore-BBTk9mqX.js";import"./deviceCapabilities-D9RQ8fuG.js";import"./MotionFramer-uOc5z-wd.js";import"./utilsCore-jGV8p3MB.js";const y=(e,s)=>{const[u,p]=g.useState({width:e,height:s});return g.useEffect(()=>{const r=()=>{const h=Math.max(300,Math.min(e,window.innerWidth-96));p({width:h,height:h<460?Math.min(s,320):s})};return r(),window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[s,e]),u},f=e=>{const s=y(e.width??600,e.height??400),p=s.width<460?e.series?.map(r=>({...r,data:r.data.filter((h,w)=>w%2===0)})):e.series;return x.jsx(S,{...e,series:p??[],width:s.width,height:s.height,formatYValue:r=>`${Math.round(r/1e3)}k`,formatXValue:r=>String(r).slice(0,3)})},N={title:"Data + Visualization/Glass Area Chart",component:S,parameters:{layout:"centered",docs:{description:{component:"A glassmorphism area chart with multiple series support, smooth animations, and interactive tooltips."}}},argTypes:{title:{control:"text",description:"Chart title"},width:{control:"number",description:"Chart width in pixels"},height:{control:"number",description:"Chart height in pixels"},showGrid:{control:"boolean",description:"Show grid lines"},showPoints:{control:"boolean",description:"Show data points on lines"},showLegend:{control:"boolean",description:"Show legend"},showTooltips:{control:"boolean",description:"Show tooltips on hover"},xAxisLabel:{control:"text",description:"X-axis label"},yAxisLabel:{control:"text",description:"Y-axis label"},fillOpacity:{control:{type:"range",min:0,max:1,step:.1},description:"Fill opacity for areas"},stacked:{control:"boolean",description:"Show stacked areas"},animationDuration:{control:"number",description:"Animation duration in milliseconds"},loading:{control:"boolean",description:"Show loading state"},className:{control:"text",description:"Additional CSS classes"}},args:{title:"Sample Area Chart",width:600,height:400,showGrid:!0,showPoints:!0,showLegend:!0,showTooltips:!0,xAxisLabel:"Time",yAxisLabel:"Value",fillOpacity:.3,stacked:!1,animationDuration:1e3,loading:!1}},a=[{id:"series1",name:"Revenue",data:[{x:"Jan",y:4e3},{x:"Feb",y:3e3},{x:"Mar",y:5e3},{x:"Apr",y:4500},{x:"May",y:6e3},{x:"Jun",y:5500},{x:"Jul",y:7e3},{x:"Aug",y:6500},{x:"Sep",y:8e3},{x:"Oct",y:7500},{x:"Nov",y:9e3},{x:"Dec",y:8500}],color:"var(--glass-color-primary)"},{id:"series2",name:"Expenses",data:[{x:"Jan",y:2400},{x:"Feb",y:1398},{x:"Mar",y:2800},{x:"Apr",y:3908},{x:"May",y:4800},{x:"Jun",y:3800},{x:"Jul",y:4300},{x:"Aug",y:5200},{x:"Sep",y:4100},{x:"Oct",y:3600},{x:"Nov",y:4900},{x:"Dec",y:4400}],color:"var(--glass-color-danger)"}],t={render:e=>x.jsx(f,{...e}),args:{series:a}},o={args:{series:[a[0]],title:"Revenue Trend"}},i={args:{series:a,stacked:!0,title:"Revenue vs Expenses (Stacked)"}},n={args:{series:[{...a[0],color:"var(--glass-color-success)"},{...a[1],color:"var(--glass-color-warning)"}],title:"Custom Colors"}},l={args:{series:a,showGrid:!1,showLegend:!1,showPoints:!1,title:"Minimal Chart"}},c={args:{series:[{id:"large",name:"Large Dataset",data:Array.from({length:50},(e,s)=>({x:s,y:Math.sin(s*.2)*1e3+Math.random()*500})),color:"#8b5cf6"}],title:"Large Dataset (50 points)",showPoints:!1}},d={args:{loading:!0,title:"Loading Chart"}},m={args:{series:[],title:"No Data Available"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveAreaChart {...args} />,
  args: {
    series: sampleSeries
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    series: [sampleSeries[0]],
    title: 'Revenue Trend'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleSeries,
    stacked: true,
    title: 'Revenue vs Expenses (Stacked)'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      ...sampleSeries[0],
      color: 'var(--glass-color-success)'
    }, {
      ...sampleSeries[1],
      color: 'var(--glass-color-warning)'
    }],
    title: 'Custom Colors'
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleSeries,
    showGrid: false,
    showLegend: false,
    showPoints: false,
    title: 'Minimal Chart'
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    series: [{
      id: 'large',
      name: 'Large Dataset',
      data: Array.from({
        length: 50
      }, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.2) * 1000 + Math.random() * 500
      })),
      color: '#8b5cf6'
    }],
    title: 'Large Dataset (50 points)',
    showPoints: false
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    title: 'Loading Chart'
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    series: [],
    title: 'No Data Available'
  }
}`,...m.parameters?.docs?.source}}};const J=["Default","SingleSeries","Stacked","WithCustomColors","Minimal","LargeDataset","Loading","NoData"];export{t as Default,c as LargeDataset,d as Loading,l as Minimal,m as NoData,o as SingleSeries,i as Stacked,n as WithCustomColors,J as __namedExportsOrder,N as default};
