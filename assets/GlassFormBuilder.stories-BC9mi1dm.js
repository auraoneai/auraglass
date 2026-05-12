import{G as a}from"./GlassFormBuilder-SC2YqC6g.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-B_p7zla-.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BLOvqXGF.js";import"./index-CGSQAKf9.js";import"./LiquidGlassMaterial-C_6TtWno.js";import"./LiquidGlassLayerProvider-C-9aZbrB.js";import"./a11y-Js05jiIh.js";import"./GlassPredictiveEngine-D6Iw_Zo5.js";import"./GlassAchievementSystem-CjoOxvts.js";import"./OptimizedGlassCore-DOcR6zy-.js";import"./deviceCapabilities-BJ_x-v1T.js";import"./GlassBiometricAdaptation-D1X16vNJ.js";import"./MotionPreferenceContext-BpYLW5VW.js";import"./GlassEyeTracking-1XHT9Ucr.js";import"./GlassSpatialAudio-N4RyGCEL.js";import"./MotionFramer-o4e46iWo.js";import"./utilsCore-8IEQIJNb.js";import"./GlassInput-C_xhIFK9.js";import"./GlassCard-nwPAfeoz.js";import"./GlassBadge-zJZC29Zt.js";import"./GlassSelect-N41HpfqW.js";import"./index-DsnF2oWs.js";import"./index-l90La_Xh.js";import"./index-CWG1rEj-.js";import"./FocusTrap-JQoZyR2t.js";import"./GlassCheckbox-CLi2EHpm.js";import"./minus-2c0Ax6xN.js";import"./createLucideIcon-D6fqlqMf.js";import"./check-CXS1Xxcf.js";import"./GlassTextarea-AdKW_G6j.js";import"./circle-alert-BEdVFR22.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
