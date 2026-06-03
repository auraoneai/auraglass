import{j as e}from"./iframe-DF7JlHBi.js";import{L as a}from"./LiquidGlassMediaControls-BIG3N7HI.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-DZYWnIAi.js";import"./LiquidGlassLayerProvider-0rLb3aaI.js";const s={title:"Media/Liquid Glass Media Controls",component:a,parameters:{layout:"fullscreen",previewSurface:"media"}},i={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:32,boxSizing:"border-box"},children:[e.jsx("style",{children:`
        .liquid-media-story-shell input[type="range"] {
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.42));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.58);
        }

        .liquid-media-story-shell input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 6px 18px rgba(15,23,42,.28);
        }

        .liquid-media-story-shell input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 6px 18px rgba(15,23,42,.28);
        }

        .liquid-media-story-shell .liquid-glass-media-controls {
          max-width: 100%;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .liquid-media-story-shell { aspect-ratio: auto; min-height: 620px; align-items: end; }
          .liquid-media-story-shell .liquid-glass-media-controls > div { flex-wrap: wrap; }
          .liquid-media-story-shell input[type="range"] { min-width: 100px; flex: 1 1 130px; }
        }
      `}),e.jsx("div",{className:"liquid-media-story-shell",style:{width:"min(860px, 100%)",aspectRatio:"16 / 9",borderRadius:30,overflow:"hidden",display:"flex",alignItems:"flex-end",padding:24,boxSizing:"border-box",background:"linear-gradient(135deg, rgba(2,6,23,0.18), rgba(14,165,233,0.18)), radial-gradient(circle at 28% 24%, #93c5fd, transparent 22%), radial-gradient(circle at 72% 58%, #2dd4bf, transparent 26%), linear-gradient(135deg, #020617, #1d4ed8 48%, #0f766e)",boxShadow:"0 28px 90px rgba(2,6,23,0.34)"},children:e.jsxs("div",{style:{display:"grid",gap:14,width:"min(620px, 100%)"},children:[e.jsxs("div",{style:{color:"#f8fafc",textShadow:"0 1px 8px rgba(2,6,23,.4)"},children:[e.jsx("strong",{style:{display:"block",fontSize:20},children:"Review playback"}),e.jsx("span",{style:{display:"block",opacity:.82},children:"Clear controls over live media"})]}),e.jsx(a,{playing:!1,currentTime:30,duration:120,volume:.68,variant:"clear"})]})})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 32,
    boxSizing: "border-box"
  }}>
      <style>{\`
        .liquid-media-story-shell input[type="range"] {
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.42));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.58);
        }

        .liquid-media-story-shell input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 6px 18px rgba(15,23,42,.28);
        }

        .liquid-media-story-shell input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 6px 18px rgba(15,23,42,.28);
        }

        .liquid-media-story-shell .liquid-glass-media-controls {
          max-width: 100%;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .liquid-media-story-shell { aspect-ratio: auto; min-height: 620px; align-items: end; }
          .liquid-media-story-shell .liquid-glass-media-controls > div { flex-wrap: wrap; }
          .liquid-media-story-shell input[type="range"] { min-width: 100px; flex: 1 1 130px; }
        }
      \`}</style>
      <div className="liquid-media-story-shell" style={{
      width: "min(860px, 100%)",
      aspectRatio: "16 / 9",
      borderRadius: 30,
      overflow: "hidden",
      display: "flex",
      alignItems: "flex-end",
      padding: 24,
      boxSizing: "border-box",
      background: "linear-gradient(135deg, rgba(2,6,23,0.18), rgba(14,165,233,0.18)), radial-gradient(circle at 28% 24%, #93c5fd, transparent 22%), radial-gradient(circle at 72% 58%, #2dd4bf, transparent 26%), linear-gradient(135deg, #020617, #1d4ed8 48%, #0f766e)",
      boxShadow: "0 28px 90px rgba(2,6,23,0.34)"
    }}>
        <div style={{
        display: "grid",
        gap: 14,
        width: "min(620px, 100%)"
      }}>
          <div style={{
          color: "#f8fafc",
          textShadow: "0 1px 8px rgba(2,6,23,.4)"
        }}>
            <strong style={{
            display: "block",
            fontSize: 20
          }}>Review playback</strong>
            <span style={{
            display: "block",
            opacity: 0.82
          }}>Clear controls over live media</span>
          </div>
          <LiquidGlassMediaControls playing={false} currentTime={30} duration={120} volume={0.68} variant="clear" />
        </div>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const o=["ClearOverMedia"];export{i as ClearOverMedia,o as __namedExportsOrder,s as default};
