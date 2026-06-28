import{j as e}from"./iframe-BM_sOc7A.js";import{a as n,T as s}from"./TreeItem-C5-Qb3SU.js";import"./preload-helper-PPVm8Dsz.js";import"./springPhysics-DnOBl9UB.js";const m={title:"Controls/Inputs/Tree View",component:n,parameters:{layout:"centered",docs:{description:{component:"A glass morphism treeview component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},a={render:o=>e.jsx(n,{...o,className:"glass-w-[min(20rem,calc(100vw-3rem))] !glass-text-slate-950",expandedIds:["workspace","components"],selectedIds:["charts"],showIcons:!0,showLines:!0,children:e.jsxs(s,{nodeId:"workspace",label:"AuraGlass workspace",icon:"[ ]",children:[e.jsx(s,{nodeId:"tokens",label:"Design tokens",icon:"T"}),e.jsxs(s,{nodeId:"components",label:"Components",icon:"C",children:[e.jsx(s,{nodeId:"buttons",label:"Buttons",icon:"◼"}),e.jsx(s,{nodeId:"charts",label:"Charts",icon:"▦"})]})]})}),args:{}},r={render:o=>e.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-4",children:e.jsx(n,{...o,children:"Default"})}),args:{}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <TreeView {...args} className="glass-w-[min(20rem,calc(100vw-3rem))] !glass-text-slate-950" expandedIds={['workspace', 'components']} selectedIds={['charts']} showIcons showLines>
      <TreeItem nodeId="workspace" label="AuraGlass workspace" icon="[ ]">
        <TreeItem nodeId="tokens" label="Design tokens" icon="T" />
        <TreeItem nodeId="components" label="Components" icon="C">
          <TreeItem nodeId="buttons" label="Buttons" icon="◼" />
          <TreeItem nodeId="charts" label="Charts" icon="▦" />
        </TreeItem>
      </TreeItem>
    </TreeView>,
  args: {}
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-flex glass-flex-wrap glass-gap-4">
      <TreeView {...args}>
        Default
      </TreeView>
    </div>,
  args: {}
}`,...r.parameters?.docs?.source}}};const i=["Default","Variants"];export{a as Default,r as Variants,i as __namedExportsOrder,m as default};
