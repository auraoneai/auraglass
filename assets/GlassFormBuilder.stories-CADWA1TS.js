import{G as a}from"./GlassFormBuilder-cx8OH0uR.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-FdJLCixk.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-j_2Pw_Y5.js";import"./index-C6BsqZ3s.js";import"./LiquidGlassMaterial-D4rBDX3V.js";import"./LiquidGlassLayerProvider-DvBswG95.js";import"./a11y-COKpGJzx.js";import"./GlassPredictiveEngine-CPg2ixuh.js";import"./GlassAchievementSystem-Cda_e14L.js";import"./OptimizedGlassCore-DXYTmyU1.js";import"./deviceCapabilities-B5v4J8AJ.js";import"./GlassBiometricAdaptation-DCbN24Re.js";import"./MotionPreferenceContext-CQKnbTlR.js";import"./GlassEyeTracking-CC0J8GgV.js";import"./GlassSpatialAudio-BRLye1vD.js";import"./MotionFramer-uMbPgrLU.js";import"./utilsCore-DnuVLwe3.js";import"./GlassInput-D4fCtcrI.js";import"./GlassCard-BT4-R1uE.js";import"./GlassBadge-NMf4Omas.js";import"./GlassSelect-CIwzJnmP.js";import"./index-DnlbRRP-.js";import"./index-Co8D_45D.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BwYrHXjM.js";import"./GlassCheckbox-BIkuTX9y.js";import"./minus-BSDEA9yc.js";import"./createLucideIcon-BQ5nBFq9.js";import"./check-DdBXHTNn.js";import"./GlassTextarea-Blk-iLff.js";import"./circle-alert-DMjgBXEB.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
