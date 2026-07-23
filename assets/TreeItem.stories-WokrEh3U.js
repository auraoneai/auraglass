import{j as e}from"./iframe-CdDNbo2v.js";import{T as a,a as l}from"./TreeItem-D_rmK6Hs.js";import"./preload-helper-PPVm8Dsz.js";import"./springPhysics-DnOBl9UB.js";const m={title:"Controls/Inputs/Tree Item",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism treeitem component."}}},argTypes:{className:{control:"text",description:"className prop"},children:{control:"text",description:"children prop"},disabled:{control:"boolean",description:"disabled prop"}},args:{className:"",children:"",disabled:!1}},s={render:r=>e.jsx(l,{children:e.jsxs(a,{...r,nodeId:"default-item",label:"TreeItem Example",children:[e.jsx(a,{nodeId:"child-1",label:"Child Item 1"}),e.jsx(a,{nodeId:"child-2",label:"Child Item 2"})]})})},t={render:r=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsxs(l,{children:[e.jsx(a,{...r,nodeId:"variant-1",label:"Basic Item"}),e.jsx(a,{...r,nodeId:"variant-2",label:"With Icon",icon:"📁"}),e.jsx(a,{...r,nodeId:"variant-3",label:"Disabled Item",disabled:!0})]})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <TreeView>
      <TreeItem {...args} nodeId="default-item" label="TreeItem Example">
        <TreeItem nodeId="child-1" label="Child Item 1" />
        <TreeItem nodeId="child-2" label="Child Item 2" />
      </TreeItem>
    </TreeView>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <TreeView>
        <TreeItem {...args} nodeId="variant-1" label="Basic Item" />
        <TreeItem {...args} nodeId="variant-2" label="With Icon" icon="📁" />
        <TreeItem {...args} nodeId="variant-3" label="Disabled Item" disabled />
      </TreeView>
    </div>
}`,...t.parameters?.docs?.source}}};const c=["Default","Variants"];export{s as Default,t as Variants,c as __namedExportsOrder,m as default};
