import{r,R as H,j as a,c as v}from"./iframe-GrkikuRp.js";import{G as Q}from"./GlassInput-CaaeA-dn.js";import{m as T}from"./components-DWrkUpM8.js";import{O as j}from"./OptimizedGlassCore-BK6ui_Z7.js";import{M as W}from"./MotionFramer-0RDYG5R5.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-QJo0sijf.js";import"./LiquidGlassLayerProvider-B3OXnDJ0.js";import"./a11y-CCC13-1v.js";import"./GlassButton-D11IFtlb.js";import"./GlassPredictiveEngine-Cet71K7v.js";import"./GlassAchievementSystem-F37YjtOd.js";import"./GlassBiometricAdaptation-xyUwR8ZA.js";import"./MotionPreferenceContext-BJCiJfFd.js";import"./GlassEyeTracking-DnsWplSi.js";import"./GlassSpatialAudio--c49q0dU.js";import"./deviceCapabilities-Cdjfew4F.js";import"./utilsCore-C85LumCN.js";const z=[{id:"open-file",label:"Open file",description:"Open a workspace file",keywords:["open","file"],group:"Quick actions",action:()=>{}},{id:"save",label:"Save",description:"Persist current changes",keywords:["save","write"],group:"Quick actions",action:()=>{}},{id:"find",label:"Find",description:"Search the current view",keywords:["search","find"],group:"Navigation",action:()=>{}}],B=r.createContext(null),C=({items:e=z,placeholder:s="Search commands...",emptyMessage:o="No commands found",loading:g=!1,maxHeight:f="300px",filterItems:d,groupBy:i,renderItem:u,renderEmpty:q,onSelect:E,onSearchChange:S,className:O,"aria-label":G,"data-testid":D})=>{const[m,k]=r.useState(""),[y,p]=r.useState(0),[c,F]=r.useState(e);r.useRef(null);const P=(n,l)=>{if(!l)return n;const t=l.toLowerCase();return n.filter(h=>[h?.label,h?.description,...h?.keywords||[]].join(" ").toLowerCase().includes(t))};r.useEffect(()=>{const n=d?d(e,m):P(e,m);F(n),p(0),S?.(m)},[m,e,d,S]);const L=H.useMemo(()=>{if(!i)return{"":c};const n={};return c.forEach(l=>{const t=i(l);n[t]||(n[t]=[]),n[t].push(l)}),n},[c,i]),R=n=>{const l=c?.length||0;switch(n.key){case"ArrowDown":if(n.preventDefault(),l===0)break;p(t=>(t+1)%l);break;case"ArrowUp":if(n.preventDefault(),l===0)break;p(t=>(t-1+l)%l);break;case"Enter":n.preventDefault(),c[y]&&_(c[y]);break;case"Escape":n.preventDefault(),k(""),p(0);break}},_=n=>{n?.disabled||(n?.action(),E?.(n))};return a.jsx(B.Provider,{"data-glass-component":!0,value:{selectedIndex:y,setSelectedIndex:p,query:m,setQuery:k},children:a.jsx(j,{intent:"neutral",elevation:"level1",intensity:"subtle",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:v("glass-radius-lg glass-surface-dark/30 glass-border glass-border-white/10 glass-overflow-hidden",O),style:{background:"var(--glass-primary-level2-surface)",border:"1px solid rgba(148, 163, 184, 0.18)",boxShadow:"0 18px 44px rgba(2, 6, 23, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)"},"aria-label":G,"data-testid":D,children:a.jsxs("div",{className:"glass-p-3",children:[a.jsx(w,{placeholder:s,value:m,onChange:n=>k(n.target.value),onKeyDown:R,autoFocus:!0}),a.jsx(N,{maxHeight:f,children:g?a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-py-8",children:a.jsx("div",{className:"glass-w-6 glass-h-6 glass-border-2 glass-border-white/30 glass-border-t-white/60 glass-radius-full glass-animate-spin"})}):(c?.length||0)===0?q?q():a.jsx("div",{className:"glass-text-center glass-py-6 glass-text-secondary",children:o}):Object.entries(L).map(([n,l])=>a.jsxs("div",{children:[n&&a.jsx("div",{className:"glass-px-3 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-border-b glass-border-white/10",children:n}),l.map((t,h)=>{const I=c.indexOf(t)===y;return a.jsx("div",{className:v("glass-flex glass-items-center glass-px-3 glass-py-2 glass-cursor-pointer glass-transition-all glass-duration-200 glass-radius-md","hover:glass-surface-subtle/10 glass-hover--translate-y-0-5",{"glass-surface-primary/20 glass-text-primary glass-ring-1 glass-ring-primary":I,"glass-opacity-50 glass-cursor-not-allowed":t?.disabled}),onClick:K=>_(t),children:u?u(t,I):a.jsxs(a.Fragment,{children:[t?.icon&&a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-5 glass-h-5 glass-mr-3 glass-text-secondary",children:t?.icon}),a.jsxs("div",{className:"glass-flex-1 glass-min-w-0",children:[a.jsx("div",{className:"glass-text-primary glass-font-medium glass-truncate",children:t?.label}),t?.description&&a.jsx("div",{className:"glass-text-secondary glass-text-sm glass-truncate",children:t?.description})]})]})},t?.id)})]},n))})]})})})},M=({open:e,onOpenChange:s,title:o="Command Palette",description:g="Search for commands...",...f})=>{const d=r.useRef(null);return r.useEffect(()=>{const i=u=>{u.key==="Escape"&&e&&s(!1)};return document.addEventListener("keydown",i),()=>document.removeEventListener("keydown",i)},[e,s]),r.useEffect(()=>{const i=u=>{d.current&&!d.current.contains(u.target)&&e&&s(!1)};return document.addEventListener("mousedown",i),()=>document.removeEventListener("mousedown",i)},[e,s]),e?a.jsx("div",{className:"glass-fixed glass-inset-0 glass-z-9999 glass-flex glass-items-center glass-justify-center glass-p-4 glass-surface-dark/50 glass-backdrop-blur-md glass-contrast-guard",children:a.jsx(W,{preset:"scaleIn",className:"glass-w-full glass-max-w-lg",onAnimationEnd:()=>{d.current?.querySelector("input")?.focus()},children:a.jsx("div",{ref:d,children:a.jsx(C,{...f})})})}):null},w=({className:e,...s})=>{const o={...s,"aria-required":s["aria-required"]==="true"?!0:s["aria-required"]==="false"?!1:s["aria-required"],"aria-invalid":typeof s["aria-invalid"]=="boolean"?s["aria-invalid"]:s["aria-invalid"]==="true"?!0:s["aria-invalid"]==="false"?!1:void 0};return a.jsxs("div",{className:"glass-relative glass-mb-3",children:[a.jsx(T,{className:"glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-text-secondary"}),a.jsx(j,{elevation:"level1",intensity:"subtle",animation:"none",className:"glass-backdrop-blur-md glass-radius-lg glass-border glass-border-white/10 glass-surface-dark/40 glass-contrast-guard",style:{background:"var(--glass-primary-level3-surface)",border:"1px solid rgba(148, 163, 184, 0.2)",boxShadow:"inset 0 1px 0 rgba(255, 255, 255, 0.08)"},children:a.jsx(Q,{...o,className:v("glass-w-full glass-py-2 glass-bg-transparent glass-border-0 glass-outline-none","glass-text-primary",e),style:{paddingLeft:"2.5rem",paddingRight:"1rem",background:"transparent",border:0,boxShadow:"none",...o.style||{}}})})]})},N=({children:e,maxHeight:s="300px",className:o})=>a.jsx("div",{className:v("glass-overflow-y-auto",o),style:{maxHeight:s},children:e}),V=()=>{const[e,s]=r.useState(!1),[o,g]=r.useState([]);return{isOpen:e,items:o,openPalette:i=>{g(i),s(!0)},closePalette:()=>{s(!1)},setIsOpen:s}};try{C.displayName="GlassCommand",C.__docgenInfo={description:`GlassCommand component
A glassmorphism command palette with search functionality`,displayName:"GlassCommand",props:{items:{defaultValue:{value:`[
  {
    id: "open-file",
    label: "Open file",
    description: "Open a workspace file",
    keywords: ["open", "file"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "save",
    label: "Save",
    description: "Persist current changes",
    keywords: ["save", "write"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "find",
    label: "Find",
    description: "Search the current view",
    keywords: ["search", "find"],
    group: "Navigation",
    action: () => {},
  },
]`},description:"Command items to display",name:"items",required:!1,type:{name:"CommandItem[] | undefined"}},placeholder:{defaultValue:{value:"Search commands..."},description:"Placeholder text for search input",name:"placeholder",required:!1,type:{name:"string | undefined"}},emptyMessage:{defaultValue:{value:"No commands found"},description:"Empty state message",name:"emptyMessage",required:!1,type:{name:"string | undefined"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:{value:"300px"},description:"Maximum height of the command list",name:"maxHeight",required:!1,type:{name:"string | undefined"}},filterItems:{defaultValue:null,description:"Custom filter function",name:"filterItems",required:!1,type:{name:"((items: CommandItem[], query: string) => CommandItem[]) | undefined"}},groupBy:{defaultValue:null,description:"Group items by category",name:"groupBy",required:!1,type:{name:"((item: CommandItem) => string) | undefined"}},renderItem:{defaultValue:null,description:"Custom render function for items",name:"renderItem",required:!1,type:{name:"((item: CommandItem, isSelected: boolean) => ReactNode) | undefined"}},renderEmpty:{defaultValue:null,description:"Custom render function for empty state",name:"renderEmpty",required:!1,type:{name:"(() => ReactNode) | undefined"}},onSelect:{defaultValue:null,description:"Callback when command is selected",name:"onSelect",required:!1,type:{name:"((item: CommandItem) => void) | undefined"}},onSearchChange:{defaultValue:null,description:"Callback when search query changes",name:"onSearchChange",required:!1,type:{name:"((query: string) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Accessible label for the command palette",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{M.displayName="GlassCommandDialog",M.__docgenInfo={description:`GlassCommandDialog component
A modal dialog containing the command palette`,displayName:"GlassCommandDialog",props:{open:{defaultValue:null,description:"Whether dialog is open",name:"open",required:!0,type:{name:"boolean"}},onOpenChange:{defaultValue:null,description:"Callback when dialog closes",name:"onOpenChange",required:!0,type:{name:"(open: boolean) => void"}},title:{defaultValue:{value:"Command Palette"},description:"Dialog title",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:{value:"Search for commands..."},description:"Dialog description",name:"description",required:!1,type:{name:"string | undefined"}},items:{defaultValue:{value:`[
  {
    id: "open-file",
    label: "Open file",
    description: "Open a workspace file",
    keywords: ["open", "file"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "save",
    label: "Save",
    description: "Persist current changes",
    keywords: ["save", "write"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "find",
    label: "Find",
    description: "Search the current view",
    keywords: ["search", "find"],
    group: "Navigation",
    action: () => {},
  },
]`},description:"Command items to display",name:"items",required:!1,type:{name:"CommandItem[] | undefined"}},placeholder:{defaultValue:{value:"Search commands..."},description:"Placeholder text for search input",name:"placeholder",required:!1,type:{name:"string | undefined"}},emptyMessage:{defaultValue:{value:"No commands found"},description:"Empty state message",name:"emptyMessage",required:!1,type:{name:"string | undefined"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:{value:"300px"},description:"Maximum height of the command list",name:"maxHeight",required:!1,type:{name:"string | undefined"}},filterItems:{defaultValue:null,description:"Custom filter function",name:"filterItems",required:!1,type:{name:"((items: CommandItem[], query: string) => CommandItem[]) | undefined"}},groupBy:{defaultValue:null,description:"Group items by category",name:"groupBy",required:!1,type:{name:"((item: CommandItem) => string) | undefined"}},renderItem:{defaultValue:null,description:"Custom render function for items",name:"renderItem",required:!1,type:{name:"((item: CommandItem, isSelected: boolean) => ReactNode) | undefined"}},renderEmpty:{defaultValue:null,description:"Custom render function for empty state",name:"renderEmpty",required:!1,type:{name:"(() => ReactNode) | undefined"}},onSelect:{defaultValue:null,description:"Callback when command is selected",name:"onSelect",required:!1,type:{name:"((item: CommandItem) => void) | undefined"}},onSearchChange:{defaultValue:null,description:"Callback when search query changes",name:"onSearchChange",required:!1,type:{name:"((query: string) => void) | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Accessible label for the command palette",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Custom data-testid",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{w.displayName="GlassCommandInput",w.__docgenInfo={description:`GlassCommandInput component
Search input for the command palette`,displayName:"GlassCommandInput",props:{className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{N.displayName="GlassCommandList",N.__docgenInfo={description:`GlassCommandList component
Scrollable list container for command items`,displayName:"GlassCommandList",props:{children:{defaultValue:null,description:"Command items to display",name:"children",required:!0,type:{name:"ReactNode"}},maxHeight:{defaultValue:{value:"300px"},description:"Maximum height",name:"maxHeight",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{V.displayName="useCommandPalette",V.__docgenInfo={description:"Hook for using command palette globally",displayName:"useCommandPalette",props:{}}}catch{}const me={title:"Effects + Advanced/Glass Command",component:C,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommand component."}}},argTypes:{placeholder:{control:"text",description:"Placeholder text for search input"},emptyMessage:{control:"text",description:"Empty state message"},loading:{control:"boolean",description:"Loading state"},maxHeight:{control:"text",description:"Maximum height of the command list"}},args:{placeholder:"Type a command or search...",emptyMessage:"No results found",loading:!1,maxHeight:"300px"}},b={args:{items:[{id:"1",label:"Create new file",description:"Create a new file in the current directory",action:(...e)=>console.log("Mock function called",...e),group:"File"},{id:"2",label:"Open file",description:"Open an existing file",action:(...e)=>console.log("Mock function called",...e),group:"File"},{id:"3",label:"Search",description:"Search for files and content",action:(...e)=>console.log("Mock function called",...e),group:"Navigation"},{id:"4",label:"Settings",description:"Open application settings",action:(...e)=>console.log("Mock function called",...e),group:"Application"}]}},x={args:{items:[{id:"1",label:"New Document",action:(...e)=>console.log("Mock function called",...e),group:"File Operations"},{id:"2",label:"Open Recent",action:(...e)=>console.log("Mock function called",...e),group:"File Operations"},{id:"3",label:"Save",action:(...e)=>console.log("Mock function called",...e),group:"File Operations"},{id:"4",label:"Cut",action:(...e)=>console.log("Mock function called",...e),group:"Edit"},{id:"5",label:"Copy",action:(...e)=>console.log("Mock function called",...e),group:"Edit"},{id:"6",label:"Paste",action:(...e)=>console.log("Mock function called",...e),group:"Edit"}]}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: 'Create new file',
      description: 'Create a new file in the current directory',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'File'
    }, {
      id: '2',
      label: 'Open file',
      description: 'Open an existing file',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'File'
    }, {
      id: '3',
      label: 'Search',
      description: 'Search for files and content',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'Navigation'
    }, {
      id: '4',
      label: 'Settings',
      description: 'Open application settings',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'Application'
    }]
  }
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: 'New Document',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'File Operations'
    }, {
      id: '2',
      label: 'Open Recent',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'File Operations'
    }, {
      id: '3',
      label: 'Save',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'File Operations'
    }, {
      id: '4',
      label: 'Cut',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'Edit'
    }, {
      id: '5',
      label: 'Copy',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'Edit'
    }, {
      id: '6',
      label: 'Paste',
      action: (...args) => console.log('Mock function called', ...args),
      group: 'Edit'
    }]
  }
}`,...x.parameters?.docs?.source}}};const pe=["Default","WithGroups"];export{b as Default,x as WithGroups,pe as __namedExportsOrder,me as default};
