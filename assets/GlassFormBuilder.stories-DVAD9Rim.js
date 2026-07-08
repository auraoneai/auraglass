import{G as t}from"./GlassFormBuilder-CbAo_pMO.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-D8J9cnFR.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-1P9SsgLg.js";import"./LiquidGlassMaterial-N29uaRee.js";import"./LiquidGlassLayerProvider-Bg7NchGG.js";import"./a11y-CN6sYyZZ.js";import"./GlassPredictiveEngine-CRHU8bMs.js";import"./GlassAchievementSystem-OdHrgbZq.js";import"./OptimizedGlassCore-BnRS7lWr.js";import"./deviceCapabilities-D-Vbq3pm.js";import"./GlassBiometricAdaptation-81QP0afS.js";import"./MotionPreferenceContext-D_H4P3UO.js";import"./GlassEyeTracking-C2h--eCT.js";import"./GlassSpatialAudio-oPG4enbv.js";import"./MotionFramer-BPZ4j4Tf.js";import"./utilsCore-DvvNjYyo.js";import"./GlassInput-DVq25yp_.js";import"./GlassCard-BFDenqX8.js";import"./GlassBadge-B47jCmHx.js";import"./GlassSelect-DTBgfQ-0.js";import"./index-DRm0RNRL.js";import"./index-OaeH0KkL.js";import"./index-CWG1rEj-.js";import"./FocusTrap--oGARDez.js";import"./GlassCheckbox-6zPkdUjm.js";import"./components-DA1Uo_xs.js";import"./GlassTextarea-BI6U9n9e.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
