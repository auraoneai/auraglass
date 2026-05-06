import{G as p}from"./GlassAreaChart-Du7n6uUz.js";import"./iframe-Ddb4tVEK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIGS6Uos.js";import"./GlassCard-DSQMh49w.js";import"./LiquidGlassMaterial-CJVSwNtK.js";import"./LiquidGlassLayerProvider-NQCydaKh.js";import"./OptimizedGlassCore-ac4MFqVE.js";import"./MotionFramer-BQlEmU1w.js";import"./utilsCore-DCiYDi1n.js";const C={title:"Components/Charts/GlassAreaChart",component:p,parameters:{layout:"centered",docs:{description:{component:"A glassmorphism area chart with multiple series support, smooth animations, and interactive tooltips."}}},argTypes:{title:{control:"text",description:"Chart title"},width:{control:"number",description:"Chart width in pixels"},height:{control:"number",description:"Chart height in pixels"},showGrid:{control:"boolean",description:"Show grid lines"},showPoints:{control:"boolean",description:"Show data points on lines"},showLegend:{control:"boolean",description:"Show legend"},showTooltips:{control:"boolean",description:"Show tooltips on hover"},xAxisLabel:{control:"text",description:"X-axis label"},yAxisLabel:{control:"text",description:"Y-axis label"},fillOpacity:{control:{type:"range",min:0,max:1,step:.1},description:"Fill opacity for areas"},stacked:{control:"boolean",description:"Show stacked areas"},animationDuration:{control:"number",description:"Animation duration in milliseconds"},loading:{control:"boolean",description:"Show loading state"},className:{control:"text",description:"Additional CSS classes"}},args:{title:"Sample Area Chart",width:600,height:400,showGrid:!0,showPoints:!0,showLegend:!0,showTooltips:!0,xAxisLabel:"Time",yAxisLabel:"Value",fillOpacity:.3,stacked:!1,animationDuration:1e3,loading:!1}},e=[{id:"series1",name:"Revenue",data:[{x:"Jan",y:4e3},{x:"Feb",y:3e3},{x:"Mar",y:5e3},{x:"Apr",y:4500},{x:"May",y:6e3},{x:"Jun",y:5500},{x:"Jul",y:7e3},{x:"Aug",y:6500},{x:"Sep",y:8e3},{x:"Oct",y:7500},{x:"Nov",y:9e3},{x:"Dec",y:8500}],color:"var(--glass-color-primary)"},{id:"series2",name:"Expenses",data:[{x:"Jan",y:2400},{x:"Feb",y:1398},{x:"Mar",y:2800},{x:"Apr",y:3908},{x:"May",y:4800},{x:"Jun",y:3800},{x:"Jul",y:4300},{x:"Aug",y:5200},{x:"Sep",y:4100},{x:"Oct",y:3600},{x:"Nov",y:4900},{x:"Dec",y:4400}],color:"var(--glass-color-danger)"}],s={args:{series:e}},r={args:{series:[e[0]],title:"Revenue Trend"}},a={args:{series:e,stacked:!0,title:"Revenue vs Expenses (Stacked)"}},o={args:{series:[{...e[0],color:"var(--glass-color-success)"},{...e[1],color:"var(--glass-color-warning)"}],title:"Custom Colors"}},t={args:{series:e,showGrid:!1,showLegend:!1,showPoints:!1,title:"Minimal Chart"}},n={args:{series:[{id:"large",name:"Large Dataset",data:Array.from({length:50},(d,c)=>({x:c,y:Math.sin(c*.2)*1e3+Math.random()*500})),color:"#8b5cf6"}],title:"Large Dataset (50 points)",showPoints:!1}},i={args:{loading:!0,title:"Loading Chart"}},l={args:{series:[],title:"No Data Available"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleSeries
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    series: [sampleSeries[0]],
    title: 'Revenue Trend'
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleSeries,
    stacked: true,
    title: 'Revenue vs Expenses (Stacked)'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    series: sampleSeries,
    showGrid: false,
    showLegend: false,
    showPoints: false,
    title: 'Minimal Chart'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    title: 'Loading Chart'
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    series: [],
    title: 'No Data Available'
  }
}`,...l.parameters?.docs?.source}}};const v=["Default","SingleSeries","Stacked","WithCustomColors","Minimal","LargeDataset","Loading","NoData"];export{s as Default,n as LargeDataset,i as Loading,t as Minimal,l as NoData,r as SingleSeries,a as Stacked,o as WithCustomColors,v as __namedExportsOrder,C as default};
