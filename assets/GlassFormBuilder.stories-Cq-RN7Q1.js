import{G as t}from"./GlassFormBuilder-BUE4_m3o.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-BGoRE5Do.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-ut0nWQkJ.js";import"./LiquidGlassMaterial-EXPYOLQS.js";import"./LiquidGlassLayerProvider-BswDX_fa.js";import"./a11y-BGeEhmxI.js";import"./GlassPredictiveEngine-DXXFPx-C.js";import"./GlassAchievementSystem-sLJT3mDp.js";import"./OptimizedGlassCore-MyIZufQF.js";import"./deviceCapabilities-DE3cL9ZV.js";import"./GlassBiometricAdaptation-IkNYnwgy.js";import"./MotionPreferenceContext-C_ZYUQ6H.js";import"./GlassEyeTracking-C9EGvaAJ.js";import"./GlassSpatialAudio-BIRTaCpS.js";import"./MotionFramer-CE9QfzfL.js";import"./utilsCore-B0u8WXX6.js";import"./GlassInput-CqwT_-tc.js";import"./GlassCard-DTgmE9rw.js";import"./GlassBadge-OjnpxEhM.js";import"./GlassSelect-CDDN1zGn.js";import"./index-DcXD22zQ.js";import"./index-WXjmE9WN.js";import"./index-CWG1rEj-.js";import"./FocusTrap-C0wYG7Oy.js";import"./GlassCheckbox-BdPbN7B9.js";import"./components-BtZOXrmB.js";import"./GlassTextarea-D7NGZ4Sq.js";import"./index-ByImX2pa.js";const T={title:"Workflows/Glass Form Builder",component:t,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},a={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
