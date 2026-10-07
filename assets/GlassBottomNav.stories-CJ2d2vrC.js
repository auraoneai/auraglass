import{j as e}from"./iframe-Cqi-9gHA.js";import{G as d}from"./GlassBottomNav-D1UyFUAF.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-DSUfTc6z.js";import"./LiquidGlassMaterial-D0WtSJtx.js";import"./LiquidGlassLayerProvider-BPcOSNPa.js";import"./a11y-DBBBNlGj.js";import"./GlassPredictiveEngine-DWJWfFvG.js";import"./GlassAchievementSystem-a9__MuEd.js";import"./OptimizedGlassCore-CWgizUMZ.js";import"./deviceCapabilities-DlsmEFaF.js";import"./GlassBiometricAdaptation-CK7SW6sR.js";import"./MotionPreferenceContext-Da-updIo.js";import"./GlassEyeTracking-PHKeMwz0.js";import"./GlassSpatialAudio-CItqE0YP.js";import"./MotionFramer-CH53jSUC.js";import"./utilsCore-iuxhMr4m.js";import"./GlassBadge-WeCaOIgO.js";import"./GlassStack-IrIVHC4y.js";const r=[{id:"home",label:"Home",icon:e.jsx("span",{children:"H"}),activeIcon:e.jsx("span",{children:"H"})},{id:"search",label:"Search",icon:e.jsx("span",{children:"S"}),activeIcon:e.jsx("span",{children:"S"})},{id:"favorites",label:"Saved",icon:e.jsx("span",{children:"V"}),activeIcon:e.jsx("span",{children:"V"}),badge:"3",badgeVariant:"error"},{id:"profile",label:"Profile",icon:e.jsx("span",{children:"P"}),activeIcon:e.jsx("span",{children:"P"})}],H={title:"Navigation/Glass Bottom Nav",component:d,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Mobile bottom navigation shown inside a phone-sized app frame without native button chrome."}}},argTypes:{variant:{control:"select",options:["default","floating","minimal"]},size:{control:"select",options:["sm","md","lg"]},showLabels:{control:"boolean"},labelPosition:{control:"select",options:["below","beside"]},sticky:{control:"boolean"},safeArea:{control:"boolean"},activeId:{control:"select",options:["home","search","favorites","profile"]}}},m=(a,s)=>e.jsxs("button",{type:"button",style:{width:"100%",minHeight:52,appearance:"none",WebkitAppearance:"none",border:"1px solid rgba(255,255,255,0.3)",borderRadius:14,background:s?"rgba(255,255,255,0.32)":"rgba(255,255,255,0.14)",boxShadow:s?"0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.5)":"inset 0 1px 0 rgba(255,255,255,0.34)",color:"#0f172a",font:"inherit",display:"grid",placeItems:"center",gap:2,position:"relative"},children:[e.jsx("span",{style:{fontWeight:700},children:s&&a.activeIcon?a.activeIcon:a.icon}),e.jsx("span",{style:{fontSize:11,fontWeight:600},children:a.label}),a.badge&&e.jsx("span",{style:{position:"absolute",top:3,right:8,minWidth:18,height:18,borderRadius:999,background:"rgba(255,255,255,0.3)",color:"#0f172a",fontSize:11,lineHeight:"18px"},children:a.badge})]}),o=a=>e.jsx("div",{"data-bg":"light",style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box",background:"linear-gradient(145deg, #fafafa 0%, #f0f0f0 52%, #e6e6e6 100%)"},children:e.jsxs("div",{className:"glass-flex glass-w-full glass-max-w-sm glass-flex-col glass-overflow-hidden glass-rounded-[2rem] glass-border glass-border-white/40 glass-shadow-2xl",style:{width:"100%",maxWidth:390,minHeight:560,background:"rgba(255,255,255,0.24)",color:"#0f172a"},children:[e.jsxs("div",{className:"glass-flex-1 glass-space-y-4 glass-p-5",children:[e.jsxs("div",{children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",style:{color:"rgba(15,23,42,.7)"},children:"Mobile shell"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold",style:{color:"#0f172a"},children:"Daily overview"})]}),["Pipeline review","Saved accounts","Profile updates"].map(s=>e.jsx("div",{className:"glass-rounded-xl glass-p-4 glass-text-sm",style:{background:"rgba(255,255,255,0.24)",color:"#0f172a"},children:s},s))]}),e.jsx(d,{...a,className:"glass-w-full",sticky:!1,safeArea:!1,renderItem:m})]})}),t={render:a=>e.jsx(o,{...a}),args:{items:r,activeId:"home",variant:"default",size:"md",showLabels:!0,labelPosition:"below"}},i={render:a=>e.jsx(o,{...a}),args:{items:r,activeId:"search",variant:"floating",size:"md",showLabels:!0,labelPosition:"below"}},n={render:a=>e.jsx(o,{...a}),args:{items:r,activeId:"favorites",variant:"minimal",size:"md",showLabels:!0,labelPosition:"below"}},l={render:a=>e.jsx(o,{...a}),args:{items:r,activeId:"profile",variant:"default",size:"md",showLabels:!1}},c={render:a=>e.jsx(o,{...a}),args:{items:r,activeId:"home",variant:"default",size:"lg",showLabels:!0,labelPosition:"below"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'md',
    showLabels: true,
    labelPosition: 'below'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'search',
    variant: 'floating',
    size: 'md',
    showLabels: true,
    labelPosition: 'below'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'favorites',
    variant: 'minimal',
    size: 'md',
    showLabels: true,
    labelPosition: 'below'
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'profile',
    variant: 'default',
    size: 'md',
    showLabels: false
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'lg',
    showLabels: true,
    labelPosition: 'below'
  }
}`,...c.parameters?.docs?.source}}};const W=["Default","Floating","Minimal","WithoutLabels","LargeSize"];export{t as Default,i as Floating,c as LargeSize,n as Minimal,l as WithoutLabels,W as __namedExportsOrder,H as default};
