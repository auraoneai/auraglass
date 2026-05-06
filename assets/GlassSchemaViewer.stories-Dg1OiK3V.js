import{j as t,c as o}from"./iframe-DpweptvF.js";import{G as c}from"./GlassJSONViewer-CpEr_16f.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-UOg4NIOz.js";function r({schema:e,className:n}){return t.jsx(c,{value:e,className:o("glass-schema-viewer",n)})}try{r.displayName="GlassSchemaViewer",r.__docgenInfo={description:"",displayName:"GlassSchemaViewer",props:{schema:{defaultValue:null,description:"",name:"schema",required:!0,type:{name:"unknown"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const d={title:"Components/Data-display/GlassSchemaViewer",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassschemaviewer component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},a={args:{schema:{type:"object",properties:{name:{type:"string"},age:{type:"number"},active:{type:"boolean"}},required:["name"]}}},s={render:e=>t.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:t.jsx(r,{...e})}),args:{schema:{type:"string",format:"email"}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const g=["Default","Variants"];export{a as Default,s as Variants,g as __namedExportsOrder,d as default};
