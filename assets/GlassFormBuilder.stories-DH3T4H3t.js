import{G as t}from"./GlassFormBuilder-u8KiHawB.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BM_sOc7A.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CqT0mM7l.js";import"./LiquidGlassMaterial-8l7vVCDT.js";import"./LiquidGlassLayerProvider-Ce5BjS5e.js";import"./a11y-VQT2h4Rd.js";import"./GlassPredictiveEngine-V04fw-l7.js";import"./GlassAchievementSystem-BgFCTwY5.js";import"./OptimizedGlassCore-DmD6mQzK.js";import"./deviceCapabilities-BPdae4Bc.js";import"./GlassBiometricAdaptation-D7lGt8Ft.js";import"./MotionPreferenceContext-BEmfDV7Q.js";import"./GlassEyeTracking-ihXFZsyp.js";import"./GlassSpatialAudio-C3Jz9Yai.js";import"./MotionFramer-DKlRZEdU.js";import"./utilsCore-eEshcNNb.js";import"./GlassInput-D4b08jAT.js";import"./GlassCard-DeJiEUDe.js";import"./GlassBadge-DYqguISE.js";import"./GlassSelect-BU_Li8Rw.js";import"./index-CTTFl-jI.js";import"./index-BQQO54ln.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CXqZiOhZ.js";import"./GlassCheckbox-DPHKyEOg.js";import"./components-Blyv7FvH.js";import"./GlassTextarea-CqVxb4sy.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
