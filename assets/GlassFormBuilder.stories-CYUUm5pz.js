import{G as a}from"./GlassFormBuilder-Cjc0MrbW.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-LB2Lfhgp.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BB_LiVtS.js";import"./index-DCQcgPGK.js";import"./LiquidGlassMaterial-O4aHTI2D.js";import"./LiquidGlassLayerProvider-DEWz-jJN.js";import"./a11y-DBdyTOMI.js";import"./GlassPredictiveEngine-nHzYrt40.js";import"./GlassAchievementSystem-C7yLUSqC.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./GlassBiometricAdaptation-CUjpLWNp.js";import"./MotionPreferenceContext-CGVERj_F.js";import"./GlassEyeTracking-d4dXQVzJ.js";import"./GlassSpatialAudio-Cjoio7Yg.js";import"./MotionFramer-CR_bXaKW.js";import"./utilsCore-iKIe4RkQ.js";import"./GlassInput-DEM96GjC.js";import"./GlassCard-Dx6dpAL0.js";import"./GlassBadge-ByIXsep2.js";import"./GlassSelect-B0MzWQDh.js";import"./index-DocRrnvy.js";import"./index-AxGEKaZC.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DbeTyZk9.js";import"./GlassCheckbox-Dz0sBjrs.js";import"./minus-BAR7aAa2.js";import"./createLucideIcon-CKdMI_TB.js";import"./check-ZMEdlm5i.js";import"./GlassTextarea-DArPYlwY.js";import"./circle-alert-DKAjFm44.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
