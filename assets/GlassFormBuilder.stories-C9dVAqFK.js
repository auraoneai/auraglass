import{G as r}from"./GlassFormBuilder-BFF5jfCw.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-rcK9Xf1b.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-B7wlFxfc.js";import"./index-SHVQWzfF.js";import"./LiquidGlassMaterial-B5rEZqMl.js";import"./LiquidGlassLayerProvider-BIHgxTaw.js";import"./GlassPredictiveEngine-CVTNJ8qr.js";import"./GlassAchievementSystem-DYlVdNF6.js";import"./OptimizedGlassCore-BtDfN8Ts.js";import"./GlassBiometricAdaptation-BGrhrjU2.js";import"./MotionPreferenceContext-mQDtMATf.js";import"./GlassEyeTracking-Bnvi94mr.js";import"./GlassSpatialAudio-6tN9NdIH.js";import"./MotionFramer-D0-HiDbD.js";import"./utilsCore-jun4nkmH.js";import"./GlassInput-DCwwIH2O.js";import"./GlassCard-DnW7rwt6.js";import"./GlassBadge-Cvpm4dp-.js";import"./GlassSelect-BITJdiHJ.js";import"./index-CorKz1Oa.js";import"./index-cBeLGFGK.js";import"./index-CWG1rEj-.js";import"./FocusTrap-DMlyr3O_.js";import"./GlassTextarea-BW4ZoRg0.js";import"./circle-alert-CqNOAsXk.js";import"./createLucideIcon-DsZsNNjc.js";import"./index-ByImX2pa.js";const T={title:"Components/Interactive/GlassFormBuilder",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const w=["Default","Variants"];export{a as Default,t as Variants,w as __namedExportsOrder,T as default};
