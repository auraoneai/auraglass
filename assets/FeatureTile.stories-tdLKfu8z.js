import{r as g,j as e,c as f}from"./iframe-D2N3vCdj.js";import{S as v}from"./ShowcaseCard-ByFw4cNt.js";/* empty css                  */import"./preload-helper-PPVm8Dsz.js";const h={neutral:"subtle",aurora:"aurora",success:"subtle",info:"subtle",warning:"subtle"},t=g.forwardRef(({index:a,title:n,description:l,visual:d,size:s="md",tone:o="neutral",className:u,children:c,...m},p)=>e.jsxs(v,{ref:p,"data-size":s,"data-tone":o,glow:h[o],padding:s==="sm"?"sm":s==="lg"?"lg":"md",className:f("ag-feature-tile",u),...m,children:[e.jsxs("div",{className:"ag-feature-tile__header",children:[a!==void 0&&e.jsx("span",{className:"ag-feature-tile__index",children:a}),e.jsx("h3",{className:"ag-feature-tile__title",children:n})]}),l&&e.jsx("p",{className:"ag-feature-tile__description",children:l}),d&&e.jsx("div",{className:"ag-feature-tile__visual",children:d}),c]}));t.displayName="FeatureTile";try{t.displayName="FeatureTile",t.__docgenInfo={description:"",displayName:"FeatureTile",props:{index:{defaultValue:null,description:"",name:"index",required:!1,type:{name:"string | number | undefined"}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"ReactNode"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"ReactNode"}},visual:{defaultValue:null,description:"",name:"visual",required:!1,type:{name:"ReactNode"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},tone:{defaultValue:{value:"neutral"},description:"",name:"tone",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"aurora"'},{value:'"success"'},{value:'"warning"'},{value:'"neutral"'},{value:'"info"'}]}}}}}catch{}const j={title:"Marketing/Feature Tile",component:t,parameters:{layout:"padded"},argTypes:{size:{control:"select",options:["sm","md","lg"]},tone:{control:"select",options:["neutral","aurora","success","info","warning"]}}},r={args:{index:"01",title:"Refractive depth",description:"Reusable marketing cards with package-owned token defaults.",tone:"aurora",visual:e.jsx("div",{style:{height:80}})}},i={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:16},children:["SSR safe","Reduced motion","Token driven"].map((a,n)=>e.jsx(t,{index:n+1,title:a,description:"Built for package consumers and homepage composition.",visual:e.jsx("div",{style:{height:72}})},a))})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    index: "01",
    title: "Refractive depth",
    description: "Reusable marketing cards with package-owned token defaults.",
    tone: "aurora",
    visual: <div style={{
      height: 80
    }} />
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16
  }}>
      {["SSR safe", "Reduced motion", "Token driven"].map((title, index) => <FeatureTile key={title} index={index + 1} title={title} description="Built for package consumers and homepage composition." visual={<div style={{
      height: 72
    }} />} />)}
    </div>
}`,...i.parameters?.docs?.source}}};const k=["Default","Grid"];export{r as Default,i as Grid,k as __namedExportsOrder,j as default};
