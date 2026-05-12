import{r as n,j as e,e as la,m as ca}from"./iframe-LAGStZOr.js";import{f as _e}from"./index-CLSxArU-.js";import{u as da}from"./useMotionPreference-BoFeTlVA.js";import{u as ma}from"./a11y-C_KrV_f1.js";import{u as ua}from"./soundDesign-B613TIvB.js";import{O as pa}from"./OptimizedGlassCore-Jd0dTpF2.js";import{M as ha}from"./mail-DDCkm-IW.js";import{B as ga}from"./bell-1qNZmzOy.js";import{U as fa}from"./user-BOduk_zP.js";import{S as ya}from"./search-B0Fh4C_P.js";import{H as xa}from"./heart-Bjra6tbI.js";import{S as Ie}from"./settings-CpOSFWnM.js";import{H as ba}from"./house-CjVmvqs3.js";import{C as de}from"./code-BqD-fihR.js";import{F as g}from"./folder-DQpOEnHJ.js";import{F as me}from"./file-DzfZm5Pb.js";import{c as Q}from"./createLucideIcon-BTlQ4bxp.js";import{S as va}from"./share-Cfl1cqmQ.js";import{D}from"./database-5TAioNtk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-B9hm0WxX.js";const wa=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],$e=Q("cpu",wa);const Sa=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],Na=Q("globe",Sa);const ja=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],b=Q("hard-drive",ja);const ka=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],Ta=Q("server",ka),K=n.forwardRef(({nodes:u=[],maxDepth:d=5,fractalType:v="tree",scaleFactor:w=.618,branchAngle:ue=30,initialScale:pe=1,recursive:he=!0,animateGrowth:te=!0,zoomLevel:ge=1,centerNode:fe=!0,interactiveZoom:se=!0,showControls:Re,onNodeClick:ye,onNodeHover:xe,glassConfig:Ee={},soundEnabled:S=!0,compact:N=!1,contained:be=!1,maxHeight:Pe,height:Be,className:We="",style:Ue={},...Ye},Xe)=>{const i=N||be,re=i?Math.min(d,2):d,ve=i?Math.min(pe,.58):pe,we=i?Math.min(w,.5):w,ne=i?Math.min(ge,.72):ge,Se=i?56:100,Ne=i?30:50,je=i?48:80,ke=i?42:60,Te=i?50:80,[Je,Ke]=n.useState(null),[Qe,ea]=n.useState(null),[f,De]=n.useState(ne),[y,Ge]=n.useState(0),aa=n.useRef(null),j=n.useRef(),{prefersReducedMotion:oe}=da(),ta=ma(),{play:k}=ua(),p=Pe??Be??(N||be?240:600),sa=Re??!N;n.useEffect(()=>{De(ne)},[ne]),n.useEffect(()=>{if(te&&!oe){const a=Date.now(),s=2e3,t=()=>{const l=Date.now()-a,h=Math.min(l/s,1);Ge(h),h<1&&(j.current=requestAnimationFrame(t))};j.current=requestAnimationFrame(t)}else Ge(1);return()=>{j.current&&cancelAnimationFrame(j.current)}},[te,oe]);const ie=n.useCallback((a,s=0,t={x:0,y:0},l=-90,h=ve)=>s>=re||s>=y*re?[]:a.map((x,m)=>{const r=h*Math.pow(we,s);let c={x:0,y:0},T=0;switch(v){case"tree":const ia=(m-(a.length-1)/2)*ue,le=l+ia,Ce=Se*r;c={x:t.x+Math.cos(le*Math.PI/180)*Ce,y:t.y+Math.sin(le*Math.PI/180)*Ce},T=le+90;break;case"spiral":const ce=l+m*137.5,qe=s*Ne*r;c={x:t.x+Math.cos(ce*Math.PI/180)*qe,y:t.y+Math.sin(ce*Math.PI/180)*qe},T=ce;break;case"sierpinski":const Ve=m*120+l,He=je*r;c={x:t.x+Math.cos(Ve*Math.PI/180)*He,y:t.y+Math.sin(Ve*Math.PI/180)*He};break;case"mandelbrot":const Le={x:m*.1,y:s*.1};c={x:t.x+Le.x*100*r,y:t.y+Le.y*100*r};break;default:c={x:t.x+(m-a.length/2)*Te*r,y:t.y+s*ke*r}}return{...x,depth:s,scale:r,rotation:T,position:c,children:x.children&&he?ie(x.children,s+1,c,T||l,r):[]}}),[re,v,we,ue,ve,he,y,Se,Ne,je,Te,ke]),Me=n.useMemo(()=>ie(u,0,fe?{x:0,y:0}:{x:-200,y:-200}),[u,ie,fe]),Fe=a=>a.reduce((s,t)=>(s.push(t),t.children&&s.push(...Fe(t.children)),s),[]),ze=n.useMemo(()=>Fe(Me),[Me]),ra=n.useCallback(a=>{ea(a.id),ye?.(a),S&&k("click")},[ye,S,k]),Ae=n.useCallback(a=>{Ke(a?.id||null),xe?.(a),S&&a&&k("hover")},[xe,S,k]),na=n.useCallback(a=>{if(!se)return;a.preventDefault();const s=a.deltaY>0?.9:1.1;De(t=>Math.max(.1,Math.min(5,t*s)))},[se]),oa=()=>({hidden:{opacity:0},visible:a=>({opacity:1,transition:{type:"spring",tension:300,friction:25,delay:oe?0:a*.1}}),hover:{opacity:1,transition:{type:"spring",tension:400,friction:20}},selected:{opacity:1,transition:{type:"spring",tension:400,friction:20}}});return e.jsxs(pa,{ref:Xe,className:`glass-fractal-layout relative overflow-hidden ${We}`,style:{width:"100%",height:typeof p=="number"?`${p}px`:p,maxHeight:typeof p=="number"?`${p}px`:p,...Ue},glassConfig:{blur:15,opacity:.9,saturation:1.1,brightness:1.05,...Ee},onWheel:na,role:"application","aria-label":"Fractal layout visualization",id:ta,...Ye,children:[e.jsx("div",{ref:aa,className:"glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center",children:e.jsx(la,{children:ze.map((a,s)=>{const t=Je===a.id,l=Qe===a.id,h=(a.scale||1)*f,x=(a.position?.x||0)*f,m=(a.position?.y||0)*f;return e.jsxs(ca.div,{className:"glass-absolute glass-cursor-pointer",style:{left:"50%",top:"50%",transform:`translate(-50%, -50%) translate(${x}px, ${m}px) scale(${h}) rotate(${a.rotation||0}deg)`},custom:a.depth||0,variants:oa(),initial:"hidden",animate:l?"selected":t?"hover":"visible",exit:"hidden",onMouseEnter:()=>Ae(a),onMouseLeave:()=>Ae(null),onClick:()=>ra(a),children:[e.jsx("div",{className:`
                      glass-surface rounded-lg border border-white/20 glass-backdrop-blur-md
                      transition-all duration-200
                      ${i?"p-1 min-w-[28px] min-h-[28px] text-[10px]":"p-2 min-w-[40px] min-h-[40px]"}
                      flex items-center justify-center
                      ${t||l?"bg-white/20 border-white/40":"bg-white/10 border-white/20"}
                    `,style:{opacity:Math.max(.3,1-(a.depth||0)*.2)},children:a.content}),a.children?.map((r,c)=>e.jsx("div",{className:"glass-absolute glass-border-l glass-border-white/30",style:{left:"50%",top:"50%",height:Math.sqrt(Math.pow((r.position?.x||0)-(a.position?.x||0),2)+Math.pow((r.position?.y||0)-(a.position?.y||0),2))*f,transformOrigin:"0 0",transform:`rotate(${Math.atan2((r.position?.y||0)-(a.position?.y||0),(r.position?.x||0)-(a.position?.x||0))}rad)`}},`line-${r.id}`)),!i&&(a.depth||0)>0&&e.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-surface-dark/50 glass-text-primary glass-text-xs glass-radius-full glass-w-4 glass-h-4 glass-flex glass-items-center glass-justify-center",children:a.depth})]},`${a.id}-${a.depth}`)})})}),sa&&e.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-2",children:[e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Type: ",v]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Depth: ",Math.floor(y*d),"/",d]}),e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Nodes: ",ze.length]}),se&&e.jsxs("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Zoom: ",(f*100).toFixed(0),"%"]})]}),!N&&te&&y<1&&e.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4",children:e.jsx("div",{className:"glass-w-32 glass-h-2 glass-surface-dark/20 glass-radius-full glass-backdrop-blur-sm glass-contrast-guard",children:e.jsx("div",{className:"glass-h-full glass-surface-subtle/50 glass-radius-full glass-transition-all glass-duration-100",style:{width:`${y*100}%`}})})})]})});K.displayName="GlassFractalLayout";try{K.displayName="GlassFractalLayout",K.__docgenInfo={description:"",displayName:"GlassFractalLayout",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"FractalNode[]"}},maxDepth:{defaultValue:{value:"5"},description:"",name:"maxDepth",required:!1,type:{name:"number | undefined"}},fractalType:{defaultValue:{value:"tree"},description:"",name:"fractalType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"tree"'},{value:'"custom"'},{value:'"sierpinski"'},{value:'"mandelbrot"'},{value:'"julia"'},{value:'"spiral"'}]}},scaleFactor:{defaultValue:{value:"0.618"},description:"",name:"scaleFactor",required:!1,type:{name:"number | undefined"}},branchAngle:{defaultValue:{value:"30"},description:"",name:"branchAngle",required:!1,type:{name:"number | undefined"}},initialScale:{defaultValue:{value:"1"},description:"",name:"initialScale",required:!1,type:{name:"number | undefined"}},recursive:{defaultValue:{value:"true"},description:"",name:"recursive",required:!1,type:{name:"boolean | undefined"}},animateGrowth:{defaultValue:{value:"true"},description:"",name:"animateGrowth",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerNode:{defaultValue:{value:"true"},description:"",name:"centerNode",required:!1,type:{name:"boolean | undefined"}},interactiveZoom:{defaultValue:{value:"true"},description:"",name:"interactiveZoom",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: FractalNode) => void) | undefined"}},onNodeHover:{defaultValue:null,description:"",name:"onNodeHover",required:!1,type:{name:"((node: FractalNode | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const o=[{id:"root",content:e.jsx(ba,{size:16}),children:[{id:"branch1",content:e.jsx(fa,{size:14}),children:[{id:"leaf1",content:e.jsx(ha,{size:12})},{id:"leaf2",content:e.jsx(ga,{size:12})}]},{id:"branch2",content:e.jsx(Ie,{size:14}),children:[{id:"leaf3",content:e.jsx(ya,{size:12})},{id:"leaf4",content:e.jsx(xa,{size:12})}]}]}],ee=[{id:"project",content:e.jsx(g,{size:16}),children:[{id:"src",content:e.jsx(g,{size:14}),children:[{id:"components",content:e.jsx(g,{size:12}),children:[{id:"button.tsx",content:e.jsx(de,{size:10})},{id:"modal.tsx",content:e.jsx(de,{size:10})},{id:"input.tsx",content:e.jsx(de,{size:10})}]},{id:"utils",content:e.jsx(g,{size:12}),children:[{id:"helpers.ts",content:e.jsx(me,{size:10})},{id:"constants.ts",content:e.jsx(me,{size:10})}]}]},{id:"public",content:e.jsx(g,{size:14}),children:[{id:"index.html",content:e.jsx(Na,{size:12})},{id:"favicon.ico",content:e.jsx(va,{size:12})}]},{id:"config",content:e.jsx(g,{size:14}),children:[{id:"webpack.config.js",content:e.jsx(Ie,{size:12})},{id:"package.json",content:e.jsx(me,{size:12})}]}]}],Ze=[{id:"datacenter",content:e.jsx(Ta,{size:16}),children:[{id:"cluster1",content:e.jsx($e,{size:14}),children:[{id:"node1",content:e.jsx(b,{size:12})},{id:"node2",content:e.jsx(b,{size:12})},{id:"node3",content:e.jsx(b,{size:12})}]},{id:"cluster2",content:e.jsx($e,{size:14}),children:[{id:"node4",content:e.jsx(b,{size:12})},{id:"node5",content:e.jsx(b,{size:12})}]},{id:"database",content:e.jsx(D,{size:14}),children:[{id:"primary",content:e.jsx(D,{size:12})},{id:"replica1",content:e.jsx(D,{size:12})},{id:"replica2",content:e.jsx(D,{size:12})}]}]}],Oe=[{id:"ceo",content:e.jsx("div",{className:"glass-text-xs glass-font-bold",children:"CEO"}),children:[{id:"cto",content:e.jsx("div",{className:"glass-text-xs",children:"CTO"}),children:[{id:"dev1",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev2",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})},{id:"dev3",content:e.jsx("div",{className:"glass-text-xs",children:"Dev"})}]},{id:"cfo",content:e.jsx("div",{className:"glass-text-xs",children:"CFO"}),children:[{id:"acc1",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})},{id:"acc2",content:e.jsx("div",{className:"glass-text-xs",children:"Acc"})}]},{id:"cmo",content:e.jsx("div",{className:"glass-text-xs",children:"CMO"}),children:[{id:"mark1",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark2",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark3",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})},{id:"mark4",content:e.jsx("div",{className:"glass-text-xs",children:"Mkt"})}]}]}],ae=[{id:"center",content:e.jsx("div",{className:"glass-w-4 glass-h-4 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:8},(u,d)=>({id:`ring1-${d}`,content:e.jsx("div",{className:"glass-w-3 glass-h-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"}),children:Array.from({length:3},(v,w)=>({id:`ring2-${d}-${w}`,content:e.jsx("div",{className:"glass-w-2 glass-h-2 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"})}))}))}],Xa={title:"Surfaces/App Shells + Layout/Glass Fractal Layout",component:K,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[u=>e.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(u,{})})],tags:["autodocs"],argTypes:{maxDepth:{control:{type:"range",min:1,max:10,step:1}},fractalType:{control:{type:"select"},options:["sierpinski","mandelbrot","julia","tree","spiral","custom"]},scaleFactor:{control:{type:"range",min:.3,max:.9,step:.05}},branchAngle:{control:{type:"range",min:10,max:90,step:5}},initialScale:{control:{type:"range",min:.5,max:2,step:.1}},zoomLevel:{control:{type:"range",min:.1,max:3,step:.1}},recursive:{control:"boolean"},animateGrowth:{control:"boolean"},centerNode:{control:"boolean"},interactiveZoom:{control:"boolean"},soundEnabled:{control:"boolean"}}},G={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.618,branchAngle:30,initialScale:1,recursive:!0,animateGrowth:!0,zoomLevel:1,centerNode:!0,interactiveZoom:!0,soundEnabled:!0}},M={args:{nodes:o,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:45,animateGrowth:!0}},F={args:{nodes:ae,maxDepth:3,fractalType:"spiral",scaleFactor:.8,animateGrowth:!0}},z={args:{nodes:ae,maxDepth:4,fractalType:"sierpinski",scaleFactor:.5,animateGrowth:!0}},A={args:{nodes:ae,maxDepth:3,fractalType:"mandelbrot",scaleFactor:.6,animateGrowth:!0}},C={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.75,branchAngle:25,initialScale:.8,animateGrowth:!0}},q={args:{nodes:Ze,maxDepth:3,fractalType:"tree",scaleFactor:.8,branchAngle:40,initialScale:1.2,animateGrowth:!0}},V={args:{nodes:Oe,maxDepth:3,fractalType:"tree",scaleFactor:.85,branchAngle:35,initialScale:.9,animateGrowth:!0}},H={args:{nodes:o,maxDepth:3,fractalType:"tree",branchAngle:60,scaleFactor:.7,animateGrowth:!0}},L={args:{nodes:o,maxDepth:4,fractalType:"tree",branchAngle:15,scaleFactor:.8,animateGrowth:!0}},_={args:{nodes:o,maxDepth:3,fractalType:"tree",scaleFactor:.9,initialScale:1.5,animateGrowth:!0}},$={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.4,initialScale:.6,animateGrowth:!0}},I={args:{nodes:o,maxDepth:6,fractalType:"tree",scaleFactor:.6,branchAngle:25,animateGrowth:!0}},Z={args:{nodes:Oe,maxDepth:2,fractalType:"tree",scaleFactor:.8,branchAngle:45,animateGrowth:!0}},O={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!1}},R={args:{nodes:o,maxDepth:3,fractalType:"tree",recursive:!1,animateGrowth:!0}},E={args:{nodes:o,maxDepth:3,fractalType:"tree",centerNode:!1,animateGrowth:!0}},P={args:{nodes:o,maxDepth:3,fractalType:"tree",interactiveZoom:!1,animateGrowth:!0}},B={args:{nodes:ee,maxDepth:4,fractalType:"tree",zoomLevel:1.5,animateGrowth:!0}},W={args:{nodes:Ze,maxDepth:3,fractalType:"tree",zoomLevel:.7,animateGrowth:!0}},U={args:{nodes:ae,maxDepth:4,fractalType:"spiral",scaleFactor:.618,animateGrowth:!0}},Y={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:25,opacity:.7,saturation:1.3,brightness:1.2,contrast:1.1}}},X={args:{nodes:o,maxDepth:3,fractalType:"tree",animateGrowth:!0,glassConfig:{blur:5,opacity:.95,saturation:1,brightness:1,contrast:1}}},J={args:{nodes:ee,maxDepth:4,fractalType:"tree",scaleFactor:.7,branchAngle:30,animateGrowth:!0,interactiveZoom:!0,onNodeClick:_e(),onNodeHover:_e()}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.7,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...M.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 3,
    fractalType: 'spiral',
    scaleFactor: 0.8,
    animateGrowth: true
  }
}`,...F.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'sierpinski',
    scaleFactor: 0.5,
    animateGrowth: true
  }
}`,...z.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    scaleFactor: 0.9,
    initialScale: 1.5,
    animateGrowth: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: fileSystem,
    maxDepth: 4,
    fractalType: 'tree',
    scaleFactor: 0.4,
    initialScale: 0.6,
    animateGrowth: true
  }
}`,...$.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 6,
    fractalType: 'tree',
    scaleFactor: 0.6,
    branchAngle: 25,
    animateGrowth: true
  }
}`,...I.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: orgChart,
    maxDepth: 2,
    fractalType: 'tree',
    scaleFactor: 0.8,
    branchAngle: 45,
    animateGrowth: true
  }
}`,...Z.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    animateGrowth: false
  }
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: simpleTree,
    maxDepth: 3,
    fractalType: 'tree',
    recursive: false,
    animateGrowth: true
  }
}`,...R.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: mathNodes,
    maxDepth: 4,
    fractalType: 'spiral',
    scaleFactor: 0.618,
    // Golden ratio
    animateGrowth: true
  }
}`,...U.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};const Ja=["Default","TreePattern","SpiralPattern","SierpinskiTriangle","MandelbrotSet","FileSystemHierarchy","NetworkTopology","OrganizationalChart","WideAngleBranches","NarrowAngleBranches","LargeScale","SmallScale","DeepHierarchy","ShallowHierarchy","NoAnimation","NoRecursion","OffCenter","NoInteractiveZoom","ZoomedIn","ZoomedOut","GoldenRatio","CustomGlass","MinimalGlass","InteractiveDemo"];export{Y as CustomGlass,I as DeepHierarchy,G as Default,C as FileSystemHierarchy,U as GoldenRatio,J as InteractiveDemo,_ as LargeScale,A as MandelbrotSet,X as MinimalGlass,L as NarrowAngleBranches,q as NetworkTopology,O as NoAnimation,P as NoInteractiveZoom,R as NoRecursion,E as OffCenter,V as OrganizationalChart,Z as ShallowHierarchy,z as SierpinskiTriangle,$ as SmallScale,F as SpiralPattern,M as TreePattern,H as WideAngleBranches,B as ZoomedIn,W as ZoomedOut,Ja as __namedExportsOrder,Xa as default};
