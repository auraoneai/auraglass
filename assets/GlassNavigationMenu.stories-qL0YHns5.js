import{r as S,j as s,R as C,c as m}from"./iframe-GrkikuRp.js";import{q}from"./components-DWrkUpM8.js";import{O as G}from"./OptimizedGlassCore-BK6ui_Z7.js";import{M as f}from"./MotionFramer-0RDYG5R5.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-Cdjfew4F.js";import"./utilsCore-C85LumCN.js";const d=({items:e=[],orientation:l="vertical",variant:r="default",size:i="md",activeItem:o,className:h,collapsed:t=!1,onItemClick:g,"aria-label":c,...u})=>{const[b,v]=S.useState(new Set),x=a=>{a?.disabled||(a?.children&&a?.children.length>0?v(p=>{const n=new Set(p);return n.has(a?.id)?n.delete(a?.id):n.add(a?.id),n}):(a?.href?a?.external?window.open(a?.href,"_blank"):window.location.href=a?.href:a?.action?.(),g?.(a)))},w=a=>{v(p=>{const n=new Set(p);return n.has(a)?n.delete(a):n.add(a),n})},_={default:"glass-backdrop-blur ring-1 ring-white/10 bg-white/5",sidebar:"glass-backdrop-blur ring-0 border-r border-white/10 bg-white/5",header:"glass-backdrop-blur ring-0 border-b border-white/10 bg-white/5"};return s.jsx(G,{as:"nav","data-glass-component":!0,intent:"neutral",elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:m(_?.[r],l==="horizontal"?"flex flex-row":"flex flex-col",h),role:"navigation","aria-label":c??"Navigation menu",...u,children:e.map((a,p)=>s.jsxs(C.Fragment,{children:[a?.separator&&s.jsx("div",{className:m("bg-white/20",l==="horizontal"?"w-px h-8 glass-mx-4":"h-px w-full glass-my-2 glass-mx-4")}),s.jsx(M,{item:a,isActive:o===a?.id,hasSubmenuOpen:b.has(a?.id),collapsed:t,size:i,onClick:x,onToggleSubmenu:w}),a?.children&&b.has(a?.id)&&!t&&s.jsx(f,{preset:"slideDown",duration:200,children:s.jsx("div",{className:m("glass-ml-4 border-l border-white/20 pl-4",l==="horizontal"&&"absolute top-full left-0 glass-mt-2 z-50"),children:s.jsx(d,{items:a?.children??[],orientation:"vertical",variant:"default",size:i,activeItem:o,onItemClick:g})})})]},a?.id||p))})},z=({children:e,className:l,isOpen:r=!0})=>r?s.jsx(f,{preset:"slideDown",duration:200,children:s.jsx("div",{className:l,children:e})}):null,M=({item:e,isActive:l=!1,hasSubmenuOpen:r=!1,collapsed:i=!1,size:o="md",onClick:h,onToggleSubmenu:t,className:g})=>{const c=C.useRef(null),u=()=>{c.current&&(window.clearTimeout(c.current),c.current=null)},b=()=>{!e?.children||e?.children.length===0||i||(u(),c.current=window.setTimeout(()=>{r||t(e?.id)},120))},v=()=>{!e?.children||e?.children.length===0||i||(u(),c.current=window.setTimeout(()=>{r&&t(e?.id)},180))};C.useEffect(()=>()=>{u()},[]);const x={sm:"h-8 glass-px-3 glass-text-sm",md:"h-10 glass-px-4 glass-text-base",lg:"h-12 glass-px-6 glass-text-lg"},w=()=>{h(e)},_=a=>{a.stopPropagation(),t(e?.id)};return e?.separator?s.jsx("div",{className:"glass-h-px glass-surface-subtle/20 glass-mx-4 glass-my-2"}):i?s.jsx(f,{preset:"none",children:s.jsxs("button",{className:m("glass-relative glass-flex glass-items-center glass-justify-center glass-w-full","glass-text-primary/70 hover:glass-text-primary transition-colors duration-200","hover:bg-white/10 glass-radius-lg","glass-focus glass-touch-target glass-contrast-guard","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent","disabled:opacity-50 glass-disabled-cursor-not-allowed",x?.[o],{"bg-white/20 glass-text-primary":l,"glass-text-primary":l},g),onClick:w,disabled:e?.disabled,title:e?.label,type:"button",style:{border:0,background:"transparent",color:"inherit",font:"inherit"},children:[e?.icon&&s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center",children:e?.icon}),e?.badge&&s.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-w-5 glass-h-5 glass-surface-red glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",children:typeof e?.badge=="number"&&e?.badge>99?"99+":e?.badge})]})}):s.jsx(f,{preset:"none",children:s.jsxs("button",{className:m("glass-relative glass-flex glass-items-center glass-justify-between glass-w-full","glass-text-primary/70 hover:glass-text-primary transition-all duration-200","hover:bg-white/10 glass-radius-lg","glass-focus glass-touch-target glass-contrast-guard","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent","disabled:opacity-50 glass-disabled-cursor-not-allowed",x?.[o],{"bg-white/20 glass-text-primary shadow-md":l,"glass-text-primary":l},g),onClick:w,onMouseEnter:b,onMouseLeave:v,disabled:e?.disabled,type:"button",style:{border:0,background:"transparent",color:"inherit",font:"inherit"},children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-flex-1 glass-min-w-0",children:[e?.icon&&s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-flex-shrink-0",children:e?.icon}),s.jsxs("div",{className:"glass-flex-1 glass-min-w-0 glass-text-left",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-truncate glass-font-medium",children:e?.label}),e?.badge&&s.jsx("span",{className:"glass-flex-shrink-0 glass-px-2 glass-py-0.5 glass-surface-red/20 glass-text-secondary glass-radius-full glass-text-xs glass-font-medium",children:typeof e?.badge=="number"&&e?.badge>99?"99+":e?.badge})]}),e?.description&&s.jsx("p",{className:"glass-text-primary-glass-opacity-50 glass-text-sm glass-truncate glass-mt-0-5",children:e?.description})]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-shrink-0",children:[e?.external&&s.jsx("div",{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-50",children:"↗"}),e?.featured&&s.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-animate-pulse"}),e?.children&&e?.children.length>0&&s.jsx("button",{onClick:_,className:"glass-p-1 hover:glass-surface-subtle/10 glass-radius-md glass-transition-colors glass-duration-200 glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard","aria-label":"Toggle submenu",type:"button",style:{border:0,background:"transparent",color:"inherit",font:"inherit"},children:s.jsx(f,{preset:"rotateIn",duration:200,children:s.jsx(q,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-50"})})})]})]})})},W=e=>{const[l,r]=S.useState(e),[i,o]=S.useState(!1);return{activeItem:l,setActiveItem:r,collapsed:i,setCollapsed:o,navigateTo:t=>{r(t?.id),t?.href?t?.external?window.open(t?.href,"_blank"):window.location.href=t?.href:t?.action?.()},toggleCollapsed:()=>o(!i)}},V=()=>[{id:"dashboard",label:"Dashboard",icon:"📊",href:"/dashboard",description:"Overview and analytics"},{id:"projects",label:"Projects",icon:"📁",href:"/projects",badge:3,children:[{id:"projects-active",label:"Active Projects",href:"/projects/active",badge:2},{id:"projects-completed",label:"Completed",href:"/projects/completed",badge:1}]},{id:"analytics",label:"Analytics",icon:"📈",href:"/analytics",featured:!0}];try{d.displayName="GlassNavigationMenu",d.__docgenInfo={description:`GlassNavigationMenu component
Advanced glassmorphism navigation menu with nested items`,displayName:"GlassNavigationMenu",props:{items:{defaultValue:{value:"[]"},description:"Navigation items",name:"items",required:!1,type:{name:"NavigationItem[] | undefined"}},orientation:{defaultValue:{value:"vertical"},description:"Menu orientation",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},variant:{defaultValue:{value:"default"},description:"Menu variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"header"'},{value:'"default"'},{value:'"sidebar"'}]}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},activeItem:{defaultValue:null,description:"Active item ID",name:"activeItem",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},collapsed:{defaultValue:{value:"false"},description:"Whether menu is collapsed (for sidebar variant)",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"Callback when item is clicked",name:"onItemClick",required:!1,type:{name:"((item: NavigationItem) => void) | undefined"}}}}}catch{}try{z.displayName="GlassNavigationMenuContent",z.__docgenInfo={description:`GlassNavigationMenuContent component
Container for navigation menu content`,displayName:"GlassNavigationMenuContent",props:{children:{defaultValue:null,description:"Menu content",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:null,description:"Content className",name:"className",required:!1,type:{name:"string | undefined"}},isOpen:{defaultValue:{value:"true"},description:"Whether content is open",name:"isOpen",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{M.displayName="GlassNavigationMenuItem",M.__docgenInfo={description:`GlassNavigationMenuItem component
Individual navigation menu item`,displayName:"GlassNavigationMenuItem",props:{item:{defaultValue:null,description:"Navigation item",name:"item",required:!0,type:{name:"NavigationItem"}},isActive:{defaultValue:{value:"false"},description:"Whether item is active",name:"isActive",required:!1,type:{name:"boolean | undefined"}},hasSubmenuOpen:{defaultValue:{value:"false"},description:"Whether item has submenu open",name:"hasSubmenuOpen",required:!1,type:{name:"boolean | undefined"}},collapsed:{defaultValue:{value:"false"},description:"Whether menu is collapsed",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},onClick:{defaultValue:null,description:"Callback when item is clicked",name:"onClick",required:!0,type:{name:"(item: NavigationItem) => void"}},onToggleSubmenu:{defaultValue:null,description:"Callback to toggle submenu",name:"onToggleSubmenu",required:!0,type:{name:"(itemId: string) => void"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{W.displayName="useNavigationMenu",W.__docgenInfo={description:"Hook for managing navigation menu state",displayName:"useNavigationMenu",props:{}}}catch{}try{V.displayName="createDashboardNavigation",V.__docgenInfo={description:"Preset navigation configurations",displayName:"createDashboardNavigation",props:{}}}catch{}const I=[{id:"overview",label:"Overview",icon:"O",description:"Health and adoption"},{id:"workflows",label:"Workflows",icon:"W",badge:4,children:[{id:"workflows-live",label:"Live runs",badge:2},{id:"workflows-drafts",label:"Drafts",badge:2}]},{id:"insights",label:"Insights",icon:"I",featured:!0}],E={title:"Navigation/Glass Navigation Menu",component:d,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Glass navigation menu presented in bounded app panels with readable active and nested states."}}},argTypes:{items:{control:"object",description:"Array of navigation items"},orientation:{control:{type:"select",options:["horizontal","vertical"]}},variant:{control:{type:"select",options:["default","sidebar","header"]}},size:{control:{type:"select",options:["sm","md","lg"]}},activeItem:{control:"text"},collapsed:{control:"boolean"}},args:{items:I,orientation:"vertical",variant:"default",size:"md",activeItem:"overview",collapsed:!1}},y={render:e=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsxs("section",{className:"glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl",style:{width:"100%",maxWidth:420,background:"rgba(15,23,42,0.72)",color:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"},children:[s.jsxs("div",{className:"glass-mb-4",children:[s.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-white/70",children:"Product nav"}),s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-white",children:"Workspace sections"})]}),s.jsx(d,{...e,className:"glass-w-full glass-rounded-xl glass-p-2"})]})})},N={render:e=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsx("div",{className:"glass-grid glass-w-full glass-max-w-5xl glass-grid-cols-1 glass-gap-4 lg:glass-grid-cols-3",style:{width:"100%",maxWidth:980},children:[["Default","default","vertical"],["Sidebar","sidebar","vertical"],["Header","header","horizontal"]].map(([l,r,i])=>s.jsxs("section",{className:"glass-min-w-0 glass-rounded-2xl glass-p-4 glass-shadow-lg",style:{background:"rgba(15,23,42,0.72)",color:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"},children:[s.jsx("h3",{className:"glass-mb-3 glass-text-base glass-font-semibold glass-text-white",children:l}),s.jsx(d,{...e,variant:r,orientation:i,size:"sm",className:"glass-w-full glass-rounded-xl glass-p-2"})]},l))})}),args:{items:I,activeItem:"overview"}},k={render:e=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsx("section",{className:"glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl",style:{width:"100%",maxWidth:420,background:"rgba(15,23,42,0.72)",color:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"},children:s.jsx(d,{...e,className:"glass-w-full glass-rounded-xl glass-p-2"})})}),args:{items:I,activeItem:"workflows"}},j={render:e=>s.jsx("div",{style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box"},children:s.jsx("section",{className:"glass-rounded-2xl glass-p-4 glass-shadow-xl",style:{background:"rgba(15,23,42,0.72)",color:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"},children:s.jsx(d,{...e,className:"glass-w-20 glass-rounded-xl glass-p-2"})})}),args:{items:I,activeItem:"overview",collapsed:!0}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <section className="glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl" style={{
      width: '100%',
      maxWidth: 420,
      background: 'rgba(15,23,42,0.72)',
      color: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="glass-mb-4">
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-white/70">
          Product nav
        </p>
        <h3 className="glass-text-lg glass-font-semibold glass-text-white">Workspace sections</h3>
      </div>
      <GlassNavigationMenu {...args} className="glass-w-full glass-rounded-xl glass-p-2" />
    </section>
    </div>
}`,...y.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <div className="glass-grid glass-w-full glass-max-w-5xl glass-grid-cols-1 glass-gap-4 lg:glass-grid-cols-3" style={{
      width: '100%',
      maxWidth: 980
    }}>
      {[['Default', 'default', 'vertical'], ['Sidebar', 'sidebar', 'vertical'], ['Header', 'header', 'horizontal']].map(([label, variant, orientation]) => <section key={label} className="glass-min-w-0 glass-rounded-2xl glass-p-4 glass-shadow-lg" style={{
        background: 'rgba(15,23,42,0.72)',
        color: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
          <h3 className="glass-mb-3 glass-text-base glass-font-semibold glass-text-white">{label}</h3>
          <GlassNavigationMenu {...args} variant={variant as any} orientation={orientation as any} size="sm" className="glass-w-full glass-rounded-xl glass-p-2" />
        </section>)}
    </div>
    </div>,
  args: {
    items: productItems,
    activeItem: 'overview'
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <section className="glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl" style={{
      width: '100%',
      maxWidth: 420,
      background: 'rgba(15,23,42,0.72)',
      color: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <GlassNavigationMenu {...args} className="glass-w-full glass-rounded-xl glass-p-2" />
    </section>
    </div>,
  args: {
    items: productItems,
    activeItem: 'workflows'
  }
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    boxSizing: 'border-box'
  }}>
    <section className="glass-rounded-2xl glass-p-4 glass-shadow-xl" style={{
      background: 'rgba(15,23,42,0.72)',
      color: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <GlassNavigationMenu {...args} className="glass-w-20 glass-rounded-xl glass-p-2" />
    </section>
    </div>,
  args: {
    items: productItems,
    activeItem: 'overview',
    collapsed: true
  }
}`,...j.parameters?.docs?.source}}};const P=["Default","Variants","WithNestedItems","Collapsed"];export{j as Collapsed,y as Default,N as Variants,k as WithNestedItems,P as __namedExportsOrder,E as default};
