import{r as b,b as aa,j as a,d as sa,m as na}from"./iframe-RsoZoStf.js";import{f as We}from"./index-DdjpOZjl.js";import{b2 as He,a7 as je,S as Me,az as qe,m as Pe,as as Ce,H as $e,bi as Ne,F as ta,aq as ra,bo as ia,q as ke,Z as oa,bp as la,ar as ca,bd as da,bq as ga,aR as Ie,av as Le,br as pa,D as ua,bs as ha}from"./components-DwI53NlZ.js";import{u as ma}from"./useMotionPreference-CDEdIw_0.js";import{u as fa}from"./a11y-WSL2JlLl.js";import{u as xa}from"./soundDesign-BSpuEzT6.js";import{O as ya}from"./OptimizedGlassCore-IzbAukgr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./deviceCapabilities-CB0YcTGX.js";function ba(n){if(!n)return null;const o=n.trim(),x=o.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(x){const m=x[1],g=m.length===3?m.split("").map(M=>M+M).join(""):m;return{r:parseInt(g.slice(0,2),16),g:parseInt(g.slice(2,4),16),b:parseInt(g.slice(4,6),16)}}const h=o.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i);return h?{r:Number(h[1]),g:Number(h[2]),b:Number(h[3])}:null}function va(n){const o=ba(n);if(!o)return"var(--glass-theme-text, var(--glass-text-primary))";const x=m=>{const g=m/255;return g<=.03928?g/12.92:Math.pow((g+.055)/1.055,2.4)};return .2126*x(o.r)+.7152*x(o.g)+.0722*x(o.b)>.48?"rgba(8,13,24,0.92)":"rgba(248,250,252,0.96)"}const $=b.forwardRef(({tiles:n=[],tessellationType:o="hexagonal",containerWidth:x=800,containerHeight:h=600,tileSize:m=60,spacing:g=2,animatePattern:M=!0,morphPattern:q=!1,morphSpeed:fe=2e3,showGrid:Ve=!1,interactive:ue=!0,onTileClick:xe,onTileHover:ye,glassConfig:Ee={},soundEnabled:N=!0,compact:Ae=!1,contained:De=!1,maxHeight:k,height:I,className:Re="",style:Fe={},..._e},Be)=>{const[be,Oe]=b.useState(null),[ve,Te]=b.useState(null),[he,Ze]=b.useState(0),Ue=b.useRef(null),L=b.useRef(),{prefersReducedMotion:me}=ma(),Xe=fa(),{play:G}=xa(),T=Ae||De,v=T?Math.min(x,320):x,y=typeof(k??I)=="number"?k??I:T?Math.min(h,220):h,W=T?Math.min(m,36):m,Se=T?Math.max(g,6):g,H=k??I??y;b.useEffect(()=>{if(!q||me)return;const t=Date.now(),l=()=>{const r=(Date.now()-t)/fe%1;Ze(r),L.current=requestAnimationFrame(l)};return L.current=requestAnimationFrame(l),()=>{L.current&&cancelAnimationFrame(L.current)}},[q,fe,me]);const we=b.useCallback(()=>{const t=new Map,l=W+Se;switch(o){case"triangular":{const s=l*Math.sqrt(3)/2;let r=0;for(let e=0;e*s<y&&r<n.length;e++){const i=Math.floor(v/l)+e%2,d=e%2?l/2:0;for(let p=0;p<i&&r<n.length;p++){const c=p*l+d,S=e*s,u=e%2?180:0;t.set(n[r].id,{x:c,y:S,rotation:u,scale:1}),r++}}break}case"square":{let s=0;const r=Math.floor(v/l),e=Math.floor(y/l);for(let i=0;i<e&&s<n.length;i++)for(let d=0;d<r&&s<n.length;d++){const p=d*l,c=i*l;t.set(n[s].id,{x:p,y:c,rotation:0,scale:1}),s++}break}case"hexagonal":{const s=l*Math.sqrt(3),r=l*2;let e=0;for(let i=0;i*r*.75<y&&e<n.length;i++){const d=Math.floor(v/s)+1,p=i%2?s/2:0;for(let c=0;c<d&&e<n.length;c++){const S=c*s+p,u=i*r*.75;t.set(n[e].id,{x:S,y:u,rotation:0,scale:1}),e++}}break}case"rhombic":{const s=l*1.5,r=l;let e=0;for(let i=0;i*r<y&&e<n.length;i++){const d=Math.floor(v/s)+1,p=i%2?s/2:0;for(let c=0;c<d&&e<n.length;c++){const S=c*s+p,u=i*r,f=(i+c)%2?45:-45;t.set(n[e].id,{x:S,y:u,rotation:f,scale:1}),e++}}break}case"pentagonal":{const s=l*.8;let r=0;for(let e=0;e*s<y&&r<n.length;e++){const i=Math.floor(v/s)+1,d=e%2?s/2:0,p=e%3?s/3:0;for(let c=0;c<i&&r<n.length;c++){const S=c*s+d,u=e*s+p,f=e*c*72%360;t.set(n[r].id,{x:S,y:u,rotation:f,scale:1}),r++}}break}case"mixed":{let s=0;const r=l*.7;for(let e=0;e<y-r&&s<n.length;e+=r)for(let i=0;i<v-r&&s<n.length;i+=r){const d=Math.sin(i*.01+e*.01+he*Math.PI*2),p=.8+d*.4,c=d*60;t.set(n[s].id,{x:i+d*20,y:e+d*20,rotation:c,scale:p}),s++}break}}return t},[o,n,W,Se,v,y,he]),Ye=b.useMemo(()=>we(),[we]),V=Math.max(W,24),Je=`${-V} ${-V} ${v+V*2} ${y+V*2}`,Ke=b.useCallback(t=>{Te(t.id),xe?.(t),N&&G("tap"),setTimeout(()=>Te(null),aa.DURATION.normal)},[xe,N,G]),ze=b.useCallback(t=>{Oe(t?.id||null),ye?.(t),N&&t&&G("hover")},[ye,N,G]),Qe=(t,l)=>{const s=be===t.id,r=ve===t.id,e=W*l.scale,i=t.color??(s||r?"rgba(255,255,255,0.34)":"rgba(255,255,255,0.22)"),d=s||r?"rgba(248,250,252,0.72)":"rgba(248,250,252,0.36)",p=va(i),c={className:"transition-all cursor-pointer",fill:i,stroke:d,strokeWidth:1.5},S={triangle:`M ${e/2} 0 L ${e} ${e*Math.sqrt(3)/2} L 0 ${e*Math.sqrt(3)/2} Z`,square:`M 0 0 L ${e} 0 L ${e} ${e} L 0 ${e} Z`,hexagon:(()=>{const u=[];for(let f=0;f<6;f++){const z=f*Math.PI/3,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);u.push(`${P} ${C}`)}return`M ${u.join(" L ")} Z`})(),rhombus:`M ${e/2} 0 L ${e} ${e/2} L ${e/2} ${e} L 0 ${e/2} Z`,pentagon:(()=>{const u=[];for(let f=0;f<5;f++){const z=f*2*Math.PI/5-Math.PI/2,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);u.push(`${P} ${C}`)}return`M ${u.join(" L ")} Z`})(),octagon:(()=>{const u=[];for(let f=0;f<8;f++){const z=f*Math.PI/4,P=e/2+e/2*Math.cos(z),C=e/2+e/2*Math.sin(z);u.push(`${P} ${C}`)}return`M ${u.join(" L ")} Z`})()};return a.jsxs("g",{children:[a.jsx("path",{d:S[t.shape]||S.hexagon,...c}),a.jsx("foreignObject",{x:"0",y:"0",width:e,height:e,className:"glass-pointer-events-none",children:a.jsx("div",{className:"glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center glass-text-xs",style:{color:p,fontWeight:650,textShadow:p.startsWith("rgba(8")?"0 1px 2px rgba(255,255,255,0.18)":"0 1px 2px rgba(0,0,0,0.45)"},children:t.content})})]})},ea=()=>({hidden:{scale:0,opacity:0,rotate:-180},visible:t=>({scale:1,opacity:1,rotate:0,transition:{type:"spring",tension:300,friction:25,delay:me?0:t*.02}}),hover:{scale:1.05,transition:{type:"spring",tension:400,friction:20}},selected:{scale:1.1,transition:{type:"spring",tension:500,friction:15}}});return a.jsxs(ya,{ref:Be,className:`glass-tessellation relative overflow-auto ${Re}`,style:{width:T?"100%":`min(${v}px, calc(100vw - 48px))`,maxWidth:"100%",height:typeof H=="number"?`${H}px`:H,maxHeight:T||k!==void 0||I!==void 0?typeof H=="number"?`${H}px`:H:void 0,minWidth:0,overflowX:"hidden",overflowY:T?"hidden":"auto",boxSizing:"border-box",...Fe},glassConfig:{blur:10,opacity:.95,saturation:1.1,brightness:1.05,...Ee},role:"application","aria-label":`${o} tessellation pattern`,id:Xe,..._e,children:[a.jsxs("div",{ref:Ue,className:"glass-relative",style:{width:"100%",height:y,minWidth:0,minHeight:T?void 0:y,overflow:"visible"},children:[Ve&&a.jsx("div",{className:"glass-absolute glass-inset-0 glass-pointer-events-none",children:a.jsxs("svg",{width:v,height:y,viewBox:`0 0 ${v} ${y}`,children:[a.jsx("defs",{children:a.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:a.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"white",strokeWidth:"0.5",opacity:"0.2"})})}),a.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"})]})}),a.jsx("svg",{width:"100%",height:y,viewBox:Je,className:"glass-absolute glass-inset-0 glass-overflow-visible",style:{overflow:"visible"},children:a.jsx(sa,{children:n.map((t,l)=>{const s=Ye.get(t.id);if(!s)return null;const r=be===t.id,e=ve===t.id;return a.jsx(na.g,{custom:l,variants:ea(),initial:"hidden",animate:e?"selected":r?"hover":"visible",exit:"hidden",style:{transformOrigin:`${s.x+W/2}px ${s.y+W/2}px`},onMouseEnter:()=>ue&&ze(t),onMouseLeave:()=>ue&&ze(null),onClick:()=>ue&&Ke(t),children:a.jsx("g",{transform:`translate(${s.x}, ${s.y}) rotate(${s.rotation+(t.rotation||0)})`,children:Qe(t,s)})},t.id)})})})]}),!T&&a.jsxs("div",{className:"glass-absolute glass-bottom-4 glass-left-4 glass-flex glass-flex-col glass-gap-1 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:[a.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Pattern: ",o]}),a.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Tiles: ",n.length]}),a.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Size: ",m,"px"]}),q&&a.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:["Morph: ",Math.round(he*100),"%"]})]}),!T&&a.jsx("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-text-xs glass-text-primary-opacity-70","data-glass-overlay":"true",children:a.jsxs("div",{className:"glass-surface-dark/20 glass-px-2 glass-py-1 glass-radius glass-backdrop-blur-sm glass-contrast-guard",children:[o.charAt(0).toUpperCase()+o.slice(1)," ","Tessellation"]})})]})});$.displayName="GlassTessellation";try{$.displayName="GlassTessellation",$.__docgenInfo={description:"",displayName:"GlassTessellation",props:{tiles:{defaultValue:{value:"[]"},description:"",name:"tiles",required:!1,type:{name:"TessellationTile[]"}},tessellationType:{defaultValue:{value:"hexagonal"},description:"",name:"tessellationType",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"mixed"'},{value:'"square"'},{value:'"triangular"'},{value:'"hexagonal"'},{value:'"rhombic"'},{value:'"pentagonal"'}]}},containerWidth:{defaultValue:{value:"800"},description:"",name:"containerWidth",required:!1,type:{name:"number | undefined"}},containerHeight:{defaultValue:{value:"600"},description:"",name:"containerHeight",required:!1,type:{name:"number | undefined"}},tileSize:{defaultValue:{value:"60"},description:"",name:"tileSize",required:!1,type:{name:"number | undefined"}},spacing:{defaultValue:{value:"2"},description:"",name:"spacing",required:!1,type:{name:"number | undefined"}},animatePattern:{defaultValue:{value:"true"},description:"",name:"animatePattern",required:!1,type:{name:"boolean | undefined"}},morphPattern:{defaultValue:{value:"false"},description:"",name:"morphPattern",required:!1,type:{name:"boolean | undefined"}},morphSpeed:{defaultValue:{value:"2000"},description:"",name:"morphSpeed",required:!1,type:{name:"number | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},onTileClick:{defaultValue:null,description:"",name:"onTileClick",required:!1,type:{name:"((tile: TessellationTile) => void) | undefined"}},onTileHover:{defaultValue:null,description:"",name:"onTileHover",required:!1,type:{name:"((tile: TessellationTile | null) => void) | undefined"}},glassConfig:{defaultValue:{value:"{}"},description:"",name:"glassConfig",required:!1,type:{name:"{ blur?: number | undefined; opacity?: number | undefined; saturation?: number | undefined; brightness?: number | undefined; contrast?: number | undefined; } | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}const w=[{id:"home",content:a.jsx(He,{size:16}),shape:"hexagon",color:"rgba(255,255,255,.34)"},{id:"user",content:a.jsx(je,{size:14}),shape:"triangle",color:"rgba(236,240,244,.38)"},{id:"settings",content:a.jsx(Me,{size:14}),shape:"square",color:"rgba(255,255,255,.28)"},{id:"mail",content:a.jsx(qe,{size:12}),shape:"rhombus",color:"rgba(224,230,236,.40)"},{id:"search",content:a.jsx(Pe,{size:14}),shape:"pentagon",color:"rgba(255,255,255,.32)"},{id:"bell",content:a.jsx(Ce,{size:12}),shape:"hexagon",color:"rgba(232,237,242,.38)"},{id:"heart",content:a.jsx($e,{size:12}),shape:"triangle",color:"rgba(255,255,255,.26)"},{id:"share",content:a.jsx(Ne,{size:12}),shape:"square",color:"rgba(220,226,233,.40)"}],j=[{id:"fire",content:a.jsx(ta,{size:16}),shape:"triangle",color:"var(--glass-color-danger-dark)"},{id:"water",content:a.jsx(ra,{size:16}),shape:"hexagon",color:"hsl(var(--glass-color-info))"},{id:"air",content:a.jsx(ia,{size:16}),shape:"rhombus",color:"#7C3AED"},{id:"earth",content:a.jsx(ke,{size:16}),shape:"square",color:"var(--glass-color-success-dark)"},{id:"lightning",content:a.jsx(oa,{size:14}),shape:"triangle",color:"var(--glass-color-warning-light)"},{id:"ice",content:a.jsx(la,{size:14}),shape:"hexagon",color:"#67E8F9"},{id:"sun",content:a.jsx(ca,{size:16}),shape:"octagon",color:"hsl(var(--glass-color-warning))"},{id:"moon",content:a.jsx(da,{size:14}),shape:"pentagon",color:"#A78BFA"},{id:"cloud",content:a.jsx(ga,{size:14}),shape:"rhombus",color:"var(--glass-gray-400)"},{id:"star",content:a.jsx(Ie,{size:14}),shape:"pentagon",color:"#FCD34D"}],ge=[{id:"circle",content:a.jsx(Le,{size:16}),shape:"hexagon",color:"hsl(var(--glass-color-primary))"},{id:"triangle",content:a.jsx(pa,{size:16}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"square",content:a.jsx(ke,{size:16}),shape:"square",color:"hsl(var(--glass-color-success))"},{id:"diamond",content:a.jsx(ua,{size:16}),shape:"rhombus",color:"#8B5CF6"},{id:"hexagon",content:a.jsx(ha,{size:16}),shape:"hexagon",color:"#EC4899"}],Ge=[...Array.from({length:50},(n,o)=>{const x=["triangle","square","hexagon","rhombus","pentagon"],h=[He,je,Me,qe,Pe,Ce,$e,Ne,Ie,Le],m=["hsl(var(--glass-color-primary))","hsl(var(--glass-color-danger))","hsl(var(--glass-color-success))","hsl(var(--glass-color-warning))","#8B5CF6","#EC4899","#06B6D4","var(--glass-color-danger-dark)"],g=x[o%x.length],M=h[o%h.length],q=m[o%m.length];return{id:`tile-${o}`,content:a.jsx(M,{size:14}),shape:g,color:q,priority:Math.floor(Math.random()*10)}})],pe=[{id:"red",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-red glass-radius-full"}),shape:"triangle",color:"hsl(var(--glass-color-danger))"},{id:"blue",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-blue glass-radius-full"}),shape:"hexagon",color:"hsl(var(--glass-color-primary))"},{id:"green",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-green glass-radius-full"}),shape:"square",color:"hsl(var(--glass-color-success))"},{id:"yellow",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-yellow glass-radius-full"}),shape:"rhombus",color:"hsl(var(--glass-color-warning))"},{id:"purple",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"pentagon",color:"#8B5CF6"},{id:"pink",content:a.jsx("div",{className:"glass-w-4 glass-h-4 bg-pink-500 glass-radius-full"}),shape:"hexagon",color:"#EC4899"},{id:"cyan",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"triangle",color:"#06B6D4"},{id:"orange",content:a.jsx("div",{className:"glass-w-4 glass-h-4 glass-surface-primary glass-radius-full"}),shape:"square",color:"#EA580C"}],$a={title:"Surfaces/App Shells + Layout/Glass Tessellation",component:$,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[n=>a.jsx("div",{className:"glass-flex glass-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:a.jsx(n,{})})],tags:["autodocs"],argTypes:{tessellationType:{control:{type:"select"},options:["triangular","square","hexagonal","rhombic","pentagonal","mixed"]},containerWidth:{control:{type:"range",min:400,max:1200,step:50}},containerHeight:{control:{type:"range",min:300,max:800,step:50}},tileSize:{control:{type:"range",min:30,max:120,step:10}},spacing:{control:{type:"range",min:0,max:20,step:2}},animatePattern:{control:"boolean"},morphPattern:{control:"boolean"},morphSpeed:{control:{type:"range",min:1e3,max:5e3,step:500}},showGrid:{control:"boolean"},interactive:{control:"boolean"},soundEnabled:{control:"boolean"}}},Ta=n=>{const[o,x]=b.useState(typeof window>"u"?800:window.innerWidth);b.useEffect(()=>{const g=()=>x(window.innerWidth);return g(),window.addEventListener("resize",g),()=>window.removeEventListener("resize",g)},[]);const h=o<=480,m=Math.min(n.containerWidth??800,Math.max(240,o-(h?64:112)));return a.jsx($,{...n,containerWidth:m,containerHeight:h?420:n.containerHeight,tileSize:h?42:n.tileSize,spacing:Math.max(8,n.spacing??8),animatePattern:!1,style:{width:m,maxWidth:"100%"}})},E={render:n=>a.jsx(Ta,{...n}),args:{tiles:w,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:60,spacing:8,animatePattern:!0,morphPattern:!1,showGrid:!1,interactive:!0,soundEnabled:!0}},A={args:{tiles:w,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:70,spacing:4}},D={args:{tiles:w,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:80,spacing:6}},R={args:{tiles:j,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:75,spacing:4}},F={args:{tiles:ge,tessellationType:"rhombic",containerWidth:800,containerHeight:600,tileSize:65,spacing:8}},_={args:{tiles:pe,tessellationType:"pentagonal",containerWidth:800,containerHeight:600,tileSize:55,spacing:6}},B={args:{tiles:j,tessellationType:"mixed",containerWidth:800,containerHeight:600,tileSize:60,spacing:4}},O={args:{tiles:Ge,tessellationType:"hexagonal",containerWidth:1e3,containerHeight:800,tileSize:50,spacing:2,soundEnabled:!1}},Z={args:{tiles:Ge,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:35,spacing:2}},U={args:{tiles:w,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,tileSize:100,spacing:8}},X={args:{tiles:pe,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:60,spacing:0}},Y={args:{tiles:ge,tessellationType:"square",containerWidth:800,containerHeight:600,tileSize:70,spacing:15}},J={args:{tiles:w,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,showGrid:!0}},K={args:{tiles:j,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:3e3}},Q={args:{tiles:pe,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:1500}},ee={args:{tiles:ge,tessellationType:"mixed",containerWidth:800,containerHeight:600,morphPattern:!0,morphSpeed:5e3}},ae={args:{tiles:w,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,animatePattern:!1}},se={args:{tiles:w,tessellationType:"square",containerWidth:800,containerHeight:600,interactive:!1}},ne={args:{tiles:j,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:80,spacing:6,morphPattern:!0,morphSpeed:4e3}},te={args:{tiles:ge,tessellationType:"rhombic",containerWidth:700,containerHeight:500,tileSize:90,spacing:10}},re={args:{tiles:pe,tessellationType:"triangular",containerWidth:800,containerHeight:600,tileSize:65,spacing:4,showGrid:!0}},ie={args:{tiles:w,tessellationType:"hexagonal",containerWidth:600,containerHeight:400,tileSize:45,spacing:1}},oe={args:{tiles:j,tessellationType:"pentagonal",containerWidth:1e3,containerHeight:700,tileSize:80,spacing:12}},le={args:{tiles:w,tessellationType:"hexagonal",containerWidth:800,containerHeight:600,glassConfig:{blur:20,opacity:.8,saturation:1.3,brightness:1.2,contrast:1.1}}},ce={args:{tiles:w,tessellationType:"square",containerWidth:800,containerHeight:600,glassConfig:{blur:5,opacity:.98,saturation:1,brightness:1,contrast:1}}},de={args:{tiles:j,tessellationType:"hexagonal",containerWidth:900,containerHeight:700,tileSize:70,morphPattern:!0,onTileClick:We(),onTileHover:We()}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <ResponsiveTessellation {...args} />,
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 8,
    animatePattern: true,
    morphPattern: false,
    showGrid: false,
    interactive: true,
    soundEnabled: true
  }
}`,...E.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 4
  }
}`,...A.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 80,
    spacing: 6
  }
}`,...D.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'hexagonal',
    containerWidth: 900,
    containerHeight: 700,
    tileSize: 75,
    spacing: 4
  }
}`,...R.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 8
  }
}`,...F.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'pentagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 55,
    spacing: 6
  }
}`,..._.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 4
  }
}`,...B.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'hexagonal',
    containerWidth: 1000,
    containerHeight: 800,
    tileSize: 50,
    spacing: 2,
    soundEnabled: false
  }
}`,...O.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: manyTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 35,
    spacing: 2
  }
}`,...Z.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 100,
    spacing: 8
  }
}`,...U.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 60,
    spacing: 0
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 70,
    spacing: 15
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    showGrid: true
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 3000
  }
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 1500
  }
}`,...Q.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'mixed',
    containerWidth: 800,
    containerHeight: 600,
    morphPattern: true,
    morphSpeed: 5000
  }
}`,...ee.parameters?.docs?.source}}};ae.parameters={...ae.parameters,docs:{...ae.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 800,
    containerHeight: 600,
    animatePattern: false
  }
}`,...ae.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'square',
    containerWidth: 800,
    containerHeight: 600,
    interactive: false
  }
}`,...se.parameters?.docs?.source}}};ne.parameters={...ne.parameters,docs:{...ne.parameters?.docs,source:{originalSource:`{
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
}`,...ne.parameters?.docs?.source}}};te.parameters={...te.parameters,docs:{...te.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: shapeTiles,
    tessellationType: 'rhombic',
    containerWidth: 700,
    containerHeight: 500,
    tileSize: 90,
    spacing: 10
  }
}`,...te.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: colorCodedTiles,
    tessellationType: 'triangular',
    containerWidth: 800,
    containerHeight: 600,
    tileSize: 65,
    spacing: 4,
    showGrid: true
  }
}`,...re.parameters?.docs?.source}}};ie.parameters={...ie.parameters,docs:{...ie.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: basicTiles,
    tessellationType: 'hexagonal',
    containerWidth: 600,
    containerHeight: 400,
    tileSize: 45,
    spacing: 1
  }
}`,...ie.parameters?.docs?.source}}};oe.parameters={...oe.parameters,docs:{...oe.parameters?.docs,source:{originalSource:`{
  args: {
    tiles: elementalTiles,
    tessellationType: 'pentagonal',
    containerWidth: 1000,
    containerHeight: 700,
    tileSize: 80,
    spacing: 12
  }
}`,...oe.parameters?.docs?.source}}};le.parameters={...le.parameters,docs:{...le.parameters?.docs,source:{originalSource:`{
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
}`,...le.parameters?.docs?.source}}};ce.parameters={...ce.parameters,docs:{...ce.parameters?.docs,source:{originalSource:`{
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
}`,...ce.parameters?.docs?.source}}};de.parameters={...de.parameters,docs:{...de.parameters?.docs,source:{originalSource:`{
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
}`,...de.parameters?.docs?.source}}};const Na=["Default","TriangularPattern","SquarePattern","HexagonalPattern","RhombicPattern","PentagonalPattern","MixedPattern","LargePattern","SmallTiles","LargeTiles","TightSpacing","WideSpacing","WithGrid","MorphingPattern","FastMorphing","SlowMorphing","NoAnimation","NonInteractive","ElementalTheme","GeometricShapes","ColorSpectrum","CompactLayout","SpacedLayout","CustomGlass","MinimalGlass","InteractiveDemo"];export{re as ColorSpectrum,ie as CompactLayout,le as CustomGlass,E as Default,ne as ElementalTheme,Q as FastMorphing,te as GeometricShapes,R as HexagonalPattern,de as InteractiveDemo,O as LargePattern,U as LargeTiles,ce as MinimalGlass,B as MixedPattern,K as MorphingPattern,ae as NoAnimation,se as NonInteractive,_ as PentagonalPattern,F as RhombicPattern,ee as SlowMorphing,Z as SmallTiles,oe as SpacedLayout,D as SquarePattern,X as TightSpacing,A as TriangularPattern,Y as WideSpacing,J as WithGrid,Na as __namedExportsOrder,$a as default};
