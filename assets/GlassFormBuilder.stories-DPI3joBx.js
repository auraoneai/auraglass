import{G as t}from"./GlassFormBuilder-B7DFzekt.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CQiUEXfZ.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DSbvhzjk.js";import"./LiquidGlassMaterial-BuQVIKxI.js";import"./LiquidGlassLayerProvider-DIBQAy1s.js";import"./a11y-CWELitJ7.js";import"./GlassPredictiveEngine-D8ktXTqZ.js";import"./GlassAchievementSystem-CWZnJ0tX.js";import"./OptimizedGlassCore-BYr-aADM.js";import"./deviceCapabilities-BZKlD_6o.js";import"./GlassBiometricAdaptation-B632lAs5.js";import"./MotionPreferenceContext-DHDDC9Vp.js";import"./GlassEyeTracking-CX4D70GN.js";import"./GlassSpatialAudio-B-fHx4HN.js";import"./MotionFramer-nvnZL9rJ.js";import"./utilsCore-DKKbiNGL.js";import"./GlassInput-BKN2SBu5.js";import"./GlassCard-Dg6Z4_GP.js";import"./GlassBadge-DXVd0bVp.js";import"./GlassSelect-BxnsEoey.js";import"./index-1pfiFnUQ.js";import"./index-I52c7GhO.js";import"./index-CWG1rEj-.js";import"./FocusTrap-bivAcxMk.js";import"./GlassCheckbox-BgVAC66M.js";import"./components-tJLTaIsp.js";import"./GlassTextarea-BQLJ0fgj.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
