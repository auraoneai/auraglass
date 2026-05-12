import{r as l,b as Vs,j as r,c as U,e as Bs,m as qs}from"./iframe-CN7unHsM.js";import{u as _s}from"./soundDesign-3nd8Vwmb.js";import{u as Ys}from"./a11y-snjFlI8c.js";import{u as Ws}from"./useMotionPreference-BvsDpG-4.js";import{c as Q}from"./createGlassStyle-BfWnO-qv.js";import{O as $s}from"./OptimizedGlassCore-CD-CmIfG.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CKMFLbhe.js";const Xs=[{id:"pen",name:"Pen",icon:"✏️"},{id:"marker",name:"Marker",icon:"🖍️"},{id:"eraser",name:"Eraser",icon:"🧽"},{id:"shape",name:"Shape",icon:"📐"}],Gs=["var(--glass-black)","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FF8000","#8000FF","#FF0080"],zs=[2,4,8,12,16,24],ss=l.forwardRef(({width:n=800,height:a=600,users:z,currentUserId:u,strokes:us=[],backgroundColor:es="var(--glass-white)",gridVisible:ds=!1,showUserCursors:gs=!0,showToolbar:ms=!0,showUserList:hs=!0,showUndoRedo:ps=!0,maxStrokes:x=1e3,realTimeSync:P=!1,soundEnabled:y=!0,canDraw:rs=!0,readOnly:d=!1,onStroke:b,onClear:fs,onUndo:ws,onRedo:ks,onUserCursorMove:ts,className:Us="",...xs},ys)=>{const bs=Vs(),C=l.useRef(null),[as,os]=l.useState(!1),[m,O]=l.useState(null),[v,Cs]=l.useState("pen"),[w,vs]=l.useState("var(--glass-black)"),[J,Ss]=l.useState(4),[h,p]=l.useState(us),[S,T]=l.useState([]),[Z,D]=l.useState([]),[H,Ts]=l.useState(z),[ns,Ds]=l.useState(ds),{play:F}=_s();Ys("glass-shared-whiteboard");const{shouldAnimate:Fs}=Ws(),Ms=s=>Fs?s:{duration:0},K=z.find(s=>s.id===u);l.useEffect(()=>{if(!P)return;const s=setInterval(()=>{Ts(e=>e.map(t=>{if(t.id===u)return t;const i=(Math.random()-.5)*50,k=(Math.random()-.5)*50,g=Math.max(0,Math.min(n,t.cursorX+i)),f=Math.max(0,Math.min(a,t.cursorY+k)),M=Math.random()<.1;if(M&&Math.random()<.3){const cs={id:`stroke-${Date.now()}-${t.id}`,userId:t.id,userName:t.name,userColor:t.color,points:[{x:g,y:f},{x:g+Math.random()*20,y:f+Math.random()*20}],tool:"pen",color:t.color,size:3,opacity:.8,timestamp:Date.now(),isComplete:!0};p(Rs=>[...Rs.slice(-x+1),cs]),b?.(cs),y&&F("draw")}return ts?.(t.id,g,f),{...t,cursorX:g,cursorY:f,isDrawing:M,lastActivity:Date.now()}}))},200);return()=>clearInterval(s)},[P,u,n,a,x,b,ts,y,F]);const ls=l.useCallback(()=>{const s=C.current;if(!s)return;const e=s.getContext("2d");if(e){if(e.fillStyle=es,e.fillRect(0,0,n,a),ns){e.strokeStyle="#E5E5E5",e.lineWidth=1,e.globalAlpha=.3;for(let t=0;t<=n;t+=20)e.beginPath(),e.moveTo(t,0),e.lineTo(t,a),e.stroke();for(let t=0;t<=a;t+=20)e.beginPath(),e.moveTo(0,t),e.lineTo(n,t),e.stroke()}e.globalAlpha=1,h.forEach(t=>{if(!(t.points.length<2)){e.strokeStyle=t.color,e.lineWidth=t.size,e.globalAlpha=t.opacity,e.lineCap="round",e.lineJoin="round",t.tool==="eraser"?e.globalCompositeOperation="destination-out":e.globalCompositeOperation="source-over",e.beginPath(),e.moveTo(t.points[0].x,t.points[0].y);for(let i=1;i<t.points.length;i++)e.lineTo(t.points[i].x,t.points[i].y);e.stroke()}}),e.globalAlpha=1,e.globalCompositeOperation="source-over"}},[h,es,ns,n,a]);l.useEffect(()=>{ls()},[ls]);const js=l.useCallback(s=>{if(d||!rs)return;const e=C.current;if(!e)return;const t=e.getBoundingClientRect(),i=s.clientX-t.left,k=s.clientY-t.top;os(!0);const g={id:`stroke-${Date.now()}-${u}`,userId:u,userName:K?.name||"Unknown",userColor:K?.color||w,points:[{x:i,y:k}],tool:v,color:w,size:J,opacity:v==="marker"?.7:1,timestamp:Date.now(),isComplete:!1};O(g),y&&F("draw")},[d,rs,u,K,v,w,J,y,F]),Ls=l.useCallback(s=>{if(!as||!m||d)return;const e=C.current;if(!e)return;const t=e.getBoundingClientRect(),i=s.clientX-t.left,k=s.clientY-t.top,g={...m,points:[...m.points,{x:i,y:k}]};O(g),p(f=>[...f.filter(M=>M.id!==g.id),g])},[as,m,d]),is=l.useCallback(()=>{if(!m||d)return;const s={...m,isComplete:!0};p(e=>{const t=[...e.filter(i=>i.id!==s.id),s].slice(-x);return T(i=>[...i,e]),D([]),t}),b?.(s),O(null),os(!1)},[m,d,x,b]),Ns=()=>{if(S.length===0)return;const s=S[S.length-1];D(e=>[h,...e]),T(e=>e.slice(0,-1)),p(s),ws?.()},As=()=>{if(Z.length===0)return;const s=Z[0];T(e=>[...e,h]),D(e=>e.slice(1)),p(s),ks?.()},Es=()=>{T(s=>[...s,h]),D([]),p([]),fs?.()},Is=({user:s})=>r.jsxs(qs.div,{className:"glass-absolute glass-pointer-events-none glass-z-20",style:{left:s.cursorX,top:s.cursorY,transform:"translate(-2px, -2px)"},animate:bs?{}:{scale:s.isDrawing?1.2:1,opacity:Date.now()-s.lastActivity<5e3?1:.5},transition:Ms({type:"spring",stiffness:400,damping:30}),children:[r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",children:r.jsx("path",{d:"M5 3L19 12L12 14L9 21L5 3Z",fill:s.color,stroke:"white",strokeWidth:"1"})}),r.jsx("div",{className:"glass-mt-2 glass-px-2 glass-py-1 glass-text-xs glass-font-medium glass-text-primary glass-radius",style:Q({variant:"default",radius:"sm"}),children:s.name})]});return r.jsx($s,{ref:ys,intensity:"subtle",className:U("glass-relative",Us),...xs,children:r.jsxs("div",{className:"glass-flex glass-flex-col glass-space-y-4",children:[ms&&!d&&r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-p-3 glass-radius-lg glass-flex-wrap glass-gap-3",style:Q({variant:"default",radius:"lg"}),children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-flex-wrap glass-gap-3",children:[r.jsx("div",{className:"glass-flex glass-space-x-2",children:Xs.map(s=>r.jsx("button",{onClick:()=>Cs(s.id),className:U("glass-p-2 glass-radius glass-text-sm glass-font-medium glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",v===s.id?"glass-surface-subtle/20 glass-text-primary":"glass-text-secondary"),title:s.name,children:s.icon},s.id))}),r.jsx("div",{className:"glass-flex glass-space-x-1",children:Gs.map((s,e)=>r.jsx("button",{onClick:()=>vs(s),className:U("glass-w-6 glass-h-6 glass-radius glass-border-2 glass-transition-transform glass-focus glass-touch-target glass-contrast-guard",w===s?"glass-border-white":"glass-border-white/30"),style:{backgroundColor:s,transform:w===s?"scale(1.1)":void 0},"aria-label":`Select color ${s}`},`${s}-${e}`))}),r.jsx("div",{className:"glass-flex glass-space-x-1",children:zs.map(s=>r.jsx("button",{onClick:()=>Ss(s),className:U("glass-w-8 glass-h-8 glass-radius glass-flex glass-items-center glass-justify-center glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",J===s?"glass-surface-subtle/20 glass-text-primary":"glass-text-secondary"),"aria-label":`Select brush size ${s}px`,children:r.jsx("div",{className:"glass-bg-transparent glass-radius-full",style:{width:Math.min(s,16),height:Math.min(s,16)}})},s))})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-flex-wrap glass-gap-2",children:[ps&&r.jsxs(r.Fragment,{children:[r.jsx("button",{onClick:Ns,disabled:S.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↶ Undo"}),r.jsx("button",{onClick:As,disabled:Z.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↷ Redo"})]}),r.jsx("button",{onClick:Es,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Clear"})]})]}),r.jsxs("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:[r.jsxs("div",{className:"glass-relative glass-flex-1 glass-min-w-0",children:[r.jsx("canvas",{ref:C,width:n,height:a,className:U("glass-border glass-border-white/20 glass-radius-lg glass-cursor-crosshair",d&&"glass-cursor-not-allowed"),style:{width:"100%",maxWidth:n,height:"auto",display:"block"},onMouseDown:js,onMouseMove:Ls,onMouseUp:is,onMouseLeave:is}),gs&&r.jsx(Bs,{children:H.filter(s=>s.id!==u).map(s=>r.jsx(Is,{user:s},s.id))}),!d&&r.jsx("button",{onClick:()=>Ds(s=>!s),className:"glass-absolute glass-top-2 glass-right-2 glass-p-2 glass-text-primary-glass-opacity-60 hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Grid",children:"#"})]}),hs&&r.jsxs("div",{className:"glass-w-48 glass-p-3 glass-radius-lg glass-space-y-2",style:Q({variant:"default",radius:"lg"}),children:[r.jsxs("h3",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-3",children:["Active Users (",H.length,")"]}),H.map(s=>r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[r.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full glass-border glass-border-white/30",style:{backgroundColor:s.color}}),r.jsxs("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80 glass-truncate",children:[s.name,s.id===u&&" (You)"]}),s.isDrawing&&r.jsx("span",{className:"glass-text-xs glass-text-primary",children:"✏️"})]},s.id))]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-50",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[r.jsxs("span",{children:[h.length," strokes"]}),P&&r.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"}),r.jsx("span",{children:"Synced"})]}),d&&r.jsx("span",{className:"glass-text-primary",children:"Read Only"})]}),r.jsxs("div",{children:["Canvas: ",n,"×",a]})]})]})})});try{ss.displayName="GlassSharedWhiteboard",ss.__docgenInfo={description:"",displayName:"GlassSharedWhiteboard",props:{width:{defaultValue:{value:"800"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},users:{defaultValue:null,description:"",name:"users",required:!0,type:{name:"WhiteboardUser[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!0,type:{name:"string"}},strokes:{defaultValue:{value:"[]"},description:"",name:"strokes",required:!1,type:{name:"DrawingStroke[] | undefined"}},backgroundColor:{defaultValue:{value:"var(--glass-white)"},description:"",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},gridVisible:{defaultValue:{value:"false"},description:"",name:"gridVisible",required:!1,type:{name:"boolean | undefined"}},showUserCursors:{defaultValue:{value:"true"},description:"",name:"showUserCursors",required:!1,type:{name:"boolean | undefined"}},showToolbar:{defaultValue:{value:"true"},description:"",name:"showToolbar",required:!1,type:{name:"boolean | undefined"}},showUserList:{defaultValue:{value:"true"},description:"",name:"showUserList",required:!1,type:{name:"boolean | undefined"}},showUndoRedo:{defaultValue:{value:"true"},description:"",name:"showUndoRedo",required:!1,type:{name:"boolean | undefined"}},maxStrokes:{defaultValue:{value:"1000"},description:"",name:"maxStrokes",required:!1,type:{name:"number | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},canDraw:{defaultValue:{value:"true"},description:"",name:"canDraw",required:!1,type:{name:"boolean | undefined"}},readOnly:{defaultValue:{value:"false"},description:"",name:"readOnly",required:!1,type:{name:"boolean | undefined"}},onStroke:{defaultValue:null,description:"",name:"onStroke",required:!1,type:{name:"((stroke: DrawingStroke) => void) | undefined"}},onClear:{defaultValue:null,description:"",name:"onClear",required:!1,type:{name:"(() => void) | undefined"}},onUndo:{defaultValue:null,description:"",name:"onUndo",required:!1,type:{name:"(() => void) | undefined"}},onRedo:{defaultValue:null,description:"",name:"onRedo",required:!1,type:{name:"(() => void) | undefined"}},onUserCursorMove:{defaultValue:null,description:"",name:"onUserCursorMove",required:!1,type:{name:"((userId: string, x: number, y: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const o=[{id:"user1",name:"Alice Johnson",color:"#FF6B6B",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",cursorX:150,cursorY:100,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()},{id:"user2",name:"Bob Smith",color:"#4ECDC4",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",cursorX:300,cursorY:200,isDrawing:!0,currentTool:"marker",lastActivity:Date.now()-1e3},{id:"user3",name:"Carol Davis",color:"#45B7D1",cursorX:450,cursorY:150,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()-2e3},{id:"current",name:"You",color:"#96CEB4",cursorX:200,cursorY:250,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()}],c=[{id:"stroke1",userId:"user1",userName:"Alice Johnson",userColor:"#FF6B6B",points:[{x:100,y:100},{x:150,y:120},{x:200,y:110},{x:250,y:130}],tool:"pen",color:"#FF6B6B",size:4,opacity:1,timestamp:Date.now()-1e4,isComplete:!0},{id:"stroke2",userId:"user2",userName:"Bob Smith",userColor:"#4ECDC4",points:[{x:200,y:200},{x:220,y:180},{x:240,y:200},{x:260,y:180},{x:280,y:200}],tool:"marker",color:"#4ECDC4",size:8,opacity:.7,timestamp:Date.now()-5e3,isComplete:!0}],ee={title:"Workflows/Glass Shared Whiteboard",component:ss,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},backgroundColor:{control:{type:"color"},type:"string",table:{type:{summary:"string"}}}}},j={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0,canDraw:!0}},L={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,gridVisible:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},N={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0,soundEnabled:!0}},A={args:{width:800,height:600,users:o.slice(0,2),currentUserId:"current",strokes:c,readOnly:!0,showUserCursors:!1,showToolbar:!1,showUserList:!0,canDraw:!1}},E={args:{width:700,height:500,users:o,currentUserId:"current",strokes:c,showUserCursors:!1,showToolbar:!1,showUserList:!1,showUndoRedo:!1}},I={args:{width:500,height:400,users:o.slice(0,2),currentUserId:"current",strokes:[],showUserCursors:!0,showToolbar:!0,showUserList:!0}},R={args:{width:1e3,height:700,users:o,currentUserId:"current",strokes:c,showUserCursors:!0,showToolbar:!0,showUserList:!0,realTimeSync:!0}},V={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c.map(n=>({...n,color:n.color==="#FF6B6B"?"#FF8A8A":n.color==="#4ECDC4"?"#6EEEE4":n.color})),backgroundColor:"#2A2A2A",showUserCursors:!0,showToolbar:!0,showUserList:!0}},B={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,showToolbar:!1,showUserCursors:!0,showUserList:!0,canDraw:!0}},q={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,showToolbar:!0,showUserCursors:!0,showUserList:!1}},_={args:{width:800,height:600,users:[o.find(n=>n.id==="current")],currentUserId:"current",strokes:[],showUserCursors:!1,showToolbar:!0,showUserList:!1,showUndoRedo:!0}},Y={args:{width:900,height:650,users:[...o,...Array.from({length:6},(n,a)=>({id:`extra-${a}`,name:`User ${a+5}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF"][a],cursorX:Math.random()*800,cursorY:Math.random()*500,isDrawing:Math.random()>.7,currentTool:"pen",lastActivity:Date.now()-Math.random()*5e3}))],currentUserId:"current",strokes:c,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},W={args:{width:800,height:600,users:o,currentUserId:"current",strokes:[...c,...Array.from({length:20},(n,a)=>({id:`stroke-${a+3}`,userId:o[a%o.length].id,userName:o[a%o.length].name,userColor:o[a%o.length].color,points:Array.from({length:5},(z,u)=>({x:100+a*30+u*10,y:150+Math.sin(a+u)*50})),tool:["pen","marker"][a%2],color:o[a%o.length].color,size:[2,4,6,8][a%4],opacity:a%2===0?1:.7,timestamp:Date.now()-a*1e3,isComplete:!0}))],showUserCursors:!0,showToolbar:!0,showUserList:!0}},$={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,soundEnabled:!1,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},X={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,maxStrokes:10,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0}},G={args:{width:800,height:600,users:o,currentUserId:"current",strokes:c,backgroundColor:"#F0F8FF",showUserCursors:!0,showToolbar:!0,showUserList:!0}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};const re=["Default","WithGrid","RealTimeCollaboration","ReadOnlyMode","MinimalInterface","SmallCanvas","LargeCanvas","DarkBackground","NoToolbar","NoUserList","SoloMode","ManyUsers","WithManyStrokes","SilentMode","LimitedStrokes","CustomBackground"];export{G as CustomBackground,V as DarkBackground,j as Default,R as LargeCanvas,X as LimitedStrokes,Y as ManyUsers,E as MinimalInterface,B as NoToolbar,q as NoUserList,A as ReadOnlyMode,N as RealTimeCollaboration,$ as SilentMode,I as SmallCanvas,_ as SoloMode,L as WithGrid,W as WithManyStrokes,re as __namedExportsOrder,ee as default};
