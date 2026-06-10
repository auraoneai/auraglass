import{G as t}from"./GlassFormBuilder-B3AW7lOC.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BjV92FSR.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Ckai86nv.js";import"./LiquidGlassMaterial-Bj4PBC7I.js";import"./LiquidGlassLayerProvider-Cq7ycL3s.js";import"./a11y-kNhoBw9e.js";import"./GlassPredictiveEngine-DZFJo3D3.js";import"./GlassAchievementSystem-Dus2-krE.js";import"./OptimizedGlassCore-Bqu41MF1.js";import"./deviceCapabilities-ClwxliFj.js";import"./GlassBiometricAdaptation-Eovjk73q.js";import"./MotionPreferenceContext-BG4aCwj4.js";import"./GlassEyeTracking-D4ifIfW6.js";import"./GlassSpatialAudio-DKz9F0lE.js";import"./MotionFramer-BZnRhQt9.js";import"./utilsCore-Azu7rNdH.js";import"./GlassInput-C810WblG.js";import"./GlassCard-0UFIh9hL.js";import"./GlassBadge-Ck7m31Fh.js";import"./GlassSelect-B5tJ_bhE.js";import"./index-Br0-9lcc.js";import"./index-BGmAQMF3.js";import"./index-CWG1rEj-.js";import"./FocusTrap-Bz2jTU8_.js";import"./GlassCheckbox-EyIfK6ax.js";import"./components-iAsFx0-_.js";import"./GlassTextarea-DshhnEJR.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
