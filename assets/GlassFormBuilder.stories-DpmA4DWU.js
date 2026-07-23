import{G as t}from"./GlassFormBuilder-CEOQgSis.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CdDNbo2v.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DMsLvuTk.js";import"./LiquidGlassMaterial-C7L_XzpE.js";import"./LiquidGlassLayerProvider-BmiLcxa3.js";import"./a11y-B__vCKol.js";import"./GlassPredictiveEngine-DK146jr5.js";import"./GlassAchievementSystem-k4lcNpEq.js";import"./OptimizedGlassCore-B1nsxF3j.js";import"./deviceCapabilities-CLkD7xxk.js";import"./GlassBiometricAdaptation-QCTxnhMN.js";import"./MotionPreferenceContext-mBLTPWGH.js";import"./GlassEyeTracking-DWqe5kEa.js";import"./GlassSpatialAudio-DMiQlRWH.js";import"./MotionFramer-BwSk7qC9.js";import"./utilsCore-DlqMbNDW.js";import"./GlassInput-wHUD5Igo.js";import"./GlassCard-BLrXR5FH.js";import"./GlassBadge-BMGSZfSK.js";import"./GlassSelect-nsH6GnLP.js";import"./index-Cwg7vXVD.js";import"./index-BC4xlbtd.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BMvFSzB7.js";import"./GlassCheckbox-YFNTDHcy.js";import"./components-Blpg7iwI.js";import"./GlassTextarea-6a1Dd9Kj.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
