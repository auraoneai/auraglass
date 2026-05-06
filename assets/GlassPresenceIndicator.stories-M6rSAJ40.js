import{r as c,b as ue,h as le,j as s,m}from"./iframe-DpweptvF.js";import{u as ce}from"./soundDesign-Cq0Tbb-v.js";import{u as me}from"./useMotionPreference-GPoScSOr.js";import{c as O}from"./createGlassStyle-BfWnO-qv.js";import{O as de}from"./OptimizedGlassCore-UOg4NIOz.js";import"./preload-helper-PPVm8Dsz.js";const H={online:"var(--glass-color-success)",away:"var(--glass-color-warning)",busy:"var(--glass-color-danger)",offline:"var(--glass-gray-500)"},M=c.forwardRef(({users:o,maxVisible:w=5,showAvatars:G=!0,showNames:F=!0,showStatus:E=!0,showActivity:J=!1,showLastSeen:Y=!0,showTypingIndicator:_=!0,layout:K="horizontal",size:i="medium",groupSimilarStatus:P=!1,realTimeSync:R=!1,soundEnabled:B=!0,animateChanges:Q=!0,theme:he="auto",onUserClick:X,onStatusChange:pe,className:Z="",...ee},se)=>{const d=ue(),[r,ae]=c.useState(o||[]),[u,te]=c.useState([]),{play:W}=ce();le("glass-presence");const{shouldAnimate:re}=me(),h=e=>re?e:{duration:0};c.useEffect(()=>{if(!R||!r.length)return;const e=setInterval(()=>{ae(n=>n.map(t=>({...t,lastSeen:t.status!=="offline"?new Date:t.lastSeen,isTyping:Math.random()<.1?!t.isTyping:t.isTyping})))},5e3);return()=>clearInterval(e)},[R]),c.useEffect(()=>{const e=r.filter(n=>n.isTyping).map(n=>n.id);te(e)},[r]),c.useEffect(()=>{B&&r.length>0&&r.forEach(e=>{e.status==="online"&&W("notification")})},[r,B,W]);const p=c.useMemo(()=>{let e=[...r];P&&e.sort((l,f)=>{const g={online:0,away:1,busy:2,offline:3};return g[l.status]-g[f.status]});const n=e.slice(0,w),t=Math.max(0,e.length-w);return{visibleUsers:n,hiddenCount:t,totalOnline:e.filter(l=>l.status==="online").length}},[r,w,P]),ne=e=>{if(!e)return"Never";const t=new Date().getTime()-e.getTime(),l=Math.floor(t/6e4),f=Math.floor(t/36e5),g=Math.floor(t/864e5);return l<1?"Just now":l<60?`${l}m ago`:f<24?`${f}h ago`:`${g}d ago`},q=()=>{switch(i){case"small":return"text-xs";case"large":return"text-lg";default:return"text-sm"}},oe=()=>{switch(K){case"vertical":return"flex flex-col space-y-2";case"grid":return"grid grid-cols-2 gap-2";case"stack":return"flex flex-col space-y-1";default:return"flex flex-wrap gap-2"}},ie=({user:e,index:n})=>s.jsxs(m.div,{layout:Q,initial:{opacity:0,scale:.8},animate:d?{}:{opacity:1,scale:1},exit:{opacity:0,scale:.8},transition:h({duration:.3,delay:n*.05}),className:`
          flex items-center space-x-2 p-2 rounded-lg cursor-pointer
          ${O({variant:"default"})}
          hover:bg-white/10 transition-colors duration-200
        `,onClick:()=>X?.(e.id),children:[G&&s.jsxs("div",{className:"glass-relative",children:[s.jsx("div",{className:`
              ${i==="small"?"w-6 h-6":i==="large"?"w-12 h-12":"w-8 h-8"}
              rounded-full bg-gradient-to-br from-gray-300 to-gray-500 
              flex items-center justify-center text-white font-semibold
              ${O({variant:"default"})}
            `,children:e.avatar?s.jsx("img",{src:e.avatar,alt:e.name,className:"glass-w-full glass-h-full glass-radius-full glass-object-cover"}):e.name.charAt(0).toUpperCase()}),E&&s.jsx(m.div,{className:`
                  absolute -bottom-0.5 -right-0.5 
                  ${i==="small"?"w-3 h-3":i==="large"?"w-4 h-4":"w-3 h-3"}
                  rounded-full border-2 border-white
                `,style:{backgroundColor:H[e.status]},animate:e.status==="online"?{scale:[1,1.2,1]}:{},transition:h({duration:2,repeat:1/0,repeatType:"loop"})})]}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[F&&s.jsxs("div",{className:"glass-flex glass-items-center glass-space-x-1",children:[s.jsx("p",{className:`font-medium text-white/90 truncate ${q()}`,children:e.name}),e.customStatus?.emoji&&s.jsx("span",{className:"glass-text-xs",children:e.customStatus.emoji})]}),J&&e.activity&&s.jsx("p",{className:`text-white/60 truncate ${i==="large"?"text-sm":"text-xs"}`,children:e.activity}),e.customStatus?.text&&s.jsx("p",{className:`text-white/60 truncate ${i==="large"?"text-sm":"text-xs"}`,children:e.customStatus.text}),Y&&e.status==="offline"&&s.jsx("p",{className:`text-white/40 ${i==="large"?"text-sm":"text-xs"}`,children:ne(e.lastSeen)})]}),_&&e.isTyping&&s.jsx(m.div,{className:"glass-flex glass-space-x-1",animate:d?{}:{opacity:[.4,1,.4]},transition:h({duration:1.5,repeat:1/0,ease:"easeInOut"}),children:[0,1,2].map(t=>s.jsx(m.div,{className:"glass-w-1.5 glass-h-1.5 glass-surface-blue glass-radius-full",animate:d?{}:{y:[-2,0,-2]},transition:h({duration:.6,repeat:1/0,delay:t*.1,ease:"easeInOut"})},t))}),E&&!G&&s.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full",style:{backgroundColor:H[e.status]}})]},e.id);return s.jsxs(de,{ref:se,intensity:"subtle",className:`p-4 ${Z}`,...ee,children:[s.jsxs("div",{className:oe(),children:[p.visibleUsers.map((e,n)=>s.jsx(ie,{user:e,index:n},e.id)),p.hiddenCount>0&&s.jsxs(m.div,{className:`
                flex items-center space-x-2 p-2 rounded-lg text-white/60
                ${O({variant:"default"})}
              `,initial:{opacity:0},animate:d?{}:{opacity:1},transition:h({delay:.3}),children:[s.jsxs("div",{className:`
                ${i==="small"?"w-6 h-6":i==="large"?"w-12 h-12":"w-8 h-8"}
                rounded-full bg-white/20 flex items-center justify-center
                ${q()} font-medium
              `,children:["+",p.hiddenCount]}),s.jsxs("span",{className:q(),children:[p.hiddenCount," more"," ",p.hiddenCount===1?"user":"users"]})]})]}),_&&u.length>0&&s.jsx(m.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10",initial:{opacity:0,y:10},animate:d?{}:{opacity:1,y:0},exit:{opacity:0,y:10},children:s.jsx("p",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:u.length===1?`${r.find(e=>e.id===u[0])?.name} is typing...`:u.length===2?`${r.find(e=>e.id===u[0])?.name} and ${r.find(e=>e.id===u[1])?.name} are typing...`:`${u.length} people are typing...`})}),s.jsxs(m.div,{className:"glass-mt-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs glass-text-primary-glass-opacity-50",initial:{opacity:0},animate:d?{}:{opacity:1},transition:h({delay:.5}),children:[s.jsxs("span",{children:[p.totalOnline," online"]}),s.jsxs("span",{children:[r.length," total"]})]})]})});try{M.displayName="GlassPresenceIndicator",M.__docgenInfo={description:"",displayName:"GlassPresenceIndicator",props:{users:{defaultValue:null,description:"",name:"users",required:!1,type:{name:'{ id: string; name: string; avatar?: string | undefined; status: "online" | "offline" | "away" | "busy"; lastSeen?: Date | undefined; activity?: string | undefined; location?: string | undefined; timezone?: string | undefined; isTyping?: boolean | undefined; customStatus?: { ...; } | undefined; }[] | undefined'}},maxVisible:{defaultValue:{value:"5"},description:"",name:"maxVisible",required:!1,type:{name:"number | undefined"}},showAvatars:{defaultValue:{value:"true"},description:"",name:"showAvatars",required:!1,type:{name:"boolean | undefined"}},showNames:{defaultValue:{value:"true"},description:"",name:"showNames",required:!1,type:{name:"boolean | undefined"}},showStatus:{defaultValue:{value:"true"},description:"",name:"showStatus",required:!1,type:{name:"boolean | undefined"}},showActivity:{defaultValue:{value:"false"},description:"",name:"showActivity",required:!1,type:{name:"boolean | undefined"}},showLastSeen:{defaultValue:{value:"true"},description:"",name:"showLastSeen",required:!1,type:{name:"boolean | undefined"}},showTypingIndicator:{defaultValue:{value:"true"},description:"",name:"showTypingIndicator",required:!1,type:{name:"boolean | undefined"}},layout:{defaultValue:{value:"horizontal"},description:"",name:"layout",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"grid"'},{value:'"horizontal"'},{value:'"vertical"'},{value:'"stack"'}]}},size:{defaultValue:{value:"medium"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"small"'},{value:'"large"'}]}},groupSimilarStatus:{defaultValue:{value:"false"},description:"",name:"groupSimilarStatus",required:!1,type:{name:"boolean | undefined"}},realTimeSync:{defaultValue:{value:"false"},description:"",name:"realTimeSync",required:!1,type:{name:"boolean | undefined"}},soundEnabled:{defaultValue:{value:"true"},description:"",name:"soundEnabled",required:!1,type:{name:"boolean | undefined"}},animateChanges:{defaultValue:{value:"true"},description:"",name:"animateChanges",required:!1,type:{name:"boolean | undefined"}},theme:{defaultValue:{value:"auto"},description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"dark"'},{value:'"light"'}]}},onUserClick:{defaultValue:null,description:"",name:"onUserClick",required:!1,type:{name:"((userId: string) => void) | undefined"}},onStatusChange:{defaultValue:null,description:"",name:"onStatusChange",required:!1,type:{name:"((userId: string, status: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const a=[{id:"1",name:"Alice Johnson",avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",status:"online",activity:"Working on project",location:"San Francisco, CA",timezone:"PST",isTyping:!1,customStatus:{emoji:"💻",text:"Coding"}},{id:"2",name:"Bob Smith",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",status:"away",activity:"In a meeting",lastSeen:new Date(Date.now()-900*1e3),customStatus:{emoji:"🏢",text:"In meeting"}},{id:"3",name:"Carol Davis",status:"online",activity:"Available",isTyping:!0,customStatus:{emoji:"✨",text:"Ready to help!"}},{id:"4",name:"David Wilson",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",status:"busy",activity:"Do not disturb",lastSeen:new Date(Date.now()-300*1e3),customStatus:{emoji:"🔥",text:"On deadline"}},{id:"5",name:"Emma Brown",status:"offline",lastSeen:new Date(Date.now()-7200*1e3),location:"New York, NY"},{id:"6",name:"Frank Miller",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",status:"online",activity:"Available for chat",isTyping:!1},{id:"7",name:"Grace Lee",status:"away",activity:"Away from keyboard",lastSeen:new Date(Date.now()-1800*1e3),customStatus:{emoji:"🌮",text:"Lunch break"}},{id:"8",name:"Henry Chen",avatar:"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face",status:"online",activity:"Active",isTyping:!0}],xe={title:"Glass UI/Social/GlassPresenceIndicator",component:M,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{maxVisible:{control:{type:"range",min:1,max:10,step:1}},layout:{control:{type:"select"},options:["horizontal","vertical","grid","stack"]},size:{control:{type:"select"},options:["small","medium","large"]},theme:{control:{type:"select"},options:["light","dark","auto"]}}},y={args:{users:a.slice(0,5),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0}},v={args:{users:a.slice(0,4),layout:"horizontal",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1}},S={args:{users:a.slice(0,6),layout:"vertical",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},x={args:{users:a.slice(0,8),layout:"grid",size:"medium",showAvatars:!0,showNames:!0,showStatus:!0,maxVisible:8}},A={args:{users:a,layout:"stack",size:"small",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,maxVisible:6}},N={args:{users:a.slice(0,5),size:"small",layout:"horizontal",showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1}},b={args:{users:a.slice(0,4),size:"large",layout:"vertical",showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0}},j={args:{users:a,showAvatars:!1,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"stack",size:"small",maxVisible:8}},k={args:{users:a,showAvatars:!0,showNames:!1,showStatus:!0,showActivity:!1,showLastSeen:!1,showTypingIndicator:!1,layout:"horizontal",size:"small",maxVisible:10}},T={args:{users:a.map((o,w)=>({...o,isTyping:w%3===0})),showTypingIndicator:!0,showAvatars:!0,showNames:!0,showStatus:!0,layout:"vertical",maxVisible:6}},V={args:{users:a,groupSimilarStatus:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical",maxVisible:8}},z={args:{users:a.slice(0,6),realTimeSync:!0,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showLastSeen:!0,showTypingIndicator:!0,layout:"vertical"}},I={args:{users:a.filter(o=>o.status==="online"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,showTypingIndicator:!0,layout:"horizontal"}},L={args:{users:a.filter(o=>o.status==="offline"),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,showLastSeen:!0,layout:"vertical"}},U={args:{users:a.filter(o=>o.customStatus),showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!1,layout:"vertical",size:"medium"}},C={args:{users:a,maxVisible:3,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},D={args:{users:a.slice(0,5),animateChanges:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,layout:"vertical"}},$={args:{users:a.slice(0,5),soundEnabled:!1,showAvatars:!0,showNames:!0,showStatus:!0,showActivity:!0,realTimeSync:!0,layout:"horizontal"}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'online'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    showTypingIndicator: true,
    layout: 'horizontal'
  }
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.status === 'offline'),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    showLastSeen: true,
    layout: 'vertical'
  }
}`,...L.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.filter(user => user.customStatus),
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: false,
    layout: 'vertical',
    size: 'medium'
  }
}`,...U.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers,
    maxVisible: 3,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...C.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    users: mockUsers.slice(0, 5),
    animateChanges: false,
    showAvatars: true,
    showNames: true,
    showStatus: true,
    showActivity: true,
    layout: 'vertical'
  }
}`,...D.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};const Ae=["Default","HorizontalLayout","VerticalLayout","GridLayout","StackLayout","SmallSize","LargeSize","MinimalView","StatusOnly","WithTypingIndicators","GroupedByStatus","RealTimeSync","OnlineOnly","OfflineUsers","CustomStatuses","LimitedVisible","NoAnimations","SilentMode"];export{U as CustomStatuses,y as Default,x as GridLayout,V as GroupedByStatus,v as HorizontalLayout,b as LargeSize,C as LimitedVisible,j as MinimalView,D as NoAnimations,L as OfflineUsers,I as OnlineOnly,z as RealTimeSync,$ as SilentMode,N as SmallSize,A as StackLayout,k as StatusOnly,S as VerticalLayout,T as WithTypingIndicators,Ae as __namedExportsOrder,xe as default};
