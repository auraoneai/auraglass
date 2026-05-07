import{G as a}from"./GlassFormBuilder-CEiMpJfd.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CToTmdO0.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DSNiUgOn.js";import"./index-BR2f0aCL.js";import"./LiquidGlassMaterial-BG5wKcQI.js";import"./LiquidGlassLayerProvider-CSLyvOJZ.js";import"./a11y-E_E8Udq3.js";import"./GlassPredictiveEngine-fLxX_xo3.js";import"./GlassAchievementSystem-B-xkC3b-.js";import"./OptimizedGlassCore-tBAFSalT.js";import"./deviceCapabilities-BEZRvwEn.js";import"./GlassBiometricAdaptation-B0npAiDL.js";import"./MotionPreferenceContext-D7CbfrDA.js";import"./GlassEyeTracking-IHMCU-GA.js";import"./GlassSpatialAudio-pdJ1hzxm.js";import"./MotionFramer-BcMY4Q2P.js";import"./utilsCore-B3C7amq2.js";import"./GlassInput-DV8_IkrI.js";import"./GlassCard-zcXhHX7Z.js";import"./GlassBadge-DOYweCVP.js";import"./GlassSelect-q0dPRul4.js";import"./index-Cr8qE5r2.js";import"./index-DMNAFvrD.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CB17VNnC.js";import"./GlassCheckbox-Tk5I3iH9.js";import"./minus-BXUwSwDa.js";import"./createLucideIcon-CUGeHkPK.js";import"./check-DOU5beUU.js";import"./GlassTextarea-Bxv49mCs.js";import"./circle-alert-g8LZN3sW.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
