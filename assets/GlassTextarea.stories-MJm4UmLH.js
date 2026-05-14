import{j as e,r as m}from"./iframe-Ba4C8OEc.js";import{aw as c}from"./components-D1QjIubZ.js";import{G as t}from"./GlassTextarea-DCaG9kq1.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Controls/Inputs/Glass Textarea",component:t,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass textarea for notes, briefs, and longer form content with validation support."}}},args:{label:"Launch note",placeholder:"Summarize the campaign change...",helperText:"Visible to reviewers before approval.",minRows:4,maxLength:180,showCharCount:!0,fullWidth:!0,icon:e.jsx(c,{size:16})}},n=r=>{const[o,l]=m.useState("Retune the audience ramp after the first warehouse refresh completes.");return e.jsxs("div",{className:"glass-grid glass-w-[min(640px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl",children:[e.jsx(t,{...r,value:o,onChange:i=>l(i.currentTarget.value)}),e.jsx(t,{label:"Reviewer comment",placeholder:"Add a blocking note",errorText:"Comment is required when rejecting a launch.",fullWidth:!0})]})},a={render:r=>e.jsx(n,{...r})},s={args:{variant:"minimal",label:"Internal note",showCharCount:!1,helperText:"Minimal variant for dense forms."},render:r=>e.jsx(n,{...r})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <TextareaFrame {...args} />
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "minimal",
    label: "Internal note",
    showCharCount: false,
    helperText: "Minimal variant for dense forms."
  },
  render: args => <TextareaFrame {...args} />
}`,...s.parameters?.docs?.source}}};const x=["Default","Minimal"];export{a as Default,s as Minimal,x as __namedExportsOrder,h as default};
