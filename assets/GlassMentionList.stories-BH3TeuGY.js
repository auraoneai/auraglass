import{j as e,c}from"./iframe-mbNquNNc.js";import{O as d}from"./OptimizedGlassCore-CPvpl-y1.js";import{f as r}from"./index-CLSxArU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";function l({items:t=[],onSelect:o=()=>{},className:m}){const i=Array.isArray(t)?t:[];return e.jsx(d,{"data-glass-component":!0,elevation:"level2",className:c("glass-radius-lg glass-p-1 border border-white/15",m),children:e.jsx("ul",{className:"glass-max-h-60 glass-overflow-auto",children:i.length===0?e.jsx("li",{className:"glass-text-sm glass-text-secondary glass-py-3 glass-text-center",children:"No mentions available."}):i.map(a=>e.jsx("li",{children:e.jsxs("button",{onClick:()=>o(a.id),className:"glass-w-full glass-text-left glass-px-3 glass-py-2 glass-radius-md hover:glass-surface-subtle/10 glass-focus glass-touch-target",children:[e.jsx("div",{className:"glass-text-sm glass-text-primary",children:a.label}),a.meta&&e.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:a.meta})]})},a.id))})})}try{l.displayName="GlassMentionList",l.__docgenInfo={description:"",displayName:"GlassMentionList",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"MentionItem[]"}},onSelect:{defaultValue:{value:"() => {}"},description:"",name:"onSelect",required:!1,type:{name:"(id: string) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const f={title:"Components/Interactive/GlassMentionList",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassmentionlist component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"}},args:{className:""}},s={args:{items:[{id:"1",label:"@john_doe",meta:"John Doe"},{id:"2",label:"@jane_smith",meta:"Jane Smith"},{id:"3",label:"@mike_wilson",meta:"Mike Wilson"}],onSelect:r()}},n={args:{items:[{id:"user1",label:"@alice",meta:"Alice Johnson - Developer"},{id:"user2",label:"@bob",meta:"Bob Smith - Designer"},{id:"user3",label:"@charlie",meta:"Charlie Brown - Manager"},{id:"user4",label:"@diana",meta:"Diana Prince - QA Engineer"}],onSelect:r()}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: '1',
      label: '@john_doe',
      meta: 'John Doe'
    }, {
      id: '2',
      label: '@jane_smith',
      meta: 'Jane Smith'
    }, {
      id: '3',
      label: '@mike_wilson',
      meta: 'Mike Wilson'
    }],
    onSelect: fn()
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: 'user1',
      label: '@alice',
      meta: 'Alice Johnson - Developer'
    }, {
      id: 'user2',
      label: '@bob',
      meta: 'Bob Smith - Designer'
    }, {
      id: 'user3',
      label: '@charlie',
      meta: 'Charlie Brown - Manager'
    }, {
      id: 'user4',
      label: '@diana',
      meta: 'Diana Prince - QA Engineer'
    }],
    onSelect: fn()
  }
}`,...n.parameters?.docs?.source}}};const x=["Default","WithMeta"];export{s as Default,n as WithMeta,x as __namedExportsOrder,f as default};
