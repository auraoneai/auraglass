import{j as s,r as m}from"./iframe-Cqi-9gHA.js";import{u as t,w as r}from"./index-DdjpOZjl.js";import{G as n}from"./GlassCombobox-B5Ib2r21.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";import"./components-D_brxh8E.js";const u=[{value:"design",label:"Design systems",group:"Product"},{value:"growth",label:"Growth analytics",group:"Product"},{value:"operations",label:"Revenue operations",group:"Business"},{value:"archived",label:"Archived workspace",group:"Business",disabled:!0}],w={title:"Controls/Inputs/Glass Combobox",component:n,parameters:{layout:"centered",previewSurface:"component"},args:{label:"Destination workspace",placeholder:"Search workspaces",options:u,defaultValue:"design"}},l=e=>{const[c,i]=m.useState(e.defaultValue??"");return s.jsx("div",{style:{width:"min(420px, calc(100vw - 48px))"},children:s.jsx(n,{...e,value:c,onChange:p=>i(p)})})},a={render:e=>s.jsx(l,{...e}),play:async({canvasElement:e})=>{await t.click(r(e).getByRole("combobox"))}},o={args:{options:[],defaultValue:void 0,emptyText:"No matching workspaces"},render:e=>s.jsx(l,{...e}),play:async({canvasElement:e})=>{await t.click(r(e).getByRole("combobox"))}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <ComboboxExample {...args} />,
  play: async ({
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    options: [],
    defaultValue: undefined,
    emptyText: "No matching workspaces"
  },
  render: args => <ComboboxExample {...args} />,
  play: async ({
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  }
}`,...o.parameters?.docs?.source}}};const E=["Default","EmptyResults"];export{a as Default,o as EmptyResults,E as __namedExportsOrder,w as default};
