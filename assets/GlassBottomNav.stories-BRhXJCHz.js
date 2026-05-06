import{j as e}from"./iframe-mbNquNNc.js";import{G as n}from"./GlassBottomNav-Cbc5mGx8.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassButton-Dj39LQ52.js";import"./index-vu3jGQGZ.js";import"./LiquidGlassMaterial-D9GzyZBz.js";import"./LiquidGlassLayerProvider-DsdConQJ.js";import"./GlassPredictiveEngine-D3b8OhcD.js";import"./GlassAchievementSystem-BuLAT0VQ.js";import"./OptimizedGlassCore-CPvpl-y1.js";import"./GlassBiometricAdaptation-Cvck8KpT.js";import"./MotionPreferenceContext-BfJvNZar.js";import"./GlassEyeTracking-jVjspFjL.js";import"./GlassSpatialAudio-CRCXq6J3.js";import"./MotionFramer-BekP4wEp.js";import"./utilsCore-CTDrFk4s.js";import"./GlassBadge-C-NZxFZS.js";import"./GlassStack-BIz92N6_.js";const a=[{id:"home",label:"Home",icon:e.jsx("span",{children:"🏠"}),activeIcon:e.jsx("span",{children:"🏡"})},{id:"search",label:"Search",icon:e.jsx("span",{children:"🔍"}),activeIcon:e.jsx("span",{children:"🔎"})},{id:"favorites",label:"Favorites",icon:e.jsx("span",{children:"❤️"}),activeIcon:e.jsx("span",{children:"💖"}),badge:"3",badgeVariant:"error"},{id:"profile",label:"Profile",icon:e.jsx("span",{children:"👤"}),activeIcon:e.jsx("span",{children:"🙋‍♂️"})}],A={title:"Components/Navigation/GlassBottomNav",component:n,parameters:{layout:"centered",docs:{description:{component:"A glass morphism bottom navigation component with customizable items, variants, and interactive states."}}},argTypes:{variant:{control:"select",options:["default","floating","minimal"],description:"Navigation variant"},size:{control:"select",options:["sm","md","lg"],description:"Navigation size"},showLabels:{control:"boolean",description:"Whether to show navigation labels"},labelPosition:{control:"select",options:["below","beside"],description:"Position of labels relative to icons"},sticky:{control:"boolean",description:"Whether navigation is sticky"},safeArea:{control:"boolean",description:"Whether to add safe area padding"},activeId:{control:"select",options:["home","search","favorites","profile"],description:"Currently active navigation item"}}},s={args:{items:a,activeId:"home",variant:"default",size:"md",showLabels:!0,labelPosition:"below",sticky:!1,safeArea:!1}},t={args:{items:a,activeId:"search",variant:"floating",size:"md",showLabels:!0,labelPosition:"below",sticky:!1,safeArea:!1}},o={args:{items:a,activeId:"favorites",variant:"minimal",size:"md",showLabels:!0,labelPosition:"below",sticky:!1,safeArea:!1}},i={args:{items:a,activeId:"profile",variant:"default",size:"md",showLabels:!1,sticky:!1,safeArea:!1}},r={args:{items:a,activeId:"home",variant:"default",size:"lg",showLabels:!0,labelPosition:"below",sticky:!1,safeArea:!1}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
    sticky: false,
    safeArea: false
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: sampleNavItems,
    activeId: 'search',
    variant: 'floating',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
    sticky: false,
    safeArea: false
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    items: sampleNavItems,
    activeId: 'favorites',
    variant: 'minimal',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
    sticky: false,
    safeArea: false
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    items: sampleNavItems,
    activeId: 'profile',
    variant: 'default',
    size: 'md',
    showLabels: false,
    sticky: false,
    safeArea: false
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'lg',
    showLabels: true,
    labelPosition: 'below',
    sticky: false,
    safeArea: false
  }
}`,...r.parameters?.docs?.source}}};const N=["Default","Floating","Minimal","WithoutLabels","LargeSize"];export{s as Default,t as Floating,r as LargeSize,o as Minimal,i as WithoutLabels,N as __namedExportsOrder,A as default};
