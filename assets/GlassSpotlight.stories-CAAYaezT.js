import{r as d,a as E,j as e,c as F}from"./iframe-Cqi-9gHA.js";import{f as v}from"./index-DdjpOZjl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const r=d.forwardRef(({targetRect:s,onClose:b,className:y,children:w,padding:l=8,contained:N=!1,preview:j=!1,demoMotion:u=!1,respectMotionPreference:M=!0,height:p,maxHeight:m,style:k,...S},C)=>{const a=N||j,q=E(),o=u&&(M?!q:!0),[i,R]=d.useState(0),$=typeof p=="number"?`${p}px`:p,G=typeof m=="number"?`${m}px`:m,h=d.useMemo(()=>{if(!s)return;const t=Math.max(44,s.width+l*2),n=Math.max(44,s.height+l*2);return{position:"absolute",left:a?`clamp(16px, ${Math.max(16,s.left-l)}px, calc(100% - min(${t}px, calc(100% - 32px)) - 16px))`:s.left-l,top:a?`clamp(16px, ${Math.max(16,s.top-l)}px, calc(100% - min(${n}px, calc(100% - 32px)) - 16px))`:s.top-l,width:a?`min(${t}px, calc(100% - 32px))`:t,height:a?`min(${n}px, calc(100% - 32px))`:n,borderRadius:20,border:"1px solid rgba(255,255,255,0.78)",background:"rgba(255,255,255,0.08)",boxShadow:"0 0 0 9999px rgba(15,23,42,0.24), 0 18px 44px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.72)",pointerEvents:"none"}},[s,l,a]),x=h?{...h}:void 0;d.useEffect(()=>{if(!o)return;let t=0;const n=performance.now(),f=O=>{R((O-n)/1e3),t=requestAnimationFrame(f)};return t=requestAnimationFrame(f),()=>cancelAnimationFrame(t)},[o]);const _=14+Math.sin(i*1.35)*60,V=12+Math.cos(i*1.08)*44,D=1.04+Math.sin(i*1.5)*.16,A=.76+Math.sin(i*1.24)*.22;return e.jsxs("div",{ref:C,"data-glass-component":!0,className:F("glass-spotlight glass-overlay-specular glass-edge",a?"relative overflow-hidden":"fixed inset-0",y),style:{background:s?"linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.16))":"linear-gradient(145deg, rgba(255,255,255,0.32), rgba(255,255,255,0.18))",border:"1px solid rgba(255,255,255,0.46)",borderRadius:a?28:void 0,boxShadow:"0 24px 70px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.64)",backdropFilter:"blur(24px) saturate(1.4) brightness(1.04) contrast(1.02)",WebkitBackdropFilter:"blur(24px) saturate(1.4) brightness(1.04) contrast(1.02)",minHeight:$??(a?"202px":void 0),maxHeight:G,width:a?"100%":void 0,...k??{}},onClick:b,...S,children:[!s&&u?e.jsxs(e.Fragment,{children:[e.jsx("div",{"aria-hidden":"true",className:"ag-glass-spotlight-demo-orb",style:{transform:o?`translate(${_}%, ${V}%) scale(${D})`:"translate(28%, 22%) scale(1)",opacity:o?A:.78}}),e.jsx("style",{children:`
              .ag-glass-spotlight-demo-orb {
                position: absolute;
                width: 210px;
                height: 210px;
                border-radius: 999px;
                background: radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(226,232,240,0.48) 30%, rgba(148,163,184,0.18) 56%, transparent 76%);
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
            `})]}):null,x?e.jsx("div",{"data-spotlight-hole":"true",style:{...x}}):e.jsx("span",{className:"glass-sr-only",children:"Glass spotlight inactive"}),w]})});r.displayName="GlassSpotlight";try{r.displayName="GlassSpotlight",r.__docgenInfo={description:"",displayName:"GlassSpotlight",props:{targetRect:{defaultValue:null,description:"",name:"targetRect",required:!1,type:{name:"DOMRect | null | undefined"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void) | undefined"}},padding:{defaultValue:{value:"8"},description:"",name:"padding",required:!1,type:{name:"number | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the spotlight inside a local container instead of using fixed viewport overlay.",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"Alias for contained catalog/documentation previews.",name:"preview",required:!1,type:{name:"boolean | undefined"}},demoMotion:{defaultValue:{value:"false"},description:"Show a package-owned animated local spotlight when no targetRect is provided.",name:"demoMotion",required:!1,type:{name:"boolean | undefined"}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to honor reduced-motion settings for the package-owned demo motion.",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"Local preview height.",name:"height",required:!1,type:{name:"string | number | undefined"}},maxHeight:{defaultValue:null,description:"Local preview max-height.",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const W={title:"Effects + Advanced/Glass Spotlight",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassspotlight component."}}},argTypes:{},args:{}},g={render:s=>e.jsx("div",{className:"glass-neutral-level1 glass-rounded-3xl glass-p-4 glass-w-full glass-min-w-0",style:{width:"min(620px, calc(100vw - 32px))"},children:e.jsx(r,{...s,contained:!0,preview:!0,height:320,children:e.jsxs("div",{className:"glass-relative glass-z-0 glass-flex glass-h-full glass-flex-col glass-gap-4 glass-p-5 glass-text-primary",children:[e.jsxs("div",{children:[e.jsx("p",{className:"glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wider glass-text-secondary",children:"Guided focus"}),e.jsx("h2",{className:"glass-mt-1 glass-text-xl glass-font-semibold",children:"Choose the next action"})]}),e.jsxs("div",{className:"glass-neutral-level1 glass-radius-2xl glass-p-4 glass-shadow-sm",children:[e.jsx("p",{className:"glass-m-0 glass-font-medium",children:"Continue your workspace"}),e.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-secondary",children:"The highlighted surface keeps the next step clear without hiding context."})]}),e.jsxs("div",{className:"glass-mt-auto glass-flex glass-flex-wrap glass-gap-3",children:[e.jsx("span",{className:"glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm",children:"Review"}),e.jsx("span",{className:"glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm",children:"Continue"})]})]})})}),args:{targetRect:new DOMRect(20,92,560,108),onClose:v()}},c={args:{targetRect:new DOMRect(50,50,300,200),onClose:v()}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-neutral-level1 glass-rounded-3xl glass-p-4 glass-w-full glass-min-w-0" style={{
    width: "min(620px, calc(100vw - 32px))"
  }}>
      <GlassSpotlight {...args} contained preview height={320}>
        <div className="glass-relative glass-z-0 glass-flex glass-h-full glass-flex-col glass-gap-4 glass-p-5 glass-text-primary">
          <div>
            <p className="glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wider glass-text-secondary">
              Guided focus
            </p>
            <h2 className="glass-mt-1 glass-text-xl glass-font-semibold">
              Choose the next action
            </h2>
          </div>
          <div className="glass-neutral-level1 glass-radius-2xl glass-p-4 glass-shadow-sm">
            <p className="glass-m-0 glass-font-medium">
              Continue your workspace
            </p>
            <p className="glass-mt-1 glass-text-sm glass-text-secondary">
              The highlighted surface keeps the next step clear without hiding
              context.
            </p>
          </div>
          <div className="glass-mt-auto glass-flex glass-flex-wrap glass-gap-3">
            <span className="glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm">
              Review
            </span>
            <span className="glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm">
              Continue
            </span>
          </div>
        </div>
      </GlassSpotlight>
    </div>,
  args: {
    targetRect: new DOMRect(20, 92, 560, 108),
    onClose: fn()
  }
}`,...g.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    targetRect: new DOMRect(50, 50, 300, 200),
    onClose: fn()
  }
}`,...c.parameters?.docs?.source}}};const z=["Default","LargeTarget"];export{g as Default,c as LargeTarget,z as __namedExportsOrder,W as default};
