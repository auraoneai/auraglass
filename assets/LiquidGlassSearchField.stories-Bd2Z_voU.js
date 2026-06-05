import{j as r}from"./iframe-DBNhMyqR.js";import{L as a}from"./LiquidGlassSearchField-DeQY7uo7.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-DU2fkJY_.js";import"./LiquidGlassLayerProvider-BIZ5pcBB.js";const d={title:"Controls/Search/Liquid Glass Search Field",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},e={render:()=>r.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"start center",padding:"80px 32px 32px",boxSizing:"border-box"},children:[r.jsx("style",{children:`
        .liquid-search-story-wrap,
        .liquid-search-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-story-wrap { width: 100%; }
        }
      `}),r.jsxs("div",{className:"liquid-search-story-wrap",style:{width:"min(640px, 100%)",display:"grid",gap:16,borderRadius:30,padding:24,background:"rgba(255,255,255,.82)",boxShadow:"0 24px 80px rgba(15,23,42,.14)",color:"#0f172a"},children:[r.jsx("h2",{style:{margin:0,fontSize:22},children:"Command search"}),r.jsx(a,{className:"liquid-search-story",placeholder:"Search workspace",scope:"Aura",results:[{id:"one",label:"Dashboard",description:"Open overview"},{id:"two",label:"Media",description:"Review current exports"},{id:"three",label:"Settings",description:"Adjust Liquid Glass policy"}],suggestions:["Dashboard","Media","Settings"]})]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "start center",
    padding: "80px 32px 32px",
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-search-story-wrap,
        .liquid-search-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-story-wrap { width: 100%; }
        }
      \`}</style>
      <div className="liquid-search-story-wrap" style={{
      width: "min(640px, 100%)",
      display: "grid",
      gap: 16,
      borderRadius: 30,
      padding: 24,
      background: "rgba(255,255,255,.82)",
      boxShadow: "0 24px 80px rgba(15,23,42,.14)",
      color: "#0f172a"
    }}>
        <h2 style={{
        margin: 0,
        fontSize: 22
      }}>Command search</h2>
        <LiquidGlassSearchField className="liquid-search-story" placeholder="Search workspace" scope="Aura" results={[{
        id: "one",
        label: "Dashboard",
        description: "Open overview"
      }, {
        id: "two",
        label: "Media",
        description: "Review current exports"
      }, {
        id: "three",
        label: "Settings",
        description: "Adjust Liquid Glass policy"
      }]} suggestions={["Dashboard", "Media", "Settings"]} />
      </div>
    </div>
}`,...e.parameters?.docs?.source}}};const l=["Default"];export{e as Default,l as __namedExportsOrder,d as default};
