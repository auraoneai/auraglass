import{G as t}from"./GlassFormBuilder-BDCDK0sF.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CtRSFJTE.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DD-ftUX_.js";import"./LiquidGlassMaterial-Y9gB2z_t.js";import"./LiquidGlassLayerProvider-BvezYu1G.js";import"./a11y-vcEGPYia.js";import"./GlassPredictiveEngine-CNJ6uPG_.js";import"./GlassAchievementSystem-b48HUKbq.js";import"./OptimizedGlassCore-gF2O5jvN.js";import"./deviceCapabilities-DvV84Xg1.js";import"./GlassBiometricAdaptation-B6aineW4.js";import"./MotionPreferenceContext-DqZUVy35.js";import"./GlassEyeTracking-BijQUaQZ.js";import"./GlassSpatialAudio-u9ax0mAo.js";import"./MotionFramer-BHAMyJdN.js";import"./utilsCore-DsYObD65.js";import"./GlassInput-DfNPWtH4.js";import"./GlassCard-D1Tr_7DX.js";import"./GlassBadge-m42EYu0X.js";import"./GlassSelect-Cw4R-2CT.js";import"./index-Da3OXt8D.js";import"./index-Di_IhcHj.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CquHpvDI.js";import"./GlassCheckbox-UCtoIEJf.js";import"./components-DBB_poJ4.js";import"./GlassTextarea-QaG-_urW.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
