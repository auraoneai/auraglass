import{G as a}from"./GlassFormBuilder-Dn-eIljY.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CXbhLBXA.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DqfAw9yt.js";import"./index-C4dy-78K.js";import"./LiquidGlassMaterial-DmLZCyOG.js";import"./LiquidGlassLayerProvider-6tyztJ16.js";import"./a11y-BJgrmYZ-.js";import"./GlassPredictiveEngine-UWtFxNpt.js";import"./GlassAchievementSystem--g6lt073.js";import"./OptimizedGlassCore-ClSJuy9q.js";import"./deviceCapabilities-BiQAPMnE.js";import"./GlassBiometricAdaptation-CVQyWdUN.js";import"./MotionPreferenceContext-DS5tUD5P.js";import"./GlassEyeTracking-DZ1OMKL8.js";import"./GlassSpatialAudio-CVfAtkkI.js";import"./MotionFramer-C32WALOd.js";import"./utilsCore-qPq2jRlE.js";import"./GlassInput-P6oEfz_Z.js";import"./GlassCard-BDAtHI3W.js";import"./GlassBadge-CtSIc0gj.js";import"./GlassSelect-BjyuXfV2.js";import"./index-kz6NtaXz.js";import"./index-DCvrWHG6.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DP3VxYo5.js";import"./GlassCheckbox-g1G_dYx3.js";import"./minus-Bwrn1anc.js";import"./createLucideIcon-5X2vFipY.js";import"./check-CzDXrFcq.js";import"./GlassTextarea-BI2W-4pJ.js";import"./circle-alert-Bx10tOx-.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
