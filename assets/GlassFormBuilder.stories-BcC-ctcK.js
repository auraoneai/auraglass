import{G as t}from"./GlassFormBuilder-_7BPY8Ff.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-AZkd8Eyt.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BntcCPxy.js";import"./LiquidGlassMaterial-CVUBSqxo.js";import"./LiquidGlassLayerProvider-sx57EtXU.js";import"./a11y-DDokf3uy.js";import"./GlassPredictiveEngine-DNVJFUrU.js";import"./GlassAchievementSystem-DKkBCzfA.js";import"./OptimizedGlassCore-BM69gN7z.js";import"./deviceCapabilities-BOA6cHzv.js";import"./GlassBiometricAdaptation-Dt1daX9C.js";import"./MotionPreferenceContext-BW8HwmCB.js";import"./GlassEyeTracking-JKdsw8KF.js";import"./GlassSpatialAudio-BNNU23Sg.js";import"./MotionFramer-V_u_tBj5.js";import"./utilsCore-DgMQ5kOy.js";import"./GlassInput-Qy9z69Ox.js";import"./GlassCard-DUZajs1a.js";import"./GlassBadge-_F0SsFSh.js";import"./GlassSelect-1jmHDZoG.js";import"./index-CJczRaqS.js";import"./index-BJ6dd7ji.js";import"./index-CWG1rEj-.js";import"./FocusTrap-2RPT6h8N.js";import"./GlassCheckbox-BYE3ctvA.js";import"./components-CegB_xim.js";import"./GlassTextarea-DkEywhmT.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const W=["Default","Variants"];export{a as Default,r as Variants,W as __namedExportsOrder,T as default};
