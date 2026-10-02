import{r as a,j as e,c as k}from"./iframe-DFMMcocb.js";import{O as A}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const O=({rotation:n})=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"glass-w-6 glass-h-6",style:{transform:`rotate(${n}deg)`,transition:"transform 0.2s ease-out"},children:[e.jsx("path",{d:"M21.5 2V8H15.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M2.5 22V16H8.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M19.13 5.86998C18.29 4.99998 17.27 4.31998 16.14 3.87998C15.01 3.43998 13.79 3.24998 12.56 3.32998C11.33 3.40998 10.14 3.75998 9.07 4.35998C8 4.95998 7.07 5.79998 6.35 6.81998M4.87 18.13C5.71 19 6.73 19.68 7.86 20.12C8.99 20.56 10.21 20.75 11.44 20.67C12.67 20.59 13.86 20.24 14.93 19.64C16 19.04 16.93 18.2 17.65 17.18",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]}),z=()=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"glass-w-6 glass-h-6 glass-animate-spin",children:e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeDasharray:"60",strokeDashoffset:"20",opacity:"0.5"})}),g=a.forwardRef(({children:n,onRefresh:c,refreshing:d=!1,threshold:l=80,maxDistance:h=120,showIndicator:C=!0,indicator:P,loadingIndicator:q,pullText:L="Pull to refresh",releaseText:V="Release to refresh",refreshingText:D="Refreshing...",elevation:E="level2",disabled:i=!1,className:I,...S},G)=>{const[o,m]=a.useState(0),[r,x]=a.useState(!1),[s,v]=a.useState(d),f=a.useRef(null),j=a.useRef(0),T=a.useRef(0);a.useEffect(()=>{v(d)},[d]);const b=a.useCallback(t=>{if(i||s)return;const u=f.current;u&&(T.current=u.scrollTop,T.current===0&&(j.current=t.touches[0].clientY,x(!0)))},[i,s]),y=a.useCallback(t=>{if(!r||i||s)return;const u=f.current;if(!u||u.scrollTop>0){x(!1),m(0);return}const N=t.touches[0].clientY-j.current;if(N>0){t.preventDefault();const H=Math.min(h,N*(1-N/(h*2)));m(H)}},[r,i,s,h]),w=a.useCallback(async()=>{if(r)if(x(!1),o>=l&&!i&&!s){v(!0);try{await c()}catch{}finally{setTimeout(()=>{v(!1),m(0)},300)}}else m(0)},[r,o,l,i,s,c]);a.useEffect(()=>{const t=f.current;if(t)return t.addEventListener("touchstart",b,{passive:!1}),t.addEventListener("touchmove",y,{passive:!1}),t.addEventListener("touchend",w),()=>{t.removeEventListener("touchstart",b),t.removeEventListener("touchmove",y),t.removeEventListener("touchend",w)}},[b,y,w]);const R=Math.min(o/l,1),_=R*360,M=Math.min(R*2,1),Y=.5+R*.5,W=s?q||e.jsx(z,{}):P||e.jsx(O,{rotation:_}),$=s?D:o>=l?V:L;return e.jsxs("div",{"data-glass-component":!0,ref:G,className:k("relative overflow-hidden",I),...S,children:[C&&(o>0||s)&&e.jsx(A,{elevation:E,className:"glass-absolute glass-left-0 glass-right-0 glass-top-0 glass-z-50 glass-flex glass-items-center glass-justify-center glass-p-4",style:{transform:`translateY(${s?0:o-60}px)`,opacity:s?1:M,transition:s||!r?"transform 0.3s ease-out, opacity 0.3s ease-out":"none"},children:e.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",style:{transform:`scale(${s?1:Y})`,transition:s||!r?"transform 0.3s ease-out":"none"},children:[e.jsx("div",{className:"glass-text-primary",children:W}),e.jsx("span",{className:"glass-text-sm glass-text-secondary",children:$})]})}),e.jsx("div",{ref:f,className:k("h-full overflow-auto",(r||s)&&"overscroll-none"),style:{transform:`translateY(${s?60:0}px)`,transition:s?"transform 0.3s ease-out":"none"},children:n})]})});g.displayName="GlassPullToRefresh";try{g.displayName="GlassPullToRefresh",g.__docgenInfo={description:"",displayName:"GlassPullToRefresh",props:{onRefresh:{defaultValue:null,description:"Callback when refresh is triggered",name:"onRefresh",required:!0,type:{name:"() => void | Promise<void>"}},refreshing:{defaultValue:{value:"false"},description:"Whether the component is currently refreshing",name:"refreshing",required:!1,type:{name:"boolean | undefined"}},threshold:{defaultValue:{value:"80"},description:"Pull distance threshold to trigger refresh (in pixels)",name:"threshold",required:!1,type:{name:"number | undefined"}},maxDistance:{defaultValue:{value:"120"},description:"Maximum pull distance (in pixels)",name:"maxDistance",required:!1,type:{name:"number | undefined"}},showIndicator:{defaultValue:{value:"true"},description:"Whether to show the pull indicator",name:"showIndicator",required:!1,type:{name:"boolean | undefined"}},indicator:{defaultValue:null,description:"Custom refresh indicator",name:"indicator",required:!1,type:{name:"ReactNode"}},loadingIndicator:{defaultValue:null,description:"Custom loading indicator",name:"loadingIndicator",required:!1,type:{name:"ReactNode"}},pullText:{defaultValue:{value:"Pull to refresh"},description:"Pull instruction text",name:"pullText",required:!1,type:{name:"string | undefined"}},releaseText:{defaultValue:{value:"Release to refresh"},description:"Release instruction text",name:"releaseText",required:!1,type:{name:"string | undefined"}},refreshingText:{defaultValue:{value:"Refreshing..."},description:"Refreshing text",name:"refreshingText",required:!1,type:{name:"string | undefined"}},elevation:{defaultValue:{value:"level2"},description:"Glassmorphism elevation level",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'},{value:'"level5"'}]}},disabled:{defaultValue:{value:"false"},description:"Disable pull to refresh",name:"disabled",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const X={title:"Effects + Advanced/Glass Pull To Refresh",component:g,parameters:{layout:"centered",previewSurface:"app",controls:{exclude:["onRefresh"]},docs:{description:{component:"A touch-first refresh container shown in its real refreshing state so the liquid-glass progress indicator remains visible for inspection."}}},args:{onRefresh:async()=>{},refreshing:!0,threshold:80,maxDistance:120,showIndicator:!0,pullText:"Pull to refresh",releaseText:"Release to refresh",refreshingText:"Refreshing your briefing…",elevation:"level2",disabled:!1}},B=[["09:30","Product review","Studio 4"],["12:00","Design critique","North room"],["15:30","Launch readiness","Atrium"]],p={render:n=>e.jsx("div",{style:{width:"min(430px, calc(100vw - 32px))",height:"min(680px, calc(100vh - 32px))",minHeight:520,overflow:"hidden",border:"1px solid rgba(255, 255, 255, 0.28)",borderRadius:32,boxShadow:"0 24px 72px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.32)",color:"rgba(15, 23, 42, 0.92)",background:"linear-gradient(160deg, rgb(239, 243, 247) 0%, rgb(250, 252, 254) 52%, rgb(227, 234, 240) 100%)"},children:e.jsx(g,{...n,className:"glass-h-full",children:e.jsxs("div",{className:"glass-p-6",style:{paddingTop:32},children:[e.jsx("p",{className:"glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase",children:"Today"}),e.jsx("h2",{className:"glass-mt-2 glass-text-2xl glass-font-semibold",children:"Daily briefing"}),e.jsx("p",{className:"glass-mt-2 glass-text-sm",style:{opacity:.7},children:"Your schedule is being refreshed with the latest updates."}),e.jsx("div",{className:"glass-mt-8 glass-border-t glass-border-subtle",children:B.map(([c,d,l])=>e.jsxs("article",{className:"glass-flex glass-items-start glass-gap-4 glass-border-b glass-border-subtle glass-py-5",children:[e.jsx("time",{className:"glass-text-sm glass-font-medium",style:{width:56,flexShrink:0},children:c}),e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-base glass-font-semibold",children:d}),e.jsx("p",{className:"glass-mt-1 glass-text-sm",style:{opacity:.66},children:l})]})]},c))})]})})})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "min(430px, calc(100vw - 32px))",
    height: "min(680px, calc(100vh - 32px))",
    minHeight: 520,
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.28)",
    borderRadius: 32,
    boxShadow: "0 24px 72px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.32)",
    color: "rgba(15, 23, 42, 0.92)",
    background: "linear-gradient(160deg, rgb(239, 243, 247) 0%, rgb(250, 252, 254) 52%, rgb(227, 234, 240) 100%)"
  }}>
      <GlassPullToRefreshComponent {...args} className="glass-h-full">
        <div className="glass-p-6" style={{
        paddingTop: 32
      }}>
          <p className="glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase">
            Today
          </p>
          <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold">
            Daily briefing
          </h2>
          <p className="glass-mt-2 glass-text-sm" style={{
          opacity: 0.7
        }}>
            Your schedule is being refreshed with the latest updates.
          </p>

          <div className="glass-mt-8 glass-border-t glass-border-subtle">
            {briefingItems.map(([time, title, location]) => <article key={time} className="glass-flex glass-items-start glass-gap-4 glass-border-b glass-border-subtle glass-py-5">
                <time className="glass-text-sm glass-font-medium" style={{
              width: 56,
              flexShrink: 0
            }}>
                  {time}
                </time>
                <div>
                  <h3 className="glass-text-base glass-font-semibold">
                    {title}
                  </h3>
                  <p className="glass-mt-1 glass-text-sm" style={{
                opacity: 0.66
              }}>
                    {location}
                  </p>
                </div>
              </article>)}
          </div>
        </div>
      </GlassPullToRefreshComponent>
    </div>
}`,...p.parameters?.docs?.source}}};const Z=["GlassPullToRefresh"];export{p as GlassPullToRefresh,Z as __namedExportsOrder,X as default};
