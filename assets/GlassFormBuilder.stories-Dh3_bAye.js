import{G as a}from"./GlassFormBuilder-BKSXN2co.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CmCTHNdg.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-exu3jFjl.js";import"./index-CAwN4TlI.js";import"./LiquidGlassMaterial-BVZTL7OE.js";import"./LiquidGlassLayerProvider-CgsufSV2.js";import"./a11y-CGf66_f7.js";import"./GlassPredictiveEngine-CW4UQ2f3.js";import"./GlassAchievementSystem-DRIN5Sx0.js";import"./OptimizedGlassCore-DdRXKYNZ.js";import"./deviceCapabilities-BIzeQ8zU.js";import"./GlassBiometricAdaptation-CHrZGU0g.js";import"./MotionPreferenceContext-LVTuxRrL.js";import"./GlassEyeTracking-Bifz749I.js";import"./GlassSpatialAudio-jWen5KuY.js";import"./MotionFramer-CymAQigi.js";import"./utilsCore-BnC1_gd8.js";import"./GlassInput-BuwEbS1w.js";import"./GlassCard-Nox5okj1.js";import"./GlassBadge-CtpXYBIJ.js";import"./GlassSelect-CpIOsj9r.js";import"./index-CPi5A3pB.js";import"./index-RmsY9fGx.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BMH6US_E.js";import"./GlassCheckbox-Ducciv1Z.js";import"./minus-Bv8n8S3e.js";import"./createLucideIcon-CTGDdcyK.js";import"./check-jr1KsE2j.js";import"./GlassTextarea-DnFYRwKM.js";import"./circle-alert-CeSlmuC_.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
