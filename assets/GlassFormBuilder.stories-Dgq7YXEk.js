import{G as t}from"./GlassFormBuilder-6kAhLJVI.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-GrkikuRp.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-D11IFtlb.js";import"./LiquidGlassMaterial-QJo0sijf.js";import"./LiquidGlassLayerProvider-B3OXnDJ0.js";import"./a11y-CCC13-1v.js";import"./GlassPredictiveEngine-Cet71K7v.js";import"./GlassAchievementSystem-F37YjtOd.js";import"./OptimizedGlassCore-BK6ui_Z7.js";import"./deviceCapabilities-Cdjfew4F.js";import"./GlassBiometricAdaptation-xyUwR8ZA.js";import"./MotionPreferenceContext-BJCiJfFd.js";import"./GlassEyeTracking-DnsWplSi.js";import"./GlassSpatialAudio--c49q0dU.js";import"./MotionFramer-0RDYG5R5.js";import"./utilsCore-C85LumCN.js";import"./GlassInput-CaaeA-dn.js";import"./GlassCard-CHwpfb9s.js";import"./GlassBadge-DRtWSiTp.js";import"./GlassSelect-C06WkjX9.js";import"./index-DwMKLFAw.js";import"./index-BTvydCvX.js";import"./index-CWG1rEj-.js";import"./FocusTrap-Cy8IwNoK.js";import"./GlassCheckbox-CdLfLLrG.js";import"./components-DWrkUpM8.js";import"./GlassTextarea-BNiJ9gYF.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
