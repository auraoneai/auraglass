import{G as a}from"./GlassFormBuilder-CtrNScGN.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-6PHIdj5K.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DQN3cJ3X.js";import"./index-DaOI25_I.js";import"./LiquidGlassMaterial-2G5x3DpB.js";import"./LiquidGlassLayerProvider-BbZqwf9k.js";import"./a11y-BJ6VmGCi.js";import"./GlassPredictiveEngine-5-bjlLQ0.js";import"./GlassAchievementSystem-BjatmrXi.js";import"./OptimizedGlassCore-BMNTpg_C.js";import"./deviceCapabilities-EYD5uplS.js";import"./GlassBiometricAdaptation-D3RF1TY1.js";import"./MotionPreferenceContext-DHrzYxkV.js";import"./GlassEyeTracking-vqguxJe3.js";import"./GlassSpatialAudio-CT9R70tG.js";import"./MotionFramer-eYH5J7Z1.js";import"./utilsCore-AmY2pZqb.js";import"./GlassInput-CVHyflpN.js";import"./GlassCard-CZY5_BgP.js";import"./GlassBadge-D43JU8G4.js";import"./GlassSelect-CKfsCOrF.js";import"./index-C7aEZtBm.js";import"./index-Bn-fxOmV.js";import"./index-CWG1rEj-.js";import"./FocusTrap-Cs5pNjY6.js";import"./GlassCheckbox-DGl9OrCY.js";import"./minus-7QBqq2je.js";import"./createLucideIcon-CtIWFkcf.js";import"./check-BMLZxgcV.js";import"./GlassTextarea-kkp-hBv4.js";import"./circle-alert-MDYEAyPT.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
