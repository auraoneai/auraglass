import{G as a}from"./GlassFormBuilder-XMerxNzW.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DxUvObG1.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BKwl-q-g.js";import"./index-BaBnAiqB.js";import"./LiquidGlassMaterial-BTDbEReQ.js";import"./LiquidGlassLayerProvider-BQCQV5bZ.js";import"./a11y-vOvrykAi.js";import"./GlassPredictiveEngine-Db1qhY2e.js";import"./GlassAchievementSystem-Cgco6AOk.js";import"./OptimizedGlassCore-Ge4l3l3b.js";import"./deviceCapabilities-Ciz7WW1Y.js";import"./GlassBiometricAdaptation-jVd1d_Gs.js";import"./MotionPreferenceContext-CAU0EN1d.js";import"./GlassEyeTracking-C5efJHMa.js";import"./GlassSpatialAudio-DleknYpK.js";import"./MotionFramer-B6pu9S5n.js";import"./utilsCore-B6VxTi_O.js";import"./GlassInput-CAToALCs.js";import"./GlassCard-AyGdkwvW.js";import"./GlassBadge-BppoJszz.js";import"./GlassSelect-CYZUiJt5.js";import"./index-B3ifXga3.js";import"./index-6S5b3KsD.js";import"./index-CWG1rEj-.js";import"./FocusTrap-jhX8VvcZ.js";import"./GlassCheckbox-YkB0epRs.js";import"./minus-N5PFMX9t.js";import"./createLucideIcon-BfKGEw_5.js";import"./check-DHEui3CQ.js";import"./GlassTextarea-Kc6sDYXV.js";import"./circle-alert-tSHeZej1.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
