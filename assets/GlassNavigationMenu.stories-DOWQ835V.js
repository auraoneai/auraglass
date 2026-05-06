import{r as I,j as a,R as S,c as m}from"./iframe-DpweptvF.js";import{O as z}from"./OptimizedGlassCore-UOg4NIOz.js";import{M as f}from"./MotionFramer-BmJovKMH.js";import{C as G}from"./chevron-right-1rtoKK3s.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-Diw1ReC2.js";import"./createLucideIcon-eJ4-KqhR.js";const c=({items:e=[],orientation:t="vertical",variant:l="default",size:r="md",activeItem:o,className:h,collapsed:n=!1,onItemClick:u,"aria-label":d,...g})=>{const[b,v]=I.useState(new Set),x=s=>{s?.disabled||(s?.children&&s?.children.length>0?v(p=>{const i=new Set(p);return i.has(s?.id)?i.delete(s?.id):i.add(s?.id),i}):(s?.href?s?.external?window.open(s?.href,"_blank"):window.location.href=s?.href:s?.action?.(),u?.(s)))},y=s=>{v(p=>{const i=new Set(p);return i.has(s)?i.delete(s):i.add(s),i})},C={default:"glass-glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",sidebar:"glass-glass-backdrop-blur-md ring-0 border-r border-white/10 bg-white/5",header:"glass-glass-backdrop-blur-md ring-0 border-b border-white/10 bg-white/5"};return a.jsx(z,{as:"nav","data-glass-component":!0,intent:"neutral",elevation:"level1",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:m(C?.[l],t==="horizontal"?"flex flex-row":"flex flex-col",h),role:"navigation","aria-label":d??"Navigation menu",...g,children:e.map((s,p)=>a.jsxs(S.Fragment,{children:[s?.separator&&a.jsx("div",{className:m("bg-white/20",t==="horizontal"?"w-px h-8 glass-mx-4":"h-px w-full glass-my-2 glass-mx-4")}),a.jsx(M,{item:s,isActive:o===s?.id,hasSubmenuOpen:b.has(s?.id),collapsed:n,size:r,onClick:x,onToggleSubmenu:y}),s?.children&&b.has(s?.id)&&!n&&a.jsx(f,{preset:"slideDown",duration:200,children:a.jsx("div",{className:m("glass-ml-4 border-l border-white/20 pl-4",t==="horizontal"&&"absolute top-full left-0 glass-mt-2 z-50"),children:a.jsx(c,{items:s?.children??[],orientation:"vertical",variant:"default",size:r,activeItem:o,onItemClick:u})})})]},s?.id||p))})},V=({children:e,className:t,isOpen:l=!0})=>l?a.jsx(f,{preset:"slideDown",duration:200,children:a.jsx("div",{className:t,children:e})}):null,M=({item:e,isActive:t=!1,hasSubmenuOpen:l=!1,collapsed:r=!1,size:o="md",onClick:h,onToggleSubmenu:n,className:u})=>{const d=S.useRef(null),g=()=>{d.current&&(window.clearTimeout(d.current),d.current=null)},b=()=>{!e?.children||e?.children.length===0||r||(g(),d.current=window.setTimeout(()=>{l||n(e?.id)},120))},v=()=>{!e?.children||e?.children.length===0||r||(g(),d.current=window.setTimeout(()=>{l&&n(e?.id)},180))};S.useEffect(()=>()=>{g()},[]);const x={sm:"h-8 glass-px-3 glass-text-sm",md:"h-10 glass-px-4 glass-text-base",lg:"h-12 glass-px-6 glass-text-lg"},y=()=>{h(e)},C=s=>{s.stopPropagation(),n(e?.id)};return e?.separator?a.jsx("div",{className:"glass-h-px glass-surface-subtle/20 glass-mx-4 glass-my-2"}):r?a.jsx(f,{preset:"none",children:a.jsxs("button",{className:m("relative flex items-center justify-center w-full","glass-text-primary/70 hover:glass-text-primary transition-colors duration-200","hover:bg-white/10 glass-radius-lg","glass-focus glass-touch-target glass-contrast-guard","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent","disabled:opacity-50 glass-disabled-cursor-not-allowed",x?.[o],{"bg-white/20 glass-text-primary":t,"glass-text-primary":t},u),onClick:y,disabled:e?.disabled,title:e?.label,type:"button",children:[e?.icon&&a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center",children:e?.icon}),e?.badge&&a.jsx("div",{className:"glass-absolute glass-top-1 glass--right-1 glass-w-5 glass-h-5 glass-surface-red glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary",children:typeof e?.badge=="number"&&e?.badge>99?"99+":e?.badge})]})}):a.jsx(f,{preset:"none",children:a.jsxs("button",{className:m("relative flex items-center justify-between w-full","glass-text-primary/70 hover:glass-text-primary transition-all duration-200","hover:bg-white/10 glass-radius-lg","glass-focus glass-touch-target glass-contrast-guard","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent","disabled:opacity-50 glass-disabled-cursor-not-allowed",x?.[o],{"bg-white/20 glass-text-primary shadow-md":t,"glass-text-primary":t},u),onClick:y,onMouseEnter:b,onMouseLeave:v,disabled:e?.disabled,type:"button",children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-flex-1 glass-min-w-0",children:[e?.icon&&a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-flex-shrink-0",children:e?.icon}),a.jsxs("div",{className:"glass-flex-1 glass-min-w-0 glass-text-left",children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[a.jsx("span",{className:"glass-truncate glass-font-medium",children:e?.label}),e?.badge&&a.jsx("span",{className:"glass-flex-shrink-0 glass-px-2 glass-py-0.5 glass-surface-red/20 glass-text-secondary glass-radius-full glass-text-xs glass-font-medium",children:typeof e?.badge=="number"&&e?.badge>99?"99+":e?.badge})]}),e?.description&&a.jsx("p",{className:"glass-text-primary-glass-opacity-50 glass-text-sm glass-truncate glass-mt-0-5",children:e?.description})]})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-flex-shrink-0",children:[e?.external&&a.jsx("div",{className:"glass-w-3 glass-h-3 glass-text-primary-glass-opacity-50",children:"↗"}),e?.featured&&a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-yellow glass-radius-full glass-animate-pulse"}),e?.children&&e?.children.length>0&&a.jsx("button",{onClick:C,className:"glass-p-1 hover:glass-surface-subtle/10 glass-radius-md glass-transition-colors glass-duration-200 glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard","aria-label":"Toggle submenu",children:a.jsx(f,{preset:"rotateIn",duration:200,children:a.jsx(G,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-50"})})})]})]})})},k=e=>{const[t,l]=I.useState(e),[r,o]=I.useState(!1);return{activeItem:t,setActiveItem:l,collapsed:r,setCollapsed:o,navigateTo:n=>{l(n?.id),n?.href?n?.external?window.open(n?.href,"_blank"):window.location.href=n?.href:n?.action?.()},toggleCollapsed:()=>o(!r)}},q=()=>[{id:"dashboard",label:"Dashboard",icon:"📊",href:"/dashboard",description:"Overview and analytics"},{id:"projects",label:"Projects",icon:"📁",href:"/projects",badge:3,children:[{id:"projects-active",label:"Active Projects",href:"/projects/active",badge:2},{id:"projects-completed",label:"Completed",href:"/projects/completed",badge:1}]},{id:"analytics",label:"Analytics",icon:"📈",href:"/analytics",featured:!0}];try{c.displayName="GlassNavigationMenu",c.__docgenInfo={description:`GlassNavigationMenu component
Advanced glassmorphism navigation menu with nested items`,displayName:"GlassNavigationMenu",props:{items:{defaultValue:{value:"[]"},description:"Navigation items",name:"items",required:!1,type:{name:"NavigationItem[] | undefined"}},orientation:{defaultValue:{value:"vertical"},description:"Menu orientation",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},variant:{defaultValue:{value:"default"},description:"Menu variant",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"header"'},{value:'"default"'},{value:'"sidebar"'}]}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},activeItem:{defaultValue:null,description:"Active item ID",name:"activeItem",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},collapsed:{defaultValue:{value:"false"},description:"Whether menu is collapsed (for sidebar variant)",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},onItemClick:{defaultValue:null,description:"Callback when item is clicked",name:"onItemClick",required:!1,type:{name:"((item: NavigationItem) => void) | undefined"}}}}}catch{}try{V.displayName="GlassNavigationMenuContent",V.__docgenInfo={description:`GlassNavigationMenuContent component
Container for navigation menu content`,displayName:"GlassNavigationMenuContent",props:{children:{defaultValue:null,description:"Menu content",name:"children",required:!0,type:{name:"ReactNode"}},className:{defaultValue:null,description:"Content className",name:"className",required:!1,type:{name:"string | undefined"}},isOpen:{defaultValue:{value:"true"},description:"Whether content is open",name:"isOpen",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{M.displayName="GlassNavigationMenuItem",M.__docgenInfo={description:`GlassNavigationMenuItem component
Individual navigation menu item`,displayName:"GlassNavigationMenuItem",props:{item:{defaultValue:null,description:"Navigation item",name:"item",required:!0,type:{name:"NavigationItem"}},isActive:{defaultValue:{value:"false"},description:"Whether item is active",name:"isActive",required:!1,type:{name:"boolean | undefined"}},hasSubmenuOpen:{defaultValue:{value:"false"},description:"Whether item has submenu open",name:"hasSubmenuOpen",required:!1,type:{name:"boolean | undefined"}},collapsed:{defaultValue:{value:"false"},description:"Whether menu is collapsed",name:"collapsed",required:!1,type:{name:"boolean | undefined"}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},onClick:{defaultValue:null,description:"Callback when item is clicked",name:"onClick",required:!0,type:{name:"(item: NavigationItem) => void"}},onToggleSubmenu:{defaultValue:null,description:"Callback to toggle submenu",name:"onToggleSubmenu",required:!0,type:{name:"(itemId: string) => void"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{k.displayName="useNavigationMenu",k.__docgenInfo={description:"Hook for managing navigation menu state",displayName:"useNavigationMenu",props:{}}}catch{}try{q.displayName="createDashboardNavigation",q.__docgenInfo={description:"Preset navigation configurations",displayName:"createDashboardNavigation",props:{}}}catch{}const W={title:"Components/Navigation/GlassNavigationMenu",component:c,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassnavigationmenu component."}}},argTypes:{items:{control:"object",description:"Array of navigation items"},orientation:{control:{type:"select",options:["horizontal","vertical"]},description:"Menu orientation"},variant:{control:{type:"select",options:["default","sidebar","header"]},description:"Menu variant"},size:{control:{type:"select",options:["sm","md","lg"]},description:"Size variant"},activeItem:{control:"text",description:"Active item ID"},collapsed:{control:"boolean",description:"Whether menu is collapsed"}},args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊",href:"/dashboard",description:"Overview and analytics"},{id:"projects",label:"Projects",icon:"📁",href:"/projects",badge:3,children:[{id:"projects-active",label:"Active Projects",href:"/projects/active",badge:2},{id:"projects-completed",label:"Completed",href:"/projects/completed",badge:1}]},{id:"analytics",label:"Analytics",icon:"📈",href:"/analytics",featured:!0}],orientation:"vertical",variant:"default",size:"md",activeItem:"dashboard",collapsed:!1}},N={args:{items:[{id:"home",label:"Home",icon:"🏠",href:"/"},{id:"about",label:"About",icon:"ℹ️",href:"/about"},{id:"contact",label:"Contact",icon:"📞",href:"/contact"}],activeItem:"home"}},j={render:e=>a.jsxs("div",{className:"space-y-8",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Default Variant"}),a.jsx(c,{...e})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Sidebar Variant"}),a.jsx(c,{...e,variant:"sidebar"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-4",children:"Header Variant"}),a.jsx(c,{...e,variant:"header",orientation:"horizontal"})]})]}),args:{items:[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"users",label:"Users",icon:"👥"},{id:"settings",label:"Settings",icon:"⚙️"}],activeItem:"dashboard"}},w={args:{items:[{id:"products",label:"Products",icon:"📦",children:[{id:"products-all",label:"All Products",href:"/products"},{id:"products-new",label:"Add New",href:"/products/new"},{id:"products-categories",label:"Categories",href:"/products/categories"}]},{id:"orders",label:"Orders",icon:"🛒",badge:5,children:[{id:"orders-pending",label:"Pending",badge:3,href:"/orders/pending"},{id:"orders-completed",label:"Completed",badge:12,href:"/orders/completed"}]},{id:"reports",label:"Reports",icon:"📈",featured:!0}],activeItem:"products"}},_={args:{items:[{id:"home",label:"Home",icon:"🏠"},{id:"search",label:"Search",icon:"🔍"},{id:"profile",label:"Profile",icon:"👤"},{id:"settings",label:"Settings",icon:"⚙️"}],activeItem:"home",collapsed:!0}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '/'
    }, {
      id: 'about',
      label: 'About',
      icon: 'ℹ️',
      href: '/about'
    }, {
      id: 'contact',
      label: 'Contact',
      icon: '📞',
      href: '/contact'
    }],
    activeItem: 'home'
  }
}`,...N.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-8">
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Default Variant</h3>
        <GlassNavigationMenu {...args} />
      </div>
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Sidebar Variant</h3>
        <GlassNavigationMenu {...args} variant="sidebar" />
      </div>
      <div>
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Header Variant</h3>
        <GlassNavigationMenu {...args} variant="header" orientation="horizontal" />
      </div>
    </div>,
  args: {
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    }, {
      id: 'users',
      label: 'Users',
      icon: '👥'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }],
    activeItem: 'dashboard'
  }
}`,...j.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'products',
      label: 'Products',
      icon: '📦',
      children: [{
        id: 'products-all',
        label: 'All Products',
        href: '/products'
      }, {
        id: 'products-new',
        label: 'Add New',
        href: '/products/new'
      }, {
        id: 'products-categories',
        label: 'Categories',
        href: '/products/categories'
      }]
    }, {
      id: 'orders',
      label: 'Orders',
      icon: '🛒',
      badge: 5,
      children: [{
        id: 'orders-pending',
        label: 'Pending',
        badge: 3,
        href: '/orders/pending'
      }, {
        id: 'orders-completed',
        label: 'Completed',
        badge: 12,
        href: '/orders/completed'
      }]
    }, {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      featured: true
    }],
    activeItem: 'products'
  }
}`,...w.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
    }, {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    }],
    activeItem: 'home',
    collapsed: true
  }
}`,..._.parameters?.docs?.source}}};const E=["Default","Variants","WithNestedItems","Collapsed"];export{_ as Collapsed,N as Default,j as Variants,w as WithNestedItems,E as __namedExportsOrder,W as default};
