import{j as s}from"./iframe-BEVTBSqr.js";import{c as m}from"./utilsCore-DpNKUJXO.js";import"./preload-helper-PPVm8Dsz.js";const _=[{id:"skip-to-main",label:"Skip to main content",href:"#main-content"},{id:"skip-to-nav",label:"Skip to navigation",href:"#main-navigation"},{id:"skip-to-search",label:"Skip to search",href:"#search"}];function u({links:n=_,className:o,position:r="top-left",zIndex:i=9999,styles:a}){const e={"top-left":"left-4","top-center":"left-1/2 -translate-x-1/2","top-right":"right-4"},c=(t,f)=>{t.preventDefault();const v=f.replace("#",""),l=document.getElementById(v);l&&(l.focus(),document.activeElement!==l&&(l.setAttribute("tabindex","-1"),l.focus()),l.scrollIntoView({behavior:"smooth",block:"start"}))};return s.jsx("nav",{className:m("skip-links","fixed top-4","flex flex-col gap-2",e[r],o),style:{zIndex:i,...a},"aria-label":"Skip links",children:n.map(t=>s.jsx("a",{id:t.id,href:t.href,onClick:f=>c(f,t.href),className:m("absolute -left-[10000px] top-auto","w-[1px] h-[1px] overflow-hidden","focus:static focus:w-auto focus:h-auto","focus:overflow-visible","focus:inline-block","focus:px-4 focus:py-2","focus:bg-primary focus:text-primary-foreground","focus:rounded-md","focus:shadow-lg","focus:no-underline","focus:outline-none","focus:ring-2 focus:ring-primary focus:ring-offset-2","transition-all duration-200 ease-out","forced-colors:focus:forced-color-adjust-none","forced-colors:focus:outline forced-colors:focus:outline-2","forced-colors:focus:outline-[ButtonText]","glass-focus glass-touch-target glass-contrast-guard"),children:t.label},t.id))})}function k({children:n,className:o,id:r="main-content",...i}){return s.jsx("main",{id:r,className:o,role:"main","aria-label":"Main content",tabIndex:-1,...i,children:n})}function g({children:n,className:o,id:r="main-navigation",label:i="Main navigation",...a}){return s.jsx("nav",{id:r,className:o,role:"navigation","aria-label":i,tabIndex:-1,...a,children:n})}function h({children:n,className:o,id:r="search",...i}){return s.jsx("search",{id:r,className:o,role:"search","aria-label":"Search",tabIndex:-1,...i,children:n})}function y(){const n=a=>{const e=document.getElementById(a);e&&(e.hasAttribute("tabindex")||e.setAttribute("tabindex","-1"),e.focus(),e.scrollIntoView({behavior:"smooth",block:"start"}))},o=a=>{const e=document.createElement("a");return e.id=a.id,e.href=a.href,e.textContent=a.label,e.className="skip-link",e.addEventListener("click",c=>{c.preventDefault();const t=a.href.replace("#","");n(t)}),e};return{skipToElement:n,createSkipLink:o,addSkipLink:(a,e)=>{const c=e||document.body,t=o(a);return c.insertBefore(t,c.firstChild),t},removeSkipLink:a=>{const e=document.getElementById(a);e&&e.remove()}}}try{u.displayName="SkipLinks",u.__docgenInfo={description:`SkipLinks component
Provides keyboard navigation shortcuts for screen reader users`,displayName:"SkipLinks",props:{links:{defaultValue:{value:`[
  {
    id: "skip-to-main",
    label: "Skip to main content",
    href: "#main-content",
  },
  {
    id: "skip-to-nav",
    label: "Skip to navigation",
    href: "#main-navigation",
  },
  {
    id: "skip-to-search",
    label: "Skip to search",
    href: "#search",
  },
]`},description:"Array of skip links",name:"links",required:!1,type:{name:"SkipLink[] | undefined"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string | undefined"}},position:{defaultValue:{value:"top-left"},description:"Position of skip links",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-right"'},{value:'"top-left"'},{value:'"top-center"'}]}},zIndex:{defaultValue:{value:"9999"},description:"Z-index for skip links",name:"zIndex",required:!1,type:{name:"number | undefined"}},styles:{defaultValue:null,description:"Custom styles for skip links",name:"styles",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}try{k.displayName="MainContent",k.__docgenInfo={description:`Main content landmark component
Wrapper for main content with proper ARIA attributes`,displayName:"MainContent",props:{}}}catch{}try{g.displayName="Navigation",g.__docgenInfo={description:`Navigation landmark component
Wrapper for navigation with proper ARIA attributes`,displayName:"Navigation",props:{label:{defaultValue:{value:"Main navigation"},description:"",name:"label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{h.displayName="SearchLandmark",h.__docgenInfo={description:`Search landmark component
Wrapper for search with proper ARIA attributes`,displayName:"SearchLandmark",props:{}}}catch{}try{y.displayName="useSkipLinks",y.__docgenInfo={description:`Custom skip link hook
Programmatically manage skip links`,displayName:"useSkipLinks",props:{}}}catch{}const L={title:"Components/Focus/SkipLinks",component:u,parameters:{layout:"centered",docs:{description:{component:"A glass morphism skiplinks component."}}},argTypes:{},args:{}},p={args:{}},d={render:n=>s.jsx("div",{className:"flex flex-wrap gap-4",children:s.jsx(u,{...n,children:"Default"})}),args:{}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="flex flex-wrap gap-4">
      <SkipLinks {...args}>
        Default
      </SkipLinks>
    </div>,
  args: {}
}`,...d.parameters?.docs?.source}}};const N=["Default","Variants"];export{p as Default,d as Variants,N as __namedExportsOrder,L as default};
