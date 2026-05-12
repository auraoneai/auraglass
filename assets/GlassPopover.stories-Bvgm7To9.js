import{j as s}from"./iframe-D5XNSE8t.js";import{G as o}from"./GlassPopover-B890HhDS.js";import"./preload-helper-PPVm8Dsz.js";import"./FocusTrap-BmacVBPG.js";import"./LiquidGlassMaterial-PIWApLWo.js";import"./LiquidGlassLayerProvider-Cctd_86z.js";import"./MotionFramer-BJ26b83I.js";import"./utilsCore-BoSRIG9I.js";import"./OptimizedGlassCore-CXfAtOX-.js";import"./deviceCapabilities-QhTB8XNW.js";const l=({label:e,active:r})=>s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-6 glass-py-2",children:[s.jsx("span",{className:"glass-text-sm glass-text-primary",children:e}),s.jsx("span",{"aria-hidden":"true",className:"glass-relative glass-inline-flex glass-h-5 glass-w-9 glass-items-center glass-radius-full glass-border glass-border-subtle glass-surface-overlay",children:s.jsx("span",{className:"glass-h-4 glass-w-4 glass-radius-full glass-surface-blue",style:{transform:r?"translateX(16px)":"translateX(2px)"}})})]}),h={title:"Surfaces/Modals/Glass Popover",component:o,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A positioned glass popover for compact contextual controls and detail cards."}}},argTypes:{open:{control:"boolean"},placement:{control:{type:"select"},options:["top","top-start","top-end","right","right-start","right-end","bottom","bottom-start","bottom-end","left","left-start","left-end"]},trigger:{control:{type:"select"},options:["click","hover","focus","manual"]},showArrow:{control:"boolean"},animation:{control:{type:"select"},options:["fade","scale","slide"]}},args:{open:!0,placement:"bottom",trigger:"manual",showArrow:!0,animation:"scale"},decorators:[e=>s.jsx("div",{style:{width:"min(520px, calc(100vw - 48px))",minHeight:360,display:"grid",placeItems:"center"},children:s.jsx(e,{})})]},a={args:{content:s.jsxs("div",{className:"glass-w-72 glass-p-4",children:[s.jsx("h3",{className:"glass-text-sm glass-font-semibold glass-text-primary",children:"Project actions"}),s.jsx("p",{className:"glass-mt-1 glass-text-sm glass-text-secondary",children:"Quick operations for the selected workspace."}),s.jsx("div",{className:"glass-mt-4 glass-flex glass-flex-col glass-gap-2",children:["Duplicate board","Archive completed cards","Export report"].map(e=>s.jsx("button",{className:"glass-w-full glass-radius-md glass-surface-overlay glass-px-3 glass-py-2 glass-text-left glass-text-sm glass-text-primary",children:e},e))})]}),children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary",children:"Workspace menu"})}},t={args:{title:"Notification settings",description:"Tune project alerts without leaving the current view.",placement:"top-start",content:s.jsxs("div",{className:"glass-w-80 glass-p-4",children:[s.jsx(l,{label:"Assignment changes",active:!0}),s.jsx(l,{label:"Weekly digest",active:!0}),s.jsx(l,{label:"Release warnings"})]}),children:s.jsx("button",{className:"glass-px-4 glass-py-2 glass-radius-md glass-surface-overlay glass-text-primary",children:"Notification rules"})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    content: <div className="glass-w-72 glass-p-4">
        <h3 className="glass-text-sm glass-font-semibold glass-text-primary">
          Project actions
        </h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">
          Quick operations for the selected workspace.
        </p>
        <div className="glass-mt-4 glass-flex glass-flex-col glass-gap-2">
          {["Duplicate board", "Archive completed cards", "Export report"].map(item => <button key={item} className="glass-w-full glass-radius-md glass-surface-overlay glass-px-3 glass-py-2 glass-text-left glass-text-sm glass-text-primary">
                {item}
              </button>)}
        </div>
      </div>,
    children: <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary">
        Workspace menu
      </button>
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Notification settings",
    description: "Tune project alerts without leaving the current view.",
    placement: "top-start",
    content: <div className="glass-w-80 glass-p-4">
        <ToggleRow label="Assignment changes" active />
        <ToggleRow label="Weekly digest" active />
        <ToggleRow label="Release warnings" />
      </div>,
    children: <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-overlay glass-text-primary">
        Notification rules
      </button>
  }
}`,...t.parameters?.docs?.source}}};const y=["Default","WithSettings"];export{a as Default,t as WithSettings,y as __namedExportsOrder,h as default};
