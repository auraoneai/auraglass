import{j as s}from"./iframe-BEVTBSqr.js";import{G as e,a as r,b as g}from"./GlassTooltip-saiuNO4p.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./MotionFramer-xTbOeNdo.js";import"./utilsCore-DpNKUJXO.js";import"./OptimizedGlassCore-BMFMzxVt.js";const x={title:"Components/Modal/GlassTooltip",component:e,parameters:{layout:"centered",docs:{description:{component:"A sophisticated tooltip component with glass morphism styling and advanced positioning."}}},argTypes:{position:{control:{type:"select"},options:["top","right","bottom","left","auto"],description:"Tooltip position relative to trigger"},showDelay:{control:{type:"number",min:0,max:2e3,step:100},description:"Delay before showing tooltip (ms)"},hideDelay:{control:{type:"number",min:0,max:2e3,step:100},description:"Delay before hiding tooltip (ms)"}},args:{position:"top",showDelay:300,hideDelay:100}},l={render:a=>s.jsx(e,{...a,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors",children:"Hover me"})}),args:{content:s.jsx("p",{children:"This is a glass morphism tooltip!"})}},t={render:a=>s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-8 max-w-2xl",children:[s.jsx(e,{position:"top",content:"Tooltip on top",showDelay:a.showDelay,hideDelay:a.hideDelay,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-danger glass-radius-lg",children:"Top"})}),s.jsx(e,{position:"right",content:"Tooltip on right",showDelay:a.showDelay,hideDelay:a.hideDelay,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-success glass-radius-lg",children:"Right"})}),s.jsx(e,{position:"bottom",content:"Tooltip on bottom",showDelay:a.showDelay,hideDelay:a.hideDelay,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg",children:"Bottom"})}),s.jsx(e,{position:"left",content:"Tooltip on left",showDelay:a.showDelay,hideDelay:a.hideDelay,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-info glass-radius-lg",children:"Left"})})]})},o={render:a=>s.jsx(e,{...a,children:s.jsx("button",{className:"glass-px-6 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg glass-font-medium",children:"Rich Tooltip"})}),args:{content:s.jsxs("div",{className:"glass-gap-2 max-w-xs",children:[s.jsx("div",{className:"glass-font-semibold",children:"Advanced Tooltip"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This tooltip supports rich content including multiple paragraphs, formatting, and even interactive elements."}),s.jsxs("div",{className:"glass-flex glass-gap-2 pt-2",children:[s.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs",children:"Feature"}),s.jsx("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs",children:"Interactive"})]})]})}},i={render:a=>s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Tooltip Component Examples"}),s.jsx("p",{className:"glass-text-sm opacity-80",children:"Using GlassTooltipTrigger and GlassTooltipContent explicitly"})]}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4",children:[s.jsxs(e,{content:s.jsx("p",{children:"This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components"}),showDelay:a.showDelay,hideDelay:a.hideDelay,children:[s.jsx(r,{asChild:!0,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors",children:"Trigger Button"})}),s.jsx(g,{children:s.jsx("p",{children:"This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components"})})]}),s.jsxs(e,{content:s.jsx("p",{children:"Tooltip positioned to the right"}),position:"right",showDelay:a.showDelay,hideDelay:a.hideDelay,children:[s.jsx(r,{asChild:!0,children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-surface-success glass-radius-lg hover:glass-surface-green/30 transition-colors",children:"Right Side"})}),s.jsx(g,{children:s.jsx("p",{children:"Tooltip positioned to the right"})})]})]})]}),args:{children:null}},n={render:a=>s.jsxs("div",{className:"glass-gap-4",children:[s.jsxs(e,{content:s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("div",{className:"glass-font-semibold",children:"Custom Trigger"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This tooltip uses a custom div element as the trigger instead of a button."})]}),showDelay:a.showDelay,hideDelay:a.hideDelay,children:[s.jsx(r,{asChild:!0,children:s.jsx("div",{className:"glass-p-3 glass-surface-info glass-radius-lg glass-cursor-pointer hover:glass-surface-primary/30 transition-colors",children:s.jsx("span",{className:"glass-text-sm glass-font-medium",children:"Custom Trigger Element"})})}),s.jsx(g,{children:s.jsxs("div",{className:"glass-gap-2",children:[s.jsx("div",{className:"glass-font-semibold",children:"Custom Trigger"}),s.jsx("p",{className:"glass-text-sm glass-opacity-90",children:"This tooltip uses a custom div element as the trigger instead of a button."})]})})]}),s.jsxs(e,{content:s.jsx("p",{children:"Inline span element as tooltip trigger"}),position:"bottom",showDelay:a.showDelay,hideDelay:a.hideDelay,children:[s.jsx(r,{asChild:!0,children:s.jsx("span",{className:"inline-glass-block glass-px-2 glass-py-1 glass-surface-primary/20 glass-radius-md glass-cursor-pointer hover:glass-surface-primary/30 transition-colors glass-text-sm",children:"Hover me"})}),s.jsx(g,{children:s.jsx("p",{children:"Inline span element as tooltip trigger"})})]})]}),args:{children:null}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <GlassTooltip {...args}>
      <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
        Hover me
      </button>
    </GlassTooltip>,
  args: {
    content: <p>This is a glass morphism tooltip!</p>
  }
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-glass-grid-cols-2 glass-gap-8 max-w-2xl">
      <GlassTooltip position="top" content="Tooltip on top" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-danger glass-radius-lg">Top</button>
      </GlassTooltip>

      <GlassTooltip position="right" content="Tooltip on right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-success glass-radius-lg">Right</button>
      </GlassTooltip>

      <GlassTooltip position="bottom" content="Tooltip on bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg">Bottom</button>
      </GlassTooltip>

      <GlassTooltip position="left" content="Tooltip on left" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-info glass-radius-lg">Left</button>
      </GlassTooltip>
    </div>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <GlassTooltip {...args}>
      <button className="glass-px-6 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg glass-font-medium">
        Rich Tooltip
      </button>
    </GlassTooltip>,
  args: {
    content: <div className="glass-gap-2 max-w-xs">
        <div className="glass-font-semibold">Advanced Tooltip</div>
        <p className="glass-text-sm glass-opacity-90">
          This tooltip supports rich content including multiple paragraphs,
          formatting, and even interactive elements.
        </p>
        <div className="glass-flex glass-gap-2 pt-2">
          <span className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs">Feature</span>
          <span className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs">Interactive</span>
        </div>
      </div>
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="space-y-6">
      <div className="glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Tooltip Component Examples</h3>
        <p className="glass-text-sm opacity-80">Using GlassTooltipTrigger and GlassTooltipContent explicitly</p>
      </div>

      <div className="glass-flex glass-justify-center glass-gap-4">
        <GlassTooltip content={<p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
              Trigger Button
            </button>
          </GlassTooltipTrigger>
          <GlassTooltipContent>
            <p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>
          </GlassTooltipContent>
        </GlassTooltip>

        <GlassTooltip content={<p>Tooltip positioned to the right</p>} position="right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="glass-px-4 glass-py-2 glass-surface-success glass-radius-lg hover:glass-surface-green/30 transition-colors">
              Right Side
            </button>
          </GlassTooltipTrigger>
          <GlassTooltipContent>
            <p>Tooltip positioned to the right</p>
          </GlassTooltipContent>
        </GlassTooltip>
      </div>
    </div>,
  args: {
    children: null
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-gap-4">
      <GlassTooltip content={<div className="glass-gap-2">
          <div className="glass-font-semibold">Custom Trigger</div>
          <p className="glass-text-sm glass-opacity-90">
            This tooltip uses a custom div element as the trigger instead of a button.
          </p>
        </div>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <div className="glass-p-3 glass-surface-info glass-radius-lg glass-cursor-pointer hover:glass-surface-primary/30 transition-colors">
            <span className="glass-text-sm glass-font-medium">Custom Trigger Element</span>
          </div>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <div className="glass-gap-2">
            <div className="glass-font-semibold">Custom Trigger</div>
            <p className="glass-text-sm glass-opacity-90">
              This tooltip uses a custom div element as the trigger instead of a button.
            </p>
          </div>
        </GlassTooltipContent>
      </GlassTooltip>

      <GlassTooltip content={<p>Inline span element as tooltip trigger</p>} position="bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <span className="inline-glass-block glass-px-2 glass-py-1 glass-surface-primary/20 glass-radius-md glass-cursor-pointer hover:glass-surface-primary/30 transition-colors glass-text-sm">
            Hover me
          </span>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Inline span element as tooltip trigger</p>
        </GlassTooltipContent>
      </GlassTooltip>
    </div>,
  args: {
    children: null
  }
}`,...n.parameters?.docs?.source}}};const T=["Default","Positions","RichContent","TooltipComponents","CustomTriggerContent"];export{n as CustomTriggerContent,l as Default,t as Positions,o as RichContent,i as TooltipComponents,T as __namedExportsOrder,x as default};
