import{G as t}from"./GlassFormBuilder-dPCgBdLO.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DJTDWGSM.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CFOPNBlh.js";import"./LiquidGlassMaterial-BDlO_OyN.js";import"./LiquidGlassLayerProvider-BRaptNEr.js";import"./a11y-CN2zrjbV.js";import"./GlassPredictiveEngine-CZNAritT.js";import"./GlassAchievementSystem-CNfBhcWc.js";import"./OptimizedGlassCore-CauEN3Nh.js";import"./deviceCapabilities-C53zky6h.js";import"./GlassBiometricAdaptation-C2BI1ESi.js";import"./MotionPreferenceContext-C897q-Ib.js";import"./GlassEyeTracking-8IyxWeiK.js";import"./GlassSpatialAudio-CjN6ukMY.js";import"./MotionFramer-DmYp_Rjk.js";import"./utilsCore-B-Ktf6tF.js";import"./GlassInput-BItmdS5G.js";import"./GlassCard-DIqkmIqX.js";import"./GlassBadge-CErdJt7Z.js";import"./GlassSelect-B4bbWNXT.js";import"./index-6kNETpeQ.js";import"./index-DRaLwg9T.js";import"./index-CWG1rEj-.js";import"./FocusTrap-B4qYrf9J.js";import"./GlassCheckbox-DYQ-gw8l.js";import"./components-CZhTaBZP.js";import"./GlassTextarea-BViF2XuE.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
