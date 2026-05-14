import{j as s,r as i}from"./iframe-CtRSFJTE.js";import{G as c}from"./GlassButton-DD-ftUX_.js";import{G as l,a as p,b as u,c as n,d as r,e,f as m,g as h,h as g,i as d}from"./GlassDropdownMenu-Co6YHO-g.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-Y9gB2z_t.js";import"./LiquidGlassLayerProvider-BvezYu1G.js";import"./a11y-vcEGPYia.js";import"./GlassPredictiveEngine-CNJ6uPG_.js";import"./GlassAchievementSystem-b48HUKbq.js";import"./OptimizedGlassCore-gF2O5jvN.js";import"./deviceCapabilities-DvV84Xg1.js";import"./GlassBiometricAdaptation-B6aineW4.js";import"./MotionPreferenceContext-DqZUVy35.js";import"./GlassEyeTracking-BijQUaQZ.js";import"./GlassSpatialAudio-u9ax0mAo.js";import"./MotionFramer-BHAMyJdN.js";import"./utilsCore-DsYObD65.js";import"./components-DBB_poJ4.js";import"./Positioner-t13A73TJ.js";import"./index-Da3OXt8D.js";import"./index-Di_IhcHj.js";import"./index-CWG1rEj-.js";import"./DismissableLayer-CLQZL6Ez.js";import"./FocusScope-juSAhWZm.js";const H={title:"Navigation/Glass Dropdown Menu",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism dropdown menu system with various menu item types."}}}},S=()=>{const[w,x]=i.useState(!0),[D,j]=i.useState(!1),[G,M]=i.useState("system");return s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Open Menu"})}),s.jsxs(u,{className:"w-56",children:[s.jsx(m,{children:"My Account"}),s.jsx(r,{}),s.jsxs(n,{children:["Profile",s.jsx(e,{children:"⇧⌘P"})]}),s.jsxs(n,{children:["Billing",s.jsx(e,{children:"⌘B"})]}),s.jsxs(n,{children:["Settings",s.jsx(e,{children:"⌘S"})]}),s.jsxs(n,{children:["Keyboard shortcuts",s.jsx(e,{children:"⌘K"})]}),s.jsx(r,{}),s.jsx(h,{checked:w,onCheckedChange:x,children:"Status Bar"}),s.jsx(h,{checked:D,onCheckedChange:j,children:"Activity Bar"}),s.jsx(r,{}),s.jsx(m,{children:"Theme"}),s.jsxs(g,{value:G,onValueChange:M,children:[s.jsx(d,{value:"light",children:"Light"}),s.jsx(d,{value:"dark",children:"Dark"}),s.jsx(d,{value:"system",children:"System"})]}),s.jsx(r,{}),s.jsxs(n,{children:["Log out",s.jsx(e,{children:"⇧⌘Q"})]})]})]})},a={render:()=>s.jsx(S,{})},o={render:()=>s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Menu with Icons"})}),s.jsxs(u,{className:"w-56",children:[s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📝"}),"New File",s.jsx(e,{children:"⌘N"})]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📁"}),"Open Folder",s.jsx(e,{children:"⌘O"})]}),s.jsx(r,{}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"💾"}),"Save",s.jsx(e,{children:"⌘S"})]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"🔄"}),"Refresh",s.jsx(e,{children:"⌘R"})]})]})]})},t={render:()=>s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Actions"})}),s.jsxs(u,{className:"w-56",children:[s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"✏️"}),"Edit"]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📋"}),"Duplicate"]}),s.jsx(r,{}),s.jsxs(n,{variant:"destructive",children:[s.jsx("span",{className:"glass-mr-2",children:"🗑️"}),"Delete"]})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <BasicDropdown />
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <GlassDropdownMenu>
      <GlassDropdownMenuTrigger asChild>
        <GlassButton variant="outline">Menu with Icons</GlassButton>
      </GlassDropdownMenuTrigger>

      <GlassDropdownMenuContent className="w-56">
        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📝</span>
          New File
          <GlassDropdownMenuShortcut>⌘N</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📁</span>
          Open Folder
          <GlassDropdownMenuShortcut>⌘O</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">💾</span>
          Save
          <GlassDropdownMenuShortcut>⌘S</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">🔄</span>
          Refresh
          <GlassDropdownMenuShortcut>⌘R</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <GlassDropdownMenu>
      <GlassDropdownMenuTrigger asChild>
        <GlassButton variant="outline">Actions</GlassButton>
      </GlassDropdownMenuTrigger>

      <GlassDropdownMenuContent className="w-56">
        <GlassDropdownMenuItem>
          <span className="glass-mr-2">✏️</span>
          Edit
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📋</span>
          Duplicate
        </GlassDropdownMenuItem>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuItem variant="destructive">
          <span className="glass-mr-2">🗑️</span>
          Delete
        </GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
}`,...t.parameters?.docs?.source}}};const J=["Default","WithIcons","DestructiveItems"];export{a as Default,t as DestructiveItems,o as WithIcons,J as __namedExportsOrder,H as default};
