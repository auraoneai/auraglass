import{r as m,b as us,j as e,m as d,c as l}from"./iframe-LB2Lfhgp.js";import{u as cs}from"./soundDesign-DLM28zFA.js";import{u as ms}from"./a11y-DBdyTOMI.js";import{u as ds}from"./useMotionPreference-PpLcchZF.js";import{c as O}from"./createGlassStyle-BfWnO-qv.js";import{O as gs}from"./OptimizedGlassCore-Bt3saaFo.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DKKFd1VE.js";const F={online:"var(--glass-color-success)",away:"var(--glass-color-warning)",busy:"var(--glass-color-danger)",offline:"var(--glass-gray-500)"},G=m.forwardRef(({users:i,maxVisible:p=5,showAvatars:_=!0,showNames:J=!0,showStatus:B=!0,showActivity:Y=!1,showLastSeen:K=!0,showTypingIndicator:P=!0,layout:Q="horizontal",size:o="medium",groupSimilarStatus:R=!1,realTimeSync:$=!1,soundEnabled:W=!0,animateChanges:X=!0,theme:hs="auto",onUserClick:Z,onStatusChange:fs,className:ss="",...es},as)=>{const g=us(),[r,ts]=m.useState(i||[]),[u,rs]=m.useState([]),{play:H}=cs();ms("glass-presence");const{shouldAnimate:ns}=ds(),h=s=>ns?s:{duration:0};m.useEffect(()=>{if(!$||!r.length)return;const s=setInterval(()=>{ts(n=>n.map(t=>({...t,lastSeen:t.status!=="offline"?new Date:t.lastSeen,isTyping:Math.random()<.1?!t.isTyping:t.isTyping})))},5e3);return()=>clearInterval(s)},[$]),m.useEffect(()=>{const s=r.filter(n=>n.isTyping).map(n=>n.id);rs(s)},[r]),m.useEffect(()=>{W&&r.length>0&&r.forEach(s=>{s.status==="online"&&H("notification")})},[r,W,H]);const f=m.useMemo(()=>{let s=[...r];R&&s.sort((c,w)=>{const y={online:0,away:1,busy:2,offline:3};return y[c.status]-y[w.status]});const n=s.slice(0,p),t=Math.max(0,s.length-p);return{visibleUsers:n,hiddenCount:t,totalOnline:s.filter(c=>c.status==="online").length}},[r,p,R]),is=s=>{if(!s)return"Never";const t=new Date().getTime()-s.getTime(),c=Math.floor(t/6e4),w=Math.floor(t/36e5),y=Math.floor(t/864e5);return c<1?"Just now":c<60?`${c}m ago`:w<24?`${w}h ago`:`${y}d ago`},q=()=>{switch(o){case"small":return"glass-text-xs";case"large":return"glass-text-lg";default:return"glass-text-sm"}},os=()=>{switch(Q){case"vertical":return"glass-flex glass-flex-col glass-space-y-2";case"grid":return"glass-grid glass-grid-cols-2 glass-gap-2";case"stack":return"glass-flex glass-flex-col glass-space-y-1";default:return"glass-flex glass-flex-wrap glass-gap-2"}},ls=({user:s,index:n})=>e.jsxs(d.div,{layout:X,initial:{opacity:0,scale:.8},animate:g?{}:{opacity:1,scale:1},exit:{opacity:0,scale:.8},transition:h({duration:.3,delay:n*.05}),className:"glass-flex glass-items-center glass-space-x-2 glass-p-2 glass-radius-lg glass-cursor-pointer glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",style:{...O({variant:"default",radius:"lg"}),transitionDuration:"200ms"},onClick:()=>Z?.(s.id),children:[_&&e.jsxs("div",{className:"glass-relative",children:[e.jsx("div",{className:l("glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-semibold glass-overflow-hidden",o==="small"?"glass-w-6 glass-h-6":o==="large"?"glass-w-12 glass-h-12":"glass-w-8 glass-h-8"),style:O({variant:"default",radius:"full"}),children:s.avatar?e.jsx("img",{src:s.avatar,alt:s.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):s.name.charAt(0).toUpperCase()}),B&&e.jsx(d.div,{className:l("glass-absolute glass-radius-full glass-border-2 glass-border-white",o==="large"?"glass-w-4 glass-h-4":"glass-w-3 glass-h-3"),style:{backgroundColor:F[s.status],right:-2,bottom:-2},animate:s.status==="online"?{scale:[1,1.2,1]}:{},transition:h({duration:2,repeat:1/0,repeatType:"loop"})})]}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[J&&e.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[e.jsx("p",{className:l("glass-font-medium glass-text-primary glass-truncate",q()),children:s.name}),s.customStatus?.emoji&&e.jsx("span",{className:"glass-text-xs",children:s.customStatus.emoji})]}),Y&&s.activity&&e.jsx("p",{className:l("glass-text-secondary glass-truncate",o==="large"?"glass-text-sm":"glass-text-xs"),children:s.activity}),s.customStatus?.text&&e.jsx("p",{className:l("glass-text-secondary glass-truncate",o==="large"?"glass-text-sm":"glass-text-xs"),children:s.customStatus.text}),K&&s.status==="offline"&&e.jsx("p",{className:l("glass-text-tertiary",o==="large"?"glass-text-sm":"glass-text-xs"),children:is(s.lastSeen)})]}),P&&s.isTyping&&e.jsx(d.div,{className:"glass-flex glass-space-x-1",animate:g?{}:{opacity:[.4,1,.4]},transition:h({duration:1.5,repeat:1/0,ease:"easeInOut"}),children:[0,1,2].map(t=>e.jsx(d.div,{className:"glass-w-1.5 glass-h-1.5 glass-surface-primary glass-radius-full",animate:g?{}:{y:[-2,0,-2]},transition:h({duration:.6,repeat:1/0,delay:t*.1,ease:"easeInOut"})},t))}),B&&!_&&e.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full",style:{backgroundColor:F[s.status]}})]},s.id);return e.jsxs(gs,{ref:as,intensity:"subtle",className:l("glass-p-4",ss),...es,children:[e.jsxs("div",{className:os(),children:[f.visibleUsers.map((s,n)=>e.jsx(ls,{user:s,index:n},s.id)),f.hiddenCount>0&&e.jsxs(d.div,{className:"glass-flex glass-items-center glass-space-x-2 glass-p-2 glass-radius-lg glass-text-secondary",style:O({variant:"default",radius:"lg"}),initial:{opacity:0},animate:g?{}:{opacity:1},transition:h({delay:.3}),children:[e.jsxs("div",{className:l("glass-radius-full glass-surface-subtle/20 glass-flex glass-items-center glass-justify-center glass-font-medium",o==="small"?"glass-w-6 glass-h-6":o==="large"?"glass-w-12 glass-h-12":"glass-w-8 glass-h-8",q()),children:["+",f.hiddenCount]}),e.jsxs("span",{className:q(),children:[f.hiddenCount," more"," ",f.hiddenCount===1?"user":"users"]})]})]}),P&&u.length>0&&e.jsx(d.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10",initial:{opacity:0,y:10},animate:g?{}:{opacity:1,y:0},exit:{opacity:0,y:10},children:e.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:u.length===1?`${r.find(s=>s.id===u[0])?.name} is typing...`:u.length===2?`${r.find(s=>s.id===u[0])?.name} and ${r.find(s=>s.id===u[1])?.name} are typing...`:`${u.length} people are typing...`})}),e.jsxs(d.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",initial:{opacity:0},animate:g?{}:{opacity:1},transition:h({delay:.5}),children:[e.jsxs("span",{children:[f.totalOnline," online"]}),e.jsxs("span",{children:[r.length," total"]})]})]})});try{G.displayName="GlassPresenceIndicator",G.__docgenInfo={description:"",displayName:"GlassPresenceIndicator",props:{users:{defaultValue:null,description:"",name:"users",required:!1,type:{name:'{ id: string; name: string; avatar?: string | undefined; status: "online" | "offline" | "away" | "busy"; lastSeen?: Date | undefined; activity?: string | undefined; location?: string | undefined; timezone?: string | undefined; isTyping?: boolean | undefined; customStatus?: { ...; } | undefined; }[] | undefined'}},maxVisible:{defaultValue:{value:"5"},description:"",name:"maxVisible",required:!1,type:{name:"number | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showStatus:{defaultValue:{value:"true"},description:"",name:"showStatus",required:!1,type:{name:"boolean | undefined"}},showActivity:{defaultValue:{value:"false"},description:"",name:"showActivity",required:!1,type:{name:"boolean | undefined"}},showLastSeen:{defaultValue:{value:"true"},description:"",name:"showLastSeen",required:!1,type:{name:"boolean | undefined"}},showTypingIndicator:{defaultValue:{value:"true"},description:"",name:"showTypingIndicator",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:{value:"horizontal"},description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"grid"'},{value:'"horizontal"'},{value:'"vertical"'},{value:'"stack"'}]}},size:{defaultValue:{value:"medium"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"small"'},{value:'"medium"'},{value:'"large"'}]}},groupSimilarStatus:{defaultValue:{value:"false"},description:"",name:"groupSimilarStatus",required:!1,type:{name:"boolean | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},animateChanges:{defaultValue:{value:"true"},description:"",name:"animateChanges",required:!1,type:{name:"boolean | undefined"}},theme:{defaultValue:{value:"auto"},description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"auto"'},{value:'"dark"'}]}},onUserClick:{defaultValue:null,description:"",name:"onUserClick",required:!1,type:{name:"((userId: string) => void) | undefined"}},onStatusChange:{defaultValue:null,description:"",name:"onStatusChange",required:!1,type:{name:"((userId: string, status: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const a=[{id:"1",name:"Alice Johnson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Working on project",location:"San Francisco, CA",timezone:"PST",isTyping:!1,customStatus:{emoji:"💻",text:"Coding"}},{id:"2",name:"Bob Smith",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"away",activity:"In a meeting",lastSeen:new Date(Date.now()-900*1e3),customStatus:{emoji:"🏢",text:"In meeting"}},{id:"3",name:"Carol Davis",status:"online",activity:"Available",isTyping:!0,customStatus:{emoji:"✨",text:"Ready to help!"}},{id:"4",name:"David Wilson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"busy",activity:"Do not disturb",lastSeen:new Date(Date.now()-300*1e3),customStatus:{emoji:"🔥",text:"On deadline"}},{id:"5",name:"Emma Brown",status:"offline",lastSeen:new Date(Date.now()-7200*1e3),location:"New York, NY"},{id:"6",name:"Frank Miller",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Available for chat",isTyping:!1},{id:"7",name:"Grace Lee",status:"away",activity:"Away from keyboard",lastSeen:new Date(Date.now()-1800*1e3),customStatus:{emoji:"🌮",text:"Lunch break"}},{id:"8",name:"Henry Chen",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Active",isTyping:!0}],bs={title:"Workflows/Glass Presence Indicator",component:G,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{maxVisible:{control:{type:"range",min:1,max:10,step:1}},layout:{control:{type:"select"},options:["horizontal","vertical","grid","stack"]},size:{control:{type:"select"},options:["small","medium","large"]},theme:{control:{type:"select"},options:["light","dark","auto"]}}},v={args:{users:a.slice(0,5),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0}},S={args:{users:a.slice(0,4),layout:"horizontal",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1}},x={args:{users:a.slice(0,6),layout:"vertical",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},A={args:{users:a.slice(0,8),layout:"grid",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,maxVisible:8}},N={args:{users:a,layout:"stack",size:"small",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,maxVisible:6}},b={args:{users:a.slice(0,5),size:"small",layout:"horizontal",showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1}},C={args:{users:a.slice(0,4),size:"large",layout:"vertical",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},k={args:{users:a,showAvatars:!1,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"stack",size:"small",maxVisible:8}},j={args:{users:a,showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"horizontal",size:"small",maxVisible:10}},T={args:{users:a.map((i,p)=>({...i,isTyping:p%3===0})),showTypingIndicator:!0,showAvatars:!0,showNames:!0,showStatus:!0,layout:"vertical",maxVisible:6}},V={args:{users:a,groupSimilarStatus:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical",maxVisible:8}},z={args:{users:a.slice(0,6),realTimeSync:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0,layout:"vertical"}},E={args:{users:a.filter(i=>i.status==="online"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showTypingIndicator:!0,layout:"horizontal"}},I={args:{users:a.filter(i=>i.status==="offline"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!0,layout:"vertical"}},L={args:{users:a.filter(i=>i.customStatus),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,layout:"vertical",size:"medium"}},U={args:{users:a,maxVisible:3,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},D={args:{users:a.slice(0,5),animateChanges:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},M={args:{users:a.slice(0,5),soundEnabled:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,realTimeSync:!0,layout:"horizontal"}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
    showTypingIndicator: true
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 4),
    layout: 'horizontal',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false
  }
}`,...S.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 6),
    layout: 'vertical',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true
  }
}`,...x.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 8),
    layout: 'grid',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    maxVisible: 8
  }
}`,...A.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    layout: 'stack',
    size: 'small',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    maxVisible: 6
  }
}`,...N.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    size: 'small',
    layout: 'horizontal',
    showAvatars: true,
    showNames: false,
    showStatus: true,
    showActivity: false
  }
}`,...b.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 4),
    size: 'large',
    layout: 'vertical',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true
  }
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    showAvatars: false,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: false,
    showTypingIndicator: false,
    layout: 'stack',
    size: 'small',
    maxVisible: 8
  }
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    showAvatars: true,
    showNames: false,
    showStatus: true,
    showActivity: false,
    showLastSeen: false,
    showTypingIndicator: false,
    layout: 'horizontal',
    size: 'small',
    maxVisible: 10
  }
}`,...j.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.map((user, index) => ({
      ...user,
      isTyping: index % 3 === 0
    })),
    showTypingIndicator: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    layout: 'vertical',
    maxVisible: 6
  }
}`,...T.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    groupSimilarStatus: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical',
    maxVisible: 8
  }
}`,...V.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 6),
    realTimeSync: true,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
    showTypingIndicator: true,
    layout: 'vertical'
  }
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'online'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showTypingIndicator: true,
    layout: 'horizontal'
  }
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'offline'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: true,
    layout: 'vertical'
  }
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.customStatus),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    layout: 'vertical',
    size: 'medium'
  }
}`,...L.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    maxVisible: 3,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...U.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    animateChanges: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...D.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    soundEnabled: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    realTimeSync: true,
    layout: 'horizontal'
  }
}`,...M.parameters?.docs?.source}}};const Cs=["Default","HorizontalLayout","VerticalLayout","GridLayout","StackLayout","SmallSize","LargeSize","MinimalView","StatusOnly","WithTypingIndicators","GroupedByStatus","RealTimeSync","OnlineOnly","OfflineUsers","CustomStatuses","LimitedVisible","NoAnimations","SilentMode"];export{L as CustomStatuses,v as Default,A as GridLayout,V as GroupedByStatus,S as HorizontalLayout,C as LargeSize,U as LimitedVisible,k as MinimalView,D as NoAnimations,I as OfflineUsers,E as OnlineOnly,z as RealTimeSync,M as SilentMode,b as SmallSize,N as StackLayout,j as StatusOnly,x as VerticalLayout,T as WithTypingIndicators,Cs as __namedExportsOrder,bs as default};
