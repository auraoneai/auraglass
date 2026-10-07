import{f as v}from"./index-DdjpOZjl.js";import{r as m,j as s,c as i}from"./iframe-RsoZoStf.js";import{O as b}from"./OptimizedGlassCore-IzbAukgr.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CB0YcTGX.js";const p=[{id:"canopy",name:"Canopy Habitat",health:82,trend:4,biodiversity:.76,status:"thriving",description:"Tree canopy health and migratory activity."},{id:"understory",name:"Understory",health:68,trend:2,biodiversity:.64,status:"stable",description:"Shade adaptable flora and night fauna patterns."},{id:"forest-floor",name:"Forest Floor",health:54,trend:-3,biodiversity:.49,status:"recovering",description:"Nutrient cycling, soil moisture, decomposer signals."},{id:"riparian",name:"Riparian Basin",health:38,trend:-6,biodiversity:.41,status:"critical",description:"Water table oscillations and aquatic biomes."}],f={thriving:"glass-surface-green/40 border-green-400/40",stable:"glass-surface-blue/30 border-blue-400/30",recovering:"glass-surface-amber/30 border-amber-400/30",critical:"glass-surface-red/30 border-red-400/40"},j={thriving:"Thriving",stable:"Stable",recovering:"Recovering",critical:"Critical"},N=t=>Math.max(0,Math.min(100,t));function g({className:t,title:h="Living Ecosystem Simulator",layers:o=p,onSelectLayer:y,highlightThreshold:x=45}){const d=m.useMemo(()=>(o.length>0?o:p).map(a=>({...a,health:N(a.health),biodiversity:a.biodiversity!==void 0?Math.max(0,Math.min(1,a.biodiversity)):void 0,status:a.status??(a.health>=75?"thriving":a.health>=55?"stable":a.health>=40?"recovering":"critical")})),[o]),r=m.useMemo(()=>{const e=d.reduce((a,c)=>(a.health+=c.health,a.biodiversity+=c.biodiversity??0,a.count+=1,c.status==="critical"&&(a.critical+=1),a),{health:0,biodiversity:0,count:0,critical:0});return{averageHealth:e.count?Math.round(e.health/e.count):0,averageBiodiversity:e.count?e.biodiversity/e.count:0,criticalZones:e.critical}},[d]);return s.jsxs(b,{role:"region","aria-label":h,className:i("glass-radius-3xl glass-border glass-border-soft glass-backdrop-grid glass-p-6 space-y-6","bg-gradient-to-br from-white/10 via-white/5 to-white/8",t),children:[s.jsxs("header",{className:"glass-flex glass-flex-wrap glass-items-end glass-justify-between glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:h}),s.jsx("p",{className:"glass-text-sm glass-text-primary-opacity-70",children:"Real-time biosphere telemetry across layered habitats."})]}),s.jsxs("dl",{className:"glass-flex glass-gap-6 glass-text-sm glass-text-primary-glass-opacity-80",children:[s.jsxs("div",{children:[s.jsx("dt",{className:"glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50",children:"Avg. Health"}),s.jsxs("dd",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:[r.averageHealth,"%"]})]}),s.jsxs("div",{children:[s.jsx("dt",{className:"glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50",children:"Bio-Diversity"}),s.jsxs("dd",{className:"glass-text-lg glass-font-semibold glass-text-primary",children:[(r.averageBiodiversity*100).toFixed(0),"%"]})]}),s.jsxs("div",{children:[s.jsx("dt",{className:"glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50",children:"Critical Zones"}),s.jsx("dd",{className:i("text-lg font-semibold",r.criticalZones>0?"text-red-400":"text-primary"),children:r.criticalZones})]})]})]}),s.jsx("div",{className:"glass-grid glass-gap-4 md:glass-grid-cols-2",children:d.map(e=>{const a=e.health<=x;return s.jsxs("button",{type:"button",onClick:()=>y?.(e),className:i("w-full text-left glass-radius-2xl border glass-border-soft p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 glass-focus glass-touch-target glass-contrast-guard",f[e.status??"stable"],a?"shadow-[0_0_30px_-10px_rgba(248,113,113,0.7)]":"hover:border-white/40",a?"ring-1 ring-red-400/40":void 0),children:[s.jsxs("div",{className:"glass-flex glass-items-start glass-justify-between glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:e.name}),s.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-max-w-xs",children:e.description})]}),s.jsx("span",{className:"glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-90",children:j[e.status??"stable"]})]}),s.jsxs("div",{className:"glass-mt-4 glass-space-y-3",children:[s.jsxs("div",{children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60",children:[s.jsx("span",{children:"Habitat Health"}),s.jsxs("span",{className:i("font-semibold",a?"text-red-300":"text-primary"),children:[e.health,"%"]})]}),s.jsx("div",{className:"glass-mt-2 glass-h-2 glass-w-full glass-overflow-hidden glass-radius-full glass-surface-subtle/10",children:s.jsx("div",{className:i("h-full rounded-full transition-all",a?"bg-red-400/80":"bg-cyan-400/80"),style:{width:`${e.health}%`}})})]}),e.biodiversity!==void 0&&s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60",children:[s.jsx("span",{children:"Biodiversity Index"}),s.jsxs("span",{className:"glass-font-semibold glass-text-primary-glass-opacity-80",children:[(e.biodiversity*100).toFixed(0),"%"]})]}),typeof e.trend=="number"&&s.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["Trend:"," ",s.jsxs("span",{className:e.trend>=0?"text-emerald-300":"text-red-300",children:[e.trend>=0?"+":"",e.trend]})," ","pts"]})]})]},e.id)})})]})}try{g.displayName="LivingEcosystemSimulator",g.__docgenInfo={description:"",displayName:"LivingEcosystemSimulator",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},title:{defaultValue:{value:"Living Ecosystem Simulator"},description:"",name:"title",required:!1,type:{name:"string | undefined"}},layers:{defaultValue:{value:`[
  {
    id: "canopy",
    name: "Canopy Habitat",
    health: 82,
    trend: 4,
    biodiversity: 0.76,
    status: "thriving",
    description: "Tree canopy health and migratory activity.",
  },
  {
    id: "understory",
    name: "Understory",
    health: 68,
    trend: 2,
    biodiversity: 0.64,
    status: "stable",
    description: "Shade adaptable flora and night fauna patterns.",
  },
  {
    id: "forest-floor",
    name: "Forest Floor",
    health: 54,
    trend: -3,
    biodiversity: 0.49,
    status: "recovering",
    description: "Nutrient cycling, soil moisture, decomposer signals.",
  },
  {
    id: "riparian",
    name: "Riparian Basin",
    health: 38,
    trend: -6,
    biodiversity: 0.41,
    status: "critical",
    description: "Water table oscillations and aquatic biomes.",
  },
]`},description:"",name:"layers",required:!1,type:{name:"EcosystemLayer[] | undefined"}},onSelectLayer:{defaultValue:null,description:"",name:"onSelectLayer",required:!1,type:{name:"((layer: EcosystemLayer) => void) | undefined"}},highlightThreshold:{defaultValue:{value:"45"},description:"",name:"highlightThreshold",required:!1,type:{name:"number | undefined"}}}}}catch{}const u=[{id:"cloud-forest",name:"Cloud Forest",health:91,trend:5,biodiversity:.86,status:"thriving",description:"Canopy moisture, pollinator traffic, and nesting density."},{id:"grassland",name:"Open Grassland",health:72,trend:2,biodiversity:.69,status:"stable",description:"Grazing balance, seed dispersal, and soil carbon signals."},{id:"wetland",name:"Coastal Wetland",health:56,trend:-2,biodiversity:.58,status:"recovering",description:"Salinity, tidal exchange, and migratory bird activity."},{id:"coral-shelf",name:"Coral Shelf",health:39,trend:-6,biodiversity:.43,status:"critical",description:"Thermal stress, reef cover, and juvenile fish counts."}],C={title:"Effects + Advanced/Living Ecosystem Simulator",component:g,parameters:{layout:"fullscreen",docs:{description:{component:"Direct rendering of the public LivingEcosystemSimulator export across every supported habitat state."}}},tags:["autodocs"],args:{onSelectLayer:v()},argTypes:{onSelectLayer:{action:void 0},highlightThreshold:{control:{type:"range",min:0,max:100,step:1}}}},l={args:{title:"Living Ecosystem Simulator",layers:u,highlightThreshold:45}},n={args:{title:"Habitat Recovery Program",layers:u.map(t=>({...t,health:Math.min(100,t.health+12),trend:Math.max(1,t.trend??0),status:void 0})),highlightThreshold:45}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Living Ecosystem Simulator",
    layers: representativeLayers,
    highlightThreshold: 45
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Habitat Recovery Program",
    layers: representativeLayers.map(layer => ({
      ...layer,
      health: Math.min(100, layer.health + 12),
      trend: Math.max(1, layer.trend ?? 0),
      status: undefined
    })),
    highlightThreshold: 45
  }
}`,...n.parameters?.docs?.source}}};const M=["Default","RecoveryProgram"];export{l as Default,n as RecoveryProgram,M as __namedExportsOrder,C as default};
