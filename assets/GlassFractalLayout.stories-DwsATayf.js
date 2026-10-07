import{r,j as e,d as la,m as ca}from"./iframe-Cqi-9gHA.js";import{f as Ie}from"./index-DdjpOZjl.js";import{az as da,as as ma,a7 as ua,m as pa,H as ga,S as Oe,b2 as ha,aY as de,aI as h,aU as me,bh as fa,bi as xa,bj as y,bk as Ze,at as F,bl as ya}from"./components-D_brxh8E.js";import{u as ba}from"./useMotionPreference-fk1VFuMQ.js";import{u as va}from"./a11y-DBBBNlGj.js";import{u as wa}from"./soundDesign-BN0GUCjA.js";import{O as Sa}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-DlsmEFaF.js";const Q=r.forwardRef(({nodes:p=[],maxDepth:m=5,fractalType:b="tree",scaleFactor:v=.618,branchAngle:ue=30,initialScale:pe=1,recursive:ge=!0,animateGrowth:se=!0,zoomLevel:he=1,centerNode:fe=!0,interactiveZoom:te=!0,showControls:_e,onNodeClick:xe,onNodeHover:ye,glassConfig:Ee={},soundEnabled:w=!0,compact:S=!1,contained:be=!1,maxHeight:Pe,height:Be,className:We="",style:Ye={},...Ue},Xe)=>{const n=S||be,re=n?Math.min(m,2):m,ve=n?Math.min(pe,.58):pe,we=n?Math.min(v,.5):v,ne=n?Math.min(he,.72):he,oe=n?56:100,Se=n?30:50,je=n?48:80,Ne=n?42:60,Te=n?50:80,[Je,Ke]=r.useState(null),[Qe,ea]=r.useState(null),[j,De]=r.useState(ne),[f,Ge]=r.useState(0),aa=r.useRef(null),N=r.useRef(),{prefersReducedMotion:ie}=ba(),sa=va(),{play:T}=wa(),g=Pe??Be??(S||be?240:600),ta=_e??!S;r.useEffect(()=>{De(ne)},[ne]),r.useEffect(()=>{if(se&&!ie){const a=Date.now(),t=2e3,s=()=>{const c=Date.now()-a,u=Math.min(c/t,1);Ge(u),u<1&&(N.current=requestAnimationFrame(s))};N.current=requestAnimationFrame(s)}else Ge(1);return()=>{N.current&&cancelAnimationFrame(N.current)}},[se,ie]);const le=r.useCallback((a,t=0,s={x:0,y:0},c=-90,u=ve)=>t>=re||t>=f*re?[]:a.map((x,o)=>{const l=t===0?u:u*we;let d={x:0,y:0},D=0,Ae=c;switch(b){case"tree":if(t===0){d={x:s.x+(o-(a.length-1)/2)*oe,y:s.y},D=0;break}const ia=(o-(a.length-1)/2)*ue,G=c+ia,Ce=oe*Math.max(l,.48);d={x:s.x+Math.cos(G*Math.PI/180)*Ce,y:s.y+Math.sin(G*Math.PI/180)*Ce},D=G+90,Ae=G;break;case"spiral":const ce=c+o*137.5,qe=t*Se*l;d={x:s.x+Math.cos(ce*Math.PI/180)*qe,y:s.y+Math.sin(ce*Math.PI/180)*qe},D=ce;break;case"sierpinski":const Ve=o*120+c,He=je*l;d={x:s.x+Math.cos(Ve*Math.PI/180)*He,y:s.y+Math.sin(Ve*Math.PI/180)*He};break;case"mandelbrot":const Le={x:o*.1,y:t*.1};d={x:s.x+Le.x*100*l,y:s.y+Le.y*100*l};break;default:d={x:s.x+(o-a.length/2)*Te*l,y:s.y+t*Ne*l}}return{...x,depth:t,scale:l,rotation:D,position:d,children:x.children&&ge?le(x.children,t+1,d,Ae,l):[]}}),[re,b,we,ue,ve,ge,f,oe,Se,je,Te,Ne]),Fe=r.useMemo(()=>le(p,0,fe?{x:0,y:0}:{x:-200,y:-200}),[p,le,fe]),ke=a=>a.reduce((t,s)=>(t.push(s),s.children&&t.push(...ke(s.children)),t),[]),ze=r.useMemo(()=>ke(Fe),[Fe]),ra=r.useCallback(a=>{ea(a.id),xe?.(a),w&&T("click")},[xe,w,T]),Me=r.useCallback(a=>{Ke(a?.id||null),ye?.(a),w&&a&&T("hover")},[ye,w,T]),na=r.useCallback(a=>{if(!te)return;a.preventDefault();const t=a.deltaY>0?.9:1.1;De(s=>Math.max(.1,Math.min(5,s*t)))},[te]),oa=()=>({hidden:{opacity:0},visible:a=>({opacity:1,transition:{type:"spring",tension:300,friction:25,delay:ie?0:a*.1}}),hover:{opacity:1,transition:{type:"spring",tension:400,friction:20}},selected:{opacity:1,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(Sa,{ref:Xe,className:`glass-fractal-layout relative overflow-hidden ${We}`,style:{width:"100%",height:typeof g=="number"?`${g}px`:g,maxHeight:typeof g=="number"?`${g}px`:g,...Ye},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,...Ee},onWheel:na,role:"application","aria-label":"Fractal layout visualization",id:sa,...Ue,children:[e.jsx("div",{ref:aa,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:e.jsx(la,{children:ze.map((a,t)=>{const s=Je===a.id,c=Qe===a.id,u=(a.position?.x||0)*j,x=(a.position?.y||0)*j;return e.jsxs(ca.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${u}px, ${x}px)`},custom:a.depth||0,variants:oa(),initial:"hidden",animate:c?"selected":s?"hover":"visible",exit:"hidden",onMouseEnter:()=>Me(a),onMouseLeave:()=>Me(null),onClick:()=>ra(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200
                      ${n?"p-1 min-w-[28px] min-h-[28px] text-[10px]":"p-2 min-w-[40px] min-h-[40px]"}
                      flex items-center justify-center
                      ${s||c?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2),minWidth:n?36:44,minHeight:n?36:44},children:a.content}),a.children?.map((o,l)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((o.position?.x||0)-(a.position?.x||0),2)+Math.pow((o.position?.y||0)-(a.position?.y||0),2))*j,transformOrigin:"0 0",transform:`rotate(${Math.atan2((o.position?.y||0)-(a.position?.y||0),(o.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${o.id}`)),!n&&(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass-right-1 glass-surface-overlay glass-text-primary glass-text-xs glass-radius-full glass-w-5 glass-h-5 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),ta&&e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",b]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(f*m),"/",m]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",ze.length]}),te&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(j*100).toFixed(0),"%"]})]}),!S&&se&&f<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${f*100}%`}})})})]})});Q.displayName="GlassFractalLayout";try{Q.displayName="GlassFractalLayout",Q.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const i=[{id:"root",content:e.jsx(ha,{size:16}),children:[{id:"branch1",content:e.jsx(ua,{size:14}),children:[{id:"leaf1",content:e.jsx(da,{size:12})},{id:"leaf2",content:e.jsx(ma,{size:12})}]},{id:"branch2",content:e.jsx(Oe,{size:14}),children:[{id:"leaf3",content:e.jsx(pa,{size:12})},{id:"leaf4",content:e.jsx(ga,{size:12})}]}]}],ee=[{id:"project",content:e.jsx(h,{size:16}),children:[{id:"src",content:e.jsx(h,{size:14}),children:[{id:"components",content:e.jsx(h,{size:12}),children:[{id:"button.tsx",content:e.jsx(de,{size:10})},{id:"modal.tsx",content:e.jsx(de,{size:10})},{id:"input.tsx",content:e.jsx(de,{size:10})}]},{id:"utils",content:e.jsx(h,{size:12}),children:[{id:"helpers.ts",content:e.jsx(me,{size:10})},{id:"constants.ts",content:e.jsx(me,{size:10})}]}]},{id:"public",content:e.jsx(h,{size:14}),children:[{id:"index.html",content:e.jsx(fa,{size:12})},{id:"favicon.ico",content:e.jsx(xa,{size:12})}]},{id:"config",content:e.jsx(h,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(Oe,{size:12})},{id:"package.json",content:e.jsx(me,{size:12})}]}]}],$e=[{id:"datacenter",content:e.jsx(ya,{size:16}),children:[{id:"cluster1",content:e.jsx(Ze,{size:14}),children:[{id:"node1",content:e.jsx(y,{size:12})},{id:"node2",content:e.jsx(y,{size:12})},{id:"node3",content:e.jsx(y,{size:12})}]},{id:"cluster2",content:e.jsx(Ze,{size:14}),children:[{id:"node4",content:e.jsx(y,{size:12})},{id:"node5",content:e.jsx(y,{size:12})}]},{id:"database",content:e.jsx(F,{size:14}),children:[{id:"primary",content:e.jsx(F,{size:12})},{id:"replica1",content:e.jsx(F,{size:12})},{id:"replica2",content:e.jsx(F,{size:12})}]}]}],Re=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],ae=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(p,m)=>({id:`ring1-${m}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(b,v)=>({id:`ring2-${m}-${v}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],qa={title:"Surfaces/App Shells + Layout/Glass Fractal Layout",component:Q,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[p=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(p,{})})],tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},k={args:{nodes:i,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},z={args:{nodes:i,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},M={args:{nodes:ae,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},A={args:{nodes:ae,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},C={args:{nodes:ae,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},q={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},V={args:{nodes:$e,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},H={args:{nodes:Re,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},L={args:{nodes:i,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},I={args:{nodes:i,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},Z={args:{nodes:i,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},O={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},$={args:{nodes:i,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},R={args:{nodes:Re,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},_={args:{nodes:i,maxDepth:3,fractalType:"tree",animateGrowth:!1}},E={args:{nodes:i,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},P={args:{nodes:i,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},B={args:{nodes:i,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},W={args:{nodes:ee,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},Y={args:{nodes:$e,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},U={args:{nodes:ae,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},X={args:{nodes:i,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},J={args:{nodes:i,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},K={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:Ie(),onNodeHover:Ie()}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.618,
    branchAngle: 30,
    initialScale: 1,
    recursive: true,
    animateGrowth: true,
    zoomLevel: 1,
    centerNode: true,
    interactiveZoom: true,
    soundEnabled: true
  }
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true
  }
}`,...A.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true
  }
}`,...C.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true
  }
}`,...V.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.85,
    branchAngle: 35,
    initialScale: 0.9,
    animateGrowth: true
  }
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    branchAngle: 60,
    scaleFactor: 0.7,
    animateGrowth: true
  }
}`,...L.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    branchAngle: 15,
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...I.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.9,
    initialScale: 1.5,
    animateGrowth: true
  }
}`,...Z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true
  }
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,..._.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,...E.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true
  }
}`,...P.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    zoomLevel: 1.5,
    animateGrowth: true
  }
}`,...W.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    zoomLevel: 0.7,
    animateGrowth: true
  }
}`,...Y.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618,
    // Golden ratio
    animateGrowth: true
  }
}`,...U.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: true,
    glassConfig: {
      blur: 25,
      opacity: 0.7,
      saturation: 1.3,
      brightness: 1.2,
      contrast: 1.1
    }
  }
}`,...X.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: true,
    glassConfig: {
      blur: 5,
      opacity: 0.95,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 30,
    animateGrowth: true,
    interactiveZoom: true,
    onNodeClick: fn(),
    onNodeHover: fn()
  }
}`,...K.parameters?.docs?.source}}};const Va=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{X as CustomGlass,$ as DeepHierarchy,k as Default,q as FileSystemHierarchy,U as GoldenRatio,K as InteractiveDemo,Z as LargeScale,C as MandelbrotSet,J as MinimalGlass,I as NarrowAngleBranches,V as NetworkTopology,_ as NoAnimation,B as NoInteractiveZoom,E as NoRecursion,P as OffCenter,H as OrganizationalChart,R as ShallowHierarchy,A as SierpinskiTriangle,O as SmallScale,M as SpiralPattern,z as TreePattern,L as WideAngleBranches,W as ZoomedIn,Y as ZoomedOut,Va as __namedExportsOrder,qa as default};
