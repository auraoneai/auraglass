import{G as a}from"./GlassFormBuilder-DnMQ7AE7.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DinEdlu4.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DtDq-6cE.js";import"./index-BSZLQSMP.js";import"./LiquidGlassMaterial-CvuHza0N.js";import"./LiquidGlassLayerProvider-GNUOtjWn.js";import"./a11y-BZVU29oS.js";import"./GlassPredictiveEngine-BKPaam1d.js";import"./GlassAchievementSystem-GIvRvVG8.js";import"./OptimizedGlassCore-mTd-BSmd.js";import"./deviceCapabilities-8hOeRztp.js";import"./GlassBiometricAdaptation-DQo37Ppl.js";import"./MotionPreferenceContext-C6zfnLSu.js";import"./GlassEyeTracking-D-igIz05.js";import"./GlassSpatialAudio-FTaDbqAm.js";import"./MotionFramer-WyK-4knE.js";import"./utilsCore-EAOjHx1h.js";import"./GlassInput-Ck7fgg_a.js";import"./GlassCard-DpddndHG.js";import"./GlassBadge-C2pdwwR4.js";import"./GlassSelect-CF0q5ewX.js";import"./index-DYrRdpgV.js";import"./index-C66-bdXz.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BgILtNYG.js";import"./GlassCheckbox-M_T8AJBL.js";import"./minus-B2wey5mW.js";import"./createLucideIcon-DfdB-aiz.js";import"./check-DLae_g-x.js";import"./GlassTextarea-CzebMDY5.js";import"./circle-alert-BIDFUaUj.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
