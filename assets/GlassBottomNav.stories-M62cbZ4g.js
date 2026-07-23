import{j as e}from"./iframe-CsQVqAwV.js";import{G as d}from"./GlassBottomNav-BfLXTZQf.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-BSJPvHfc.js";import"./LiquidGlassMaterial-CRcy5buz.js";import"./LiquidGlassLayerProvider-D2HBAC0J.js";import"./a11y-Hmy9mHoX.js";import"./GlassPredictiveEngine-f8zsKCVc.js";import"./GlassAchievementSystem-DfLKECHx.js";import"./OptimizedGlassCore-9QmO_Ix3.js";import"./deviceCapabilities-Buw_PRut.js";import"./GlassBiometricAdaptation-CLS2xsX8.js";import"./MotionPreferenceContext-CUUlsW5l.js";import"./GlassEyeTracking-gXPSzZth.js";import"./GlassSpatialAudio-DotJXLvx.js";import"./MotionFramer-DW55GtF3.js";import"./utilsCore-ClZUzpJN.js";import"./GlassBadge-DdMH6-sQ.js";import"./GlassStack-CI8Hw_i6.js";const r=[{id:"home",label:"Home",icon:e.jsx("span",{children:"H"}),activeIcon:e.jsx("span",{children:"H"})},{id:"search",label:"Search",icon:e.jsx("span",{children:"S"}),activeIcon:e.jsx("span",{children:"S"})},{id:"favorites",label:"Saved",icon:e.jsx("span",{children:"V"}),activeIcon:e.jsx("span",{children:"V"}),badge:"3",badgeVariant:"error"},{id:"profile",label:"Profile",icon:e.jsx("span",{children:"P"}),activeIcon:e.jsx("span",{children:"P"})}],H={title:"Navigation/Glass Bottom Nav",component:d,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Mobile bottom navigation shown inside a phone-sized app frame without native button chrome."}}},argTypes:{variant:{control:"select",options:["default","floating","minimal"]},size:{control:"select",options:["sm","md","lg"]},showLabels:{control:"boolean"},labelPosition:{control:"select",options:["below","beside"]},sticky:{control:"boolean"},safeArea:{control:"boolean"},activeId:{control:"select",options:["home","search","favorites","profile"]}}},m=(s,a)=>e.jsxs("button",{type:"button",style:{width:"100%",minHeight:52,border:0,borderRadius:14,background:a?"#bfdbfe":"transparent",color:a?"#0f172a":"#cbd5e1",font:"inherit",display:"grid",placeItems:"center",gap:2,position:"relative"},children:[e.jsx("span",{style:{fontWeight:700},children:a&&s.activeIcon?s.activeIcon:s.icon}),e.jsx("span",{style:{fontSize:11,fontWeight:600},children:s.label}),s.badge&&e.jsx("span",{style:{position:"absolute",top:3,right:8,minWidth:18,height:18,borderRadius:999,background:"#ef4444",color:"#fff",fontSize:11,lineHeight:"18px"},children:s.badge})]}),o=s=>e.jsx("div",{"data-bg":"dark",style:{minHeight:"100vh",display:"grid",placeItems:"center",padding:16,boxSizing:"border-box",background:"linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.92) 48%, rgba(8,47,73,0.9) 100%)"},children:e.jsxs("div",{className:"glass-flex glass-w-full glass-max-w-sm glass-flex-col glass-overflow-hidden glass-rounded-[2rem] glass-border glass-border-white/40 glass-shadow-2xl",style:{width:"100%",maxWidth:390,minHeight:560,background:"rgba(15,23,42,0.78)",color:"#f8fafc"},children:[e.jsxs("div",{className:"glass-flex-1 glass-space-y-4 glass-p-5",children:[e.jsxs("div",{children:[e.jsx("p",{className:"glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide",style:{color:"#cbd5e1"},children:"Mobile shell"}),e.jsx("h3",{className:"glass-text-xl glass-font-semibold",style:{color:"#f8fafc"},children:"Daily overview"})]}),["Pipeline review","Saved accounts","Profile updates"].map(a=>e.jsx("div",{className:"glass-rounded-xl glass-p-4 glass-text-sm",style:{background:"rgba(255,255,255,0.1)",color:"#f8fafc"},children:a},a))]}),e.jsx(d,{...s,className:"glass-w-full",sticky:!1,safeArea:!1,renderItem:m})]})}),t={render:s=>e.jsx(o,{...s}),args:{items:r,activeId:"home",variant:"default",size:"md",showLabels:!0,labelPosition:"below"}},i={render:s=>e.jsx(o,{...s}),args:{items:r,activeId:"search",variant:"floating",size:"md",showLabels:!0,labelPosition:"below"}},n={render:s=>e.jsx(o,{...s}),args:{items:r,activeId:"favorites",variant:"minimal",size:"md",showLabels:!0,labelPosition:"below"}},l={render:s=>e.jsx(o,{...s}),args:{items:r,activeId:"profile",variant:"default",size:"md",showLabels:!1}},c={render:s=>e.jsx(o,{...s}),args:{items:r,activeId:"home",variant:"default",size:"lg",showLabels:!0,labelPosition:"below"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
