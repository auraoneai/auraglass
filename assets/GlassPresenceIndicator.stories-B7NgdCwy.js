import{r as c,b as le,j as s,m}from"./iframe-C4NFeGrN.js";import{u as ue}from"./soundDesign-BwnboANF.js";import{u as ce}from"./a11y-Drh7-6qm.js";import{u as me}from"./useMotionPreference-Dszu9Lq8.js";import{c as $}from"./createGlassStyle-BfWnO-qv.js";import{O as de}from"./OptimizedGlassCore-pFwkcNDS.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CcJXKEC9.js";const H={online:"var(--glass-color-success)",away:"var(--glass-color-warning)",busy:"var(--glass-color-danger)",offline:"var(--glass-gray-500)"},q=c.forwardRef(({users:o,maxVisible:w=5,showAvatars:O=!0,showNames:F=!0,showStatus:G=!0,showActivity:J=!1,showLastSeen:Y=!0,showTypingIndicator:_=!0,layout:K="horizontal",size:i="medium",groupSimilarStatus:B=!1,realTimeSync:P=!1,soundEnabled:R=!0,animateChanges:Q=!0,theme:he="auto",onUserClick:X,onStatusChange:fe,className:Z="",...ee},se)=>{const d=le(),[r,te]=c.useState(o||[]),[l,ae]=c.useState([]),{play:W}=ue();ce("glass-presence");const{shouldAnimate:re}=me(),h=e=>re?e:{duration:0};c.useEffect(()=>{if(!P||!r.length)return;const e=setInterval(()=>{te(n=>n.map(a=>({...a,lastSeen:a.status!=="offline"?new Date:a.lastSeen,isTyping:Math.random()<.1?!a.isTyping:a.isTyping})))},5e3);return()=>clearInterval(e)},[P]),c.useEffect(()=>{const e=r.filter(n=>n.isTyping).map(n=>n.id);ae(e)},[r]),c.useEffect(()=>{R&&r.length>0&&r.forEach(e=>{e.status==="online"&&W("notification")})},[r,R,W]);const f=c.useMemo(()=>{let e=[...r];B&&e.sort((u,p)=>{const g={online:0,away:1,busy:2,offline:3};return g[u.status]-g[p.status]});const n=e.slice(0,w),a=Math.max(0,e.length-w);return{visibleUsers:n,hiddenCount:a,totalOnline:e.filter(u=>u.status==="online").length}},[r,w,B]),ne=e=>{if(!e)return"Never";const a=new Date().getTime()-e.getTime(),u=Math.floor(a/6e4),p=Math.floor(a/36e5),g=Math.floor(a/864e5);return u<1?"Just now":u<60?`${u}m ago`:p<24?`${p}h ago`:`${g}d ago`},D=()=>{switch(i){case"small":return"text-xs";case"large":return"text-lg";default:return"text-sm"}},oe=()=>{switch(K){case"vertical":return"flex flex-col space-y-2";case"grid":return"grid grid-cols-2 gap-2";case"stack":return"flex flex-col space-y-1";default:return"flex flex-wrap gap-2"}},ie=({user:e,index:n})=>s.jsxs(m.div,{layout:Q,initial:{opacity:0,scale:.8},animate:d?{}:{opacity:1,scale:1},exit:{opacity:0,scale:.8},transition:h({duration:.3,delay:n*.05}),className:`
          flex items-center space-x-2 p-2 rounded-lg cursor-pointer
          ${$({variant:"default"})}
          hover:bg-white/10 transition-colors duration-200
        `,onClick:()=>X?.(e.id),children:[O&&s.jsxs("div",{className:"glass-relative",children:[s.jsx("div",{className:`
              ${i==="small"?"w-6 h-6":i==="large"?"w-12 h-12":"w-8 h-8"}
              rounded-full bg-gradient-to-br from-gray-300 to-gray-500 
              flex items-center justify-center text-white font-semibold
              ${$({variant:"default"})}
            `,children:e.avatar?s.jsx("img",{src:e.avatar,alt:e.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.name.charAt(0).toUpperCase()}),G&&s.jsx(m.div,{className:`
                  absolute -bottom-0.5 -right-0.5 
                  ${i==="small"?"w-3 h-3":i==="large"?"w-4 h-4":"w-3 h-3"}
                  rounded-full border-2 border-white
                `,style:{backgroundColor:H[e.status]},animate:e.status==="online"?{scale:[1,1.2,1]}:{},transition:h({duration:2,repeat:1/0,repeatType:"loop"})})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[F&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[s.jsx("p",{className:`font-medium text-white/90 truncate ${D()}`,children:e.name}),e.customStatus?.emoji&&s.jsx("span",{className:"glass-text-xs",children:e.customStatus.emoji})]}),J&&e.activity&&s.jsx("p",{className:`text-white/60 truncate ${i==="large"?"text-sm":"text-xs"}`,children:e.activity}),e.customStatus?.text&&s.jsx("p",{className:`text-white/60 truncate ${i==="large"?"text-sm":"text-xs"}`,children:e.customStatus.text}),Y&&e.status==="offline"&&s.jsx("p",{className:`text-white/40 ${i==="large"?"text-sm":"text-xs"}`,children:ne(e.lastSeen)})]}),_&&e.isTyping&&s.jsx(m.div,{className:"glass-flex glass-space-x-1",animate:d?{}:{opacity:[.4,1,.4]},transition:h({duration:1.5,repeat:1/0,ease:"easeInOut"}),children:[0,1,2].map(a=>s.jsx(m.div,{className:"glass-w-1.5 glass-h-1.5 glass-surface-blue glass-radius-full",animate:d?{}:{y:[-2,0,-2]},transition:h({duration:.6,repeat:1/0,delay:a*.1,ease:"easeInOut"})},a))}),G&&!O&&s.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full",style:{backgroundColor:H[e.status]}})]},e.id);return s.jsxs(de,{ref:se,intensity:"subtle",className:`p-4 ${Z}`,...ee,children:[s.jsxs("div",{className:oe(),children:[f.visibleUsers.map((e,n)=>s.jsx(ie,{user:e,index:n},e.id)),f.hiddenCount>0&&s.jsxs(m.div,{className:`
                flex items-center space-x-2 p-2 rounded-lg text-white/60
                ${$({variant:"default"})}
              `,initial:{opacity:0},animate:d?{}:{opacity:1},transition:h({delay:.3}),children:[s.jsxs("div",{className:`
                ${i==="small"?"w-6 h-6":i==="large"?"w-12 h-12":"w-8 h-8"}
                rounded-full bg-white/20 flex items-center justify-center
                ${D()} font-medium
              `,children:["+",f.hiddenCount]}),s.jsxs("span",{className:D(),children:[f.hiddenCount," more"," ",f.hiddenCount===1?"user":"users"]})]})]}),_&&l.length>0&&s.jsx(m.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10",initial:{opacity:0,y:10},animate:d?{}:{opacity:1,y:0},exit:{opacity:0,y:10},children:s.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:l.length===1?`${r.find(e=>e.id===l[0])?.name} is typing...`:l.length===2?`${r.find(e=>e.id===l[0])?.name} and ${r.find(e=>e.id===l[1])?.name} are typing...`:`${l.length} people are typing...`})}),s.jsxs(m.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",initial:{opacity:0},animate:d?{}:{opacity:1},transition:h({delay:.5}),children:[s.jsxs("span",{children:[f.totalOnline," online"]}),s.jsxs("span",{children:[r.length," total"]})]})]})});try{q.displayName="GlassPresenceIndicator",q.__docgenInfo={description:"",displayName:"GlassPresenceIndicator",props:{users:{defaultValue:null,description:"",name:"users",required:!1,type:{name:'{ id: string; name: string; avatar?: string | undefined; status: "online" | "offline" | "away" | "busy"; lastSeen?: Date | undefined; activity?: string | undefined; location?: string | undefined; timezone?: string | undefined; isTyping?: boolean | undefined; customStatus?: { ...; } | undefined; }[] | undefined'}},maxVisible:{defaultValue:{value:"5"},description:"",name:"maxVisible",required:!1,type:{name:"number | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showStatus:{defaultValue:{value:"true"},description:"",name:"showStatus",required:!1,type:{name:"boolean | undefined"}},showActivity:{defaultValue:{value:"false"},description:"",name:"showActivity",required:!1,type:{name:"boolean | undefined"}},showLastSeen:{defaultValue:{value:"true"},description:"",name:"showLastSeen",required:!1,type:{name:"boolean | undefined"}},showTypingIndicator:{defaultValue:{value:"true"},description:"",name:"showTypingIndicator",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:{value:"horizontal"},description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"grid"'},{value:'"horizontal"'},{value:'"vertical"'},{value:'"stack"'}]}},size:{defaultValue:{value:"medium"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"small"'},{value:'"large"'}]}},groupSimilarStatus:{defaultValue:{value:"false"},description:"",name:"groupSimilarStatus",required:!1,type:{name:"boolean | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},animateChanges:{defaultValue:{value:"true"},description:"",name:"animateChanges",required:!1,type:{name:"boolean | undefined"}},theme:{defaultValue:{value:"auto"},description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"light"'},{value:'"dark"'},{value:'"auto"'}]}},onUserClick:{defaultValue:null,description:"",name:"onUserClick",required:!1,type:{name:"((userId: string) => void) | undefined"}},onStatusChange:{defaultValue:null,description:"",name:"onStatusChange",required:!1,type:{name:"((userId: string, status: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const t=[{id:"1",name:"Alice Johnson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Working on project",location:"San Francisco, CA",timezone:"PST",isTyping:!1,customStatus:{emoji:"💻",text:"Coding"}},{id:"2",name:"Bob Smith",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"away",activity:"In a meeting",lastSeen:new Date(Date.now()-900*1e3),customStatus:{emoji:"🏢",text:"In meeting"}},{id:"3",name:"Carol Davis",status:"online",activity:"Available",isTyping:!0,customStatus:{emoji:"✨",text:"Ready to help!"}},{id:"4",name:"David Wilson",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"busy",activity:"Do not disturb",lastSeen:new Date(Date.now()-300*1e3),customStatus:{emoji:"🔥",text:"On deadline"}},{id:"5",name:"Emma Brown",status:"offline",lastSeen:new Date(Date.now()-7200*1e3),location:"New York, NY"},{id:"6",name:"Frank Miller",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Available for chat",isTyping:!1},{id:"7",name:"Grace Lee",status:"away",activity:"Away from keyboard",lastSeen:new Date(Date.now()-1800*1e3),customStatus:{emoji:"🌮",text:"Lunch break"}},{id:"8",name:"Henry Chen",avatar:"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%20viewBox=%270%200%2064%2064%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20rx=%2732%27%20fill=%27%230f766e%27/%3E%3Ccircle%20cx=%2732%27%20cy=%2726%27%20r=%2711%27%20fill=%27%23ffffff%27%20opacity=%27.9%27/%3E%3Cpath%20d=%27M14%2057c3-12%2013-18%2018-18s15%206%2018%2018%27%20fill=%27%23ffffff%27%20opacity=%27.85%27/%3E%3C/svg%3E",status:"online",activity:"Active",isTyping:!0}],Ne={title:"Workflows/Glass Presence Indicator",component:q,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{maxVisible:{control:{type:"range",min:1,max:10,step:1}},layout:{control:{type:"select"},options:["horizontal","vertical","grid","stack"]},size:{control:{type:"select"},options:["small","medium","large"]},theme:{control:{type:"select"},options:["light","dark","auto"]}}},y={args:{users:t.slice(0,5),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0}},v={args:{users:t.slice(0,4),layout:"horizontal",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1}},S={args:{users:t.slice(0,6),layout:"vertical",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},x={args:{users:t.slice(0,8),layout:"grid",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,maxVisible:8}},A={args:{users:t,layout:"stack",size:"small",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,maxVisible:6}},N={args:{users:t.slice(0,5),size:"small",layout:"horizontal",showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1}},b={args:{users:t.slice(0,4),size:"large",layout:"vertical",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},C={args:{users:t,showAvatars:!1,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"stack",size:"small",maxVisible:8}},k={args:{users:t,showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"horizontal",size:"small",maxVisible:10}},j={args:{users:t.map((o,w)=>({...o,isTyping:w%3===0})),showTypingIndicator:!0,showAvatars:!0,showNames:!0,showStatus:!0,layout:"vertical",maxVisible:6}},T={args:{users:t,groupSimilarStatus:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical",maxVisible:8}},V={args:{users:t.slice(0,6),realTimeSync:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0,layout:"vertical"}},z={args:{users:t.filter(o=>o.status==="online"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showTypingIndicator:!0,layout:"horizontal"}},E={args:{users:t.filter(o=>o.status==="offline"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!0,layout:"vertical"}},I={args:{users:t.filter(o=>o.customStatus),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,layout:"vertical",size:"medium"}},L={args:{users:t,maxVisible:3,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},U={args:{users:t.slice(0,5),animateChanges:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},M={args:{users:t.slice(0,5),soundEnabled:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,realTimeSync:!0,layout:"horizontal"}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showLastSeen: true,
    showTypingIndicator: true
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 4),
    layout: 'horizontal',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 8),
    layout: 'grid',
    size: 'medium',
    showAvatars: true,
    showNames: true,
    showStatus: true,
    maxVisible: 8
  }
}`,...x.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    size: 'small',
    layout: 'horizontal',
    showAvatars: true,
    showNames: false,
    showStatus: true,
    showActivity: false
  }
}`,...N.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'online'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showTypingIndicator: true,
    layout: 'horizontal'
  }
}`,...z.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'offline'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: true,
    layout: 'vertical'
  }
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.customStatus),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    layout: 'vertical',
    size: 'medium'
  }
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    maxVisible: 3,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...L.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    animateChanges: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...U.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};const be=["Default","HorizontalLayout","VerticalLayout","GridLayout","StackLayout","SmallSize","LargeSize","MinimalView","StatusOnly","WithTypingIndicators","GroupedByStatus","RealTimeSync","OnlineOnly","OfflineUsers","CustomStatuses","LimitedVisible","NoAnimations","SilentMode"];export{I as CustomStatuses,y as Default,x as GridLayout,T as GroupedByStatus,v as HorizontalLayout,b as LargeSize,L as LimitedVisible,C as MinimalView,U as NoAnimations,E as OfflineUsers,z as OnlineOnly,V as RealTimeSync,M as SilentMode,N as SmallSize,A as StackLayout,k as StatusOnly,S as VerticalLayout,j as WithTypingIndicators,be as __namedExportsOrder,Ne as default};
