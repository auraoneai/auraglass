import{r as n,j as e,e as Je,m as Ke}from"./iframe-CrdWMSIk.js";import{f as Te}from"./index-CLSxArU-.js";import{u as Qe}from"./useMotionPreference-DiZSpnSa.js";import{u as ea}from"./a11y-C6c8VL3n.js";import{u as aa}from"./soundDesign-Ct9H_xED.js";import{O as sa}from"./OptimizedGlassCore-BMxL0Y3X.js";import{M as ta}from"./mail-BoQQvutH.js";import{B as ra}from"./bell-Bsu8ACNS.js";import{U as na}from"./user-CTeKgZSB.js";import{S as oa}from"./search-DiWeS2eF.js";import{H as ia}from"./heart-DfKYQ36I.js";import{S as Ge}from"./settings-BspF6k-N.js";import{H as la}from"./house-A8bHOBbF.js";import{C as le}from"./code-DhYE0cTw.js";import{F as g}from"./folder-Pj97TOiF.js";import{F as ce}from"./file-BfT1Igak.js";import{c as K}from"./createLucideIcon-r_pQPiZy.js";import{S as ca}from"./share-CkasbRF6.js";import{D as T}from"./database-CVvfeMl7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-ClxBxKMX.js";const da=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],De=K("cpu",da);const ma=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],ua=K("globe",ma);const pa=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],y=K("hard-drive",pa);const ga=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],ha=K("server",ga),J=n.forwardRef(({nodes:m=[],maxDepth:c=5,fractalType:b="tree",scaleFactor:v=.618,branchAngle:de=30,initialScale:me=1,recursive:ue=!0,animateGrowth:ae=!0,zoomLevel:Fe=1,centerNode:pe=!0,interactiveZoom:se=!0,onNodeClick:ge,onNodeHover:he,glassConfig:Ae={},soundEnabled:w=!0,compact:N=!1,contained:Ce=!1,maxHeight:qe,height:He,className:Ve="",style:_e={},...Le},$e)=>{const[Ie,Ze]=n.useState(null),[Oe,Re]=n.useState(null),[h,Pe]=n.useState(Fe),[f,fe]=n.useState(0),Ee=n.useRef(null),j=n.useRef(),{prefersReducedMotion:te}=Qe(),Be=ea(),{play:S}=aa(),u=qe??He??(N||Ce?240:600),re=N?Math.min(c,3):c;n.useEffect(()=>{if(ae&&!te){const a=Date.now(),t=2e3,s=()=>{const i=Date.now()-a,p=Math.min(i/t,1);fe(p),p<1&&(j.current=requestAnimationFrame(s))};j.current=requestAnimationFrame(s)}else fe(1);return()=>{j.current&&cancelAnimationFrame(j.current)}},[ae,te]);const ne=n.useCallback((a,t=0,s={x:0,y:0},i=-90,p=me)=>t>=re||t>=f*re?[]:a.map((x,d)=>{const r=p*Math.pow(v,t);let l={x:0,y:0},k=0;switch(b){case"tree":const Xe=(d-(a.length-1)/2)*de,oe=i+Xe,we=100*r;l={x:s.x+Math.cos(oe*Math.PI/180)*we,y:s.y+Math.sin(oe*Math.PI/180)*we},k=oe+90;break;case"spiral":const ie=i+d*137.5,Ne=t*50*r;l={x:s.x+Math.cos(ie*Math.PI/180)*Ne,y:s.y+Math.sin(ie*Math.PI/180)*Ne},k=ie;break;case"sierpinski":const je=d*120+i,Se=80*r;l={x:s.x+Math.cos(je*Math.PI/180)*Se,y:s.y+Math.sin(je*Math.PI/180)*Se};break;case"mandelbrot":const ke={x:d*.1,y:t*.1};l={x:s.x+ke.x*100*r,y:s.y+ke.y*100*r};break;default:l={x:s.x+(d-a.length/2)*80*r,y:s.y+t*60*r}}return{...x,depth:t,scale:r,rotation:k,position:l,children:x.children&&ue?ne(x.children,t+1,l,k||i,r):[]}}),[re,b,v,de,me,ue,f]),xe=n.useMemo(()=>ne(m,0,pe?{x:0,y:0}:{x:-200,y:-200}),[m,ne,pe]),ye=a=>a.reduce((t,s)=>(t.push(s),s.children&&t.push(...ye(s.children)),t),[]),be=n.useMemo(()=>ye(xe),[xe]),We=n.useCallback(a=>{Re(a.id),ge?.(a),w&&S("click")},[ge,w,S]),ve=n.useCallback(a=>{Ze(a?.id||null),he?.(a),w&&a&&S("hover")},[he,w,S]),Ue=n.useCallback(a=>{if(!se)return;a.preventDefault();const t=a.deltaY>0?.9:1.1;Pe(s=>Math.max(.1,Math.min(5,s*t)))},[se]),Ye=()=>({hidden:{scale:0,opacity:0},visible:a=>({scale:1,opacity:1,transition:{type:"spring",tension:300,friction:25,delay:te?0:a*.1}}),hover:{scale:1.1,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.2,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(sa,{ref:$e,className:`glass-fractal-layout relative overflow-hidden ${Ve}`,style:{width:"100%",height:typeof u=="number"?`${u}px`:u,maxHeight:typeof u=="number"?`${u}px`:u,..._e},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,...Ae},onWheel:Ue,role:"application","aria-label":"Fractal layout visualization",id:Be,...Le,children:[e.jsx("div",{ref:Ee,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:e.jsx(Je,{children:be.map((a,t)=>{const s=Ie===a.id,i=Oe===a.id,p=(a.scale||1)*h,x=(a.position?.x||0)*h,d=(a.position?.y||0)*h;return e.jsxs(Ke.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${x}px, ${d}px) scale(${p}) rotate(${a.rotation||0}deg)`},custom:a.depth||0,variants:Ye(),initial:"hidden",animate:i?"selected":s?"hover":"visible",exit:"hidden",onMouseEnter:()=>ve(a),onMouseLeave:()=>ve(null),onClick:()=>We(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200 p-2 min-w-[40px] min-h-[40px]
                      flex items-center justify-center
                      ${s||i?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2)},children:a.content}),a.children?.map((r,l)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((r.position?.x||0)-(a.position?.x||0),2)+Math.pow((r.position?.y||0)-(a.position?.y||0),2))*h,transformOrigin:"0 0",transform:`rotate(${Math.atan2((r.position?.y||0)-(a.position?.y||0),(r.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${r.id}`)),(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),!N&&e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",b]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(f*c),"/",c]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",be.length]}),se&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(h*100).toFixed(0),"%"]})]}),!N&&ae&&f<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${f*100}%`}})})})]})});J.displayName="GlassFractalLayout";try{J.displayName="GlassFractalLayout",J.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const o=[{id:"root",content:e.jsx(la,{size:16}),children:[{id:"branch1",content:e.jsx(na,{size:14}),children:[{id:"leaf1",content:e.jsx(ta,{size:12})},{id:"leaf2",content:e.jsx(ra,{size:12})}]},{id:"branch2",content:e.jsx(Ge,{size:14}),children:[{id:"leaf3",content:e.jsx(oa,{size:12})},{id:"leaf4",content:e.jsx(ia,{size:12})}]}]}],Q=[{id:"project",content:e.jsx(g,{size:16}),children:[{id:"src",content:e.jsx(g,{size:14}),children:[{id:"components",content:e.jsx(g,{size:12}),children:[{id:"button.tsx",content:e.jsx(le,{size:10})},{id:"modal.tsx",content:e.jsx(le,{size:10})},{id:"input.tsx",content:e.jsx(le,{size:10})}]},{id:"utils",content:e.jsx(g,{size:12}),children:[{id:"helpers.ts",content:e.jsx(ce,{size:10})},{id:"constants.ts",content:e.jsx(ce,{size:10})}]}]},{id:"public",content:e.jsx(g,{size:14}),children:[{id:"index.html",content:e.jsx(ua,{size:12})},{id:"favicon.ico",content:e.jsx(ca,{size:12})}]},{id:"config",content:e.jsx(g,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(Ge,{size:12})},{id:"package.json",content:e.jsx(ce,{size:12})}]}]}],Me=[{id:"datacenter",content:e.jsx(ha,{size:16}),children:[{id:"cluster1",content:e.jsx(De,{size:14}),children:[{id:"node1",content:e.jsx(y,{size:12})},{id:"node2",content:e.jsx(y,{size:12})},{id:"node3",content:e.jsx(y,{size:12})}]},{id:"cluster2",content:e.jsx(De,{size:14}),children:[{id:"node4",content:e.jsx(y,{size:12})},{id:"node5",content:e.jsx(y,{size:12})}]},{id:"database",content:e.jsx(T,{size:14}),children:[{id:"primary",content:e.jsx(T,{size:12})},{id:"replica1",content:e.jsx(T,{size:12})},{id:"replica2",content:e.jsx(T,{size:12})}]}]}],ze=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],ee=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(m,c)=>({id:`ring1-${c}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(b,v)=>({id:`ring2-${c}-${v}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],$a={title:"Surfaces/App Shells + Layout/Glass Fractal Layout",component:J,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[m=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(m,{})})],tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},D={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},G={args:{nodes:o,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},M={args:{nodes:ee,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},z={args:{nodes:ee,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},F={args:{nodes:ee,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},A={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},C={args:{nodes:Me,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},q={args:{nodes:ze,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},H={args:{nodes:o,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},V={args:{nodes:o,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},_={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},L={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},$={args:{nodes:o,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},I={args:{nodes:ze,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},Z={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!1}},O={args:{nodes:o,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},R={args:{nodes:o,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},P={args:{nodes:o,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},E={args:{nodes:Q,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},B={args:{nodes:Me,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},W={args:{nodes:ee,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},U={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},Y={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},X={args:{nodes:Q,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:Te(),onNodeHover:Te()}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...G.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'mandelbrot',
    scaleFactor: 0.6,
    animateGrowth: true
  }
}`,...F.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.75,
    branchAngle: 25,
    initialScale: 0.8,
    animateGrowth: true
  }
}`,...A.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 40,
    initialScale: 1.2,
    animateGrowth: true
  }
}`,...C.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.85,
    branchAngle: 35,
    initialScale: 0.9,
    animateGrowth: true
  }
}`,...q.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    branchAngle: 60,
    scaleFactor: 0.7,
    animateGrowth: true
  }
}`,...H.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    branchAngle: 15,
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...V.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...I.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,...Z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    centerNode: false,
    animateGrowth: true
  }
}`,...R.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    interactiveZoom: false,
    animateGrowth: true
  }
}`,...P.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    zoomLevel: 1.5,
    animateGrowth: true
  }
}`,...E.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: networkTopology,
    maxDepth: 3,
    fractalType: 'tree',
    zoomLevel: 0.7,
    animateGrowth: true
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618,
    // Golden ratio
    animateGrowth: true
  }
}`,...W.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};const Ia=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{U as CustomGlass,$ as DeepHierarchy,D as Default,A as FileSystemHierarchy,W as GoldenRatio,X as InteractiveDemo,_ as LargeScale,F as MandelbrotSet,Y as MinimalGlass,V as NarrowAngleBranches,C as NetworkTopology,Z as NoAnimation,P as NoInteractiveZoom,O as NoRecursion,R as OffCenter,q as OrganizationalChart,I as ShallowHierarchy,z as SierpinskiTriangle,L as SmallScale,M as SpiralPattern,G as TreePattern,H as WideAngleBranches,E as ZoomedIn,B as ZoomedOut,Ia as __namedExportsOrder,$a as default};
