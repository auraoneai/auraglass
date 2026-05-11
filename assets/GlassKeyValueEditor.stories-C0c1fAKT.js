import{j as t,c as v}from"./iframe-CrdWMSIk.js";import{G as m}from"./GlassButton-lz_wCgCM.js";import{f as u}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DKmh9zBI.js";import"./LiquidGlassMaterial-YBLuTURd.js";import"./LiquidGlassLayerProvider-BhQt7x6P.js";import"./a11y-C6c8VL3n.js";import"./GlassPredictiveEngine-BhHh5Egl.js";import"./GlassAchievementSystem-CE07MKXS.js";import"./OptimizedGlassCore-BMxL0Y3X.js";import"./deviceCapabilities-ClxBxKMX.js";import"./GlassBiometricAdaptation-DQiz_XaC.js";import"./MotionPreferenceContext-DKjHjyas.js";import"./GlassEyeTracking-DFFnPhoi.js";import"./GlassSpatialAudio-Dx1K3ePa.js";import"./MotionFramer-tOJilvcO.js";import"./utilsCore-CKkXzodi.js";import"./index-ByImX2pa.js";function i({value:r,onChange:n,className:c,"data-testid":d}){const p=(s,e)=>{const a=r.slice();a[s]={...a[s],...e},n(a)},g=()=>n([...r,{key:"",value:""}]),y=s=>n(r.filter((e,a)=>a!==s));return t.jsxs("div",{"data-glass-component":!0,className:v("glass-gap-2",c),role:"group","aria-label":"Key-value pair editor","data-testid":d||"glasskeyvalueeditor",children:[r.map((s,e)=>t.jsxs("div",{className:"glass-flex glass-gap-2",role:"group","aria-label":`Key-value pair ${e+1}`,children:[t.jsx("input",{value:s.key,onChange:a=>p(e,{key:a.target.value}),placeholder:"Key","aria-label":`Key for pair ${e+1}`,className:"glass-flex-1 glass-bg-transparent glass-border glass-border-white/20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none glass-focus glass-touch-target glass-contrast-guard"}),t.jsx("input",{value:s.value,onChange:a=>p(e,{value:a.target.value}),placeholder:"Value","aria-label":`Value for pair ${e+1}`,className:"glass-flex-1 glass-bg-transparent glass-border glass-border-white/20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none glass-focus glass-touch-target glass-contrast-guard"}),t.jsx(m,{size:"sm",variant:"ghost",onClick:a=>y(e),"aria-label":`Remove pair ${e+1}`,className:"glass-focus glass-touch-target",children:"Remove"})]},e)),t.jsx(m,{size:"sm",variant:"secondary",onClick:g,"aria-label":"Add new key-value pair",className:"glass-focus glass-touch-target",children:"Add"})]})}try{i.displayName="GlassKeyValueEditor",i.__docgenInfo={description:"",displayName:"GlassKeyValueEditor",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"Pair[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(pairs: Pair[]) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const J={title:"Workflows/Glass Key Value Editor",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasskeyvalueeditor component."}}},argTypes:{value:{control:"object",description:"Array of key-value pairs"},className:{control:"text",description:"Additional CSS class"}},args:{value:[{key:"name",value:"John Doe"},{key:"email",value:"john@example.com"},{key:"role",value:"developer"}],className:"",onChange:u()}},l={args:{value:[{key:"title",value:"Sample Document"},{key:"author",value:"Jane Smith"}],onChange:u()}},o={args:{value:[{key:"api_key",value:"sk-1234567890"},{key:"endpoint",value:"https://api.example.com"},{key:"timeout",value:"5000"},{key:"retries",value:"3"}],onChange:u()}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: [{
      key: 'title',
      value: 'Sample Document'
    }, {
      key: 'author',
      value: 'Jane Smith'
    }],
    onChange: fn()
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: [{
      key: 'api_key',
      value: 'sk-1234567890'
    }, {
      key: 'endpoint',
      value: 'https://api.example.com'
    }, {
      key: 'timeout',
      value: '5000'
    }, {
      key: 'retries',
      value: '3'
    }],
    onChange: fn()
  }
}`,...o.parameters?.docs?.source}}};const R=["Default","Variants"];export{l as Default,o as Variants,R as __namedExportsOrder,J as default};
