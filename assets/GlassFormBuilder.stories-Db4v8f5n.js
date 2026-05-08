import{G as a}from"./GlassFormBuilder-C8kK5LX5.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DyzGTO6j.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BrJRrsri.js";import"./index-Bb1xwjPN.js";import"./LiquidGlassMaterial-CWkqPUkP.js";import"./LiquidGlassLayerProvider-B2La73T1.js";import"./a11y-D_lkiUOl.js";import"./GlassPredictiveEngine-NVfzhScj.js";import"./GlassAchievementSystem-CoiXhaON.js";import"./OptimizedGlassCore-Dz0CoTUd.js";import"./deviceCapabilities-Cly_GjbT.js";import"./GlassBiometricAdaptation-Boags1Ct.js";import"./MotionPreferenceContext-4xWPoQ-i.js";import"./GlassEyeTracking-DPTFm0rv.js";import"./GlassSpatialAudio-D0NYCka6.js";import"./MotionFramer-yZPRa-tO.js";import"./utilsCore-CvH3yKBE.js";import"./GlassInput-XdOtqnrN.js";import"./GlassCard-DU-39p04.js";import"./GlassBadge-COvOW1aG.js";import"./GlassSelect-Chi4DUHL.js";import"./index-DzzPrrT9.js";import"./index-IUpzSKra.js";import"./index-CWG1rEj-.js";import"./FocusTrap-FIRr2h0Q.js";import"./GlassCheckbox-BmEbN54p.js";import"./minus-D3oWhs3y.js";import"./createLucideIcon-BZG7jVWE.js";import"./check-BG3Lvwn4.js";import"./GlassTextarea-Do7EZIIG.js";import"./circle-alert-Dpu9XSbb.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
