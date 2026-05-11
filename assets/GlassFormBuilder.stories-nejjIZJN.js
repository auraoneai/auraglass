import{G as a}from"./GlassFormBuilder-C5ad3Rwi.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CrdWMSIk.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-lz_wCgCM.js";import"./index-DKmh9zBI.js";import"./LiquidGlassMaterial-YBLuTURd.js";import"./LiquidGlassLayerProvider-BhQt7x6P.js";import"./a11y-C6c8VL3n.js";import"./GlassPredictiveEngine-BhHh5Egl.js";import"./GlassAchievementSystem-CE07MKXS.js";import"./OptimizedGlassCore-BMxL0Y3X.js";import"./deviceCapabilities-ClxBxKMX.js";import"./GlassBiometricAdaptation-DQiz_XaC.js";import"./MotionPreferenceContext-DKjHjyas.js";import"./GlassEyeTracking-DFFnPhoi.js";import"./GlassSpatialAudio-Dx1K3ePa.js";import"./MotionFramer-tOJilvcO.js";import"./utilsCore-CKkXzodi.js";import"./GlassInput-D0-JzVI2.js";import"./GlassCard-D1MmOaI8.js";import"./GlassBadge-CtMwkLub.js";import"./GlassSelect-DLGxfKjV.js";import"./index-BThHWg8-.js";import"./index-DJYgZg8N.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DojZqQFx.js";import"./GlassCheckbox-DekrdDWy.js";import"./minus-CM7hb7-T.js";import"./createLucideIcon-r_pQPiZy.js";import"./check-V8TagGO9.js";import"./GlassTextarea-DK4sqKuk.js";import"./circle-alert-DQheRjkE.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
