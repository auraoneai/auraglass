import{j as r}from"./iframe-CdDNbo2v.js";import{F as i}from"./FeatureTile-YxYi4aza.js";import"./preload-helper-PPVm8Dsz.js";import"./ShowcaseCard-BwCuUbQZ.js";/* empty css                  */const c={title:"Marketing/Feature Tile",component:i,parameters:{layout:"padded"},argTypes:{size:{control:"select",options:["sm","md","lg"]},tone:{control:"select",options:["neutral","aurora","success","info","warning"]}}},e={args:{index:"01",title:"Refractive depth",description:"Reusable marketing cards with package-owned token defaults.",tone:"aurora",visual:r.jsx("div",{style:{height:80}})}},t={render:()=>r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:16},children:["SSR safe","Reduced motion","Token driven"].map((a,n)=>r.jsx(i,{index:n+1,title:a,description:"Built for package consumers and homepage composition.",visual:r.jsx("div",{style:{height:72}})},a))})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    index: "01",
    title: "Refractive depth",
    description: "Reusable marketing cards with package-owned token defaults.",
    tone: "aurora",
    visual: <div style={{
      height: 80
    }} />
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16
  }}>
      {["SSR safe", "Reduced motion", "Token driven"].map((title, index) => <FeatureTile key={title} index={index + 1} title={title} description="Built for package consumers and homepage composition." visual={<div style={{
      height: 72
    }} />} />)}
    </div>
}`,...t.parameters?.docs?.source}}};const m=["Default","Grid"];export{e as Default,t as Grid,m as __namedExportsOrder,c as default};
