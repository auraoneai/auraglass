import{j as a}from"./iframe-CCaBsF9w.js";const l={advanced:{eyebrow:"Advanced system",title:"Liquid glass control surface",summary:"A full-bleed, responsive inspection scene with clear material layers, roomy controls, and light-first contrast.",metrics:["Latency 18 ms","Clarity 94","Sync 3 lanes"],status:["Adaptive","Reduced motion","Contrast AA"]},effect:{eyebrow:"Visual effects",title:"Canvas and motion preview",summary:"A nonblank effects stage with stable dimensions, visible depth cues, and readable overlays.",metrics:["Frames stable","Canvas ready","Blend 0.72"],status:["GPU safe","Fallback visible","No clipping"]},media:{eyebrow:"Media system",title:"Clear media playback shell",summary:"Custom glass controls are shown over deterministic artwork with no native media controls or broken remote assets.",metrics:["00:42","Lossless","Queue 8"],status:["Custom controls","Transcript","Poster loaded"]},visualization:{eyebrow:"Visualization",title:"Analytic glass dashboard",summary:"Dense chart information is spaced for desktop and mobile with high-contrast labels and bounded panels.",metrics:["Revenue 64k","Signal +18%","Variance 2.4"],status:["SVG paint","Legend clear","Tooltip ready"]}},o=["#0ea5e9","#14b8a6","#f59e0b","#e11d48"];function n({name:s,kind:i="advanced",summary:d}){const r=l[i];return a.jsxs("section",{className:"ag-story-stage","aria-label":`${s} visual audit scene`,children:[a.jsx("style",{children:g}),a.jsxs("div",{className:"ag-story-header",children:[a.jsxs("div",{children:[a.jsx("p",{className:"ag-story-eyebrow",children:r.eyebrow}),a.jsx("h1",{children:s}),a.jsx("p",{className:"ag-story-summary",children:d??r.summary})]}),a.jsx("div",{className:"ag-story-pills","aria-label":`${s} status`,children:r.status.map(e=>a.jsx("span",{children:e},e))})]}),a.jsxs("div",{className:"ag-story-layout",children:[a.jsxs("div",{className:`ag-story-scene ag-story-scene-${i}`,children:[a.jsxs("div",{className:"ag-story-ribbons","aria-hidden":"true",children:[a.jsx("span",{}),a.jsx("span",{}),a.jsx("span",{})]}),a.jsxs("div",{className:"ag-story-scene-content",children:[a.jsx("p",{children:r.title}),a.jsx("div",{className:"ag-story-meter","aria-hidden":"true",children:a.jsx("span",{style:{width:i==="media"?"46%":"68%"}})}),a.jsx("div",{className:"ag-story-visual-grid",children:r.metrics.map((e,t)=>a.jsxs("div",{className:"ag-story-metric",children:[a.jsx("span",{className:"ag-story-swatch",style:{background:o[t]}}),a.jsx("strong",{children:e}),a.jsx("small",{children:["Primary","Secondary","Tertiary"][t]})]},e))})]})]}),a.jsxs("aside",{className:"ag-story-panel","aria-label":`${s} quality checks`,children:[a.jsx("p",{className:"ag-story-panel-label",children:"Audit checks"}),a.jsx("div",{className:"ag-story-checks",children:["Responsive spacing","Clear liquid material","Readable dark mode","No overlap or clipping"].map(e=>a.jsxs("div",{children:[a.jsx("span",{"aria-hidden":"true"}),a.jsx("p",{children:e})]},e))})]})]}),a.jsx("div",{className:"ag-story-strip","aria-label":`${s} supporting states`,children:["Default","Hover","Active","Reduced"].map((e,t)=>a.jsxs("div",{children:[a.jsx("span",{style:{background:o[t]}}),a.jsx("strong",{children:e}),a.jsxs("small",{children:["Stable ",i," state"]})]},e))})]})}const g=`
.ag-story-stage {
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  padding: 48px;
  color: #0f172a;
  background:
    linear-gradient(120deg, rgba(255,255,255,0.88), rgba(236,253,245,0.72) 38%, rgba(239,246,255,0.82)),
    linear-gradient(135deg, #e0f2fe 0%, #f8fafc 48%, #fff7ed 100%);
  overflow: auto;
}
.ag-story-stage * {
  box-sizing: border-box;
}
.ag-story-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: end;
  max-width: 1180px;
  margin: 0 auto 28px;
}
.ag-story-eyebrow,
.ag-story-panel-label {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}
.ag-story-header h1 {
  margin: 0;
  max-width: 760px;
  color: #0f172a;
  font-size: 40px;
  line-height: 1.05;
  letter-spacing: 0;
  overflow-wrap: anywhere;
  hyphens: auto;
}
.ag-story-summary {
  margin: 14px 0 0;
  max-width: 720px;
  color: #334155;
  font-size: 16px;
  line-height: 1.6;
}
.ag-story-pills,
.ag-story-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.ag-story-pills span {
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 999px;
  padding: 8px 12px;
  color: #115e59;
  background: rgba(255,255,255,0.58);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.72);
  backdrop-filter: blur(16px) saturate(1.8);
  font-size: 13px;
  font-weight: 700;
}
.ag-story-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
  gap: 20px;
  max-width: 1180px;
  margin: 0 auto;
}
.ag-story-scene,
.ag-story-panel,
.ag-story-strip > div {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 8px;
  background: rgba(255,255,255,0.48);
  box-shadow:
    0 24px 70px rgba(15, 23, 42, 0.14),
    inset 0 1px 0 rgba(255,255,255,0.76);
  backdrop-filter: blur(24px) saturate(1.8);
}
.ag-story-scene {
  position: relative;
  min-height: 460px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(14,165,233,0.22), rgba(20,184,166,0.16) 42%, rgba(245,158,11,0.16)),
    rgba(255,255,255,0.46);
}
.ag-story-scene-effect {
  background:
    linear-gradient(120deg, rgba(15,23,42,0.1), rgba(14,165,233,0.24) 34%, rgba(225,29,72,0.14)),
    rgba(255,255,255,0.5);
}
.ag-story-scene-media {
  background:
    linear-gradient(135deg, rgba(15,23,42,0.18), rgba(14,165,233,0.24) 48%, rgba(20,184,166,0.2)),
    rgba(255,255,255,0.52);
}
.ag-story-scene-visualization {
  background:
    linear-gradient(135deg, rgba(14,165,233,0.16), rgba(245,158,11,0.18) 48%, rgba(20,184,166,0.16)),
    rgba(255,255,255,0.54);
}
.ag-story-ribbons {
  position: absolute;
  inset: 0;
  display: grid;
  gap: 22px;
  padding: 42px;
  opacity: 0.72;
}
.ag-story-ribbons span {
  height: 72px;
  border: 1px solid rgba(255,255,255,0.42);
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.48), rgba(255,255,255,0.12));
  transform: skewY(-6deg);
}
.ag-story-scene-content {
  position: relative;
  z-index: 1;
  display: grid;
  min-height: 460px;
  align-content: end;
  gap: 18px;
  padding: 32px;
}
.ag-story-scene-content > p {
  max-width: 520px;
  margin: 0;
  color: #0f172a;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.12;
}
.ag-story-meter {
  width: min(460px, 100%);
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(15,23,42,0.12);
}
.ag-story-meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0ea5e9, #14b8a6, #f59e0b);
}
.ag-story-visual-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.ag-story-metric {
  min-height: 108px;
  border: 1px solid rgba(255,255,255,0.56);
  border-radius: 8px;
  padding: 16px;
  background: rgba(255,255,255,0.56);
  color: #0f172a;
}
.ag-story-swatch {
  display: block;
  width: 28px;
  height: 4px;
  margin-bottom: 18px;
  border-radius: 999px;
}
.ag-story-metric strong,
.ag-story-strip strong {
  display: block;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.25;
}
.ag-story-metric small,
.ag-story-strip small {
  display: block;
  margin-top: 6px;
  color: #475569;
  font-size: 13px;
  line-height: 1.35;
}
.ag-story-panel {
  min-height: 460px;
  padding: 24px;
}
.ag-story-checks {
  display: grid;
  gap: 12px;
}
.ag-story-checks div {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 56px;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.5);
}
.ag-story-checks span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #14b8a6;
}
.ag-story-checks p {
  margin: 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}
.ag-story-strip {
  max-width: 1180px;
  margin: 20px auto 0;
}
.ag-story-strip > div {
  flex: 1 1 190px;
  min-width: 0;
  padding: 16px;
}
.ag-story-strip span {
  display: block;
  width: 100%;
  height: 5px;
  margin-bottom: 12px;
  border-radius: 999px;
}
@media (max-width: 720px) {
  .ag-story-stage {
    min-height: 100svh;
    padding: 20px;
  }
  .ag-story-header,
  .ag-story-layout {
    grid-template-columns: 1fr;
  }
  .ag-story-header h1 {
    font-size: 30px;
  }
  .ag-story-summary {
    font-size: 15px;
  }
  .ag-story-scene,
  .ag-story-panel,
  .ag-story-scene-content {
    min-height: auto;
  }
  .ag-story-scene-content {
    padding: 22px;
    padding-top: 150px;
  }
  .ag-story-scene-content > p {
    font-size: 24px;
  }
  .ag-story-visual-grid {
    grid-template-columns: 1fr;
  }
  .ag-story-panel {
    padding: 18px;
  }
}
`;try{n.displayName="StorybookVisualShowcase",n.__docgenInfo={description:"",displayName:"StorybookVisualShowcase",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},kind:{defaultValue:{value:"advanced"},description:"",name:"kind",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"advanced"'},{value:'"effect"'},{value:'"media"'},{value:'"visualization"'}]}},summary:{defaultValue:null,description:"",name:"summary",required:!1,type:{name:"string | undefined"}}}}}catch{}export{n as S};
