import{j as e}from"./iframe-RsoZoStf.js";import{G as n}from"./GlassLoadingState-D0-JVUj8.js";import"./preload-helper-PPVm8Dsz.js";import"./components-DwI53NlZ.js";import"./OptimizedGlassCore-IzbAukgr.js";import"./deviceCapabilities-CB0YcTGX.js";const m={title:"Data + Visualization/Glass Loading State",component:n,parameters:{layout:"centered",previewSurface:"component"},args:{label:"Preparing your workspace",description:"Applying permissions and loading the latest project data.",variant:"spinner"}},s={render:r=>e.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:e.jsx(n,{...r})})},a={args:{variant:"skeleton",label:"Loading activity",description:"Fetching the latest workspace changes.",rows:4},render:r=>e.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:e.jsx(n,{...r})})},t={args:{variant:"progress",label:"Importing customer records",description:"3,840 of 5,200 records processed.",progress:74},render:r=>e.jsx("div",{style:{width:"min(620px, calc(100vw - 48px))"},children:e.jsx(n,{...r})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "min(620px, calc(100vw - 48px))"
  }}>
      <GlassLoadingState {...args} />
    </div>
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "skeleton",
    label: "Loading activity",
    description: "Fetching the latest workspace changes.",
    rows: 4
  },
  render: args => <div style={{
    width: "min(620px, calc(100vw - 48px))"
  }}>
      <GlassLoadingState {...args} />
    </div>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "progress",
    label: "Importing customer records",
    description: "3,840 of 5,200 records processed.",
    progress: 74
  },
  render: args => <div style={{
    width: "min(620px, calc(100vw - 48px))"
  }}>
      <GlassLoadingState {...args} />
    </div>
}`,...t.parameters?.docs?.source}}};const g=["Default","Skeleton","Progress"];export{s as Default,t as Progress,a as Skeleton,g as __namedExportsOrder,m as default};
