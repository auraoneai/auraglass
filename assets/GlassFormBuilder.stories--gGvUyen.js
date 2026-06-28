import{G as t}from"./GlassFormBuilder-ChbzoQV_.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CCaBsF9w.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-HlGX1tbM.js";import"./LiquidGlassMaterial-DVPkzx0T.js";import"./LiquidGlassLayerProvider-i53hNjeJ.js";import"./a11y-BxiHjbz4.js";import"./GlassPredictiveEngine-Bc111M9A.js";import"./GlassAchievementSystem-BHJGJqLM.js";import"./OptimizedGlassCore-itRtGneW.js";import"./deviceCapabilities-CCAksaEw.js";import"./GlassBiometricAdaptation-BcHdBy8Q.js";import"./MotionPreferenceContext-CVvRi18t.js";import"./GlassEyeTracking-Bqn0JRcx.js";import"./GlassSpatialAudio--SE7Hbc-.js";import"./MotionFramer-PZugSEzS.js";import"./utilsCore-G2Gruh8-.js";import"./GlassInput-D-bXHg6t.js";import"./GlassCard-DK7QC1Ne.js";import"./GlassBadge-1qMRX5xq.js";import"./GlassSelect-K4q9PmBO.js";import"./index-BctPvJsX.js";import"./index-DmTpUSkZ.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BdO1D4i4.js";import"./GlassCheckbox-Cn810pY1.js";import"./components-EZnNOtKf.js";import"./GlassTextarea-CdmzirOA.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
