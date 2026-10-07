import{r,a as P,j as e}from"./iframe-RsoZoStf.js";import{G as D}from"./GlassContainer-BYUtNLTo.js";import{G as $}from"./GlassCore-CUjrQ4HR.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-GdijC9oA.js";import"./LiquidGlassLayerProvider-BQssgZYr.js";import"./GlassAchievementSystem-Bhc5NHtk.js";import"./a11y-WSL2JlLl.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";import"./GlassBiometricAdaptation-B9HDXiFX.js";import"./MotionPreferenceContext-B3rOXnSa.js";import"./GlassEyeTracking-CJXggKsV.js";import"./GlassPredictiveEngine-xQEpY0TP.js";import"./GlassSpatialAudio-nY9QSvQ1.js";const c=r.forwardRef(({children:l,className:w="",style:C={},perspective:N=1200,depth:x=100,parallax:h=!1,autoRotate:d=!1,rotationSpeed:v=10,layers:f=[],onLayerClick:i},j)=>{const o=P(),y=r.useRef(null),[b,g]=r.useState({x:0,y:0}),[S,V]=r.useState(0),m=r.useRef(null);r.useEffect(()=>{if(!d||o)return;let n=Date.now();const s=()=>{const a=Date.now(),t=(a-n)/1e3;n=a,g(p=>({x:p.x,y:(p.y+v*t)%360})),m.current=requestAnimationFrame(s)};return m.current=requestAnimationFrame(s),()=>{m.current&&cancelAnimationFrame(m.current)}},[d,v,o]);const E=n=>{if(d||o)return;const s=y.current;if(!s)return;const a=s.getBoundingClientRect(),t=a.left+a.width/2,p=a.top+a.height/2,W=(n.clientX-t)/(a.width/2)*15,I=-((n.clientY-p)/(a.height/2))*15;g({x:I,y:W})},R=()=>{d||g({x:0,y:0})};r.useEffect(()=>{if(!h||o)return;const n=()=>{V(window.scrollY)};return window.addEventListener("scroll",n,{passive:!0}),()=>{window.removeEventListener("scroll",n)}},[h,o]);const q={...C,position:"relative",perspective:`${N}px`,transformStyle:"preserve-3d"},M={transformStyle:"preserve-3d",transform:o?"none":`
            rotateX(${b.x}deg)
            rotateY(${b.y}deg)
            translateZ(${h?S*-.2:0}px)
          `,transition:d?"none":"transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},_=(n,s)=>s<=1?0:(n-(s-1)/2)*x/(s-1);return e.jsxs("div",{ref:j,className:`dimensional-dashboard-container ${w}`,style:{...q},onMouseMove:E,onMouseLeave:R,children:[e.jsx("div",{ref:y,className:"dimensional-dashboard-content",style:{...M},children:f.length>0?f.map((n,s)=>{const a=_(s,f.length);return e.jsx("div",{className:"dimensional-dashboard-layer",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:`translateZ(${a}px)`,transformStyle:"preserve-3d",cursor:i?"pointer":"default"},onClick:()=>i?.(s),role:i?"button":void 0,tabIndex:i?0:void 0,onKeyDown:i?t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),i(s))}:void 0,children:e.jsx(D,{style:{width:"100%",height:"100%",opacity:1-Math.abs(a)/(x*2)},children:n})},s)}):e.jsx(D,{style:{width:"100%",height:"100%"},children:l})}),e.jsx("style",{children:`
          .dimensional-dashboard-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .dimensional-dashboard-content {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .dimensional-dashboard-layer:focus-visible {
            outline: 2px solid var(--aura-accent-color, hsl(var(--glass-color-info)));
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            .dimensional-dashboard-content {
              transform: none !important;
              transition: none !important;
            }
            .dimensional-dashboard-layer {
              transform: none !important;
            }
          }
        `})]})});c.displayName="DimensionalDashboardContainer";try{c.displayName="DimensionalDashboardContainer",c.__docgenInfo={description:"Dimensional Dashboard Container Component",displayName:"DimensionalDashboardContainer",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},perspective:{defaultValue:{value:"1200"},description:"",name:"perspective",required:!1,type:{name:"number | undefined"}},depth:{defaultValue:{value:"100"},description:"",name:"depth",required:!1,type:{name:"number | undefined"}},parallax:{defaultValue:{value:"false"},description:"",name:"parallax",required:!1,type:{name:"boolean | undefined"}},autoRotate:{defaultValue:{value:"false"},description:"",name:"autoRotate",required:!1,type:{name:"boolean | undefined"}},rotationSpeed:{defaultValue:{value:"10"},description:"",name:"rotationSpeed",required:!1,type:{name:"number | undefined"}},layers:{defaultValue:{value:"[]"},description:"",name:"layers",required:!1,type:{name:"ReactNode[] | undefined"}},onLayerClick:{defaultValue:null,description:"",name:"onLayerClick",required:!1,type:{name:"((layerIndex: number) => void) | undefined"}}}}}catch{}const Q={title:"Reference/Legacy Components/Dimensional Dashboard Container",component:c,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"The real dimensional container presenting a complete dashboard surface inside its perspective-aware scene."}}}},u={render:()=>e.jsx("div",{style:{width:"min(780px, calc(100vw - 32px))",height:"min(500px, calc(100vh - 32px))",minWidth:0,minHeight:360},children:e.jsx(c,{perspective:1400,depth:72,children:e.jsx($,{className:"glass-h-full glass-w-full glass-p-6 glass-contrast-guard",style:{boxSizing:"border-box"},children:e.jsxs("div",{style:{height:"100%",minWidth:0,display:"grid",alignContent:"center",gap:18},children:[e.jsxs("div",{children:[e.jsx("span",{className:"glass-text-xs glass-font-semibold glass-text-secondary",children:"LIVE OVERVIEW"}),e.jsx("h2",{className:"glass-text-2xl glass-font-semibold glass-text-primary glass-mt-2",children:"Dimensional Operations"}),e.jsx("p",{className:"glass-text-sm glass-text-secondary glass-mt-2",children:"Perspective-aware content remains crisp, bounded, and fully interactive across the dashboard plane."})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",gap:12},children:["12 active spaces","99.98% available","42 ms response"].map(l=>e.jsx("div",{className:"glass-surface-subtle glass-radius-lg glass-border glass-border-subtle glass-p-4 glass-text-sm glass-text-primary",style:{minWidth:0},children:l},l))})]})})})})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "min(780px, calc(100vw - 32px))",
    height: "min(500px, calc(100vh - 32px))",
    minWidth: 0,
    minHeight: 360
  }}>
      <DimensionalDashboardContainerModule.DimensionalDashboardContainer perspective={1400} depth={72}>
        <Glass className="glass-h-full glass-w-full glass-p-6 glass-contrast-guard" style={{
        boxSizing: "border-box"
      }}>
          <div style={{
          height: "100%",
          minWidth: 0,
          display: "grid",
          alignContent: "center",
          gap: 18
        }}>
            <div>
              <span className="glass-text-xs glass-font-semibold glass-text-secondary">
                LIVE OVERVIEW
              </span>
              <h2 className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-2">
                Dimensional Operations
              </h2>
              <p className="glass-text-sm glass-text-secondary glass-mt-2">
                Perspective-aware content remains crisp, bounded, and fully
                interactive across the dashboard plane.
              </p>
            </div>
            <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12
          }}>
              {["12 active spaces", "99.98% available", "42 ms response"].map(metric => <div key={metric} className="glass-surface-subtle glass-radius-lg glass-border glass-border-subtle glass-p-4 glass-text-sm glass-text-primary" style={{
              minWidth: 0
            }}>
                    {metric}
                  </div>)}
            </div>
          </div>
        </Glass>
      </DimensionalDashboardContainerModule.DimensionalDashboardContainer>
    </div>
}`,...u.parameters?.docs?.source}}};const U=["DimensionalDashboardContainer"];export{u as DimensionalDashboardContainer,U as __namedExportsOrder,Q as default};
