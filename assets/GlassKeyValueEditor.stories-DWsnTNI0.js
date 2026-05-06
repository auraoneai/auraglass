import{j as t,c as v}from"./iframe-DpweptvF.js";import{G as c}from"./GlassButton-CoJjSHnE.js";import{f as u}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DErlfuJO.js";import"./LiquidGlassMaterial-nIJf4szv.js";import"./LiquidGlassLayerProvider-DwkmVtLC.js";import"./GlassPredictiveEngine-CJz8dse6.js";import"./GlassAchievementSystem-DQQoVp6r.js";import"./OptimizedGlassCore-UOg4NIOz.js";import"./GlassBiometricAdaptation-CJofGeVw.js";import"./MotionPreferenceContext-5A7bWbbY.js";import"./GlassEyeTracking-BvBuetm1.js";import"./GlassSpatialAudio-Csw4ezvx.js";import"./MotionFramer-BmJovKMH.js";import"./utilsCore-Diw1ReC2.js";import"./index-ByImX2pa.js";function i({value:r,onChange:n,className:m,"data-testid":d}){const p=(s,e)=>{const a=r.slice();a[s]={...a[s],...e},n(a)},g=()=>n([...r,{key:"",value:""}]),y=s=>n(r.filter((e,a)=>a!==s));return t.jsxs("div",{"data-glass-component":!0,className:v("glass-gap-2",m),role:"group","aria-label":"Key-value pair editor","data-testid":d||"glasskeyvalueeditor",children:[r.map((s,e)=>t.jsxs("div",{className:"glass-flex glass-gap-2",role:"group","aria-label":`Key-value pair ${e+1}`,children:[t.jsx("input",{value:s.key,onChange:a=>p(e,{key:a.target.value}),placeholder:"Key","aria-label":`Key for pair ${e+1}`,className:"glass-flex-1 glass-bg-transparent glass-border glass-border-white/20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none glass-focus glass-touch-target glass-contrast-guard"}),t.jsx("input",{value:s.value,onChange:a=>p(e,{value:a.target.value}),placeholder:"Value","aria-label":`Value for pair ${e+1}`,className:"glass-flex-1 glass-bg-transparent glass-border glass-border-white/20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none glass-focus glass-touch-target glass-contrast-guard"}),t.jsx(c,{size:"sm",variant:"ghost",onClick:a=>y(e),"aria-label":`Remove pair ${e+1}`,className:"glass-focus glass-touch-target",children:"Remove"})]},e)),t.jsx(c,{size:"sm",variant:"secondary",onClick:g,"aria-label":"Add new key-value pair",className:"glass-focus glass-touch-target",children:"Add"})]})}try{i.displayName="GlassKeyValueEditor",i.__docgenInfo={description:"",displayName:"GlassKeyValueEditor",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"Pair[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(pairs: Pair[]) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const $={title:"Components/Interactive/GlassKeyValueEditor",component:i,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasskeyvalueeditor component."}}},argTypes:{value:{control:"object",description:"Array of key-value pairs"},className:{control:"text",description:"Additional CSS class"}},args:{value:[{key:"name",value:"John Doe"},{key:"email",value:"john@example.com"},{key:"role",value:"developer"}],className:"",onChange:u()}},l={args:{value:[{key:"title",value:"Sample Document"},{key:"author",value:"Jane Smith"}],onChange:u()}},o={args:{value:[{key:"api_key",value:"sk-1234567890"},{key:"endpoint",value:"https://api.example.com"},{key:"timeout",value:"5000"},{key:"retries",value:"3"}],onChange:u()}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const w=["Default","Variants"];export{l as Default,o as Variants,w as __namedExportsOrder,$ as default};
