import{j as n,c}from"./iframe-ChjdpTMc.js";import{G as l}from"./GlassJSONViewer-KZ2FVDTx.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-DN1SoNCt.js";import"./deviceCapabilities-CmFcsI28.js";function r({schema:e,className:t,compact:i,contained:o,maxHeight:m}){return n.jsx(l,{value:e,className:c("glass-schema-viewer",t),compact:i,contained:o,maxHeight:m})}try{r.displayName="GlassSchemaViewer",r.__docgenInfo={description:"",displayName:"GlassSchemaViewer",props:{schema:{defaultValue:null,description:"",name:"schema",required:!0,type:{name:"unknown"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},compact:{defaultValue:null,description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:null,description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const y={title:"Data + Visualization/Glass Schema Viewer",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassschemaviewer component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},a={args:{schema:{type:"object",properties:{name:{type:"string"},age:{type:"number"},active:{type:"boolean"}},required:["name"]}}},s={render:e=>n.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:n.jsx(r,{...e})}),args:{schema:{type:"string",format:"email"}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        age: {
          type: 'number'
        },
        active: {
          type: 'boolean'
        }
      },
      required: ['name']
    }
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassSchemaViewer {...args} />
    </div>,
  args: {
    schema: {
      type: 'string',
      format: 'email'
    }
  }
}`,...s.parameters?.docs?.source}}};const h=["Default","Variants"];export{a as Default,s as Variants,h as __namedExportsOrder,y as default};
