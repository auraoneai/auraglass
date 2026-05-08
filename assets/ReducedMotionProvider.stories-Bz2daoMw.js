import{r as c,M as u,D as m,j as d,an as l,R as p}from"./iframe-DyzGTO6j.js";import"./preload-helper-PPVm8Dsz.js";function v({children:t,isValidProp:o,...e}){o&&l(o),e={...c.useContext(u),...e},e.isStatic=m(()=>e.isStatic);const r=c.useMemo(()=>e,[JSON.stringify(e.transition),e.transformPagePoint,e.reducedMotion]);return d.jsx(u.Provider,{value:r,children:t})}function i({children:t}){const[o,e]=p.useState(!1);return p.useEffect(()=>{if(typeof window>"u"||!("matchMedia"in window))return;const r=window.matchMedia("(prefers-reduced-motion: reduce)"),a=()=>e(!!r.matches);return a(),"addEventListener"in r?(r.addEventListener("change",a),()=>r.removeEventListener("change",a)):(r.addListener(a),()=>r.removeListener(a))},[]),d.jsx(v,{reducedMotion:o?"always":"never",children:t})}try{i.displayName="ReducedMotionProvider",i.__docgenInfo={description:"",displayName:"ReducedMotionProvider",props:{}}}catch{}const g={title:"Foundations/Liquid Glass Primitives/Reduced Motion Provider",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism reducedmotionprovider component."}}},argTypes:{},args:{}},s={args:{}},n={render:t=>d.jsx("div",{className:"flex flex-wrap gap-4",children:d.jsx(i,{...t,children:"Default"})}),args:{}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="flex flex-wrap gap-4">
      <ReducedMotionProvider {...args}>
        Default
      </ReducedMotionProvider>
    </div>,
  args: {}
}`,...n.parameters?.docs?.source}}};const M=["Default","Variants"];export{s as Default,n as Variants,M as __namedExportsOrder,g as default};
