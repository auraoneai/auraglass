import{r as n,j as e,e as Ee,m as Be}from"./iframe-C4NFeGrN.js";import{f as je}from"./index-CLSxArU-.js";import{u as We}from"./useMotionPreference-Dszu9Lq8.js";import{u as Ue}from"./a11y-Drh7-6qm.js";import{u as Ye}from"./soundDesign-BwnboANF.js";import{O as Xe}from"./OptimizedGlassCore-pFwkcNDS.js";import{M as Je}from"./mail-0tItNHgB.js";import{B as Ke}from"./bell-231D9Oz0.js";import{U as Qe}from"./user-fluA5J0y.js";import{S as ea}from"./search-vHnW5baR.js";import{H as aa}from"./heart-BwNPIMzD.js";import{S as ke}from"./settings-Da3XZcex.js";import{H as sa}from"./house-yNptc6k8.js";import{C as ne}from"./code-D5ZmmUcQ.js";import{F as u}from"./folder-Dq1e7XLb.js";import{F as oe}from"./file-DG2hgr3q.js";import{c as X}from"./createLucideIcon-Dya9Njuo.js";import{S as ta}from"./share-AojrlGom.js";import{D as S}from"./database-B5hm_qAv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-CcJXKEC9.js";const ra=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],Se=X("cpu",ra);const na=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],oa=X("globe",na);const ia=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],x=X("hard-drive",ia);const la=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],ca=X("server",la),Y=n.forwardRef(({nodes:m=[],maxDepth:l=5,fractalType:y="tree",scaleFactor:v=.618,branchAngle:ie=30,initialScale:le=1,recursive:ce=!0,animateGrowth:Q=!0,zoomLevel:De=1,centerNode:de=!0,interactiveZoom:ee=!0,onNodeClick:me,onNodeHover:pe,glassConfig:ze={},soundEnabled:b=!0,className:Fe="",style:Me={},...Ae},Ce)=>{const[qe,_e]=n.useState(null),[Le,He]=n.useState(null),[g,Ve]=n.useState(De),[h,ue]=n.useState(0),Ie=n.useRef(null),w=n.useRef(),{prefersReducedMotion:ae}=We(),$e=Ue(),{play:N}=Ye();n.useEffect(()=>{if(Q&&!ae){const a=Date.now(),t=2e3,s=()=>{const i=Date.now()-a,p=Math.min(i/t,1);ue(p),p<1&&(w.current=requestAnimationFrame(s))};w.current=requestAnimationFrame(s)}else ue(1);return()=>{w.current&&cancelAnimationFrame(w.current)}},[Q,ae]);const se=n.useCallback((a,t=0,s={x:0,y:0},i=-90,p=le)=>t>=l||t>=h*l?[]:a.map((f,d)=>{const r=p*Math.pow(v,t);let c={x:0,y:0},j=0;switch(y){case"tree":const Pe=(d-(a.length-1)/2)*ie,te=i+Pe,ye=100*r;c={x:s.x+Math.cos(te*Math.PI/180)*ye,y:s.y+Math.sin(te*Math.PI/180)*ye},j=te+90;break;case"spiral":const re=i+d*137.5,ve=t*50*r;c={x:s.x+Math.cos(re*Math.PI/180)*ve,y:s.y+Math.sin(re*Math.PI/180)*ve},j=re;break;case"sierpinski":const be=d*120+i,we=80*r;c={x:s.x+Math.cos(be*Math.PI/180)*we,y:s.y+Math.sin(be*Math.PI/180)*we};break;case"mandelbrot":const Ne={x:d*.1,y:t*.1};c={x:s.x+Ne.x*100*r,y:s.y+Ne.y*100*r};break;default:c={x:s.x+(d-a.length/2)*80*r,y:s.y+t*60*r}}return{...f,depth:t,scale:r,rotation:j,position:c,children:f.children&&ce?se(f.children,t+1,c,j||i,r):[]}}),[l,y,v,ie,le,ce,h]),ge=n.useMemo(()=>se(m,0,de?{x:0,y:0}:{x:-200,y:-200}),[m,se,de]),he=a=>a.reduce((t,s)=>(t.push(s),s.children&&t.push(...he(s.children)),t),[]),fe=n.useMemo(()=>he(ge),[ge]),Ze=n.useCallback(a=>{He(a.id),me?.(a),b&&N("click")},[me,b,N]),xe=n.useCallback(a=>{_e(a?.id||null),pe?.(a),b&&a&&N("hover")},[pe,b,N]),Oe=n.useCallback(a=>{if(!ee)return;a.preventDefault();const t=a.deltaY>0?.9:1.1;Ve(s=>Math.max(.1,Math.min(5,s*t)))},[ee]),Re=()=>({hidden:{scale:0,opacity:0},visible:a=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:ae?0:a*.1}}),hover:{scale:1.1,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.2,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(Xe,{ref:Ce,className:`glass-fractal-layout relative overflow-hidden ${Fe}`,style:{width:"100%",height:"600px",...Me},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,...ze},onWheel:Oe,role:"application","aria-label":"Fractal layout visualization",id:$e,...Ae,children:[e.jsx("div",{ref:Ie,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:e.jsx(Ee,{children:fe.map((a,t)=>{const s=qe===a.id,i=Le===a.id,p=(a.scale||1)*g,f=(a.position?.x||0)*g,d=(a.position?.y||0)*g;return e.jsxs(Be.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${f}px, ${d}px) scale(${p}) rotate(${a.rotation||0}deg)`},custom:a.depth||0,variants:Re(),initial:"hidden",animate:i?"selected":s?"hover":"visible",exit:"hidden",onMouseEnter:()=>xe(a),onMouseLeave:()=>xe(null),onClick:()=>Ze(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200 p-2 min-w-[40px] min-h-[40px]
                      flex items-center justify-center
                      ${s||i?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2)},children:a.content}),a.children?.map((r,c)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((r.position?.x||0)-(a.position?.x||0),2)+Math.pow((r.position?.y||0)-(a.position?.y||0),2))*g,transformOrigin:"0 0",transform:`rotate(${Math.atan2((r.position?.y||0)-(a.position?.y||0),(r.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${r.id}`)),(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",y]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(h*l),"/",l]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",fe.length]}),ee&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(g*100).toFixed(0),"%"]})]}),Q&&h<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${h*100}%`}})})})]})});Y.displayName="GlassFractalLayout";try{Y.displayName="GlassFractalLayout",Y.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const o=[{id:"root",content:e.jsx(sa,{size:16}),children:[{id:"branch1",content:e.jsx(Qe,{size:14}),children:[{id:"leaf1",content:e.jsx(Je,{size:12})},{id:"leaf2",content:e.jsx(Ke,{size:12})}]},{id:"branch2",content:e.jsx(ke,{size:14}),children:[{id:"leaf3",content:e.jsx(ea,{size:12})},{id:"leaf4",content:e.jsx(aa,{size:12})}]}]}],J=[{id:"project",content:e.jsx(u,{size:16}),children:[{id:"src",content:e.jsx(u,{size:14}),children:[{id:"components",content:e.jsx(u,{size:12}),children:[{id:"button.tsx",content:e.jsx(ne,{size:10})},{id:"modal.tsx",content:e.jsx(ne,{size:10})},{id:"input.tsx",content:e.jsx(ne,{size:10})}]},{id:"utils",content:e.jsx(u,{size:12}),children:[{id:"helpers.ts",content:e.jsx(oe,{size:10})},{id:"constants.ts",content:e.jsx(oe,{size:10})}]}]},{id:"public",content:e.jsx(u,{size:14}),children:[{id:"index.html",content:e.jsx(oa,{size:12})},{id:"favicon.ico",content:e.jsx(ta,{size:12})}]},{id:"config",content:e.jsx(u,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(ke,{size:12})},{id:"package.json",content:e.jsx(oe,{size:12})}]}]}],Te=[{id:"datacenter",content:e.jsx(ca,{size:16}),children:[{id:"cluster1",content:e.jsx(Se,{size:14}),children:[{id:"node1",content:e.jsx(x,{size:12})},{id:"node2",content:e.jsx(x,{size:12})},{id:"node3",content:e.jsx(x,{size:12})}]},{id:"cluster2",content:e.jsx(Se,{size:14}),children:[{id:"node4",content:e.jsx(x,{size:12})},{id:"node5",content:e.jsx(x,{size:12})}]},{id:"database",content:e.jsx(S,{size:14}),children:[{id:"primary",content:e.jsx(S,{size:12})},{id:"replica1",content:e.jsx(S,{size:12})},{id:"replica2",content:e.jsx(S,{size:12})}]}]}],Ge=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],K=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(m,l)=>({id:`ring1-${l}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(y,v)=>({id:`ring2-${l}-${v}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],Ca={title:"Surfaces/App Shells + Layout/Glass Fractal Layout",component:Y,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[m=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(m,{})})],tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},k={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},T={args:{nodes:o,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},G={args:{nodes:K,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},D={args:{nodes:K,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},z={args:{nodes:K,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},F={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},M={args:{nodes:Te,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},A={args:{nodes:Ge,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},C={args:{nodes:o,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},q={args:{nodes:o,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},_={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},L={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},H={args:{nodes:o,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},V={args:{nodes:Ge,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},I={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!1}},$={args:{nodes:o,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},Z={args:{nodes:o,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},O={args:{nodes:o,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},R={args:{nodes:J,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},P={args:{nodes:Te,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},E={args:{nodes:K,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},B={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},W={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},U={args:{nodes:J,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:je(),onNodeHover:je()}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true
  }
}`,...F.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true
  }
}`,...L.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...H.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...V.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,...I.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true
  }
}`,...Z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true
  }
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};const qa=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{B as CustomGlass,H as DeepHierarchy,k as Default,F as FileSystemHierarchy,E as GoldenRatio,U as InteractiveDemo,_ as LargeScale,z as MandelbrotSet,W as MinimalGlass,q as NarrowAngleBranches,M as NetworkTopology,I as NoAnimation,O as NoInteractiveZoom,$ as NoRecursion,Z as OffCenter,A as OrganizationalChart,V as ShallowHierarchy,D as SierpinskiTriangle,L as SmallScale,G as SpiralPattern,T as TreePattern,C as WideAngleBranches,R as ZoomedIn,P as ZoomedOut,qa as __namedExportsOrder,Ca as default};
