import{r as o,b as Xe,j as e,m as P,d as le,ah as Ye}from"./iframe-BJUPYBdj.js";import{u as _e}from"./useMotionPreference-B9UZkK67.js";import{u as Fe}from"./a11y-Cl5jzkbw.js";import{c as He}from"./createGlassStyle-BfWnO-qv.js";import{u as Ue}from"./soundDesign-HxlLtGpL.js";import{O as Ne}from"./OptimizedGlassCore-n2ERVMDY.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-C60oOEa3.js";const We={containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0},K=o.forwardRef(({islands:l,connections:c=[],config:Le={},showMinimap:De=!0,showConnections:de=!0,showGrid:Pe=!1,showStats:ke=!0,enablePhysics:f=!1,enableDragging:ge=!0,enableResizing:ze=!1,enableZooming:Be=!0,zoomLevel:Oe=1,centerOnLoad:ue=!0,onIslandMove:me,onIslandResize:Je,onIslandSelect:he,onConnectionCreate:pe,className:Ge="",...Re},Ae)=>{const fe=Xe(),[p,N]=o.useState(l),[L,ee]=o.useState([]),[v,ye]=o.useState(null),[be,we]=o.useState(!1),[se,Ze]=o.useState({x:0,y:0}),[S,qe]=o.useState({x:0,y:0}),[d,xe]=o.useState(Oe),[Ke,ve]=o.useState(null),[I,Se]=o.useState(!1),[k,Ce]=o.useState(null),ne=o.useRef(null),ae=o.useRef(null),z=o.useRef(),[u]=o.useState({...We,...Le});Fe("glass-island-layout");const{shouldAnimate:x}=_e(),{play:te}=Ue(),oe=o.useCallback(()=>{if(!u.enableAutoArrange)return;const n=l.map((s,t)=>{const a=t*.618*2*Math.PI,r=Math.sqrt(t+1)*u.islandSpacing;return{...s,x:Math.cos(a)*r+400,y:Math.sin(a)*r+400}});N(n)},[l,u]),Me=o.useCallback(()=>{if(!f)return;const n=p.map(s=>({...s,vx:0,vy:0,mass:s.width*s.height/1e4,fixed:s.pinned||!1}));ee(n)},[p,f]),je=o.useCallback(()=>{!f||L.length===0||ee(n=>{const s=n.map(t=>({...t}));for(let t=0;t<s.length;t++){const a=s[t];if(a.fixed)continue;let r=0,i=0;for(let C=0;C<s.length;C++){if(t===C)continue;const m=s[C],y=m.x+m.width/2-(a.x+a.width/2),M=m.y+m.height/2-(a.y+a.height/2),b=Math.sqrt(y*y+M*M);if(b>0){const j=u.repulsionStrength/(b*b);if(r-=y/b*j,i-=M/b*j,c.some(w=>w.from===a.id&&w.to===m.id||w.to===a.id&&w.from===m.id)){const w=u.gravityStrength*b;r+=y/b*w,i+=M/b*w}}}a.vx+=r/a.mass,a.vy+=i/a.mass,a.vx*=.95,a.vy*=.95,a.x+=a.vx*u.animationSpeed,a.y+=a.vy*u.animationSpeed,a.x<u.containerPadding&&(a.x=u.containerPadding,a.vx=0),a.y<u.containerPadding&&(a.y=u.containerPadding,a.vy=0)}return s})},[f,L,c,u]);o.useEffect(()=>{if(!f)return;const n=()=>{je(),z.current=requestAnimationFrame(n)};return z.current=requestAnimationFrame(n),()=>{z.current&&cancelAnimationFrame(z.current)}},[f,je]),o.useEffect(()=>{f&&L.length>0&&N(L)},[L,f]);const Ie=o.useCallback(()=>{if(!de||!ae.current)return;const n=ae.current,s=n.getContext("2d");s&&(s.clearRect(0,0,n.width,n.height),s.save(),s.scale(d,d),s.translate(S.x,S.y),c.forEach(t=>{const a=p.find(w=>w.id===t.from),r=p.find(w=>w.id===t.to);if(!a||!r)return;const i=a.x+a.width/2,C=a.y+a.height/2,m=r.x+r.width/2,y=r.y+r.height/2;s.strokeStyle=t.color||"var(--glass-bg-hover)",s.lineWidth=(t.strength||1)*2,t.type==="dashed"?s.setLineDash([5,5]):t.type==="dotted"?s.setLineDash([2,3]):s.setLineDash([]),s.beginPath(),s.moveTo(i,C);const M=(i+m)/2,b=Math.min(C,y)-Math.abs(m-i)/4;s.quadraticCurveTo(M,b,m,y),s.stroke();const j=Math.atan2(y-b,m-M),D=10;s.fillStyle=t.color||"var(--glass-border-hover)",s.beginPath(),s.moveTo(m,y),s.lineTo(m-D*Math.cos(j-Math.PI/6),y-D*Math.sin(j-Math.PI/6)),s.lineTo(m-D*Math.cos(j+Math.PI/6),y-D*Math.sin(j+Math.PI/6)),s.closePath(),s.fill()}),s.restore())},[de,c,p,d,S]),Ve=o.useCallback((n,s)=>{if(ge){if(we(!0),ye(s.id),Ze({x:n.clientX-s.x*d,y:n.clientY-s.y*d}),I){k?(pe?.(k,s.id),Ce(null),Se(!1),te("connect")):Ce(s.id);return}he?.(s),te("select")}},[ge,d,I,k,pe,he,te]),re=o.useCallback(n=>{if(!be||!v)return;const s=(n.clientX-se.x)/d,t=(n.clientY-se.y)/d;N(r=>r.map(i=>i.id===v?{...i,x:s,y:t}:i)),f&&ee(r=>r.map(i=>i.id===v?{...i,x:s,y:t,vx:0,vy:0}:i));const a=p.find(r=>r.id===v);a&&me?.(a,s,t)},[be,v,se,d,f,p,me]),ie=o.useCallback(()=>{we(!1),ye(null),ve(null)},[]);o.useEffect(()=>{if(ue&&p.length>0&&ne.current){const n=p.reduce((r,i)=>({minX:Math.min(r.minX,i.x),minY:Math.min(r.minY,i.y),maxX:Math.max(r.maxX,i.x+i.width),maxY:Math.max(r.maxY,i.y+i.height)}),{minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}),s=(n.minX+n.maxX)/2,t=(n.minY+n.maxY)/2,a=ne.current.getBoundingClientRect();qe({x:a.width/2-s*d,y:a.height/2-t*d})}},[ue,p,d]),o.useEffect(()=>{N(l),u.enableAutoArrange&&oe()},[l,oe,u.enableAutoArrange]),o.useEffect(()=>{Me()},[Me]),o.useEffect(()=>{Ie()},[Ie]),o.useEffect(()=>(document.addEventListener("mousemove",re),document.addEventListener("mouseup",ie),()=>{document.removeEventListener("mousemove",re),document.removeEventListener("mouseup",ie)}),[re,ie]);const Te=()=>e.jsxs("div",{className:"glass-absolute glass-top-4 glass-right-4 glass-w-50 glass-h-38 glass-surface-dark/50 glass-border glass-border-white/20 glass-radius-lg glass-p-2",children:[e.jsx("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Overview"}),e.jsxs("div",{className:"glass-relative glass-surface-dark/30 glass-radius",style:{width:200,height:150},children:[p.map(a=>e.jsx("div",{className:`absolute rounded ${v===a.id?"bg-blue-400":"bg-white/40"}`,style:{left:a.x*.1,top:a.y*.1,width:Math.max(2,a.width*.1),height:Math.max(2,a.height*.1)}},`mini-${a.id}`)),e.jsx("div",{className:"glass-absolute glass-border glass-border-blue glass-pointer-events-none",style:{left:-S.x*.1/d,top:-S.y*.1/d,width:200*.1/d,height:150*.1/d}})]})]}),Ee=()=>e.jsx("div",{className:`
        absolute bottom-4 left-4 p-3 rounded-lg border border-white/10
        ${He({blur:"sm",opacity:.8}).background}
      `,children:e.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-90 glass-space-y-1",children:[e.jsxs("div",{children:["Islands: ",p.length]}),e.jsxs("div",{children:["Connections: ",c.length]}),e.jsxs("div",{children:["Zoom: ",Math.round(d*100),"%"]}),f&&e.jsx("div",{children:"Physics: ON"})]})}),$e=()=>e.jsxs("div",{className:"glass-absolute glass-top-4 glass-left-4 glass-flex glass-flex-col glass-space-y-2",children:[e.jsx(P.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>xe(n=>Math.min(3,n*1.2)),children:"🔍+"}),e.jsx(P.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>xe(n=>Math.max(.2,n/1.2)),children:"🔍-"}),e.jsx(P.button,{className:`p-2 border border-white/20 ${Ye.lg} text-white transition-colors glass-focus glass-touch-target glass-contrast-guard ${I?"bg-blue-500/50":"bg-white/10 hover:bg-white/20"}`,whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>Se(!I),children:"🔗"}),e.jsx(P.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:oe,children:"⚡"})]});return e.jsxs(Ne,{ref:Ae,variant:"frosted",className:`relative overflow-hidden ${Ge}`,style:{width:"min(1120px, calc(100vw - 48px))",maxWidth:"100%",height:"600px"},...Re,children:[e.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-right-0 glass-p-4 glass-z-10",children:e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Island Layout"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Floating content islands with connections"})]}),I&&e.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-blue/20 glass-border glass-border-blue/50 glass-radius-lg glass-text-secondary glass-text-sm",children:k?"Select target island":"Select source island"})]})}),e.jsxs("div",{ref:ne,className:"glass-absolute glass-inset-0 glass-overflow-hidden glass-cursor-move",style:{transform:`scale(${d}) translate(${S.x}px, ${S.y}px)`,transformOrigin:"0 0"},children:[Pe&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-10",style:{backgroundImage:`
                  linear-gradient(var(--glass-bg-default) 1px, transparent 1px),
                  linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)
                `,backgroundSize:"50px 50px"}}),e.jsx("canvas",{ref:ae,"data-glass-overlay":"true",className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:2e3,height:2e3}),p.map((n,s)=>e.jsx(P.div,{className:`absolute cursor-pointer transition-all duration-[${le.DURATION.fast}ms] ${v===n.id?"ring-2 ring-blue-400":""} ${n.minimized?"opacity-50":""}`,style:{left:n.x,top:n.y,width:n.width,height:n.minimized?40:n.height,zIndex:n.zIndex||(v===n.id?1e3:s)},initial:x?{opacity:0,scale:.8}:!1,animate:fe?{}:{opacity:1,scale:1},transition:fe?{duration:0}:{duration:le.DURATION.normal/1e3},onMouseDown:t=>Ve(t,n),children:e.jsxs(Ne,{variant:"frosted",className:`w-full h-full p-4 hover:bg-white/10 transition-all duration-[${le.DURATION.fast}ms] ${n.pinned?"border-yellow-400/50":""} ${I?"hover:border-blue-400":""}`,children:[!n.minimized&&n.content,e.jsxs("div",{className:"glass-absolute glass-top-2 glass-right-2 glass-flex glass-space-x-1 glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity",children:[n.category&&e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-dark/30 glass-text-primary-opacity-70 glass-radius glass-text-xs",children:n.category}),e.jsx("button",{onClick:t=>{t.stopPropagation(),N(a=>a.map(r=>r.id===n.id?{...r,minimized:!r.minimized}:r))},className:"glass-w-6 glass-h-6 glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius glass-text-primary-glass-opacity-80 glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:n.minimized?"□":"_"})]}),ze&&!n.minimized&&e.jsx("div",{className:"glass-absolute glass-bottom-0 glass-right-0 glass-w-4 glass-h-4 glass-surface-subtle/20 glass-cursor-se-resize glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity",onMouseDown:t=>{t.stopPropagation(),ve(n.id)},children:"⋮⋮"})]})},n.id))]}),e.jsx($e,{}),De&&e.jsx(Te,{}),ke&&e.jsx(Ee,{})]})});K.displayName="GlassIslandLayout";try{K.displayName="GlassIslandLayout",K.__docgenInfo={description:"",displayName:"GlassIslandLayout",props:{islands:{defaultValue:null,description:"",name:"islands",required:!0,type:{name:"Island[]"}},connections:{defaultValue:{value:"[]"},description:"",name:"connections",required:!1,type:{name:"IslandConnection[] | undefined"}},config:{defaultValue:{value:"{}"},description:"",name:"config",required:!1,type:{name:"Partial<LayoutConfig> | undefined"}},showMinimap:{defaultValue:{value:"true"},description:"",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},showConnections:{defaultValue:{value:"true"},description:"",name:"showConnections",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showStats:{defaultValue:{value:"true"},description:"",name:"showStats",required:!1,type:{name:"boolean | undefined"}},enablePhysics:{defaultValue:{value:"false"},description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableDragging:{defaultValue:{value:"true"},description:"",name:"enableDragging",required:!1,type:{name:"boolean | undefined"}},enableResizing:{defaultValue:{value:"false"},description:"",name:"enableResizing",required:!1,type:{name:"boolean | undefined"}},enableZooming:{defaultValue:{value:"true"},description:"",name:"enableZooming",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},centerOnLoad:{defaultValue:{value:"true"},description:"",name:"centerOnLoad",required:!1,type:{name:"boolean | undefined"}},onIslandMove:{defaultValue:null,description:"",name:"onIslandMove",required:!1,type:{name:"((island: Island, x: number, y: number) => void) | undefined"}},onIslandResize:{defaultValue:null,description:"",name:"onIslandResize",required:!1,type:{name:"((island: Island, width: number, height: number) => void) | undefined"}},onIslandSelect:{defaultValue:null,description:"",name:"onIslandSelect",required:!1,type:{name:"((island: Island) => void) | undefined"}},onConnectionCreate:{defaultValue:null,description:"",name:"onConnectionCreate",required:!1,type:{name:"((from: string, to: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const g=[{id:"dashboard",x:100,y:100,width:300,height:200,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Dashboard"}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Users: 1,234"}),e.jsx("div",{children:"Revenue: $5,678"}),e.jsx("div",{children:"Sessions: 2,345"}),e.jsx("div",{children:"Conversion: 12.3%"})]})]})},{id:"chat",x:450,y:150,width:250,height:180,category:"communication",draggable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Team Chat"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Alice: Hey team! 👋"}),e.jsx("div",{children:"Bob: Ready for the demo"}),e.jsx("div",{children:"Charlie: Looking good!"})]})]})},{id:"calendar",x:200,y:350,width:280,height:160,category:"productivity",pinned:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Calendar"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"9:00 AM - Team standup"}),e.jsx("div",{children:"2:00 PM - Client presentation"}),e.jsx("div",{children:"4:00 PM - Code review"})]})]})},{id:"metrics",x:520,y:380,width:200,height:150,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Metrics"}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-green glass-h-2 glass-radius-full",style:{width:"75%"}})}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-blue glass-h-2 glass-radius-full",style:{width:"60%"}})})]})]})},{id:"tasks",x:50,y:550,width:320,height:140,category:"productivity",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Tasks"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"✅ Update documentation"}),e.jsx("div",{children:"🔄 Review pull requests"}),e.jsx("div",{children:"⏳ Deploy to staging"})]})]})},{id:"notes",x:750,y:200,width:180,height:220,category:"notes",resizable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Notes"}),e.jsxs("div",{className:"glass-text-sm glass-text-primary/70 space-y-1",children:[e.jsx("div",{children:"• Feature ideas"}),e.jsx("div",{children:"• Bug reports"}),e.jsx("div",{children:"• Meeting notes"}),e.jsx("div",{children:"• Architecture thoughts"})]})]})}],h=[{from:"dashboard",to:"metrics",type:"solid",color:"var(--glass-color-primary-light)",strength:1},{from:"chat",to:"tasks",type:"dashed",color:"var(--glass-color-success-light)",strength:.8},{from:"calendar",to:"tasks",type:"dotted",color:"var(--glass-color-warning-light)",strength:.6},{from:"metrics",to:"notes",type:"animated",color:"var(--glass-color-danger-light)",strength:.5}],ce=g.slice(0,3),Q=[...g,{id:"reports",x:400,y:600,width:250,height:160,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Reports"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"Monthly performance analysis and insights"})]})},{id:"settings",x:800,y:500,width:200,height:120,category:"system",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Settings"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"System configuration"})]})}],is={title:"Surfaces/App Shells + Layout/Glass Island Layout",component:K,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showMinimap:{control:"boolean"},showConnections:{control:"boolean"},showGrid:{control:"boolean"},showStats:{control:"boolean"},enablePhysics:{control:"boolean"},enableDragging:{control:"boolean"},enableResizing:{control:"boolean"},enableZooming:{control:"boolean"},zoomLevel:{control:{type:"range",min:.2,max:3,step:.1}},centerOnLoad:{control:"boolean"}}},O={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,zoomLevel:1,centerOnLoad:!0,config:{containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0}}},G={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{gravityStrength:.05,repulsionStrength:150,enablePhysics:!0,animationSpeed:.8}}},R={args:{islands:ce,connections:[],showMinimap:!1,showConnections:!1,showGrid:!1,showStats:!1,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!1,centerOnLoad:!0}},A={args:{islands:g,connections:h,showMinimap:!1,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0}},Z={args:{islands:ce,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},q={args:{islands:Q,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{enableAutoArrange:!0,islandSpacing:120}}},V={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableZooming:!0,zoomLevel:1.5,centerOnLoad:!0}},T={args:{islands:Q,connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableZooming:!0,zoomLevel:.6,centerOnLoad:!0}},E={args:{islands:g,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0}},$={args:{islands:Q,connections:[...h,{from:"reports",to:"dashboard",type:"solid",color:"#8b5cf6",strength:1},{from:"settings",to:"notes",type:"dashed",color:"#06b6d4",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:80,gravityStrength:.03,repulsionStrength:120}}},X={args:{islands:ce,connections:h.slice(0,2),showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:200,containerPadding:100}}},Y={args:{islands:g,connections:[],showMinimap:!0,showConnections:!1,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},_={args:{islands:g,connections:[...h,{from:"dashboard",to:"chat",type:"solid",color:"var(--glass-color-success)",strength:.8},{from:"calendar",to:"notes",type:"dotted",color:"var(--glass-color-warning)",strength:.6},{from:"tasks",to:"notes",type:"animated",color:"var(--glass-color-danger)",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0}},F={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0,config:{enablePhysics:!0,gravityStrength:.08,repulsionStrength:200,animationSpeed:.6,enableCollisionDetection:!0}}},H={args:{islands:g.map(l=>({...l,pinned:l.id==="dashboard"||l.id==="calendar"})),connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0}},U={args:{islands:g.map(l=>({...l,minimized:l.id==="notes"||l.id==="metrics"})),connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableDragging:!0,centerOnLoad:!0}},W={args:{islands:g,connections:h.filter(l=>g.find(c=>c.id===l.from)?.category==="analytics"&&g.find(c=>c.id===l.to)?.category==="analytics"||g.find(c=>c.id===l.from)?.category==="productivity"&&g.find(c=>c.id===l.to)?.category==="productivity"),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableDragging:!0,centerOnLoad:!0}},B={args:{islands:[...Q,{id:"monitoring",x:150,y:800,width:300,height:180,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"System Monitoring"})})},{id:"logs",x:600,y:750,width:250,height:160,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"Log Viewer"})})}],connections:[...h,{from:"monitoring",to:"logs",type:"solid",color:"#ec4899",strength:.9}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,zoomLevel:.7,centerOnLoad:!0}},J={args:{islands:Array.from({length:20},(l,c)=>({id:`island-${c}`,x:100+c%5*200,y:100+Math.floor(c/5)*150,width:180,height:120,category:c%2===0?"system":"data",content:e.jsxs("div",{className:"glass-p-4",children:[e.jsxs("h4",{className:"glass-text-primary/90",children:["Island ",c+1]}),e.jsx("p",{className:"glass-text-primary/60 glass-text-sm",children:"Test content"})]})})),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableZooming:!0,zoomLevel:.5,centerOnLoad:!0}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    zoomLevel: 1.0,
    centerOnLoad: true,
    config: {
      containerPadding: 50,
      islandSpacing: 100,
      connectionDistance: 300,
      animationSpeed: 1.0,
      gravityStrength: 0.02,
      repulsionStrength: 100,
      enablePhysics: false,
      enableAutoArrange: false,
      enableCollisionDetection: true
    }
  }
}`,...O.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      gravityStrength: 0.05,
      repulsionStrength: 150,
      enablePhysics: true,
      animationSpeed: 0.8
    }
  }
}`,...G.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    islands: smallIslands,
    connections: [],
    showMinimap: false,
    showConnections: false,
    showGrid: false,
    showStats: false,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: false,
    centerOnLoad: true
  }
}`,...R.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: false,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true
  }
}`,...A.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    islands: smallIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: true,
    enableZooming: true,
    centerOnLoad: true
  }
}`,...Z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    islands: largeIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: false,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      enableAutoArrange: true,
      islandSpacing: 120
    }
  }
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enableZooming: true,
    zoomLevel: 1.5,
    centerOnLoad: true
  }
}`,...V.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    islands: largeIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enableZooming: true,
    zoomLevel: 0.6,
    centerOnLoad: true
  }
}`,...T.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: true,
    showStats: true,
    enableDragging: true,
    enableZooming: true,
    centerOnLoad: true
  }
}`,...E.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    islands: largeIslands,
    connections: [...mockConnections, {
      from: 'reports',
      to: 'dashboard',
      type: 'solid',
      color: '#8b5cf6',
      strength: 1
    }, {
      from: 'settings',
      to: 'notes',
      type: 'dashed',
      color: '#06b6d4',
      strength: 0.7
    }],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    centerOnLoad: true,
    config: {
      islandSpacing: 80,
      gravityStrength: 0.03,
      repulsionStrength: 120
    }
  }
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    islands: smallIslands,
    connections: mockConnections.slice(0, 2),
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    centerOnLoad: true,
    config: {
      islandSpacing: 200,
      containerPadding: 100
    }
  }
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: [],
    showMinimap: true,
    showConnections: false,
    showGrid: false,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableResizing: true,
    enableZooming: true,
    centerOnLoad: true
  }
}`,...Y.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: [...mockConnections, {
      from: 'dashboard',
      to: 'chat',
      type: 'solid',
      color: 'var(--glass-color-success)',
      strength: 0.8
    }, {
      from: 'calendar',
      to: 'notes',
      type: 'dotted',
      color: 'var(--glass-color-warning)',
      strength: 0.6
    }, {
      from: 'tasks',
      to: 'notes',
      type: 'animated',
      color: 'var(--glass-color-danger)',
      strength: 0.7
    }],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    centerOnLoad: true
  }
}`,..._.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableZooming: true,
    centerOnLoad: true,
    config: {
      enablePhysics: true,
      gravityStrength: 0.08,
      repulsionStrength: 200,
      animationSpeed: 0.6,
      enableCollisionDetection: true
    }
  }
}`,...F.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands.map(island => ({
      ...island,
      pinned: island.id === 'dashboard' || island.id === 'calendar'
    })),
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    centerOnLoad: true
  }
}`,...H.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands.map(island => ({
      ...island,
      minimized: island.id === 'notes' || island.id === 'metrics'
    })),
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true
  }
}`,...U.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections.filter(conn => mockIslands.find(i => i.id === conn.from)?.category === 'analytics' && mockIslands.find(i => i.id === conn.to)?.category === 'analytics' || mockIslands.find(i => i.id === conn.from)?.category === 'productivity' && mockIslands.find(i => i.id === conn.to)?.category === 'productivity'),
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true
  }
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    islands: [...largeIslands, {
      id: 'monitoring',
      x: 150,
      y: 800,
      width: 300,
      height: 180,
      category: 'system',
      content: <div className="glass-p-4"><h3 className="glass-text-primary/90">System Monitoring</h3></div>
    }, {
      id: 'logs',
      x: 600,
      y: 750,
      width: 250,
      height: 160,
      category: 'system',
      content: <div className="glass-p-4"><h3 className="glass-text-primary/90">Log Viewer</h3></div>
    }],
    connections: [...mockConnections, {
      from: 'monitoring',
      to: 'logs',
      type: 'solid',
      color: '#ec4899',
      strength: 0.9
    }],
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: true,
    enableDragging: true,
    enableZooming: true,
    zoomLevel: 0.7,
    centerOnLoad: true
  }
}`,...B.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    islands: Array.from({
      length: 20
    }, (_, i) => ({
      id: \`island-\${i}\`,
      x: 100 + i % 5 * 200,
      y: 100 + Math.floor(i / 5) * 150,
      width: 180,
      height: 120,
      category: i % 2 === 0 ? 'system' : 'data',
      content: <div className="glass-p-4">
          <h4 className="glass-text-primary/90">Island {i + 1}</h4>
          <p className="glass-text-primary/60 glass-text-sm">Test content</p>
        </div>
    })),
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enablePhysics: false,
    enableDragging: true,
    enableZooming: true,
    zoomLevel: 0.5,
    centerOnLoad: true
  }
}`,...J.parameters?.docs?.source}}};const ls=["Default","PhysicsEnabled","MinimalView","ConnectionFocus","DragAndResize","AutoArranged","ZoomedIn","ZoomedOut","GridEnabled","DenseLayout","SparseLayout","NoConnections","AllConnections","PhysicsWithConnections","PinnedIslands","MinimizedIslands","CategorizedIslands","LargeScale","PerformanceTest"];export{_ as AllConnections,q as AutoArranged,W as CategorizedIslands,A as ConnectionFocus,O as Default,$ as DenseLayout,Z as DragAndResize,E as GridEnabled,B as LargeScale,R as MinimalView,U as MinimizedIslands,Y as NoConnections,J as PerformanceTest,G as PhysicsEnabled,F as PhysicsWithConnections,H as PinnedIslands,X as SparseLayout,V as ZoomedIn,T as ZoomedOut,ls as __namedExportsOrder,is as default};
