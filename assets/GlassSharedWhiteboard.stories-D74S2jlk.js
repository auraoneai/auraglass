import{r as l,b as Re,h as Ve,j as r,e as Be,m as qe}from"./iframe-DBVOVM-c.js";import{u as $e}from"./soundDesign-CFDh3vcV.js";import{u as _e}from"./useMotionPreference-B98hKzBq.js";import{c as K}from"./createGlassStyle-BfWnO-qv.js";import{O as Ye}from"./OptimizedGlassCore-CyIux4a_.js";import"./preload-helper-PPVm8Dsz.js";const Xe=[{id:"pen",name:"Pen",icon:"✏️"},{id:"marker",name:"Marker",icon:"🖍️"},{id:"eraser",name:"Eraser",icon:"🧽"},{id:"shape",name:"Shape",icon:"📐"}],Ge=["var(--glass-black)","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FF8000","#8000FF","#FF0080"],We=[2,4,8,12,16,24],Q=l.forwardRef(({width:n=800,height:o=600,users:W,currentUserId:u,strokes:ce=[],backgroundColor:ee="var(--glass-white)",gridVisible:ue=!1,showUserCursors:de=!0,showToolbar:me=!0,showUserList:he=!0,showUndoRedo:ge=!0,maxStrokes:k=1e3,realTimeSync:z=!1,soundEnabled:U=!0,canDraw:se=!0,readOnly:d=!1,onStroke:x,onClear:pe,onUndo:we,onRedo:fe,onUserCursorMove:re,className:ke="",...Ue},xe)=>{const be=Re(),b=l.useRef(null),[te,oe]=l.useState(!1),[h,P]=l.useState(null),[y,ye]=l.useState("pen"),[C,Ce]=l.useState("var(--glass-black)"),[O,Se]=l.useState(4),[g,p]=l.useState(ce),[S,v]=l.useState([]),[J,T]=l.useState([]),[Z,ve]=l.useState(W),[ae,Te]=l.useState(ue),{play:D}=$e();Ve("glass-shared-whiteboard");const{shouldAnimate:De}=_e(),Fe=e=>De?e:{duration:0},H=W.find(e=>e.id===u);l.useEffect(()=>{if(!z)return;const e=setInterval(()=>{ve(s=>s.map(t=>{if(t.id===u)return t;const i=(Math.random()-.5)*50,f=(Math.random()-.5)*50,m=Math.max(0,Math.min(n,t.cursorX+i)),w=Math.max(0,Math.min(o,t.cursorY+f)),F=Math.random()<.1;if(F&&Math.random()<.3){const ie={id:`stroke-${Date.now()}-${t.id}`,userId:t.id,userName:t.name,userColor:t.color,points:[{x:m,y:w},{x:m+Math.random()*20,y:w+Math.random()*20}],tool:"pen",color:t.color,size:3,opacity:.8,timestamp:Date.now(),isComplete:!0};p(Ee=>[...Ee.slice(-k+1),ie]),x?.(ie),U&&D("draw")}return re?.(t.id,m,w),{...t,cursorX:m,cursorY:w,isDrawing:F,lastActivity:Date.now()}}))},200);return()=>clearInterval(e)},[z,u,n,o,k,x,re,U,D]);const ne=l.useCallback(()=>{const e=b.current;if(!e)return;const s=e.getContext("2d");if(s){if(s.fillStyle=ee,s.fillRect(0,0,n,o),ae){s.strokeStyle="#E5E5E5",s.lineWidth=1,s.globalAlpha=.3;for(let t=0;t<=n;t+=20)s.beginPath(),s.moveTo(t,0),s.lineTo(t,o),s.stroke();for(let t=0;t<=o;t+=20)s.beginPath(),s.moveTo(0,t),s.lineTo(n,t),s.stroke()}s.globalAlpha=1,g.forEach(t=>{if(!(t.points.length<2)){s.strokeStyle=t.color,s.lineWidth=t.size,s.globalAlpha=t.opacity,s.lineCap="round",s.lineJoin="round",t.tool==="eraser"?s.globalCompositeOperation="destination-out":s.globalCompositeOperation="source-over",s.beginPath(),s.moveTo(t.points[0].x,t.points[0].y);for(let i=1;i<t.points.length;i++)s.lineTo(t.points[i].x,t.points[i].y);s.stroke()}}),s.globalAlpha=1,s.globalCompositeOperation="source-over"}},[g,ee,ae,n,o]);l.useEffect(()=>{ne()},[ne]);const je=l.useCallback(e=>{if(d||!se)return;const s=b.current;if(!s)return;const t=s.getBoundingClientRect(),i=e.clientX-t.left,f=e.clientY-t.top;oe(!0);const m={id:`stroke-${Date.now()}-${u}`,userId:u,userName:H?.name||"Unknown",userColor:H?.color||C,points:[{x:i,y:f}],tool:y,color:C,size:O,opacity:y==="marker"?.7:1,timestamp:Date.now(),isComplete:!1};P(m),U&&D("draw")},[d,se,u,H,y,C,O,U,D]),Le=l.useCallback(e=>{if(!te||!h||d)return;const s=b.current;if(!s)return;const t=s.getBoundingClientRect(),i=e.clientX-t.left,f=e.clientY-t.top,m={...h,points:[...h.points,{x:i,y:f}]};P(m),p(w=>[...w.filter(F=>F.id!==m.id),m])},[te,h,d]),le=l.useCallback(()=>{if(!h||d)return;const e={...h,isComplete:!0};p(s=>{const t=[...s.filter(i=>i.id!==e.id),e].slice(-k);return v(i=>[...i,s]),T([]),t}),x?.(e),P(null),oe(!1)},[h,d,k,x]),Me=()=>{if(S.length===0)return;const e=S[S.length-1];T(s=>[g,...s]),v(s=>s.slice(0,-1)),p(e),we?.()},Ne=()=>{if(J.length===0)return;const e=J[0];v(s=>[...s,g]),T(s=>s.slice(1)),p(e),fe?.()},Ae=()=>{v(e=>[...e,g]),T([]),p([]),pe?.()},Ie=({user:e})=>r.jsxs(qe.div,{className:"glass-absolute glass-pointer-events-none glass-z-20",style:{left:e.cursorX,top:e.cursorY,transform:"translate(-2px, -2px)"},animate:be?{}:{scale:e.isDrawing?1.2:1,opacity:Date.now()-e.lastActivity<5e3?1:.5},transition:Fe({type:"spring",stiffness:400,damping:30}),children:[r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",children:r.jsx("path",{d:"M5 3L19 12L12 14L9 21L5 3Z",fill:e.color,stroke:"white",strokeWidth:"1"})}),r.jsx("div",{className:`
          mt-2 px-2 py-1 text-xs font-medium text-white rounded
          ${K({variant:"default"})}
        `,children:e.name})]});return r.jsx(Ye,{ref:xe,intensity:"subtle",className:`relative ${ke}`,...Ue,children:r.jsxs("div",{className:"glass-flex glass-flex-col glass-space-y-4",children:[me&&!d&&r.jsxs("div",{className:`
              flex items-center justify-between p-3 rounded-lg
              ${K({variant:"default"})}
            `,children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[r.jsx("div",{className:"glass-flex glass-space-x-2",children:Xe.map(e=>r.jsx("button",{onClick:()=>ye(e.id),className:`
                        p-2 rounded text-sm font-medium transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${y===e.id?"bg-white/20 text-white":"text-white/70 hover:text-white hover:bg-white/10"}
                      `,title:e.name,children:e.icon},e.id))}),r.jsx("div",{className:"glass-flex glass-space-x-1",children:Ge.map((e,s)=>r.jsx("button",{onClick:()=>Ce(e),className:`
                        w-6 h-6 rounded border-2 transition-transform duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${C===e?"border-white scale-110":"border-white/30 glass-hover-scale-105"}
                      `,style:{backgroundColor:e},"aria-label":`Select color ${e}`},`${e}-${s}`))}),r.jsx("div",{className:"glass-flex glass-space-x-1",children:We.map(e=>r.jsx("button",{onClick:()=>Se(e),className:`
                        w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 glass-focus glass-touch-target glass-contrast-guard
                        ${O===e?"bg-white/20 text-white":"text-white/70 hover:text-white hover:bg-white/10"}
                      `,"aria-label":`Select brush size ${e}px`,children:r.jsx("div",{className:"glass-bg-transparent glass-radius-full",style:{width:Math.min(e,16),height:Math.min(e,16)}})},e))})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2",children:[ge&&r.jsxs(r.Fragment,{children:[r.jsx("button",{onClick:Me,disabled:S.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↶ Undo"}),r.jsx("button",{onClick:Ne,disabled:J.length===0,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary-opacity-70 hover:glass-text-primary disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"↷ Redo"})]}),r.jsx("button",{onClick:Ae,className:"glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-primary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Clear"})]})]}),r.jsxs("div",{className:"glass-flex glass-space-x-4",children:[r.jsxs("div",{className:"glass-relative glass-flex-1",children:[r.jsx("canvas",{ref:b,width:n,height:o,className:`
                  border border-white/20 rounded-lg cursor-crosshair
                  ${d?"cursor-not-allowed":""}
                `,onMouseDown:je,onMouseMove:Le,onMouseUp:le,onMouseLeave:le}),de&&r.jsx(Be,{children:Z.filter(e=>e.id!==u).map(e=>r.jsx(Ie,{user:e},e.id))}),!d&&r.jsx("button",{onClick:()=>Te(e=>!e),className:"glass-absolute glass-top-2 glass-right-2 glass-p-2 glass-text-primary-glass-opacity-60 hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard",title:"Toggle Grid",children:"#"})]}),he&&r.jsxs("div",{className:`
                w-48 p-3 rounded-lg space-y-2
                ${K({variant:"default"})}
              `,children:[r.jsxs("h3",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-3",children:["Active Users (",Z.length,")"]}),Z.map(e=>r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-2 glass-p-2 glass-radius hover:glass-surface-subtle/5",children:[r.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full glass-border glass-border-white/30",style:{backgroundColor:e.color}}),r.jsxs("span",{className:"glass-text-sm glass-text-primary-glass-opacity-80 glass-truncate",children:[e.name,e.id===u&&" (You)"]}),e.isDrawing&&r.jsx("span",{className:"glass-text-xs glass-text-primary",children:"✏️"})]},e.id))]})]}),r.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-50",children:[r.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-4",children:[r.jsxs("span",{children:[g.length," strokes"]}),z&&r.jsxs("span",{className:"glass-flex glass-items-center glass-space-x-1",children:[r.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse"}),r.jsx("span",{children:"Synced"})]}),d&&r.jsx("span",{className:"glass-text-primary",children:"Read Only"})]}),r.jsxs("div",{children:["Canvas: ",n,"×",o]})]})]})})});try{Q.displayName="GlassSharedWhiteboard",Q.__docgenInfo={description:"",displayName:"GlassSharedWhiteboard",props:{width:{defaultValue:{value:"800"},description:"",name:"width",required:!1,type:{name:"number | undefined"}},height:{defaultValue:{value:"600"},description:"",name:"height",required:!1,type:{name:"number | undefined"}},users:{defaultValue:null,description:"",name:"users",required:!0,type:{name:"WhiteboardUser[]"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!0,type:{name:"string"}},strokes:{defaultValue:{value:"[]"},description:"",name:"strokes",required:!1,type:{name:"DrawingStroke[] | undefined"}},backgroundColor:{defaultValue:{value:"var(--glass-white)"},description:"",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},gridVisible:{defaultValue:{value:"false"},description:"",name:"gridVisible",required:!1,type:{name:"boolean | undefined"}},showUserCursors:{defaultValue:{value:"true"},description:"",name:"showUserCursors",required:!1,type:{name:"boolean | undefined"}},showToolbar:{defaultValue:{value:"true"},description:"",name:"showToolbar",required:!1,type:{name:"boolean | undefined"}},showUserList:{defaultValue:{value:"true"},description:"",name:"showUserList",required:!1,type:{name:"boolean | undefined"}},showUndoRedo:{defaultValue:{value:"true"},description:"",name:"showUndoRedo",required:!1,type:{name:"boolean | undefined"}},maxStrokes:{defaultValue:{value:"1000"},description:"",name:"maxStrokes",required:!1,type:{name:"number | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},canDraw:{defaultValue:{value:"true"},description:"",name:"canDraw",required:!1,type:{name:"boolean | undefined"}},readOnly:{defaultValue:{value:"false"},description:"",name:"readOnly",required:!1,type:{name:"boolean | undefined"}},onStroke:{defaultValue:null,description:"",name:"onStroke",required:!1,type:{name:"((stroke: DrawingStroke) => void) | undefined"}},onClear:{defaultValue:null,description:"",name:"onClear",required:!1,type:{name:"(() => void) | undefined"}},onUndo:{defaultValue:null,description:"",name:"onUndo",required:!1,type:{name:"(() => void) | undefined"}},onRedo:{defaultValue:null,description:"",name:"onRedo",required:!1,type:{name:"(() => void) | undefined"}},onUserCursorMove:{defaultValue:null,description:"",name:"onUserCursorMove",required:!1,type:{name:"((userId: string, x: number, y: number) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const a=[{id:"user1",name:"Alice Johnson",color:"#FF6B6B",avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",cursorX:150,cursorY:100,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()},{id:"user2",name:"Bob Smith",color:"#4ECDC4",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",cursorX:300,cursorY:200,isDrawing:!0,currentTool:"marker",lastActivity:Date.now()-1e3},{id:"user3",name:"Carol Davis",color:"#45B7D1",cursorX:450,cursorY:150,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()-2e3},{id:"current",name:"You",color:"#96CEB4",cursorX:200,cursorY:250,isDrawing:!1,currentTool:"pen",lastActivity:Date.now()}],c=[{id:"stroke1",userId:"user1",userName:"Alice Johnson",userColor:"#FF6B6B",points:[{x:100,y:100},{x:150,y:120},{x:200,y:110},{x:250,y:130}],tool:"pen",color:"#FF6B6B",size:4,opacity:1,timestamp:Date.now()-1e4,isComplete:!0},{id:"stroke2",userId:"user2",userName:"Bob Smith",userColor:"#4ECDC4",points:[{x:200,y:200},{x:220,y:180},{x:240,y:200},{x:260,y:180},{x:280,y:200}],tool:"marker",color:"#4ECDC4",size:8,opacity:.7,timestamp:Date.now()-5e3,isComplete:!0}],Ke={title:"Glass UI/Social/GlassSharedWhiteboard",component:Q,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{width:{control:{type:"range",min:400,max:1200,step:50}},height:{control:{type:"range",min:300,max:800,step:50}},backgroundColor:{control:{type:"color"},type:"string",table:{type:{summary:"string"}}}}},j={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0,canDraw:!0}},L={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,gridVisible:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},M={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0,soundEnabled:!0}},N={args:{width:800,height:600,users:a.slice(0,2),currentUserId:"current",strokes:c,readOnly:!0,showUserCursors:!1,showToolbar:!1,showUserList:!0,canDraw:!1}},A={args:{width:700,height:500,users:a,currentUserId:"current",strokes:c,showUserCursors:!1,showToolbar:!1,showUserList:!1,showUndoRedo:!1}},I={args:{width:500,height:400,users:a.slice(0,2),currentUserId:"current",strokes:[],showUserCursors:!0,showToolbar:!0,showUserList:!0}},E={args:{width:1e3,height:700,users:a,currentUserId:"current",strokes:c,showUserCursors:!0,showToolbar:!0,showUserList:!0,realTimeSync:!0}},R={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c.map(n=>({...n,color:n.color==="#FF6B6B"?"#FF8A8A":n.color==="#4ECDC4"?"#6EEEE4":n.color})),backgroundColor:"#2A2A2A",showUserCursors:!0,showToolbar:!0,showUserList:!0}},V={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,showToolbar:!1,showUserCursors:!0,showUserList:!0,canDraw:!0}},B={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,showToolbar:!0,showUserCursors:!0,showUserList:!1}},q={args:{width:800,height:600,users:[a.find(n=>n.id==="current")],currentUserId:"current",strokes:[],showUserCursors:!1,showToolbar:!0,showUserList:!1,showUndoRedo:!0}},$={args:{width:900,height:650,users:[...a,...Array.from({length:6},(n,o)=>({id:`extra-${o}`,name:`User ${o+5}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF"][o],cursorX:Math.random()*800,cursorY:Math.random()*500,isDrawing:Math.random()>.7,currentTool:"pen",lastActivity:Date.now()-Math.random()*5e3}))],currentUserId:"current",strokes:c,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},_={args:{width:800,height:600,users:a,currentUserId:"current",strokes:[...c,...Array.from({length:20},(n,o)=>({id:`stroke-${o+3}`,userId:a[o%a.length].id,userName:a[o%a.length].name,userColor:a[o%a.length].color,points:Array.from({length:5},(W,u)=>({x:100+o*30+u*10,y:150+Math.sin(o+u)*50})),tool:["pen","marker"][o%2],color:a[o%a.length].color,size:[2,4,6,8][o%4],opacity:o%2===0?1:.7,timestamp:Date.now()-o*1e3,isComplete:!0}))],showUserCursors:!0,showToolbar:!0,showUserList:!0}},Y={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,soundEnabled:!1,realTimeSync:!0,showUserCursors:!0,showToolbar:!0,showUserList:!0}},X={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,maxStrokes:10,showUserCursors:!0,showToolbar:!0,showUserList:!0,showUndoRedo:!0}},G={args:{width:800,height:600,users:a,currentUserId:"current",strokes:c,backgroundColor:"#F0F8FF",showUserCursors:!0,showToolbar:!0,showUserList:!0}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}};const Qe=["Default","WithGrid","RealTimeCollaboration","ReadOnlyMode","MinimalInterface","SmallCanvas","LargeCanvas","DarkBackground","NoToolbar","NoUserList","SoloMode","ManyUsers","WithManyStrokes","SilentMode","LimitedStrokes","CustomBackground"];export{G as CustomBackground,R as DarkBackground,j as Default,E as LargeCanvas,X as LimitedStrokes,$ as ManyUsers,A as MinimalInterface,V as NoToolbar,B as NoUserList,N as ReadOnlyMode,M as RealTimeCollaboration,Y as SilentMode,I as SmallCanvas,q as SoloMode,L as WithGrid,_ as WithManyStrokes,Qe as __namedExportsOrder,Ke as default};
