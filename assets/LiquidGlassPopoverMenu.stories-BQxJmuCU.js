import{r as c,j as s,c as n}from"./iframe-C2Py7iTP.js";import{L as m}from"./LiquidGlassMaterial-CmfeHEzl.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-DpzmTZb0.js";const l=c.forwardRef(({open:r,items:o,onOpenChange:t,sourceId:i,className:d,...u},p)=>r?s.jsx(m,{ref:p,material:"liquid",radius:"xl",className:n("liquid-glass-popover-menu glass-min-w-56 glass-p-2",d),"data-liquid-glass-popover-menu":"true","data-source-id":i,...u,children:s.jsx("div",{role:"menu",className:"glass-flex glass-flex-col glass-gap-1",children:o.map(e=>s.jsxs("button",{type:"button",role:"menuitem",disabled:e.disabled,"aria-checked":e.selected,className:n("glass-flex glass-items-center glass-gap-2 glass-radius-lg glass-px-3 glass-py-2 glass-text-left",e.selected&&"glass-surface-primary"),onClick:()=>{e.onSelect?.(),t?.(!1)},children:[e.icon,s.jsx("span",{className:"glass-flex-1",children:e.label}),e.shortcut&&s.jsx("span",{className:"glass-text-xs glass-text-secondary",children:e.shortcut})]},e.id))})}):null);l.displayName="LiquidGlassPopoverMenu";try{l.displayName="LiquidGlassPopoverMenu",l.__docgenInfo={description:"",displayName:"LiquidGlassPopoverMenu",props:{open:{defaultValue:null,description:"",name:"open",required:!0,type:{name:"boolean"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"LiquidGlassPopoverMenuItem[]"}},onOpenChange:{defaultValue:null,description:"",name:"onOpenChange",required:!1,type:{name:"((open: boolean) => void) | undefined"}},sourceId:{defaultValue:null,description:"",name:"sourceId",required:!1,type:{name:"string | undefined"}}}}}catch{}const q={title:"Modal/LiquidGlassPopoverMenu",component:l},a={args:{open:!0,items:[{id:"copy",label:"Copy"},{id:"paste",label:"Paste"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    items: [{
      id: "copy",
      label: "Copy"
    }, {
      id: "paste",
      label: "Paste"
    }]
  }
}`,...a.parameters?.docs?.source}}};const b=["Default"];export{a as Default,b as __namedExportsOrder,q as default};
