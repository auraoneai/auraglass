import{G as a}from"./GlassFormBuilder-CbFfIyLI.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-C4NFeGrN.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BUfhtodi.js";import"./index-B_iEiQ1o.js";import"./LiquidGlassMaterial-CNyDwuYL.js";import"./LiquidGlassLayerProvider-BZ-DSawD.js";import"./a11y-Drh7-6qm.js";import"./GlassPredictiveEngine-p8dhL3l2.js";import"./GlassAchievementSystem-COJZihXG.js";import"./OptimizedGlassCore-pFwkcNDS.js";import"./deviceCapabilities-CcJXKEC9.js";import"./GlassBiometricAdaptation-VtcPE7IX.js";import"./MotionPreferenceContext-BsFuXk-N.js";import"./GlassEyeTracking-BVSsxMzB.js";import"./GlassSpatialAudio-CFC07lye.js";import"./MotionFramer-m7Rs0ztI.js";import"./utilsCore-CDQaqjab.js";import"./GlassInput-DbY82nX1.js";import"./GlassCard-Cfy6j8fx.js";import"./GlassBadge-CQx1t2qC.js";import"./GlassSelect-Bclg_Z0T.js";import"./index-B2CWty9s.js";import"./index-BEd17uxg.js";import"./index-CWG1rEj-.js";import"./FocusTrap-dXZXrajz.js";import"./GlassCheckbox-Bk1QKGRH.js";import"./minus-gGkeG4d-.js";import"./createLucideIcon-Dya9Njuo.js";import"./check-BKEDVSfX.js";import"./GlassTextarea-DMWC45MV.js";import"./circle-alert-C-LCt_4f.js";import"./index-ByImX2pa.js";const L={title:"Workflows/Glass Form Builder",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassformbuilder component."}}},argTypes:{schema:{control:"object",description:"Form schema with sections and fields"},values:{control:"object",description:"Current form values"},variant:{control:"select",options:["default","compact","wizard","inline"],description:"Form variant"},size:{control:"select",options:["sm","md","lg"],description:"Form size"},loading:{control:"boolean",description:"Whether form is loading"},disabled:{control:"boolean",description:"Whether form is disabled"}},args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name",required:!0},{id:"email",type:"email",label:"Email",placeholder:"Enter your email",required:!0},{id:"message",type:"textarea",label:"Message",placeholder:"Enter your message"}]}],values:{},variant:"default",size:"md",loading:!1,disabled:!1,onChange:e(),onSubmit:e()}},r={args:{schema:[{id:"contact",title:"Contact Form",fields:[{id:"name",type:"text",label:"Full Name",placeholder:"Enter your full name",required:!0},{id:"email",type:"email",label:"Email Address",placeholder:"Enter your email",required:!0},{id:"subject",type:"select",label:"Subject",options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales"}]}]}],values:{},onChange:e(),onSubmit:e()}},t={args:{schema:[{id:"personal",title:"Personal Information",fields:[{id:"firstName",type:"text",label:"First Name",placeholder:"Enter your first name"},{id:"lastName",type:"text",label:"Last Name",placeholder:"Enter your last name"}]}],values:{},variant:"compact",onChange:e(),onSubmit:e()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
