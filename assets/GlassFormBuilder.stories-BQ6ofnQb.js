import{G as a}from"./GlassFormBuilder-JYMwk3NC.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DMS_w3ti.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-42JbTubC.js";import"./index-CBQBDJcz.js";import"./LiquidGlassMaterial-jc8k7wz5.js";import"./LiquidGlassLayerProvider-Co7xyhx0.js";import"./a11y-C8aSFzaY.js";import"./GlassPredictiveEngine-dl2Ev2_W.js";import"./GlassAchievementSystem-BRuQySjd.js";import"./OptimizedGlassCore-BJl9vDDN.js";import"./deviceCapabilities-BipSAG1R.js";import"./GlassBiometricAdaptation-B6W1s0G5.js";import"./MotionPreferenceContext-CNdW8zji.js";import"./GlassEyeTracking-B6NmTSOF.js";import"./GlassSpatialAudio-B7DGn6o2.js";import"./MotionFramer-ewjBujsI.js";import"./utilsCore-IWfe3uJL.js";import"./GlassInput-Bi5v7RbN.js";import"./GlassCard-CVQcMHxP.js";import"./GlassBadge-b2MXGabQ.js";import"./GlassSelect-QJc7rBcQ.js";import"./index-CAkql3WS.js";import"./index-DYvtz5OR.js";import"./index-CWG1rEj-.js";import"./FocusTrap-9Rff4eRI.js";import"./GlassCheckbox-CHlpVEhz.js";import"./minus-CaFtQzIv.js";import"./createLucideIcon-D5EWqkVJ.js";import"./check-DKo95Jab.js";import"./GlassTextarea-CCZsiIf3.js";import"./circle-alert-CQZG7g7I.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const V=["Default","Variants"];export{r as Default,t as Variants,V as __namedExportsOrder,L as default};
