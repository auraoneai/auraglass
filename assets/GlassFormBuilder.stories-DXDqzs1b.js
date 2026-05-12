import{G as a}from"./GlassFormBuilder-CNjG8gFt.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-ChjdpTMc.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B52AacQY.js";import"./index-BLCfc7M6.js";import"./LiquidGlassMaterial-BJhmvgAO.js";import"./LiquidGlassLayerProvider-BzmOFUIB.js";import"./a11y-Dsb5vlCx.js";import"./GlassPredictiveEngine-DXltJTPU.js";import"./GlassAchievementSystem-1rqoPyI_.js";import"./OptimizedGlassCore-DN1SoNCt.js";import"./deviceCapabilities-CmFcsI28.js";import"./GlassBiometricAdaptation-DIULEx2R.js";import"./MotionPreferenceContext-DQIb5qFV.js";import"./GlassEyeTracking-BiTzJrvO.js";import"./GlassSpatialAudio-Bh0QJys1.js";import"./MotionFramer-Co8aYoJM.js";import"./utilsCore-CsXu-XBU.js";import"./GlassInput-CtAP1wOP.js";import"./GlassCard-DAmfXcBn.js";import"./GlassBadge-DAXeJb2B.js";import"./GlassSelect-uxzSViki.js";import"./index-N3QDudEX.js";import"./index-BfVC54HD.js";import"./index-CWG1rEj-.js";import"./FocusTrap-tIzOertg.js";import"./GlassCheckbox-CoBWkcUS.js";import"./minus-DcAqD0Vf.js";import"./createLucideIcon-DLakD0cH.js";import"./check-hjayNguG.js";import"./GlassTextarea-Cm3frXVF.js";import"./circle-alert-BVwqNgKA.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
