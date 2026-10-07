import{r as t,j as s}from"./iframe-Cqi-9gHA.js";import{L as o}from"./LiquidGlassBadgeCluster-BJKQO8Hv.js";import{L as d}from"./LiquidGlassMediaControls-DX-Wi0KG.js";import{L as n}from"./LiquidGlassNowPlayingBar-I3d2qNY8.js";import{L as g}from"./LiquidGlassInsetSidebar-Q6Gg70B4.js";import{L as c}from"./LiquidGlassTabBar-VeOQeyhw.js";import{L as u}from"./LiquidGlassToolbar-sSj0nL2P.js";import{L as p}from"./LiquidGlassSearchField-CqCzBaMI.js";import{L as h}from"./LiquidGlassAdaptiveSheet-BG8sRNvU.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./LiquidGlassBottomAccessory-Ce4AqysV.js";import"./LiquidGlassScrollEdge-kV_JXW4I.js";function m(){const[i,e]=t.useState("home"),[r,l]=t.useState(!1);return s.jsxs("div",{className:"liquid-glass-showcase","data-bg":"light","data-liquid-glass-showcase":"true",style:{position:"relative",minHeight:"100vh",padding:28,boxSizing:"border-box",overflow:"hidden",color:"#0f172a",background:"linear-gradient(135deg, #eeeeee 0%, #fafafa 46%, #f1f1f1 100%)"},children:[s.jsx("style",{children:`
        .liquid-glass-showcase {
          --glass-text-primary: rgba(15, 23, 42, 0.92);
          --glass-text-secondary: rgba(71, 85, 105, 0.92);
          --glass-text-tertiary: rgba(100, 116, 139, 0.9);
        }

        .liquid-glass-showcase-now-playing,
        .liquid-glass-showcase-now-playing * {
          color: rgba(15, 23, 42, 0.92) !important;
        }

        .liquid-glass-showcase .liquid-glass-material {
          background-color: rgba(255, 255, 255, 0.24) !important;
          background-image: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.16)
          ) !important;
          border-color: rgba(255, 255, 255, 0.48) !important;
          box-shadow:
            0 18px 52px rgba(24, 24, 27, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;
        }

        .liquid-glass-showcase .liquid-glass-range::-webkit-slider-thumb {
          background: #737373 !important;
          box-shadow: 0 2px 8px rgba(24, 24, 27, 0.2) !important;
        }

        .liquid-glass-showcase .liquid-glass-range::-moz-range-thumb {
          background: #737373 !important;
          box-shadow: 0 2px 8px rgba(24, 24, 27, 0.2) !important;
        }

        .liquid-glass-showcase .liquid-glass-badge-cluster {
          backdrop-filter: blur(24px) saturate(1.5) brightness(1.04) contrast(1.02) !important;
          -webkit-backdrop-filter: blur(24px) saturate(1.5) brightness(1.04) contrast(1.02) !important;
        }

        .liquid-glass-showcase-layout {
          grid-template-columns: 260px minmax(0, 1fr);
          height: calc(100vh - 56px);
        }

        .liquid-glass-showcase-content {
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
        }

        @media (max-width: 820px) {
          .liquid-glass-showcase {
            padding: 18px;
            height: 100vh;
            min-height: 0 !important;
            overflow: hidden;
          }

          .liquid-glass-showcase-layout {
            height: calc(100vh - 36px);
            min-height: 0 !important;
          }

          .liquid-glass-showcase-layout > aside {
            display: none;
          }

          .liquid-glass-showcase-layout,
          .liquid-glass-showcase-content {
            grid-template-columns: 1fr;
          }

          .liquid-glass-showcase main,
          .liquid-glass-showcase section,
          .liquid-glass-showcase .liquid-glass-toolbar,
          .liquid-glass-showcase .liquid-glass-tab-bar,
          .liquid-glass-showcase .liquid-glass-now-playing-bar,
          .liquid-glass-showcase .liquid-glass-media-controls {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
          }

          .liquid-glass-showcase main {
            height: 100%;
            overflow: hidden;
          }

          .liquid-glass-showcase-content {
            min-height: 0 !important;
            overflow: hidden;
          }

          .liquid-glass-showcase-content > div:first-child {
            min-height: 0 !important;
          }

          .liquid-glass-showcase .liquid-glass-toolbar > * > div {
            flex-direction: column;
            align-items: stretch;
          }

          .liquid-glass-showcase .liquid-glass-toolbar .liquid-glass-content > div {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: start;
          }

          .liquid-glass-showcase .liquid-glass-toolbar .liquid-glass-content > div > :nth-child(2) {
            grid-column: 1 / -1;
            grid-row: 2;
            width: 100%;
            overflow: visible;
          }

          .liquid-glass-showcase .liquid-glass-toolbar .liquid-glass-effect-group {
            display: none;
          }

          .liquid-glass-showcase .liquid-glass-showcase-title {
            min-width: 0 !important;
          }

          .liquid-glass-showcase .liquid-glass-toolbar input,
          .liquid-glass-showcase .liquid-glass-toolbar .liquid-glass-search-field,
          .liquid-glass-showcase .liquid-glass-toolbar [role="search"] {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .liquid-glass-showcase .liquid-glass-toolbar .liquid-glass-search-field {
            flex: 1 1 100%;
            min-width: 100% !important;
          }

          .liquid-glass-showcase .liquid-glass-media-controls > div {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
          }

          .liquid-glass-showcase .liquid-glass-media-controls input[type="range"] {
            width: 100%;
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .liquid-glass-showcase .liquid-glass-now-playing-bar {
            flex-wrap: wrap;
          }

          .liquid-glass-showcase .liquid-glass-badge-cluster {
            display: block;
            border-radius: 24px !important;
            overflow: visible !important;
          }

          .liquid-glass-showcase .liquid-glass-badge-cluster .liquid-glass-effect-group {
            display: flex;
            flex-wrap: wrap;
          }
        }
      `}),s.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(145deg, rgba(255,255,255,0.24), rgba(255,255,255,0.10))"}}),s.jsxs("div",{className:"liquid-glass-showcase-layout",style:{position:"relative",display:"grid",gap:24,minHeight:"calc(100vh - 56px)"},children:[s.jsx(g,{items:[{id:"home",label:"Home",badge:"Live"},{id:"media",label:"Media"},{id:"settings",label:"Settings"}],selectedId:i,onSelect:e,style:{width:"100%",minHeight:"100%"}}),s.jsxs("main",{style:{display:"grid",gridTemplateRows:"auto minmax(0, 1fr) auto",gap:20,minWidth:0},children:[s.jsx(u,{floating:!0,scrollEdge:"soft",left:s.jsxs("div",{className:"liquid-glass-showcase-title",style:{minWidth:170},children:[s.jsx("strong",{style:{display:"block",fontSize:16},children:"Aura Liquid Glass"}),s.jsx("span",{style:{display:"block",fontSize:12,color:"#475569"},children:"Production app chrome"})]}),center:s.jsx(p,{placeholder:"Search surfaces",style:{width:"min(280px, 100%)"}}),right:s.jsx("button",{type:"button",className:"liquid-glass-showcase-action glass-button glass-overlay-specular",onClick:()=>l(!0),style:{appearance:"none",border:0,borderRadius:999,background:"var(--glass-primary-level2-surface)",color:"#0f172a",cursor:"pointer",font:"inherit",padding:"7px 14px",boxShadow:"inset 0 1px 0 rgba(255,255,255,.48), 0 8px 20px rgba(15,23,42,.12)"},children:"Open"}),groups:[{id:"view",items:[{id:"grid",label:"Grid"},{id:"list",label:"List"}]}]}),s.jsxs("section",{className:"liquid-glass-showcase-content",style:{display:"grid",gap:20,minHeight:0},children:[s.jsx("div",{style:{minHeight:360,borderRadius:28,padding:20,display:"flex",alignItems:"flex-end",background:"radial-gradient(circle at 24% 18%, rgba(255,255,255,.72), transparent 34%), linear-gradient(135deg, #dedede 0%, #fafafa 48%, #d4d4d4 100%)",boxShadow:"0 24px 80px rgba(24, 24, 27, 0.16)"},children:s.jsx(d,{playing:!1,duration:100,currentTime:40})}),s.jsxs("div",{style:{display:"grid",gap:16,alignContent:"start"},children:[s.jsx(o,{expanded:!0,items:[{id:"a",label:"Adaptive"},{id:"b",label:"Grouped"},{id:"c",label:"Accessible"},{id:"d",label:"Motion-safe"}]}),s.jsxs("div",{style:{borderRadius:24,padding:18,background:"linear-gradient(145deg, rgba(255,255,255,.36), rgba(255,255,255,.18))",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.66)"},children:[s.jsx("h2",{style:{margin:0,fontSize:18},children:"Surface intelligence"}),s.jsx("p",{style:{margin:"8px 0 0",color:"#475569"},children:"Liquid Glass groups navigation, media, search, and transient UI without making content hard to read."}),s.jsxs("div",{role:"listbox","aria-label":"Available surface views",style:{display:"flex",gap:8,marginTop:14},children:[s.jsx("span",{role:"option","aria-selected":"true",className:"glass-radius-full glass-px-3 glass-py-1 glass-text-xs glass-neutral-level1",children:"Overview"}),s.jsx("span",{role:"option","aria-selected":"false",className:"glass-radius-full glass-px-3 glass-py-1 glass-text-xs glass-neutral-level1",children:"Materials"})]})]})]})]}),s.jsx("div",{style:{maxWidth:680,margin:"0 auto",width:"100%"},children:s.jsx(c,{tabs:[{id:"home",label:"Home"},{id:"media",label:"Media"},{id:"search",label:"Search"}],activeTab:i,onChange:e,minimizeBehavior:"never",searchTabId:"search",bottomAccessory:s.jsx(n,{className:"liquid-glass-showcase-now-playing",title:"Liquid Study",subtitle:"Aura System",progress:.42,style:{color:"#0f172a","--glass-text-primary":"rgba(15, 23, 42, 0.92)","--glass-text-secondary":"rgba(51, 65, 85, 0.9)"}})})})]})]}),s.jsx(h,{open:r,onOpenChange:l,title:"Source Sheet",children:s.jsx("p",{children:"This sheet demonstrates an adaptive Liquid Glass presentation surface."})})]})}const T={title:"Showcases/Liquid Glass Showcase",component:m,parameters:{layout:"fullscreen",previewSurface:"app"}},a={};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};const z=["AppExperience"];export{a as AppExperience,z as __namedExportsOrder,T as default};
