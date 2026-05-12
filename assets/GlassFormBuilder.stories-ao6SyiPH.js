import{G as a}from"./GlassFormBuilder-DmTK8td6.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-CN7unHsM.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DrnjcySN.js";import"./index-DiDiWpqJ.js";import"./LiquidGlassMaterial-BH5nbjzw.js";import"./LiquidGlassLayerProvider-sLyyA7i-.js";import"./a11y-snjFlI8c.js";import"./GlassPredictiveEngine-DiO3ODUn.js";import"./GlassAchievementSystem-DpuPYoX4.js";import"./OptimizedGlassCore-CD-CmIfG.js";import"./deviceCapabilities-CKMFLbhe.js";import"./GlassBiometricAdaptation-jsUrE8e8.js";import"./MotionPreferenceContext-C4z2RG7B.js";import"./GlassEyeTracking-B50rWLUZ.js";import"./GlassSpatialAudio-CkI41Eli.js";import"./MotionFramer-Dcb5vjfs.js";import"./utilsCore-CnxOVXuV.js";import"./GlassInput-DT8G3ZYn.js";import"./GlassCard-CEWHY_q8.js";import"./GlassBadge-Csqmirwm.js";import"./GlassSelect-BciL8KoY.js";import"./index-DKS-iV3f.js";import"./index-fF1ZNrHi.js";import"./index-CWG1rEj-.js";import"./FocusTrap-CKPXSKwP.js";import"./GlassCheckbox-CLcNXfhn.js";import"./minus-DvkY0qyL.js";import"./createLucideIcon-SauGLeX7.js";import"./check-CK_KSY9a.js";import"./GlassTextarea-D1JLO5Ui.js";import"./circle-alert-CAadzvbr.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
