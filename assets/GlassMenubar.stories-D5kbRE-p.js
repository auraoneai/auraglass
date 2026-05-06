import{r as g,j as a,R as E,c as h}from"./iframe-rcK9Xf1b.js";import{G}from"./GlassButton-B7wlFxfc.js";import{O as q}from"./OptimizedGlassCore-BtDfN8Ts.js";import{C as D}from"./chevron-right-BomxjyOt.js";import{M as O}from"./MotionFramer-D0-HiDbD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-SHVQWzfF.js";import"./LiquidGlassMaterial-B5rEZqMl.js";import"./LiquidGlassLayerProvider-BIHgxTaw.js";import"./GlassPredictiveEngine-CVTNJ8qr.js";import"./GlassAchievementSystem-DYlVdNF6.js";import"./GlassBiometricAdaptation-BGrhrjU2.js";import"./MotionPreferenceContext-mQDtMATf.js";import"./GlassEyeTracking-Bnvi94mr.js";import"./GlassSpatialAudio-6tN9NdIH.js";import"./createLucideIcon-DsZsNNjc.js";import"./utilsCore-jun4nkmH.js";const f=({items:e=[],orientation:c="horizontal",size:n="md",className:u,disabled:i=!1,"aria-label":o="Menu bar","data-testid":d})=>{const[l,r]=g.useState(new Set),[N,j]=g.useState(null),v=s=>{s?.disabled||(s?.children&&s?.children.length>0?r(y=>{const m=new Set(y);return m.has(s?.id)?m.delete(s?.id):(m.clear(),m.add(s?.id)),m}):(s?.action?.(),r(new Set)))};return a.jsx(q,{"data-glass-component":!0,"data-testid":d,intent:"neutral",elevation:"level2",intensity:"medium",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",className:h("relative glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",c==="horizontal"?"flex flex-row":"flex flex-col",i&&"opacity-50 pointer-events-none",u),role:"menubar","aria-label":o,"aria-orientation":c,"aria-disabled":i,children:e.map((s,y)=>a.jsxs(E.Fragment,{children:[s?.separator&&a.jsx("div",{className:h("bg-white/20",c==="horizontal"?"w-px h-6 glass-mx-2":"h-px w-6 glass-my-2")}),a.jsx(_,{item:s,isHovered:N===s?.id,hasSubmenuOpen:l.has(s?.id),onClick:v,onOpenSubmenu:m=>r(t=>new Set([...t,m?.id])),onCloseSubmenu:()=>r(new Set),size:n,"aria-haspopup":s?.children&&s?.children.length>0?"menu":void 0,"aria-expanded":l.has(s?.id)?!0:void 0}),s?.children&&l.has(s?.id)&&a.jsx(M,{isOpen:!0,onClose:()=>r(new Set),className:h("absolute glass-z-9999",c==="horizontal"?"top-full left-0 glass-mt-1":"top-0 left-full glass-ml-1"),children:a.jsx(f,{items:s?.children,orientation:"vertical",size:n,disabled:i})})]},s?.id))})},M=({children:e,position:c,isOpen:n,onClose:u,className:i})=>{const o=g.useRef(null);if(g.useEffect(()=>{const l=r=>{o.current&&!o.current.contains(r.target)&&n&&u()};return n&&document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[n,u]),g.useEffect(()=>{const l=r=>{r.key==="Escape"&&n&&u()};return n&&document.addEventListener("keydown",l),()=>document.removeEventListener("keydown",l)},[n,u]),!n)return null;const d=c?{left:c.x,top:c.y}:void 0;return a.jsx(O,{preset:"scaleIn",duration:150,style:{...d||{}},children:a.jsx(q,{intent:"neutral",elevation:"level3",intensity:"strong",depth:2,tint:"neutral",border:"subtle",animation:"none",performanceMode:"medium",ref:o,className:h("glass-backdrop-blur-md bg-black/20 border border-white/20 shadow-2xl","min-w-48 glass-py-1",i),children:e})})},_=({item:e,isHovered:c=!1,hasSubmenuOpen:n=!1,onClick:u,onOpenSubmenu:i,onCloseSubmenu:o,size:d="md",className:l,"aria-haspopup":r,"aria-expanded":N})=>{const j={sm:"h-8 glass-px-3 glass-text-sm",md:"h-10 glass-px-4 glass-text-base",lg:"h-12 glass-px-6 glass-text-lg"},v=()=>{u(e)},s=()=>{e?.children&&e?.children.length>0&&i(e)},y=()=>{o()};if(e?.separator)return a.jsx("div",{className:"glass-h-px glass-surface-subtle/20 glass-mx-2 glass-my-1",role:"separator"});const m=t=>{const k=t.currentTarget,V=k.closest('[role="menubar"]');if(!V)return;const p=Array.from(V.querySelectorAll('button?.[role="menuitem"]')),S=p.indexOf(k);S!==-1&&(t.key==="ArrowRight"?(p[(S+1)%(p?.length||0)]?.focus(),t.preventDefault()):t.key==="ArrowLeft"?(p[(S-1+(p?.length||0))%(p?.length||0)]?.focus(),t.preventDefault()):t.key==="ArrowDown"&&e?.children&&e?.children.length>0?(i(e),t.preventDefault()):t.key==="Escape"?(o(),k.blur(),t.preventDefault()):t.key==="Home"?(p[0]?.focus(),t.preventDefault()):t.key==="End"?(p[p.length-1]?.focus(),t.preventDefault()):(t.key==="Enter"||t.key===" ")&&(v(),t.preventDefault()))};return a.jsxs(G,{className:h("relative flex items-center justify-between w-full","glass-text-primary/80 hover:glass-text-primary transition-colors duration-200","hover:bg-white/10 glass-radius-md glass-hover--translate-y-0-5","after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200",c||n?"after:opacity-100 after:w-full":"after:opacity-0 after:w-0","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30 focus:ring-offset-2 focus:ring-offset-transparent","disabled:opacity-50 glass-disabled-cursor-not-allowed",j?.[d],{"bg-white/20 glass-text-primary":c||n,"font-medium":e?.checked},l),onClick:v,onMouseEnter:s,onMouseLeave:y,disabled:e?.disabled,type:"button",role:"menuitem","aria-haspopup":r,"aria-expanded":N,"aria-disabled":e?.disabled,"aria-checked":e?.type==="checkbox"||e?.type==="radio"?e?.checked:void 0,onKeyDown:m,children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3",children:[e?.icon&&a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-w-4 glass-h-4",children:e?.icon}),e?.type==="checkbox"&&a.jsx("div",{className:h("w-4 h-4 border border-white/40 glass-radius-md",e?.checked&&"bg-white border-white"),children:e?.checked&&a.jsx("div",{className:"glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center",children:a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-dark glass-radius-sm"})})}),e?.type==="radio"&&a.jsx("div",{className:h("w-4 h-4 border border-white/40 glass-radius-full",e?.checked&&"border-white"),children:e?.checked&&a.jsx("div",{className:"glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center",children:a.jsx("div",{className:"glass-w-2 glass-h-2 glass-surface-subtle glass-radius-full"})})}),a.jsx("span",{className:"glass-flex-1 glass-text-left glass-truncate",children:e?.label})]}),a.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[e?.shortcut&&a.jsx("span",{className:"glass-text-primary-glass-opacity-50 glass-text-xs glass-font-mono",children:e?.shortcut}),e?.children&&e?.children.length>0&&a.jsx(D,{className:"glass-w-4 glass-h-4 glass-text-primary-glass-opacity-50"})]})]})},z=()=>({createItem:(i,o,d,l)=>({id:i,label:o,action:d,...l}),createSeparator:()=>({id:`separator-${Date.now()}`,label:"",separator:!0}),createCheckboxItem:(i,o,d,l,r)=>({id:i,label:o,type:"checkbox",checked:d,action:()=>l(!d),...r}),createRadioItem:(i,o,d,l,r)=>({id:i,label:o,type:"radio",checked:d,action:()=>l(!d),...r})}),I=()=>[{id:"file-new",label:"New",shortcut:"Ctrl+N",action:()=>{}},{id:"file-open",label:"Open",shortcut:"Ctrl+O",action:()=>{}},{id:"file-separator-1",label:"",separator:!0},{id:"file-save",label:"Save",shortcut:"Ctrl+S",action:()=>{}},{id:"file-save-as",label:"Save As",shortcut:"Ctrl+Shift+S",action:()=>{}}];try{f.displayName="GlassMenubar",f.__docgenInfo={description:`GlassMenubar component
A glassmorphism menubar with dropdown menus`,displayName:"GlassMenubar",props:{items:{defaultValue:{value:"[]"},description:"Menu items",name:"items",required:!1,type:{name:"MenuItem[] | undefined"}},orientation:{defaultValue:{value:"horizontal"},description:"Menubar orientation",name:"orientation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"horizontal"'},{value:'"vertical"'}]}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},disabled:{defaultValue:{value:"false"},description:"Whether menubar is disabled",name:"disabled",required:!1,type:{name:"boolean | undefined"}},"aria-label":{defaultValue:{value:"Menu bar"},description:"Accessible label for the menubar",name:"aria-label",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test ID for testing",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}try{M.displayName="GlassMenubarContent",M.__docgenInfo={description:`GlassMenubarContent component
Container for menubar dropdown content`,displayName:"GlassMenubarContent",props:{children:{defaultValue:null,description:"Menu content",name:"children",required:!0,type:{name:"ReactNode"}},position:{defaultValue:null,description:"Content position",name:"position",required:!1,type:{name:"{ x: number; y: number; } | undefined"}},isOpen:{defaultValue:null,description:"Whether content is open",name:"isOpen",required:!0,type:{name:"boolean"}},onClose:{defaultValue:null,description:"Callback to close content",name:"onClose",required:!0,type:{name:"() => void"}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}try{_.displayName="GlassMenubarItem",_.__docgenInfo={description:`GlassMenubarItem component
Individual menubar item`,displayName:"GlassMenubarItem",props:{item:{defaultValue:null,description:"Menu item data",name:"item",required:!0,type:{name:"MenuItem"}},isHovered:{defaultValue:{value:"false"},description:"Whether item is hovered",name:"isHovered",required:!1,type:{name:"boolean | undefined"}},hasSubmenuOpen:{defaultValue:{value:"false"},description:"Whether item has submenu open",name:"hasSubmenuOpen",required:!1,type:{name:"boolean | undefined"}},onClick:{defaultValue:null,description:"Callback when item is clicked",name:"onClick",required:!0,type:{name:"(item: MenuItem) => void"}},onOpenSubmenu:{defaultValue:null,description:"Callback to open submenu",name:"onOpenSubmenu",required:!0,type:{name:"(item: MenuItem) => void"}},onCloseSubmenu:{defaultValue:null,description:"Callback to close submenu",name:"onCloseSubmenu",required:!0,type:{name:"() => void"}},size:{defaultValue:{value:"md"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},"aria-haspopup":{defaultValue:null,description:"ARIA haspopup attribute",name:"aria-haspopup",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"menu"'}]}},"aria-expanded":{defaultValue:null,description:"ARIA expanded attribute",name:"aria-expanded",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{z.displayName="useMenubar",z.__docgenInfo={description:"Hook for creating menubar items",displayName:"useMenubar",props:{}}}catch{}try{I.displayName="createFileMenu",I.__docgenInfo={description:"Preset menubar configurations",displayName:"createFileMenu",props:{}}}catch{}const ee={title:"Components/Navigation/GlassMenubar",component:f,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmenubar component."}}},argTypes:{items:{control:"object",description:"Array of menu items"},orientation:{control:{type:"select",options:["horizontal","vertical"]},description:"Menubar orientation"},size:{control:{type:"select",options:["sm","md","lg"]},description:"Size variant"},disabled:{control:"boolean",description:"Whether menubar is disabled"}},args:{items:[{id:"file",label:"File",children:[{id:"new",label:"New",shortcut:"Ctrl+N"},{id:"open",label:"Open",shortcut:"Ctrl+O"},{id:"separator1",label:"",separator:!0},{id:"save",label:"Save",shortcut:"Ctrl+S"}]},{id:"edit",label:"Edit",children:[{id:"undo",label:"Undo",shortcut:"Ctrl+Z"},{id:"redo",label:"Redo",shortcut:"Ctrl+Y"},{id:"separator2",label:"",separator:!0},{id:"cut",label:"Cut",shortcut:"Ctrl+X"},{id:"copy",label:"Copy",shortcut:"Ctrl+C"},{id:"paste",label:"Paste",shortcut:"Ctrl+V"}]}],orientation:"horizontal",size:"md",disabled:!1}},b={args:{items:[{id:"file",label:"File",children:[{id:"new",label:"New",shortcut:"Ctrl+N"},{id:"open",label:"Open",shortcut:"Ctrl+O"},{id:"save",label:"Save",shortcut:"Ctrl+S"}]},{id:"edit",label:"Edit",children:[{id:"undo",label:"Undo",shortcut:"Ctrl+Z"},{id:"copy",label:"Copy",shortcut:"Ctrl+C"},{id:"paste",label:"Paste",shortcut:"Ctrl+V"}]}]}},x={args:{...b.args,orientation:"vertical"}},w={render:e=>a.jsxs("div",{className:"glass-gap-4",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Small"}),a.jsx(f,{...e,size:"sm"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Medium"}),a.jsx(f,{...e,size:"md"})]}),a.jsxs("div",{children:[a.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-mb-2",children:"Large"}),a.jsx(f,{...e,size:"lg"})]})]}),args:{items:[{id:"file",label:"File"},{id:"edit",label:"Edit"},{id:"view",label:"View"}]}},C={args:{items:[{id:"view",label:"View",children:[{id:"show-toolbar",label:"Show Toolbar",type:"checkbox",checked:!0},{id:"show-sidebar",label:"Show Sidebar",type:"checkbox",checked:!1},{id:"separator1",label:"",separator:!0},{id:"fullscreen",label:"Fullscreen",shortcut:"F11"}]}]}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'file',
      label: 'File',
      children: [{
        id: 'new',
        label: 'New',
        shortcut: 'Ctrl+N'
      }, {
        id: 'open',
        label: 'Open',
        shortcut: 'Ctrl+O'
      }, {
        id: 'save',
        label: 'Save',
        shortcut: 'Ctrl+S'
      }]
    }, {
      id: 'edit',
      label: 'Edit',
      children: [{
        id: 'undo',
        label: 'Undo',
        shortcut: 'Ctrl+Z'
      }, {
        id: 'copy',
        label: 'Copy',
        shortcut: 'Ctrl+C'
      }, {
        id: 'paste',
        label: 'Paste',
        shortcut: 'Ctrl+V'
      }]
    }]
  }
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    orientation: 'vertical'
  }
}`,...x.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4">
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Small</h3>
        <GlassMenubar {...args} size="sm" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Medium</h3>
        <GlassMenubar {...args} size="md" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Large</h3>
        <GlassMenubar {...args} size="lg" />
      </div>
    </div>,
  args: {
    items: [{
      id: 'file',
      label: 'File'
    }, {
      id: 'edit',
      label: 'Edit'
    }, {
      id: 'view',
      label: 'View'
    }]
  }
}`,...w.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'view',
      label: 'View',
      children: [{
        id: 'show-toolbar',
        label: 'Show Toolbar',
        type: 'checkbox',
        checked: true
      }, {
        id: 'show-sidebar',
        label: 'Show Sidebar',
        type: 'checkbox',
        checked: false
      }, {
        id: 'separator1',
        label: '',
        separator: true
      }, {
        id: 'fullscreen',
        label: 'Fullscreen',
        shortcut: 'F11'
      }]
    }]
  }
}`,...C.parameters?.docs?.source}}};const ae=["Default","Vertical","DifferentSizes","WithCheckboxes"];export{b as Default,w as DifferentSizes,x as Vertical,C as WithCheckboxes,ae as __namedExportsOrder,ee as default};
