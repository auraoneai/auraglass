import{G as t}from"./GlassFormBuilder-asGdiJhp.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DuFCckax.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DDzmL2zF.js";import"./LiquidGlassMaterial-Cfs6Tlc8.js";import"./LiquidGlassLayerProvider-5FQsJWNj.js";import"./a11y-BVXyQ8aU.js";import"./GlassPredictiveEngine-Ci4rC9p_.js";import"./GlassAchievementSystem-BEHFsrBx.js";import"./OptimizedGlassCore-Dfu3jw2K.js";import"./deviceCapabilities-8v_R2xci.js";import"./GlassBiometricAdaptation-Bp-PMjOH.js";import"./MotionPreferenceContext-BLXtcDKN.js";import"./GlassEyeTracking-dCkUfXF5.js";import"./GlassSpatialAudio-oo5EQ7tC.js";import"./MotionFramer-1yHy_OeU.js";import"./utilsCore-D4-BhdPx.js";import"./GlassInput-D64At9Ik.js";import"./GlassCard-CNI7Y6tZ.js";import"./GlassBadge-Csrrfua_.js";import"./GlassSelect-BCDcWDWs.js";import"./index-CMj2KvYZ.js";import"./index-YM8pPBh-.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DF3urQpi.js";import"./GlassCheckbox-oGSEsIU1.js";import"./components-C7UdsWPt.js";import"./GlassTextarea-ifO--fCg.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
