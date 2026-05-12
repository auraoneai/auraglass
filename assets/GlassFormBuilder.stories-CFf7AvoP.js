import{G as a}from"./GlassFormBuilder-x-ZsjVUf.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BvzymGjt.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BVHfBqfh.js";import"./index-JwCOk9wq.js";import"./LiquidGlassMaterial-JI_jzYet.js";import"./LiquidGlassLayerProvider-CJtka88e.js";import"./a11y-DPdpkR3m.js";import"./GlassPredictiveEngine-Dz7LnWwV.js";import"./GlassAchievementSystem-CKBD-Gym.js";import"./OptimizedGlassCore-B02J0fwe.js";import"./deviceCapabilities-B7YDzcww.js";import"./GlassBiometricAdaptation-D9YF3poe.js";import"./MotionPreferenceContext-DOLWeM-v.js";import"./GlassEyeTracking-D9jSxkg9.js";import"./GlassSpatialAudio-DHSENIRo.js";import"./MotionFramer-C3KXdYVW.js";import"./utilsCore-CvMw9IQa.js";import"./GlassInput-BlBLQvFV.js";import"./GlassCard-Cxta_oc2.js";import"./GlassBadge-CPq0Smf-.js";import"./GlassSelect-BvNj8QB8.js";import"./index-CLw__QYq.js";import"./index-D0gTu_Kq.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DqLy_MM6.js";import"./GlassCheckbox-OrYNa-Az.js";import"./minus-Be4nRCV9.js";import"./createLucideIcon-BO6DqFNW.js";import"./check-BIAe6cpq.js";import"./GlassTextarea-B7fDjV1X.js";import"./circle-alert-Ecsu1L1J.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
