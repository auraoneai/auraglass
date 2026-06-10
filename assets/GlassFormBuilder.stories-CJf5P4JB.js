import{G as t}from"./GlassFormBuilder-Dpm8U-z-.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-DL0Cy6Qm.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DfOzjBO4.js";import"./LiquidGlassMaterial-UbBe1GEe.js";import"./LiquidGlassLayerProvider-CWq40Pup.js";import"./a11y-BmS7yTss.js";import"./GlassPredictiveEngine-05Sa5boq.js";import"./GlassAchievementSystem-BHEgKCBn.js";import"./OptimizedGlassCore-DCil-Mtt.js";import"./deviceCapabilities-bTwC3axp.js";import"./GlassBiometricAdaptation-BgUrssxj.js";import"./MotionPreferenceContext-CE2cIJWP.js";import"./GlassEyeTracking-DbcgmIgS.js";import"./GlassSpatialAudio-BSI6cL7u.js";import"./MotionFramer-CMmRorie.js";import"./utilsCore-BTp3mrmn.js";import"./GlassInput-Box-XUNm.js";import"./GlassCard-DCtUFKr-.js";import"./GlassBadge-CrHhKcII.js";import"./GlassSelect-BitrS2Co.js";import"./index-zYyJvaEL.js";import"./index-BWQLSs69.js";import"./index-CWG1rEj-.js";import"./FocusTrap-BBIW_6qf.js";import"./GlassCheckbox-C72FU7i7.js";import"./components-DpExAbu2.js";import"./GlassTextarea-BLS77iSE.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
