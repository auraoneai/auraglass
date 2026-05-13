import{G as a}from"./GlassFormBuilder-C9aPUyb9.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CWR0-zUi.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-SHcvRa7W.js";import"./index-gJPcExbB.js";import"./LiquidGlassMaterial-C3sWBx_W.js";import"./LiquidGlassLayerProvider-CP44SBEZ.js";import"./a11y-DSISWsBF.js";import"./GlassPredictiveEngine-Cif37kog.js";import"./GlassAchievementSystem-B4pUY0Vz.js";import"./OptimizedGlassCore-BBTk9mqX.js";import"./deviceCapabilities-D9RQ8fuG.js";import"./GlassBiometricAdaptation-CTzLEBN3.js";import"./MotionPreferenceContext-9ity8rND.js";import"./GlassEyeTracking-CvSiy76D.js";import"./GlassSpatialAudio-uINrNyo9.js";import"./MotionFramer-uOc5z-wd.js";import"./utilsCore-jGV8p3MB.js";import"./GlassInput-CjhmLNiC.js";import"./GlassCard-D3Kh_OCQ.js";import"./GlassBadge-B4XgifAi.js";import"./GlassSelect-x8YAt4qB.js";import"./index-C1oS_zLM.js";import"./index-GKY0G1UR.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DVyWW30S.js";import"./GlassCheckbox-DIAu1rgo.js";import"./minus-GwdCF5lU.js";import"./createLucideIcon-BQVzcqpb.js";import"./check-BQmuE4lq.js";import"./GlassTextarea-C-qV8TbL.js";import"./circle-alert-CowtMZZK.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
