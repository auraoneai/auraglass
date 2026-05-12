import{r as p,j as a,c}from"./iframe-D5XNSE8t.js";import{L as m}from"./LiquidGlassControlGroup-BLmaIXmf.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";const n=p.forwardRef(({controls:i,placement:t="top-right",materialVariant:o="clear",className:l,...s},d)=>a.jsx("div",{ref:d,className:c("liquid-glass-map-controls glass-absolute glass-z-30",l),"data-liquid-glass-map-controls":"true","data-placement":t,...s,children:a.jsx(m,{orientation:"vertical",materialVariant:o,"aria-label":"Map controls",children:i.map(e=>a.jsx("button",{type:"button",disabled:e.disabled,"aria-label":e.label,className:"glass-radius-full glass-p-2",onClick:e.onClick,children:e.icon??e.label},e.id))})}));n.displayName="LiquidGlassMapControls";try{n.displayName="LiquidGlassMapControls",n.__docgenInfo={description:"",displayName:"LiquidGlassMapControls",props:{controls:{defaultValue:null,description:"",name:"controls",required:!0,type:{name:"LiquidGlassMapControl[]"}},placement:{defaultValue:{value:"top-right"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"bottom-right"'},{value:'"bottom-left"'},{value:'"top-right"'},{value:'"top-left"'}]}},materialVariant:{defaultValue:{value:"clear"},description:"",name:"materialVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"clear"'},{value:'"regular"'}]}}}}}catch{}const f={title:"Effects + Advanced/Liquid Glass Map Controls",component:n,parameters:{layout:"fullscreen",previewSurface:"app"}},r={render:()=>a.jsxs("div",{style:{minHeight:"100vh",width:"100%",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[a.jsx("style",{children:`
        .liquid-map-story {
          position: relative;
          width: min(980px, 100%);
          min-height: 560px;
          overflow: hidden;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 24% 26%, rgba(96,165,250,.55), transparent 24%),
            radial-gradient(circle at 72% 64%, rgba(20,184,166,.48), transparent 26%),
            linear-gradient(135deg, #dbeafe, #e0f2fe 44%, #ccfbf1);
          box-shadow: 0 28px 90px rgba(15,23,42,.18);
        }

        .liquid-map-story::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px),
            linear-gradient(0deg, rgba(15,23,42,.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(135deg, rgba(0,0,0,.85), rgba(0,0,0,.28));
        }

        .liquid-map-story-label {
          position: absolute;
          left: 24px;
          bottom: 24px;
          max-width: min(360px, calc(100% - 48px));
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.68), 0 18px 60px rgba(15,23,42,.14);
        }

        .liquid-glass-map-controls button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #0f172a;
          cursor: pointer;
          font: 700 18px/1 system-ui, sans-serif;
        }

        @media (max-width: 720px) {
          .liquid-map-story { min-height: 620px; }
        }
      `}),a.jsxs("div",{className:"liquid-map-story",children:[a.jsx(n,{placement:"top-right",style:{top:24,right:24},controls:[{id:"zoom-in",label:"Zoom in",icon:"+"},{id:"zoom-out",label:"Zoom out",icon:"-"},{id:"locate",label:"Locate",icon:"O"},{id:"layers",label:"Layers",icon:"L"}]}),a.jsxs("div",{className:"liquid-map-story-label",children:[a.jsx("strong",{style:{display:"block",fontSize:18},children:"Satellite operations"}),a.jsx("span",{style:{display:"block",marginTop:6,color:"#475569"},children:"Clear vertical map controls remain readable over detailed map content."})]})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    width: "100%",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-map-story {
          position: relative;
          width: min(980px, 100%);
          min-height: 560px;
          overflow: hidden;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 24% 26%, rgba(96,165,250,.55), transparent 24%),
            radial-gradient(circle at 72% 64%, rgba(20,184,166,.48), transparent 26%),
            linear-gradient(135deg, #dbeafe, #e0f2fe 44%, #ccfbf1);
          box-shadow: 0 28px 90px rgba(15,23,42,.18);
        }

        .liquid-map-story::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px),
            linear-gradient(0deg, rgba(15,23,42,.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(135deg, rgba(0,0,0,.85), rgba(0,0,0,.28));
        }

        .liquid-map-story-label {
          position: absolute;
          left: 24px;
          bottom: 24px;
          max-width: min(360px, calc(100% - 48px));
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.68), 0 18px 60px rgba(15,23,42,.14);
        }

        .liquid-glass-map-controls button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #0f172a;
          cursor: pointer;
          font: 700 18px/1 system-ui, sans-serif;
        }

        @media (max-width: 720px) {
          .liquid-map-story { min-height: 620px; }
        }
      \`}</style>
      <div className="liquid-map-story">
        <LiquidGlassMapControls placement="top-right" style={{
        top: 24,
        right: 24
      }} controls={[{
        id: "zoom-in",
        label: "Zoom in",
        icon: "+"
      }, {
        id: "zoom-out",
        label: "Zoom out",
        icon: "-"
      }, {
        id: "locate",
        label: "Locate",
        icon: "O"
      }, {
        id: "layers",
        label: "Layers",
        icon: "L"
      }]} />
        <div className="liquid-map-story-label">
          <strong style={{
          display: "block",
          fontSize: 18
        }}>Satellite operations</strong>
          <span style={{
          display: "block",
          marginTop: 6,
          color: "#475569"
        }}>
            Clear vertical map controls remain readable over detailed map content.
          </span>
        </div>
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const y=["Satellite"];export{r as Satellite,y as __namedExportsOrder,f as default};
