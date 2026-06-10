import{j as s}from"./iframe-B8jVgyad.js";import{I as h,t as m,K as y,bt as x}from"./components-Dfh6oSUn.js";import{G as t,a as c,b as g}from"./GlassTooltip-QQ28rxFe.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-B5SIjMKz.js";import"./MotionPreferenceContext-CRbrlShU.js";import"./MotionFramer-B8wcyPsS.js";import"./utilsCore-jJSD4MRq.js";import"./OptimizedGlassCore-LJ9cg0Vq.js";import"./deviceCapabilities-TeCERPXa.js";const o=({children:e,tone:a="overlay"})=>{const u=a==="blue"?"glass-surface-blue":a==="green"?"glass-surface-green":a==="red"?"glass-surface-red":"glass-surface-overlay";return s.jsx("button",{type:"button",className:`${u} glass-inline-flex glass-items-center glass-gap-2 glass-radius-lg glass-border glass-border-subtle glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard`,children:e})},p=({children:e})=>s.jsx("div",{className:"glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-px-3 glass-py-2 glass-text-sm glass-text-primary glass-shadow-lg",children:e}),P={title:"Surfaces/Modals/Glass Tooltip",component:t,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A glass tooltip for concise contextual help with responsive trigger layouts."}}},argTypes:{position:{control:{type:"select"},options:["top","right","bottom","left","auto"]},showDelay:{control:{type:"number",min:0,max:2e3,step:100}},hideDelay:{control:{type:"number",min:0,max:2e3,step:100}}},args:{position:"top",showDelay:0,hideDelay:100,maxWidth:"240px"}},l={render:e=>s.jsxs("div",{className:"glass-grid glass-gap-4 glass-justify-items-center",style:{width:"min(420px, calc(100vw - 64px))"},children:[s.jsx(t,{...e,content:"Changes are saved automatically.",children:s.jsxs(o,{tone:"blue",children:[s.jsx(h,{size:16,"aria-hidden":"true"}),"Save status"]})}),s.jsx(p,{children:"Changes are saved automatically."})]})},r={render:e=>s.jsx("div",{className:"glass-grid glass-grid-cols-1 sm:glass-grid-cols-2 glass-gap-4",style:{width:"min(520px, calc(100vw - 64px))"},children:["top","right","bottom","left"].map(a=>s.jsx(t,{position:a,content:`Tooltip on ${a}`,showDelay:e.showDelay,hideDelay:e.hideDelay,children:s.jsx(o,{tone:a==="left"?"green":"overlay",children:a})},a))})},n={render:e=>s.jsxs("div",{className:"glass-grid glass-gap-4 glass-justify-items-center",style:{width:"min(460px, calc(100vw - 64px))"},children:[s.jsx(t,{...e,content:s.jsxs("div",{className:"glass-grid glass-gap-2",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-font-semibold",children:[s.jsx(m,{size:16,"aria-hidden":"true"}),"Permission required"]}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Admin approval is needed before this release can be promoted."})]}),children:s.jsxs(o,{tone:"green",children:[s.jsx(m,{size:16,"aria-hidden":"true"}),"Review access"]})}),s.jsx(p,{children:"Admin approval is needed before this release can be promoted."})]})},i={render:e=>s.jsxs("div",{className:"glass-flex glass-flex-wrap glass-justify-center glass-gap-4",style:{width:"min(560px, calc(100vw - 64px))"},children:[s.jsxs(t,{content:s.jsx("p",{children:"Keyboard shortcut: Command K"}),showDelay:e.showDelay,hideDelay:e.hideDelay,children:[s.jsx(c,{asChild:!0,children:s.jsxs(o,{children:[s.jsx(y,{size:16,"aria-hidden":"true"}),"Command menu"]})}),s.jsx(g,{children:s.jsx("p",{children:"Keyboard shortcut: Command K"})})]}),s.jsxs(t,{content:s.jsx("p",{children:"Pointer actions stay inside the current canvas."}),position:"right",showDelay:e.showDelay,hideDelay:e.hideDelay,children:[s.jsx(c,{asChild:!0,children:s.jsxs(o,{tone:"blue",children:[s.jsx(x,{size:16,"aria-hidden":"true"}),"Pointer mode"]})}),s.jsx(g,{children:s.jsx("p",{children:"Pointer actions stay inside the current canvas."})})]})]}),args:{children:null}},d={render:e=>s.jsxs("div",{className:"glass-grid glass-gap-4",style:{width:"min(520px, calc(100vw - 64px))"},children:[s.jsxs(t,{content:s.jsxs("div",{className:"glass-grid glass-gap-1",children:[s.jsx("div",{className:"glass-font-semibold",children:"Custom trigger"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Non-button triggers are styled and focusable for keyboard users."})]}),showDelay:e.showDelay,hideDelay:e.hideDelay,children:[s.jsx(c,{asChild:!0,children:s.jsx("div",{role:"button",tabIndex:0,className:"glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard",children:"Focus or hover this custom glass trigger"})}),s.jsx(g,{children:s.jsx("p",{children:"Non-button triggers are styled and focusable for keyboard users."})})]}),s.jsx(p,{children:"Non-button triggers are styled and focusable for keyboard users."})]}),args:{children:null}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-gap-4 glass-justify-items-center" style={{
    width: "min(420px, calc(100vw - 64px))"
  }}>
      <GlassTooltip {...args} content="Changes are saved automatically.">
        <TooltipButton tone="blue">
          <Info size={16} aria-hidden="true" />
          Save status
        </TooltipButton>
      </GlassTooltip>
      <StaticTooltipPreview>Changes are saved automatically.</StaticTooltipPreview>
    </div>
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-2 glass-gap-4" style={{
    width: "min(520px, calc(100vw - 64px))"
  }}>
      {(["top", "right", "bottom", "left"] as const).map(position => <GlassTooltip key={position} position={position} content={\`Tooltip on \${position}\`} showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <TooltipButton tone={position === "left" ? "green" : "overlay"}>
            {position}
          </TooltipButton>
        </GlassTooltip>)}
    </div>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-gap-4 glass-justify-items-center" style={{
    width: "min(460px, calc(100vw - 64px))"
  }}>
      <GlassTooltip {...args} content={<div className="glass-grid glass-gap-2">
            <div className="glass-flex glass-items-center glass-gap-2 glass-font-semibold">
              <ShieldCheck size={16} aria-hidden="true" />
              Permission required
            </div>
            <p className="glass-text-sm glass-text-secondary">
              Admin approval is needed before this release can be promoted.
            </p>
          </div>}>
        <TooltipButton tone="green">
          <ShieldCheck size={16} aria-hidden="true" />
          Review access
        </TooltipButton>
      </GlassTooltip>
      <StaticTooltipPreview>
        Admin approval is needed before this release can be promoted.
      </StaticTooltipPreview>
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4" style={{
    width: "min(560px, calc(100vw - 64px))"
  }}>
      <GlassTooltip content={<p>Keyboard shortcut: Command K</p>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <TooltipButton>
            <Keyboard size={16} aria-hidden="true" />
            Command menu
          </TooltipButton>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Keyboard shortcut: Command K</p>
        </GlassTooltipContent>
      </GlassTooltip>

      <GlassTooltip content={<p>Pointer actions stay inside the current canvas.</p>} position="right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <TooltipButton tone="blue">
            <MousePointer2 size={16} aria-hidden="true" />
            Pointer mode
          </TooltipButton>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Pointer actions stay inside the current canvas.</p>
        </GlassTooltipContent>
      </GlassTooltip>
    </div>,
  args: {
    children: null
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-gap-4" style={{
    width: "min(520px, calc(100vw - 64px))"
  }}>
      <GlassTooltip content={<div className="glass-grid glass-gap-1">
            <div className="glass-font-semibold">Custom trigger</div>
            <p className="glass-text-sm glass-text-secondary">
              Non-button triggers are styled and focusable for keyboard users.
            </p>
          </div>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <div role="button" tabIndex={0} className="glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard">
            Focus or hover this custom glass trigger
          </div>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Non-button triggers are styled and focusable for keyboard users.</p>
        </GlassTooltipContent>
      </GlassTooltip>
      <StaticTooltipPreview>
        Non-button triggers are styled and focusable for keyboard users.
      </StaticTooltipPreview>
    </div>,
  args: {
    children: null
  }
}`,...d.parameters?.docs?.source}}};const S=["Default","Positions","RichContent","TooltipComponents","CustomTriggerContent"];export{d as CustomTriggerContent,l as Default,r as Positions,n as RichContent,i as TooltipComponents,S as __namedExportsOrder,P as default};
