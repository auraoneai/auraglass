import{r,b as A,j as a}from"./iframe-CXbhLBXA.js";import{G as D}from"./GlassContainer-DhfLSbwG.js";import{CertificationCase as F}from"./GlassMissingInventoryCertification.stories-Dko1jHY3.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-DmLZCyOG.js";import"./LiquidGlassLayerProvider-6tyztJ16.js";import"./GlassAchievementSystem--g6lt073.js";import"./a11y-BJgrmYZ-.js";import"./OptimizedGlassCore-ClSJuy9q.js";import"./deviceCapabilities-BiQAPMnE.js";import"./GlassBiometricAdaptation-CVQyWdUN.js";import"./MotionPreferenceContext-DS5tUD5P.js";import"./GlassEyeTracking-DZ1OMKL8.js";import"./GlassPredictiveEngine-UWtFxNpt.js";import"./GlassSpatialAudio-CVfAtkkI.js";const u=r.forwardRef(({children:y,className:C="",style:S={},perspective:_=1200,depth:v=100,parallax:p=!1,autoRotate:d=!1,rotationSpeed:b=10,layers:f=[],onLayerClick:i},j)=>{const s=A(),g=r.useRef(null),[x,h]=r.useState({x:0,y:0}),[q,M]=r.useState(0),l=r.useRef(null);r.useEffect(()=>{if(!d||s)return;let n=Date.now();const e=()=>{const t=Date.now(),o=(t-n)/1e3;n=t,h(c=>({x:c.x,y:(c.y+b*o)%360})),l.current=requestAnimationFrame(e)};return l.current=requestAnimationFrame(e),()=>{l.current&&cancelAnimationFrame(l.current)}},[d,b,s]);const N=n=>{if(d||s)return;const e=g.current;if(!e)return;const t=e.getBoundingClientRect(),o=t.left+t.width/2,c=t.top+t.height/2,$=(n.clientX-o)/(t.width/2)*15,Y=-((n.clientY-c)/(t.height/2))*15;h({x:Y,y:$})},R=()=>{d||h({x:0,y:0})};r.useEffect(()=>{if(!p||s)return;const n=()=>{M(window.scrollY)};return window.addEventListener("scroll",n,{passive:!0}),()=>{window.removeEventListener("scroll",n)}},[p,s]);const V={...S,position:"relative",perspective:`${_}px`,transformStyle:"preserve-3d"},E={transformStyle:"preserve-3d",transform:s?"none":`
            rotateX(${x.x}deg)
            rotateY(${x.y}deg)
            translateZ(${p?q*-.2:0}px)
          `,transition:d?"none":"transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},P=(n,e)=>e<=1?0:(n-(e-1)/2)*v/(e-1);return a.jsxs("div",{ref:j,className:`dimensional-dashboard-container ${C}`,style:{...V},onMouseMove:N,onMouseLeave:R,children:[a.jsx("div",{ref:g,className:"dimensional-dashboard-content",style:{...E},children:f.length>0?f.map((n,e)=>{const t=P(e,f.length);return a.jsx("div",{className:"dimensional-dashboard-layer",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:`translateZ(${t}px)`,transformStyle:"preserve-3d",cursor:i?"pointer":"default"},onClick:()=>i?.(e),role:i?"button":void 0,tabIndex:i?0:void 0,onKeyDown:i?o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),i(e))}:void 0,children:a.jsx(D,{style:{width:"100%",height:"100%",opacity:1-Math.abs(t)/(v*2)},children:n})},e)}):a.jsx(D,{style:{width:"100%",height:"100%"},children:y})}),a.jsx("style",{children:`
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
            outline: 2px solid var(--aura-accent-color, var(--glass-color-info));
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
        `})]})});u.displayName="DimensionalDashboardContainer";try{u.displayName="DimensionalDashboardContainer",u.__docgenInfo={description:"Dimensional Dashboard Container Component",displayName:"DimensionalDashboardContainer",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},perspective:{defaultValue:{value:"1200"},description:"",name:"perspective",required:!1,type:{name:"number | undefined"}},depth:{defaultValue:{value:"100"},description:"",name:"depth",required:!1,type:{name:"number | undefined"}},parallax:{defaultValue:{value:"false"},description:"",name:"parallax",required:!1,type:{name:"boolean | undefined"}},autoRotate:{defaultValue:{value:"false"},description:"",name:"autoRotate",required:!1,type:{name:"boolean | undefined"}},rotationSpeed:{defaultValue:{value:"10"},description:"",name:"rotationSpeed",required:!1,type:{name:"number | undefined"}},layers:{defaultValue:{value:"[]"},description:"",name:"layers",required:!1,type:{name:"ReactNode[] | undefined"}},onLayerClick:{defaultValue:null,description:"",name:"onLayerClick",required:!1,type:{name:"((layerIndex: number) => void) | undefined"}}}}}catch{}const T=Object.freeze(Object.defineProperty({__proto__:null,DimensionalDashboardContainer:u},Symbol.toStringTag,{value:"Module"})),w="DimensionalDashboardContainer",X=T[w],ne={title:"Reference/Legacy Components/Dimensional Dashboard Container",component:X,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for DimensionalDashboardContainer. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},m={render:()=>a.jsx(F,{name:w})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <CertificationCase name={componentName} />
}`,...m.parameters?.docs?.source}}};const te=["Default"];export{m as Default,te as __namedExportsOrder,ne as default};
