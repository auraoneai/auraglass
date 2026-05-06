import{j as s}from"./iframe-OZreUAtx.js";import{G as a}from"./GlassPopover-DwUfxm7B.js";import"./preload-helper-PPVm8Dsz.js";import"./FocusTrap-B9obc6S4.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";import"./OptimizedGlassCore-DAQZMOh8.js";const d={title:"Components/Modal/GlassPopover",component:a,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasspopover component."}}},argTypes:{open:{control:"boolean",description:"Whether the popover is open"},placement:{control:{type:"select"},options:["top","top-start","top-end","right","right-start","right-end","bottom","bottom-start","bottom-end","left","left-start","left-end"],description:"Popover placement"},trigger:{control:{type:"select"},options:["click","hover","focus","manual"],description:"Trigger type"},showArrow:{control:"boolean",description:"Show arrow"},animation:{control:{type:"select"},options:["fade","scale","slide"],description:"Animation preset"}},args:{open:!0,placement:"bottom",trigger:"click",showArrow:!0,animation:"fade"}},e={args:{content:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("h3",{className:"glass-font-semibold glass-mb-2",children:"Popover Content"}),s.jsx("p",{className:"glass-text-sm",children:"This is the content inside the popover."}),s.jsx("button",{className:"glass-mt-2 glass-px-3 glass-py-1 glass-surface-blue glass-text-primary glass-radius-md glass-text-sm",children:"Action"})]}),children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius-md",children:"Click me"})}},t={args:{title:"Settings",description:"Configure your preferences",content:s.jsxs("div",{className:"glass-p-4 glass-gap-3",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{className:"glass-text-sm",children:"Notifications"}),s.jsx("input",{type:"checkbox",defaultChecked:!0})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{className:"glass-text-sm",children:"Dark Mode"}),s.jsx("input",{type:"checkbox"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{className:"glass-text-sm",children:"Auto-save"}),s.jsx("input",{type:"checkbox",defaultChecked:!0})]})]}),children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-primary glass-text-primary glass-radius-md",children:"Settings"}),placement:"top-start"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    content: <div className="glass-p-4">
        <h3 className="glass-font-semibold glass-mb-2">Popover Content</h3>
        <p className="glass-text-sm">This is the content inside the popover.</p>
        <button className="glass-mt-2 glass-px-3 glass-py-1 glass-surface-blue glass-text-primary glass-radius-md glass-text-sm">
          Action
        </button>
      </div>,
    children: <button className="glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius-md">
        Click me
      </button>
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Settings',
    description: 'Configure your preferences',
    content: <div className="glass-p-4 glass-gap-3">
        <div className="glass-flex glass-items-center glass-justify-between">
          <span className="glass-text-sm">Notifications</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="glass-flex glass-items-center glass-justify-between">
          <span className="glass-text-sm">Dark Mode</span>
          <input type="checkbox" />
        </div>
        <div className="glass-flex glass-items-center glass-justify-between">
          <span className="glass-text-sm">Auto-save</span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>,
    children: <button className="glass-px-4 glass-py-2 glass-surface-primary glass-text-primary glass-radius-md">
        Settings
      </button>,
    placement: 'top-start'
  }
}`,...t.parameters?.docs?.source}}};const u=["Default","WithTitle"];export{e as Default,t as WithTitle,u as __namedExportsOrder,d as default};
