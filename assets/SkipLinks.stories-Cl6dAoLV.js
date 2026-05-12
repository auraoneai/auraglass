import{R as S,j as c}from"./iframe-DMS_w3ti.js";import{c as g}from"./utilsCore-IWfe3uJL.js";import"./preload-helper-PPVm8Dsz.js";const x=[{id:"skip-to-main",label:"Skip to main content",href:"#main-content"},{id:"skip-to-nav",label:"Skip to navigation",href:"#main-navigation"},{id:"skip-to-search",label:"Skip to search",href:"#search"}];function f({links:n=x,className:i,position:o="top-left",zIndex:s=9999,styles:t}){const[e,l]=S.useState(null),d={"top-left":"left-4","top-center":"left-1/2 -translate-x-1/2","top-right":"right-4"},b=(r,k)=>{r.preventDefault();const p=k.replace("#",""),a=document.getElementById(p);a&&(a.focus(),document.activeElement!==a&&(a.setAttribute("tabindex","-1"),a.focus()),a.scrollIntoView({behavior:"smooth",block:"start"}))};return c.jsx("nav",{className:g("skip-links","fixed top-4","flex flex-col gap-2",d[o],i),style:{zIndex:s,...t},"aria-label":"Skip links",children:n.map((r,k)=>{const p=e===r.id;return c.jsx("a",{id:r.id,href:r.href,style:p?void 0:{position:"absolute",left:"-10000px",top:`${k*48}px`,width:1,height:1,overflow:"hidden"},onClick:a=>b(a,r.href),onFocus:()=>l(r.id),onBlur:()=>l(a=>a===r.id?null:a),className:g(p?["static w-auto h-auto overflow-visible","inline-block px-4 py-2","bg-primary text-primary-foreground","rounded-md shadow-lg no-underline","outline-none ring-2 ring-primary ring-offset-2"]:"absolute","transition-all duration-200 ease-out","forced-colors:focus:forced-color-adjust-none","forced-colors:focus:outline forced-colors:focus:outline-2","forced-colors:focus:outline-[ButtonText]","glass-focus glass-touch-target glass-contrast-guard"),children:r.label},r.id)})})}function h({children:n,className:i,id:o="main-content",...s}){return c.jsx("main",{id:o,className:i,role:"main","aria-label":"Main content",tabIndex:-1,...s,children:n})}function v({children:n,className:i,id:o="main-navigation",label:s="Main navigation",...t}){return c.jsx("nav",{id:o,className:i,role:"navigation","aria-label":s,tabIndex:-1,...t,children:n})}function y({children:n,className:i,id:o="search",...s}){return c.jsx("search",{id:o,className:i,role:"search","aria-label":"Search",tabIndex:-1,...s,children:n})}function _(){const n=t=>{const e=document.getElementById(t);e&&(e.hasAttribute("tabindex")||e.setAttribute("tabindex","-1"),e.focus(),e.scrollIntoView({behavior:"smooth",block:"start"}))},i=t=>{const e=document.createElement("a");return e.id=t.id,e.href=t.href,e.textContent=t.label,e.className="skip-link",e.addEventListener("click",l=>{l.preventDefault();const d=t.href.replace("#","");n(d)}),e};return{skipToElement:n,createSkipLink:i,addSkipLink:(t,e)=>{const l=e||document.body,d=i(t);return l.insertBefore(d,l.firstChild),d},removeSkipLink:t=>{const e=document.getElementById(t);e&&e.remove()}}}try{f.displayName="SkipLinks",f.__docgenInfo={description:`SkipLinks component
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
]`},description:"Array of skip links",name:"links",required:!1,type:{name:"SkipLink[] | undefined"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string | undefined"}},position:{defaultValue:{value:"top-left"},description:"Position of skip links",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-right"'},{value:'"top-left"'},{value:'"top-center"'}]}},zIndex:{defaultValue:{value:"9999"},description:"Z-index for skip links",name:"zIndex",required:!1,type:{name:"number | undefined"}},styles:{defaultValue:null,description:"Custom styles for skip links",name:"styles",required:!1,type:{name:"CSSProperties | undefined"}}}}}catch{}try{h.displayName="MainContent",h.__docgenInfo={description:`Main content landmark component
Wrapper for main content with proper ARIA attributes`,displayName:"MainContent",props:{}}}catch{}try{v.displayName="Navigation",v.__docgenInfo={description:`Navigation landmark component
Wrapper for navigation with proper ARIA attributes`,displayName:"Navigation",props:{label:{defaultValue:{value:"Main navigation"},description:"",name:"label",required:!1,type:{name:"string | undefined"}}}}}catch{}try{y.displayName="SearchLandmark",y.__docgenInfo={description:`Search landmark component
Wrapper for search with proper ARIA attributes`,displayName:"SearchLandmark",props:{}}}catch{}try{_.displayName="useSkipLinks",_.__docgenInfo={description:`Custom skip link hook
Programmatically manage skip links`,displayName:"useSkipLinks",props:{}}}catch{}const w={title:"Foundations/Liquid Glass Primitives/Skip Links",component:f,parameters:{layout:"centered",docs:{description:{component:"A glass morphism skiplinks component."}}},argTypes:{},args:{}},u={args:{}},m={render:n=>c.jsx("div",{className:"flex flex-wrap gap-4",children:c.jsx(f,{...n,children:"Default"})}),args:{}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="flex flex-wrap gap-4">
      <SkipLinks {...args}>
        Default
      </SkipLinks>
    </div>,
  args: {}
}`,...m.parameters?.docs?.source}}};const A=["Default","Variants"];export{u as Default,m as Variants,A as __namedExportsOrder,w as default};
