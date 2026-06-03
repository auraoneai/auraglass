import{G as t}from"./GlassFormBuilder-D0tUYuaP.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DF7JlHBi.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BIvV8-nn.js";import"./LiquidGlassMaterial-DZYWnIAi.js";import"./LiquidGlassLayerProvider-0rLb3aaI.js";import"./a11y-egZXdQg2.js";import"./GlassPredictiveEngine-BTHlyAlp.js";import"./GlassAchievementSystem-kvhxzrx-.js";import"./OptimizedGlassCore-VCnDPWfd.js";import"./deviceCapabilities-D3MTg8N7.js";import"./GlassBiometricAdaptation-DhRhUqeW.js";import"./MotionPreferenceContext-DQEYfbeE.js";import"./GlassEyeTracking-MD4PB_mw.js";import"./GlassSpatialAudio-CV8zw3YG.js";import"./MotionFramer-BGWcUap_.js";import"./utilsCore-0EWueBob.js";import"./GlassInput-C5f44O-R.js";import"./GlassCard-4bp1FAbe.js";import"./GlassBadge-XmpfcBx7.js";import"./GlassSelect-U7Nb3M5E.js";import"./index-vdP4qRYE.js";import"./index-BaFrNfaE.js";import"./index-CWG1rEj-.js";import"./FocusTrap-D1-6EZ7S.js";import"./GlassCheckbox-Cq5CZth3.js";import"./components-DQLjE6VH.js";import"./GlassTextarea-DHQ9PUIx.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
