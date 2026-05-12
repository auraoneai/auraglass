import{r as l,j as s,c as E}from"./iframe-LAGStZOr.js";import{G as z}from"./GlassButton-CiF6lEMD.js";import{G as f}from"./GlassBadge-Cx1BLP8Z.js";import{G as se}from"./GlassInput-q-B2lJvf.js";import{M as ae}from"./MotionFramer-Duk6IhfR.js";import{O as te}from"./OptimizedGlassCore-Jd0dTpF2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D7SPj1j6.js";import"./LiquidGlassMaterial-DQpzMkZd.js";import"./LiquidGlassLayerProvider-vD8LxwbK.js";import"./a11y-C_KrV_f1.js";import"./GlassPredictiveEngine-DAQdsyWm.js";import"./GlassAchievementSystem-BnhTIUzm.js";import"./GlassBiometricAdaptation-WKh1enEY.js";import"./MotionPreferenceContext-C7yRy-IY.js";import"./GlassEyeTracking-C5DLjJGe.js";import"./GlassSpatialAudio-BzqwaRwI.js";import"./utilsCore-D2ntLguv.js";import"./deviceCapabilities-B9hm0WxX.js";const x=l.forwardRef(({items:y=[],groups:I=[],open:C=!1,onOpenChange:v,onSelect:D,placeholder:P="Search commands...",emptyMessage:_="No commands found",maxResults:G=50,enableRecents:p=!0,recentsKey:w="glass-command-palette-recents",maxRecents:W=5,filter:N,sort:j,fuzzySearch:M=!0,showCategories:S=!0,showShortcuts:A=!0,backdropBlur:B=!0,closeOnEscape:J=!0,closeOnSelect:K=!0,loading:H=!1,loadingMessage:T="Loading commands...",className:U,"data-testid":Q,"aria-label":X,...ne},Y)=>{const[r,k]=l.useState(""),[i,c]=l.useState(0),[g,O]=l.useState([]),F=l.useRef(null),V=l.useRef(null);l.useEffect(()=>{if(!(!p||typeof window>"u"))try{const e=localStorage.getItem(w);e&&O(JSON.parse(e))}catch{O([])}},[p,w]);const Z=e=>{if(!(!p||typeof window>"u"))try{const t=[e,...g.filter(a=>a.id!==e?.id)].slice(0,W);O(t),localStorage.setItem(w,JSON.stringify(t))}catch{}},q=l.useMemo(()=>{const e=[...y];return I.forEach(t=>{e.push(...t.items.map(a=>({...a,category:a?.category||t.label})))}),e},[y,I]),$=(e,t)=>{if(!t)return!0;const a=t.toLowerCase(),o=e?.label.toLowerCase(),d=(e?.description||"").toLowerCase(),u=(e?.keywords||[]).join(" ").toLowerCase();if(M){const m=new RegExp(a.split("").join(".*"),"i");return m.test(o)||m.test(d)||m.test(u)}else return o.includes(a)||d.includes(a)||u.includes(a)},n=l.useMemo(()=>{let e=q;return r?e=e.filter(t=>N?N(t,r):$(t,r)):p&&(g?.length||0)>0&&(e=g.filter(t=>q.some(a=>a?.id===t.id))),j?e.sort(j):e.sort((t,a)=>{if(r){const o=t.label.toLowerCase().startsWith(r.toLowerCase())?1:0,d=a.label.toLowerCase().startsWith(r.toLowerCase())?1:0;if(o!==d)return d-o}return t.label.localeCompare(a.label)}),e.slice(0,G)},[q,r,N,j,G,M,p,g]),L=l.useMemo(()=>S?n.reduce((t,a)=>{const o=a?.category||"Other";return t[o]||(t[o]=[]),t[o].push(a),t},{}):{All:n},[n,S]),R=e=>{e?.disabled||(Z(e),e?.action?.(),D?.(e),K&&v?.(!1),k(""),c(0))},ee=e=>{switch(e.key){case"Escape":J&&(e.preventDefault(),v?.(!1));break;case"ArrowDown":e.preventDefault(),c(t=>t<(n?.length||0)-1?t+1:t);break;case"ArrowUp":e.preventDefault(),c(t=>t>0?t-1:t);break;case"Enter":e.preventDefault(),n[i]&&R(n[i]);break;case"Home":e.preventDefault(),c(0);break;case"End":e.preventDefault(),c((n?.length||0)-1);break}};return l.useEffect(()=>{c(0)},[r]),l.useEffect(()=>{C&&F.current&&F.current.focus()},[C]),l.useEffect(()=>{if(i>=0&&V.current){const e=V.current.children?.[i];e&&typeof e.scrollIntoView=="function"&&e.scrollIntoView({block:"nearest",behavior:"smooth"})}},[i]),C?s.jsxs("div",{"data-glass-component":!0,className:"glass-fixed glass-inset-0 glass-z-50 glass-flex glass-items-start glass-justify-center glass-pt-10vh",onClick:e=>{e.target===e.currentTarget&&v?.(!1)},children:[s.jsx("div",{className:E("absolute inset-0 bg-black/20",B&&"glass-backdrop-blur-md")}),s.jsx(ae,{preset:"scaleIn",duration:200,className:"glass-relative glass-w-full glass-max-w-2xl glass-mx-4",children:s.jsxs(te,{ref:Y,intent:"neutral",elevation:"level4",intensity:"strong",depth:3,tint:"neutral",border:"glow",animation:"float",performanceMode:"high",className:E("w-full glass-max-h-80vh overflow-hidden glass-radius-xl",U),onKeyDown:ee,"data-testid":Q,"aria-label":X||"Command palette",role:"dialog","aria-modal":"true",children:[s.jsx("div",{className:"glass-p-4 glass-border-b glass-border-glass-border/10",children:s.jsx(se,{ref:F,value:r,onChange:e=>k(e.target.value),placeholder:P,size:"lg",leftIcon:s.jsx("svg",{className:"glass-w-5 glass-h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),rightIcon:r&&s.jsx(z,{type:"button",className:"glass-p-1 glass-radius-md hover:glass-surface-subtle glass-transition-colors",onClick:e=>k(""),children:s.jsx("svg",{className:"glass-w-4 glass-h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),className:"glass-border-0 glass-bg-transparent glass-focus-ring-0"})}),s.jsx("div",{ref:V,className:"glass-max-h-96 glass-overflow-y-auto glass-overscroll-contain",role:n&&n.length>0?"listbox":"status","aria-label":n&&n.length>0?"Command results":"No commands found",children:H?s.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-py-8",children:s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[s.jsx("div",{className:"glass-w-5 glass-h-5 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full glass-animate-spin"}),s.jsx("span",{className:"glass-text-secondary",children:T})]})}):(n?.length||0)===0?s.jsx("div",{className:"glass-py-8 glass-text-center glass-text-secondary",children:_}):Object.entries(L).map(([e,t])=>s.jsxs("div",{children:[S&&Object.keys(L).length>1&&s.jsx("div",{className:"glass-px-4 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-surface-subtle glass-border-b glass-border-glass-border/5",children:r?"Results":e}),t.map((a,o)=>{const u=n.indexOf(a)===i;if(a?.component){const m=a?.component;return s.jsx(m,{item:a,isSelected:u},a?.id)}return s.jsxs(z,{type:"button",className:E("w-full flex items-center glass-gap-3 glass-px-4 glass-py-3 text-left transition-colors","hover:bg-muted/20 focus:bg-muted/20 focus:outline-none",{"bg-primary/10 border-l-2 border-primary":u,"opacity-50 cursor-not-allowed":a?.disabled}),onClick:m=>R(a),disabled:a?.disabled,role:"option","aria-selected":u,children:[a?.icon&&s.jsx("span",{className:"glass-flex-shrink-0 glass-text-secondary",children:a?.icon}),s.jsxs("div",{className:"glass-flex-1 glass-min-glass-w-0",children:[s.jsx("div",{className:"glass-font-medium glass-text-primary",children:a?.label}),a?.description&&s.jsx("div",{className:"glass-text-sm glass-text-secondary glass-truncate",children:a?.description})]}),A&&a?.shortcut&&s.jsx(f,{variant:"secondary",size:"sm",children:a?.shortcut})]},a?.id)})]},e))}),(n?.length||0)>0&&s.jsx("div",{className:"glass-px-4 glass-py-2 glass-text-xs glass-text-secondary glass-surface-subtle glass-border-t glass-border-glass-border/5",children:s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsxs("span",{children:[n?.length||0," ",(n?.length||0)===1?"result":"results"]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4",children:[s.jsxs("span",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx(f,{variant:"secondary",size:"sm",children:"↑↓"}),"Navigate"]}),s.jsxs("span",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx(f,{variant:"secondary",size:"sm",children:"↵"}),"Select"]}),s.jsxs("span",{className:"glass-flex glass-items-center glass-gap-1",children:[s.jsx(f,{variant:"secondary",size:"sm",children:"Esc"}),"Close"]})]})]})})]})})]}):null});x.displayName="GlassCommandPalette";try{x.displayName="GlassCommandPalette",x.__docgenInfo={description:`GlassCommandPalette component
Modal command palette with search, keyboard navigation, and glassmorphism styling`,displayName:"GlassCommandPalette",props:{items:{defaultValue:{value:"[]"},description:"Command items (flat list or grouped)",name:"items",required:!1,type:{name:"CommandItem[] | undefined"}},groups:{defaultValue:{value:"[]"},description:"Grouped command items",name:"groups",required:!1,type:{name:"CommandGroup[] | undefined"}},open:{defaultValue:{value:"false"},description:"Whether the palette is open",name:"open",required:!1,type:{name:"boolean | undefined"}},onOpenChange:{defaultValue:null,description:"Callback when open state changes",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},onSelect:{defaultValue:null,description:"Callback when command is selected",name:"onSelect",required:!1,type:{name:"((item: CommandItem) => void) | undefined"}},placeholder:{defaultValue:{value:"Search commands..."},description:"Search placeholder text",name:"placeholder",required:!1,type:{name:"string | undefined"}},emptyMessage:{defaultValue:{value:"No commands found"},description:"Empty state message",name:"emptyMessage",required:!1,type:{name:"string | undefined"}},maxResults:{defaultValue:{value:"50"},description:"Maximum number of results to show",name:"maxResults",required:!1,type:{name:"number | undefined"}},enableRecents:{defaultValue:{value:"true"},description:"Enable recent commands tracking",name:"enableRecents",required:!1,type:{name:"boolean | undefined"}},recentsKey:{defaultValue:{value:"glass-command-palette-recents"},description:"Recent commands storage key",name:"recentsKey",required:!1,type:{name:"string | undefined"}},maxRecents:{defaultValue:{value:"5"},description:"Maximum number of recent items",name:"maxRecents",required:!1,type:{name:"number | undefined"}},filter:{defaultValue:null,description:"Custom filter function",name:"filter",required:!1,type:{name:"((item: CommandItem, search: string) => boolean) | undefined"}},sort:{defaultValue:null,description:"Custom sort function",name:"sort",required:!1,type:{name:"((a: CommandItem, b: CommandItem) => number) | undefined"}},fuzzySearch:{defaultValue:{value:"true"},description:"Enable fuzzy search",name:"fuzzySearch",required:!1,type:{name:"boolean | undefined"}},showCategories:{defaultValue:{value:"true"},description:"Show categories",name:"showCategories",required:!1,type:{name:"boolean | undefined"}},showShortcuts:{defaultValue:{value:"true"},description:"Show shortcuts",name:"showShortcuts",required:!1,type:{name:"boolean | undefined"}},backdropBlur:{defaultValue:{value:"true"},description:"Modal backdrop blur",name:"backdropBlur",required:!1,type:{name:"boolean | undefined"}},closeOnEscape:{defaultValue:{value:"true"},description:"Close on escape key",name:"closeOnEscape",required:!1,type:{name:"boolean | undefined"}},closeOnSelect:{defaultValue:{value:"true"},description:"Close on select",name:"closeOnSelect",required:!1,type:{name:"boolean | undefined"}},loading:{defaultValue:{value:"false"},description:"Custom loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},loadingMessage:{defaultValue:{value:"Loading commands..."},description:"Loading message",name:"loadingMessage",required:!1,type:{name:"string | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}},"aria-label":{defaultValue:null,description:"Defines a string value that labels the current element.",name:"aria-label",required:!1,type:{name:"string | undefined"}}}}}catch{}const je={title:"Effects + Advanced/Glass Command Palette",component:x,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommandpalette component."}}},argTypes:{open:{control:"boolean",description:"Whether the palette is open"},placeholder:{control:"text",description:"Search placeholder text"}},args:{open:!0,placeholder:"Search commands..."}},h={args:{items:[{id:"1",label:"New File",description:"Create a new file",action:()=>console.log("New File"),category:"File",shortcut:"Ctrl+N"},{id:"2",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),category:"File",shortcut:"Ctrl+O"},{id:"3",label:"Save",description:"Save current file",action:()=>console.log("Save"),category:"File",shortcut:"Ctrl+S"},{id:"4",label:"Search",description:"Search in files",action:()=>console.log("Search"),category:"Navigation",shortcut:"Ctrl+F"},{id:"5",label:"Settings",description:"Open settings",action:()=>console.log("Settings"),category:"Application",shortcut:"Ctrl+,"}]}},b={args:{groups:[{id:"file",label:"File Operations",items:[{id:"new",label:"New File",description:"Create a new file",action:()=>console.log("New File"),shortcut:"Ctrl+N"},{id:"open",label:"Open File",description:"Open an existing file",action:()=>console.log("Open File"),shortcut:"Ctrl+O"}]},{id:"edit",label:"Edit",items:[{id:"copy",label:"Copy",description:"Copy selection",action:()=>console.log("Copy"),shortcut:"Ctrl+C"},{id:"paste",label:"Paste",description:"Paste from clipboard",action:()=>console.log("Paste"),shortcut:"Ctrl+V"}]}]}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: 'New File',
      description: 'Create a new file',
      action: () => console.log('New File'),
      category: 'File',
      shortcut: 'Ctrl+N'
    }, {
      id: '2',
      label: 'Open File',
      description: 'Open an existing file',
      action: () => console.log('Open File'),
      category: 'File',
      shortcut: 'Ctrl+O'
    }, {
      id: '3',
      label: 'Save',
      description: 'Save current file',
      action: () => console.log('Save'),
      category: 'File',
      shortcut: 'Ctrl+S'
    }, {
      id: '4',
      label: 'Search',
      description: 'Search in files',
      action: () => console.log('Search'),
      category: 'Navigation',
      shortcut: 'Ctrl+F'
    }, {
      id: '5',
      label: 'Settings',
      description: 'Open settings',
      action: () => console.log('Settings'),
      category: 'Application',
      shortcut: 'Ctrl+,'
    }]
  }
}`,...h.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [{
      id: 'file',
      label: 'File Operations',
      items: [{
        id: 'new',
        label: 'New File',
        description: 'Create a new file',
        action: () => console.log('New File'),
        shortcut: 'Ctrl+N'
      }, {
        id: 'open',
        label: 'Open File',
        description: 'Open an existing file',
        action: () => console.log('Open File'),
        shortcut: 'Ctrl+O'
      }]
    }, {
      id: 'edit',
      label: 'Edit',
      items: [{
        id: 'copy',
        label: 'Copy',
        description: 'Copy selection',
        action: () => console.log('Copy'),
        shortcut: 'Ctrl+C'
      }, {
        id: 'paste',
        label: 'Paste',
        description: 'Paste from clipboard',
        action: () => console.log('Paste'),
        shortcut: 'Ctrl+V'
      }]
    }]
  }
}`,...b.parameters?.docs?.source}}};const Se=["Default","WithGroups"];export{h as Default,b as WithGroups,Se as __namedExportsOrder,je as default};
