import{G as a}from"./GlassFormBuilder-Cc56v6is.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-LAGStZOr.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CiF6lEMD.js";import"./index-D7SPj1j6.js";import"./LiquidGlassMaterial-DQpzMkZd.js";import"./LiquidGlassLayerProvider-vD8LxwbK.js";import"./a11y-C_KrV_f1.js";import"./GlassPredictiveEngine-DAQdsyWm.js";import"./GlassAchievementSystem-BnhTIUzm.js";import"./OptimizedGlassCore-Jd0dTpF2.js";import"./deviceCapabilities-B9hm0WxX.js";import"./GlassBiometricAdaptation-WKh1enEY.js";import"./MotionPreferenceContext-C7yRy-IY.js";import"./GlassEyeTracking-C5DLjJGe.js";import"./GlassSpatialAudio-BzqwaRwI.js";import"./MotionFramer-Duk6IhfR.js";import"./utilsCore-D2ntLguv.js";import"./GlassInput-q-B2lJvf.js";import"./GlassCard-Mrid0H0B.js";import"./GlassBadge-Cx1BLP8Z.js";import"./GlassSelect-Dpy5m19i.js";import"./index-CLlwQMGz.js";import"./index-z-iJz29G.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CIZFRgYI.js";import"./GlassCheckbox-DVYAy-VQ.js";import"./minus-Cug5zyWy.js";import"./createLucideIcon-BTlQ4bxp.js";import"./check-Pmd-wtQp.js";import"./GlassTextarea-DgsDI1dT.js";import"./circle-alert-CsLhzo6X.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
