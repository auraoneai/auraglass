import{r as o,b as ss,j as e,m as k,d as de,ag as ns}from"./iframe-DuFCckax.js";import{u as as}from"./useMotionPreference-BRWo7C-p.js";import{u as ts}from"./a11y-BVXyQ8aU.js";import{c as os}from"./createGlassStyle-BfWnO-qv.js";import{u as rs}from"./soundDesign-BpBl8BTS.js";import{O as De}from"./OptimizedGlassCore-Dfu3jw2K.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-8v_R2xci.js";const is={containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0},ee=o.forwardRef(({islands:i,connections:c=[],config:Pe={},showMinimap:ze=!0,showConnections:ke=!0,showGrid:Oe=!1,showStats:Ge=!0,enablePhysics:f=!1,enableDragging:ue=!0,enableResizing:Re=!1,enableZooming:Ae=!0,zoomLevel:Ze=1,width:qe="min(1120px, calc(100vw - 48px))",height:Ve=600,compact:S=!1,contained:Ee=!1,maxHeight:Te,centerOnLoad:me=!0,onIslandMove:he,onIslandResize:ls,onIslandSelect:pe,onConnectionCreate:fe,className:$e="",...Xe},Ye)=>{const ye=ss(),[p,D]=o.useState(i),[P,ne]=o.useState([]),[v,be]=o.useState(null),[we,xe]=o.useState(!1),[ae,_e]=o.useState({x:0,y:0}),[C,He]=o.useState({x:0,y:0}),[d,ve]=o.useState(Ze),[cs,Se]=o.useState(null),[I,Ce]=o.useState(!1),[O,Me]=o.useState(null),te=o.useRef(null),oe=o.useRef(null),G=o.useRef(),[u]=o.useState({...is,...Pe});ts("glass-island-layout");const{shouldAnimate:x}=as(),{play:re}=rs(),L=Te??(S||Ee?240:Ve),Fe=S?"100%":qe,Ue=S?!1:ze,We=S?!1:Ge,Be=S?!1:Ae,je=S?!1:ke,ie=o.useCallback(()=>{if(!u.enableAutoArrange)return;const n=i.map((s,t)=>{const a=t*.618*2*Math.PI,r=Math.sqrt(t+1)*u.islandSpacing;return{...s,x:Math.cos(a)*r+400,y:Math.sin(a)*r+400}});D(n)},[i,u]),Ne=o.useCallback(()=>{if(!f)return;const n=p.map(s=>({...s,vx:0,vy:0,mass:s.width*s.height/1e4,fixed:s.pinned||!1}));ne(n)},[p,f]),Ie=o.useCallback(()=>{!f||P.length===0||ne(n=>{const s=n.map(t=>({...t}));for(let t=0;t<s.length;t++){const a=s[t];if(a.fixed)continue;let r=0,l=0;for(let M=0;M<s.length;M++){if(t===M)continue;const m=s[M],y=m.x+m.width/2-(a.x+a.width/2),j=m.y+m.height/2-(a.y+a.height/2),b=Math.sqrt(y*y+j*j);if(b>0){const N=u.repulsionStrength/(b*b);if(r-=y/b*N,l-=j/b*N,c.some(w=>w.from===a.id&&w.to===m.id||w.to===a.id&&w.from===m.id)){const w=u.gravityStrength*b;r+=y/b*w,l+=j/b*w}}}a.vx+=r/a.mass,a.vy+=l/a.mass,a.vx*=.95,a.vy*=.95,a.x+=a.vx*u.animationSpeed,a.y+=a.vy*u.animationSpeed,a.x<u.containerPadding&&(a.x=u.containerPadding,a.vx=0),a.y<u.containerPadding&&(a.y=u.containerPadding,a.vy=0)}return s})},[f,P,c,u]);o.useEffect(()=>{if(!f)return;const n=()=>{Ie(),G.current=requestAnimationFrame(n)};return G.current=requestAnimationFrame(n),()=>{G.current&&cancelAnimationFrame(G.current)}},[f,Ie]),o.useEffect(()=>{f&&P.length>0&&D(P)},[P,f]);const Le=o.useCallback(()=>{if(!je||!oe.current)return;const n=oe.current,s=n.getContext("2d");s&&(s.clearRect(0,0,n.width,n.height),s.save(),s.scale(d,d),s.translate(C.x,C.y),c.forEach(t=>{const a=p.find(w=>w.id===t.from),r=p.find(w=>w.id===t.to);if(!a||!r)return;const l=a.x+a.width/2,M=a.y+a.height/2,m=r.x+r.width/2,y=r.y+r.height/2;s.strokeStyle=t.color||"var(--glass-bg-hover)",s.lineWidth=(t.strength||1)*2,t.type==="dashed"?s.setLineDash([5,5]):t.type==="dotted"?s.setLineDash([2,3]):s.setLineDash([]),s.beginPath(),s.moveTo(l,M);const j=(l+m)/2,b=Math.min(M,y)-Math.abs(m-l)/4;s.quadraticCurveTo(j,b,m,y),s.stroke();const N=Math.atan2(y-b,m-j),z=10;s.fillStyle=t.color||"var(--glass-border-hover)",s.beginPath(),s.moveTo(m,y),s.lineTo(m-z*Math.cos(N-Math.PI/6),y-z*Math.sin(N-Math.PI/6)),s.lineTo(m-z*Math.cos(N+Math.PI/6),y-z*Math.sin(N+Math.PI/6)),s.closePath(),s.fill()}),s.restore())},[je,c,p,d,C]),Je=o.useCallback((n,s)=>{if(ue){if(xe(!0),be(s.id),_e({x:n.clientX-s.x*d,y:n.clientY-s.y*d}),I){O?(fe?.(O,s.id),Me(null),Ce(!1),re("connect")):Me(s.id);return}pe?.(s),re("select")}},[ue,d,I,O,fe,pe,re]),le=o.useCallback(n=>{if(!we||!v)return;const s=(n.clientX-ae.x)/d,t=(n.clientY-ae.y)/d;D(r=>r.map(l=>l.id===v?{...l,x:s,y:t}:l)),f&&ne(r=>r.map(l=>l.id===v?{...l,x:s,y:t,vx:0,vy:0}:l));const a=p.find(r=>r.id===v);a&&he?.(a,s,t)},[we,v,ae,d,f,p,he]),ce=o.useCallback(()=>{xe(!1),be(null),Se(null)},[]);o.useEffect(()=>{if(me&&p.length>0&&te.current){const n=p.reduce((r,l)=>({minX:Math.min(r.minX,l.x),minY:Math.min(r.minY,l.y),maxX:Math.max(r.maxX,l.x+l.width),maxY:Math.max(r.maxY,l.y+l.height)}),{minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}),s=(n.minX+n.maxX)/2,t=(n.minY+n.maxY)/2,a=te.current.getBoundingClientRect();He({x:a.width/2-s*d,y:a.height/2-t*d})}},[me,p,d]),o.useEffect(()=>{D(i),u.enableAutoArrange&&ie()},[i,ie,u.enableAutoArrange]),o.useEffect(()=>{Ne()},[Ne]),o.useEffect(()=>{Le()},[Le]),o.useEffect(()=>(document.addEventListener("mousemove",le),document.addEventListener("mouseup",ce),()=>{document.removeEventListener("mousemove",le),document.removeEventListener("mouseup",ce)}),[le,ce]);const Ke=()=>e.jsxs("div",{className:"glass-island-layout-minimap glass-absolute glass-right-4 glass-w-50 glass-h-38 glass-surface-dark/50 glass-border glass-border-white/20 glass-radius-lg glass-p-2",style:{top:96},children:[e.jsx("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Overview"}),e.jsxs("div",{className:"glass-relative glass-surface-dark/30 glass-radius",style:{width:200,height:150},children:[p.map(a=>e.jsx("div",{className:`absolute rounded ${v===a.id?"bg-blue-400":"bg-white/40"}`,style:{left:a.x*.1,top:a.y*.1,width:Math.max(2,a.width*.1),height:Math.max(2,a.height*.1)}},`mini-${a.id}`)),e.jsx("div",{className:"glass-absolute glass-border glass-border-blue glass-pointer-events-none",style:{left:-C.x*.1/d,top:-C.y*.1/d,width:200*.1/d,height:150*.1/d}})]})]}),Qe=()=>e.jsx("div",{className:`
        absolute bottom-4 left-4 p-3 rounded-lg border border-white/10
        ${os({blur:"sm",opacity:.8}).background}
      `,children:e.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-90 glass-space-y-1",children:[e.jsxs("div",{children:["Islands: ",p.length]}),e.jsxs("div",{children:["Connections: ",c.length]}),e.jsxs("div",{children:["Zoom: ",Math.round(d*100),"%"]}),f&&e.jsx("div",{children:"Physics: ON"})]})}),es=()=>e.jsxs("div",{className:"glass-island-layout-controls glass-absolute glass-left-4 glass-flex glass-flex-col glass-space-y-2",style:{top:96},children:[e.jsx(k.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>ve(n=>Math.min(3,n*1.2)),children:"🔍+"}),e.jsx(k.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>ve(n=>Math.max(.2,n/1.2)),children:"🔍-"}),e.jsx(k.button,{className:`p-2 border border-white/20 ${ns.lg} text-white transition-colors glass-focus glass-touch-target glass-contrast-guard ${I?"bg-blue-500/50":"bg-white/10 hover:bg-white/20"}`,whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:()=>Ce(!I),children:"🔗"}),e.jsx(k.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:x?{scale:1.05}:{},whileTap:x?{scale:.95}:{},onClick:ie,children:"⚡"})]});return e.jsxs(De,{ref:Ye,variant:"frosted",className:`glass-island-layout relative overflow-auto ${$e}`,style:{width:Fe,maxWidth:"100%",height:typeof L=="number"?`${L}px`:L,maxHeight:typeof L=="number"?`${L}px`:L,overflowX:"auto",overflowY:"auto"},...Xe,children:[!S&&e.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-right-0 glass-p-4 glass-z-10",children:e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Island Layout"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Floating content islands with connections"})]}),I&&e.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-blue/20 glass-border glass-border-blue/50 glass-radius-lg glass-text-secondary glass-text-sm",children:O?"Select target island":"Select source island"})]})}),e.jsxs("div",{ref:te,className:"glass-absolute glass-inset-0 glass-overflow-visible glass-cursor-move",style:{width:2e3,height:2e3,transform:`scale(${d}) translate(${C.x}px, ${C.y}px)`,transformOrigin:"0 0"},children:[Oe&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-10",style:{backgroundImage:`
                  linear-gradient(var(--glass-bg-default) 1px, transparent 1px),
                  linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)
                `,backgroundSize:"50px 50px"}}),e.jsx("canvas",{ref:oe,"data-glass-overlay":"true",className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:2e3,height:2e3}),p.map((n,s)=>e.jsx(k.div,{className:`absolute cursor-pointer transition-all duration-[${de.DURATION.fast}ms] ${v===n.id?"ring-2 ring-blue-400":""} ${n.minimized?"opacity-50":""}`,style:{left:n.x,top:n.y,width:n.width,height:n.minimized?40:n.height,zIndex:n.zIndex||(v===n.id?1e3:s)},initial:x?{opacity:0,scale:.8}:!1,animate:ye?{}:{opacity:1,scale:1},transition:ye?{duration:0}:{duration:de.DURATION.normal/1e3},onMouseDown:t=>Je(t,n),children:e.jsxs(De,{variant:"frosted",className:`w-full h-full box-border p-4 hover:bg-white/10 transition-all duration-[${de.DURATION.fast}ms] ${n.pinned?"border-yellow-400/50":""} ${I?"hover:border-blue-400":""}`,style:{boxSizing:"border-box",overflow:"hidden"},children:[!n.minimized&&n.content,e.jsxs("div",{className:"glass-absolute glass-top-2 glass-right-2 glass-flex glass-space-x-1 glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity","data-glass-overlay":"true",children:[n.category&&e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-dark/30 glass-text-primary-opacity-70 glass-radius glass-text-xs",children:n.category}),e.jsx("button",{tabIndex:-1,onClick:t=>{t.stopPropagation(),D(a=>a.map(r=>r.id===n.id?{...r,minimized:!r.minimized}:r))},className:"glass-w-6 glass-h-6 glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius glass-text-primary-glass-opacity-80 glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",children:n.minimized?"□":"_"})]}),Re&&!n.minimized&&e.jsx("div",{className:"glass-absolute glass-bottom-0 glass-right-0 glass-w-4 glass-h-4 glass-surface-subtle/20 glass-cursor-se-resize glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity",onMouseDown:t=>{t.stopPropagation(),Se(n.id)},children:"⋮⋮"})]})},n.id))]}),Be&&e.jsx(es,{}),Ue&&e.jsx(Ke,{}),We&&e.jsx(Qe,{})]})});ee.displayName="GlassIslandLayout";try{ee.displayName="GlassIslandLayout",ee.__docgenInfo={description:"",displayName:"GlassIslandLayout",props:{islands:{defaultValue:null,description:"",name:"islands",required:!0,type:{name:"Island[]"}},connections:{defaultValue:{value:"[]"},description:"",name:"connections",required:!1,type:{name:"IslandConnection[] | undefined"}},config:{defaultValue:{value:"{}"},description:"",name:"config",required:!1,type:{name:"Partial<LayoutConfig> | undefined"}},showMinimap:{defaultValue:{value:"true"},description:"",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},showConnections:{defaultValue:{value:"true"},description:"",name:"showConnections",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showStats:{defaultValue:{value:"true"},description:"",name:"showStats",required:!1,type:{name:"boolean | undefined"}},enablePhysics:{defaultValue:{value:"false"},description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableDragging:{defaultValue:{value:"true"},description:"",name:"enableDragging",required:!1,type:{name:"boolean | undefined"}},enableResizing:{defaultValue:{value:"false"},description:"",name:"enableResizing",required:!1,type:{name:"boolean | undefined"}},enableZooming:{defaultValue:{value:"true"},description:"",name:"enableZooming",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},width:{defaultValue:{value:"min(1120px, calc(100vw - 48px))"},description:"",name:"width",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:{value:"600"},description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},centerOnLoad:{defaultValue:{value:"true"},description:"",name:"centerOnLoad",required:!1,type:{name:"boolean | undefined"}},onIslandMove:{defaultValue:null,description:"",name:"onIslandMove",required:!1,type:{name:"((island: Island, x: number, y: number) => void) | undefined"}},onIslandResize:{defaultValue:null,description:"",name:"onIslandResize",required:!1,type:{name:"((island: Island, width: number, height: number) => void) | undefined"}},onIslandSelect:{defaultValue:null,description:"",name:"onIslandSelect",required:!1,type:{name:"((island: Island) => void) | undefined"}},onConnectionCreate:{defaultValue:null,description:"",name:"onConnectionCreate",required:!1,type:{name:"((from: string, to: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const g=[{id:"dashboard",x:100,y:100,width:300,height:200,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Dashboard"}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Users: 1,234"}),e.jsx("div",{children:"Revenue: $5,678"}),e.jsx("div",{children:"Sessions: 2,345"}),e.jsx("div",{children:"Conversion: 12.3%"})]})]})},{id:"chat",x:450,y:150,width:250,height:180,category:"communication",draggable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Team Chat"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Alice: Hey team! 👋"}),e.jsx("div",{children:"Bob: Ready for the demo"}),e.jsx("div",{children:"Charlie: Looking good!"})]})]})},{id:"calendar",x:200,y:350,width:280,height:160,category:"productivity",pinned:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Calendar"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"9:00 AM - Team standup"}),e.jsx("div",{children:"2:00 PM - Client presentation"}),e.jsx("div",{children:"4:00 PM - Code review"})]})]})},{id:"metrics",x:520,y:380,width:200,height:150,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Metrics"}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-green glass-h-2 glass-radius-full",style:{width:"75%"}})}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-blue glass-h-2 glass-radius-full",style:{width:"60%"}})})]})]})},{id:"tasks",x:50,y:550,width:320,height:140,category:"productivity",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Tasks"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"✅ Update documentation"}),e.jsx("div",{children:"🔄 Review pull requests"}),e.jsx("div",{children:"⏳ Deploy to staging"})]})]})},{id:"notes",x:750,y:200,width:180,height:220,category:"notes",resizable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Notes"}),e.jsxs("div",{className:"glass-text-sm glass-text-primary/70 space-y-1",children:[e.jsx("div",{children:"• Feature ideas"}),e.jsx("div",{children:"• Bug reports"}),e.jsx("div",{children:"• Meeting notes"}),e.jsx("div",{children:"• Architecture thoughts"})]})]})}],h=[{from:"dashboard",to:"metrics",type:"solid",color:"var(--glass-color-primary-light)",strength:1},{from:"chat",to:"tasks",type:"dashed",color:"var(--glass-color-success-light)",strength:.8},{from:"calendar",to:"tasks",type:"dotted",color:"var(--glass-color-warning-light)",strength:.6},{from:"metrics",to:"notes",type:"animated",color:"var(--glass-color-danger-light)",strength:.5}],ge=g.slice(0,3),se=[...g,{id:"reports",x:400,y:600,width:250,height:160,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Reports"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"Monthly performance analysis and insights"})]})},{id:"settings",x:800,y:500,width:200,height:120,category:"system",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Settings"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"System configuration"})]})}],bs={title:"Surfaces/App Shells + Layout/Glass Island Layout",component:ee,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[i=>e.jsx("div",{className:"glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(i,{})})],tags:["autodocs"],args:{className:"glass-overflow-auto overflow-auto"},argTypes:{showMinimap:{control:"boolean"},showConnections:{control:"boolean"},showGrid:{control:"boolean"},showStats:{control:"boolean"},enablePhysics:{control:"boolean"},enableDragging:{control:"boolean"},enableResizing:{control:"boolean"},enableZooming:{control:"boolean"},zoomLevel:{control:{type:"range",min:.2,max:3,step:.1}},centerOnLoad:{control:"boolean"}}},R={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,zoomLevel:1,centerOnLoad:!0,config:{containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0}}},A={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{gravityStrength:.05,repulsionStrength:150,enablePhysics:!0,animationSpeed:.8}}},Z={args:{islands:ge,connections:[],showMinimap:!1,showConnections:!1,showGrid:!1,showStats:!1,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!1,centerOnLoad:!0}},q={args:{islands:g,connections:h,showMinimap:!1,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0}},V={args:{islands:ge,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},E={args:{islands:se,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{enableAutoArrange:!0,islandSpacing:120}}},T={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableZooming:!0,zoomLevel:1.5,centerOnLoad:!0}},$={args:{islands:se,connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableZooming:!0,zoomLevel:.6,centerOnLoad:!0}},X={args:{islands:g,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0}},Y={args:{islands:se,connections:[...h,{from:"reports",to:"dashboard",type:"solid",color:"#8b5cf6",strength:1},{from:"settings",to:"notes",type:"dashed",color:"#06b6d4",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:80,gravityStrength:.03,repulsionStrength:120}}},_={args:{islands:ge,connections:h.slice(0,2),showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:200,containerPadding:100}}},H={args:{islands:g,connections:[],showMinimap:!0,showConnections:!1,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},F={args:{islands:g,connections:[...h,{from:"dashboard",to:"chat",type:"solid",color:"var(--glass-color-success)",strength:.8},{from:"calendar",to:"notes",type:"dotted",color:"var(--glass-color-warning)",strength:.6},{from:"tasks",to:"notes",type:"animated",color:"var(--glass-color-danger)",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0}},U={args:{islands:g,connections:h,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0,config:{enablePhysics:!0,gravityStrength:.08,repulsionStrength:200,animationSpeed:.6,enableCollisionDetection:!0}}},W={args:{islands:g.map(i=>({...i,pinned:i.id==="dashboard"||i.id==="calendar"})),connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0}},B={args:{islands:g.map(i=>({...i,minimized:i.id==="notes"||i.id==="metrics"})),connections:h,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableDragging:!0,centerOnLoad:!0}},J={args:{islands:g,connections:h.filter(i=>g.find(c=>c.id===i.from)?.category==="analytics"&&g.find(c=>c.id===i.to)?.category==="analytics"||g.find(c=>c.id===i.from)?.category==="productivity"&&g.find(c=>c.id===i.to)?.category==="productivity"),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableDragging:!0,centerOnLoad:!0}},K={args:{islands:[...se,{id:"monitoring",x:150,y:800,width:300,height:180,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"System Monitoring"})})},{id:"logs",x:600,y:750,width:250,height:160,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"Log Viewer"})})}],connections:[...h,{from:"monitoring",to:"logs",type:"solid",color:"#ec4899",strength:.9}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,zoomLevel:.7,centerOnLoad:!0}},Q={args:{islands:Array.from({length:20},(i,c)=>({id:`island-${c}`,x:100+c%5*200,y:100+Math.floor(c/5)*150,width:180,height:120,category:c%2===0?"system":"data",content:e.jsxs("div",{className:"glass-p-4",children:[e.jsxs("h4",{className:"glass-text-primary/90",children:["Island ",c+1]}),e.jsx("p",{className:"glass-text-primary/60 glass-text-sm",children:"Test content"})]})})),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableZooming:!0,zoomLevel:.5,centerOnLoad:!0}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};const ws=["Default","PhysicsEnabled","MinimalView","ConnectionFocus","DragAndResize","AutoArranged","ZoomedIn","ZoomedOut","GridEnabled","DenseLayout","SparseLayout","NoConnections","AllConnections","PhysicsWithConnections","PinnedIslands","MinimizedIslands","CategorizedIslands","LargeScale","PerformanceTest"];export{F as AllConnections,E as AutoArranged,J as CategorizedIslands,q as ConnectionFocus,R as Default,Y as DenseLayout,V as DragAndResize,X as GridEnabled,K as LargeScale,Z as MinimalView,B as MinimizedIslands,H as NoConnections,Q as PerformanceTest,A as PhysicsEnabled,U as PhysicsWithConnections,W as PinnedIslands,_ as SparseLayout,T as ZoomedIn,$ as ZoomedOut,ws as __namedExportsOrder,bs as default};
