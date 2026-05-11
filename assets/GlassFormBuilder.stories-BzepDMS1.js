import{G as a}from"./GlassFormBuilder-CsEFxxl0.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CCVHZjui.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DEUjjEUk.js";import"./index-BPOeCqBN.js";import"./LiquidGlassMaterial-CE3NhfG1.js";import"./LiquidGlassLayerProvider-C8_KLYLy.js";import"./a11y-DYpJNAyD.js";import"./GlassPredictiveEngine-BnvkiC0B.js";import"./GlassAchievementSystem-Dn_4VNrl.js";import"./OptimizedGlassCore-D_hfAzIe.js";import"./deviceCapabilities-WGQt4yIJ.js";import"./GlassBiometricAdaptation-DQDXImLm.js";import"./MotionPreferenceContext-CryyGTeI.js";import"./GlassEyeTracking-Bw6bKOhQ.js";import"./GlassSpatialAudio-DmhcDjFY.js";import"./MotionFramer-D3JMoYt9.js";import"./utilsCore-CP_vVdbb.js";import"./GlassInput-BZuB5SMj.js";import"./GlassCard-BvvD5LLt.js";import"./GlassBadge-DMjtiLhS.js";import"./GlassSelect-CA3RkDrZ.js";import"./index-CaoSZhU3.js";import"./index-CANX6d8q.js";import"./index-CWG1rEj-.js";import"./FocusTrap-qpEqJ39j.js";import"./GlassCheckbox-CZsoeF8t.js";import"./minus-C6oflckB.js";import"./createLucideIcon-WuVVelq6.js";import"./check-BwetKDYy.js";import"./GlassTextarea-D5748040.js";import"./circle-alert-DLECpcf8.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
