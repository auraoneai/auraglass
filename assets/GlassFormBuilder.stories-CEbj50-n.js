import{G as t}from"./GlassFormBuilder-CpM0Egw5.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-Bw8wx5FH.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-_st22fit.js";import"./LiquidGlassMaterial-gpj7kg9O.js";import"./LiquidGlassLayerProvider-6Bj4p4s7.js";import"./a11y-DD0P9UZh.js";import"./GlassPredictiveEngine-DKFPQ6sb.js";import"./GlassAchievementSystem-SWsqpH12.js";import"./OptimizedGlassCore-DoEL-tKT.js";import"./deviceCapabilities-D2nexl3L.js";import"./GlassBiometricAdaptation-B7tlgt7x.js";import"./MotionPreferenceContext-CdF25eQe.js";import"./GlassEyeTracking-qJx-MVs_.js";import"./GlassSpatialAudio-BMxHmmpv.js";import"./MotionFramer-BxtG5_GB.js";import"./utilsCore-DOP4VgMa.js";import"./GlassInput-D8guNALE.js";import"./GlassCard-DRLGXfKD.js";import"./GlassBadge-C0RJhMJn.js";import"./GlassSelect-Dhjaw4nw.js";import"./index-B1CuwWlb.js";import"./index-CP9YasLl.js";import"./index-CWG1rEj-.js";import"./FocusTrap-8LqjrSV9.js";import"./GlassCheckbox-Bg2ewjOt.js";import"./components-B-uBHH10.js";import"./GlassTextarea-h9bIIOcX.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
