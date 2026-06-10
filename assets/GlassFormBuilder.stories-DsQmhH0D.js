import{G as t}from"./GlassFormBuilder-BN5M1NaE.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CYOgkXcw.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-CbVeH3qr.js";import"./LiquidGlassMaterial-DoGYSLPp.js";import"./LiquidGlassLayerProvider-BW_uJvCF.js";import"./a11y-DVEbkwtc.js";import"./GlassPredictiveEngine-DDj5Q34-.js";import"./GlassAchievementSystem-Ddg38AWw.js";import"./OptimizedGlassCore-BKU-VEbW.js";import"./deviceCapabilities-sc2QmrsH.js";import"./GlassBiometricAdaptation-DswFZfqZ.js";import"./MotionPreferenceContext-VqTOAcBc.js";import"./GlassEyeTracking-J-uxHMQs.js";import"./GlassSpatialAudio-D1FB6dLS.js";import"./MotionFramer-BieLescM.js";import"./utilsCore-OA5bONHE.js";import"./GlassInput-8R1wbXq3.js";import"./GlassCard-CG0WA1jb.js";import"./GlassBadge-l4sqhJdf.js";import"./GlassSelect-1wJ2rSxX.js";import"./index-YbLSzDuu.js";import"./index-C2fTenOC.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CUiG6_AR.js";import"./GlassCheckbox-BB1cxSRw.js";import"./components-B7VYBO_y.js";import"./GlassTextarea-C9p9wuWQ.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
