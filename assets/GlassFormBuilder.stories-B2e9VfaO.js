import{G as a}from"./GlassFormBuilder-CEklPD48.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-D5XNSE8t.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BOFlydal.js";import"./index-C5YfwLuS.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./a11y-BFAoh2ff.js";import"./GlassPredictiveEngine-z1M3s8P_.js";import"./GlassAchievementSystem-DddBzQgy.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";import"./GlassBiometricAdaptation-CNbD9aRM.js";import"./MotionPreferenceContext-BsYtSTuz.js";import"./GlassEyeTracking-XfaAeBCk.js";import"./GlassSpatialAudio-dtj1_O9L.js";import"./MotionFramer-BJ26b83I.js";import"./utilsCore-BoSRIG9I.js";import"./GlassInput-CQRhgWVw.js";import"./GlassCard-BMR1Sm4j.js";import"./GlassBadge-DxRjjPhy.js";import"./GlassSelect-BTQ8HUGV.js";import"./index-D6EMbww-.js";import"./index-tbKFU_SX.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BmacVBPG.js";import"./GlassCheckbox-Dj6w_Ik9.js";import"./minus-iL0afUhs.js";import"./createLucideIcon-C9kAMw0Q.js";import"./check-DYiTsR9V.js";import"./GlassTextarea-1A6HEzUE.js";import"./circle-alert-Buw0w41z.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
