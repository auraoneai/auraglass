import{r as k,b as G,j as e}from"./iframe-D2N3vCdj.js";import{G as n}from"./GlassContainer-qwlBwuRF.js";import{c as P}from"./createGlassStyle-BfWnO-qv.js";import{CertificationCase as T}from"./GlassMissingInventoryCertification.stories-naU3VPA1.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Y3bF4vfX.js";import"./LiquidGlassLayerProvider-DuyeeDou.js";import"./GlassAchievementSystem-CRVBaZaX.js";import"./a11y-NWIw7uLP.js";import"./OptimizedGlassCore-Cfx2wP22.js";import"./deviceCapabilities-BiFtu_BJ.js";import"./GlassBiometricAdaptation-G6oWNKvq.js";import"./MotionPreferenceContext-CrXN3CiK.js";import"./GlassEyeTracking-BLN3AOs1.js";import"./GlassPredictiveEngine-DsRdSIEV.js";import"./GlassSpatialAudio-P8l215F-.js";const d=k.forwardRef(({children:b,className:q="",style:x={},header:s,sidebar:o,footer:i,overlay:u,perspective:V=1500,headerDepth:j=30,sidebarDepth:N=20,contentDepth:_=0,footerDepth:w=10,overlayDepth:C=100,sidebarWidth:m=280,headerHeight:c=64,footerHeight:f=60,sidebarPosition:l="left",collapsedSidebar:a=!1,onSidebarToggle:S,positionStrategy:t="fixed","aria-label":D},A)=>{const y=G(),h=typeof m=="number"?`${m}px`:m,g=typeof c=="number"?`${c}px`:c,v=typeof f=="number"?`${f}px`:f,L={...x,position:"relative",width:"100%",height:x.height??"100vh",perspective:`${V}px`,transformStyle:"preserve-3d",overflow:"hidden"},r=M=>y?"none":`translateZ(${M}px)`,R={position:t,top:0,left:0,right:0,height:g,transform:r(j),transformStyle:"preserve-3d",zIndex:40},Z={position:t,top:s?g:0,[l]:0,bottom:i?v:0,width:a?"64px":h,transform:r(N),transformStyle:"preserve-3d",transition:y?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",zIndex:30},I={position:t,top:s?g:0,bottom:i?v:0,left:o&&l==="left"?a?"64px":h:0,right:o&&l==="right"?a?"64px":h:0,transform:r(_),transformStyle:"preserve-3d",overflow:"auto",transition:y?"none":"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",zIndex:10},$={position:t,bottom:0,left:0,right:0,height:v,transform:r(w),transformStyle:"preserve-3d",zIndex:20},E={position:t,inset:0,transform:r(C),transformStyle:"preserve-3d",zIndex:50,pointerEvents:u?"auto":"none"};return e.jsxs("div",{ref:A,className:`zspace-app-layout ${q}`,style:{...L},"aria-label":D,children:[s&&e.jsx("div",{className:"zspace-app-layout-header",style:{...R},children:e.jsx(n,{style:{width:"100%",height:"100%"},children:s})}),o&&e.jsx("div",{className:"zspace-app-layout-sidebar",style:{...Z},children:e.jsxs(n,{style:{width:"100%",height:"100%"},children:[o,S&&e.jsx("button",{onClick:S,className:"zspace-sidebar-toggle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",style:P({variant:"default",elev:2}),"aria-label":a?"Expand sidebar":"Collapse sidebar",children:a?"→":"←"})]})}),e.jsx("main",{className:"zspace-app-layout-main",style:{...I},children:e.jsx(n,{style:{minHeight:"100%",padding:"20px"},children:b})}),i&&e.jsx("div",{className:"zspace-app-layout-footer",style:{...$},children:e.jsx(n,{style:{width:"100%",height:"100%"},children:i})}),u&&e.jsx("div",{className:"zspace-app-layout-overlay",style:{...E},children:e.jsx(n,{style:{width:"100%",height:"100%"},children:u})}),e.jsx("style",{children:`
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
              transform: translateX(${l==="left"?"-100%":"100%"}) !important;
            }

            .zspace-app-layout-sidebar.mobile-open {
              transform: none !important;
            }

            .zspace-app-layout-main {
              left: 0 !important;
              right: 0 !important;
            }
          }
        `})]})});d.displayName="ZSpaceAppLayout";try{d.displayName="ZSpaceAppLayout",d.__docgenInfo={description:"Z-Space App Layout Component",displayName:"ZSpaceAppLayout",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"ReactNode"}},sidebar:{defaultValue:null,description:"",name:"sidebar",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"",name:"footer",required:!1,type:{name:"ReactNode"}},overlay:{defaultValue:null,description:"",name:"overlay",required:!1,type:{name:"ReactNode"}},perspective:{defaultValue:{value:"1500"},description:"",name:"perspective",required:!1,type:{name:"number | undefined"}},headerDepth:{defaultValue:{value:"30"},description:"",name:"headerDepth",required:!1,type:{name:"number | undefined"}},sidebarDepth:{defaultValue:{value:"20"},description:"",name:"sidebarDepth",required:!1,type:{name:"number | undefined"}},contentDepth:{defaultValue:{value:"0"},description:"",name:"contentDepth",required:!1,type:{name:"number | undefined"}},footerDepth:{defaultValue:{value:"10"},description:"",name:"footerDepth",required:!1,type:{name:"number | undefined"}},overlayDepth:{defaultValue:{value:"100"},description:"",name:"overlayDepth",required:!1,type:{name:"number | undefined"}},sidebarWidth:{defaultValue:{value:"280"},description:"",name:"sidebarWidth",required:!1,type:{name:"string | number | undefined"}},headerHeight:{defaultValue:{value:"64"},description:"",name:"headerHeight",required:!1,type:{name:"string | number | undefined"}},footerHeight:{defaultValue:{value:"60"},description:"",name:"footerHeight",required:!1,type:{name:"string | number | undefined"}},sidebarPosition:{defaultValue:{value:"left"},description:"",name:"sidebarPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'}]}},collapsedSidebar:{defaultValue:{value:"false"},description:"",name:"collapsedSidebar",required:!1,type:{name:"boolean | undefined"}},onSidebarToggle:{defaultValue:null,description:"",name:"onSidebarToggle",required:!1,type:{name:"(() => void) | undefined"}},positionStrategy:{defaultValue:{value:"fixed"},description:"",name:"positionStrategy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fixed"'},{value:'"absolute"'}]}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const H=Object.freeze(Object.defineProperty({__proto__:null,ZSpaceAppLayout:d},Symbol.toStringTag,{value:"Module"})),z="ZSpaceAppLayout",O=H[z],ie={title:"Surfaces/App Shells + Layout/ZSpace App Layout",component:O,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for ZSpaceAppLayout. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},p={render:()=>e.jsx(T,{name:z})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <CertificationCase name={componentName} />
}`,...p.parameters?.docs?.source}}};const le=["Default"];export{p as Default,le as __namedExportsOrder,ie as default};
