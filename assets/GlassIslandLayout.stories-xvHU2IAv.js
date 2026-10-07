import{r,a as as,j as e,m as O,b as me,ah as ts}from"./iframe-Cqi-9gHA.js";import{u as rs}from"./useMotionPreference-fk1VFuMQ.js";import{u as os}from"./a11y-DBBBNlGj.js";import{u as is}from"./soundDesign-BN0GUCjA.js";import{O as ke}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";const ls={containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0},se=r.forwardRef(({islands:i,connections:l=[],config:ze={},showMinimap:Oe=!0,showConnections:Re=!0,showGrid:Ge=!1,showStats:Ae=!0,enablePhysics:b=!1,enableDragging:pe=!0,enableResizing:Ze=!1,enableZooming:qe=!0,zoomLevel:ae=1,width:Ve="min(1120px, calc(100vw - 48px))",height:Ee=600,compact:v=!1,contained:Te=!1,maxHeight:$e,centerOnLoad:fe=!0,onIslandMove:ye,onIslandResize:cs,onIslandSelect:be,onConnectionCreate:xe,className:Xe="",...Ye},L)=>{const we=as(),[f,D]=r.useState(i),[P,te]=r.useState([]),[C,ve]=r.useState(null),[Se,Ce]=r.useState(!1),[re,_e]=r.useState({x:0,y:0}),[M,He]=r.useState({x:0,y:0}),[m,oe]=r.useState(ae),[ds,Me]=r.useState(null),[k,je]=r.useState(!1),[R,Ne]=r.useState(null),We=r.useRef(null),ie=r.useRef(null),le=r.useRef(null),G=r.useRef(),[h]=r.useState({...ls,...ze});os("glass-island-layout");const{shouldAnimate:S}=rs(),{play:ce}=is(),I=$e??(v||Te?240:Ee),Fe=v?"100%":Ve,Ue=v?!1:Oe,Be=v?!1:Ae,Je=v?!1:qe,Ie=v?!1:Re,de=r.useCallback(()=>{if(!h.enableAutoArrange)return;const s=i.map((n,t)=>{const a=t*.618*2*Math.PI,o=Math.sqrt(t+1)*h.islandSpacing;return{...n,x:Math.cos(a)*o+400,y:Math.sin(a)*o+400}});D(s)},[i,h]),Le=r.useCallback(()=>{if(!b)return;const s=f.map(n=>({...n,vx:0,vy:0,mass:n.width*n.height/1e4,fixed:n.pinned||!1}));te(s)},[f,b]),De=r.useCallback(()=>{!b||P.length===0||te(s=>{const n=s.map(t=>({...t}));for(let t=0;t<n.length;t++){const a=n[t];if(a.fixed)continue;let o=0,g=0;for(let y=0;y<n.length;y++){if(t===y)continue;const c=n[y],d=c.x+c.width/2-(a.x+a.width/2),j=c.y+c.height/2-(a.y+a.height/2),x=Math.sqrt(d*d+j*j);if(x>0){const N=h.repulsionStrength/(x*x);if(o-=d/x*N,g-=j/x*N,l.some(w=>w.from===a.id&&w.to===c.id||w.to===a.id&&w.from===c.id)){const w=h.gravityStrength*x;o+=d/x*w,g+=j/x*w}}}a.vx+=o/a.mass,a.vy+=g/a.mass,a.vx*=.95,a.vy*=.95,a.x+=a.vx*h.animationSpeed,a.y+=a.vy*h.animationSpeed,a.x<h.containerPadding&&(a.x=h.containerPadding,a.vx=0),a.y<h.containerPadding&&(a.y=h.containerPadding,a.vy=0)}return n})},[b,P,l,h]);r.useEffect(()=>{if(!b)return;const s=()=>{De(),G.current=requestAnimationFrame(s)};return G.current=requestAnimationFrame(s),()=>{G.current&&cancelAnimationFrame(G.current)}},[b,De]),r.useEffect(()=>{b&&P.length>0&&D(P)},[P,b]);const Pe=r.useCallback(()=>{if(!Ie||!le.current)return;const s=le.current,n=s.getContext("2d");n&&(n.clearRect(0,0,s.width,s.height),n.save(),n.scale(m,m),n.translate(M.x,M.y),l.forEach(t=>{const a=f.find(w=>w.id===t.from),o=f.find(w=>w.id===t.to);if(!a||!o)return;const g=a.x+a.width/2,y=a.y+a.height/2,c=o.x+o.width/2,d=o.y+o.height/2;n.strokeStyle=t.color||"var(--glass-bg-hover)",n.lineWidth=(t.strength||1)*2,t.type==="dashed"?n.setLineDash([5,5]):t.type==="dotted"?n.setLineDash([2,3]):n.setLineDash([]),n.beginPath(),n.moveTo(g,y);const j=(g+c)/2,x=Math.min(y,d)-Math.abs(c-g)/4;n.quadraticCurveTo(j,x,c,d),n.stroke();const N=Math.atan2(d-x,c-j),z=10;n.fillStyle=t.color||"var(--glass-border-hover)",n.beginPath(),n.moveTo(c,d),n.lineTo(c-z*Math.cos(N-Math.PI/6),d-z*Math.sin(N-Math.PI/6)),n.lineTo(c-z*Math.cos(N+Math.PI/6),d-z*Math.sin(N+Math.PI/6)),n.closePath(),n.fill()}),n.restore())},[Ie,l,f,m,M]),Ke=r.useCallback((s,n)=>{if(pe){if(Ce(!0),ve(n.id),_e({x:s.clientX-n.x*m,y:s.clientY-n.y*m}),k){R?(xe?.(R,n.id),Ne(null),je(!1),ce("connect")):Ne(n.id);return}be?.(n),ce("select")}},[pe,m,k,R,xe,be,ce]),ge=r.useCallback(s=>{if(!Se||!C)return;const n=(s.clientX-re.x)/m,t=(s.clientY-re.y)/m;D(o=>o.map(g=>g.id===C?{...g,x:n,y:t}:g)),b&&te(o=>o.map(g=>g.id===C?{...g,x:n,y:t,vx:0,vy:0}:g));const a=f.find(o=>o.id===C);a&&ye?.(a,n,t)},[Se,C,re,m,b,f,ye]),ue=r.useCallback(()=>{Ce(!1),ve(null),Me(null)},[]);r.useEffect(()=>{if(fe&&f.length>0&&ie.current){const s=f.reduce((c,d)=>({minX:Math.min(c.minX,d.x),minY:Math.min(c.minY,d.y),maxX:Math.max(c.maxX,d.x+d.width),maxY:Math.max(c.maxY,d.y+d.height)}),{minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}),n=ie.current.getBoundingClientRect(),t=Math.max(1,s.maxX-s.minX),a=Math.max(1,s.maxY-s.minY),o=Math.max(1,n.width-64),g=Math.max(1,n.height-(v?48:112)),y=Math.max(.2,Math.min(ae,o/t,g/a));oe(y),He({x:(n.width-t*y)/2-s.minX*y,y:(n.height-a*y)/2-s.minY*y+(v?0:28)})}},[fe,v,f,ae]);const Qe=r.useCallback(s=>{ie.current=s,typeof L=="function"?L(s):L&&Object.assign(L,{current:s})},[L]);r.useEffect(()=>{D(i),h.enableAutoArrange&&de()},[i,de,h.enableAutoArrange]),r.useEffect(()=>{Le()},[Le]),r.useEffect(()=>{Pe()},[Pe]),r.useEffect(()=>(document.addEventListener("mousemove",ge),document.addEventListener("mouseup",ue),()=>{document.removeEventListener("mousemove",ge),document.removeEventListener("mouseup",ue)}),[ge,ue]);const es=()=>e.jsxs("div",{className:"glass-island-layout-minimap glass-absolute glass-right-4 glass-w-50 glass-h-38 glass-surface-dark/50 glass-border glass-border-white/20 glass-radius-lg glass-p-2",style:{top:96},children:[e.jsx("div",{className:"glass-text-xs glass-text-primary-opacity-70 glass-mb-1",children:"Overview"}),e.jsxs("div",{className:"glass-relative glass-surface-dark/30 glass-radius",style:{width:200,height:150},children:[f.map(a=>e.jsx("div",{className:`absolute rounded ${C===a.id?"bg-blue-400":"bg-white/40"}`,style:{left:a.x*.1,top:a.y*.1,width:Math.max(2,a.width*.1),height:Math.max(2,a.height*.1)}},`mini-${a.id}`)),e.jsx("div",{className:"glass-absolute glass-border glass-border-blue glass-pointer-events-none",style:{left:-M.x*.1/m,top:-M.y*.1/m,width:200*.1/m,height:150*.1/m}})]})]}),ss=()=>e.jsx("div",{className:"glass-island-layout-stats glass-absolute glass-bottom-4 glass-left-4 glass-p-3 glass-radius-lg glass-border glass-border-soft",style:{background:"rgba(255,255,255,.2)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.28)"},children:e.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-90 glass-space-y-1",children:[e.jsxs("div",{children:["Islands: ",f.length]}),e.jsxs("div",{children:["Connections: ",l.length]}),e.jsxs("div",{children:["Zoom: ",Math.round(m*100),"%"]}),b&&e.jsx("div",{children:"Physics: ON"})]})}),ns=()=>e.jsxs("div",{className:"glass-island-layout-controls glass-absolute glass-left-4 glass-flex glass-flex-col glass-space-y-2",style:{top:96},children:[e.jsx(O.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:S?{scale:1.05}:{},whileTap:S?{scale:.95}:{},onClick:()=>oe(s=>Math.min(3,s*1.2)),style:{appearance:"none",width:44,height:44,border:"1px solid rgba(148,163,184,.3)",borderRadius:14,background:"rgba(255,255,255,.2)",color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"🔍+"}),e.jsx(O.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:S?{scale:1.05}:{},whileTap:S?{scale:.95}:{},onClick:()=>oe(s=>Math.max(.2,s/1.2)),style:{appearance:"none",width:44,height:44,border:"1px solid rgba(148,163,184,.3)",borderRadius:14,background:"rgba(255,255,255,.2)",color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"🔍-"}),e.jsx(O.button,{className:`p-2 border border-white/20 ${ts.lg} glass-text-primary glass-surface-overlay transition-colors glass-focus glass-touch-target glass-contrast-guard`,style:{appearance:"none",width:44,height:44,border:"1px solid rgba(148,163,184,.3)",borderRadius:14,background:"rgba(255,255,255,.2)",color:"var(--glass-theme-text, var(--glass-text-primary))"},whileHover:S?{scale:1.05}:{},whileTap:S?{scale:.95}:{},onClick:()=>je(!k),children:"🔗"}),e.jsx(O.button,{className:"glass-p-2 glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-border glass-border-white/20 glass-radius-lg glass-text-primary glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",whileHover:S?{scale:1.05}:{},whileTap:S?{scale:.95}:{},onClick:de,style:{appearance:"none",width:44,height:44,border:"1px solid rgba(148,163,184,.3)",borderRadius:14,background:"rgba(255,255,255,.2)",color:"var(--glass-theme-text, var(--glass-text-primary))"},children:"⚡"})]});return e.jsxs(ke,{ref:Qe,variant:"frosted",className:`glass-island-layout glass-relative glass-overflow-hidden ${Xe}`,style:{width:Fe,maxWidth:"100%",height:typeof I=="number"?`${I}px`:I,maxHeight:typeof I=="number"?`${I}px`:I,overflow:"hidden",contain:"layout paint"},...Ye,children:[e.jsx("style",{children:`
          @media (max-width: 520px) {
            .glass-island-layout-minimap,
            .glass-island-layout-stats {
              display: none !important;
            }

            .glass-island-layout-controls {
              flex-direction: row !important;
              top: 96px !important;
            }

            .glass-island-layout-controls > * {
              margin-top: 0 !important;
              margin-left: 8px !important;
            }

            .glass-island-layout-controls > :first-child {
              margin-left: 0 !important;
            }
          }
        `}),!v&&e.jsx("div",{className:"glass-absolute glass-top-0 glass-left-0 glass-right-0 glass-p-4 glass-z-10",children:e.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90",children:"Island Layout"}),e.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60",children:"Floating content islands with connections"})]}),k&&e.jsx("div",{className:"glass-px-3 glass-py-1 glass-surface-blue/20 glass-border glass-border-blue/50 glass-radius-lg glass-text-secondary glass-text-sm",children:R?"Select target island":"Select source island"})]})}),e.jsx("div",{className:"glass-absolute glass-inset-0 glass-overflow-hidden",style:{contain:"strict"},children:e.jsxs("div",{ref:We,className:"glass-absolute glass-inset-0 glass-overflow-visible glass-cursor-move",style:{width:2e3,height:2e3,contain:"strict",transform:`translate(${M.x}px, ${M.y}px) scale(${m})`,transformOrigin:"0 0"},children:[Ge&&e.jsx("div",{className:"glass-absolute glass-inset-0 glass-opacity-10",style:{backgroundImage:`
                  linear-gradient(var(--glass-bg-default) 1px, transparent 1px),
                  linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)
                `,backgroundSize:"50px 50px"}}),e.jsx("canvas",{ref:le,"data-glass-overlay":"true",className:"glass-absolute glass-inset-0 glass-pointer-events-none",width:2e3,height:2e3}),f.map((s,n)=>e.jsx(O.div,{className:`absolute cursor-pointer transition-all duration-[${me.DURATION.fast}ms] ${C===s.id?"ring-2 ring-blue-400":""} ${s.minimized?"opacity-50":""}`,style:{left:s.x,top:s.y,width:s.width,height:s.minimized?40:s.height,zIndex:s.zIndex||(C===s.id?1e3:n)},initial:S?{opacity:0,scale:.8}:!1,animate:we?{}:{opacity:1,scale:1},transition:we?{duration:0}:{duration:me.DURATION.normal/1e3},onMouseDown:t=>Ke(t,s),children:e.jsxs(ke,{variant:"frosted",className:`w-full h-full box-border p-4 hover:bg-white/10 transition-all duration-[${me.DURATION.fast}ms] ${s.pinned?"border-yellow-400/50":""} ${k?"hover:border-blue-400":""}`,style:{boxSizing:"border-box",overflow:"hidden"},children:[!s.minimized&&s.content,e.jsxs("div",{className:"glass-absolute glass-top-2 glass-right-2 glass-flex glass-space-x-1","data-glass-overlay":"true",children:[s.category&&e.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-overlay glass-radius glass-text-xs",style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:s.category}),e.jsx("button",{tabIndex:-1,onClick:t=>{t.stopPropagation(),D(a=>a.map(o=>o.id===s.id?{...o,minimized:!o.minimized}:o))},className:"glass-w-6 glass-h-6 glass-surface-overlay hover:glass-surface-subtle glass-radius glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:{color:"var(--glass-theme-text, var(--glass-text-primary))"},children:s.minimized?"□":"_"})]}),Ze&&!s.minimized&&e.jsx("div",{className:"glass-absolute glass-bottom-0 glass-right-0 glass-w-4 glass-h-4 glass-surface-subtle/20 glass-cursor-se-resize glass-opacity-0 glass-hover-opacity-100 glass-transition-opacity",onMouseDown:t=>{t.stopPropagation(),Me(s.id)},children:"⋮⋮"})]})},s.id))]})}),Je&&e.jsx(ns,{}),Ue&&e.jsx(es,{}),Be&&e.jsx(ss,{})]})});se.displayName="GlassIslandLayout";try{se.displayName="GlassIslandLayout",se.__docgenInfo={description:"",displayName:"GlassIslandLayout",props:{islands:{defaultValue:null,description:"",name:"islands",required:!0,type:{name:"Island[]"}},connections:{defaultValue:{value:"[]"},description:"",name:"connections",required:!1,type:{name:"IslandConnection[] | undefined"}},config:{defaultValue:{value:"{}"},description:"",name:"config",required:!1,type:{name:"Partial<LayoutConfig> | undefined"}},showMinimap:{defaultValue:{value:"true"},description:"",name:"showMinimap",required:!1,type:{name:"boolean | undefined"}},showConnections:{defaultValue:{value:"true"},description:"",name:"showConnections",required:!1,type:{name:"boolean | undefined"}},showGrid:{defaultValue:{value:"false"},description:"",name:"showGrid",required:!1,type:{name:"boolean | undefined"}},showStats:{defaultValue:{value:"true"},description:"",name:"showStats",required:!1,type:{name:"boolean | undefined"}},enablePhysics:{defaultValue:{value:"false"},description:"",name:"enablePhysics",required:!1,type:{name:"boolean | undefined"}},enableDragging:{defaultValue:{value:"true"},description:"",name:"enableDragging",required:!1,type:{name:"boolean | undefined"}},enableResizing:{defaultValue:{value:"false"},description:"",name:"enableResizing",required:!1,type:{name:"boolean | undefined"}},enableZooming:{defaultValue:{value:"true"},description:"",name:"enableZooming",required:!1,type:{name:"boolean | undefined"}},zoomLevel:{defaultValue:{value:"1"},description:"",name:"zoomLevel",required:!1,type:{name:"number | undefined"}},width:{defaultValue:{value:"min(1120px, calc(100vw - 48px))"},description:"",name:"width",required:!1,type:{name:"string | number | undefined"}},height:{defaultValue:{value:"600"},description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}},centerOnLoad:{defaultValue:{value:"true"},description:"",name:"centerOnLoad",required:!1,type:{name:"boolean | undefined"}},onIslandMove:{defaultValue:null,description:"",name:"onIslandMove",required:!1,type:{name:"((island: Island, x: number, y: number) => void) | undefined"}},onIslandResize:{defaultValue:null,description:"",name:"onIslandResize",required:!1,type:{name:"((island: Island, width: number, height: number) => void) | undefined"}},onIslandSelect:{defaultValue:null,description:"",name:"onIslandSelect",required:!1,type:{name:"((island: Island) => void) | undefined"}},onConnectionCreate:{defaultValue:null,description:"",name:"onConnectionCreate",required:!1,type:{name:"((from: string, to: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const u=[{id:"dashboard",x:100,y:100,width:300,height:200,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Dashboard"}),e.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Users: 1,234"}),e.jsx("div",{children:"Revenue: $5,678"}),e.jsx("div",{children:"Sessions: 2,345"}),e.jsx("div",{children:"Conversion: 12.3%"})]})]})},{id:"chat",x:450,y:150,width:250,height:180,category:"communication",draggable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Team Chat"}),e.jsxs("div",{className:"glass-space-y-2 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"Alice: Hey team! 👋"}),e.jsx("div",{children:"Bob: Ready for the demo"}),e.jsx("div",{children:"Charlie: Looking good!"})]})]})},{id:"calendar",x:200,y:350,width:280,height:160,category:"productivity",pinned:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Calendar"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"9:00 AM - Team standup"}),e.jsx("div",{children:"2:00 PM - Client presentation"}),e.jsx("div",{children:"4:00 PM - Code review"})]})]})},{id:"metrics",x:520,y:380,width:200,height:150,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Metrics"}),e.jsxs("div",{className:"glass-space-y-2",children:[e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-green glass-h-2 glass-radius-full",style:{width:"75%"}})}),e.jsx("div",{className:"glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2",children:e.jsx("div",{className:"glass-surface-blue glass-h-2 glass-radius-full",style:{width:"60%"}})})]})]})},{id:"tasks",x:50,y:550,width:320,height:140,category:"productivity",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Tasks"}),e.jsxs("div",{className:"space-y-1 glass-text-sm glass-text-primary/70",children:[e.jsx("div",{children:"✅ Update documentation"}),e.jsx("div",{children:"🔄 Review pull requests"}),e.jsx("div",{children:"⏳ Deploy to staging"})]})]})},{id:"notes",x:750,y:200,width:180,height:220,category:"notes",resizable:!0,content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Notes"}),e.jsxs("div",{className:"glass-text-sm glass-text-primary/70 space-y-1",children:[e.jsx("div",{children:"• Feature ideas"}),e.jsx("div",{children:"• Bug reports"}),e.jsx("div",{children:"• Meeting notes"}),e.jsx("div",{children:"• Architecture thoughts"})]})]})}],p=[{from:"dashboard",to:"metrics",type:"solid",color:"var(--glass-color-primary-light)",strength:1},{from:"chat",to:"tasks",type:"dashed",color:"var(--glass-color-success-light)",strength:.8},{from:"calendar",to:"tasks",type:"dotted",color:"var(--glass-color-warning-light)",strength:.6},{from:"metrics",to:"notes",type:"animated",color:"var(--glass-color-danger-light)",strength:.5}],he=u.slice(0,3),ne=[...u,{id:"reports",x:400,y:600,width:250,height:160,category:"analytics",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Reports"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"Monthly performance analysis and insights"})]})},{id:"settings",x:800,y:500,width:200,height:120,category:"system",content:e.jsxs("div",{className:"glass-h-full",children:[e.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary/90 glass-mb-2",children:"Settings"}),e.jsx("div",{className:"glass-text-sm glass-text-primary/70",children:"System configuration"})]})}],bs={title:"Surfaces/App Shells + Layout/Glass Island Layout",component:se,parameters:{layout:"fullscreen",previewSurface:"app"},decorators:[i=>e.jsx("div",{className:"glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8",style:{boxSizing:"border-box"},children:e.jsx(i,{})})],tags:["autodocs"],args:{className:"glass-overflow-hidden"},argTypes:{showMinimap:{control:"boolean"},showConnections:{control:"boolean"},showGrid:{control:"boolean"},showStats:{control:"boolean"},enablePhysics:{control:"boolean"},enableDragging:{control:"boolean"},enableResizing:{control:"boolean"},enableZooming:{control:"boolean"},zoomLevel:{control:{type:"range",min:.2,max:3,step:.1}},centerOnLoad:{control:"boolean"}}},A={args:{islands:u,connections:p,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,zoomLevel:1,centerOnLoad:!0,config:{containerPadding:50,islandSpacing:100,connectionDistance:300,animationSpeed:1,gravityStrength:.02,repulsionStrength:100,enablePhysics:!1,enableAutoArrange:!1,enableCollisionDetection:!0}}},Z={args:{islands:u,connections:p,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{gravityStrength:.05,repulsionStrength:150,enablePhysics:!0,animationSpeed:.8}}},q={args:{islands:he,connections:[],showMinimap:!1,showConnections:!1,showGrid:!1,showStats:!1,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!1,centerOnLoad:!0}},V={args:{islands:u,connections:p,showMinimap:!1,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0}},E={args:{islands:he,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},T={args:{islands:ne,connections:p,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!1,enableZooming:!0,centerOnLoad:!0,config:{enableAutoArrange:!0,islandSpacing:120}}},$={args:{islands:u,connections:p,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableZooming:!0,zoomLevel:1.5,centerOnLoad:!0}},X={args:{islands:ne,connections:p,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableZooming:!0,zoomLevel:.6,centerOnLoad:!0}},Y={args:{islands:u,connections:[],showMinimap:!0,showConnections:!1,showGrid:!0,showStats:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0}},_={args:{islands:ne,connections:[...p,{from:"reports",to:"dashboard",type:"solid",color:"#8b5cf6",strength:1},{from:"settings",to:"notes",type:"dashed",color:"#06b6d4",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:80,gravityStrength:.03,repulsionStrength:120}}},H={args:{islands:he,connections:p.slice(0,2),showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0,config:{islandSpacing:200,containerPadding:100}}},W={args:{islands:u,connections:[],showMinimap:!0,showConnections:!1,showGrid:!1,showStats:!0,enablePhysics:!1,enableDragging:!0,enableResizing:!0,enableZooming:!0,centerOnLoad:!0}},F={args:{islands:u,connections:[...p,{from:"dashboard",to:"chat",type:"solid",color:"hsl(var(--glass-color-success))",strength:.8},{from:"calendar",to:"notes",type:"dotted",color:"hsl(var(--glass-color-warning))",strength:.6},{from:"tasks",to:"notes",type:"animated",color:"hsl(var(--glass-color-danger))",strength:.7}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,centerOnLoad:!0}},U={args:{islands:u,connections:p,showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,centerOnLoad:!0,config:{enablePhysics:!0,gravityStrength:.08,repulsionStrength:200,animationSpeed:.6,enableCollisionDetection:!0}}},B={args:{islands:u.map(i=>({...i,pinned:i.id==="dashboard"||i.id==="calendar"})),connections:p,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enablePhysics:!0,enableDragging:!0,centerOnLoad:!0}},J={args:{islands:u.map(i=>({...i,minimized:i.id==="notes"||i.id==="metrics"})),connections:p,showMinimap:!0,showConnections:!0,showGrid:!1,showStats:!0,enableDragging:!0,centerOnLoad:!0}},K={args:{islands:u,connections:p.filter(i=>u.find(l=>l.id===i.from)?.category==="analytics"&&u.find(l=>l.id===i.to)?.category==="analytics"||u.find(l=>l.id===i.from)?.category==="productivity"&&u.find(l=>l.id===i.to)?.category==="productivity"),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enableDragging:!0,centerOnLoad:!0}},Q={args:{islands:[...ne,{id:"monitoring",x:150,y:800,width:300,height:180,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"System Monitoring"})})},{id:"logs",x:600,y:750,width:250,height:160,category:"system",content:e.jsx("div",{className:"glass-p-4",children:e.jsx("h3",{className:"glass-text-primary/90",children:"Log Viewer"})})}],connections:[...p,{from:"monitoring",to:"logs",type:"solid",color:"#ec4899",strength:.9}],showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!0,enableDragging:!0,enableZooming:!0,zoomLevel:.7,centerOnLoad:!0}},ee={args:{islands:Array.from({length:20},(i,l)=>({id:`island-${l}`,x:100+l%5*200,y:100+Math.floor(l/5)*150,width:180,height:120,category:l%2===0?"system":"data",content:e.jsxs("div",{className:"glass-p-4",children:[e.jsxs("h4",{className:"glass-text-primary/90",children:["Island ",l+1]}),e.jsx("p",{className:"glass-text-primary/60 glass-text-sm",children:"Test content"})]})})),showMinimap:!0,showConnections:!0,showGrid:!0,showStats:!0,enablePhysics:!1,enableDragging:!0,enableZooming:!0,zoomLevel:.5,centerOnLoad:!0}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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
}`,...Z.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...X.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    islands: largeIslands,
    connections: [...mockConnections, {
      from: "reports",
      to: "dashboard",
      type: "solid",
      color: "#8b5cf6",
      strength: 1
    }, {
      from: "settings",
      to: "notes",
      type: "dashed",
      color: "#06b6d4",
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
}`,..._.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: [...mockConnections, {
      from: "dashboard",
      to: "chat",
      type: "solid",
      color: "hsl(var(--glass-color-success))",
      strength: 0.8
    }, {
      from: "calendar",
      to: "notes",
      type: "dotted",
      color: "hsl(var(--glass-color-warning))",
      strength: 0.6
    }, {
      from: "tasks",
      to: "notes",
      type: "animated",
      color: "hsl(var(--glass-color-danger))",
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
}`,...U.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands.map(island => ({
      ...island,
      pinned: island.id === "dashboard" || island.id === "calendar"
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
}`,...B.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands.map(island => ({
      ...island,
      minimized: island.id === "notes" || island.id === "metrics"
    })),
    connections: mockConnections,
    showMinimap: true,
    showConnections: true,
    showGrid: false,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true
  }
}`,...J.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    islands: mockIslands,
    connections: mockConnections.filter(conn => mockIslands.find(i => i.id === conn.from)?.category === "analytics" && mockIslands.find(i => i.id === conn.to)?.category === "analytics" || mockIslands.find(i => i.id === conn.from)?.category === "productivity" && mockIslands.find(i => i.id === conn.to)?.category === "productivity"),
    showMinimap: true,
    showConnections: true,
    showGrid: true,
    showStats: true,
    enableDragging: true,
    centerOnLoad: true
  }
}`,...K.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    islands: [...largeIslands, {
      id: "monitoring",
      x: 150,
      y: 800,
      width: 300,
      height: 180,
      category: "system",
      content: <div className="glass-p-4">
            <h3 className="glass-text-primary/90">System Monitoring</h3>
          </div>
    }, {
      id: "logs",
      x: 600,
      y: 750,
      width: 250,
      height: 160,
      category: "system",
      content: <div className="glass-p-4">
            <h3 className="glass-text-primary/90">Log Viewer</h3>
          </div>
    }],
    connections: [...mockConnections, {
      from: "monitoring",
      to: "logs",
      type: "solid",
      color: "#ec4899",
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
}`,...Q.parameters?.docs?.source}}};ee.parameters={...ee.parameters,docs:{...ee.parameters?.docs,source:{originalSource:`{
  args: {
    islands: Array.from({
      length: 20
    }, (_, i) => ({
      id: \`island-\${i}\`,
      x: 100 + i % 5 * 200,
      y: 100 + Math.floor(i / 5) * 150,
      width: 180,
      height: 120,
      category: i % 2 === 0 ? "system" : "data",
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
}`,...ee.parameters?.docs?.source}}};const xs=["Default","PhysicsEnabled","MinimalView","ConnectionFocus","DragAndResize","AutoArranged","ZoomedIn","ZoomedOut","GridEnabled","DenseLayout","SparseLayout","NoConnections","AllConnections","PhysicsWithConnections","PinnedIslands","MinimizedIslands","CategorizedIslands","LargeScale","PerformanceTest"];export{F as AllConnections,T as AutoArranged,K as CategorizedIslands,V as ConnectionFocus,A as Default,_ as DenseLayout,E as DragAndResize,Y as GridEnabled,Q as LargeScale,q as MinimalView,J as MinimizedIslands,W as NoConnections,ee as PerformanceTest,Z as PhysicsEnabled,U as PhysicsWithConnections,B as PinnedIslands,H as SparseLayout,$ as ZoomedIn,X as ZoomedOut,xs as __namedExportsOrder,bs as default};
