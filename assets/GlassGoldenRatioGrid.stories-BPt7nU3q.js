import{r as o,j as s,d as Os,m as _s}from"./iframe-Cqi-9gHA.js";import{f as rs}from"./index-DdjpOZjl.js";import{b2 as $s,a7 as Ts,S as Ps,az as As,aR as Fs,aK as Bs,l as Us,o as Xs,m as Ys,e as Ks,as as Qs,k as Js,aN as xs,aM as ys,b1 as Zs,bm as se}from"./components-D_brxh8E.js";import{u as ee}from"./useMotionPreference-fk1VFuMQ.js";import{u as ae}from"./a11y-DBBBNlGj.js";import{u as ie}from"./soundDesign-BN0GUCjA.js";import{O as te}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-DlsmEFaF.js";const Q=o.forwardRef(({items:u=[],containerWidth:f=800,containerHeight:y=600,goldenRatio:h=1.618,subdivisionLevels:ns=4,spacing:ls=8,animateLayout:re=!0,showGrid:vs=!1,showRatioLines:bs=!0,showEmptyLabels:ws=!1,responsive:g=!0,onItemClick:os,onItemHover:ds,onLayoutChange:cs,glassConfig:js={},soundEnabled:b=!0,compact:l=!1,contained:Ls=!1,maxHeight:Ns,className:Ss="",style:Rs={},...Gs},w)=>{const[Hs,Ws]=o.useState(null),[Is,Cs]=o.useState(null),[r,ks]=o.useState({width:f,height:y}),ss=o.useRef(null),Ms=o.useRef(null),{prefersReducedMotion:zs}=ee(),qs=ae(),{play:j}=ie(),x=l?360:f,m=l?220:y,p=g&&r.width<560,L=l||p?Math.min(ns,r.width<400?2:3):ns,gs=l||p?!1:vs,ms=l||p?!1:bs,N=p?Math.min(ls,5):ls,es=Ns??(l||Ls?m:void 0);o.useEffect(()=>{if(!g||!ss.current)return;const e=new ResizeObserver(t=>{for(let a of t){const c=Math.max(1,a.contentRect.width),i=Math.max(320,Math.min(y,c*(y/f)));ks(n=>n.width===c&&n.height===i?n:{width:c,height:i})}});return e.observe(ss.current),()=>e.disconnect()},[g,y,f]);const us=o.useCallback(()=>{const e=[],t=[{x:0,y:0,width:l?x:r.width,height:l?m:r.height,level:0}];for(;t.length>0&&e.length<Math.pow(2,L);){const a=t.shift();if(a.level>=L){e.push({...a,ratio:a.width/a.height});continue}if(a.width>a.height){const i=a.width/h,n=a.width-i;t.push({x:a.x,y:a.y,width:i,height:a.height,level:a.level+1}),t.push({x:a.x+i,y:a.y,width:n,height:a.height,level:a.level+1})}else{const i=a.height/h,n=a.height-i;t.push({x:a.x,y:a.y,width:a.width,height:i,level:a.level+1}),t.push({x:a.x,y:a.y+i,width:a.width,height:n,level:a.level+1})}}return e},[l,r,m,L,x,h]),hs=o.useCallback(e=>{const t=[...u].sort((i,n)=>(n.priority||0)-(i.priority||0));return[...e].sort((i,n)=>n.width*n.height-i.width*i.height).map((i,n)=>{const S=t[n];return{...i,item:S||void 0}})},[u]),as=o.useMemo(()=>{const e=us(),t=hs(e);return cs?.(t),t},[us,hs,cs]),ps=o.useCallback(()=>{const e=[],t=r.width/2,a=r.height/2,c=Math.min(r.width,r.height)/3;for(let i=0;i<200;i++){const n=i*.2,S=c/20*Math.pow(h,n/(Math.PI*2)),is=t+S*Math.cos(n),ts=a+S*Math.sin(n);is>=0&&is<=r.width&&ts>=0&&ts<=r.height&&e.push({x:is,y:ts})}return e},[r,h]),Vs=o.useMemo(()=>ps(),[ps]),Ds=o.useCallback(e=>{Cs(e.id),os?.(e),b&&j("click")},[os,b,j]),fs=o.useCallback(e=>{Ws(e?.id||null),ds?.(e),b&&e&&j("hover")},[ds,b,j]),Es=()=>({hidden:{scale:0,opacity:0},visible:e=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:zs?0:e*.05}}),hover:{scale:1.02,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.05,transition:{type:"spring",tension:400,friction:20}}});return s.jsxs(te,{ref:e=>{ss.current=e,typeof w=="function"?w(e):w&&(w.current=e)},className:`glass-golden-ratio-grid relative overflow-auto ${Ss}`,style:{width:g?"100%":x,maxWidth:g?x:void 0,minWidth:g||l?void 0:x,height:l?m:g?r.height:m,minHeight:l?m:g?320:m,maxHeight:typeof es=="number"?`${es}px`:es,overflowX:"auto",overflowY:"auto",...Rs},glassConfig:{blur:12,opacity:.95,saturation:1.05,brightness:1.02,...js},role:"grid","aria-label":"Golden ratio layout grid",id:qs,...Gs,children:[s.jsxs("div",{ref:Ms,className:"glass-absolute glass-inset-0",style:{width:l?x:r.width,height:l?m:r.height},children:[ms&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:r.width,height:r.height,children:s.jsx("path",{d:`M ${Vs.map(e=>`${e.x},${e.y}`).join(" L ")}`,stroke:"rgba(255, 215, 0, 0.3)",strokeWidth:"2",fill:"none",strokeDasharray:"5,5"})}),gs&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:r.width,height:r.height,children:as.map((e,t)=>s.jsx("rect",{x:e.x,y:e.y,width:e.width,height:e.height,stroke:"rgba(var(--glass-color-white) / var(--glass-opacity-20))",strokeWidth:"1",fill:"none",strokeDasharray:"3,3"},`grid-${t}`))}),s.jsx(Os,{children:as.map((e,t)=>{const a=!!e.item,c=a&&Hs===e.item.id,i=a&&Is===e.item.id;return s.jsxs(_s.div,{className:`
                    absolute overflow-visible
                    ${a?"cursor-pointer":"cursor-default"}
                  `,style:{left:e.x+N/2,top:e.y+N/2,width:Math.max(0,e.width-N),height:Math.max(0,e.height-N),boxSizing:"border-box"},custom:t,variants:Es(),initial:"hidden",animate:i?"selected":c?"hover":"visible",exit:"hidden",onMouseEnter:()=>a&&fs(e.item),onMouseLeave:()=>fs(null),onClick:()=>a&&Ds(e.item),role:"row",children:[a?s.jsx("div",{className:`
                                          w-full h-full box-border glass-surface rounded-lg border border-white/20
                                          glass-backdrop-blur-md transition-all duration-200
                                          ${p?"p-1":"p-3"}
                                          flex min-w-0 min-h-0 items-center justify-center text-center
                                          ${c||i?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                                        `,style:{width:"100%",height:"100%",boxSizing:"border-box",overflow:"hidden"},role:"gridcell",children:e.item.content}):s.jsx("div",{className:"glass-w-full glass-h-full glass-border glass-border-dashed glass-border-white/10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-30",style:{width:"100%",height:"100%",boxSizing:"border-box",overflow:"hidden"},role:"gridcell",children:ws&&s.jsx("div",{className:"glass-text-xs",children:"Empty"})}),(gs||c&&!l)&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-left-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-px-1 glass-py-0.5 glass-radius glass-backdrop-blur-sm glass-contrast-guard","data-glass-overlay":"true",children:e.ratio.toFixed(2)}),Math.abs(e.ratio-h)<.1&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-right-1 glass-w-2 glass-h-2 glass-surface-overlay glass-radius-full","data-glass-overlay":"true"})]},`section-${t}`)})})]}),!l&&!p&&s.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Sections: ",as.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Items: ",u.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Golden Ratio: ",h]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Levels: ",L]})]}),!l&&!p&&s.jsxs("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-overlay glass-radius-full"}),"Golden Ratio"]}),ms&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-4 glass-h-0-5 glass-surface-overlay",style:{background:"rgba(255, 255, 255, 0.24)"}}),"Spiral"]})]})]})});Q.displayName="GlassGoldenRatioGrid";try{Q.displayName="GlassGoldenRatioGrid",Q.__docgenInfo={description:"",displayName:"GlassGoldenRatioGrid",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"GoldenRatioItem[]"}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},goldenRatio:{defaultValue:{value:"1.618"},description:"",name:"goldenRatio",required:!1,type:{name:"number | undefined"}},subdivisionLevels:{defaultValue:{value:"4"},description:"",name:"subdivisionLevels",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"8"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animateLayout:{defaultValue:{value:"true"},description:"",name:"animateLayout",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRatioLines:{defaultValue:{value:"true"},description:"",name:"showRatioLines",required:!1,type:{name:"boolean | undefined"}},showEmptyLabels:{defaultValue:{value:"false"},description:"",name:"showEmptyLabels",required:!1,type:{name:"boolean | undefined"}},responsive:{defaultValue:{value:"true"},description:"",name:"responsive",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: GoldenRatioItem) => void) | undefined"}},onItemHover:{defaultValue:null,description:"",name:"onItemHover",required:!1,type:{name:"((item: GoldenRatioItem | null) => void) | undefined"}},onLayoutChange:{defaultValue:null,description:"",name:"onLayoutChange",required:!1,type:{name:"((sections: GoldenRatioSection[]) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const d=[{id:"home",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx($s,{size:24}),s.jsx("span",{className:"glass-text-sm",children:"Home"})]}),priority:10,category:"navigation"},{id:"profile",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Ts,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Profile"})]}),priority:8,category:"user"},{id:"settings",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Ps,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Settings"})]}),priority:6,category:"system"},{id:"messages",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(As,{size:18}),s.jsx("span",{className:"glass-text-xs",children:"Messages"})]}),priority:7,category:"communication"}],v=[{id:"featured-image",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(xs,{size:32,className:"glass-mx-auto glass-mb-2"}),s.jsx("span",{className:"glass-text-sm glass-font-semibold",children:"Featured Photo"})]})}),priority:15,category:"media"},{id:"video-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(ys,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Video"})]})}),priority:10,category:"media"},{id:"music-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Zs,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Music"})]})}),priority:8,category:"media"},{id:"gallery-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(se,{size:20})}),priority:6,category:"media"},{id:"gallery-2",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(xs,{size:20})}),priority:5,category:"media"},{id:"gallery-3",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(ys,{size:20})}),priority:4,category:"media"}],J=[{id:"main-chart",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"Analytics"}),s.jsx("div",{className:"glass-w-full glass-h-12 glass-surface-subtle/20 glass-radius glass-flex glass-items-end justify-around",children:[...Array(8)].map((u,f)=>s.jsx("div",{className:"glass-w-2 glass-surface-subtle/60 glass-radius-t",style:{height:`${20+Math.random()*60}%`}},f))})]}),priority:20,category:"analytics"},{id:"stats-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"1,234"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Total Users"})]}),priority:15,category:"stats"},{id:"stats-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"89%"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Conversion"})]}),priority:12,category:"stats"},{id:"calendar",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Ks,{size:24,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"Calendar"})]})}),priority:10,category:"productivity"},{id:"notifications",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Qs,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"3 New"})]})}),priority:8,category:"communication"},{id:"clock",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Js,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:new Date().toLocaleTimeString()})]})}),priority:6,category:"utility"}],Z=[{id:"hero-content",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-3",children:[s.jsx(Fs,{size:20,className:"glass-text-secondary"}),s.jsx("h2",{className:"glass-text-lg glass-font-bold",children:"Featured Article"})]}),s.jsx("p",{className:"glass-text-sm glass-opacity-90 glass-mb-3",children:"Discover the mathematical beauty of the golden ratio in modern design systems."}),s.jsx("button",{className:"glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-px-3 glass-py-1 glass-radius glass-text-sm transition-colors",children:"Read More"})]}),priority:25,category:"content"},{id:"article-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(Bs,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Design Principles"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Essential guidelines for creating harmonious layouts..."})]}),priority:12,category:"content"},{id:"article-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(Us,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Best Practices"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Learn from award-winning designs..."})]}),priority:10,category:"content"},{id:"promotion",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Xs,{size:24,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-sm glass-font-semibold",children:"Special Offer"}),s.jsx("div",{className:"glass-text-xs glass-opacity-90",children:"50% Off"})]})}),priority:18,category:"promotion"},{id:"search",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Ys,{size:20,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-xs",children:"Quick Search"})]})}),priority:8,category:"utility"}],fe={title:"Surfaces/App Shells + Layout/Glass Golden Ratio Grid",component:Q,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[u=>s.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:s.jsx(u,{})})],tags:["autodocs"],argTypes:{containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},goldenRatio:{control:{type:"range",min:1.4,max:2,step:.01}},subdivisionLevels:{control:{type:"range",min:2,max:6,step:1}},spacing:{control:{type:"range",min:2,max:20,step:2}},animateLayout:{control:"boolean"},showGrid:{control:"boolean"},showRatioLines:{control:"boolean"},responsive:{control:"boolean"},soundEnabled:{control:"boolean"}}},R={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:4,spacing:8,animateLayout:!0,showGrid:!1,showRatioLines:!0,responsive:!0,soundEnabled:!0}},G={args:{items:v,containerWidth:900,containerHeight:700,goldenRatio:1.618,subdivisionLevels:4,spacing:12,showRatioLines:!0}},H={args:{items:J,containerWidth:1e3,containerHeight:800,goldenRatio:1.618,subdivisionLevels:4,spacing:10,showGrid:!0,showRatioLines:!1}},W={args:{items:Z,containerWidth:900,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,spacing:15,showRatioLines:!0}},I={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,showRatioLines:!0}},C={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.5,subdivisionLevels:4,showRatioLines:!0}},k={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.414,subdivisionLevels:4,showRatioLines:!0}},M={args:{items:v,containerWidth:800,containerHeight:600,subdivisionLevels:2,spacing:16,showGrid:!0}},z={args:{items:J,containerWidth:900,containerHeight:700,subdivisionLevels:5,spacing:6,showGrid:!0}},q={args:{items:d,containerWidth:800,containerHeight:600,spacing:20,showGrid:!0}},V={args:{items:v,containerWidth:800,containerHeight:600,spacing:4,showGrid:!1}},D={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!0}},E={args:{items:v,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!1}},O={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!0}},_={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!1}},$={args:{items:d,containerWidth:800,containerHeight:600,animateLayout:!1}},T={args:{items:Z,responsive:!0,subdivisionLevels:3,showRatioLines:!0}},P={args:{items:J,containerWidth:1200,containerHeight:900,subdivisionLevels:5,spacing:12,showGrid:!0}},A={args:{items:d,containerWidth:500,containerHeight:400,subdivisionLevels:3,spacing:8}},F={args:{items:v,containerWidth:600,containerHeight:600,subdivisionLevels:4,showRatioLines:!0}},B={args:{items:Z,containerWidth:1e3,containerHeight:500,subdivisionLevels:3,showRatioLines:!0}},U={args:{items:J,containerWidth:500,containerHeight:800,subdivisionLevels:4,showRatioLines:!0}},X={args:{items:d,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:20,opacity:.85,saturation:1.2,brightness:1.1,contrast:1.05}}},Y={args:{items:d,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},K={args:{items:Z,containerWidth:900,containerHeight:700,showRatioLines:!0,showGrid:!0,onItemClick:rs(),onItemHover:rs(),onLayoutChange:rs()}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
    responsive: true,
    soundEnabled: true
  }
}`,...R.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 900,
    containerHeight: 700,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 12,
    showRatioLines: true
  }
}`,...G.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 3,
    spacing: 15,
    showRatioLines: true
  }
}`,...W.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618,
    // Classic golden ratio
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.5,
    // Modified ratio
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.414,
    // Silver ratio (√2)
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...k.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    subdivisionLevels: 2,
    spacing: 16,
    showGrid: true
  }
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 900,
    containerHeight: 700,
    subdivisionLevels: 5,
    spacing: 6,
    showGrid: true
  }
}`,...z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 20,
    showGrid: true
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 4,
    showGrid: false
  }
}`,...V.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: true
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: false
  }
}`,...E.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: true
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: false
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    animateLayout: false
  }
}`,...$.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    responsive: true,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...T.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 1200,
    containerHeight: 900,
    subdivisionLevels: 5,
    spacing: 12,
    showGrid: true
  }
}`,...P.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 500,
    containerHeight: 400,
    subdivisionLevels: 3,
    spacing: 8
  }
}`,...A.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 600,
    containerHeight: 600,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 1000,
    containerHeight: 500,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...B.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 500,
    containerHeight: 800,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...U.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};const xe=["Default","MediaGallery","Dashboard","ContentLayout","ClassicGoldenRatio","ModifiedRatio","SilverRatio","ShallowSubdivision","DeepSubdivision","WideSpacing","TightSpacing","WithGridLines","NoGridLines","SpiralOnly","GridOnly","NoAnimation","Responsive","LargeContainer","SmallContainer","SquareContainer","WideContainer","TallContainer","CustomGlass","MinimalGlass","InteractiveDemo"];export{I as ClassicGoldenRatio,W as ContentLayout,X as CustomGlass,H as Dashboard,z as DeepSubdivision,R as Default,_ as GridOnly,K as InteractiveDemo,P as LargeContainer,G as MediaGallery,Y as MinimalGlass,C as ModifiedRatio,$ as NoAnimation,E as NoGridLines,T as Responsive,M as ShallowSubdivision,k as SilverRatio,A as SmallContainer,O as SpiralOnly,F as SquareContainer,U as TallContainer,V as TightSpacing,B as WideContainer,q as WideSpacing,D as WithGridLines,xe as __namedExportsOrder,fe as default};
