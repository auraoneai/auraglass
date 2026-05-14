import{j as a}from"./iframe-D2N3vCdj.js";import{L as i}from"./LiquidGlassNowPlayingBar-DLJcOZQ6.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassBottomAccessory-DlCy71Wz.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";const s={title:"Media/Liquid Glass Now Playing Bar",component:i,parameters:{layout:"fullscreen",previewSurface:"media"}},n={render:()=>a.jsxs("div",{className:"ag-now-playing-stage",style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[a.jsx("style",{children:`
          .ag-now-playing-stage .liquid-glass-now-playing-bar,
          .ag-now-playing-stage .liquid-glass-now-playing-bar button {
            color: #f8fafc;
            -webkit-text-fill-color: currentColor;
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar .glass-text-secondary {
            color: #dbeafe !important;
            -webkit-text-fill-color: #dbeafe;
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar button[aria-label] {
            color: #0f172a;
            -webkit-text-fill-color: #0f172a;
          }
        `}),a.jsx("div",{style:{width:"min(760px, 100%)",minHeight:420,display:"grid",alignItems:"end",padding:28,boxSizing:"border-box",borderRadius:32,background:"radial-gradient(circle at 24% 24%, rgba(147,197,253,.58), transparent 26%), radial-gradient(circle at 78% 66%, rgba(45,212,191,.44), transparent 28%), linear-gradient(135deg, #0f172a, #1d4ed8 48%, #0f766e)",boxShadow:"0 28px 90px rgba(2,6,23,.34)"},children:a.jsx(i,{title:"Liquid Study",subtitle:"Aura System",progress:.42,artwork:a.jsx("div",{style:{width:"100%",height:"100%",background:"linear-gradient(135deg, #1d4ed8, #14b8a6)"}})})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="ag-now-playing-stage" style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>
        {\`
          .ag-now-playing-stage .liquid-glass-now-playing-bar,
          .ag-now-playing-stage .liquid-glass-now-playing-bar button {
            color: #f8fafc;
            -webkit-text-fill-color: currentColor;
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar .glass-text-secondary {
            color: #dbeafe !important;
            -webkit-text-fill-color: #dbeafe;
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar button[aria-label] {
            color: #0f172a;
            -webkit-text-fill-color: #0f172a;
          }
        \`}
      </style>
      <div style={{
      width: "min(760px, 100%)",
      minHeight: 420,
      display: "grid",
      alignItems: "end",
      padding: 28,
      boxSizing: "border-box",
      borderRadius: 32,
      background: "radial-gradient(circle at 24% 24%, rgba(147,197,253,.58), transparent 26%), radial-gradient(circle at 78% 66%, rgba(45,212,191,.44), transparent 28%), linear-gradient(135deg, #0f172a, #1d4ed8 48%, #0f766e)",
      boxShadow: "0 28px 90px rgba(2,6,23,.34)"
    }}>
        <LiquidGlassNowPlayingBar title="Liquid Study" subtitle="Aura System" progress={0.42} artwork={<div style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1d4ed8, #14b8a6)"
      }} />} />
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};const g=["Default"];export{n as Default,g as __namedExportsOrder,s as default};
