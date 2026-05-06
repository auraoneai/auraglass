import{r,h as Ee,j as e,e as Be,m as We}from"./iframe-DpweptvF.js";import{f as ke}from"./index-CLSxArU-.js";import{u as Ue}from"./useMotionPreference-GPoScSOr.js";import{u as Ye}from"./soundDesign-Cq0Tbb-v.js";import{O as Je}from"./OptimizedGlassCore-UOg4NIOz.js";import{M as Ke,B as Qe}from"./mail-BMrbM9j7.js";import{U as Xe}from"./user-I21_Tnk9.js";import{S as ea}from"./search-DFUZZ0P5.js";import{H as aa}from"./heart-DBE7ogaf.js";import{S as Se}from"./settings-CGluIMgx.js";import{H as sa}from"./house-DRYHFuAz.js";import{C as ne}from"./code-Cd7S1vfL.js";import{F as u}from"./folder-z_-Wtc0t.js";import{F as oe}from"./file-CeZ95m2n.js";import{c as y}from"./createLucideIcon-eJ4-KqhR.js";import{S as ta}from"./share-Gns4rwb_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const ra=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],je=y("cpu",ra);const na=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],j=y("database",na);const oa=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],ia=y("globe",oa);const ca=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],h=y("hard-drive",ca);const la=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],da=y("server",la),Y=r.forwardRef(({nodes:f=[],maxDepth:l=5,fractalType:x="tree",scaleFactor:v=.618,branchAngle:ie=30,initialScale:ce=1,recursive:le=!0,animateGrowth:Q=!0,zoomLevel:De=1,centerNode:de=!0,interactiveZoom:X=!0,onNodeClick:me,onNodeHover:pe,glassConfig:Me={},soundEnabled:b=!0,className:ze="",style:Fe={},...Ae},Ce)=>{const[qe,_e]=r.useState(null),[Ve,Le]=r.useState(null),[ee,$e]=r.useState(De),[g,ue]=r.useState(0),He=r.useRef(null),w=r.useRef(),{prefersReducedMotion:ae}=Ue(),Ie=Ee(),{play:N}=Ye();r.useEffect(()=>{if(Q&&!ae){const a=Date.now(),t=2e3,s=()=>{const o=Date.now()-a,m=Math.min(o/t,1);ue(m),m<1&&(w.current=requestAnimationFrame(s))};w.current=requestAnimationFrame(s)}else ue(1);return()=>{w.current&&cancelAnimationFrame(w.current)}},[Q,ae]);const se=r.useCallback((a,t=0,s={x:0,y:0},o=-90,m=ce)=>t>=l||t>=g*l?[]:a.map((i,p)=>{const c=m*Math.pow(v,t);let d={x:0,y:0},k=0;switch(x){case"tree":const Pe=(p-(a.length-1)/2)*ie,te=o+Pe,xe=100*c;d={x:s.x+Math.cos(te*Math.PI/180)*xe,y:s.y+Math.sin(te*Math.PI/180)*xe},k=te+90;break;case"spiral":const re=o+p*137.5,ve=t*50*c;d={x:s.x+Math.cos(re*Math.PI/180)*ve,y:s.y+Math.sin(re*Math.PI/180)*ve},k=re;break;case"sierpinski":const be=p*120+o,we=80*c;d={x:s.x+Math.cos(be*Math.PI/180)*we,y:s.y+Math.sin(be*Math.PI/180)*we};break;case"mandelbrot":const Ne={x:p*.1,y:t*.1};d={x:s.x+Ne.x*100*c,y:s.y+Ne.y*100*c};break;default:d={x:s.x+(p-a.length/2)*80*c,y:s.y+t*60*c}}return{...i,depth:t,scale:c,rotation:k,position:d,children:i.children&&le?se(i.children,t+1,d,k||o,c):[]}}),[l,x,v,ie,ce,le,g]),ge=r.useMemo(()=>se(f,0,de?{x:0,y:0}:{x:-200,y:-200}),[f,se,de]),he=a=>a.reduce((t,s)=>(t.push(s),s.children&&t.push(...he(s.children)),t),[]),ye=r.useMemo(()=>he(ge),[ge]),Oe=r.useCallback(a=>{Le(a.id),me?.(a),b&&N("click")},[me,b,N]),fe=r.useCallback(a=>{_e(a?.id||null),pe?.(a),b&&a&&N("hover")},[pe,b,N]),Ze=r.useCallback(a=>{if(!X)return;a.preventDefault();const t=a.deltaY>0?.9:1.1;$e(s=>Math.max(.1,Math.min(5,s*t)))},[X]),Re=()=>({hidden:{scale:0,opacity:0},visible:a=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:ae?0:a*.1}}),hover:{scale:1.1,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.2,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(Je,{ref:Ce,className:`glass-fractal-layout relative overflow-hidden ${ze}`,style:{width:"100%",height:"600px",...Fe},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,...Me},onWheel:Ze,role:"application","aria-label":"Fractal layout visualization",id:Ie,...Ae,children:[e.jsx("div",{ref:He,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",style:{transform:`scale(${ee})`,transformOrigin:"center"},children:e.jsx(Be,{children:ye.map((a,t)=>{const s=qe===a.id,o=Ve===a.id,m=(a.scale||1)*ee;return e.jsxs(We.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${a.position?.x||0}px, ${a.position?.y||0}px) scale(${m}) rotate(${a.rotation||0}deg)`},custom:a.depth||0,variants:Re(),initial:"hidden",animate:o?"selected":s?"hover":"visible",exit:"hidden",onMouseEnter:()=>fe(a),onMouseLeave:()=>fe(null),onClick:()=>Oe(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200 p-2 min-w-[40px] min-h-[40px]
                      flex items-center justify-center
                      ${s||o?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2)},children:a.content}),a.children?.map((i,p)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((i.position?.x||0)-(a.position?.x||0),2)+Math.pow((i.position?.y||0)-(a.position?.y||0),2)),transformOrigin:"0 0",transform:`rotate(${Math.atan2((i.position?.y||0)-(a.position?.y||0),(i.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${i.id}`)),(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",x]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(g*l),"/",l]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",ye.length]}),X&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(ee*100).toFixed(0),"%"]})]}),Q&&g<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${g*100}%`}})})})]})});Y.displayName="GlassFractalLayout";try{Y.displayName="GlassFractalLayout",Y.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const n=[{id:"root",content:e.jsx(sa,{size:16}),children:[{id:"branch1",content:e.jsx(Xe,{size:14}),children:[{id:"leaf1",content:e.jsx(Ke,{size:12})},{id:"leaf2",content:e.jsx(Qe,{size:12})}]},{id:"branch2",content:e.jsx(Se,{size:14}),children:[{id:"leaf3",content:e.jsx(ea,{size:12})},{id:"leaf4",content:e.jsx(aa,{size:12})}]}]}],J=[{id:"project",content:e.jsx(u,{size:16}),children:[{id:"src",content:e.jsx(u,{size:14}),children:[{id:"components",content:e.jsx(u,{size:12}),children:[{id:"button.tsx",content:e.jsx(ne,{size:10})},{id:"modal.tsx",content:e.jsx(ne,{size:10})},{id:"input.tsx",content:e.jsx(ne,{size:10})}]},{id:"utils",content:e.jsx(u,{size:12}),children:[{id:"helpers.ts",content:e.jsx(oe,{size:10})},{id:"constants.ts",content:e.jsx(oe,{size:10})}]}]},{id:"public",content:e.jsx(u,{size:14}),children:[{id:"index.html",content:e.jsx(ia,{size:12})},{id:"favicon.ico",content:e.jsx(ta,{size:12})}]},{id:"config",content:e.jsx(u,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(Se,{size:12})},{id:"package.json",content:e.jsx(oe,{size:12})}]}]}],Te=[{id:"datacenter",content:e.jsx(da,{size:16}),children:[{id:"cluster1",content:e.jsx(je,{size:14}),children:[{id:"node1",content:e.jsx(h,{size:12})},{id:"node2",content:e.jsx(h,{size:12})},{id:"node3",content:e.jsx(h,{size:12})}]},{id:"cluster2",content:e.jsx(je,{size:14}),children:[{id:"node4",content:e.jsx(h,{size:12})},{id:"node5",content:e.jsx(h,{size:12})}]},{id:"database",content:e.jsx(j,{size:14}),children:[{id:"primary",content:e.jsx(j,{size:12})},{id:"replica1",content:e.jsx(j,{size:12})},{id:"replica2",content:e.jsx(j,{size:12})}]}]}],Ge=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],K=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(f,l)=>({id:`ring1-${l}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(x,v)=>({id:`ring2-${l}-${v}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],za={title:"Glass UI/Layouts/GlassFractalLayout",component:Y,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},S={args:{nodes:n,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},T={args:{nodes:n,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},G={args:{nodes:K,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},D={args:{nodes:K,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},M={args:{nodes:K,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},z={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},F={args:{nodes:Te,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},A={args:{nodes:Ge,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},C={args:{nodes:n,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},q={args:{nodes:n,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},_={args:{nodes:n,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},V={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},L={args:{nodes:n,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},$={args:{nodes:Ge,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},H={args:{nodes:n,maxDepth:3,fractalType:"tree",animateGrowth:!1}},I={args:{nodes:n,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},O={args:{nodes:n,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},Z={args:{nodes:n,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},R={args:{nodes:J,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},P={args:{nodes:Te,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},E={args:{nodes:K,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},B={args:{nodes:n,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},W={args:{nodes:n,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},U={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:ke(),onNodeHover:ke()}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...T.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...G.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true
  }
}`,...D.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true
  }
}`,...F.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.85,
    branchAngle: 35,
    initialScale: 0.9,
    animateGrowth: true
  }
}`,...A.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    branchAngle: 60,
    scaleFactor: 0.7,
    animateGrowth: true
  }
}`,...C.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    branchAngle: 15,
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...q.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.9,
    initialScale: 1.5,
    animateGrowth: true
  }
}`,..._.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true
  }
}`,...V.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...L.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,...H.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true
  }
}`,...O.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true
  }
}`,...Z.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    zoomLevel: 1.5,
    animateGrowth: true
  }
}`,...R.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    zoomLevel: 0.7,
    animateGrowth: true
  }
}`,...P.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618,
    // Golden ratio
    animateGrowth: true
  }
}`,...E.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};const Fa=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{B as CustomGlass,L as DeepHierarchy,S as Default,z as FileSystemHierarchy,E as GoldenRatio,U as InteractiveDemo,_ as LargeScale,M as MandelbrotSet,W as MinimalGlass,q as NarrowAngleBranches,F as NetworkTopology,H as NoAnimation,Z as NoInteractiveZoom,I as NoRecursion,O as OffCenter,A as OrganizationalChart,$ as ShallowHierarchy,D as SierpinskiTriangle,V as SmallScale,G as SpiralPattern,T as TreePattern,C as WideAngleBranches,R as ZoomedIn,P as ZoomedOut,Fa as __namedExportsOrder,za as default};
