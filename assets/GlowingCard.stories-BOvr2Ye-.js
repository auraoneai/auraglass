import{r as h,a as N,j as e}from"./iframe-Cqi-9gHA.js";import{G as C}from"./GlassCard-D12uqCBo.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";const i=h.forwardRef(({children:o,className:c="",style:u={},glowColor:s="#00d4ff",glowIntensity:d=.8,animationDuration:p=3e3,variant:g="default",onClick:r,interactive:f=!0,disabled:n=!1,"data-testid":w,"aria-label":m},v)=>{const t=N(),x=()=>{const a={"--glow-color":s,"--glow-intensity":d,"--animation-duration":`${p}ms`};switch(g){case"neon":return{...a,"--glow-color":s,"--glow-spread":"8px","--glow-blur":"20px"};case"subtle":return{...a,"--glow-spread":"2px","--glow-blur":"10px","--glow-intensity":d*.5};case"rainbow":return{...a,"--glow-color-1":"#ff006e","--glow-color-2":"#00d4ff","--glow-color-3":"#00ff88","--glow-spread":"4px","--glow-blur":"16px"};default:return{...a,"--glow-spread":"4px","--glow-blur":"16px"}}},y=()=>t||n?"":"glowing-card-animated",b={...x(),...u,position:"relative",overflow:"hidden",cursor:f&&!n?"pointer":"default",transition:t?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",opacity:n?.6:1,pointerEvents:n?"none":"auto"};return e.jsxs("div",{ref:v,"data-testid":w||"glowingcard",className:`glowing-card ${g} ${y()} ${c}`,style:{...b},onClick:n?void 0:r,role:r?"button":void 0,tabIndex:r&&!n?0:void 0,onKeyDown:r&&!n?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r())}:void 0,"aria-label":m,children:[!t&&e.jsx("div",{className:"glowing-card-glow","aria-hidden":"true"}),e.jsx(C,{className:"glowing-card-content",style:{position:"relative",zIndex:1},children:o}),e.jsx("style",{children:`
          .glowing-card {
            border-radius: 12px;
          }

          .glowing-card-glow {
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: linear-gradient(
              90deg,
              var(--glow-color, #00d4ff),
              var(--glow-color, #00d4ff)
            );
            opacity: var(--glow-intensity, 0.8);
            filter: blur(var(--glow-blur, 16px));
            z-index: 0;
            pointer-events: none;
          }

          .glowing-card.rainbow .glowing-card-glow {
            background: linear-gradient(
              90deg,
              var(--glow-color-1, #ff006e),
              var(--glow-color-2, #00d4ff),
              var(--glow-color-3, #00ff88),
              var(--glow-color-1, #ff006e)
            );
            background-size: 200% 100%;
          }

          .glowing-card-animated .glowing-card-glow {
            animation: glowPulse var(--animation-duration, 3000ms) ease-in-out
              infinite;
          }

          .glowing-card-animated.rainbow .glowing-card-glow {
            animation: glowPulse var(--animation-duration, 3000ms) ease-in-out
                infinite,
              rainbowShift calc(var(--animation-duration, 3000ms) * 2) linear
                infinite;
          }

          .glowing-card.neon .glowing-card-glow {
            box-shadow: 0 0 var(--glow-spread, 8px) var(--glow-blur, 20px)
              var(--glow-color, #00d4ff);
          }

          .glowing-card:hover .glowing-card-glow {
            opacity: calc(var(--glow-intensity, 0.8) * 1.3);
            filter: blur(calc(var(--glow-blur, 16px) * 1.2));
          }

          .glowing-card-content {
            position: relative;
            width: 100%;
            height: 100%;
            background: inherit;
          }

          @keyframes glowPulse {
            0%,
            100% {
              opacity: var(--glow-intensity, 0.8);
            }
            50% {
              opacity: calc(var(--glow-intensity, 0.8) * 1.5);
            }
          }

          @keyframes rainbowShift {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .glowing-card-glow {
              animation: none !important;
            }
            .glowing-card {
              transition: none !important;
            }
          }
        `})]})});i.displayName="GlowingCard";try{i.displayName="GlowingCard",i.__docgenInfo={description:"Glowing Card Component",displayName:"GlowingCard",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}},glowColor:{defaultValue:{value:"#00d4ff"},description:"",name:"glowColor",required:!1,type:{name:"string | undefined"}},glowIntensity:{defaultValue:{value:"0.8"},description:"",name:"glowIntensity",required:!1,type:{name:"number | undefined"}},animationDuration:{defaultValue:{value:"3000"},description:"",name:"animationDuration",required:!1,type:{name:"number | undefined"}},variant:{defaultValue:{value:"default"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"subtle"'},{value:'"neon"'},{value:'"rainbow"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const k={minHeight:"100vh",width:"100%",display:"grid",placeItems:"center",padding:"clamp(20px, 5vw, 64px)",boxSizing:"border-box",background:"radial-gradient(circle at 80% 15%, #ffffff 0%, rgba(255,255,255,0.08) 32%), linear-gradient(145deg, #f2f2f2, #d9d9d9)"},I={title:"Surfaces/Cards + Panels/Glowing Card",component:i,parameters:{layout:"fullscreen",docs:{description:{component:"The real GlowingCard export with a white-channel edge glow that reinforces, rather than recolors, its liquid material."}}}},l={render:()=>e.jsx("main",{style:k,children:e.jsx(i,{variant:"subtle",glowColor:"rgba(255,255,255,0.95)",glowIntensity:.32,animationDuration:4200,interactive:!0,"aria-label":"Neutral glowing liquid glass card",style:{width:"min(440px, calc(100vw - 40px))"},children:e.jsxs("div",{className:"glass-grid glass-gap-4 glass-p-2",children:[e.jsx("span",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary",children:"Precision edge"}),e.jsx("h2",{className:"glass-text-3xl glass-font-semibold glass-text-primary",children:"Light traces the material."}),e.jsx("p",{className:"glass-text-secondary glass-leading-relaxed",children:"A restrained white-channel glow clarifies the boundary while the neutral glass surface keeps its surrounding context visible."})]})})})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <main style={frameStyle}>
      <GlowingCard variant="subtle" glowColor="rgba(255,255,255,0.95)" glowIntensity={0.32} animationDuration={4200} interactive aria-label="Neutral glowing liquid glass card" style={{
      width: "min(440px, calc(100vw - 40px))"
    }}>
        <div className="glass-grid glass-gap-4 glass-p-2">
          <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
            Precision edge
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Light traces the material.
          </h2>
          <p className="glass-text-secondary glass-leading-relaxed">
            A restrained white-channel glow clarifies the boundary while the
            neutral glass surface keeps its surrounding context visible.
          </p>
        </div>
      </GlowingCard>
    </main>
}`,...l.parameters?.docs?.source}}};const P=["Default"];export{l as Default,P as __namedExportsOrder,I as default};
