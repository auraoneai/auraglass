import{j as e,C as f,ao as v}from"./iframe-mbNquNNc.js";import"./preload-helper-PPVm8Dsz.js";const l=({datasets:s=[],position:a="top",style:o="default",glassEffect:n=!1,interactive:r=!1,onItemClick:p,children:u,className:g})=>{const m={display:"flex",flexWrap:"wrap",gap:o==="compact"?"8px":"12px",padding:"8px",background:n?"var(--glass-bg-default)":"transparent",borderRadius:n?"var(--glass-radius-md)":"0",border:n?'1px solid ${glassStyles.surface?.base || "var(--glass-bg-default)"}':"none",marginBottom:a==="top"?"16px":"0",marginTop:a==="bottom"?"16px":"0",marginRight:a==="left"?"16px":"0",marginLeft:a==="right"?"16px":"0",flexDirection:a==="left"||a==="right"?"column":"row",alignItems:"center",justifyContent:a==="left"||a==="right"?"flex-start":"center"};return u?e.jsx(f,{as:"div",level:"AA",style:{...m},className:g,children:u}):e.jsx(f,{as:"div",level:"AA","data-glass-component":!0,style:{...m},className:g,children:s.map((t,i)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",opacity:t.hidden?.5:1,cursor:r?"pointer":"default"},onClick:y=>r&&p&&p(i),role:r?"button":void 0,"aria-label":r?`Toggle ${t.label||`Dataset ${i+1}`} visibility`:void 0,tabIndex:r?0:void 0,children:[e.jsx("div",{style:{width:o==="compact"?"8px":"12px",height:o==="compact"?"8px":"12px",borderRadius:"var(--glass-radius-sm)",background:t.backgroundColor||t.borderColor||"var(--glass-color-primary)",border:"1px solid var(--glass-border-subtle)"}}),e.jsx(v,{as:"span",style:{fontSize:o==="compact"?"11px":"12px",color:n?"var(--glass-text-primary)":"inherit",fontWeight:"var(--typography-subheading-weight)",whiteSpace:"nowrap"},children:t.label||`Dataset ${i+1}`})]},t.id||i))})};try{l.displayName="ChartLegend",l.__docgenInfo={description:"",displayName:"ChartLegend",props:{datasets:{defaultValue:{value:"[]"},description:"",name:"datasets",required:!1,type:{name:"any[] | undefined"}},position:{defaultValue:{value:"top"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"top"'},{value:'"bottom"'}]}},style:{defaultValue:{value:"default"},description:"",name:"style",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"minimal"'},{value:'"compact"'}]}},glassEffect:{defaultValue:{value:"false"},description:"",name:"glassEffect",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"false"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((datasetIndex: number) => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const h={title:"Components/Components/ChartLegend",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism chartlegend component."}}},argTypes:{position:{control:{type:"select"},options:["top","bottom","left","right"],description:"Legend position"},style:{control:{type:"select"},options:["default","compact","minimal"],description:"Legend style"},glassEffect:{control:"boolean",description:"Enable glass effect"},interactive:{control:"boolean",description:"Enable interactivity"}},args:{position:"top",style:"default",glassEffect:!0,interactive:!1}},c={args:{datasets:[{label:"Dataset 1",color:"var(--glass-color-primary)"},{label:"Dataset 2",color:"var(--glass-color-danger)"},{label:"Dataset 3",color:"var(--glass-color-success)"}]}},d={render:s=>e.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-8",children:[e.jsx(l,{...s,position:"top",style:"default"}),e.jsx(l,{...s,position:"bottom",style:"compact"}),e.jsx(l,{...s,position:"left",style:"minimal"})]}),args:{datasets:[{label:"Revenue",color:"var(--glass-color-primary)"},{label:"Profit",color:"var(--glass-color-success)"},{label:"Expenses",color:"var(--glass-color-danger)"}]}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-col glass-gap-8">
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
}`,...d.parameters?.docs?.source}}};const C=["Default","Variants"];export{c as Default,d as Variants,C as __namedExportsOrder,h as default};
