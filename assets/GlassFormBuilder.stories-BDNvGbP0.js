import{G as t}from"./GlassFormBuilder-4-KqDvaf.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-B8jVgyad.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CDZdZQgw.js";import"./LiquidGlassMaterial-DBWGCkFp.js";import"./LiquidGlassLayerProvider-BxIqF8gm.js";import"./a11y-B5SIjMKz.js";import"./GlassPredictiveEngine-D4VkfBJh.js";import"./GlassAchievementSystem-QtApGBro.js";import"./OptimizedGlassCore-LJ9cg0Vq.js";import"./deviceCapabilities-TeCERPXa.js";import"./GlassBiometricAdaptation-B4feIV0C.js";import"./MotionPreferenceContext-CRbrlShU.js";import"./GlassEyeTracking-Db9epXXL.js";import"./GlassSpatialAudio-BxtB1dwe.js";import"./MotionFramer-B8wcyPsS.js";import"./utilsCore-jJSD4MRq.js";import"./GlassInput-DojxEqrZ.js";import"./GlassCard-D6xHY7S3.js";import"./GlassBadge-DQbnlImA.js";import"./GlassSelect-6xMPbMrI.js";import"./index-B_7OKd1A.js";import"./index-BLx6RbZ7.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CxIARYuo.js";import"./GlassCheckbox-D9VPNsr2.js";import"./components-Dfh6oSUn.js";import"./GlassTextarea-Cvyd-DZn.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    schema: [{
      id: 'contact',
      title: 'Contact Form',
      fields: [{
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      }, {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      }, {
        id: 'subject',
        type: 'select',
        label: 'Subject',
        options: [{
          value: 'general',
          label: 'General Inquiry'
        }, {
          value: 'support',
          label: 'Technical Support'
        }, {
          value: 'sales',
          label: 'Sales'
        }]
      }]
    }],
    values: {},
    onChange: fn(),
    onSubmit: fn()
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    schema: [{
      id: 'personal',
      title: 'Personal Information',
      fields: [{
        id: 'firstName',
        type: 'text',
        label: 'First Name',
        placeholder: 'Enter your first name'
      }, {
        id: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Enter your last name'
      }]
    }],
    values: {},
    variant: 'compact',
    onChange: fn(),
    onSubmit: fn()
  }
}`,...r.parameters?.docs?.source}}};const W=["Default","Variants"];export{a as Default,r as Variants,W as __namedExportsOrder,T as default};
