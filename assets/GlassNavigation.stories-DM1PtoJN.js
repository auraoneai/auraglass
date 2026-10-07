import{r as i,a as Cs,aj as Ss,j as s,c as v}from"./iframe-Cqi-9gHA.js";import{S as ts}from"./springPhysics-DnOBl9UB.js";import{K as k,u as Is,e as Ds}from"./a11y-DBBBNlGj.js";import{O as Ps}from"./OptimizedGlassCore-CWgizUMZ.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-DlsmEFaF.js";function Es(t){const{items:h,orientation:b="vertical",loop:f=!0,homeEndKeys:a=!0,pageKeys:r=!1,onActivate:V,onSelect:q}=t,[m,z]=i.useState(0),[Q,rs]=i.useState(new Set),E=i.useRef(new Map),o=h.filter(l=>!l.disabled),d=i.useCallback(l=>{if(l<0||l>=o.length)return;const x=o[l],g=E.current.get(x.id);g&&(g.focus(),z(l))},[o]),S=i.useCallback(()=>{const l=m+1;l<o.length?d(l):f&&d(0)},[m,o.length,f,d]),D=i.useCallback(()=>{const l=m-1;l>=0?d(l):f&&d(o.length-1)},[m,o.length,f,d]),w=i.useCallback(()=>{d(0)},[d]),_=i.useCallback(()=>{d(o.length-1)},[o.length,d]),X=i.useCallback(l=>{const{key:x}=l,g=b==="vertical"||b==="both",N=b==="horizontal"||b==="both";switch(x){case k.ARROW_DOWN:g&&(l.preventDefault(),S());break;case k.ARROW_UP:g&&(l.preventDefault(),D());break;case k.ARROW_RIGHT:N&&(l.preventDefault(),S());break;case k.ARROW_LEFT:N&&(l.preventDefault(),D());break;case k.HOME:a&&(l.preventDefault(),w());break;case k.END:a&&(l.preventDefault(),_());break;case k.PAGE_UP:if(r){l.preventDefault();const A=Math.max(0,m-10);d(A)}break;case k.PAGE_DOWN:if(r){l.preventDefault();const A=Math.min(o.length-1,m+10);d(A)}break;case k.ENTER:case k.SPACE:if(m>=0&&m<o.length){l.preventDefault();const A=o[m];V?.(A.id)}break}},[b,S,D,w,_,a,r,m,o,d,V]),Z=i.useCallback((l,x)=>{x?E.current.set(l,x):E.current.delete(l)},[]),ss=i.useCallback((l,x=!1)=>{rs(g=>{const N=new Set(x?g:[]);return N.has(l)?N.delete(l):N.add(l),N}),q?.(l)},[q]);return{focusedIndex:m,selectedIds:Q,handleKeyDown:X,registerItem:Z,focusItem:d,selectItem:ss,moveNext:S,movePrevious:D,moveToFirst:w,moveToLast:_}}const Rs=({children:t})=>s.jsx("span",{className:"glass-inline-glass-flex glass-items-center glass-justify-center glass-min-w-18px glass-h-18px glass-px-1.5 glass-text-xs glass-font-semibold glass-text-primary glass-surface-blue glass-radius-full",children:t}),is=({name:t,size:h=24})=>s.jsx("span",{style:{fontSize:h},"aria-hidden":"true",children:"🔹"}),hs=({children:t,title:h})=>s.jsx("div",{title:h,children:t}),ns={left:0,top:0,width:0,height:0,opacity:0},Vs=t=>{const[h,b]=i.useState(ns),f=i.useCallback(a=>{b(r=>r.left===a.left&&r.top===a.top&&r.width===a.width&&r.height===a.height&&r.opacity===a.opacity?r:a)},[]);return{indicatorStyle:h,animateIndicator:f}},j=i.forwardRef(({items:t=[],activeItem:h,onItemClick:b,onMenuToggle:f,position:a="top",variant:r="standard",className:V,style:q,logo:m,actions:z,showDivider:Q=!1,glassIntensity:rs=.7,sticky:E=!1,maxWidth:o,compact:d=!1,centered:S=!1,zIndex:D=100,width:w,showLabels:_,initialExpandedItems:X=[],collapsible:Z=!1,initialCollapsed:ss=!1,...l},x)=>{const[g,N]=i.useState(!1),[A,fs]=i.useState(X),[u,vs]=i.useState(ss),G=Cs(),os=i.useRef(null),es=i.useRef({}),{defaultSpring:I}=Ss(),bs=t.filter(e=>!e.disabled).map(e=>({id:e.id||e.key,disabled:e.disabled})),{handleKeyDown:as,registerItem:cs}=Es({items:bs,orientation:a==="left"||a==="right"?"vertical":"horizontal",loop:!0,homeEndKeys:!0,onActivate:e=>{const n=t.find(c=>(c.id||c.key)===e);n&&F(e,n)}}),ys=Is("glass-navigation");i.useMemo(()=>{const e=ts.default;let n;return typeof I=="object"&&I!==null?n={...e,...I}:typeof I=="string"&&I in ts?n=ts?.[I]:n=e,n},[I]);const ds=i.useMemo(()=>G,[G]),{indicatorStyle:R,animateIndicator:T}=Vs();i.useEffect(()=>{if(ds){T(ns);return}const e=h?es.current?.[h]:null,n=os.current;if(e&&n){const c=e.getBoundingClientRect(),y=n.getBoundingClientRect();let C;a==="left"||a==="right"?C={left:a==="left"?0:y.width-3,top:c.top-y.top,width:3,height:c.height,opacity:1}:C={left:c.left-y.left,top:a==="top"?y.height-3:0,width:c.width,height:3,opacity:1},T(C)}else T(ns)},[h,a,u,ds,T]);const xs=i.useCallback(()=>{const e=!g;N(e),f&&f(e)},[g,f]),F=i.useCallback((e,n)=>{n?.onClick&&n?.onClick(),b&&b(n),n?.children&&n?.children.length>0&&fs(c=>c.includes(e)?c.filter(y=>y!==e):[...c,e]),g&&(N(!1),f&&f(!1))},[b,g,f]),Ns=i.useCallback(()=>{vs(e=>!e)},[]),ks=e=>{const n="flex items-center box-border";switch(e){case"left":case"right":return v(n,"flex-col h-full");default:return v(n,"flex-row w-full")}},js=e=>{switch(e){case"left":return{left:0,height:"100vh"};case"right":return{right:0,height:"100vh"};case"bottom":return{bottom:0,width:"100%"};default:return{top:0,width:"100%"}}},gs=i.useCallback((e,n=0)=>{const c=e?.id||e?.key,y=!!(h===e?.id||e?.active),C=e?.children&&e?.children.length>0,P=c?A.includes(c):!1,W=p=>{e?.id&&es.current&&(es.current[e?.id]=p)};if(e?.customElement)return s.jsx("li",{ref:W,className:v("relative z-10",e?.className),children:e?.customElement},e?.id||e?.key);const us=s.jsxs(s.Fragment,{children:[e?.icon&&s.jsx("span",{className:"nav-item-icon","aria-hidden":"true",children:e?.icon}),(!u||n>0)&&s.jsx("span",{className:"nav-item-label",children:e?.label}),e?.badge&&s.jsx(Rs,{children:String(e?.badge)}),C&&!u&&s.jsx("span",{className:"nav-item-expand-icon","aria-hidden":"true",children:s.jsx(is,{name:P?"expand_less":"expand_more"})})]}),ms=v("flex items-center glass-gap-2 text-decoration-none border-none bg-transparent cursor-pointer transition-all duration-200","glass-radius-md border-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50","glass-focus glass-touch-target glass-contrast-guard",{"glass-px-2 glass-py-1.5 glass-text-sm":r==="minimal","glass-px-4 glass-py-2.5 glass-text-base":r!=="minimal","text-blue-200 font-semibold bg-blue-500/15":y,"glass-text-secondary font-normal hover:bg-white/10":!y,"opacity-50 pointer-events-none":e?.disabled,"active:scale-[0.98]":!e?.disabled}),ps=Ds({id:c,current:y?"page":void 0,expanded:C?P:void 0,controls:C?`${c}-submenu`:void 0,posinset:n===0?t.findIndex(p=>p.id===e?.id)+1:void 0,setsize:n===0?t.length:void 0}),ls=e?.href?s.jsx("a",{href:e?.href,target:e?.external?"_blank":void 0,rel:e?.external?"noopener noreferrer":void 0,className:ms,onClick:p=>{if(e?.disabled){p.preventDefault();return}F(e?.id||e?.key,e)},onKeyDown:as,...ps,"aria-disabled":e?.disabled,ref:p=>{cs(e?.id||e?.key,p),W(p)},children:us}):s.jsx("button",{type:"button",className:ms,style:{appearance:"none",WebkitAppearance:"none",border:0,background:y?"rgba(100,116,139,.16)":"transparent",color:"inherit",font:"inherit"},onClick:p=>F(e?.id||e?.key,e),onKeyDown:as,disabled:e?.disabled,...ps,ref:p=>{cs(e?.id||e?.key,p),W(p)},children:us});return s.jsxs("li",{ref:W,className:v("relative z-10",(a==="top"||a==="bottom")&&"flex-none",e?.className),children:[e?.tooltip&&!u?s.jsx(hs,{title:e?.tooltip,children:ls}):u&&n===0?s.jsx(hs,{title:e?.label,children:ls}):ls,C&&s.jsx("ul",{id:`${c}-submenu`,"aria-hidden":!P||u,className:v("list-none m-0 glass-p-2 glass-mt-1 glass-radius-md bg-white/5 overflow-hidden transition-all duration-300",{"opacity-100 max-glass-h-500px visible":P&&!u,"opacity-0 max-h-0 invisible":!P||u}),style:!P||u?{display:"none"}:void 0,children:e?.children?.map(p=>gs(p,n+1))})]},c)},[h,A,u,r,F]),ws=r==="minimal"?"level1":"level2",As=r==="minimal"?"low":"medium";return s.jsx("nav",{children:s.jsxs(Ps,{ref:x,intent:"neutral",elevation:ws,tier:As,intensity:"medium",depth:r==="prominent"?3:2,tint:"neutral",border:"subtle",animation:G?"none":"gentle",performanceMode:"medium",id:ys,role:"navigation","aria-label":"Main navigation",onKeyDown:as,className:v(ks(a),{"justify-center":S,"justify-between":!S,"glass-p-2 glass-px-4":d,"glass-p-3 glass-px-6":!d,"sticky top-0":E},a==="left"||a==="right"?"w-60":"w-full",a==="left"||a==="right"?"h-screen":"h-auto","md:glass-p-2 md:glass-px-4",V),style:{...js(a),...q,zIndex:D,width:w?typeof w=="number"?`${w}px`:w:a==="left"||a==="right"?"240px":"100%",maxWidth:o?typeof o=="number"?`${o}px`:o:void 0},...l,children:[s.jsx("button",{onClick:xs,className:v("hidden md:hidden lg:hidden","bg-transparent border-none cursor-pointer glass-p-2 text-inherit","flex items-center justify-center","glass-focus glass-touch-target glass-contrast-guard","max-md:flex"),"aria-label":g?"Close menu":"Open menu","aria-expanded":g,style:{appearance:"none",WebkitAppearance:"none",border:"1px solid rgba(148,163,184,.28)",borderRadius:12,background:"rgba(255,255,255,.16)",color:"inherit"},children:s.jsx(is,{name:g?"close":"menu"})}),m&&s.jsx("div",{className:v("flex items-center",{"justify-center w-full glass-p-4":a==="left"||a==="right"}),children:m}),s.jsxs("ul",{ref:os,className:v("flex list-none m-0 glass-p-0 flex-1 items-center relative",{"flex-col glass-gap-4":a==="left"||a==="right","flex-row flex-wrap glass-gap-3":a==="top"||a==="bottom","glass-gap-3":r==="minimal","mt-6 w-full":a==="left"||a==="right","mobile-open":g}),role:"menubar","aria-orientation":a==="left"||a==="right"?"vertical":"horizontal",children:[!G&&s.jsx("div",{className:"glass-absolute glass-surface-blue glass-radius-sm glass-z-0 glass-pointer-events-none glass-transition-all glass-duration-300 glass-ease-out",style:{left:`${R.left}px`,top:`${R.top}px`,width:`${R.width}px`,height:`${R.height}px`,opacity:R.opacity}}),t.map(e=>gs(e))]}),Q&&s.jsx("div",{className:v("bg-white/20",{"w-4/5 h-px my-3 mx-auto":a==="left"||a==="right","w-px h-6 mx-3":a==="top"||a==="bottom"})}),z&&s.jsx("div",{className:"glass-flex glass-items-center glass-gap-3",children:z}),Z&&(a==="left"||a==="right")&&s.jsx("button",{onClick:Ns,title:u?"Expand":"Collapse","aria-label":u?"Expand navigation":"Collapse navigation",className:v("absolute top-1/2 -translate-y-1/2 w-6 h-6 glass-radius-full","flex items-center justify-center cursor-pointer","bg-white/10 border border-white/20 transition-all duration-200","glass-focus glass-touch-target glass-contrast-guard","hover:bg-white/20",{"-right-3":!u,"-left-3":u}),style:{appearance:"none",WebkitAppearance:"none",border:"1px solid rgba(148,163,184,.3)",background:"rgba(255,255,255,.18)",color:"inherit"},children:s.jsx(is,{name:a==="left"?u?"chevron_right":"chevron_left":u?"chevron_left":"chevron_right"})})]})})});j.displayName="GlassNavigation";try{j.displayName="GlassNavigation",j.__docgenInfo={description:"A glass-styled navigation component with various layout options",displayName:"GlassNavigation",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"NavigationItem[] | undefined"}},position:{defaultValue:{value:"top"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"right"'},{value:'"bottom"'},{value:'"top"'}]}},variant:{defaultValue:{value:"standard"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"standard"'},{value:'"default"'},{value:'"minimal"'},{value:'"prominent"'}]}},glassIntensity:{defaultValue:{value:"0.7"},description:"",name:"glassIntensity",required:!1,type:{name:"number | undefined"}},sticky:{defaultValue:{value:"false"},description:"",name:"sticky",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},centered:{defaultValue:{value:"false"},description:"",name:"centered",required:!1,type:{name:"boolean | undefined"}},zIndex:{defaultValue:{value:"100"},description:"",name:"zIndex",required:!1,type:{name:"number | undefined"}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"string | number | undefined"}},maxWidth:{defaultValue:null,description:"",name:"maxWidth",required:!1,type:{name:"string | number | undefined"}},activeItem:{defaultValue:null,description:"",name:"activeItem",required:!1,type:{name:"string | undefined"}},onItemClick:{defaultValue:null,description:"",name:"onItemClick",required:!1,type:{name:"((item: NavigationItem) => void) | undefined"}},onMenuToggle:{defaultValue:null,description:"",name:"onMenuToggle",required:!1,type:{name:"((open: boolean) => void) | undefined"}},showLabels:{defaultValue:null,description:"",name:"showLabels",required:!1,type:{name:"boolean | undefined"}},showDivider:{defaultValue:{value:"false"},description:"",name:"showDivider",required:!1,type:{name:"boolean | undefined"}},collapsible:{defaultValue:{value:"false"},description:"",name:"collapsible",required:!1,type:{name:"boolean | undefined"}},collapsed:{defaultValue:null,description:"",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},initialCollapsed:{defaultValue:{value:"false"},description:"",name:"initialCollapsed",required:!1,type:{name:"boolean | undefined"}},initialExpandedItems:{defaultValue:{value:"[]"},description:"",name:"initialExpandedItems",required:!1,type:{name:"string[] | undefined"}},onCollapseChange:{defaultValue:null,description:"",name:"onCollapseChange",required:!1,type:{name:"((collapsed: boolean) => void) | undefined"}},logo:{defaultValue:null,description:"",name:"logo",required:!1,type:{name:"ReactNode"}},actions:{defaultValue:null,description:"",name:"actions",required:!1,type:{name:"ReactNode"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},intent:{defaultValue:null,description:"Glass surface intent",name:"intent",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"neutral"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"info"'}]}},elevation:{defaultValue:null,description:"Glass surface elevation",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'}]}},tier:{defaultValue:null,description:"Performance tier",name:"tier",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"medium"'},{value:'"high"'},{value:'"low"'}]}}}}}catch{}const Ws={title:"Navigation/Glass Navigation",component:j,parameters:{layout:"centered",docs:{description:{component:"A glassmorphism navigation component with consciousness interface features including predictive navigation, eye tracking, adaptive layouts, and spatial audio navigation cues."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},position:{control:{type:"select"},options:["top","bottom","left","right"],description:"Navigation position"},variant:{control:{type:"select"},options:["default","minimal","prominent","standard"],description:"Navigation variant"},compact:{control:"boolean",description:"Compact mode"},showLabels:{control:"boolean",description:"Show item labels"}},args:{className:"",position:"top",variant:"default",compact:!1,showLabels:!0}},O={render:()=>s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-text-center glass-gap-2",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Navigation Consciousness Features"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Experience intelligent navigation systems"})]}),s.jsxs("div",{className:"glass-grid glass-glass-glass-grid-cols-1 lg:glass-glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-blue glass-radius-full animate-pulse"}),s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Predictive Navigation"})]}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary glass-gap-1 ml-5",children:[s.jsx("li",{children:"• Route preloading"}),s.jsx("li",{children:"• Pattern recognition"}),s.jsx("li",{children:"• Usage analytics"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-green glass-radius-full animate-pulse"}),s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Eye Tracking"})]}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary glass-gap-1 ml-5",children:[s.jsx("li",{children:"• Gaze-based highlighting"}),s.jsx("li",{children:"• Focus previews"}),s.jsx("li",{children:"• Attention analytics"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse"}),s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Adaptive Layout"})]}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary glass-gap-1 ml-5",children:[s.jsx("li",{children:"• Biometric responsiveness"}),s.jsx("li",{children:"• Complexity adjustment"}),s.jsx("li",{children:"• Personalized layouts"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse"}),s.jsx("h3",{className:"glass-font-medium glass-text-primary",children:"Spatial Audio"})]}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary glass-gap-1 ml-5",children:[s.jsx("li",{children:"• Directional navigation cues"}),s.jsx("li",{children:"• Audio landmarks"}),s.jsx("li",{children:"• Immersive wayfinding"})]})]})]})]}),parameters:{layout:"padded"}},H={args:{items:[{key:"home",label:"Home",icon:"🏠",path:"/"},{key:"dashboard",label:"Dashboard",icon:"📊",path:"/dashboard"},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]}},L={args:{items:[{key:"home",label:"Home",icon:"🏠",path:"/"},{key:"projects",label:"Projects",icon:"📁",children:[{key:"project1",label:"Project Alpha",path:"/projects/alpha"},{key:"project2",label:"Project Beta",path:"/projects/beta"}]},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]}},M={args:{position:"left",items:[{key:"home",label:"Home",icon:"🏠",path:"/"},{key:"analytics",label:"Analytics",icon:"📈",path:"/analytics"},{key:"users",label:"Users",icon:"👥",path:"/users"},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]}},K={render:t=>s.jsx("div",{className:"space-y-6",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Predictive Navigation"}),s.jsx("p",{className:"glass-text-xs glass-text-secondary glass-mb-4",children:"Anticipates user navigation patterns and preloads routes"}),s.jsx(j,{...t})]})}),args:{items:[{key:"dashboard",label:"Dashboard",icon:"📊",path:"/dashboard"},{key:"analytics",label:"Analytics",icon:"📈",path:"/analytics"},{key:"reports",label:"Reports",icon:"📋",path:"/reports"},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]}},B={render:t=>s.jsx("div",{className:"space-y-6",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Eye Tracking Navigation"}),s.jsx("p",{className:"glass-text-xs glass-text-secondary glass-mb-4",children:"Highlights navigation items based on user gaze"}),s.jsx(j,{...t})]})}),args:{items:[{key:"home",label:"Home",icon:"🏠",path:"/"},{key:"projects",label:"Projects",icon:"📁",path:"/projects"},{key:"team",label:"Team",icon:"👥",path:"/team"},{key:"profile",label:"Profile",icon:"👤",path:"/profile"}]}},$={render:t=>s.jsx("div",{className:"space-y-6",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Adaptive Navigation"}),s.jsx("p",{className:"glass-text-xs glass-text-secondary glass-mb-4",children:"Adjusts layout complexity based on user stress and preferences"}),s.jsx(j,{...t})]})}),args:{items:[{key:"dashboard",label:"Dashboard",icon:"📊",path:"/dashboard"},{key:"data",label:"Data Analysis",icon:"🔍",children:[{key:"charts",label:"Charts",path:"/data/charts"},{key:"tables",label:"Tables",path:"/data/tables"},{key:"exports",label:"Exports",path:"/data/exports"}]},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]}},U={render:t=>s.jsx("div",{className:"space-y-6",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Spatial Audio Navigation"}),s.jsx("p",{className:"glass-text-xs glass-text-secondary glass-mb-4",children:"Provides directional audio cues for navigation items"}),s.jsx(j,{...t,position:"top"})]})}),args:{items:[{key:"prev",label:"Previous",icon:"←",path:"/prev"},{key:"current",label:"Current Page",icon:"●",path:"/current"},{key:"next",label:"Next",icon:"→",path:"/next"}]}},Y={render:t=>s.jsx("div",{className:"space-y-6",children:s.jsxs("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard",children:[s.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Achievement-Driven Navigation"}),s.jsx("p",{className:"glass-text-xs glass-text-secondary glass-mb-4",children:"Tracks navigation patterns and unlocks new features"}),s.jsx(j,{...t})]})}),args:{items:[{key:"beginner",label:"Getting Started",icon:"🌱",path:"/start"},{key:"intermediate",label:"Advanced Features",icon:"🚀",path:"/advanced"},{key:"expert",label:"Expert Tools",icon:"⭐",path:"/expert"},{key:"master",label:"Master Level",icon:"👑",path:"/master"}]}},J={render:t=>s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-2",children:[s.jsx("h2",{className:"glass-text-xl glass-font-semibold glass-text-primary",children:"Consciousness-Enhanced Navigation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Full consciousness interface integration"})]}),s.jsx("div",{className:"glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard",children:s.jsx(j,{...t})}),s.jsxs("div",{className:"glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-2 glass-gap-4 glass-text-sm",children:[s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Intelligence Features"}),s.jsxs("ul",{className:"glass-text-secondary glass-gap-1",children:[s.jsx("li",{children:"• Predictive route preloading"}),s.jsx("li",{children:"• Pattern recognition"}),s.jsx("li",{children:"• Gaze-based highlighting"}),s.jsx("li",{children:"• Focus previews"})]})]}),s.jsxs("div",{className:"glass-surface-overlay glass-radius-lg glass-p-3",children:[s.jsx("h4",{className:"glass-font-medium glass-text-primary glass-mb-2",children:"Adaptive Features"}),s.jsxs("ul",{className:"glass-text-secondary glass-gap-1",children:[s.jsx("li",{children:"• Biometric responsiveness"}),s.jsx("li",{children:"• Complexity adjustment"}),s.jsx("li",{children:"• Spatial audio navigation"}),s.jsx("li",{children:"• Achievement tracking"})]})]})]})]}),args:{items:[{key:"home",label:"Home",icon:"🏠",path:"/"},{key:"dashboard",label:"Dashboard",icon:"📊",path:"/dashboard"},{key:"tools",label:"Tools",icon:"🛠️",children:[{key:"analyzer",label:"Data Analyzer",path:"/tools/analyzer"},{key:"generator",label:"Report Generator",path:"/tools/generator"}]},{key:"settings",label:"Settings",icon:"⚙️",path:"/settings"}]},parameters:{layout:"padded"}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Navigation Consciousness Features</h2>
        <p className="glass-text-sm glass-text-secondary">Experience intelligent navigation systems</p>
      </div>
      
      <div className="glass-grid glass-glass-glass-grid-cols-1 lg:glass-glass-glass-grid-cols-2 glass-gap-6">
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-blue glass-radius-full animate-pulse"></div>
            <h3 className="glass-font-medium glass-text-primary">Predictive Navigation</h3>
          </div>
          <ul className="glass-text-sm glass-text-secondary glass-gap-1 ml-5">
            <li>• Route preloading</li>
            <li>• Pattern recognition</li>
            <li>• Usage analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full animate-pulse"></div>
            <h3 className="glass-font-medium glass-text-primary">Eye Tracking</h3>
          </div>
          <ul className="glass-text-sm glass-text-secondary glass-gap-1 ml-5">
            <li>• Gaze-based highlighting</li>
            <li>• Focus previews</li>
            <li>• Attention analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="glass-font-medium glass-text-primary">Adaptive Layout</h3>
          </div>
          <ul className="glass-text-sm glass-text-secondary glass-gap-1 ml-5">
            <li>• Biometric responsiveness</li>
            <li>• Complexity adjustment</li>
            <li>• Personalized layouts</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-gap-3 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-w-3 glass-h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="glass-font-medium glass-text-primary">Spatial Audio</h3>
          </div>
          <ul className="glass-text-sm glass-text-secondary glass-gap-1 ml-5">
            <li>• Directional navigation cues</li>
            <li>• Audio landmarks</li>
            <li>• Immersive wayfinding</li>
          </ul>
        </div>
      </div>
    </div>,
  parameters: {
    layout: 'padded'
  }
}`,...O.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      key: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    }, {
      key: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  }
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      key: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    }, {
      key: 'projects',
      label: 'Projects',
      icon: '📁',
      children: [{
        key: 'project1',
        label: 'Project Alpha',
        path: '/projects/alpha'
      }, {
        key: 'project2',
        label: 'Project Beta',
        path: '/projects/beta'
      }]
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  }
}`,...L.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    position: 'left',
    items: [{
      key: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    }, {
      key: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics'
    }, {
      key: 'users',
      label: 'Users',
      icon: '👥',
      path: '/users'
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  }
}`,...M.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Predictive Navigation</h3>
        <p className="glass-text-xs glass-text-secondary glass-mb-4">Anticipates user navigation patterns and preloads routes</p>
        <GlassNavigation {...args} />
      </div>
    </div>,
  args: {
    items: [{
      key: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    }, {
      key: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics'
    }, {
      key: 'reports',
      label: 'Reports',
      icon: '📋',
      path: '/reports'
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  }
}`,...K.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Eye Tracking Navigation</h3>
        <p className="glass-text-xs glass-text-secondary glass-mb-4">Highlights navigation items based on user gaze</p>
        <GlassNavigation {...args} />
      </div>
    </div>,
  args: {
    items: [{
      key: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    }, {
      key: 'projects',
      label: 'Projects',
      icon: '📁',
      path: '/projects'
    }, {
      key: 'team',
      label: 'Team',
      icon: '👥',
      path: '/team'
    }, {
      key: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile'
    }]
  }
}`,...B.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Adaptive Navigation</h3>
        <p className="glass-text-xs glass-text-secondary glass-mb-4">Adjusts layout complexity based on user stress and preferences</p>
        <GlassNavigation {...args} />
      </div>
    </div>,
  args: {
    items: [{
      key: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    }, {
      key: 'data',
      label: 'Data Analysis',
      icon: '🔍',
      children: [{
        key: 'charts',
        label: 'Charts',
        path: '/data/charts'
      }, {
        key: 'tables',
        label: 'Tables',
        path: '/data/tables'
      }, {
        key: 'exports',
        label: 'Exports',
        path: '/data/exports'
      }]
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  }
}`,...$.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Spatial Audio Navigation</h3>
        <p className="glass-text-xs glass-text-secondary glass-mb-4">Provides directional audio cues for navigation items</p>
        <GlassNavigation {...args} position="top" />
      </div>
    </div>,
  args: {
    items: [{
      key: 'prev',
      label: 'Previous',
      icon: '←',
      path: '/prev'
    }, {
      key: 'current',
      label: 'Current Page',
      icon: '●',
      path: '/current'
    }, {
      key: 'next',
      label: 'Next',
      icon: '→',
      path: '/next'
    }]
  }
}`,...U.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-4 glass-contrast-guard">
        <h3 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Achievement-Driven Navigation</h3>
        <p className="glass-text-xs glass-text-secondary glass-mb-4">Tracks navigation patterns and unlocks new features</p>
        <GlassNavigation {...args} />
      </div>
    </div>,
  args: {
    items: [{
      key: 'beginner',
      label: 'Getting Started',
      icon: '🌱',
      path: '/start'
    }, {
      key: 'intermediate',
      label: 'Advanced Features',
      icon: '🚀',
      path: '/advanced'
    }, {
      key: 'expert',
      label: 'Expert Tools',
      icon: '⭐',
      path: '/expert'
    }, {
      key: 'master',
      label: 'Master Level',
      icon: '👑',
      path: '/master'
    }]
  }
}`,...Y.parameters?.docs?.source}}};J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-8">
      <div className="glass-text-center glass-gap-2">
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Consciousness-Enhanced Navigation</h2>
        <p className="glass-text-sm glass-text-secondary">Full consciousness interface integration</p>
      </div>
      
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg glass-p-6 glass-contrast-guard">
        <GlassNavigation {...args} />
      </div>
      
      <div className="glass-grid glass-glass-glass-grid-cols-1 md:glass-glass-glass-grid-cols-2 glass-gap-4 glass-text-sm">
        <div className="glass-surface-overlay glass-radius-lg glass-p-3">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Intelligence Features</h4>
          <ul className="glass-text-secondary glass-gap-1">
            <li>• Predictive route preloading</li>
            <li>• Pattern recognition</li>
            <li>• Gaze-based highlighting</li>
            <li>• Focus previews</li>
          </ul>
        </div>
        <div className="glass-surface-overlay glass-radius-lg glass-p-3">
          <h4 className="glass-font-medium glass-text-primary glass-mb-2">Adaptive Features</h4>
          <ul className="glass-text-secondary glass-gap-1">
            <li>• Biometric responsiveness</li>
            <li>• Complexity adjustment</li>
            <li>• Spatial audio navigation</li>
            <li>• Achievement tracking</li>
          </ul>
        </div>
      </div>
    </div>,
  args: {
    items: [{
      key: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    }, {
      key: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    }, {
      key: 'tools',
      label: 'Tools',
      icon: '🛠️',
      children: [{
        key: 'analyzer',
        label: 'Data Analyzer',
        path: '/tools/analyzer'
      }, {
        key: 'generator',
        label: 'Report Generator',
        path: '/tools/generator'
      }]
    }, {
      key: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }]
  },
  parameters: {
    layout: 'padded'
  }
}`,...J.parameters?.docs?.source}}};const Os=["ConsciousnessOverview","Default","WithSubmenu","VerticalNavigation","WithPredictiveNavigation","WithEyeTracking","AdaptiveLayout","WithSpatialAudio","AchievementDrivenNavigation","ConsciousnessShowcase"];export{Y as AchievementDrivenNavigation,$ as AdaptiveLayout,O as ConsciousnessOverview,J as ConsciousnessShowcase,H as Default,M as VerticalNavigation,B as WithEyeTracking,K as WithPredictiveNavigation,U as WithSpatialAudio,L as WithSubmenu,Os as __namedExportsOrder,Ws as default};
