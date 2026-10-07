import{G as t}from"./GlassFormBuilder-D6Iaiis7.js";import{f as e}from"./index-DdjpOZjl.js";import"./iframe-Cqi-9gHA.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DSUfTc6z.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";import"./GlassInput-DolFnFNQ.js";import"./GlassCard-D12uqCBo.js";import"./GlassBadge-WeCaOIgO.js";import"./GlassSelect-CAwCIbmc.js";import"./index-DMq6o2Ji.js";import"./index-CKGN11qW.js";import"./index-CWG1rEj-.js";import"./FocusTrap-D5qfd9-d.js";import"./GlassCheckbox-LZefLZ7D.js";import"./components-D_brxh8E.js";import"./GlassTextarea-4AmSPuYk.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
