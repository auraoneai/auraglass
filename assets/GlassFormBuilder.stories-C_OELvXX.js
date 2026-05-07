import{G as a}from"./GlassFormBuilder-DVuf0yWI.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-C1j_9pGm.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DkcqNLpM.js";import"./index-BHYlK66i.js";import"./LiquidGlassMaterial-BfOIzeQM.js";import"./LiquidGlassLayerProvider-CRD6ea23.js";import"./a11y-DqIQidVG.js";import"./GlassPredictiveEngine-D7TA3Ph8.js";import"./GlassAchievementSystem-DGJv5RbB.js";import"./OptimizedGlassCore-fs4nsz79.js";import"./deviceCapabilities-BHvtgRvM.js";import"./GlassBiometricAdaptation-Cdkb9XAh.js";import"./MotionPreferenceContext-HBw8OzFx.js";import"./GlassEyeTracking-DElS-_jN.js";import"./GlassSpatialAudio-FEy3Zs_i.js";import"./MotionFramer-JM_agJcB.js";import"./utilsCore-MhQK04QN.js";import"./GlassInput-FIhBfD9T.js";import"./GlassCard-D8D1Bkmw.js";import"./GlassBadge-f7LtYZ-2.js";import"./GlassSelect-ClvUYRUB.js";import"./index-BaVsQwvw.js";import"./index-BCoTMamu.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BHujWsQ_.js";import"./GlassCheckbox-C_4x7JgP.js";import"./minus-BxQWxgMT.js";import"./createLucideIcon-BFlZd7Ja.js";import"./check-DdKzWiZM.js";import"./GlassTextarea-CYpv1bpP.js";import"./circle-alert-BMZD9Dy8.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
