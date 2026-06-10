import{j as s,r as i}from"./iframe-CYOgkXcw.js";import{G as c}from"./GlassButton-CbVeH3qr.js";import{G as l,a as p,b as u,c as n,d as r,e,f as m,g as h,h as g,i as d}from"./GlassDropdownMenu-By4Yev29.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassMaterial-DoGYSLPp.js";import"./LiquidGlassLayerProvider-BW_uJvCF.js";import"./a11y-DVEbkwtc.js";import"./GlassPredictiveEngine-DDj5Q34-.js";import"./GlassAchievementSystem-Ddg38AWw.js";import"./OptimizedGlassCore-BKU-VEbW.js";import"./deviceCapabilities-sc2QmrsH.js";import"./GlassBiometricAdaptation-DswFZfqZ.js";import"./MotionPreferenceContext-VqTOAcBc.js";import"./GlassEyeTracking-J-uxHMQs.js";import"./GlassSpatialAudio-D1FB6dLS.js";import"./MotionFramer-BieLescM.js";import"./utilsCore-OA5bONHE.js";import"./components-B7VYBO_y.js";import"./Positioner-BdW0N_EA.js";import"./index-YbLSzDuu.js";import"./index-C2fTenOC.js";import"./index-CWG1rEj-.js";import"./DismissableLayer-bym9Ru5E.js";import"./FocusScope-tGk_RKyF.js";const H={title:"Navigation/Glass Dropdown Menu",component:l,parameters:{layout:"centered",docs:{description:{component:"A glass morphism dropdown menu system with various menu item types."}}}},S=()=>{const[w,x]=i.useState(!0),[D,j]=i.useState(!1),[G,M]=i.useState("system");return s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Open Menu"})}),s.jsxs(u,{className:"w-56",children:[s.jsx(m,{children:"My Account"}),s.jsx(r,{}),s.jsxs(n,{children:["Profile",s.jsx(e,{children:"⇧⌘P"})]}),s.jsxs(n,{children:["Billing",s.jsx(e,{children:"⌘B"})]}),s.jsxs(n,{children:["Settings",s.jsx(e,{children:"⌘S"})]}),s.jsxs(n,{children:["Keyboard shortcuts",s.jsx(e,{children:"⌘K"})]}),s.jsx(r,{}),s.jsx(h,{checked:w,onCheckedChange:x,children:"Status Bar"}),s.jsx(h,{checked:D,onCheckedChange:j,children:"Activity Bar"}),s.jsx(r,{}),s.jsx(m,{children:"Theme"}),s.jsxs(g,{value:G,onValueChange:M,children:[s.jsx(d,{value:"light",children:"Light"}),s.jsx(d,{value:"dark",children:"Dark"}),s.jsx(d,{value:"system",children:"System"})]}),s.jsx(r,{}),s.jsxs(n,{children:["Log out",s.jsx(e,{children:"⇧⌘Q"})]})]})]})},a={render:()=>s.jsx(S,{})},o={render:()=>s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Menu with Icons"})}),s.jsxs(u,{className:"w-56",children:[s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📝"}),"New File",s.jsx(e,{children:"⌘N"})]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📁"}),"Open Folder",s.jsx(e,{children:"⌘O"})]}),s.jsx(r,{}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"💾"}),"Save",s.jsx(e,{children:"⌘S"})]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"🔄"}),"Refresh",s.jsx(e,{children:"⌘R"})]})]})]})},t={render:()=>s.jsxs(l,{children:[s.jsx(p,{asChild:!0,children:s.jsx(c,{variant:"outline",children:"Actions"})}),s.jsxs(u,{className:"w-56",children:[s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"✏️"}),"Edit"]}),s.jsxs(n,{children:[s.jsx("span",{className:"glass-mr-2",children:"📋"}),"Duplicate"]}),s.jsx(r,{}),s.jsxs(n,{variant:"destructive",children:[s.jsx("span",{className:"glass-mr-2",children:"🗑️"}),"Delete"]})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
