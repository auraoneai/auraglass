import{G as a}from"./GlassFormBuilder-BdYUrXaD.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-C_vLCgmV.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BCg-GsEv.js";import"./index-RG-K5OTs.js";import"./LiquidGlassMaterial-BcA2rjwO.js";import"./LiquidGlassLayerProvider-C85Vz4rQ.js";import"./a11y-BbCUV6V2.js";import"./GlassPredictiveEngine-CCvSKPQN.js";import"./GlassAchievementSystem-Cqapag4w.js";import"./OptimizedGlassCore-lqvY1K1L.js";import"./deviceCapabilities-CXqi70D6.js";import"./GlassBiometricAdaptation-g_CxFpp5.js";import"./MotionPreferenceContext-9UGqKYQR.js";import"./GlassEyeTracking-CuJ9LhVx.js";import"./GlassSpatialAudio-BQeaXM6E.js";import"./MotionFramer-DGhpSic8.js";import"./utilsCore-CHQMUrDx.js";import"./GlassInput-DjwndCYO.js";import"./GlassCard-B00Qtl3F.js";import"./GlassBadge-CMurgQhP.js";import"./GlassSelect-DbZYfKR5.js";import"./index-BoCD_Efp.js";import"./index-Bl8jNQSX.js";import"./index-CWG1rEj-.js";import"./FocusTrap-qHeYHKbJ.js";import"./GlassCheckbox-B18dvzX7.js";import"./minus-BEJaAwgy.js";import"./createLucideIcon-Pg8rt_v8.js";import"./check-BK9NiR_j.js";import"./GlassTextarea-CrlYki80.js";import"./circle-alert-Ba16ZPCh.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
