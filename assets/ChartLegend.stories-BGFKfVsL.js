import{j as e,C as f,ah as x}from"./iframe-CtRSFJTE.js";import{a as b,D as v}from"./chartColors-BWAT40aU.js";import"./preload-helper-PPVm8Dsz.js";const r=({datasets:a=[],position:s="top",style:l="default",glassEffect:o=!1,interactive:i=!1,onItemClick:p,children:g,className:u})=>{const m={display:"flex",flexWrap:"wrap",gap:l==="compact"?"8px":"12px",maxWidth:"100%",boxSizing:"border-box",padding:l==="compact"?"10px":"12px",background:o?"linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.46))":"transparent",borderRadius:o?"var(--glass-radius-md)":"0",border:o?"1px solid rgba(15, 23, 42, 0.14)":"none",boxShadow:o?"inset 0 1px 0 rgba(255,255,255,0.72), 0 12px 34px rgba(15,23,42,0.12)":"none",color:"var(--glass-text-primary, #0f172a)",marginBottom:s==="top"?"16px":"0",marginTop:s==="bottom"?"16px":"0",marginRight:s==="left"?"16px":"0",marginLeft:s==="right"?"16px":"0",flexDirection:s==="left"||s==="right"?"column":"row",alignItems:"center",justifyContent:s==="left"||s==="right"?"flex-start":"center",overflowX:"auto"};return g?e.jsx(f,{as:"div",level:"AA",style:{...m},className:u,children:g}):e.jsx(f,{as:"div",level:"AA","data-glass-component":!0,style:{...m},className:u,children:a.map((t,n)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",minWidth:0,maxWidth:"100%",opacity:t.hidden?.5:1,cursor:i?"pointer":"default",padding:l==="minimal"?"2px 0":"4px 6px"},onClick:y=>i&&p&&p(n),role:i?"button":void 0,"aria-label":i?`Toggle ${t.label||`Dataset ${n+1}`} visibility`:void 0,tabIndex:i?0:void 0,children:[e.jsx("div",{style:{width:l==="compact"?"8px":"12px",height:l==="compact"?"8px":"12px",borderRadius:"var(--glass-radius-sm)",background:b(t.backgroundColor||t.borderColor,v[n%v.length]),border:"1px solid var(--glass-border-subtle)"}}),e.jsx(x,{as:"span",style:{fontSize:l==="compact"?"11px":"12px",color:o?"var(--glass-text-primary)":"inherit",fontWeight:"var(--typography-subheading-weight)",whiteSpace:"nowrap"},children:t.label||`Dataset ${n+1}`})]},t.id||n))})};try{r.displayName="ChartLegend",r.__docgenInfo={description:"",displayName:"ChartLegend",props:{datasets:{defaultValue:{value:"[]"},description:"",name:"datasets",required:!1,type:{name:"any[] | undefined"}},position:{defaultValue:{value:"top"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"bottom"'},{value:'"top"'}]}},style:{defaultValue:{value:"default"},description:"",name:"style",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"compact"'},{value:'"minimal"'}]}},glassEffect:{defaultValue:{value:"false"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"false"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((datasetIndex: number) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const j={title:"Data + Visualization/Chart Legend",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism chartlegend component."}}},argTypes:{position:{control:{type:"select"},options:["top","bottom","left","right"],description:"Legend position"},style:{control:{type:"select"},options:["default","compact","minimal"],description:"Legend style"},glassEffect:{control:"boolean",description:"Enable glass effect"},interactive:{control:"boolean",description:"Enable interactivity"}},args:{position:"top",style:"default",glassEffect:!0,interactive:!1}},d={render:a=>e.jsx("div",{className:"glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(720px, calc(100vw - 48px))",overflowX:"auto"},children:e.jsx(r,{...a})}),args:{datasets:[{label:"Dataset 1",color:"var(--glass-color-primary)"},{label:"Dataset 2",color:"var(--glass-color-danger)"},{label:"Dataset 3",color:"var(--glass-color-success)"}]}},c={render:a=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-6 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",style:{width:"min(760px, calc(100vw - 48px))",overflowX:"auto"},children:[e.jsx(r,{...a,position:"top",style:"default"}),e.jsx(r,{...a,position:"bottom",style:"compact"}),e.jsx(r,{...a,position:"left",style:"minimal"})]}),args:{datasets:[{label:"Revenue",color:"var(--glass-color-primary)"},{label:"Profit",color:"var(--glass-color-success)"},{label:"Expenses",color:"var(--glass-color-danger)"}]}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5" style={{
    width: "min(720px, calc(100vw - 48px))",
    overflowX: "auto"
  }}>
      <ChartLegend {...args} />
    </div>,
  args: {
    datasets: [{
      label: 'Dataset 1',
      color: 'var(--glass-color-primary)'
    }, {
      label: 'Dataset 2',
      color: 'var(--glass-color-danger)'
    }, {
      label: 'Dataset 3',
      color: 'var(--glass-color-success)'
    }]
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-6 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5" style={{
    width: "min(760px, calc(100vw - 48px))",
    overflowX: "auto"
  }}>
      <ChartLegend {...args} position="top" style="default" />
      <ChartLegend {...args} position="bottom" style="compact" />
      <ChartLegend {...args} position="left" style="minimal" />
    </div>,
  args: {
    datasets: [{
      label: 'Revenue',
      color: 'var(--glass-color-primary)'
    }, {
      label: 'Profit',
      color: 'var(--glass-color-success)'
    }, {
      label: 'Expenses',
      color: 'var(--glass-color-danger)'
    }]
  }
}`,...c.parameters?.docs?.source}}};const D=["Default","Variants"];export{d as Default,c as Variants,D as __namedExportsOrder,j as default};
