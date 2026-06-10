import{r as h,b as _,j as n}from"./iframe-Bw8wx5FH.js";import{G}from"./GlassCard-DRLGXfKD.js";import{CertificationCase as q}from"./GlassMissingInventoryCertification.stories-BGqMb_AO.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-gpj7kg9O.js";import"./LiquidGlassLayerProvider-6Bj4p4s7.js";import"./OptimizedGlassCore-DoEL-tKT.js";import"./deviceCapabilities-D2nexl3L.js";const i=h.forwardRef(({children:l,className:g="",style:p={},glowColor:d="#00d4ff",glowIntensity:s=.8,animationDuration:f=3e3,variant:u="default",onClick:o,interactive:m=!0,disabled:a=!1,"data-testid":w,"aria-label":v},y)=>{const t=_(),b=()=>{const e={"--glow-color":d,"--glow-intensity":s,"--animation-duration":`${f}ms`};switch(u){case"neon":return{...e,"--glow-color":d,"--glow-spread":"8px","--glow-blur":"20px"};case"subtle":return{...e,"--glow-spread":"2px","--glow-blur":"10px","--glow-intensity":s*.5};case"rainbow":return{...e,"--glow-color-1":"#ff006e","--glow-color-2":"#00d4ff","--glow-color-3":"#00ff88","--glow-spread":"4px","--glow-blur":"16px"};default:return{...e,"--glow-spread":"4px","--glow-blur":"16px"}}},x=()=>t||a?"":"glowing-card-animated",C={...b(),...p,position:"relative",overflow:"hidden",cursor:m&&!a?"pointer":"default",transition:t?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",opacity:a?.6:1,pointerEvents:a?"none":"auto"};return n.jsxs("div",{ref:y,"data-testid":w||"glowingcard",className:`glowing-card ${u} ${x()} ${g}`,style:{...C},onClick:a?void 0:o,role:o?"button":void 0,tabIndex:o&&!a?0:void 0,onKeyDown:o&&!a?e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),o())}:void 0,"aria-label":v,children:[!t&&n.jsx("div",{className:"glowing-card-glow","aria-hidden":"true"}),n.jsx(G,{className:"glowing-card-content",style:{position:"relative",zIndex:1},children:l}),n.jsx("style",{children:`
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
        `})]})});i.displayName="GlowingCard";try{i.displayName="GlowingCard",i.__docgenInfo={description:"Glowing Card Component",displayName:"GlowingCard",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}},glowColor:{defaultValue:{value:"#00d4ff"},description:"",name:"glowColor",required:!1,type:{name:"string | undefined"}},glowIntensity:{defaultValue:{value:"0.8"},description:"",name:"glowIntensity",required:!1,type:{name:"number | undefined"}},animationDuration:{defaultValue:{value:"3000"},description:"",name:"animationDuration",required:!1,type:{name:"number | undefined"}},variant:{defaultValue:{value:"default"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"subtle"'},{value:'"neon"'},{value:'"rainbow"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const S=Object.freeze(Object.defineProperty({__proto__:null,GlowingCard:i},Symbol.toStringTag,{value:"Module"})),c="GlowingCard",V=S[c],M={title:"Surfaces/Cards + Panels/Glowing Card",component:V,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlowingCard. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},r={render:()=>n.jsx(q,{name:c})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <CertificationCase name={componentName} />
}`,...r.parameters?.docs?.source}}};const R=["Default"];export{r as Default,R as __namedExportsOrder,M as default};
