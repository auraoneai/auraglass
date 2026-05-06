import{G as r}from"./GlassFormBuilder-CR1sknKX.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-C2Py7iTP.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DyQ1uYYO.js";import"./index-BO6jdYrs.js";import"./LiquidGlassMaterial-CmfeHEzl.js";import"./LiquidGlassLayerProvider-DpzmTZb0.js";import"./GlassPredictiveEngine-ZsWyIufl.js";import"./GlassAchievementSystem-DjbL6xVt.js";import"./OptimizedGlassCore-xEcyrF8U.js";import"./GlassBiometricAdaptation-A7cjmcue.js";import"./MotionPreferenceContext-DOVeBjOR.js";import"./GlassEyeTracking-CyJl1QCH.js";import"./GlassSpatialAudio-BXD-nyUP.js";import"./MotionFramer-Bqa_dH4n.js";import"./utilsCore-DHlzAtb4.js";import"./GlassInput-D1vMSe7W.js";import"./GlassCard-CxFK8dmK.js";import"./GlassBadge-C7hGxsTC.js";import"./GlassSelect-NohGnvCj.js";import"./index-r7guIxR2.js";import"./index-aSGDCmRf.js";import"./index-CWG1rEj-.js";import"./FocusTrap-8vtenvmA.js";import"./GlassTextarea-LeBnmGsc.js";import"./circle-alert-D27adgJe.js";import"./createLucideIcon-DYSTPsPi.js";import"./index-ByImX2pa.js";const T={title:"Components/Interactive/GlassFormBuilder",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
