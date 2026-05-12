import{G as a}from"./GlassFormBuilder-SayTYgsO.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-C690vU5J.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BdLvfXig.js";import"./index-Dayedyh0.js";import"./LiquidGlassMaterial-BBmAKzP0.js";import"./LiquidGlassLayerProvider-DhxSOSnK.js";import"./a11y-CqibiY8Q.js";import"./GlassPredictiveEngine-Ce11n6gf.js";import"./GlassAchievementSystem-BgZ4Ujyz.js";import"./OptimizedGlassCore-BFIVwF34.js";import"./deviceCapabilities-CziwpX2D.js";import"./GlassBiometricAdaptation-Y65y9KhH.js";import"./MotionPreferenceContext-IxMuCihq.js";import"./GlassEyeTracking-DaVr191_.js";import"./GlassSpatialAudio-C5lfjDI8.js";import"./MotionFramer-BSdpDBRW.js";import"./utilsCore-BwjSsiAl.js";import"./GlassInput-CQR8NKXZ.js";import"./GlassCard-Dl8StL6q.js";import"./GlassBadge-BXlKQeds.js";import"./GlassSelect-IvJPmSuX.js";import"./index-CTSa_s3f.js";import"./index-DzvS4Qjb.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BkY8KAZn.js";import"./GlassCheckbox-CO-5-phy.js";import"./minus-yf2ccQT-.js";import"./createLucideIcon-B2KPDEa6.js";import"./check-D_uPOcGD.js";import"./GlassTextarea-DFAAvNCN.js";import"./circle-alert-1IMtAuDY.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
