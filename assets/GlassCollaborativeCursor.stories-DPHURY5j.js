import{f as J}from"./index-CLSxArU-.js";import{r as u,b as ge,j as s,c as r,e as X,m as Y}from"./iframe-CYOgkXcw.js";import{c as pe}from"./createGlassStyle-BfWnO-qv.js";import{u as fe}from"./soundDesign-PvAs8rWa.js";import{u as we}from"./a11y-DVEbkwtc.js";import{O as ve}from"./OptimizedGlassCore-BKU-VEbW.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-sc2QmrsH.js";const x=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FECA57","#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#FF9F43","#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8"],$=u.forwardRef(({users:i=[],currentUserId:c,showCursorTails:P=!0,showUserLabels:Z=!0,showAvatars:H=!1,cursorSize:K="medium",fadeTimeout:f=3e3,maxTrailLength:G=10,realTimeMode:q=!1,soundEnabled:O=!0,showSelections:Q=!0,showActions:ee=!0,onCursorMove:W,onUserAction:xe,className:se="",...re},ae)=>{const g=ge(),[te,ne]=u.useState({}),[V,oe]=u.useState({width:0,height:0}),[l,ie]=u.useState(i),{play:_}=fe(),R=we("glass-collaborative-cursor");u.useEffect(()=>{if(!q)return;const e=setInterval(()=>{ie(a=>a.map(o=>{if(o.id===c)return o;const t=(Math.random()-.5)*20,m=(Math.random()-.5)*20,h=Math.max(0,Math.min(V.width,o.x+t)),p=Math.max(0,Math.min(V.height,o.y+m)),v={...o,x:h,y:p,lastActivity:Date.now(),isActive:Math.random()>.3,action:["typing","selecting","drawing","idle"][Math.floor(Math.random()*4)]};return W?.(o.id,h,p),v}))},100);return()=>clearInterval(e)},[q,c,V,W]),u.useEffect(()=>{!l||l.length===0||l.forEach(e=>{!e.isActive||e.id===c||ne(a=>{const o=a[e.id]||[],t={x:e.x,y:e.y,timestamp:Date.now()},m=[...o,t].filter(h=>Date.now()-h.timestamp<f).slice(-G);return{...a,[e.id]:m}})})},[l,c,f,G]),u.useEffect(()=>{const e=document.getElementById(R);if(!e)return;const a=new ResizeObserver(o=>{const t=o[0];t&&oe({width:t.contentRect.width,height:t.contentRect.height})});return a.observe(e),()=>a.disconnect()},[R]),u.useEffect(()=>{O&&l&&l.length>0&&l.forEach(e=>{e.action==="typing"?_("type"):e.action==="selecting"&&_("select")})},[l,O,_]);const le=()=>{switch(K){case"small":return 16;case"large":return 28;default:return 20}},w=e=>{if(!l||l.length===0){const t=parseInt(e,36)%x.length;return x[t]}const a=l.find(t=>t.id===e);if(a?.color)return a.color;const o=parseInt(e,36)%x.length;return x[o]},ce=({user:e,size:a})=>s.jsx(Y.div,{className:r("glass-absolute glass-pointer-events-none glass-z-50"),style:{left:e.x,top:e.y,transform:"translate(-2px, -2px)"},animate:g?{}:{x:0,y:0,scale:e.isActive?1:.8,opacity:e.isActive?1:.6},transition:g?{duration:0}:{duration:.3},children:s.jsx("svg",{width:a,height:a,viewBox:"0 0 24 24",style:{filter:"drop-shadow(0 2px 4px rgba(var(--glass-color-black) / var(--glass-opacity-30)))"},children:s.jsx("path",{d:"M5 3L19 12L12 14L9 21L5 3Z",fill:w(e.id),stroke:"white",strokeWidth:"1"})})}),ue=({user:e})=>s.jsx(Y.div,{className:r("glass-absolute glass-pointer-events-none glass-z-40"),style:{left:e.x+15,top:e.y-5},initial:{opacity:0,scale:.8},animate:g?{}:{opacity:e.isActive?1:.7,scale:e.isActive?1:.9},transition:g?{duration:0}:{duration:.2},children:s.jsx("div",{className:r("glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-font-medium glass-text-primary glass-border glass-border-white/20"),style:pe({opacity:.8,blur:"sm"}),children:s.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-1"),children:[H&&e.avatar&&s.jsx("img",{src:e.avatar,alt:e.name,className:r("glass-w-4 glass-h-4 glass-radius-full")}),s.jsx("span",{children:e.name}),ee&&e.action!=="idle"&&s.jsxs("span",{className:r("glass-text-xs glass-opacity-75"),children:[e.action==="typing"&&"✏️",e.action==="selecting"&&"🔍",e.action==="drawing"&&"✨"]})]})})}),de=({userId:e})=>{const a=te[e]||[],o=w(e);return s.jsx("g",{children:a.map((t,m)=>{const h=Date.now()-t.timestamp,p=Math.max(0,1-h/f),v=m/a.length*4+2;return s.jsx("circle",{cx:t.x,cy:t.y,r:v,fill:o,opacity:p*.6},`${e}-${t.timestamp}`)})})},me=({user:e})=>{if(!e.selection||!Q)return null;const{startX:a,startY:o,endX:t,endY:m}=e.selection,h=Math.abs(t-a),p=Math.abs(m-o),v=Math.min(a,t),he=Math.min(o,m);return s.jsx(Y.div,{className:r("glass-absolute glass-pointer-events-none glass-border-2 glass-border-dashed"),style:{left:v,top:he,width:h,height:p,borderColor:w(e.id),backgroundColor:`${w(e.id)}20`},initial:{opacity:0,scale:.9},animate:g?{}:{opacity:.5,scale:1},transition:g?{duration:0}:{duration:.2}})},d=u.useMemo(()=>(l||[]).filter(e=>e.id!==c&&e.isActive&&Date.now()-e.lastActivity<f),[l,c,f]);return s.jsxs(ve,{ref:ae,id:R,intensity:"subtle",className:r("glass-relative glass-overflow-hidden glass-min-h-96",se),...re,children:[s.jsxs("div",{className:r("glass-absolute glass-inset-0"),children:[P&&s.jsx("svg",{className:r("glass-absolute glass-inset-0 glass-pointer-events-none"),"data-glass-overlay":"true",style:{zIndex:10},children:d.map(e=>s.jsx(de,{userId:e.id},e.id))}),s.jsx(X,{children:d.map(e=>s.jsx(me,{user:e},`selection-${e.id}`))}),s.jsx(X,{children:d.map(e=>s.jsx(ce,{user:e,size:le()},`cursor-${e.id}`))}),Z&&s.jsx(X,{children:d.map(e=>s.jsx(ue,{user:e},`label-${e.id}`))})]}),s.jsxs("div",{className:r("glass-relative glass-z-0 glass-p-8 glass-space-y-4 glass-text-secondary"),children:[s.jsx("h2",{className:r("glass-text-2xl glass-font-bold"),children:"Collaborative Workspace"}),s.jsx("p",{children:"This is a collaborative document where multiple users can work together."}),s.jsxs("div",{className:r("glass-grid glass-grid-cols-2 glass-gap-4"),children:[s.jsxs("div",{className:r("glass-p-4 glass-surface-secondary glass-radius-lg"),children:[s.jsx("h3",{className:r("glass-font-semibold glass-mb-2"),children:"Section A"}),s.jsx("p",{children:"Content that users can interact with..."})]}),s.jsxs("div",{className:r("glass-p-4 glass-surface-secondary glass-radius-lg"),children:[s.jsx("h3",{className:r("glass-font-semibold glass-mb-2"),children:"Section B"}),s.jsx("p",{children:"More interactive content here..."})]})]})]}),s.jsx("div",{className:r("glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-3 glass-surface-overlay glass-blur-backdrop glass-border-t glass-border-white/10"),children:s.jsxs("div",{className:r("glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-muted"),children:[s.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-4"),children:[s.jsxs("span",{children:[d.length," active users"]}),q&&s.jsxs("span",{className:r("glass-flex glass-items-center glass-space-x-1"),children:[s.jsx("div",{className:r("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")}),s.jsx("span",{children:"Real-time"})]})]}),s.jsxs("div",{className:r("glass-flex glass-items-center glass-space-x-2"),children:[d.slice(0,5).map(e=>s.jsx("div",{className:r("glass-w-3 glass-h-3 glass-radius-full glass-border glass-border-white/30"),style:{backgroundColor:w(e.id)},title:e.name},e.id)),d.length>5&&s.jsxs("span",{className:r("glass-text-xs"),children:["+",d.length-5]})]})]})})]})});try{$.displayName="GlassCollaborativeCursor",$.__docgenInfo={description:"",displayName:"GlassCollaborativeCursor",props:{users:{defaultValue:{value:"[]"},description:"",name:"users",required:!1,type:{name:"CursorUser[] | undefined"}},currentUserId:{defaultValue:null,description:"",name:"currentUserId",required:!1,type:{name:"string | undefined"}},showCursorTails:{defaultValue:{value:"true"},description:"",name:"showCursorTails",required:!1,type:{name:"boolean | undefined"}},showUserLabels:{defaultValue:{value:"true"},description:"",name:"showUserLabels",required:!1,type:{name:"boolean | undefined"}},showAvatars:{defaultValue:{value:"false"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},cursorSize:{defaultValue:{value:"medium"},description:"",name:"cursorSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"small"'},{value:'"medium"'},{value:'"large"'}]}},fadeTimeout:{defaultValue:{value:"3000"},description:"",name:"fadeTimeout",required:!1,type:{name:"number | undefined"}},maxTrailLength:{defaultValue:{value:"10"},description:"",name:"maxTrailLength",required:!1,type:{name:"number | undefined"}},realTimeMode:{defaultValue:{value:"false"},description:"",name:"realTimeMode",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},showSelections:{defaultValue:{value:"true"},description:"",name:"showSelections",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"true"},description:"",name:"showActions",required:!1,type:{name:"boolean | undefined"}},onCursorMove:{defaultValue:null,description:"",name:"onCursorMove",required:!1,type:{name:"((userId: string, x: number, y: number) => void) | undefined"}},onUserAction:{defaultValue:null,description:"",name:"onUserAction",required:!1,type:{name:"((userId: string, action: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const n=[{id:"1",name:"Alice Johnson",color:"#FF6B6B",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",x:150,y:100,lastActivity:Date.now(),isActive:!0,action:"typing",selection:{startX:120,startY:80,endX:200,endY:120}},{id:"2",name:"Bob Smith",color:"#4ECDC4",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",x:300,y:200,lastActivity:Date.now()-1e3,isActive:!0,action:"selecting"},{id:"3",name:"Carol Davis",color:"#45B7D1",x:450,y:150,lastActivity:Date.now()-500,isActive:!0,action:"drawing"},{id:"4",name:"David Wilson",color:"#96CEB4",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",x:200,y:300,lastActivity:Date.now()-2e3,isActive:!0,action:"idle"},{id:"5",name:"Emma Brown",color:"#FECA57",x:350,y:250,lastActivity:Date.now()-4e3,isActive:!1,action:"idle"},{id:"6",name:"Frank Miller",color:"#FF9FF3",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",x:500,y:300,lastActivity:Date.now(),isActive:!0,action:"typing"}],Ee={title:"Workflows/Social/Glass Collaborative Cursor",component:$,parameters:{layout:"fullscreen"},tags:["autodocs"],args:{onCursorMove:J(),onUserAction:J()},argTypes:{onCursorMove:{action:void 0},onUserAction:{action:void 0},cursorSize:{control:{type:"select"},options:["small","medium","large"]},fadeTimeout:{control:{type:"range",min:1e3,max:1e4,step:500}},maxTrailLength:{control:{type:"range",min:5,max:50,step:5}}}},y={args:{users:n,currentUserId:"current",showCursorTails:!0,showUserLabels:!0,showAvatars:!1,showSelections:!0,showActions:!0}},U={args:{users:n,currentUserId:"current",showCursorTails:!0,showUserLabels:!0,showAvatars:!0,showSelections:!0,showActions:!0}},b={args:{users:n.slice(0,4),currentUserId:"current",realTimeMode:!0,showCursorTails:!0,showUserLabels:!0,showAvatars:!0,showSelections:!0,showActions:!0}},A={args:{users:n,currentUserId:"current",showCursorTails:!1,showUserLabels:!1,showAvatars:!1,showSelections:!1,showActions:!1}},C={args:{users:n,currentUserId:"current",cursorSize:"small",showCursorTails:!0,showUserLabels:!0,maxTrailLength:15}},T={args:{users:n,currentUserId:"current",cursorSize:"large",showCursorTails:!0,showUserLabels:!0,showAvatars:!0,maxTrailLength:8}},L={args:{users:n,currentUserId:"current",showCursorTails:!0,maxTrailLength:30,fadeTimeout:8e3,showUserLabels:!0}},S={args:{users:n,currentUserId:"current",showCursorTails:!0,maxTrailLength:5,fadeTimeout:2e3,showUserLabels:!0}},M={args:{users:n.map(i=>({...i,action:"typing",isActive:!0})),currentUserId:"current",showCursorTails:!0,showUserLabels:!0,showActions:!0,soundEnabled:!0}},E={args:{users:n.map(i=>({...i,action:"selecting",isActive:!0,selection:{startX:i.x-50,startY:i.y-20,endX:i.x+100,endY:i.y+40}})),currentUserId:"current",showSelections:!0,showUserLabels:!0,showActions:!0}},D={args:{users:n.map(i=>({...i,action:"drawing",isActive:!0})),currentUserId:"current",showCursorTails:!0,maxTrailLength:20,showUserLabels:!0,showActions:!0}},j={args:{users:n.slice(0,2),currentUserId:"current",showCursorTails:!0,showUserLabels:!0,showAvatars:!0,showActions:!0}},I={args:{users:[...n,...Array.from({length:8},(i,c)=>({id:`extra-${c}`,name:`User ${c+7}`,color:["#EE5A6F","#0FB9B1","#3867D6","#1DD1A1","#FD79A8","#54A0FF","#5F27CD","#00D2D3"][c],x:Math.random()*600,y:Math.random()*400,lastActivity:Date.now()-Math.random()*3e3,isActive:Math.random()>.3,action:["typing","selecting","drawing","idle"][Math.floor(Math.random()*4)]}))],currentUserId:"current",showCursorTails:!0,showUserLabels:!0,realTimeMode:!0}},F={args:{users:n.map(i=>({...i,isActive:!1,lastActivity:Date.now()-5e3})),currentUserId:"current",fadeTimeout:1e4,showCursorTails:!1,showUserLabels:!0}},N={args:{users:n,currentUserId:"current",showCursorTails:!1,showUserLabels:!0,showAvatars:!0,showActions:!0}},k={args:{users:n,currentUserId:"current",showCursorTails:!0,showUserLabels:!1,showSelections:!0,maxTrailLength:15}},B={args:{users:n,currentUserId:"current",soundEnabled:!1,realTimeMode:!0,showCursorTails:!0,showUserLabels:!0,showActions:!0}},z={args:{users:n,currentUserId:"current",fadeTimeout:1500,maxTrailLength:8,showCursorTails:!0,showUserLabels:!0}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: false,
    showSelections: true,
    showActions: true
  }
}`,...y.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showSelections: true,
    showActions: true
  }
}`,...U.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 4),
    currentUserId: 'current',
    realTimeMode: true,
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showSelections: true,
    showActions: true
  }
}`,...b.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: false,
    showUserLabels: false,
    showAvatars: false,
    showSelections: false,
    showActions: false
  }
}`,...A.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    cursorSize: 'small',
    showCursorTails: true,
    showUserLabels: true,
    maxTrailLength: 15
  }
}`,...C.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    cursorSize: 'large',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    maxTrailLength: 8
  }
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 30,
    fadeTimeout: 8000,
    showUserLabels: true
  }
}`,...L.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 5,
    fadeTimeout: 2000,
    showUserLabels: true
  }
}`,...S.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'typing' as const,
      isActive: true
    })),
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showActions: true,
    soundEnabled: true
  }
}`,...M.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'selecting' as const,
      isActive: true,
      selection: {
        startX: user.x - 50,
        startY: user.y - 20,
        endX: user.x + 100,
        endY: user.y + 40
      }
    })),
    currentUserId: 'current',
    showSelections: true,
    showUserLabels: true,
    showActions: true
  }
}`,...E.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.map(user => ({
      ...user,
      action: 'drawing' as const,
      isActive: true
    })),
    currentUserId: 'current',
    showCursorTails: true,
    maxTrailLength: 20,
    showUserLabels: true,
    showActions: true
  }
}`,...D.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 2),
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    showAvatars: true,
    showActions: true
  }
}`,...j.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    users: [...mockUsers, ...Array.from({
      length: 8
    }, (_, i) => ({
      id: \`extra-\${i}\`,
      name: \`User \${i + 7}\`,
      color: ['#EE5A6F', '#0FB9B1', '#3867D6', '#1DD1A1', '#FD79A8', '#54A0FF', '#5F27CD', '#00D2D3'][i],
      x: Math.random() * 600,
      y: Math.random() * 400,
      lastActivity: Date.now() - Math.random() * 3000,
      isActive: Math.random() > 0.3,
      action: ['typing', 'selecting', 'drawing', 'idle'][Math.floor(Math.random() * 4)] as any
    }))],
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: true,
    realTimeMode: true
  }
}`,...I.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.map(user => ({
      ...user,
      isActive: false,
      lastActivity: Date.now() - 5000
    })),
    currentUserId: 'current',
    fadeTimeout: 10000,
    showCursorTails: false,
    showUserLabels: true
  }
}`,...F.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: false,
    showUserLabels: true,
    showAvatars: true,
    showActions: true
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    showCursorTails: true,
    showUserLabels: false,
    showSelections: true,
    maxTrailLength: 15
  }
}`,...k.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    soundEnabled: false,
    realTimeMode: true,
    showCursorTails: true,
    showUserLabels: true,
    showActions: true
  }
}`,...B.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    currentUserId: 'current',
    fadeTimeout: 1500,
    maxTrailLength: 8,
    showCursorTails: true,
    showUserLabels: true
  }
}`,...z.parameters?.docs?.source}}};const De=["Default","WithAvatars","RealTimeMode","MinimalInterface","SmallCursors","LargeCursors","LongTrails","ShortTrails","ActiveTyping","SelectionMode","DrawingMode","FewUsers","ManyUsers","InactiveUsers","NoTrails","NoLabels","SilentMode","FastFade"];export{M as ActiveTyping,y as Default,D as DrawingMode,z as FastFade,j as FewUsers,F as InactiveUsers,T as LargeCursors,L as LongTrails,I as ManyUsers,A as MinimalInterface,k as NoLabels,N as NoTrails,b as RealTimeMode,E as SelectionMode,S as ShortTrails,B as SilentMode,C as SmallCursors,U as WithAvatars,De as __namedExportsOrder,Ee as default};
