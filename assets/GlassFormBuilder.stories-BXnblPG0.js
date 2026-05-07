import{G as a}from"./GlassFormBuilder-BhJxDsYH.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BJUPYBdj.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B47sqpMX.js";import"./index-CVvdFpfh.js";import"./LiquidGlassMaterial-BudbaD-0.js";import"./LiquidGlassLayerProvider-BOlOA680.js";import"./a11y-Cl5jzkbw.js";import"./GlassPredictiveEngine-yiru1Zak.js";import"./GlassAchievementSystem-BNWOa4S7.js";import"./OptimizedGlassCore-n2ERVMDY.js";import"./deviceCapabilities-C60oOEa3.js";import"./GlassBiometricAdaptation-CF628xeO.js";import"./MotionPreferenceContext-dbV6fYo1.js";import"./GlassEyeTracking-CJYTwkOd.js";import"./GlassSpatialAudio-BUzWn3vB.js";import"./MotionFramer-DEr7b4H0.js";import"./utilsCore-Djkk-eL4.js";import"./GlassInput-B-WD-qCb.js";import"./GlassCard-DUXQaFKk.js";import"./GlassBadge-Cn3P2Szn.js";import"./GlassSelect-EuxFj0A3.js";import"./index-BuAR_Blr.js";import"./index-DLLPdt5a.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BujE8fOK.js";import"./GlassCheckbox-u4u8pBeL.js";import"./minus-Bw-t1REt.js";import"./createLucideIcon-BZQYpAY8.js";import"./check-CptAwXOn.js";import"./GlassTextarea-D5z1YKxC.js";import"./circle-alert-CusPIf_r.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
