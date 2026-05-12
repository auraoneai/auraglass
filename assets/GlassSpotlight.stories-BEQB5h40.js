import{r as s,b as H,j as t,c as $}from"./iframe-B_p7zla-.js";import{f as y}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const l=s.forwardRef(({targetRect:e,onClose:v,className:b,children:x,padding:a=8,contained:w=!1,preview:M=!1,demoMotion:m=!1,respectMotionPreference:S=!0,height:d,maxHeight:c,style:q,...R},_)=>{const p=w||M,V=H(),n=m&&(S?!V:!0),[o,j]=s.useState(0),k=typeof d=="number"?`${d}px`:d,C=typeof c=="number"?`${c}px`:c,f=s.useMemo(()=>{if(e)return{position:"absolute",left:e.left-a,top:e.top-a,width:e.width+a*2,height:e.height+a*2,borderRadius:12,boxShadow:"0 0 0 9999px var(--glass-text-tertiary-dark)",pointerEvents:"none"}},[e,a]),g=f?{...f}:void 0;s.useEffect(()=>{if(!n)return;let u=0;const G=performance.now(),h=N=>{j((N-G)/1e3),u=requestAnimationFrame(h)};return u=requestAnimationFrame(h),()=>cancelAnimationFrame(u)},[n]);const D=14+Math.sin(o*1.35)*60,A=12+Math.cos(o*1.08)*44,O=1.04+Math.sin(o*1.5)*.16,E=.76+Math.sin(o*1.24)*.22;return t.jsxs("div",{ref:_,"data-glass-component":!0,className:$(p?"relative overflow-hidden":"fixed inset-0",b),style:{background:e?"transparent":"linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.85))",minHeight:k??(p?"202px":void 0),maxHeight:C,width:p?"100%":void 0,...q??{}},onClick:v,...R,children:[!e&&m?t.jsxs(t.Fragment,{children:[t.jsx("div",{"aria-hidden":"true",className:"ag-glass-spotlight-demo-orb",style:{transform:n?`translate(${D}%, ${A}%) scale(${O})`:"translate(28%, 22%) scale(1)",opacity:n?E:.78}}),t.jsx("style",{children:`
              .ag-glass-spotlight-demo-orb {
                position: absolute;
                width: 210px;
                height: 210px;
                border-radius: 999px;
                background: radial-gradient(circle, rgba(255,255,255,0.58) 0%, rgba(124,211,255,0.46) 23%, rgba(216,111,255,0.20) 48%, transparent 76%);
                filter: blur(1px);
                pointer-events: none;
              }
              @keyframes ag-glass-spotlight-demo {
                0% { transform: translate(18%, 8%) scale(0.92); opacity: 0.62; }
                50% { transform: translate(58%, 28%) scale(1.08); opacity: 0.95; }
                100% { transform: translate(28%, 52%) scale(0.98); opacity: 0.72; }
              }
              .ag-glass-spotlight-demo-orb {
                animation: ag-glass-spotlight-demo 3.4s ease-in-out infinite alternate;
              }
              @media (prefers-reduced-motion: reduce) {
                .ag-glass-spotlight-demo-orb { animation: none; }
              }
            `})]}):null,g?t.jsx("div",{style:{...g}}):t.jsx("span",{className:"glass-sr-only",children:"Glass spotlight inactive"}),x]})});l.displayName="GlassSpotlight";try{l.displayName="GlassSpotlight",l.__docgenInfo={description:"",displayName:"GlassSpotlight",props:{targetRect:{defaultValue:null,description:"",name:"targetRect",required:!1,type:{name:"DOMRect | null | undefined"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void) | undefined"}},padding:{defaultValue:{value:"8"},description:"",name:"padding",required:!1,type:{name:"number | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the spotlight inside a local container instead of using fixed viewport overlay.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for contained catalog/documentation previews.",name:"preview",required:!1,type:{name:"boolean | undefined"}},demoMotion:{defaultValue:{value:"false"},description:"Show a package-owned animated local spotlight when no targetRect is provided.",name:"demoMotion",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to honor reduced-motion settings for the package-owned demo motion.",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"Local preview height.",name:"height",required:!1,type:{name:"string | number | undefined"}},maxHeight:{defaultValue:null,description:"Local preview max-height.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const I={title:"Effects + Advanced/Glass Spotlight",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassspotlight component."}}},argTypes:{},args:{}},r={args:{targetRect:new DOMRect(100,100,200,100),onClose:y()}},i={args:{targetRect:new DOMRect(50,50,300,200),onClose:y()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    targetRect: new DOMRect(100, 100, 200, 100),
    onClose: fn()
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    targetRect: new DOMRect(50, 50, 300, 200),
    onClose: fn()
  }
}`,...i.parameters?.docs?.source}}};const K=["Default","LargeTarget"];export{r as Default,i as LargeTarget,K as __namedExportsOrder,I as default};
