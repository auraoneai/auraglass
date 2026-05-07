import{r as M,b as k,j as e}from"./iframe-B2YkWo0R.js";import{G as r}from"./GlassContainer-DlVfevC2.js";import{c as G}from"./createGlassStyle-BfWnO-qv.js";import{CertificationCase as P}from"./GlassMissingInventoryCertification.stories-Cq8QMezX.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-DIoSyT1w.js";import"./LiquidGlassLayerProvider-DpO-dbvQ.js";import"./GlassAchievementSystem-BKwelFxF.js";import"./a11y-Bb31ansd.js";import"./OptimizedGlassCore-CYII0g9k.js";import"./deviceCapabilities-DmRU0S_3.js";import"./GlassBiometricAdaptation-TYjF8UXx.js";import"./MotionPreferenceContext-C6GeG4Di.js";import"./GlassEyeTracking-DkLkTBcn.js";import"./GlassPredictiveEngine-Bfsuuf7W.js";import"./GlassSpatialAudio-nYsj51EH.js";const p=M.forwardRef(({children:v,className:S="",style:z={},header:n,sidebar:s,footer:o,overlay:d,perspective:q=1500,headerDepth:V=30,sidebarDepth:j=20,contentDepth:N=0,footerDepth:_=10,overlayDepth:w=100,sidebarWidth:u=280,headerHeight:m=64,footerHeight:c=60,sidebarPosition:i="left",collapsedSidebar:a=!1,onSidebarToggle:b,"aria-label":C},D)=>{const f=k(),y=typeof u=="number"?`${u}px`:u,h=typeof m=="number"?`${m}px`:m,g=typeof c=="number"?`${c}px`:c,A={...z,position:"relative",width:"100%",height:"100vh",perspective:`${q}px`,transformStyle:"preserve-3d",overflow:"hidden"},t=E=>f?"none":`translateZ(${E}px)`,L={position:"fixed",top:0,left:0,right:0,height:h,transform:t(V),transformStyle:"preserve-3d",zIndex:40},R={position:"fixed",top:n?h:0,[i]:0,bottom:o?g:0,width:a?"64px":y,transform:t(j),transformStyle:"preserve-3d",transition:f?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",zIndex:30},Z={position:"fixed",top:n?h:0,bottom:o?g:0,left:s&&i==="left"?a?"64px":y:0,right:s&&i==="right"?a?"64px":y:0,transform:t(N),transformStyle:"preserve-3d",overflow:"auto",transition:f?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",zIndex:10},I={position:"fixed",bottom:0,left:0,right:0,height:g,transform:t(_),transformStyle:"preserve-3d",zIndex:20},$={position:"fixed",inset:0,transform:t(w),transformStyle:"preserve-3d",zIndex:50,pointerEvents:d?"auto":"none"};return e.jsxs("div",{ref:D,className:`zspace-app-layout ${S}`,style:{...A},"aria-label":C,children:[n&&e.jsx("div",{className:"zspace-app-layout-header",style:{...L},children:e.jsx(r,{style:{width:"100%",height:"100%"},children:n})}),s&&e.jsx("div",{className:"zspace-app-layout-sidebar",style:{...R},children:e.jsxs(r,{style:{width:"100%",height:"100%"},children:[s,b&&e.jsx("button",{onClick:b,className:"zspace-sidebar-toggle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",style:G({variant:"default",elev:2}),"aria-label":a?"Expand sidebar":"Collapse sidebar",children:a?"→":"←"})]})}),e.jsx("main",{className:"zspace-app-layout-main",style:{...Z},children:e.jsx(r,{style:{minHeight:"100%",padding:"20px"},children:v})}),o&&e.jsx("div",{className:"zspace-app-layout-footer",style:{...I},children:e.jsx(r,{style:{width:"100%",height:"100%"},children:o})}),d&&e.jsx("div",{className:"zspace-app-layout-overlay",style:{...$},children:e.jsx(r,{style:{width:"100%",height:"100%"},children:d})}),e.jsx("style",{children:`
          .zspace-app-layout {
            font-family: var(--aura-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          }

          .zspace-sidebar-toggle:hover {
            background: color-mix(in srgb, var(--glass-theme-accent-primary, rgba(255, 255, 255, 0.2)) 22%, transparent) !important;
            transform: translateY(-50%) scale(1.05);
          }

          .zspace-sidebar-toggle:active {
            transform: translateY(-50%) scale(0.95);
          }

          .zspace-sidebar-toggle:focus-visible {
            outline: none;
            box-shadow: var(
              --glass-theme-focus-ring,
              0 0 0 3px rgba(99, 102, 241, 0.3)
            );
          }

          @media (prefers-reduced-motion: reduce) {
            .zspace-app-layout *,
            .zspace-sidebar-toggle {
              transform: none !important;
              transition: none !important;
            }
          }

          @media (max-width: 768px) {
            .zspace-app-layout-sidebar {
              transform: translateX(${i==="left"?"-100%":"100%"}) !important;
            }

            .zspace-app-layout-sidebar.mobile-open {
              transform: none !important;
            }

            .zspace-app-layout-main {
              left: 0 !important;
              right: 0 !important;
            }
          }
        `})]})});p.displayName="ZSpaceAppLayout";try{p.displayName="ZSpaceAppLayout",p.__docgenInfo={description:"Z-Space App Layout Component",displayName:"ZSpaceAppLayout",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"ReactNode"}},sidebar:{defaultValue:null,description:"",name:"sidebar",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"",name:"footer",required:!1,type:{name:"ReactNode"}},overlay:{defaultValue:null,description:"",name:"overlay",required:!1,type:{name:"ReactNode"}},perspective:{defaultValue:{value:"1500"},description:"",name:"perspective",required:!1,type:{name:"number | undefined"}},headerDepth:{defaultValue:{value:"30"},description:"",name:"headerDepth",required:!1,type:{name:"number | undefined"}},sidebarDepth:{defaultValue:{value:"20"},description:"",name:"sidebarDepth",required:!1,type:{name:"number | undefined"}},contentDepth:{defaultValue:{value:"0"},description:"",name:"contentDepth",required:!1,type:{name:"number | undefined"}},footerDepth:{defaultValue:{value:"10"},description:"",name:"footerDepth",required:!1,type:{name:"number | undefined"}},overlayDepth:{defaultValue:{value:"100"},description:"",name:"overlayDepth",required:!1,type:{name:"number | undefined"}},sidebarWidth:{defaultValue:{value:"280"},description:"",name:"sidebarWidth",required:!1,type:{name:"string | number | undefined"}},headerHeight:{defaultValue:{value:"64"},description:"",name:"headerHeight",required:!1,type:{name:"string | number | undefined"}},footerHeight:{defaultValue:{value:"60"},description:"",name:"footerHeight",required:!1,type:{name:"string | number | undefined"}},sidebarPosition:{defaultValue:{value:"left"},description:"",name:"sidebarPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'}]}},collapsedSidebar:{defaultValue:{value:"false"},description:"",name:"collapsedSidebar",required:!1,type:{name:"boolean | undefined"}},onSidebarToggle:{defaultValue:null,description:"",name:"onSidebarToggle",required:!1,type:{name:"(() => void) | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const T=Object.freeze(Object.defineProperty({__proto__:null,ZSpaceAppLayout:p},Symbol.toStringTag,{value:"Module"})),x="ZSpaceAppLayout",H=T[x],oe={title:"Surfaces/App Shells + Layout/ZSpace App Layout",component:H,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for ZSpaceAppLayout. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},l={render:()=>e.jsx(P,{name:x})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <CertificationCase name={componentName} />
}`,...l.parameters?.docs?.source}}};const ie=["Default"];export{l as Default,ie as __namedExportsOrder,oe as default};
