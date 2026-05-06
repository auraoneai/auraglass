import{G as r}from"./GlassFormBuilder-Diu444Xi.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DBVOVM-c.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DDji8ykS.js";import"./index-DEDjQVGp.js";import"./LiquidGlassMaterial-BxQSDtcp.js";import"./LiquidGlassLayerProvider-EOSql5rI.js";import"./GlassPredictiveEngine-DQcsU0Kw.js";import"./GlassAchievementSystem-D2fh9x4W.js";import"./OptimizedGlassCore-CyIux4a_.js";import"./GlassBiometricAdaptation-ov4NVf6J.js";import"./MotionPreferenceContext-DuNK6mTA.js";import"./GlassEyeTracking-BL8t9uSv.js";import"./GlassSpatialAudio-cNFLaQk4.js";import"./MotionFramer-DLgCJzPg.js";import"./utilsCore-B0Pwu3YL.js";import"./GlassInput-5GIS9srJ.js";import"./GlassCard-DduDDSPq.js";import"./GlassBadge-DtZzNwET.js";import"./GlassSelect-Rdy2VJP_.js";import"./index-B45CqW_o.js";import"./index-C4LJA4yH.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BhyhP5Jz.js";import"./GlassTextarea-Bk27MlfJ.js";import"./circle-alert-D4ntKRN3.js";import"./createLucideIcon-HCPRkE_a.js";import"./index-ByImX2pa.js";const T={title:"Components/Interactive/GlassFormBuilder",component:r,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
