import{r as i,j as o,c as f}from"./iframe-DpweptvF.js";import{f as c}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const r=i.forwardRef(({targetRect:e,onClose:p,className:d,children:m,padding:t=8,...u},g)=>{const n=i.useMemo(()=>{if(e)return{position:"absolute",left:e.left-t,top:e.top-t,width:e.width+t*2,height:e.height+t*2,borderRadius:12,boxShadow:"0 0 0 9999px var(--glass-text-tertiary-dark)",pointerEvents:"none"}},[e,t]),l=n?{...n}:void 0;return o.jsxs("div",{ref:g,"data-glass-component":!0,className:f("fixed inset-0",d),style:{background:e?"transparent":"linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.85))"},onClick:p,...u,children:[l?o.jsx("div",{style:{...l}}):o.jsx("span",{className:"glass-sr-only",children:"Glass spotlight inactive"}),m]})});r.displayName="GlassSpotlight";try{r.displayName="GlassSpotlight",r.__docgenInfo={description:"",displayName:"GlassSpotlight",props:{targetRect:{defaultValue:null,description:"",name:"targetRect",required:!1,type:{name:"DOMRect | null | undefined"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void) | undefined"}},padding:{defaultValue:{value:"8"},description:"",name:"padding",required:!1,type:{name:"number | undefined"}}}}}catch{}const S={title:"Components/Interactive/GlassSpotlight",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassspotlight component."}}},argTypes:{},args:{}},s={args:{targetRect:new DOMRect(100,100,200,100),onClose:c()}},a={args:{targetRect:new DOMRect(50,50,300,200),onClose:c()}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    targetRect: new DOMRect(100, 100, 200, 100),
    onClose: fn()
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    targetRect: new DOMRect(50, 50, 300, 200),
    onClose: fn()
  }
}`,...a.parameters?.docs?.source}}};const _=["Default","LargeTarget"];export{s as Default,a as LargeTarget,_ as __namedExportsOrder,S as default};
