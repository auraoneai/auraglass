import{r as o,j as s,e as Vs,m as Ds}from"./iframe-CsQVqAwV.js";import{f as as}from"./index-CLSxArU-.js";import{b2 as Es,a4 as Os,S as _s,au as Ts,aN as $s,aG as Ps,l as As,o as Fs,m as Bs,e as Us,an as Xs,k as Ys,aJ as hs,aI as ps,b1 as Js,bm as Qs}from"./components-DbL1lRmA.js";import{u as Ks}from"./useMotionPreference-GQvBKJJr.js";import{u as Zs}from"./a11y-Hmy9mHoX.js";import{u as se}from"./soundDesign-c1LFY9rf.js";import{O as ee}from"./OptimizedGlassCore-9QmO_Ix3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-Buw_PRut.js";const X=o.forwardRef(({items:m=[],containerWidth:y=800,containerHeight:is=600,goldenRatio:u=1.618,subdivisionLevels:ts=4,spacing:x=8,animateLayout:ae=!0,showGrid:fs=!1,showRatioLines:ys=!0,showEmptyLabels:xs=!1,responsive:h=!0,onItemClick:rs,onItemHover:ns,onLayoutChange:ls,glassConfig:vs={},soundEnabled:v=!0,compact:r=!1,contained:bs=!1,maxHeight:ws,className:js="",style:Ls={},...Ns},Ss)=>{const[Rs,Gs]=o.useState(null),[Hs,Ws]=o.useState(null),[n,Is]=o.useState({width:y,height:is}),Q=o.useRef(null),{prefersReducedMotion:Cs}=Ks(),ks=Zs(),{play:b}=se(),p=r?360:y,g=r?220:is,w=r?Math.min(ts,3):ts,os=r?!1:fs,ds=r?!1:ys,K=ws??(r||bs?g:void 0);o.useEffect(()=>{if(!h||!Q.current)return;const e=new ResizeObserver(t=>{for(let a of t){const{width:c,height:i}=a.contentRect;Is({width:c,height:i})}});return e.observe(Q.current),()=>e.disconnect()},[h]);const cs=o.useCallback(()=>{const e=[],t=[{x:0,y:0,width:r?p:n.width,height:r?g:n.height,level:0}];for(;t.length>0&&e.length<Math.pow(2,w);){const a=t.shift();if(a.level>=w){e.push({...a,ratio:a.width/a.height});continue}if(a.width>a.height){const i=a.width/u,l=a.width-i;t.push({x:a.x,y:a.y,width:i,height:a.height,level:a.level+1}),t.push({x:a.x+i,y:a.y,width:l,height:a.height,level:a.level+1})}else{const i=a.height/u,l=a.height-i;t.push({x:a.x,y:a.y,width:a.width,height:i,level:a.level+1}),t.push({x:a.x,y:a.y+i,width:a.width,height:l,level:a.level+1})}}return e},[r,n,g,w,p,u]),gs=o.useCallback(e=>{const t=[...m].sort((i,l)=>(l.priority||0)-(i.priority||0));return[...e].sort((i,l)=>l.width*l.height-i.width*i.height).map((i,l)=>{const j=t[l];return{...i,item:j||void 0}})},[m]),Z=o.useMemo(()=>{const e=cs(),t=gs(e);return ls?.(t),t},[cs,gs,ls]),ms=o.useCallback(()=>{const e=[],t=n.width/2,a=n.height/2,c=Math.min(n.width,n.height)/3;for(let i=0;i<200;i++){const l=i*.2,j=c/20*Math.pow(u,l/(Math.PI*2)),ss=t+j*Math.cos(l),es=a+j*Math.sin(l);ss>=0&&ss<=n.width&&es>=0&&es<=n.height&&e.push({x:ss,y:es})}return e},[n,u]),Ms=o.useMemo(()=>ms(),[ms]),zs=o.useCallback(e=>{Ws(e.id),rs?.(e),v&&b("click")},[rs,v,b]),us=o.useCallback(e=>{Gs(e?.id||null),ns?.(e),v&&e&&b("hover")},[ns,v,b]),qs=()=>({hidden:{scale:0,opacity:0},visible:e=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:Cs?0:e*.05}}),hover:{scale:1.02,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.05,transition:{type:"spring",tension:400,friction:20}}});return s.jsxs(ee,{ref:Ss,className:`glass-golden-ratio-grid relative overflow-auto ${js}`,style:{width:h?"100%":p,minWidth:h||r?void 0:p,height:r?g:h?"100%":g,minHeight:g,maxHeight:typeof K=="number"?`${K}px`:K,overflowX:"auto",overflowY:"auto",...Ls},glassConfig:{blur:12,opacity:.95,saturation:1.05,brightness:1.02,...vs},role:"grid","aria-label":"Golden ratio layout grid",id:ks,...Ns,children:[s.jsxs("div",{ref:Q,className:"glass-absolute glass-inset-0",style:{width:r?p:n.width,height:r?g:n.height},children:[ds&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:n.width,height:n.height,children:s.jsx("path",{d:`M ${Ms.map(e=>`${e.x},${e.y}`).join(" L ")}`,stroke:"rgba(255, 215, 0, 0.3)",strokeWidth:"2",fill:"none",strokeDasharray:"5,5"})}),os&&s.jsx("svg",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:n.width,height:n.height,children:Z.map((e,t)=>s.jsx("rect",{x:e.x,y:e.y,width:e.width,height:e.height,stroke:"rgba(var(--glass-color-white) / var(--glass-opacity-20))",strokeWidth:"1",fill:"none",strokeDasharray:"3,3"},`grid-${t}`))}),s.jsx(Vs,{children:Z.map((e,t)=>{const a=!!e.item,c=a&&Rs===e.item.id,i=a&&Hs===e.item.id;return s.jsxs(Ds.div,{className:`
                    absolute overflow-visible
                    ${a?"cursor-pointer":"cursor-default"}
                  `,style:{left:e.x+x/2,top:e.y+x/2,width:e.width-x,height:e.height-x,boxSizing:"border-box"},custom:t,variants:qs(),initial:"hidden",animate:i?"selected":c?"hover":"visible",exit:"hidden",onMouseEnter:()=>a&&us(e.item),onMouseLeave:()=>us(null),onClick:()=>a&&zs(e.item),role:"row",children:[a?s.jsx("div",{className:`
                                          w-full h-full box-border glass-surface rounded-lg border border-white/20
                                          glass-backdrop-blur-md transition-all duration-200 p-3
                                          flex min-w-0 min-h-0 items-center justify-center text-center
                                          ${c||i?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                                        `,style:{width:"100%",height:"100%",boxSizing:"border-box",overflow:"hidden"},role:"gridcell",children:e.item.content}):s.jsx("div",{className:"glass-w-full glass-h-full glass-border glass-border-dashed glass-border-white/10 glass-radius-lg glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-30",style:{width:"100%",height:"100%",boxSizing:"border-box",overflow:"hidden"},role:"gridcell",children:xs&&s.jsx("div",{className:"glass-text-xs",children:"Empty"})}),(os||c&&!r)&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-left-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-px-1 glass-py-0.5 glass-radius glass-backdrop-blur-sm glass-contrast-guard","data-glass-overlay":"true",children:e.ratio.toFixed(2)}),Math.abs(e.ratio-u)<.1&&s.jsx("div",{className:"glass-absolute glass-top-1 glass-right-1 glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-opacity-70","data-glass-overlay":"true"})]},`section-${t}`)})})]}),!r&&s.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Sections: ",Z.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Items: ",m.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Golden Ratio: ",u]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Levels: ",w]})]}),!r&&s.jsxs("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full"}),"Golden Ratio"]}),ds&&s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[s.jsx("div",{className:"glass-w-4 glass-h-0-5 glass-surface-yellow glass-opacity-50",style:{background:"repeating-linear-gradient(to right, var(--glass-color-warning-light) 0, var(--glass-color-warning-light) 3px, transparent 3px, transparent 6px)"}}),"Spiral"]})]})]})});X.displayName="GlassGoldenRatioGrid";try{X.displayName="GlassGoldenRatioGrid",X.__docgenInfo={description:"",displayName:"GlassGoldenRatioGrid",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"GoldenRatioItem[]"}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},goldenRatio:{defaultValue:{value:"1.618"},description:"",name:"goldenRatio",required:!1,type:{name:"number | undefined"}},subdivisionLevels:{defaultValue:{value:"4"},description:"",name:"subdivisionLevels",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"8"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animateLayout:{defaultValue:{value:"true"},description:"",name:"animateLayout",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showRatioLines:{defaultValue:{value:"true"},description:"",name:"showRatioLines",required:!1,type:{name:"boolean | undefined"}},showEmptyLabels:{defaultValue:{value:"false"},description:"",name:"showEmptyLabels",required:!1,type:{name:"boolean | undefined"}},responsive:{defaultValue:{value:"true"},description:"",name:"responsive",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: GoldenRatioItem) => void) | undefined"}},onItemHover:{defaultValue:null,description:"",name:"onItemHover",required:!1,type:{name:"((item: GoldenRatioItem | null) => void) | undefined"}},onLayoutChange:{defaultValue:null,description:"",name:"onLayoutChange",required:!1,type:{name:"((sections: GoldenRatioSection[]) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const d=[{id:"home",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Es,{size:24}),s.jsx("span",{className:"glass-text-sm",children:"Home"})]}),priority:10,category:"navigation"},{id:"profile",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Os,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Profile"})]}),priority:8,category:"user"},{id:"settings",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(_s,{size:20}),s.jsx("span",{className:"glass-text-xs",children:"Settings"})]}),priority:6,category:"system"},{id:"messages",content:s.jsxs("div",{className:"glass-flex glass-flex-col glass-items-center glass-gap-2",children:[s.jsx(Ts,{size:18}),s.jsx("span",{className:"glass-text-xs",children:"Messages"})]}),priority:7,category:"communication"}],f=[{id:"featured-image",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(hs,{size:32,className:"glass-mx-auto glass-mb-2"}),s.jsx("span",{className:"glass-text-sm glass-font-semibold",children:"Featured Photo"})]})}),priority:15,category:"media"},{id:"video-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(ps,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Video"})]})}),priority:10,category:"media"},{id:"music-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Js,{size:24}),s.jsx("span",{className:"glass-text-xs",children:"Music"})]})}),priority:8,category:"media"},{id:"gallery-1",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(Qs,{size:20})}),priority:6,category:"media"},{id:"gallery-2",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(hs,{size:20})}),priority:5,category:"media"},{id:"gallery-3",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:s.jsx(ps,{size:20})}),priority:4,category:"media"}],Y=[{id:"main-chart",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-bold glass-mb-2",children:"Analytics"}),s.jsx("div",{className:"glass-w-full glass-h-12 glass-surface-subtle/20 glass-radius glass-flex glass-items-end justify-around",children:[...Array(8)].map((m,y)=>s.jsx("div",{className:"glass-w-2 glass-surface-subtle/60 glass-radius-t",style:{height:`${20+Math.random()*60}%`}},y))})]}),priority:20,category:"analytics"},{id:"stats-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"1,234"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Total Users"})]}),priority:15,category:"stats"},{id:"stats-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-text-center",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold",children:"89%"}),s.jsx("div",{className:"glass-text-xs opacity-80",children:"Conversion"})]}),priority:12,category:"stats"},{id:"calendar",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Us,{size:24,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"Calendar"})]})}),priority:10,category:"productivity"},{id:"notifications",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Xs,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:"3 New"})]})}),priority:8,category:"communication"},{id:"clock",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Ys,{size:20,className:"glass-mx-auto glass-mb-1"}),s.jsx("div",{className:"glass-text-xs",children:new Date().toLocaleTimeString()})]})}),priority:6,category:"utility"}],J=[{id:"hero-content",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-4",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-mb-3",children:[s.jsx($s,{size:20,className:"glass-text-secondary"}),s.jsx("h2",{className:"glass-text-lg glass-font-bold",children:"Featured Article"})]}),s.jsx("p",{className:"glass-text-sm glass-opacity-90 glass-mb-3",children:"Discover the mathematical beauty of the golden ratio in modern design systems."}),s.jsx("button",{className:"glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-px-3 glass-py-1 glass-radius glass-text-sm transition-colors",children:"Read More"})]}),priority:25,category:"content"},{id:"article-1",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(Ps,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Design Principles"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Essential guidelines for creating harmonious layouts..."})]}),priority:12,category:"content"},{id:"article-2",content:s.jsxs("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3",children:[s.jsx(As,{size:20,className:"glass-mb-2"}),s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-1",children:"Best Practices"}),s.jsx("p",{className:"glass-text-xs opacity-80",children:"Learn from award-winning designs..."})]}),priority:10,category:"content"},{id:"promotion",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Fs,{size:24,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-sm glass-font-semibold",children:"Special Offer"}),s.jsx("div",{className:"glass-text-xs glass-opacity-90",children:"50% Off"})]})}),priority:18,category:"promotion"},{id:"search",content:s.jsx("div",{className:"glass-w-full glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-p-3 glass-flex glass-items-center glass-justify-center",children:s.jsxs("div",{className:"glass-text-center",children:[s.jsx(Bs,{size:20,className:"glass-mx-auto glass-mb-2"}),s.jsx("div",{className:"glass-text-xs",children:"Quick Search"})]})}),priority:8,category:"utility"}],ue={title:"Surfaces/App Shells + Layout/Glass Golden Ratio Grid",component:X,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[m=>s.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:s.jsx(m,{})})],tags:["autodocs"],argTypes:{containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},goldenRatio:{control:{type:"range",min:1.4,max:2,step:.01}},subdivisionLevels:{control:{type:"range",min:2,max:6,step:1}},spacing:{control:{type:"range",min:2,max:20,step:2}},animateLayout:{control:"boolean"},showGrid:{control:"boolean"},showRatioLines:{control:"boolean"},responsive:{control:"boolean"},soundEnabled:{control:"boolean"}}},L={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:4,spacing:8,animateLayout:!0,showGrid:!1,showRatioLines:!0,responsive:!1,soundEnabled:!0}},N={args:{items:f,containerWidth:900,containerHeight:700,goldenRatio:1.618,subdivisionLevels:4,spacing:12,showRatioLines:!0}},S={args:{items:Y,containerWidth:1e3,containerHeight:800,goldenRatio:1.618,subdivisionLevels:4,spacing:10,showGrid:!0,showRatioLines:!1}},R={args:{items:J,containerWidth:900,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,spacing:15,showRatioLines:!0}},G={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.618,subdivisionLevels:3,showRatioLines:!0}},H={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.5,subdivisionLevels:4,showRatioLines:!0}},W={args:{items:d,containerWidth:800,containerHeight:600,goldenRatio:1.414,subdivisionLevels:4,showRatioLines:!0}},I={args:{items:f,containerWidth:800,containerHeight:600,subdivisionLevels:2,spacing:16,showGrid:!0}},C={args:{items:Y,containerWidth:900,containerHeight:700,subdivisionLevels:5,spacing:6,showGrid:!0}},k={args:{items:d,containerWidth:800,containerHeight:600,spacing:20,showGrid:!0}},M={args:{items:f,containerWidth:800,containerHeight:600,spacing:4,showGrid:!1}},z={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!0}},q={args:{items:f,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!1}},V={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!1,showRatioLines:!0}},D={args:{items:d,containerWidth:800,containerHeight:600,showGrid:!0,showRatioLines:!1}},E={args:{items:d,containerWidth:800,containerHeight:600,animateLayout:!1}},O={args:{items:J,responsive:!0,subdivisionLevels:3,showRatioLines:!0}},_={args:{items:Y,containerWidth:1200,containerHeight:900,subdivisionLevels:5,spacing:12,showGrid:!0}},T={args:{items:d,containerWidth:500,containerHeight:400,subdivisionLevels:3,spacing:8}},$={args:{items:f,containerWidth:600,containerHeight:600,subdivisionLevels:4,showRatioLines:!0}},P={args:{items:J,containerWidth:1e3,containerHeight:500,subdivisionLevels:3,showRatioLines:!0}},A={args:{items:Y,containerWidth:500,containerHeight:800,subdivisionLevels:4,showRatioLines:!0}},F={args:{items:d,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:20,opacity:.85,saturation:1.2,brightness:1.1,contrast:1.05}}},B={args:{items:d,containerWidth:800,containerHeight:600,showRatioLines:!0,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},U={args:{items:J,containerWidth:900,containerHeight:700,showRatioLines:!0,showGrid:!0,onItemClick:as(),onItemHover:as(),onLayoutChange:as()}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 900,
    containerHeight: 700,
    goldenRatio: 1.618,
    subdivisionLevels: 4,
    spacing: 12,
    showRatioLines: true
  }
}`,...N.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 900,
    containerHeight: 600,
    goldenRatio: 1.618,
    subdivisionLevels: 3,
    spacing: 15,
    showRatioLines: true
  }
}`,...R.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.618,
    // Classic golden ratio
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...G.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.5,
    // Modified ratio
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...H.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    goldenRatio: 1.414,
    // Silver ratio (√2)
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...W.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    subdivisionLevels: 2,
    spacing: 16,
    showGrid: true
  }
}`,...I.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 900,
    containerHeight: 700,
    subdivisionLevels: 5,
    spacing: 6,
    showGrid: true
  }
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 20,
    showGrid: true
  }
}`,...k.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    spacing: 4,
    showGrid: false
  }
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: true
  }
}`,...z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: false
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: false,
    showRatioLines: true
  }
}`,...V.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true,
    showRatioLines: false
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 800,
    containerHeight: 600,
    animateLayout: false
  }
}`,...E.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    responsive: true,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...O.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 1200,
    containerHeight: 900,
    subdivisionLevels: 5,
    spacing: 12,
    showGrid: true
  }
}`,..._.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: basicItems,
    containerWidth: 500,
    containerHeight: 400,
    subdivisionLevels: 3,
    spacing: 8
  }
}`,...T.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    items: mediaItems,
    containerWidth: 600,
    containerHeight: 600,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...$.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    items: contentCards,
    containerWidth: 1000,
    containerHeight: 500,
    subdivisionLevels: 3,
    showRatioLines: true
  }
}`,...P.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: dashboardItems,
    containerWidth: 500,
    containerHeight: 800,
    subdivisionLevels: 4,
    showRatioLines: true
  }
}`,...A.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};const he=["Default","MediaGallery","Dashboard","ContentLayout","ClassicGoldenRatio","ModifiedRatio","SilverRatio","ShallowSubdivision","DeepSubdivision","WideSpacing","TightSpacing","WithGridLines","NoGridLines","SpiralOnly","GridOnly","NoAnimation","Responsive","LargeContainer","SmallContainer","SquareContainer","WideContainer","TallContainer","CustomGlass","MinimalGlass","InteractiveDemo"];export{G as ClassicGoldenRatio,R as ContentLayout,F as CustomGlass,S as Dashboard,C as DeepSubdivision,L as Default,D as GridOnly,U as InteractiveDemo,_ as LargeContainer,N as MediaGallery,B as MinimalGlass,H as ModifiedRatio,E as NoAnimation,q as NoGridLines,O as Responsive,I as ShallowSubdivision,W as SilverRatio,T as SmallContainer,V as SpiralOnly,$ as SquareContainer,A as TallContainer,M as TightSpacing,P as WideContainer,k as WideSpacing,z as WithGridLines,he as __namedExportsOrder,ue as default};
