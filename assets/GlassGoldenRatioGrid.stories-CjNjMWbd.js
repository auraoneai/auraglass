import{r as l,h as Ss,j as s,e as Gs,m as Hs}from"./iframe-OZreUAtx.js";import{f as Z}from"./index-CLSxArU-.js";import{u as Ws}from"./useMotionPreference-C9fYZmaT.js";import{u as Is}from"./soundDesign-CS6RtZ5F.js";import{O as Cs}from"./OptimizedGlassCore-DAQZMOh8.js";import{H as ks}from"./house-B8euixT1.js";import{U as Ms}from"./user-DC7qwYqR.js";import{S as zs}from"./settings-DEpeJ147.js";import{M as Vs,B as qs}from"./mail-BFJzCMLg.js";import{S as Ds}from"./star-8a-JIYuC.js";import{F as Os}from"./file-text-DWaq52VL.js";import{T as Ts,G as _s}from"./trophy-DTguJvtM.js";import{S as Es}from"./search-BsioJkNH.js";import{C as Ps}from"./calendar-C7KsqgIS.js";import{C as $s}from"./clock-wLQwmP2a.js";import{I as cs}from"./image-CcGvtwes.js";import{V as ds}from"./video-CHbjYiaf.js";import{M as As}from"./music-BlJTQN6-.js";import{C as Fs}from"./camera-QlyT86BH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./createLucideIcon-B0rn4XfH.js";const F=l.forwardRef(({items:g=[],containerWidth:u=800,containerHeight:Q=600,goldenRatio:d=1.618,subdivisionLevels:h=4,spacing:p=8,animateLayout:Us=!0,showGrid:ss=!1,showRatioLines:es=!0,responsive:f=!0,onItemClick:as,onItemHover:is,onLayoutChange:ts,glassConfig:gs={},soundEnabled:y=!0,className:ms="",style:us={},...hs},ps)=>{const[fs,ys]=l.useState(null),[xs,vs]=l.useState(null),[r,bs]=l.useState({width:u,height:Q}),X=l.useRef(null),{prefersReducedMotion:ws}=Ws(),js=Ss(),{play:x}=Is();l.useEffect(()=>{if(!f||!X.current)return;const e=new ResizeObserver(t=>{for(let a of t){const{width:c,height:i}=a.contentRect;bs({width:c,height:i})}});return e.observe(X.current),()=>e.disconnect()},[f]);const rs=l.useCallback(()=>{const e=[],t=[{x:0,y:0,width:r.width,height:r.height,level:0}];for(;t.length>0&&e.length<Math.pow(2,h);){const a=t.shift();if(a.level>=h){e.push({...a,ratio:a.width/a.height});continue}if(a.width>a.height){const i=a.width/d,n=a.width-i;t.push({x:a.x,y:a.y,width:i,height:a.height,level:a.level+1}),t.push({x:a.x+i,y:a.y,width:n,height:a.height,level:a.level+1})}else{const i=a.height/d,n=a.height-i;t.push({x:a.x,y:a.y,width:a.width,height:i,level:a.level+1}),t.push({x:a.x,y:a.y+i,width:a.width,height:n,level:a.level+1})}}return e},[r,d,h]),ns=l.useCallback(e=>{const t=[...g].sort((i,n)=>(n.priority||0)-(i.priority||0));return[...e].sort((i,n)=>n.width*n.height-i.width*i.height).map((i,n)=>{const v=t[n];return{...i,item:v||void 0}})},[g]),Y=l.useMemo(()=>{const e=rs(),t=ns(e);return ts?.(t),t},[rs,ns,ts]),ls=l.useCallback(()=>{const e=[],t=r.width/2,a=r.height/2,c=Math.min(r.width,r.height)/3;for(let i=0;i<200;i++){const n=i*.2,v=c/20*Math.pow(d,n/(Math.PI*2)),J=t+v*Math.cos(n),K=a+v*Math.sin(n);J>=0&&J<=r.width&&K>=0&&K<=r.height&&e.push({x:J,y:K})}return e},[r,d]),Ns=l.useMemo(()=>ls(),[ls]),Ls=l.useCallback(e=>{vs(e.id),as?.(e),y&&x("click")},[as,y,x]),os=l.useCallback(e=>{ys(e?.id||null),is?.(e),y&&e&&x("hover")},[is,y,x]),Rs=()=>({hidden:{scale:0,opacity:0},visible:e=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:ws?0:e*.05}}),hover:{scale:1.02,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.05,transition:{type:"spring",tension:400,friction:20}}});return s.jsxs(Cs,{ref:ps,className:`glass-golden-ratio-grid relative overflow-hidden ${ms}`,style:{width:f?"100%":u,height:f?"100%":Q,minHeight:Q,...us},glassConfig:{blur:12,opacity:.95,saturation:1.05,brightness:1.02,...gs},role:"grid","aria-label":"Golden ratio layout grid",id:js,...hs,children:[s.jsxs("div",{ref:X,className:"glass-absolute glass-inset-0",style:{width:r.width,height:r.height},children:[es&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:r.width,height:r.height,children:s.jsx("path",{d:`M ${Ns.map(e=>`${e.x},${e.y}`).join(" L ")}`,stroke:"rgba(255, 215, 0, 0.3)",strokeWidth:"2",fill:"none",strokeDasharray:"5,5"})}),ss&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:r.width,height:r.height,children:Y.map((e,t)=>s.jsx("rect",{x:e.x,y:e.y,width:e.width,height:e.height,stroke:"rgba(var(--glass-color-white) / var(--glass-opacity-20))",strokeWidth:"1",fill:"none",strokeDasharray:"3,3"},`grid-${t}`))}),s.jsx(Gs,{children:Y.map((e,t)=>{const a=!!e.item,c=a&&fs===e.item.id,i=a&&xs===e.item.id;return s.jsxs(Hs.div,{className:`
                    absolute overflow-hidden
                    ${a?"cursor-pointer":"cursor-default"}
                  `,style:{left:e.x+p/2,top:e.y+p/2,width:e.width-p,height:e.height-p},custom:t,variants:Rs(),initial:"hidden",animate:i?"selected":c?"hover":"visible",exit:"hidden",onMouseEnter:()=>a&&os(e.item),onMouseLeave:()=>os(null),onClick:()=>a&&Ls(e.item),role:"row",children:[a?s.jsx("div",{className:`
                                          w-full h-full glass-surface rounded-lg border border-white/20
                                          glass-backdrop-blur-md transition-all duration-200 p-3
                                          flex items-center justify-center text-center
                                          ${c||i?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                                        `,role:"gridcell",children:e.item.content}):s.jsx("div",{className:"glass-w-full glass-h-full glass-border glass-border-dashed glass-border-white/10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-30",role:"gridcell",children:s.jsx("div",{className:"glass-text-xs",children:"Empty"})}),(ss||c)&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-left-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-px-1 glass-py-0.5 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:e.ratio.toFixed(2)}),Math.abs(e.ratio-d)<.1&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-right-1 glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-opacity-70"})]},`section-${t}`)})})]}),s.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Sections: ",Y.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Items: ",g.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Golden Ratio: ",d]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Levels: ",h]})]}),s.jsxs("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full"}),"Golden Ratio"]}),es&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-4 glass-h-0-5 glass-surface-yellow glass-opacity-50",style:{background:"repeating-linear-gradient(to right, var(--glass-color-warning-light) 0, var(--glass-color-warning-light) 3px, transparent 3px, transparent 6px)"}}),"Spiral"]})]})]})});F.displayName="GlassGoldenRatioGrid";try{F.displayName="GlassGoldenRatioGrid",F.__docgenInfo={description:"",displayName:"GlassGoldenRatioGrid",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"GoldenRatioItem[]"}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},goldenRatio:{defaultValue:{value:"1.618"},description:"",name:"goldenRatio",required:!1,type:{name:"number | undefined"}},subdivisionLevels:{defaultValue:{value:"4"},description:"",name:"subdivisionLevels",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"8"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animateLayout:{defaultValue:{value:"true"},description:"",name:"animateLayout",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRatioLines:{defaultValue:{value:"true"},description:"",name:"showRatioLines",required:!1,type:{name:"boolean | undefined"}},responsive:{defaultValue:{value:"true"},description:"",name:"responsive",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: GoldenRatioItem) => void) | undefined"}},onItemHover:{defaultValue:null,description:"",name:"onItemHover",required:!1,type:{name:"((item: GoldenRatioItem | null) => void) | undefined"}},onLayoutChange:{defaultValue:null,description:"",name:"onLayoutChange",required:!1,type:{name:"((sections: GoldenRatioSection[]) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const o=[{id:"home",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(ks,{size:24}),s.jsx("span",{className:"glass-text-sm",children:"Home"})]}),priority:10,category:"navigation"},{id:"profile",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Ms,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Profile"})]}),priority:8,category:"user"},{id:"settings",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(zs,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Settings"})]}),priority:6,category:"system"},{id:"messages",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Vs,{size:18}),s.jsx("span",{className:"glass-text-xs",children:"Messages"})]}),priority:7,category:"communication"}],m=[{id:"featured-image",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(cs,{size:32,className:"glass-mx-auto glass-mb-2"}),s.jsx("span",{className:"glass-text-sm glass-font-semibold",children:"Featured Photo"})]})}),priority:15,category:"media"},{id:"video-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(ds,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Video"})]})}),priority:10,category:"media"},{id:"music-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(As,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Music"})]})}),priority:8,category:"media"},{id:"gallery-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(Fs,{size:20})}),priority:6,category:"media"},{id:"gallery-2",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(cs,{size:20})}),priority:5,category:"media"},{id:"gallery-3",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(ds,{size:20})}),priority:4,category:"media"}],U=[{id:"main-chart",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"Analytics"}),s.jsx("div",{className:"glass-w-full glass-h-12 glass-surface-subtle/20 glass-radius glass-flex glass-items-end justify-around",children:[...Array(8)].map((g,u)=>s.jsx("div",{className:"glass-w-2 glass-surface-subtle/60 glass-radius-t",style:{height:`${20+Math.random()*60}%`}},u))})]}),priority:20,category:"analytics"},{id:"stats-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"1,234"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Total Users"})]}),priority:15,category:"stats"},{id:"stats-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"89%"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Conversion"})]}),priority:12,category:"stats"},{id:"calendar",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Ps,{size:24,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"Calendar"})]})}),priority:10,category:"productivity"},{id:"notifications",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(qs,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"3 New"})]})}),priority:8,category:"communication"},{id:"clock",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx($s,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:new Date().toLocaleTimeString()})]})}),priority:6,category:"utility"}],B=[{id:"hero-content",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-3",children:[s.jsx(Ds,{size:20,className:"glass-text-secondary"}),s.jsx("h2",{className:"glass-text-lg glass-font-bold",children:"Featured Article"})]}),s.jsx("p",{className:"glass-text-sm glass-opacity-90 glass-mb-3",children:"Discover the mathematical beauty of the golden ratio in modern design systems."}),s.jsx("button",{className:"glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-px-3 glass-py-1 glass-radius glass-text-sm transition-colors",children:"Read More"})]}),priority:25,category:"content"},{id:"article-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(Os,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Design Principles"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Essential guidelines for creating harmonious layouts..."})]}),priority:12,category:"content"},{id:"article-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(Ts,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Best Practices"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Learn from award-winning designs..."})]}),priority:10,category:"content"},{id:"promotion",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(_s,{size:24,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-sm glass-font-semibold",children:"Special Offer"}),s.jsx("div",{className:"glass-text-xs glass-opacity-90",children:"50% Off"})]})}),priority:18,category:"promotion"},{id:"search",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Es,{size:20,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-xs",children:"Quick Search"})]})}),priority:8,category:"utility"}],pe={title:"Glass UI/Layouts/GlassGoldenRatioGrid",component:F,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},goldenRatio:{control:{type:"range",min:1.4,max:2,step:.01}},subdivisionLevels:{control:{type:"range",min:2,max:6,step:1}},spacing:{control:{type:"range",min:2,max:20,step:2}},animateLayout:{control:"boolean"},showGrid:{control:"boolean"},showRatioLines:{control:"boolean"},responsive:{control:"boolean"},soundEnabled:{control:"boolean"}}},b={args:{items:o,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:4,spacing:8,animateLayout:!0,showGrid:!1,showRatioLines:!0,responsive:!1,soundEnabled:!0}},w={args:{items:m,containerWidth:900,containerHeight:700,goldenRatio:1.618,subdivisionLevels:4,spacing:12,showRatioLines:!0}},j={args:{items:U,containerWidth:1e3,containerHeight:800,goldenRatio:1.618,subdivisionLevels:4,spacing:10,showGrid:!0,showRatioLines:!1}},N={args:{items:B,containerWidth:900,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,spacing:15,showRatioLines:!0}},L={args:{items:o,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,showRatioLines:!0}},R={args:{items:o,containerWidth:800,containerHeight:600,goldenRatio:1.5,subdivisionLevels:4,showRatioLines:!0}},S={args:{items:o,containerWidth:800,containerHeight:600,goldenRatio:1.414,subdivisionLevels:4,showRatioLines:!0}},G={args:{items:m,containerWidth:800,containerHeight:600,subdivisionLevels:2,spacing:16,showGrid:!0}},H={args:{items:U,containerWidth:900,containerHeight:700,subdivisionLevels:5,spacing:6,showGrid:!0}},W={args:{items:o,containerWidth:800,containerHeight:600,spacing:20,showGrid:!0}},I={args:{items:m,containerWidth:800,containerHeight:600,spacing:4,showGrid:!1}},C={args:{items:o,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!0}},k={args:{items:m,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!1}},M={args:{items:o,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!0}},z={args:{items:o,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!1}},V={args:{items:o,containerWidth:800,containerHeight:600,animateLayout:!1}},q={args:{items:B,responsive:!0,subdivisionLevels:3,showRatioLines:!0}},D={args:{items:U,containerWidth:1200,containerHeight:900,subdivisionLevels:5,spacing:12,showGrid:!0}},O={args:{items:o,containerWidth:500,containerHeight:400,subdivisionLevels:3,spacing:8}},T={args:{items:m,containerWidth:600,containerHeight:600,subdivisionLevels:4,showRatioLines:!0}},_={args:{items:B,containerWidth:1e3,containerHeight:500,subdivisionLevels:3,showRatioLines:!0}},E={args:{items:U,containerWidth:500,containerHeight:800,subdivisionLevels:4,showRatioLines:!0}},P={args:{items:o,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:20,opacity:.85,saturation:1.2,brightness:1.1,contrast:1.05}}},$={args:{items:o,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},A={args:{items:B,containerWidth:900,containerHeight:700,showRatioLines:!0,showGrid:!0,onItemClick:Z(),onItemHover:Z(),onLayoutChange:Z()}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 8,
    animateLayout: true,
    showGrid: false,
    showRatioLines: true,
    responsive: false,
    soundEnabled: true
  }
}`,...b.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 900,
    containerHeight: 700,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 12,
    showRatioLines: true
  }
}`,...w.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 1000,
    containerHeight: 800,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 10,
    showGrid: true,
    showRatioLines: false
  }
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 3,
    spacing: 15,
    showRatioLines: true
  }
}`,...N.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618,
    // Classic golden ratio
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...L.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.5,
    // Modified ratio
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...R.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.414,
    // Silver ratio (√2)
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...S.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    subdivisionLevels: 2,
    spacing: 16,
    showGrid: true
  }
}`,...G.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 900,
    containerHeight: 700,
    subdivisionLevels: 5,
    spacing: 6,
    showGrid: true
  }
}`,...H.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 20,
    showGrid: true
  }
}`,...W.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 4,
    showGrid: false
  }
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: true
  }
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: false
  }
}`,...k.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: true
  }
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: false
  }
}`,...z.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    animateLayout: false
  }
}`,...V.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    responsive: true,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...q.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 1200,
    containerHeight: 900,
    subdivisionLevels: 5,
    spacing: 12,
    showGrid: true
  }
}`,...D.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 500,
    containerHeight: 400,
    subdivisionLevels: 3,
    spacing: 8
  }
}`,...O.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 600,
    containerHeight: 600,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...T.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 1000,
    containerHeight: 500,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,..._.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 500,
    containerHeight: 800,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...E.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showRatioLines: true,
    glassConfig: {
      blur: 20,
      opacity: 0.85,
      saturation: 1.2,
      brightness: 1.1,
      contrast: 1.05
    }
  }
}`,...P.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showRatioLines: true,
    glassConfig: {
      blur: 5,
      opacity: 0.98,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  }
}`,...$.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 700,
    showRatioLines: true,
    showGrid: true,
    onItemClick: fn(),
    onItemHover: fn(),
    onLayoutChange: fn()
  }
}`,...A.parameters?.docs?.source}}};const fe=["Default","MediaGallery","Dashboard","ContentLayout","ClassicGoldenRatio","ModifiedRatio","SilverRatio","ShallowSubdivision","DeepSubdivision","WideSpacing","TightSpacing","WithGridLines","NoGridLines","SpiralOnly","GridOnly","NoAnimation","Responsive","LargeContainer","SmallContainer","SquareContainer","WideContainer","TallContainer","CustomGlass","MinimalGlass","InteractiveDemo"];export{L as ClassicGoldenRatio,N as ContentLayout,P as CustomGlass,j as Dashboard,H as DeepSubdivision,b as Default,z as GridOnly,A as InteractiveDemo,D as LargeContainer,w as MediaGallery,$ as MinimalGlass,R as ModifiedRatio,V as NoAnimation,k as NoGridLines,q as Responsive,G as ShallowSubdivision,S as SilverRatio,O as SmallContainer,M as SpiralOnly,T as SquareContainer,E as TallContainer,I as TightSpacing,_ as WideContainer,W as WideSpacing,C as WithGridLines,fe as __namedExportsOrder,pe as default};
