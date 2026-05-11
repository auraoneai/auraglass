import{r as f,d as me,j as s,e as _e,m as Be}from"./iframe-CCVHZjui.js";import{f as he}from"./index-CLSxArU-.js";import{u as Re}from"./useMotionPreference-D2eeqZD8.js";import{u as Oe}from"./a11y-DYpJNAyD.js";import{u as Ze}from"./soundDesign-BUt5NYqY.js";import{O as Ue}from"./OptimizedGlassCore-D_hfAzIe.js";import{H as fe}from"./house-DLbQLItD.js";import{U as xe}from"./user-Dy3xYnlt.js";import{S as ye}from"./settings-Bd7UoUFH.js";import{M as Te}from"./mail-0zPZOCPd.js";import{S as ve}from"./search-D1osvnaX.js";import{B as Se}from"./bell-6pnAS-Ob.js";import{H as be}from"./heart-BnSjXof_.js";import{S as we}from"./share-DhcIFHVn.js";import{F as Xe}from"./flame-CykxHqEj.js";import{D as Ye}from"./droplets-CFYnoLVr.js";import{W as Je}from"./wind-DzQVn0ex.js";import{S as ze}from"./square-D6aPkDxy.js";import{Z as Ke}from"./zap-DnY9svSQ.js";import{S as Qe,C as es}from"./snowflake-CLbU_r-p.js";import{S as ss}from"./sun-C98nNMSL.js";import{M as as}from"./moon-BhnHOPf8.js";import{S as je}from"./star-BqbSMybK.js";import{C as He}from"./circle-BGw9bCLV.js";import{T as ns}from"./triangle-CO0zv2Op.js";import{D as ts}from"./diamond-DF-hc4I8.js";import{c as rs}from"./createLucideIcon-WuVVelq6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-WGQt4yIJ.js";const os=[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]],is=rs("hexagon",os),Q=f.forwardRef(({tiles:o=[],tessellationType:h="hexagonal",containerWidth:g=800,containerHeight:d=600,tileSize:x=60,spacing:b=2,animatePattern:re=!0,morphPattern:S=!1,morphSpeed:oe=2e3,showGrid:We=!1,interactive:ae=!0,onTileClick:ie,onTileHover:le,glassConfig:Pe={},soundEnabled:w=!0,className:qe="",style:Ce={},...$e},Ne)=>{const[ce,ke]=f.useState(null),[pe,ge]=f.useState(null),[ne,Ie]=f.useState(0),Ge=f.useRef(null),z=f.useRef(),{prefersReducedMotion:te}=Re(),Le=Oe(),{play:j}=Ze();f.useEffect(()=>{if(!S||te)return;const n=Date.now(),c=()=>{const r=(Date.now()-n)/oe%1;Ie(r),z.current=requestAnimationFrame(c)};return z.current=requestAnimationFrame(c),()=>{z.current&&cancelAnimationFrame(z.current)}},[S,oe,te]);const de=f.useCallback(()=>{const n=new Map,c=x+b;switch(h){case"triangular":{const a=c*Math.sqrt(3)/2;let r=0;for(let e=0;e*a<d&&r<o.length;e++){const i=Math.floor(g/c)+e%2,p=e%2?c/2:0;for(let l=0;l<i&&r<o.length;l++){const t=l*c+p,u=e*a,m=e%2?180:0;n.set(o[r].id,{x:t,y:u,rotation:m,scale:1}),r++}}break}case"square":{let a=0;const r=Math.floor(g/c),e=Math.floor(d/c);for(let i=0;i<e&&a<o.length;i++)for(let p=0;p<r&&a<o.length;p++){const l=p*c,t=i*c;n.set(o[a].id,{x:l,y:t,rotation:0,scale:1}),a++}break}case"hexagonal":{const a=c*Math.sqrt(3),r=c*2;let e=0;for(let i=0;i*r*.75<d&&e<o.length;i++){const p=Math.floor(g/a)+1,l=i%2?a/2:0;for(let t=0;t<p&&e<o.length;t++){const u=t*a+l,m=i*r*.75;n.set(o[e].id,{x:u,y:m,rotation:0,scale:1}),e++}}break}case"rhombic":{const a=c*1.5,r=c;let e=0;for(let i=0;i*r<d&&e<o.length;i++){const p=Math.floor(g/a)+1,l=i%2?a/2:0;for(let t=0;t<p&&e<o.length;t++){const u=t*a+l,m=i*r,T=(i+t)%2?45:-45;n.set(o[e].id,{x:u,y:m,rotation:T,scale:1}),e++}}break}case"pentagonal":{const a=c*.8;let r=0;for(let e=0;e*a<d&&r<o.length;e++){const i=Math.floor(g/a)+1,p=e%2?a/2:0,l=e%3?a/3:0;for(let t=0;t<i&&r<o.length;t++){const u=t*a+p,m=e*a+l,T=e*t*72%360;n.set(o[r].id,{x:u,y:m,rotation:T,scale:1}),r++}}break}case"mixed":{let a=0;const r=c*.7;for(let e=0;e<d-r&&a<o.length;e+=r)for(let i=0;i<g-r&&a<o.length;i+=r){const p=Math.sin(i*.01+e*.01+ne*Math.PI*2),l=.8+p*.4,t=p*60;n.set(o[a].id,{x:i+p*20,y:e+p*20,rotation:t,scale:l}),a++}break}}return n},[h,o,x,b,g,d,ne]),Ae=f.useMemo(()=>de(),[de]),H=Math.max(x,32),Ve=`${-H} ${-H} ${g+H*2} ${d+H*2}`,De=f.useCallback(n=>{ge(n.id),ie?.(n),w&&j("tap"),setTimeout(()=>ge(null),me.DURATION.normal)},[ie,w,j]),ue=f.useCallback(n=>{ke(n?.id||null),le?.(n),w&&n&&j("hover")},[le,w,j]),Ee=(n,c)=>{const a=ce===n.id,r=pe===n.id,e=x*c.scale,i={className:`
          transition-all duration-[${me.DURATION.fast}ms] cursor-pointer
          ${a||r?"fill-white/20 stroke-white/60":"fill-white/10 stroke-white/30"}
        `,strokeWidth:1.5},p={triangle:`M ${e/2} 0 L ${e} ${e*Math.sqrt(3)/2} L 0 ${e*Math.sqrt(3)/2} Z`,square:`M 0 0 L ${e} 0 L ${e} ${e} L 0 ${e} Z`,hexagon:(()=>{const l=[];for(let t=0;t<6;t++){const u=t*Math.PI/3,m=e/2+e/2*Math.cos(u),T=e/2+e/2*Math.sin(u);l.push(`${m} ${T}`)}return`M ${l.join(" L ")} Z`})(),rhombus:`M ${e/2} 0 L ${e} ${e/2} L ${e/2} ${e} L 0 ${e/2} Z`,pentagon:(()=>{const l=[];for(let t=0;t<5;t++){const u=t*2*Math.PI/5-Math.PI/2,m=e/2+e/2*Math.cos(u),T=e/2+e/2*Math.sin(u);l.push(`${m} ${T}`)}return`M ${l.join(" L ")} Z`})(),octagon:(()=>{const l=[];for(let t=0;t<8;t++){const u=t*Math.PI/4,m=e/2+e/2*Math.cos(u),T=e/2+e/2*Math.sin(u);l.push(`${m} ${T}`)}return`M ${l.join(" L ")} Z`})()};return s.jsxs("g",{children:[s.jsx("path",{d:p[n.shape]||p.hexagon,...i}),s.jsx("foreignObject",{x:"0",y:"0",width:e,height:e,className:"glass-pointer-events-none",children:s.jsx("div",{className:"glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary-glass-opacity-90",children:n.content})})]})},Fe=()=>({hidden:{scale:0,opacity:0,rotate:-180},visible:n=>({scale:1,opacity:1,rotate:0,transition:{type:"spring",tension:300,friction:25,delay:te?0:n*.02}}),hover:{scale:1.05,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.1,transition:{type:"spring",tension:500,friction:15}}});return s.jsxs(Ue,{ref:Ne,className:`glass-tessellation relative overflow-auto ${qe}`,style:{width:`min(${g}px, calc(100vw - 48px))`,maxWidth:"100%",height:d,minWidth:Math.min(g,320),overflowX:"auto",overflowY:"auto",boxSizing:"border-box",...Ce},glassConfig:{blur:10,opacity:.95,saturation:1.1,brightness:1.05,...Pe},role:"application","aria-label":`${h} tessellation pattern`,id:Le,...$e,children:[s.jsxs("div",{ref:Ge,className:"glass-relative",style:{width:g,height:d,minWidth:g,minHeight:d,overflow:"visible"},children:[We&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",children:s.jsxs("svg",{width:g,height:d,viewBox:`0 0 ${g} ${d}`,children:[s.jsx("defs",{children:s.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:s.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"white",strokeWidth:"0.5",opacity:"0.2"})})}),s.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"})]})}),s.jsx("svg",{width:g,height:d,viewBox:Ve,className:"glass-absolute glass-inset-0 glass-overflow-visible",style:{overflow:"visible"},children:s.jsx(_e,{children:o.map((n,c)=>{const a=Ae.get(n.id);if(!a)return null;const r=ce===n.id,e=pe===n.id;return s.jsx(Be.g,{custom:c,variants:Fe(),initial:"hidden",animate:e?"selected":r?"hover":"visible",exit:"hidden",style:{transformOrigin:`${a.x+x/2}px ${a.y+x/2}px`},onMouseEnter:()=>ae&&ue(n),onMouseLeave:()=>ae&&ue(null),onClick:()=>ae&&De(n),children:s.jsx("g",{transform:`translate(${a.x}, ${a.y}) rotate(${a.rotation+(n.rotation||0)})`,children:Ee(n,a)})},n.id)})})})]}),s.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:[s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Pattern: ",h]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Tiles: ",o.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Size: ",x,"px"]}),S&&s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Morph: ",Math.round(ne*100),"%"]})]}),s.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[h.charAt(0).toUpperCase()+h.slice(1)," ","Tessellation"]})})]})});Q.displayName="GlassTessellation";try{Q.displayName="GlassTessellation",Q.__docgenInfo={description:"",displayName:"GlassTessellation",props:{tiles:{defaultValue:{value:"[]"},description:"",name:"tiles",required:!1,type:{name:"TessellationTile[]"}},tessellationType:{defaultValue:{value:"hexagonal"},description:"",name:"tessellationType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"mixed"'},{value:'"square"'},{value:'"triangular"'},{value:'"hexagonal"'},{value:'"rhombic"'},{value:'"pentagonal"'}]}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},tileSize:{defaultValue:{value:"60"},description:"",name:"tileSize",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"2"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animatePattern:{defaultValue:{value:"true"},description:"",name:"animatePattern",required:!1,type:{name:"boolean | undefined"}},morphPattern:{defaultValue:{value:"false"},description:"",name:"morphPattern",required:!1,type:{name:"boolean | undefined"}},morphSpeed:{defaultValue:{value:"2000"},description:"",name:"morphSpeed",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onTileClick:{defaultValue:null,description:"",name:"onTileClick",required:!1,type:{name:"((tile: TessellationTile) => void) | undefined"}},onTileHover:{defaultValue:null,description:"",name:"onTileHover",required:!1,type:{name:"((tile: TessellationTile | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const y=[{id:"home",content:s.jsx(fe,{size:16}),shape:"hexagon",color:"var(--glass-color-primary)"},{id:"user",content:s.jsx(xe,{size:14}),shape:"triangle",color:"var(--glass-color-danger)"},{id:"settings",content:s.jsx(ye,{size:14}),shape:"square",color:"var(--glass-color-success)"},{id:"mail",content:s.jsx(Te,{size:12}),shape:"rhombus",color:"var(--glass-color-warning)"},{id:"search",content:s.jsx(ve,{size:14}),shape:"pentagon",color:"var(--glass-color-secondary)"},{id:"bell",content:s.jsx(Se,{size:12}),shape:"hexagon",color:"var(--glass-color-secondary)"},{id:"heart",content:s.jsx(be,{size:12}),shape:"triangle",color:"var(--glass-color-danger)"},{id:"share",content:s.jsx(we,{size:12}),shape:"square",color:"var(--glass-color-info)"}],v=[{id:"fire",content:s.jsx(Xe,{size:16}),shape:"triangle",color:"var(--glass-color-danger-dark)"},{id:"water",content:s.jsx(Ye,{size:16}),shape:"hexagon",color:"var(--glass-color-info)"},{id:"air",content:s.jsx(Je,{size:16}),shape:"rhombus",color:"#7C3AED"},{id:"earth",content:s.jsx(ze,{size:16}),shape:"square",color:"var(--glass-color-success-dark)"},{id:"lightning",content:s.jsx(Ke,{size:14}),shape:"triangle",color:"var(--glass-color-warning-light)"},{id:"ice",content:s.jsx(Qe,{size:14}),shape:"hexagon",color:"#67E8F9"},{id:"sun",content:s.jsx(ss,{size:16}),shape:"octagon",color:"var(--glass-color-warning)"},{id:"moon",content:s.jsx(as,{size:14}),shape:"pentagon",color:"#A78BFA"},{id:"cloud",content:s.jsx(es,{size:14}),shape:"rhombus",color:"var(--glass-gray-400)"},{id:"star",content:s.jsx(je,{size:14}),shape:"pentagon",color:"#FCD34D"}],ee=[{id:"circle",content:s.jsx(He,{size:16}),shape:"hexagon",color:"var(--glass-color-primary)"},{id:"triangle",content:s.jsx(ns,{size:16}),shape:"triangle",color:"var(--glass-color-danger)"},{id:"square",content:s.jsx(ze,{size:16}),shape:"square",color:"var(--glass-color-success)"},{id:"diamond",content:s.jsx(ts,{size:16}),shape:"rhombus",color:"#8B5CF6"},{id:"hexagon",content:s.jsx(is,{size:16}),shape:"hexagon",color:"#EC4899"}],Me=[...Array.from({length:50},(o,h)=>{const g=["triangle","square","hexagon","rhombus","pentagon"],d=[fe,xe,ye,Te,ve,Se,be,we,je,He],x=["var(--glass-color-primary)","var(--glass-color-danger)","var(--glass-color-success)","var(--glass-color-warning)","#8B5CF6","#EC4899","#06B6D4","var(--glass-color-danger-dark)"],b=g[h%g.length],re=d[h%d.length],S=x[h%x.length];return{id:`tile-${h}`,content:s.jsx(re,{size:14}),shape:b,color:S,priority:Math.floor(Math.random()*10)}})],se=[{id:"red",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-red glass-radius-full"}),shape:"triangle",color:"var(--glass-color-danger)"},{id:"blue",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-blue glass-radius-full"}),shape:"hexagon",color:"var(--glass-color-primary)"},{id:"green",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-green glass-radius-full"}),shape:"square",color:"var(--glass-color-success)"},{id:"yellow",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-yellow glass-radius-full"}),shape:"rhombus",color:"var(--glass-color-warning)"},{id:"purple",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"pentagon",color:"#8B5CF6"},{id:"pink",content:s.jsx("div",{className:"glass-w-4 glass-h-4 bg-pink-500 glass-radius-full"}),shape:"hexagon",color:"#EC4899"},{id:"cyan",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"triangle",color:"#06B6D4"},{id:"orange",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"square",color:"#EA580C"}],As={title:"Surfaces/App Shells + Layout/Glass Tessellation",component:Q,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[o=>s.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:s.jsx(o,{})})],tags:["autodocs"],argTypes:{tessellationType:{control:{type:"select"},options:["triangular","square","hexagonal","rhombic","pentagonal","mixed"]},containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},tileSize:{control:{type:"range",min:30,max:120,step:10}},spacing:{control:{type:"range",min:0,max:20,step:2}},animatePattern:{control:"boolean"},morphPattern:{control:"boolean"},morphSpeed:{control:{type:"range",min:1e3,max:5e3,step:500}},showGrid:{control:"boolean"},interactive:{control:"boolean"},soundEnabled:{control:"boolean"}}},M={args:{tiles:y,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:60,spacing:2,animatePattern:!0,morphPattern:!1,showGrid:!1,interactive:!0,soundEnabled:!0}},W={args:{tiles:y,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:70,spacing:4}},P={args:{tiles:y,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:80,spacing:6}},q={args:{tiles:v,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:75,spacing:4}},C={args:{tiles:ee,tessellationType:"rhombic",containerWidth:800,containerHeight:600,tileSize:65,spacing:8}},$={args:{tiles:se,tessellationType:"pentagonal",containerWidth:800,containerHeight:600,tileSize:55,spacing:6}},N={args:{tiles:v,tessellationType:"mixed",containerWidth:800,containerHeight:600,tileSize:60,spacing:4}},k={args:{tiles:Me,tessellationType:"hexagonal",containerWidth:1e3,containerHeight:800,tileSize:50,spacing:2,soundEnabled:!1}},I={args:{tiles:Me,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:35,spacing:2}},G={args:{tiles:y,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:100,spacing:8}},L={args:{tiles:se,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:60,spacing:0}},A={args:{tiles:ee,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:70,spacing:15}},V={args:{tiles:y,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,showGrid:!0}},D={args:{tiles:v,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:3e3}},E={args:{tiles:se,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:1500}},F={args:{tiles:ee,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:5e3}},_={args:{tiles:y,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,animatePattern:!1}},B={args:{tiles:y,tessellationType:"square",containerWidth:800,containerHeight:600,interactive:!1}},R={args:{tiles:v,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:80,spacing:6,morphPattern:!0,morphSpeed:4e3}},O={args:{tiles:ee,tessellationType:"rhombic",containerWidth:700,containerHeight:500,tileSize:90,spacing:10}},Z={args:{tiles:se,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:65,spacing:4,showGrid:!0}},U={args:{tiles:y,tessellationType:"hexagonal",containerWidth:600,containerHeight:400,tileSize:45,spacing:1}},X={args:{tiles:v,tessellationType:"pentagonal",containerWidth:1e3,containerHeight:700,tileSize:80,spacing:12}},Y={args:{tiles:y,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,glassConfig:{blur:20,opacity:.8,saturation:1.3,brightness:1.2,contrast:1.1}}},J={args:{tiles:y,tessellationType:"square",containerWidth:800,containerHeight:600,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},K={args:{tiles:v,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:70,morphPattern:!0,onTileClick:he(),onTileHover:he()}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 2,
    animatePattern: true,
    morphPattern: false,
    showGrid: false,
    interactive: true,
    soundEnabled: true
  }
}`,...M.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 4
  }
}`,...W.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 80,
    spacing: 6
  }
}`,...P.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'hexagonal',
    containerWidth: 900,
    containerHeight: 700,
    tileSize: 75,
    spacing: 4
  }
}`,...q.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 8
  }
}`,...C.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'pentagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 55,
    spacing: 6
  }
}`,...$.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 4
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'hexagonal',
    containerWidth: 1000,
    containerHeight: 800,
    tileSize: 50,
    spacing: 2,
    soundEnabled: false
  }
}`,...k.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 35,
    spacing: 2
  }
}`,...I.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 100,
    spacing: 8
  }
}`,...G.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 0
  }
}`,...L.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 15
  }
}`,...A.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true
  }
}`,...V.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 3000
  }
}`,...D.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 1500
  }
}`,...E.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 5000
  }
}`,...F.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    animatePattern: false
  }
}`,..._.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    interactive: false
  }
}`,...B.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'hexagonal',
    containerWidth: 900,
    containerHeight: 700,
    tileSize: 80,
    spacing: 6,
    morphPattern: true,
    morphSpeed: 4000
  }
}`,...R.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 700,
    containerHeight: 500,
    tileSize: 90,
    spacing: 10
  }
}`,...O.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 4,
    showGrid: true
  }
}`,...Z.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 600,
    containerHeight: 400,
    tileSize: 45,
    spacing: 1
  }
}`,...U.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'pentagonal',
    containerWidth: 1000,
    containerHeight: 700,
    tileSize: 80,
    spacing: 12
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    glassConfig: {
      blur: 20,
      opacity: 0.8,
      saturation: 1.3,
      brightness: 1.2,
      contrast: 1.1
    }
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    glassConfig: {
      blur: 5,
      opacity: 0.98,
      saturation: 1.0,
      brightness: 1.0,
      contrast: 1.0
    }
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'hexagonal',
    containerWidth: 900,
    containerHeight: 700,
    tileSize: 70,
    morphPattern: true,
    onTileClick: fn(),
    onTileHover: fn()
  }
}`,...K.parameters?.docs?.source}}};const Vs=["Default","TriangularPattern","SquarePattern","HexagonalPattern","RhombicPattern","PentagonalPattern","MixedPattern","LargePattern","SmallTiles","LargeTiles","TightSpacing","WideSpacing","WithGrid","MorphingPattern","FastMorphing","SlowMorphing","NoAnimation","NonInteractive","ElementalTheme","GeometricShapes","ColorSpectrum","CompactLayout","SpacedLayout","CustomGlass","MinimalGlass","InteractiveDemo"];export{Z as ColorSpectrum,U as CompactLayout,Y as CustomGlass,M as Default,R as ElementalTheme,E as FastMorphing,O as GeometricShapes,q as HexagonalPattern,K as InteractiveDemo,k as LargePattern,G as LargeTiles,J as MinimalGlass,N as MixedPattern,D as MorphingPattern,_ as NoAnimation,B as NonInteractive,$ as PentagonalPattern,C as RhombicPattern,F as SlowMorphing,I as SmallTiles,X as SpacedLayout,P as SquarePattern,L as TightSpacing,W as TriangularPattern,A as WideSpacing,V as WithGrid,Vs as __namedExportsOrder,As as default};
