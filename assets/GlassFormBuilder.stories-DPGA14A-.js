import{G as a}from"./GlassFormBuilder-Dk3Idvpl.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-B2YkWo0R.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Dgh6WqMj.js";import"./index-n9X50j_c.js";import"./LiquidGlassMaterial-DIoSyT1w.js";import"./LiquidGlassLayerProvider-DpO-dbvQ.js";import"./a11y-Bb31ansd.js";import"./GlassPredictiveEngine-Bfsuuf7W.js";import"./GlassAchievementSystem-BKwelFxF.js";import"./OptimizedGlassCore-CYII0g9k.js";import"./deviceCapabilities-DmRU0S_3.js";import"./GlassBiometricAdaptation-TYjF8UXx.js";import"./MotionPreferenceContext-C6GeG4Di.js";import"./GlassEyeTracking-DkLkTBcn.js";import"./GlassSpatialAudio-nYsj51EH.js";import"./MotionFramer-BYVTsMJM.js";import"./utilsCore-jPC74JRq.js";import"./GlassInput-Bx6UisC3.js";import"./GlassCard-eGwHH-qE.js";import"./GlassBadge-BaOo3NrR.js";import"./GlassSelect-BMIwzByH.js";import"./index-D9p7N2qH.js";import"./index-DlFL8p1X.js";import"./index-CWG1rEj-.js";import"./FocusTrap-Bpje_djM.js";import"./GlassCheckbox-CwGiqJqE.js";import"./minus-Ubbw3lI4.js";import"./createLucideIcon-DR1KmGc4.js";import"./check-BTpZSE7-.js";import"./GlassTextarea-NwaG6Gcy.js";import"./circle-alert-D7NPXwlI.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
