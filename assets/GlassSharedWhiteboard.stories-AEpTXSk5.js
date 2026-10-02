import{r as i,a as Vs,j as r,c as k,d as Bs,m as qs}from"./iframe-DFMMcocb.js";import{u as _s}from"./soundDesign-DAOJZn7H.js";import{u as $s}from"./a11y-Q0mX7KvA.js";import{u as Ws}from"./useMotionPreference-CXubJTNb.js";import{c as ss}from"./createGlassStyle-Cr0Un8y6.js";import{O as Ys}from"./OptimizedGlassCore-1D6AE-uZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-iDxBLJQX.js";const Xs=[{id:"pen",name:"Pen",icon:"✏️"},{id:"marker",name:"Marker",icon:"🖍️"},{id:"eraser",name:"Eraser",icon:"🧽"},{id:"shape",name:"Shape",icon:"📐"}],Gs=["rgba(255, 255, 255, 0.32)","rgba(248, 250, 252, 0.3)","rgba(241, 245, 249, 0.28)","rgba(226, 232, 240, 0.26)","rgba(203, 213, 225, 0.24)","rgba(255, 255, 255, 0.2)"],zs=[2,4,8,12,16,24],es=i.forwardRef(({width:l=800,height:t=600,users:z,currentUserId:d,strokes:us=[],backgroundColor:P="var(--glass-white)",gridVisible:ds=!1,showUserCursors:gs=!0,showToolbar:ms=!0,showUserList:hs=!0,showUndoRedo:ps=!0,maxStrokes:U=1e3,realTimeSync:O=!1,soundEnabled:y=!0,canDraw:rs=!0,readOnly:m=!1,onStroke:b,onClear:fs,onUndo:ws,onRedo:xs,onUserCursorMove:as,className:ks="",...Us},ys)=>{const bs=Vs(),C=i.useRef(null),[ts,os]=i.useState(!1),[h,J]=i.useState(null),[v,Cs]=i.useState("pen"),[x,vs]=i.useState("var(--glass-black)"),[Z,Ss]=i.useState(4),[p,f]=i.useState(us),[S,T]=i.useState([]),[H,D]=i.useState([]),[K,Ts]=i.useState(z),[ns,Ds]=i.useState(ds),{play:M}=_s();$s("glass-shared-whiteboard");const{shouldAnimate:Ms}=Ws(),js=s=>Ms?s:{duration:0},Q=z.find(s=>s.id===d);i.useEffect(()=>{if(!O)return;const s=setInterval(()=>{Ts(e=>e.map(n=>{if(n.id===d)return n;const g=(Math.random()-.5)*50,a=(Math.random()-.5)*50,c=Math.max(0,Math.min(l,n.cursorX+g)),w=Math.max(0,Math.min(t,n.cursorY+a)),j=Math.random()<.1;if(j&&Math.random()<.3){const cs={id:`stroke-${Date.now()}-${n.id}`,userId:n.id,userName:n.name,userColor:n.color,points:[{x:c,y:w},{x:c+Math.random()*20,y:w+Math.random()*20}],tool:"pen",color:n.color,size:3,opacity:.8,timestamp:Date.now(),isComplete:!0};f(Rs=>[...Rs.slice(-U+1),cs]),b?.(cs),y&&M("draw")}return as?.(n.id,c,w),{...n,cursorX:c,cursorY:w,isDrawing:j,lastActivity:Date.now()}}))},200);return()=>clearInterval(s)},[O,d,l,t,U,b,as,y,M]);const ls=i.useCallback(()=>{const s=C.current;if(!s)return;const e=s.getContext("2d");if(!e)return;const n=P.match(/var\((--[^,\s)]+)/)?.[1],g=n?getComputedStyle(s.parentElement??document.documentElement).getPropertyValue(n).trim()||"#f8fafc":P;if(e.fillStyle=g,e.fillRect(0,0,l,t),ns){e.strokeStyle="#E5E5E5",e.lineWidth=1,e.globalAlpha=.3;for(let a=0;a<=l;a+=20)e.beginPath(),e.moveTo(a,0),e.lineTo(a,t),e.stroke();for(let a=0;a<=t;a+=20)e.beginPath(),e.moveTo(0,a),e.lineTo(l,a),e.stroke()}e.globalAlpha=1,p.forEach(a=>{if(!(a.points.length<2)){e.strokeStyle=a.color,e.lineWidth=a.size,e.globalAlpha=a.opacity,e.lineCap="round",e.lineJoin="round",a.tool==="eraser"?e.globalCompositeOperation="destination-out":e.globalCompositeOperation="source-over",e.beginPath(),e.moveTo(a.points[0].x,a.points[0].y);for(let c=1;c<a.points.length;c++)e.lineTo(a.points[c].x,a.points[c].y);e.stroke()}}),e.globalAlpha=1,e.globalCompositeOperation="source-over"},[p,P,ns,l,t]);i.useEffect(()=>{ls()},[ls]);const Ls=i.useCallback(s=>{if(m||!rs)return;const e=C.current;if(!e)return;const n=e.getBoundingClientRect(),g=s.clientX-n.left,a=s.clientY-n.top;os(!0);const c={id:`stroke-${Date.now()}-${d}`,userId:d,userName:Q?.name||"Unknown",userColor:Q?.color||x,points:[{x:g,y:a}],tool:v,color:x,size:Z,opacity:v==="marker"?.7:1,timestamp:Date.now(),isComplete:!1};J(c),y&&M("draw")},[m,rs,d,Q,v,x,Z,y,M]),Ns=i.useCallback(s=>{if(!ts||!h||m)return;const e=C.current;if(!e)return;const n=e.getBoundingClientRect(),g=s.clientX-n.left,a=s.clientY-n.top,c={...h,points:[...h.points,{x:g,y:a}]};J(c),f(w=>[...w.filter(j=>j.id!==c.id),c])},[ts,h,m]),is=i.useCallback(()=>{if(!h||m)return;const s={...h,isComplete:!0};f(e=>{const n=[...e.filter(g=>g.id!==s.id),s].slice(-U);return T(g=>[...g,e]),D([]),n}),b?.(s),J(null),os(!1)},[h,m,U,b]),Es=()=>{if(S.length===0)return;const s=S[S.length-1];D(e=>[p,...e]),T(e=>e.slice(0,-1)),f(s),ws?.()},As=()=>{if(H.length===0)return;const s=H[0];T(e=>[...e,p]),D(e=>e.slice(1)),f(s),xs?.()},Is=()=>{T(s=>[...s,p]),D([]),f([]),fs?.()},Fs=({user:s})=>r.jsxs(qs.div,{className:"glass-absolute glass-pointer-events-none glass-z-20",style:{left:`${Math.min(100,Math.max(0,s.cursorX/Math.max(l,1)*100))}%`,top:`${Math.min(100,Math.max(0,s.cursorY/Math.max(t,1)*100))}%`,transform:"translate(-2px, -2px)",maxWidth:"calc(100% - 4px)"},animate:bs?{}:{scale:s.isDrawing?1.2:1,opacity:Date.now()-s.lastActivity<5e3?1:.5},transition:js({type:"spring",stiffness:400,damping:30}),children:[r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",children:r.jsx("path",{d:"M5 3L19 12L12 14L9 21L5 3Z",fill:s.color,stroke:"white",strokeWidth:"1"})}),r.jsx("div",{className:"glass-mt-2 glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius",style:ss({variant:"default",radius:"sm"}),children:s.name})]});return r.jsx(Ys,{ref:ys,intensity:"subtle",className:k("glass-shared-whiteboard glass-relative",ks),...Us,children:r.jsxs("div",{className:"glass-flex glass-flex-col glass-space-y-4",children:[ms&&!m&&r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-p-3 glass-radius-lg glass-flex-wrap glass-gap-3",style:ss({variant:"default",radius:"lg"}),children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-flex-wrap glass-gap-3 glass-min-w-0 glass-max-w-full",children:[r.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:Xs.map(s=>r.jsx("button",{onClick:()=>Cs(s.id),className:k("glass-p-2 glass-radius-full glass-border glass-border-white/20 glass-bg-white/15 glass-text-sm glass-font-medium glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",v===s.id?"glass-surface-subtle/20 glass-text-primary":"glass-text-secondary"),title:s.name,children:s.icon},s.id))}),r.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:Gs.map((s,e)=>r.jsx("button",{onClick:()=>vs(s),className:k("glass-w-6 glass-h-6 glass-radius glass-border-2 glass-transition-transform glass-focus glass-touch-target glass-contrast-guard",x===s?"glass-border-white":"glass-border-white/30"),style:{backgroundColor:s,boxShadow:x===s?"0 0 0 2px var(--glass-theme-text, var(--glass-text-primary))":void 0},"aria-label":`Select color ${s}`},`${s}-${e}`))}),r.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:zs.map(s=>r.jsx("button",{onClick:()=>Ss(s),className:k("glass-w-8 glass-h-8 glass-radius glass-flex glass-items-center glass-justify-center glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",Z===s?"glass-surface-subtle/20 glass-text-primary":"glass-text-secondary"),"aria-label":`Select brush size ${s}px`,children:r.jsx("div",{className:"glass-bg-transparent glass-radius-full",style:{width:Math.min(s,16),height:Math.min(s,16)}})},s))})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-flex-wrap glass-gap-2",children:[ps&&r.jsxs(r.Fragment,{children:[r.jsx("button",{onClick:Es,disabled:S.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↶ Undo"}),r.jsx("button",{onClick:As,disabled:H.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↷ Redo"})]}),r.jsx("button",{onClick:Is,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Clear"})]})]}),r.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[r.jsxs("div",{className:"glass-shared-whiteboard-canvas glass-relative glass-flex-1 glass-min-w-0 glass-max-w-full glass-overflow-hidden",children:[r.jsx("canvas",{ref:C,width:l,height:t,className:k("glass-border glass-border-white/20 glass-radius-lg glass-cursor-crosshair",m&&"glass-cursor-not-allowed"),style:{width:"100%",maxWidth:l,height:"auto",display:"block"},onMouseDown:Ls,onMouseMove:Ns,onMouseUp:is,onMouseLeave:is}),gs&&r.jsx(Bs,{children:K.filter(s=>s.id!==d).map(s=>r.jsx(Fs,{user:s},s.id))}),!m&&r.jsx("button",{onClick:()=>Ds(s=>!s),className:"glass-absolute glass-top-2 glass-right-2 glass-p-2 glass-text-primary-glass-opacity-60 hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Grid",children:"#"})]}),hs&&r.jsxs("div",{className:"glass-shared-whiteboard-user-list glass-p-3 glass-radius-lg glass-space-y-2",style:ss({variant:"default",radius:"lg"}),children:[r.jsxs("h3",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-3",children:["Active Users (",K.length,")"]}),K.map(s=>r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[r.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full glass-border glass-border-white/30",style:{backgroundColor:s.color}}),r.jsxs("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80 glass-truncate",children:[s.name,s.id===d&&" (You)"]}),s.isDrawing&&r.jsx("span",{className:"glass-text-xs glass-text-primary",children:"✏️"})]},s.id))]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-50",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[r.jsxs("span",{children:[p.length," strokes"]}),O&&r.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),r.jsx("span",{children:"Synced"})]}),m&&r.jsx("span",{className:"glass-text-primary",children:"Read Only"})]}),r.jsxs("div",{children:["Canvas: ",l,"×",t]})]})]})})});try{es.displayName="GlassSharedWhiteboard",es.__docgenInfo={description:"",displayName:"GlassSharedWhiteboard",props:{width:{defaultValue:{value:"800"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},users:{defaultValue:null,description:"",name:"users",required:!0,type:{name:"WhiteboardUser[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!0,type:{name:"string"}},strokes:{defaultValue:{value:"[]"},description:"",name:"strokes",required:!1,type:{name:"DrawingStroke[] | undefined"}},backgroundColor:{defaultValue:{value:"var(--glass-white)"},description:"",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},gridVisible:{defaultValue:{value:"false"},description:"",name:"gridVisible",required:!1,type:{name:"boolean | undefined"}},showUserCursors:{defaultValue:{value:"true"},description:"",name:"showUserCursors",required:!1,type:{name:"boolean | undefined"}},showToolbar:{defaultValue:{value:"true"},description:"",name:"showToolbar",required:!1,type:{name:"boolean | undefined"}},showUserList:{defaultValue:{value:"true"},description:"",name:"showUserList",required:!1,type:{name:"boolean | undefined"}},showUndoRedo:{defaultValue:{value:"true"},description:"",name:"showUndoRedo",required:!1,type:{name:"boolean | undefined"}},maxStrokes:{defaultValue:{value:"1000"},description:"",name:"maxStrokes",required:!1,type:{name:"number | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},canDraw:{defaultValue:{value:"true"},description:"",name:"canDraw",required:!1,type:{name:"boolean | undefined"}},readOnly:{defaultValue:{value:"false"},description:"",name:"readOnly",required:!1,type:{name:"boolean | undefined"}},onStroke:{defaultValue:null,description:"",name:"onStroke",required:!1,type:{name:"((stroke: DrawingStroke) => void) | undefined"}},onClear:{defaultValue:null,description:"",name:"onClear",required:!1,type:{name:"(() => void) | undefined"}},onUndo:{defaultValue:null,description:"",name:"onUndo",required:!1,type:{name:"(() => void) | undefined"}},onRedo:{defaultValue:null,description:"",name:"onRedo",required:!1,type:{name:"(() => void) | undefined"}},onUserCursorMove:{defaultValue:null,description:"",name:"onUserCursorMove",required:!1,type:{name:"((userId: string, x: number, y: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"user1",name:"Alice Johnson",color:"#FF6B6B",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",cursorX:150,cursorY:100,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()},{id:"user2",name:"Bob Smith",color:"#4ECDC4",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",cursorX:300,cursorY:200,isDrawing:!0,currentTool:"marker",lastActivity:Date.now()-1e3},{id:"user3",name:"Carol Davis",color:"#45B7D1",cursorX:450,cursorY:150,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()-2e3},{id:"current",name:"You",color:"#96CEB4",cursorX:200,cursorY:250,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()}],u=[{id:"stroke1",userId:"user1",userName:"Alice Johnson",userColor:"#FF6B6B",points:[{x:100,y:100},{x:150,y:120},{x:200,y:110},{x:250,y:130}],tool:"pen",color:"#FF6B6B",size:4,opacity:1,timestamp:Date.now()-1e4,isComplete:!0},{id:"stroke2",userId:"user2",userName:"Bob Smith",userColor:"#4ECDC4",points:[{x:200,y:200},{x:220,y:180},{x:240,y:200},{x:260,y:180},{x:280,y:200}],tool:"marker",color:"#4ECDC4",size:8,opacity:.7,timestamp:Date.now()-5e3,isComplete:!0}],ee={title:"Workflows/Glass Shared Whiteboard",component:es,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},backgroundColor:{control:{type:"color"},type:"string",table:{type:{summary:"string"}}}}},L={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0,canDraw:!0}},N={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,gridVisible:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},E={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0,soundEnabled:!0}},A={args:{width:800,height:600,users:o.slice(0,2),currentUserId:"current",strokes:u,readOnly:!0,showUserCursors:!1,showToolbar:!1,showUserList:!0,canDraw:!1}},I={args:{width:700,height:500,users:o,currentUserId:"current",strokes:u,showUserCursors:!1,showToolbar:!1,showUserList:!1,showUndoRedo:!1}},F={args:{width:500,height:400,users:o.slice(0,2),currentUserId:"current",strokes:[],showUserCursors:!0,showToolbar:!0,showUserList:!0}},R={args:{width:1e3,height:700,users:o,currentUserId:"current",strokes:u,showUserCursors:!0,showToolbar:!0,showUserList:!0,realTimeSync:!0}},V={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u.map(l=>({...l,color:l.color==="#FF6B6B"?"#FF8A8A":l.color==="#4ECDC4"?"#6EEEE4":l.color})),backgroundColor:"#2A2A2A",showUserCursors:!0,showToolbar:!0,showUserList:!0}},B={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,showToolbar:!1,showUserCursors:!0,showUserList:!0,canDraw:!0}},q={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,showToolbar:!0,showUserCursors:!0,showUserList:!1}},_={args:{width:800,height:600,users:[o.find(l=>l.id==="current")],currentUserId:"current",strokes:[],showUserCursors:!1,showToolbar:!0,showUserList:!1,showUndoRedo:!0}},$={args:{width:900,height:650,users:[...o,...Array.from({length:6},(l,t)=>({id:`extra-${t}`,name:`User ${t+5}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF"][t],cursorX:Math.random()*800,cursorY:Math.random()*500,isDrawing:Math.random()>.7,currentTool:"pen",lastActivity:Date.now()-Math.random()*5e3}))],currentUserId:"current",strokes:u,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},W={args:{width:800,height:600,users:o,currentUserId:"current",strokes:[...u,...Array.from({length:20},(l,t)=>({id:`stroke-${t+3}`,userId:o[t%o.length].id,userName:o[t%o.length].name,userColor:o[t%o.length].color,points:Array.from({length:5},(z,d)=>({x:100+t*30+d*10,y:150+Math.sin(t+d)*50})),tool:["pen","marker"][t%2],color:o[t%o.length].color,size:[2,4,6,8][t%4],opacity:t%2===0?1:.7,timestamp:Date.now()-t*1e3,isComplete:!0}))],showUserCursors:!0,showToolbar:!0,showUserList:!0}},Y={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,soundEnabled:!1,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},X={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,maxStrokes:10,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0}},G={args:{width:800,height:600,users:o,currentUserId:"current",strokes:u,backgroundColor:"#F0F8FF",showUserCursors:!0,showToolbar:!0,showUserList:!0}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true,
    showUndoRedo: true,
    canDraw: true
  }
}`,...L.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    gridVisible: true,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...N.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    realTimeSync: true,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true,
    soundEnabled: true
  }
}`,...E.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers.slice(0, 2),
    currentUserId: 'current',
    strokes: mockStrokes,
    readOnly: true,
    showUserCursors: false,
    showToolbar: false,
    showUserList: true,
    canDraw: false
  }
}`,...A.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    width: 700,
    height: 500,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    showUserCursors: false,
    showToolbar: false,
    showUserList: false,
    showUndoRedo: false
  }
}`,...I.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    width: 500,
    height: 400,
    users: mockUsers.slice(0, 2),
    currentUserId: 'current',
    strokes: [],
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...F.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    width: 1000,
    height: 700,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true,
    realTimeSync: true
  }
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes.map(stroke => ({
      ...stroke,
      color: stroke.color === '#FF6B6B' ? '#FF8A8A' : stroke.color === '#4ECDC4' ? '#6EEEE4' : stroke.color
    })),
    backgroundColor: '#2A2A2A',
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...V.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    showToolbar: false,
    showUserCursors: true,
    showUserList: true,
    canDraw: true
  }
}`,...B.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    showToolbar: true,
    showUserCursors: true,
    showUserList: false
  }
}`,...q.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: [mockUsers.find(u => u.id === 'current')!],
    currentUserId: 'current',
    strokes: [],
    showUserCursors: false,
    showToolbar: true,
    showUserList: false,
    showUndoRedo: true
  }
}`,..._.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    width: 900,
    height: 650,
    users: [...mockUsers, ...Array.from({
      length: 6
    }, (_, i) => ({
      id: \`extra-\${i}\`,
      name: \`User \${i + 5}\`,
      color: ['#EE5A6F', '#0FB9B1', '#3867D6', '#1DD1A1', '#FD79A8', '#54A0FF'][i],
      cursorX: Math.random() * 800,
      cursorY: Math.random() * 500,
      isDrawing: Math.random() > 0.7,
      currentTool: 'pen',
      lastActivity: Date.now() - Math.random() * 5000
    }))],
    currentUserId: 'current',
    strokes: mockStrokes,
    realTimeSync: true,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...$.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: [...mockStrokes, ...Array.from({
      length: 20
    }, (_, i) => ({
      id: \`stroke-\${i + 3}\`,
      userId: mockUsers[i % mockUsers.length].id,
      userName: mockUsers[i % mockUsers.length].name,
      userColor: mockUsers[i % mockUsers.length].color,
      points: Array.from({
        length: 5
      }, (_, j) => ({
        x: 100 + i * 30 + j * 10,
        y: 150 + Math.sin(i + j) * 50
      })),
      tool: ['pen', 'marker'][i % 2] as any,
      color: mockUsers[i % mockUsers.length].color,
      size: [2, 4, 6, 8][i % 4],
      opacity: i % 2 === 0 ? 1 : 0.7,
      timestamp: Date.now() - i * 1000,
      isComplete: true
    }))],
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...W.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    soundEnabled: false,
    realTimeSync: true,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...Y.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    maxStrokes: 10,
    showUserCursors: true,
    showToolbar: true,
    showUserList: true,
    showUndoRedo: true
  }
}`,...X.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    width: 800,
    height: 600,
    users: mockUsers,
    currentUserId: 'current',
    strokes: mockStrokes,
    backgroundColor: '#F0F8FF',
    showUserCursors: true,
    showToolbar: true,
    showUserList: true
  }
}`,...G.parameters?.docs?.source}}};const re=["Default","WithGrid","RealTimeCollaboration","ReadOnlyMode","MinimalInterface","SmallCanvas","LargeCanvas","DarkBackground","NoToolbar","NoUserList","SoloMode","ManyUsers","WithManyStrokes","SilentMode","LimitedStrokes","CustomBackground"];export{G as CustomBackground,V as DarkBackground,L as Default,R as LargeCanvas,X as LimitedStrokes,$ as ManyUsers,I as MinimalInterface,B as NoToolbar,q as NoUserList,A as ReadOnlyMode,E as RealTimeCollaboration,Y as SilentMode,F as SmallCanvas,_ as SoloMode,N as WithGrid,W as WithManyStrokes,re as __namedExportsOrder,ee as default};
