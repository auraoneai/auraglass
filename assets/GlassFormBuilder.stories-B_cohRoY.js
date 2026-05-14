import{G as t}from"./GlassFormBuilder-talL56Dh.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-Ba4C8OEc.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DPKAQKso.js";import"./LiquidGlassMaterial-iSHTie31.js";import"./LiquidGlassLayerProvider--9uHHbrP.js";import"./a11y-S73Y6DdK.js";import"./GlassPredictiveEngine-DKT9LYlh.js";import"./GlassAchievementSystem-DTLyyi5m.js";import"./OptimizedGlassCore-CqLDO6n8.js";import"./deviceCapabilities-USAXnPyC.js";import"./GlassBiometricAdaptation-u-TThKbC.js";import"./MotionPreferenceContext-BFEebokt.js";import"./GlassEyeTracking-Im_FqsVT.js";import"./GlassSpatialAudio-pAaxFUmv.js";import"./MotionFramer-BD6tt_zB.js";import"./utilsCore-W4jNCRfx.js";import"./GlassInput-CpHc5a07.js";import"./GlassCard-DJjT6e8m.js";import"./GlassBadge-Cc_4NuAL.js";import"./GlassSelect-BG6jIav6.js";import"./index-BOgcfoqs.js";import"./index-DXcdYcEm.js";import"./index-CWG1rEj-.js";import"./FocusTrap-B8lmp7oM.js";import"./GlassCheckbox-Cx6c9XM2.js";import"./components-D1QjIubZ.js";import"./GlassTextarea-DCaG9kq1.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
