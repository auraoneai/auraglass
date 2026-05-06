import{r as g,j as e,c as r,d as q,R as G}from"./iframe-DpweptvF.js";import{G as A}from"./GlassButton-CoJjSHnE.js";import{a as ee}from"./GlassPopover-C4-InT3I.js";import{r as se}from"./index-CAjyqNZv.js";import{M as W}from"./MotionFramer-BmJovKMH.js";import{O as ae}from"./OptimizedGlassCore-UOg4NIOz.js";import{C as le}from"./chevron-right-1rtoKK3s.js";import{C as re}from"./chevron-left-DZ8A7DqS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DErlfuJO.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";import"./GlassPredictiveEngine-CJz8dse6.js";import"./GlassAchievementSystem-DQQoVp6r.js";import"./GlassBiometricAdaptation-CJofGeVw.js";import"./MotionPreferenceContext-5A7bWbbY.js";import"./GlassEyeTracking-BvBuetm1.js";import"./GlassSpatialAudio-Csw4ezvx.js";import"./FocusTrap-CqwvM-w0.js";import"./index-DYccxXV8.js";import"./index-CWG1rEj-.js";import"./utilsCore-Diw1ReC2.js";import"./createLucideIcon-eJ4-KqhR.js";const M=g.createContext(void 0),R=()=>{const s=g.useContext(M);if(!s)throw new Error("Sidebar components must be used within GlassSidebar");return s},f=g.forwardRef(({items:s,activeId:i,variant:a="default",width:l="md",collapsible:u=!0,collapsed:o=!1,onCollapsedChange:c,open:d=!0,onOpenChange:p,header:x,footer:b,logo:v,userInfo:y,onNavigate:L,renderItem:T,className:B,...D},j)=>{const E=g.useRef(null),[F,U]=g.useState(null),[$,H]=g.useState(o),n=o??$,X={sm:n?"w-16":"w-48",md:n?"w-16":"w-64",lg:n?"w-20":"w-72",xl:n?"w-20":"w-80"},J={default:"border-r border-border/20",compact:"border-r border-border/10",floating:"glass-mx-4 glass-my-4 squiricle border border-border/20",overlay:"border-r border-border/20 shadow-xl"},K=()=>{const t=!n;H(t),c?.(t)},Q={collapsed:n,activeId:i,onNavigate:t=>{t?.disabled||(L?.(t),a==="overlay"&&p?.(!1))},renderItem:T};if(a==="overlay"&&!d)return null;const Y={sm:192,md:256,lg:288,xl:320},Z={sm:64,md:64,lg:80,xl:80};return g.useLayoutEffect(()=>{const t=E.current;if(!t)return;const m=()=>{const N=t.getBoundingClientRect();U(N.left+N.width)};m();let h=null;typeof window<"u"&&"ResizeObserver"in window&&(h=new ResizeObserver(()=>m()),h.observe(t)),window.addEventListener("resize",m),window.addEventListener("scroll",m,!0);const V=()=>{m(),w=requestAnimationFrame(V)};let w=requestAnimationFrame(V);return()=>{h&&h.disconnect(),window.removeEventListener("resize",m),window.removeEventListener("scroll",m,!0),cancelAnimationFrame(w)}},[n]),e.jsxs(M.Provider,{"data-glass-component":!0,value:Q,children:[e.jsx(W,{preset:a==="overlay"?"slideRight":"none",className:r(a==="overlay"&&"fixed inset-y-0 left-0 z-50","relative overflow-visible z-[60]"),style:{overflow:"visible"},children:e.jsxs(ae,{ref:t=>{E.current=t,typeof j=="function"?j(t):j&&typeof j=="object"&&(j.current=t)},intent:"primary",elevation:a==="floating"?"level2":"level1",intensity:"medium",depth:a==="floating"?3:2,tint:"lavender",border:a==="floating"?"gradient":"subtle",animation:"none",performanceMode:"medium",role:"navigation","aria-label":D["aria-label"]||"Main navigation",className:r("h-screen max-h-screen flex flex-col transition-colors overflow-visible",X?.[l],J?.[a],a==="floating"?"squiricle":"",B),style:{overflow:"visible"},...D,children:[(x||v)&&e.jsx("div",{className:"glass-flex-shrink-0 glass-p-4 glass-border-b glass-border-glass-border/20",children:x||e.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-full",children:v&&e.jsx("div",{className:r(`flex items-center glass-gap-3 transition-all duration-[${q.DURATION.normal}ms]`,n?"scale-75 opacity-70":"scale-100 opacity-100"),children:v})})}),y&&!n&&e.jsx("div",{className:"glass-flex-shrink-0 glass-p-4 glass-border-b glass-border-glass-border/10",children:y}),e.jsx("div",{className:r("flex-1 glass-px-4 glass-py-2",n?"overflow-hidden":"overflow-y-auto overflow-x-visible"),children:e.jsx(z,{items:s})}),b&&e.jsx("div",{className:"glass-flex-shrink-0 glass-p-4 glass-border-t glass-border-glass-border/20",children:b})]})}),u&&(()=>{const[t]=(function(){const[w,N]=g.useState(!1);return g.useEffect(()=>N(!0),[]),[w,N]})();if(!t)return null;const m=(n?Z:Y)[l],h=F??m;return se.createPortal(e.jsx("div",{className:"glass-fixed glass-top-0 glass-h-screen glass-z-max",style:{left:Math.max(0,h-24),width:48,pointerEvents:"auto"},children:e.jsx("button",{type:"button",onClick:K,title:n?"Expand sidebar":"Collapse sidebar",className:r("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 glass-radius-full","flex items-center justify-center","glass-glass-backdrop-blur-md2xl border","glass-focus glass-touch-target glass-contrast-guard","shadow-[0_6px_18px_color-mix(in_srgb,var(--glass-black)_35%,transparent),inset_0_1px_2px_var(--glass-bg-active)] ring-1","hover:bg-white/65 active:bg-white/70"),"aria-label":n?"Expand sidebar":"Collapse sidebar",children:n?e.jsx(le,{className:"glass-w-5 glass-h-5 glass-text-primary glass-drop-shadow-custom",strokeWidth:3}):e.jsx(re,{className:"glass-w-5 glass-h-5 glass-text-primary glass-drop-shadow-custom",strokeWidth:3})})}),document.body)})(),a==="overlay"&&d&&e.jsx("div",{className:"glass-fixed glass-inset-0 glass-surface-dark/50 glass-backdrop-blur-sm glass-z-40 glass-contrast-guard",onClick:t=>p?.(!1)})]})});f.displayName="GlassSidebar";function z({items:s,level:i=0}){return e.jsx("ul",{className:r("glass-gap-2",i>0&&"glass-ml-4"),children:(s||[]).map(a=>e.jsx(te,{item:a,level:i},a?.id))})}function te({item:s,level:i}){const{collapsed:a,activeId:l,onNavigate:u,renderItem:o}=R(),c=i===0&&s?.id==="home",[d,p]=g.useState(c),x=l===s?.id,b=s?.children&&s?.children.length>0;if(o)return e.jsx("li",{children:o(s,i)});const v=()=>{b&&!a?p(!d):(u?.(s),s?.onClick?.())},y=e.jsxs(A,{variant:"ghost",onClick:v,disabled:s?.disabled,className:r(`w-full flex items-center glass-gap-3 glass-radius-md transition-all duration-[${q.DURATION.fast}ms] relative group`,"hover:bg-white/10 focus:outline-none",a?"glass-px-2 glass-py-2.5 justify-center":"glass-px-3 glass-py-2","glass-text-sm font-medium",x?'bg-primary/15 text-primary shadow-[0_0_0_2px_${glassStyles.borderColor || "var(--glass-color-primary, 0.2)"}]':"",!x&&"glass-text-secondary hover:text-foreground",s?.disabled&&"opacity-50 cursor-not-allowed"),children:[s?.icon&&e.jsx("span",{className:"glass-flex-shrink-0 glass-w-6 glass-h-6 glass-flex glass-items-center glass-justify-center glass-text-lg",children:G.isValidElement(s.icon)?G.cloneElement(s.icon,{className:r(s.icon.props?.className,a?"w-6 h-6":"w-5 h-5")}):s.icon}),!a&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"glass-flex-1 glass-text-left glass-whitespace-nowrap glass-truncate glass-leading-5",children:s?.label}),s?.badge&&e.jsx("span",{className:r(`flex-shrink-0 glass-px-2 glass-py-1 glass-text-xs glass-radius-full font-medium transition-all duration-[${q.DURATION.fast}ms]`,"bg-black/15 border border-black/20 shadow-md glass-backdrop-blur-md","group-hover:bg-black/20 group-hover:border-black/25 group-hover:shadow-lg","relative z-10"),style:{color:"var(--glass-white)"},children:s?.badge}),b&&e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:r(`flex-shrink-0 transition-transform duration-[${q.DURATION.fast}ms] glass-text-primary/50`,d?"rotate-90":"rotate-0"),children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})]})]});return e.jsxs("li",{children:[a&&s?.label?e.jsx(ee,{content:s?.label,placement:"right",zIndex:9999,showDelay:300,children:y}):y,b&&!a&&d&&e.jsx(W,{preset:"slideDown",className:"glass-mt-1",children:e.jsx("div",{className:"glass-ml-2 glass-pl-4 glass-border-l glass-border-glass-border/20",children:e.jsx(z,{items:s?.children,level:i+1})})})]})}function P({logo:s,title:i,subtitle:a,href:l,onClick:u,className:o}){const{collapsed:c}=R(),d=()=>e.jsxs("div",{className:r("flex items-center glass-gap-3",c&&"justify-center"),children:[s&&e.jsx("div",{className:"glass-flex-shrink-0 glass-w-8 glass-h-8 glass-flex glass-items-center glass-justify-center",children:s}),!c&&(i||a)&&e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[i&&e.jsx("h1",{className:"glass-text-lg glass-font-bold glass-text-primary glass-truncate",children:i}),a&&e.jsx("p",{className:"glass-text-xs glass-text-secondary glass-truncate",children:a})]})]});return l?e.jsx("a",{href:l,className:r("block",o),children:e.jsx(d,{})}):u?e.jsx(A,{variant:"ghost",onClick:u,className:r("block w-full text-left",o),children:e.jsx(d,{})}):e.jsx("div",{className:o,children:e.jsx(d,{})})}function O({name:s,email:i,avatar:a,status:l,actions:u,onClick:o,className:c}){const{collapsed:d}=R();if(d)return e.jsx("div",{className:r("flex justify-center",c),children:e.jsxs("div",{className:"glass-relative",children:[a?e.jsx("img",{src:a,alt:s,className:"glass-w-8 glass-h-8 glass-radius-full glass-object-cover"}):e.jsx("div",{className:"glass-w-8 glass-h-8 glass-radius-full glass-surface-primary/20 glass-flex glass-items-center glass-justify-center",children:e.jsx("span",{className:"glass-text-sm glass-font-medium",children:s.charAt(0)})}),l&&e.jsx("div",{className:r("absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border border-background",{"bg-green-500":l==="online","bg-yellow-500":l==="away","bg-red-500":l==="busy","bg-gray-500":l==="offline"})})]})});const p=()=>e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e.jsxs("div",{className:"glass-relative glass-flex-shrink-0",children:[a?e.jsx("img",{src:a,alt:s,className:"glass-w-10 glass-h-10 glass-radius-full glass-object-cover"}):e.jsx("div",{className:"glass-w-10 glass-h-10 glass-radius-full glass-surface-primary/20 glass-flex glass-items-center glass-justify-center",children:e.jsx("span",{className:"glass-text-lg glass-font-medium",children:s.charAt(0)})}),l&&e.jsx("div",{className:r("absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",{"bg-green-500":l==="online","bg-yellow-500":l==="away","bg-red-500":l==="busy","bg-gray-500":l==="offline"})})]}),e.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[e.jsx("p",{className:"glass-text-sm glass-font-medium glass-text-primary glass-truncate",children:s}),i&&e.jsx("p",{className:"glass-text-xs glass-text-secondary glass-truncate",children:i})]}),u&&e.jsx("div",{className:"glass-flex-shrink-0",children:u})]});return o?e.jsx(A,{variant:"ghost",onClick:o,className:r("w-full text-left glass-p-2 glass-radius-md","hover:bg-muted/50 transition-colors",c),children:e.jsx(p,{})}):e.jsx("div",{className:c,children:e.jsx(p,{})})}try{P.displayName="SidebarBrand",P.__docgenInfo={description:"",displayName:"SidebarBrand",props:{logo:{defaultValue:null,description:"",name:"logo",required:!1,type:{name:"ReactNode"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string | undefined"}},href:{defaultValue:null,description:"",name:"href",required:!1,type:{name:"string | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{O.displayName="SidebarUserInfo",O.__docgenInfo={description:"",displayName:"SidebarUserInfo",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},email:{defaultValue:null,description:"",name:"email",required:!1,type:{name:"string | undefined"}},avatar:{defaultValue:null,description:"",name:"avatar",required:!1,type:{name:"string | undefined"}},status:{defaultValue:null,description:"",name:"status",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"online"'},{value:'"offline"'},{value:'"away"'},{value:'"busy"'}]}},actions:{defaultValue:null,description:"",name:"actions",required:!1,type:{name:"ReactNode"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{f.displayName="GlassSidebar",f.__docgenInfo={description:`GlassSidebar component
A glassmorphism sidebar navigation with advanced features`,displayName:"GlassSidebar",props:{items:{defaultValue:null,description:"Navigation items",name:"items",required:!0,type:{name:"NavigationItem[]"}},activeId:{defaultValue:null,description:"Currently active item",name:"activeId",required:!1,type:{name:"string | undefined"}},variant:{defaultValue:{value:"default"},description:"Sidebar variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"overlay"'},{value:'"default"'},{value:'"compact"'},{value:'"floating"'}]}},width:{defaultValue:{value:"md"},description:"Sidebar width",name:"width",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},collapsible:{defaultValue:{value:"true"},description:"Whether sidebar is collapsible",name:"collapsible",required:!1,type:{name:"boolean | undefined"}},collapsed:{defaultValue:{value:"false"},description:"Whether sidebar is collapsed",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},onCollapsedChange:{defaultValue:null,description:"Callback when collapsed state changes",name:"onCollapsedChange",required:!1,type:{name:"((collapsed: boolean) => void) | undefined"}},open:{defaultValue:{value:"true"},description:"Whether sidebar is open (for mobile/overlay)",name:"open",required:!1,type:{name:"boolean | undefined"}},onOpenChange:{defaultValue:null,description:"Callback when open state changes",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},header:{defaultValue:null,description:"Sidebar header content",name:"header",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"Sidebar footer content",name:"footer",required:!1,type:{name:"ReactNode"}},logo:{defaultValue:null,description:"Custom logo/brand",name:"logo",required:!1,type:{name:"ReactNode"}},userInfo:{defaultValue:null,description:"Custom user info",name:"userInfo",required:!1,type:{name:"ReactNode"}},onNavigate:{defaultValue:null,description:"Navigation callback",name:"onNavigate",required:!1,type:{name:"((item: NavigationItem) => void) | undefined"}},renderItem:{defaultValue:null,description:"Custom item renderer",name:"renderItem",required:!1,type:{name:"((item: NavigationItem, level: number) => ReactNode) | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const Ve={title:"Components/Navigation/GlassSidebar",component:f,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasssidebar component."}}},argTypes:{items:{control:"object",description:"Navigation items array"},activeId:{control:"text",description:"Currently active item ID"},variant:{control:{type:"select",options:["default","compact","floating","overlay"]},description:"Sidebar variant"},width:{control:{type:"select",options:["sm","md","lg","xl"]},description:"Sidebar width"},collapsed:{control:"boolean",description:"Whether sidebar is collapsed"},collapsible:{control:"boolean",description:"Whether sidebar is collapsible"}},args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"projects",label:"Projects",icon:"📁",badge:3},{id:"analytics",label:"Analytics",icon:"📈"},{id:"settings",label:"Settings",icon:"⚙️"}],activeId:"dashboard",variant:"default",width:"md",collapsed:!1,collapsible:!0}},C={args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"projects",label:"Projects",icon:"📁",badge:5},{id:"analytics",label:"Analytics",icon:"📈"},{id:"settings",label:"Settings",icon:"⚙️"}],activeId:"dashboard",header:e.jsx("div",{className:"glass-text-lg glass-font-bold",children:"My App"})}},S={render:s=>e.jsxs("div",{className:"glass-flex glass-h-96",children:[e.jsx("div",{className:"glass-w-64",children:e.jsx(f,{...s,variant:"default"})}),e.jsx("div",{className:"glass-w-64 glass-ml-4",children:e.jsx(f,{...s,variant:"compact"})}),e.jsx("div",{className:"glass-w-64 glass-ml-4",children:e.jsx(f,{...s,variant:"floating"})})]}),args:{items:[{id:"home",label:"Home",icon:"🏠"},{id:"search",label:"Search",icon:"🔍"},{id:"profile",label:"Profile",icon:"👤"}],activeId:"home",collapsed:!1}},I={args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊",children:[{id:"overview",label:"Overview"},{id:"reports",label:"Reports"}]},{id:"projects",label:"Projects",icon:"📁",badge:3,children:[{id:"active",label:"Active",badge:2},{id:"completed",label:"Completed",badge:1}]},{id:"settings",label:"Settings",icon:"⚙️"}],activeId:"dashboard"}},k={args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"projects",label:"Projects",icon:"📁",badge:3},{id:"analytics",label:"Analytics",icon:"📈"},{id:"settings",label:"Settings",icon:"⚙️"}],activeId:"dashboard",collapsed:!0,collapsible:!0}},_={args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"projects",label:"Projects",icon:"📁"},{id:"analytics",label:"Analytics",icon:"📈"}],activeId:"dashboard",header:e.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e.jsx("div",{className:"glass-w-8 glass-h-8 glass-surface-primary glass-radius-lg glass-flex glass-items-center glass-justify-center",children:e.jsx("span",{className:"glass-text-primary glass-font-bold",children:"A"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"glass-font-semibold",children:"Aura Glass"}),e.jsx("p",{className:"glass-text-xs glass-text-secondary",children:"v1.0.0"})]})]}),footer:e.jsx("div",{className:"glass-text-xs glass-text-secondary",children:"© 2024 Aura Glass"})}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      badge: 5
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }],
    activeId: 'dashboard',
    header: <div className="glass-text-lg glass-font-bold">My App</div>
  }
}`,...C.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-h-96">
      <div className="glass-w-64">
        <GlassSidebar {...args} variant="default" />
      </div>
      <div className="glass-w-64 glass-ml-4">
        <GlassSidebar {...args} variant="compact" />
      </div>
      <div className="glass-w-64 glass-ml-4">
        <GlassSidebar {...args} variant="floating" />
      </div>
    </div>,
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      icon: '🏠'
    }, {
      id: 'search',
      label: 'Search',
      icon: '🔍'
    }, {
      id: 'profile',
      label: 'Profile',
      icon: '👤'
    }],
    activeId: 'home',
    collapsed: false
  }
}`,...S.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      children: [{
        id: 'overview',
        label: 'Overview'
      }, {
        id: 'reports',
        label: 'Reports'
      }]
    }, {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      badge: 3,
      children: [{
        id: 'active',
        label: 'Active',
        badge: 2
      }, {
        id: 'completed',
        label: 'Completed',
        badge: 1
      }]
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }],
    activeId: 'dashboard'
  }
}`,...I.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      badge: 3
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }],
    activeId: 'dashboard',
    collapsed: true,
    collapsible: true
  }
}`,...k.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: '📁'
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈'
    }],
    activeId: 'dashboard',
    header: <div className="glass-flex glass-items-center glass-gap-2">
        <div className="glass-w-8 glass-h-8 glass-surface-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
          <span className="glass-text-primary glass-font-bold">A</span>
        </div>
        <div>
          <h3 className="glass-font-semibold">Aura Glass</h3>
          <p className="glass-text-xs glass-text-secondary">v1.0.0</p>
        </div>
      </div>,
    footer: <div className="glass-text-xs glass-text-secondary">
        © 2024 Aura Glass
      </div>
  }
}`,..._.parameters?.docs?.source}}};const Ae=["Default","Variants","WithNestedItems","Collapsed","WithHeaderAndFooter"];export{k as Collapsed,C as Default,S as Variants,_ as WithHeaderAndFooter,I as WithNestedItems,Ae as __namedExportsOrder,Ve as default};
