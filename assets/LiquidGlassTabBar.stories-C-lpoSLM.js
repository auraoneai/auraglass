import{j as a}from"./iframe-RsoZoStf.js";import{L as r}from"./LiquidGlassTabBar-B75xejak.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";const t={title:"Navigation/Liquid Glass Tab Bar",component:r,parameters:{layout:"fullscreen",previewSurface:"app"}},e={render:()=>a.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:a.jsx("div",{style:{width:"min(720px, 100%)",minHeight:420,display:"grid",alignItems:"end",padding:28,boxSizing:"border-box",borderRadius:32,background:"linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.12)), linear-gradient(180deg, #f8fafc, #e7ebf0)",boxShadow:"0 24px 80px rgba(15,23,42,.14)"},children:a.jsx(r,{tabs:[{id:"home",label:"Home"},{id:"search",label:"Search"},{id:"library",label:"Library"}],activeTab:"home",searchTabId:"search",minimizeBehavior:"never"})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <div style={{
      width: "min(720px, 100%)",
      minHeight: 420,
      display: "grid",
      alignItems: "end",
      padding: 28,
      boxSizing: "border-box",
      borderRadius: 32,
      background: "linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.12)), linear-gradient(180deg, #f8fafc, #e7ebf0)",
      boxShadow: "0 24px 80px rgba(15,23,42,.14)"
    }}>
        <LiquidGlassTabBar tabs={[{
        id: "home",
        label: "Home"
      }, {
        id: "search",
        label: "Search"
      }, {
        id: "library",
        label: "Library"
      }]} activeTab="home" searchTabId="search" minimizeBehavior="never" />
      </div>
    </div>
}`,...e.parameters?.docs?.source}}};const b=["WithSearchTab"];export{e as WithSearchTab,b as __namedExportsOrder,t as default};
