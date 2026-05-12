import{G as a}from"./GlassFormBuilder-B2EFKGnp.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BVJcMDDP.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-gi-rDkpT.js";import"./index-BeHrpr1h.js";import"./LiquidGlassMaterial-CL6ROdeZ.js";import"./LiquidGlassLayerProvider-D2JFf6sb.js";import"./a11y-BlwVq89o.js";import"./GlassPredictiveEngine-D4mTpLSA.js";import"./GlassAchievementSystem-CXirgsU1.js";import"./OptimizedGlassCore-DzSkF5wV.js";import"./deviceCapabilities-9ai_ldnn.js";import"./GlassBiometricAdaptation-LYqiCYYS.js";import"./MotionPreferenceContext-BKHCntjv.js";import"./GlassEyeTracking-B4vL1R01.js";import"./GlassSpatialAudio-U__Jh808.js";import"./MotionFramer-BKEBzTCi.js";import"./utilsCore-h7axX66k.js";import"./GlassInput-BhWOzWlg.js";import"./GlassCard-CosCQiDS.js";import"./GlassBadge-BMVhYWIk.js";import"./GlassSelect-mo0hZKyH.js";import"./index-B35wRELG.js";import"./index-CuVmYn2u.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BgTkFtv9.js";import"./GlassCheckbox-CpG94abx.js";import"./minus-B1eEmrYz.js";import"./createLucideIcon-DER72wqv.js";import"./check-BxsSd4w8.js";import"./GlassTextarea-CdtRVgBE.js";import"./circle-alert-DzNSVo7A.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
