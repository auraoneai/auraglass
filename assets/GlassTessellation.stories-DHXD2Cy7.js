import{r as T,d as ss,j as s,e as as,m as ns}from"./iframe-BGoRE5Do.js";import{f as We}from"./index-CLSxArU-.js";import{b2 as je,a4 as we,S as Me,au as qe,m as Pe,an as Ce,H as $e,bi as Ne,F as ts,al as rs,bo as os,aW as ke,Z as is,bp as ls,am as cs,bd as ds,bq as gs,aN as Ie,aq as Ge,br as ps,D as us,bs as hs}from"./components-BtZOXrmB.js";import{u as ms}from"./useMotionPreference-Ct6LqXAq.js";import{u as fs}from"./a11y-BGeEhmxI.js";import{u as xs}from"./soundDesign-wB5--F2R.js";import{O as ys}from"./OptimizedGlassCore-MyIZufQF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-DE3cL9ZV.js";function bs(t){if(!t)return null;const c=t.trim(),f=c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(f){const y=f[1],b=y.length===3?y.split("").map(M=>M+M).join(""):y;return{r:parseInt(b.slice(0,2),16),g:parseInt(b.slice(2,4),16),b:parseInt(b.slice(4,6),16)}}const v=c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i);return v?{r:Number(v[1]),g:Number(v[2]),b:Number(v[3])}:null}function vs(t){const c=bs(t);if(!c)return"rgba(248,250,252,0.96)";const f=y=>{const b=y/255;return b<=.03928?b/12.92:Math.pow((b+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)>.48?"rgba(8,13,24,0.92)":"rgba(248,250,252,0.96)"}const de=T.forwardRef(({tiles:t=[],tessellationType:c="hexagonal",containerWidth:f=800,containerHeight:v=600,tileSize:y=60,spacing:b=2,animatePattern:M=!0,morphPattern:q=!1,morphSpeed:fe=2e3,showGrid:Ve=!1,interactive:ue=!0,onTileClick:xe,onTileHover:ye,glassConfig:Ae={},soundEnabled:$=!0,compact:Ee=!1,contained:De=!1,maxHeight:N,height:k,className:Fe="",style:Re={},..._e},Be)=>{const[be,Oe]=T.useState(null),[ve,Te]=T.useState(null),[he,Ze]=T.useState(0),Ue=T.useRef(null),I=T.useRef(),{prefersReducedMotion:me}=ms(),Xe=fs(),{play:G}=xs(),x=Ee||De,h=x?Math.min(f,320):f,m=typeof(N??k)=="number"?N??k:x?Math.min(v,220):v,W=x?Math.min(y,36):y,Se=x?Math.max(b,6):b,j=N??k??m;T.useEffect(()=>{if(!q||me)return;const n=Date.now(),i=()=>{const r=(Date.now()-n)/fe%1;Ze(r),I.current=requestAnimationFrame(i)};return I.current=requestAnimationFrame(i),()=>{I.current&&cancelAnimationFrame(I.current)}},[q,fe,me]);const He=T.useCallback(()=>{const n=new Map,i=W+Se;switch(c){case"triangular":{const a=i*Math.sqrt(3)/2;let r=0;for(let e=0;e*a<m&&r<t.length;e++){const o=Math.floor(h/i)+e%2,d=e%2?i/2:0;for(let g=0;g<o&&r<t.length;g++){const l=g*i+d,S=e*a,p=e%2?180:0;n.set(t[r].id,{x:l,y:S,rotation:p,scale:1}),r++}}break}case"square":{let a=0;const r=Math.floor(h/i),e=Math.floor(m/i);for(let o=0;o<e&&a<t.length;o++)for(let d=0;d<r&&a<t.length;d++){const g=d*i,l=o*i;n.set(t[a].id,{x:g,y:l,rotation:0,scale:1}),a++}break}case"hexagonal":{const a=i*Math.sqrt(3),r=i*2;let e=0;for(let o=0;o*r*.75<m&&e<t.length;o++){const d=Math.floor(h/a)+1,g=o%2?a/2:0;for(let l=0;l<d&&e<t.length;l++){const S=l*a+g,p=o*r*.75;n.set(t[e].id,{x:S,y:p,rotation:0,scale:1}),e++}}break}case"rhombic":{const a=i*1.5,r=i;let e=0;for(let o=0;o*r<m&&e<t.length;o++){const d=Math.floor(h/a)+1,g=o%2?a/2:0;for(let l=0;l<d&&e<t.length;l++){const S=l*a+g,p=o*r,u=(o+l)%2?45:-45;n.set(t[e].id,{x:S,y:p,rotation:u,scale:1}),e++}}break}case"pentagonal":{const a=i*.8;let r=0;for(let e=0;e*a<m&&r<t.length;e++){const o=Math.floor(h/a)+1,d=e%2?a/2:0,g=e%3?a/3:0;for(let l=0;l<o&&r<t.length;l++){const S=l*a+d,p=e*a+g,u=e*l*72%360;n.set(t[r].id,{x:S,y:p,rotation:u,scale:1}),r++}}break}case"mixed":{let a=0;const r=i*.7;for(let e=0;e<m-r&&a<t.length;e+=r)for(let o=0;o<h-r&&a<t.length;o+=r){const d=Math.sin(o*.01+e*.01+he*Math.PI*2),g=.8+d*.4,l=d*60;n.set(t[a].id,{x:o+d*20,y:e+d*20,rotation:l,scale:g}),a++}break}}return n},[c,t,W,Se,h,m,he]),Ye=T.useMemo(()=>He(),[He]),L=Math.max(W,24),Je=`${-L} ${-L} ${h+L*2} ${m+L*2}`,Ke=T.useCallback(n=>{Te(n.id),xe?.(n),$&&G("tap"),setTimeout(()=>Te(null),ss.DURATION.normal)},[xe,$,G]),ze=T.useCallback(n=>{Oe(n?.id||null),ye?.(n),$&&n&&G("hover")},[ye,$,G]),Qe=(n,i)=>{const a=be===n.id,r=ve===n.id,e=W*i.scale,o=n.color??(a||r?"rgba(125,211,252,0.44)":"rgba(125,211,252,0.30)"),d=a||r?"rgba(248,250,252,0.72)":"rgba(248,250,252,0.36)",g=vs(o),l={className:"transition-all cursor-pointer",fill:o,stroke:d,strokeWidth:1.5},S={triangle:`M ${e/2} 0 L ${e} ${e*Math.sqrt(3)/2} L 0 ${e*Math.sqrt(3)/2} Z`,square:`M 0 0 L ${e} 0 L ${e} ${e} L 0 ${e} Z`,hexagon:(()=>{const p=[];for(let u=0;u<6;u++){const z=u*Math.PI/3,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);p.push(`${P} ${C}`)}return`M ${p.join(" L ")} Z`})(),rhombus:`M ${e/2} 0 L ${e} ${e/2} L ${e/2} ${e} L 0 ${e/2} Z`,pentagon:(()=>{const p=[];for(let u=0;u<5;u++){const z=u*2*Math.PI/5-Math.PI/2,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);p.push(`${P} ${C}`)}return`M ${p.join(" L ")} Z`})(),octagon:(()=>{const p=[];for(let u=0;u<8;u++){const z=u*Math.PI/4,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);p.push(`${P} ${C}`)}return`M ${p.join(" L ")} Z`})()};return s.jsxs("g",{children:[s.jsx("path",{d:S[n.shape]||S.hexagon,...l}),s.jsx("foreignObject",{x:"0",y:"0",width:e,height:e,className:"glass-pointer-events-none",children:s.jsx("div",{className:"glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center glass-text-xs",style:{color:g,fontWeight:650,textShadow:g.startsWith("rgba(8")?"0 1px 2px rgba(255,255,255,0.18)":"0 1px 2px rgba(0,0,0,0.45)"},children:n.content})})]})},es=()=>({hidden:{scale:0,opacity:0,rotate:-180},visible:n=>({scale:1,opacity:1,rotate:0,transition:{type:"spring",tension:300,friction:25,delay:me?0:n*.02}}),hover:{scale:1.05,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.1,transition:{type:"spring",tension:500,friction:15}}});return s.jsxs(ys,{ref:Be,className:`glass-tessellation relative overflow-auto ${Fe}`,style:{width:x?"100%":`min(${h}px, calc(100vw - 48px))`,maxWidth:"100%",height:typeof j=="number"?`${j}px`:j,maxHeight:x||N!==void 0||k!==void 0?typeof j=="number"?`${j}px`:j:void 0,minWidth:x?void 0:Math.min(f,320),overflowX:x?"hidden":"auto",overflowY:x?"hidden":"auto",boxSizing:"border-box",...Re},glassConfig:{blur:10,opacity:.95,saturation:1.1,brightness:1.05,...Ae},role:"application","aria-label":`${c} tessellation pattern`,id:Xe,..._e,children:[s.jsxs("div",{ref:Ue,className:"glass-relative",style:{width:h,height:m,minWidth:x?void 0:h,minHeight:x?void 0:m,overflow:"visible"},children:[Ve&&s.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",children:s.jsxs("svg",{width:h,height:m,viewBox:`0 0 ${h} ${m}`,children:[s.jsx("defs",{children:s.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:s.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"white",strokeWidth:"0.5",opacity:"0.2"})})}),s.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"})]})}),s.jsx("svg",{width:h,height:m,viewBox:Je,className:"glass-absolute glass-inset-0 glass-overflow-visible",style:{overflow:"visible"},children:s.jsx(as,{children:t.map((n,i)=>{const a=Ye.get(n.id);if(!a)return null;const r=be===n.id,e=ve===n.id;return s.jsx(ns.g,{custom:i,variants:es(),initial:"hidden",animate:e?"selected":r?"hover":"visible",exit:"hidden",style:{transformOrigin:`${a.x+W/2}px ${a.y+W/2}px`},onMouseEnter:()=>ue&&ze(n),onMouseLeave:()=>ue&&ze(null),onClick:()=>ue&&Ke(n),children:s.jsx("g",{transform:`translate(${a.x}, ${a.y}) rotate(${a.rotation+(n.rotation||0)})`,children:Qe(n,a)})},n.id)})})})]}),!x&&s.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:[s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Pattern: ",c]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Tiles: ",t.length]}),s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Size: ",y,"px"]}),q&&s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Morph: ",Math.round(he*100),"%"]})]}),!x&&s.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:s.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[c.charAt(0).toUpperCase()+c.slice(1)," ","Tessellation"]})})]})});de.displayName="GlassTessellation";try{de.displayName="GlassTessellation",de.__docgenInfo={description:"",displayName:"GlassTessellation",props:{tiles:{defaultValue:{value:"[]"},description:"",name:"tiles",required:!1,type:{name:"TessellationTile[]"}},tessellationType:{defaultValue:{value:"hexagonal"},description:"",name:"tessellationType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"mixed"'},{value:'"square"'},{value:'"triangular"'},{value:'"hexagonal"'},{value:'"rhombic"'},{value:'"pentagonal"'}]}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},tileSize:{defaultValue:{value:"60"},description:"",name:"tileSize",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"2"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animatePattern:{defaultValue:{value:"true"},description:"",name:"animatePattern",required:!1,type:{name:"boolean | undefined"}},morphPattern:{defaultValue:{value:"false"},description:"",name:"morphPattern",required:!1,type:{name:"boolean | undefined"}},morphSpeed:{defaultValue:{value:"2000"},description:"",name:"morphSpeed",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onTileClick:{defaultValue:null,description:"",name:"onTileClick",required:!1,type:{name:"((tile: TessellationTile) => void) | undefined"}},onTileHover:{defaultValue:null,description:"",name:"onTileHover",required:!1,type:{name:"((tile: TessellationTile | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const H=[{id:"home",content:s.jsx(je,{size:16}),shape:"hexagon",color:"hsl(var(--glass-color-primary))"},{id:"user",content:s.jsx(we,{size:14}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"settings",content:s.jsx(Me,{size:14}),shape:"square",color:"hsl(var(--glass-color-success))"},{id:"mail",content:s.jsx(qe,{size:12}),shape:"rhombus",color:"hsl(var(--glass-color-warning))"},{id:"search",content:s.jsx(Pe,{size:14}),shape:"pentagon",color:"var(--glass-color-secondary)"},{id:"bell",content:s.jsx(Ce,{size:12}),shape:"hexagon",color:"var(--glass-color-secondary)"},{id:"heart",content:s.jsx($e,{size:12}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"share",content:s.jsx(Ne,{size:12}),shape:"square",color:"hsl(var(--glass-color-info))"}],w=[{id:"fire",content:s.jsx(ts,{size:16}),shape:"triangle",color:"var(--glass-color-danger-dark)"},{id:"water",content:s.jsx(rs,{size:16}),shape:"hexagon",color:"hsl(var(--glass-color-info))"},{id:"air",content:s.jsx(os,{size:16}),shape:"rhombus",color:"#7C3AED"},{id:"earth",content:s.jsx(ke,{size:16}),shape:"square",color:"var(--glass-color-success-dark)"},{id:"lightning",content:s.jsx(is,{size:14}),shape:"triangle",color:"var(--glass-color-warning-light)"},{id:"ice",content:s.jsx(ls,{size:14}),shape:"hexagon",color:"#67E8F9"},{id:"sun",content:s.jsx(cs,{size:16}),shape:"octagon",color:"hsl(var(--glass-color-warning))"},{id:"moon",content:s.jsx(ds,{size:14}),shape:"pentagon",color:"#A78BFA"},{id:"cloud",content:s.jsx(gs,{size:14}),shape:"rhombus",color:"var(--glass-gray-400)"},{id:"star",content:s.jsx(Ie,{size:14}),shape:"pentagon",color:"#FCD34D"}],ge=[{id:"circle",content:s.jsx(Ge,{size:16}),shape:"hexagon",color:"hsl(var(--glass-color-primary))"},{id:"triangle",content:s.jsx(ps,{size:16}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"square",content:s.jsx(ke,{size:16}),shape:"square",color:"hsl(var(--glass-color-success))"},{id:"diamond",content:s.jsx(us,{size:16}),shape:"rhombus",color:"#8B5CF6"},{id:"hexagon",content:s.jsx(hs,{size:16}),shape:"hexagon",color:"#EC4899"}],Le=[...Array.from({length:50},(t,c)=>{const f=["triangle","square","hexagon","rhombus","pentagon"],v=[je,we,Me,qe,Pe,Ce,$e,Ne,Ie,Ge],y=["hsl(var(--glass-color-primary))","hsl(var(--glass-color-danger))","hsl(var(--glass-color-success))","hsl(var(--glass-color-warning))","#8B5CF6","#EC4899","#06B6D4","var(--glass-color-danger-dark)"],b=f[c%f.length],M=v[c%v.length],q=y[c%y.length];return{id:`tile-${c}`,content:s.jsx(M,{size:14}),shape:b,color:q,priority:Math.floor(Math.random()*10)}})],pe=[{id:"red",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-red glass-radius-full"}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"blue",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-blue glass-radius-full"}),shape:"hexagon",color:"hsl(var(--glass-color-primary))"},{id:"green",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-green glass-radius-full"}),shape:"square",color:"hsl(var(--glass-color-success))"},{id:"yellow",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-yellow glass-radius-full"}),shape:"rhombus",color:"hsl(var(--glass-color-warning))"},{id:"purple",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"pentagon",color:"#8B5CF6"},{id:"pink",content:s.jsx("div",{className:"glass-w-4 glass-h-4 bg-pink-500 glass-radius-full"}),shape:"hexagon",color:"#EC4899"},{id:"cyan",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"triangle",color:"#06B6D4"},{id:"orange",content:s.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"square",color:"#EA580C"}],Cs={title:"Surfaces/App Shells + Layout/Glass Tessellation",component:de,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[t=>s.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:s.jsx(t,{})})],tags:["autodocs"],argTypes:{tessellationType:{control:{type:"select"},options:["triangular","square","hexagonal","rhombic","pentagonal","mixed"]},containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},tileSize:{control:{type:"range",min:30,max:120,step:10}},spacing:{control:{type:"range",min:0,max:20,step:2}},animatePattern:{control:"boolean"},morphPattern:{control:"boolean"},morphSpeed:{control:{type:"range",min:1e3,max:5e3,step:500}},showGrid:{control:"boolean"},interactive:{control:"boolean"},soundEnabled:{control:"boolean"}}},V={args:{tiles:H,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:60,spacing:2,animatePattern:!0,morphPattern:!1,showGrid:!1,interactive:!0,soundEnabled:!0}},A={args:{tiles:H,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:70,spacing:4}},E={args:{tiles:H,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:80,spacing:6}},D={args:{tiles:w,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:75,spacing:4}},F={args:{tiles:ge,tessellationType:"rhombic",containerWidth:800,containerHeight:600,tileSize:65,spacing:8}},R={args:{tiles:pe,tessellationType:"pentagonal",containerWidth:800,containerHeight:600,tileSize:55,spacing:6}},_={args:{tiles:w,tessellationType:"mixed",containerWidth:800,containerHeight:600,tileSize:60,spacing:4}},B={args:{tiles:Le,tessellationType:"hexagonal",containerWidth:1e3,containerHeight:800,tileSize:50,spacing:2,soundEnabled:!1}},O={args:{tiles:Le,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:35,spacing:2}},Z={args:{tiles:H,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:100,spacing:8}},U={args:{tiles:pe,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:60,spacing:0}},X={args:{tiles:ge,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:70,spacing:15}},Y={args:{tiles:H,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,showGrid:!0}},J={args:{tiles:w,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:3e3}},K={args:{tiles:pe,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:1500}},Q={args:{tiles:ge,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:5e3}},ee={args:{tiles:H,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,animatePattern:!1}},se={args:{tiles:H,tessellationType:"square",containerWidth:800,containerHeight:600,interactive:!1}},ae={args:{tiles:w,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:80,spacing:6,morphPattern:!0,morphSpeed:4e3}},ne={args:{tiles:ge,tessellationType:"rhombic",containerWidth:700,containerHeight:500,tileSize:90,spacing:10}},te={args:{tiles:pe,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:65,spacing:4,showGrid:!0}},re={args:{tiles:H,tessellationType:"hexagonal",containerWidth:600,containerHeight:400,tileSize:45,spacing:1}},oe={args:{tiles:w,tessellationType:"pentagonal",containerWidth:1e3,containerHeight:700,tileSize:80,spacing:12}},ie={args:{tiles:H,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,glassConfig:{blur:20,opacity:.8,saturation:1.3,brightness:1.2,contrast:1.1}}},le={args:{tiles:H,tessellationType:"square",containerWidth:800,containerHeight:600,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},ce={args:{tiles:w,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:70,morphPattern:!0,onTileClick:We(),onTileHover:We()}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 4
  }
}`,...A.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 80,
    spacing: 6
  }
}`,...E.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'hexagonal',
    containerWidth: 900,
    containerHeight: 700,
    tileSize: 75,
    spacing: 4
  }
}`,...D.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 8
  }
}`,...F.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'pentagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 55,
    spacing: 6
  }
}`,...R.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 4
  }
}`,..._.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'hexagonal',
    containerWidth: 1000,
    containerHeight: 800,
    tileSize: 50,
    spacing: 2,
    soundEnabled: false
  }
}`,...B.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 35,
    spacing: 2
  }
}`,...O.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 100,
    spacing: 8
  }
}`,...Z.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 0
  }
}`,...U.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 15
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 3000
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 1500
  }
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 5000
  }
}`,...Q.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    animatePattern: false
  }
}`,...ee.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    interactive: false
  }
}`,...se.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
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
}`,...ae.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 700,
    containerHeight: 500,
    tileSize: 90,
    spacing: 10
  }
}`,...ne.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 4,
    showGrid: true
  }
}`,...te.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 600,
    containerHeight: 400,
    tileSize: 45,
    spacing: 1
  }
}`,...re.parameters?.docs?.source}}};oe.parameters={...oe.parameters,docs:{...oe.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'pentagonal',
    containerWidth: 1000,
    containerHeight: 700,
    tileSize: 80,
    spacing: 12
  }
}`,...oe.parameters?.docs?.source}}};ie.parameters={...ie.parameters,docs:{...ie.parameters?.docs,source:{originalSource:`{
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
}`,...ie.parameters?.docs?.source}}};le.parameters={...le.parameters,docs:{...le.parameters?.docs,source:{originalSource:`{
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
}`,...le.parameters?.docs?.source}}};ce.parameters={...ce.parameters,docs:{...ce.parameters?.docs,source:{originalSource:`{
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
}`,...ce.parameters?.docs?.source}}};const $s=["Default","TriangularPattern","SquarePattern","HexagonalPattern","RhombicPattern","PentagonalPattern","MixedPattern","LargePattern","SmallTiles","LargeTiles","TightSpacing","WideSpacing","WithGrid","MorphingPattern","FastMorphing","SlowMorphing","NoAnimation","NonInteractive","ElementalTheme","GeometricShapes","ColorSpectrum","CompactLayout","SpacedLayout","CustomGlass","MinimalGlass","InteractiveDemo"];export{te as ColorSpectrum,re as CompactLayout,ie as CustomGlass,V as Default,ae as ElementalTheme,K as FastMorphing,ne as GeometricShapes,D as HexagonalPattern,ce as InteractiveDemo,B as LargePattern,Z as LargeTiles,le as MinimalGlass,_ as MixedPattern,J as MorphingPattern,ee as NoAnimation,se as NonInteractive,R as PentagonalPattern,F as RhombicPattern,Q as SlowMorphing,O as SmallTiles,oe as SpacedLayout,E as SquarePattern,U as TightSpacing,A as TriangularPattern,X as WideSpacing,Y as WithGrid,$s as __namedExportsOrder,Cs as default};
