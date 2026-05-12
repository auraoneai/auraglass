import{r as l,j as e}from"./iframe-C_vLCgmV.js";import{L as d}from"./LiquidGlassSearchField-ftLnl0jn.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-BcA2rjwO.js";import"./LiquidGlassLayerProvider-C85Vz4rQ.js";const a=l.forwardRef(({active:r=!0,tabId:i="search",...t},s)=>r?e.jsx(d,{ref:s,placement:"bottom","data-liquid-glass-search-tab":i,...t}):null);a.displayName="LiquidGlassSearchTab";try{a.displayName="LiquidGlassSearchTab",a.__docgenInfo={description:"",displayName:"LiquidGlassSearchTab",props:{active:{defaultValue:{value:"true"},description:"",name:"active",required:!1,type:{name:"boolean | undefined"}},tabId:{defaultValue:{value:"search"},description:"",name:"tabId",required:!1,type:{name:"string | undefined"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string | undefined"}},onValueChange:{defaultValue:null,description:"",name:"onValueChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((result: LiquidGlassSearchResult) => void) | undefined"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string | undefined"}},placement:{defaultValue:null,description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"center"'},{value:'"auto"'},{value:'"bottom"'},{value:'"top-trailing"'}]}},minimized:{defaultValue:null,description:"",name:"minimized",required:!1,type:{name:"boolean | undefined"}},onMinimizedChange:{defaultValue:null,description:"",name:"onMinimizedChange",required:!1,type:{name:"((minimized: boolean) => void) | undefined"}},suggestions:{defaultValue:null,description:"",name:"suggestions",required:!1,type:{name:"string[] | undefined"}},results:{defaultValue:null,description:"",name:"results",required:!1,type:{name:"LiquidGlassSearchResult[] | undefined"}},scope:{defaultValue:null,description:"",name:"scope",required:!1,type:{name:"string | undefined"}}}}}catch{}const b={title:"Controls/Search/Liquid Glass Search Tab",component:a,parameters:{layout:"fullscreen",previewSurface:"app"}},n={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"start center",padding:"80px 32px 32px",boxSizing:"border-box"},children:[e.jsx("style",{children:`
        .liquid-search-tab-story-wrap,
        .liquid-search-tab-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-tab-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-tab-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-tab-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-tab-story-wrap { width: 100%; }
        }
      `}),e.jsxs("div",{className:"liquid-search-tab-story-wrap",style:{width:"min(640px, 100%)",display:"grid",gap:16,borderRadius:30,padding:24,background:"rgba(255,255,255,.82)",boxShadow:"0 24px 80px rgba(15,23,42,.14)",color:"#0f172a"},children:[e.jsx("h2",{style:{margin:0,fontSize:22},children:"Search tab surface"}),e.jsx(a,{className:"liquid-search-tab-story",active:!0,placeholder:"Find in library",results:[{id:"a",label:"Find item",description:"Recent result"},{id:"b",label:"Final export",description:"Media collection"}],suggestions:["Find item","Final export"]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "start center",
    padding: "80px 32px 32px",
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-search-tab-story-wrap,
        .liquid-search-tab-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-tab-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-tab-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-tab-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-tab-story-wrap { width: 100%; }
        }
      \`}</style>
      <div className="liquid-search-tab-story-wrap" style={{
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
      }}>Search tab surface</h2>
        <LiquidGlassSearchTab className="liquid-search-tab-story" active placeholder="Find in library" results={[{
        id: "a",
        label: "Find item",
        description: "Recent result"
      }, {
        id: "b",
        label: "Final export",
        description: "Media collection"
      }]} suggestions={["Find item", "Final export"]} />
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};const h=["Active"];export{n as Active,h as __namedExportsOrder,b as default};
