import{r,j as e}from"./iframe-CWR0-zUi.js";import{L as o}from"./LiquidGlassBadgeCluster-DxDbhmmR.js";import{L as d}from"./LiquidGlassMediaControls-DmD6Jke-.js";import{L as n}from"./LiquidGlassNowPlayingBar-XoyaWNSv.js";import{L as c}from"./LiquidGlassInsetSidebar-C52Dni3b.js";import{L as p}from"./LiquidGlassTabBar-DzDgkvYq.js";import{L as m}from"./LiquidGlassToolbar-Bd6Wm6P2.js";import{L as g}from"./LiquidGlassSearchField-BvfV2Q4l.js";import{L as u}from"./LiquidGlassAdaptiveSheet-6LWiUBTu.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-C3sWBx_W.js";import"./LiquidGlassLayerProvider-CP44SBEZ.js";import"./LiquidGlassBottomAccessory-JhlxbdXL.js";import"./LiquidGlassScrollEdge-CH_0p9BN.js";function h(){const[i,a]=r.useState("home"),[l,t]=r.useState(!1);return e.jsxs("div",{className:"liquid-glass-showcase","data-bg":"light","data-liquid-glass-showcase":"true",style:{position:"relative",minHeight:"100vh",padding:28,boxSizing:"border-box",overflow:"hidden",color:"#0f172a",background:"linear-gradient(135deg, #eef6ff 0%, #f8fbff 42%, #effdf8 100%)"},children:[e.jsx("style",{children:`
        .liquid-glass-showcase {
          --glass-text-primary: rgba(15, 23, 42, 0.92);
          --glass-text-secondary: rgba(71, 85, 105, 0.92);
          --glass-text-tertiary: rgba(100, 116, 139, 0.9);
        }

        .liquid-glass-showcase-layout {
          grid-template-columns: 260px minmax(0, 1fr);
        }

        .liquid-glass-showcase-content {
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
        }

        @media (max-width: 820px) {
          .liquid-glass-showcase {
            padding: 18px;
            overflow: auto;
          }

          .liquid-glass-showcase-layout,
          .liquid-glass-showcase-content {
            grid-template-columns: 1fr;
          }
        }
      `}),e.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,pointerEvents:"none",background:'/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */'}}),e.jsxs("div",{className:"liquid-glass-showcase-layout",style:{position:"relative",display:"grid",gap:24,minHeight:"calc(100vh - 56px)"},children:[e.jsx(c,{items:[{id:"home",label:"Home",badge:"Live"},{id:"media",label:"Media"},{id:"settings",label:"Settings"}],selectedId:i,onSelect:a,style:{width:"100%",minHeight:"100%"}}),e.jsxs("main",{style:{display:"grid",gridTemplateRows:"auto minmax(0, 1fr) auto",gap:20,minWidth:0},children:[e.jsx(m,{floating:!0,scrollEdge:"soft",left:e.jsxs("div",{style:{minWidth:170},children:[e.jsx("strong",{style:{display:"block",fontSize:16},children:"Aura Liquid Glass"}),e.jsx("span",{style:{display:"block",fontSize:12,color:"#475569"},children:"Production app chrome"})]}),center:e.jsx(g,{placeholder:"Search surfaces",scope:"Workspace",style:{width:280}}),right:e.jsx("button",{type:"button",onClick:()=>t(!0),style:{border:0,borderRadius:999,background:'/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',color:"#0f172a",cursor:"pointer",font:"inherit",padding:"7px 14px"},children:"Open"}),groups:[{id:"view",items:[{id:"grid",label:"Grid"},{id:"list",label:"List"}]}]}),e.jsxs("section",{className:"liquid-glass-showcase-content",style:{display:"grid",gap:20,minHeight:0},children:[e.jsx("div",{style:{minHeight:360,borderRadius:28,padding:20,display:"flex",alignItems:"flex-end",background:"linear-gradient(135deg, #1d4ed8 0%, #2563eb 38%, #14b8a6 100%)",boxShadow:"0 24px 80px rgba(15, 23, 42, 0.18)"},children:e.jsx(d,{playing:!1,duration:100,currentTime:40})}),e.jsxs("div",{style:{display:"grid",gap:16,alignContent:"start"},children:[e.jsx(o,{expanded:!0,items:[{id:"a",label:"Adaptive"},{id:"b",label:"Grouped"},{id:"c",label:"Accessible"},{id:"d",label:"Motion-safe"}]}),e.jsxs("div",{style:{borderRadius:24,padding:18,background:'/* Use createGlassStyle({ intent: "neutral", elevation: "level3" }) */',boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.66)"},children:[e.jsx("h2",{style:{margin:0,fontSize:18},children:"Surface intelligence"}),e.jsx("p",{style:{margin:"8px 0 0",color:"#475569"},children:"Liquid Glass groups navigation, media, search, and transient UI without making content hard to read."})]})]})]}),e.jsx("div",{style:{maxWidth:680,margin:"0 auto",width:"100%"},children:e.jsx(p,{tabs:[{id:"home",label:"Home"},{id:"media",label:"Media"},{id:"search",label:"Search"}],activeTab:i,onChange:a,minimizeBehavior:"never",searchTabId:"search",bottomAccessory:e.jsx(n,{className:"liquid-glass-showcase-now-playing",title:"Liquid Study",subtitle:"Aura System",progress:.42,style:{color:"#f8fafc","--glass-text-secondary":"rgba(226, 232, 240, 0.88)"}})})})]})]}),e.jsx(u,{open:l,onOpenChange:t,title:"Source Sheet",children:e.jsx("p",{children:"This sheet demonstrates an adaptive Liquid Glass presentation surface."})})]})}const E={title:"Showcases/Liquid Glass Showcase",component:h,parameters:{layout:"fullscreen",previewSurface:"app"}},s={};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"{}",...s.parameters?.docs?.source}}};const H=["AppExperience"];export{s as AppExperience,H as __namedExportsOrder,E as default};
