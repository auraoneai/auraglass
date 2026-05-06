import{r as c,M as u,K as m,j as d,ay as l,R as p}from"./iframe-rcK9Xf1b.js";import"./preload-helper-PPVm8Dsz.js";function f({children:t,isValidProp:a,...e}){a&&l(a),e={...c.useContext(u),...e},e.isStatic=m(()=>e.isStatic);const r=c.useMemo(()=>e,[JSON.stringify(e.transition),e.transformPagePoint,e.reducedMotion]);return d.jsx(u.Provider,{value:r,children:t})}function i({children:t}){const[a,e]=p.useState(!1);return p.useEffect(()=>{if(typeof window>"u"||!("matchMedia"in window))return;const r=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>e(!!r.matches);return o(),"addEventListener"in r?(r.addEventListener("change",o),()=>r.removeEventListener("change",o)):(r.addListener(o),()=>r.removeListener(o))},[]),d.jsx(f,{reducedMotion:a?"always":"never",children:t})}try{i.displayName="ReducedMotionProvider",i.__docgenInfo={description:"",displayName:"ReducedMotionProvider",props:{}}}catch{}const M={title:"Components/Motion/ReducedMotionProvider",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism reducedmotionprovider component."}}},argTypes:{},args:{}},n={args:{}},s={render:t=>d.jsx("div",{className:"flex flex-wrap gap-4",children:d.jsx(i,{...t,children:"Default"})}),args:{}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="flex flex-wrap gap-4">
      <ReducedMotionProvider {...args}>
        Default
      </ReducedMotionProvider>
    </div>,
  args: {}
}`,...s.parameters?.docs?.source}}};const g=["Default","Variants"];export{n as Default,s as Variants,g as __namedExportsOrder,M as default};
