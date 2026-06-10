import{r as n,j as e,e as ia,m as la}from"./iframe-DL0Cy6Qm.js";import{f as Le}from"./index-CLSxArU-.js";import{au as ca,an as da,a4 as ma,m as ua,H as pa,S as Ze,b2 as ga,aX as ce,aE as h,aS as de,bh as ha,bi as fa,bj as b,bk as Ie,ao as G,bl as xa}from"./components-DpExAbu2.js";import{u as ya}from"./useMotionPreference-BSvJ4qIX.js";import{u as ba}from"./a11y-BmS7yTss.js";import{u as va}from"./soundDesign-CAVdX_kR.js";import{O as wa}from"./OptimizedGlassCore-DCil-Mtt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-bTwC3axp.js";const K=n.forwardRef(({nodes:u=[],maxDepth:d=5,fractalType:v="tree",scaleFactor:w=.618,branchAngle:me=30,initialScale:ue=1,recursive:pe=!0,animateGrowth:ae=!0,zoomLevel:ge=1,centerNode:he=!0,interactiveZoom:se=!0,showControls:Re,onNodeClick:fe,onNodeHover:xe,glassConfig:_e={},soundEnabled:S=!0,compact:j=!1,contained:ye=!1,maxHeight:Ee,height:Pe,className:Be="",style:We={},...Xe},Ye)=>{const i=j||ye,te=i?Math.min(d,2):d,be=i?Math.min(ue,.58):ue,ve=i?Math.min(w,.5):w,re=i?Math.min(ge,.72):ge,we=i?56:100,Se=i?30:50,je=i?48:80,Ne=i?42:60,Te=i?50:80,[Ue,Je]=n.useState(null),[Ke,Qe]=n.useState(null),[f,De]=n.useState(re),[x,Ge]=n.useState(0),ea=n.useRef(null),N=n.useRef(),{prefersReducedMotion:ne}=ya(),aa=ba(),{play:T}=va(),p=Ee??Pe??(j||ye?240:600),sa=Re??!j;n.useEffect(()=>{De(re)},[re]),n.useEffect(()=>{if(ae&&!ne){const a=Date.now(),t=2e3,s=()=>{const l=Date.now()-a,g=Math.min(l/t,1);Ge(g),g<1&&(N.current=requestAnimationFrame(s))};N.current=requestAnimationFrame(s)}else Ge(1);return()=>{N.current&&cancelAnimationFrame(N.current)}},[ae,ne]);const oe=n.useCallback((a,t=0,s={x:0,y:0},l=-90,g=be)=>t>=te||t>=x*te?[]:a.map((y,m)=>{const r=g*Math.pow(ve,t);let c={x:0,y:0},D=0;switch(v){case"tree":const oa=(m-(a.length-1)/2)*me,ie=l+oa,Ae=we*r;c={x:s.x+Math.cos(ie*Math.PI/180)*Ae,y:s.y+Math.sin(ie*Math.PI/180)*Ae},D=ie+90;break;case"spiral":const le=l+m*137.5,Ce=t*Se*r;c={x:s.x+Math.cos(le*Math.PI/180)*Ce,y:s.y+Math.sin(le*Math.PI/180)*Ce},D=le;break;case"sierpinski":const qe=m*120+l,Ve=je*r;c={x:s.x+Math.cos(qe*Math.PI/180)*Ve,y:s.y+Math.sin(qe*Math.PI/180)*Ve};break;case"mandelbrot":const He={x:m*.1,y:t*.1};c={x:s.x+He.x*100*r,y:s.y+He.y*100*r};break;default:c={x:s.x+(m-a.length/2)*Te*r,y:s.y+t*Ne*r}}return{...y,depth:t,scale:r,rotation:D,position:c,children:y.children&&pe?oe(y.children,t+1,c,D||l,r):[]}}),[te,v,ve,me,be,pe,x,we,Se,je,Te,Ne]),Fe=n.useMemo(()=>oe(u,0,he?{x:0,y:0}:{x:-200,y:-200}),[u,oe,he]),ke=a=>a.reduce((t,s)=>(t.push(s),s.children&&t.push(...ke(s.children)),t),[]),ze=n.useMemo(()=>ke(Fe),[Fe]),ta=n.useCallback(a=>{Qe(a.id),fe?.(a),S&&T("click")},[fe,S,T]),Me=n.useCallback(a=>{Je(a?.id||null),xe?.(a),S&&a&&T("hover")},[xe,S,T]),ra=n.useCallback(a=>{if(!se)return;a.preventDefault();const t=a.deltaY>0?.9:1.1;De(s=>Math.max(.1,Math.min(5,s*t)))},[se]),na=()=>({hidden:{opacity:0},visible:a=>({opacity:1,transition:{type:"spring",tension:300,friction:25,delay:ne?0:a*.1}}),hover:{opacity:1,transition:{type:"spring",tension:400,friction:20}},selected:{opacity:1,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(wa,{ref:Ye,className:`glass-fractal-layout relative overflow-hidden ${Be}`,style:{width:"100%",height:typeof p=="number"?`${p}px`:p,maxHeight:typeof p=="number"?`${p}px`:p,...We},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,..._e},onWheel:ra,role:"application","aria-label":"Fractal layout visualization",id:aa,...Xe,children:[e.jsx("div",{ref:ea,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:e.jsx(ia,{children:ze.map((a,t)=>{const s=Ue===a.id,l=Ke===a.id,g=(a.scale||1)*f,y=(a.position?.x||0)*f,m=(a.position?.y||0)*f;return e.jsxs(la.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${y}px, ${m}px) scale(${g}) rotate(${a.rotation||0}deg)`},custom:a.depth||0,variants:na(),initial:"hidden",animate:l?"selected":s?"hover":"visible",exit:"hidden",onMouseEnter:()=>Me(a),onMouseLeave:()=>Me(null),onClick:()=>ta(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200
                      ${i?"p-1 min-w-[28px] min-h-[28px] text-[10px]":"p-2 min-w-[40px] min-h-[40px]"}
                      flex items-center justify-center
                      ${s||l?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2)},children:a.content}),a.children?.map((r,c)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((r.position?.x||0)-(a.position?.x||0),2)+Math.pow((r.position?.y||0)-(a.position?.y||0),2))*f,transformOrigin:"0 0",transform:`rotate(${Math.atan2((r.position?.y||0)-(a.position?.y||0),(r.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${r.id}`)),!i&&(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),sa&&e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",v]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(x*d),"/",d]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",ze.length]}),se&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(f*100).toFixed(0),"%"]})]}),!j&&ae&&x<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${x*100}%`}})})})]})});K.displayName="GlassFractalLayout";try{K.displayName="GlassFractalLayout",K.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const o=[{id:"root",content:e.jsx(ga,{size:16}),children:[{id:"branch1",content:e.jsx(ma,{size:14}),children:[{id:"leaf1",content:e.jsx(ca,{size:12})},{id:"leaf2",content:e.jsx(da,{size:12})}]},{id:"branch2",content:e.jsx(Ze,{size:14}),children:[{id:"leaf3",content:e.jsx(ua,{size:12})},{id:"leaf4",content:e.jsx(pa,{size:12})}]}]}],Q=[{id:"project",content:e.jsx(h,{size:16}),children:[{id:"src",content:e.jsx(h,{size:14}),children:[{id:"components",content:e.jsx(h,{size:12}),children:[{id:"button.tsx",content:e.jsx(ce,{size:10})},{id:"modal.tsx",content:e.jsx(ce,{size:10})},{id:"input.tsx",content:e.jsx(ce,{size:10})}]},{id:"utils",content:e.jsx(h,{size:12}),children:[{id:"helpers.ts",content:e.jsx(de,{size:10})},{id:"constants.ts",content:e.jsx(de,{size:10})}]}]},{id:"public",content:e.jsx(h,{size:14}),children:[{id:"index.html",content:e.jsx(ha,{size:12})},{id:"favicon.ico",content:e.jsx(fa,{size:12})}]},{id:"config",content:e.jsx(h,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(Ze,{size:12})},{id:"package.json",content:e.jsx(de,{size:12})}]}]}],$e=[{id:"datacenter",content:e.jsx(xa,{size:16}),children:[{id:"cluster1",content:e.jsx(Ie,{size:14}),children:[{id:"node1",content:e.jsx(b,{size:12})},{id:"node2",content:e.jsx(b,{size:12})},{id:"node3",content:e.jsx(b,{size:12})}]},{id:"cluster2",content:e.jsx(Ie,{size:14}),children:[{id:"node4",content:e.jsx(b,{size:12})},{id:"node5",content:e.jsx(b,{size:12})}]},{id:"database",content:e.jsx(G,{size:14}),children:[{id:"primary",content:e.jsx(G,{size:12})},{id:"replica1",content:e.jsx(G,{size:12})},{id:"replica2",content:e.jsx(G,{size:12})}]}]}],Oe=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],ee=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(u,d)=>({id:`ring1-${d}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(v,w)=>({id:`ring2-${d}-${w}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],Ca={title:"Surfaces/App Shells + Layout/Glass Fractal Layout",component:K,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[u=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(u,{})})],tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},F={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},k={args:{nodes:o,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},z={args:{nodes:ee,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},M={args:{nodes:ee,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},A={args:{nodes:ee,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},C={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},q={args:{nodes:$e,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},V={args:{nodes:Oe,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},H={args:{nodes:o,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},L={args:{nodes:o,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},I={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},Z={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},$={args:{nodes:o,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},O={args:{nodes:Oe,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},R={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!1}},_={args:{nodes:o,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},E={args:{nodes:o,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},P={args:{nodes:o,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},B={args:{nodes:Q,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},W={args:{nodes:$e,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},X={args:{nodes:ee,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},Y={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},U={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},J={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:Le(),onNodeHover:Le()}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true
  }
}`,...A.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true
  }
}`,...C.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.85,
    branchAngle: 35,
    initialScale: 0.9,
    animateGrowth: true
  }
}`,...V.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    branchAngle: 60,
    scaleFactor: 0.7,
    animateGrowth: true
  }
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    branchAngle: 15,
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...L.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.9,
    initialScale: 1.5,
    animateGrowth: true
  }
}`,...I.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true
  }
}`,...Z.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,..._.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true
  }
}`,...E.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true
  }
}`,...P.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    zoomLevel: 1.5,
    animateGrowth: true
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    zoomLevel: 0.7,
    animateGrowth: true
  }
}`,...W.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618,
    // Golden ratio
    animateGrowth: true
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};const qa=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{Y as CustomGlass,$ as DeepHierarchy,F as Default,C as FileSystemHierarchy,X as GoldenRatio,J as InteractiveDemo,I as LargeScale,A as MandelbrotSet,U as MinimalGlass,L as NarrowAngleBranches,q as NetworkTopology,R as NoAnimation,P as NoInteractiveZoom,_ as NoRecursion,E as OffCenter,V as OrganizationalChart,O as ShallowHierarchy,M as SierpinskiTriangle,Z as SmallScale,z as SpiralPattern,k as TreePattern,H as WideAngleBranches,B as ZoomedIn,W as ZoomedOut,qa as __namedExportsOrder,Ca as default};
