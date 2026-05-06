import{f as s}from"./index-CLSxArU-.js";import{r as h,h as C,b as S,j as a,c as i}from"./iframe-DBVOVM-c.js";import{O as y}from"./OptimizedGlassCore-CyIux4a_.js";import"./index-ByImX2pa.js";import"./preload-helper-PPVm8Dsz.js";const l=h.forwardRef(({items:n=[],position:d="bottom",respectMotionPreference:m=!0,className:u,...p},g)=>{const b=C("command-bar"),f=S(),c=m&&f;return!n||!Array.isArray(n)?null:a.jsx("div",{className:i("w-full",d==="top"?"glass-mt-2":"glass-mb-2"),children:a.jsx(y,{ref:g,elevation:"level2",animation:c?"none":"gentle",role:"toolbar","aria-label":"Command bar",id:b,className:i("glass-radius-xl glass-px-2 glass-py-1 flex flex-wrap glass-gap-1 overflow-visible",u),...p,children:n.map(e=>a.jsx("button",{disabled:e.disabled,onClick:e.onSelect,className:i("glass-px-3 glass-py-1 glass-radius-md glass-text-sm glass-text-primary/90 hover:bg-white/10 border border-white/10 whitespace-nowrap leading-normal","glass-focus glass-touch-target glass-contrast-guard","focus:outline-none focus:ring-2 glass-focus-ring-white-opacity-30",!c&&"transition-all duration-200 glass-hover-scale-105",e.disabled&&"opacity-50 cursor-not-allowed"),children:a.jsxs("span",{className:"glass-inline-glass-flex glass-items-center glass-gap-2",children:[e.icon,e.label,e.shortcut&&a.jsx("kbd",{className:"glass-ml-1 glass-text-xs glass-px-1 glass-py-0.5 glass-radius-md glass-surface-subtle/10 glass-border glass-border-white/15",children:e.shortcut})]})},e.id))})})});l.displayName="GlassCommandBar";try{l.displayName="GlassCommandBar",l.__docgenInfo={description:"",displayName:"GlassCommandBar",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"CommandItem[] | undefined"}},position:{defaultValue:{value:"bottom"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"bottom"'},{value:'"top"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"Whether to respect motion preferences for animations",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const I={title:"Components/Navigation/GlassCommandBar",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscommandbar component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},o={args:{items:[{id:"save",label:"Save",icon:"💾",shortcut:"Ctrl+S",onSelect:s()},{id:"copy",label:"Copy",icon:"📋",shortcut:"Ctrl+C",onSelect:s()},{id:"paste",label:"Paste",icon:"📄",shortcut:"Ctrl+V",onSelect:s()}]}},t={args:{items:[{id:"bold",label:"Bold",icon:"𝐁",shortcut:"Ctrl+B",onSelect:s()},{id:"italic",label:"Italic",icon:"𝐼",shortcut:"Ctrl+I",onSelect:s()},{id:"underline",label:"Underline",icon:"U̲",shortcut:"Ctrl+U",onSelect:s(),disabled:!0}]}},r={args:{position:"top",items:[{id:"undo",label:"Undo",icon:"↶",shortcut:"Ctrl+Z",onSelect:s()},{id:"redo",label:"Redo",icon:"↷",shortcut:"Ctrl+Y",onSelect:s()}]}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'save',
      label: 'Save',
      icon: '💾',
      shortcut: 'Ctrl+S',
      onSelect: fn()
    }, {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      shortcut: 'Ctrl+C',
      onSelect: fn()
    }, {
      id: 'paste',
      label: 'Paste',
      icon: '📄',
      shortcut: 'Ctrl+V',
      onSelect: fn()
    }]
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'bold',
      label: 'Bold',
      icon: '𝐁',
      shortcut: 'Ctrl+B',
      onSelect: fn()
    }, {
      id: 'italic',
      label: 'Italic',
      icon: '𝐼',
      shortcut: 'Ctrl+I',
      onSelect: fn()
    }, {
      id: 'underline',
      label: 'Underline',
      icon: 'U̲',
      shortcut: 'Ctrl+U',
      onSelect: fn(),
      disabled: true
    }]
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    position: 'top',
    items: [{
      id: 'undo',
      label: 'Undo',
      icon: '↶',
      shortcut: 'Ctrl+Z',
      onSelect: fn()
    }, {
      id: 'redo',
      label: 'Redo',
      icon: '↷',
      shortcut: 'Ctrl+Y',
      onSelect: fn()
    }]
  }
}`,...r.parameters?.docs?.source}}};const _=["Default","WithDisabledItem","TopPosition"];export{o as Default,r as TopPosition,t as WithDisabledItem,_ as __namedExportsOrder,I as default};
