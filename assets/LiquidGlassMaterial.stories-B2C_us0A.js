import{j as a}from"./iframe-C2Py7iTP.js";import{L as t}from"./LiquidGlassMaterial-CmfeHEzl.js";import"./preload-helper-PPVm8Dsz.js";import"./LiquidGlassLayerProvider-DpzmTZb0.js";const v={title:"Primitives/LiquidGlassMaterial",component:t,parameters:{layout:"centered",docs:{description:{component:`
# LiquidGlassMaterial

The **LiquidGlassMaterial** primitive provides Apple Liquid Glass parity+ with physically accurate refraction, environmental adaptation, and motion responsiveness. Built on advanced IOR physics and GPU acceleration.

## Key Features

- **Physical IOR System**: Real-time refraction using Snell's law calculations
- **Environmental Adaptation**: Content-aware tinting with WCAG compliance 
- **Motion Responsiveness**: Device tilt and user interaction effects
- **GPU Acceleration**: WebGL shaders with CSS fallbacks
- **Quality Tiers**: Ultra/High/Balanced/Efficient performance levels

## Material Variants

- **Regular**: Standard liquid glass with subtle refraction
- **Clear**: Ultra-transparent with minimal visual weight
        `}}},argTypes:{ior:{control:{type:"range",min:1,max:2,step:.01},description:"Index of Refraction (1.0-2.0)",defaultValue:1.45},thickness:{control:{type:"range",min:1,max:50,step:1},description:"Material thickness in pixels",defaultValue:12},tint:{control:"object",description:"RGBA tint color object",defaultValue:{r:0,g:0,b:0,a:.1}},variant:{control:{type:"select"},options:["regular","clear"],description:"Material density variant",defaultValue:"regular"},quality:{control:{type:"select"},options:["ultra","high","balanced","efficient"],description:"Rendering quality tier",defaultValue:"high"},environmentAdaptation:{control:"boolean",description:"Enable content-aware environmental adaptation",defaultValue:!0},motionResponsive:{control:"boolean",description:"Enable device motion responsiveness",defaultValue:!0},interactive:{control:"boolean",description:"Enable interaction-based micro-effects",defaultValue:!1}}},e={args:{ior:1.45,thickness:12,tint:{r:0,g:0,b:0,a:.1},variant:"regular",quality:"high",environmentAdaptation:!0,motionResponsive:!0,interactive:!1,className:"w-64 h-40 p-6",children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Liquid Glass"}),a.jsx("p",{className:"glass-text-sm opacity-80",children:"Experience Apple-quality liquid glass with physically accurate refraction and environmental adaptation."})]})}},i={args:{...e.args,ior:1.8,thickness:20,tint:{r:59,g:130,b:246,a:.15},children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"High IOR Glass"}),a.jsx("p",{className:"glass-text-sm opacity-80",children:"Enhanced refraction creates dramatic depth and crystal-like appearance."})]})}},l={args:{...e.args,ior:1.33,thickness:6,tint:{r:0,g:0,b:0,a:.02},variant:"clear",quality:"ultra",children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Ultra Clear"}),a.jsx("p",{className:"glass-text-sm opacity-80",children:"Minimal visual weight with water-like transparency."})]})}},r={args:{...e.args,interactive:!0,thickness:16,tint:{r:34,g:197,b:94,a:.12},children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-mb-2",children:"Interactive Surface"}),a.jsx("p",{className:"glass-text-sm opacity-80",children:"Hover and interact to see micro-refraction effects in action."})]})}},n={render:()=>a.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-6 glass-p-6",children:["ultra","high","balanced","efficient"].map(s=>a.jsx(t,{ior:1.48,thickness:12,tint:{r:0,g:0,b:0,a:.1},variant:"regular",quality:s,environmentAdaptation:!0,motionResponsive:!0,className:"glass-w-48 glass-h-32 glass-p-4",children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsxs("h4",{className:"glass-font-medium glass-mb-1 glass-capitalize",children:[s," Quality"]}),a.jsxs("p",{className:"glass-text-xs opacity-70",children:[s==="ultra"&&"Maximum fidelity",s==="high"&&"Balanced performance",s==="balanced"&&"Optimized rendering",s==="efficient"&&"Battery friendly"]})]})},s))})},c={render:()=>a.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-6 glass-p-6",children:[a.jsx(t,{ior:1.45,thickness:12,tint:{r:0,g:0,b:0,a:.1},variant:"regular",quality:"high",environmentAdaptation:!0,motionResponsive:!0,className:"glass-w-48 glass-h-32 glass-p-4",children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h4",{className:"glass-font-medium glass-mb-1",children:"Regular Variant"}),a.jsx("p",{className:"glass-text-xs opacity-70",children:"Standard liquid glass with subtle refraction and depth."})]})}),a.jsx(t,{ior:1.33,thickness:8,tint:{r:0,g:0,b:0,a:.05},variant:"clear",quality:"high",environmentAdaptation:!0,motionResponsive:!0,className:"glass-w-48 glass-h-32 glass-p-4",children:a.jsxs("div",{className:"glass-text-primary",children:[a.jsx("h4",{className:"glass-font-medium glass-mb-1",children:"Clear Variant"}),a.jsx("p",{className:"glass-text-xs opacity-70",children:"Ultra-transparent with minimal visual weight."})]})})]})},o={render:()=>a.jsx("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4 glass-p-6",children:[{name:"Blue",tint:{r:59,g:130,b:246,a:.12}},{name:"Green",tint:{r:34,g:197,b:94,a:.12}},{name:"Purple",tint:{r:168,g:85,b:247,a:.12}},{name:"Orange",tint:{r:249,g:115,b:22,a:.12}},{name:"Pink",tint:{r:236,g:72,b:153,a:.12}},{name:"Red",tint:{r:239,g:68,b:68,a:.12}}].map(({name:s,tint:d})=>a.jsx(t,{ior:1.48,thickness:14,tint:d,variant:"regular",quality:"high",environmentAdaptation:!0,motionResponsive:!0,className:"glass-w-32 glass-h-24 glass-p-3",children:a.jsx("div",{className:"glass-text-primary glass-text-center",children:a.jsx("h5",{className:"glass-text-sm glass-font-medium",children:s})})},s))})},g={render:()=>a.jsx("div",{className:"glass-grid glass-glass-grid-cols-4 glass-gap-4 glass-p-6",children:[4,8,16,32].map(s=>a.jsx(t,{ior:1.48,thickness:s,tint:{r:0,g:0,b:0,a:.08},variant:"regular",quality:"high",environmentAdaptation:!0,motionResponsive:!0,className:"glass-w-32 glass-h-24 glass-p-3",children:a.jsxs("div",{className:"glass-text-primary glass-text-center",children:[a.jsxs("h5",{className:"glass-text-sm glass-font-medium",children:[s,"px"]}),a.jsx("p",{className:"glass-text-xs opacity-70",children:"thickness"})]})},s))})},m={args:{...e.args,className:"w-96 h-64 p-8",children:a.jsxs("div",{className:"glass-text-primary glass-h-full glass-flex glass-flex-col glass-justify-between",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"glass-text-xl glass-font-bold glass-mb-3",children:"Liquid Glass Playground"}),a.jsx("p",{className:"glass-text-sm opacity-80 glass-mb-4",children:"Adjust the controls in the Storybook panel to experiment with different IOR values, thickness, tints, and quality settings."})]}),a.jsxs("div",{className:"glass-text-xs opacity-60",children:[a.jsx("p",{children:"🔬 Physics: Real-time IOR calculations"}),a.jsx("p",{children:"🌍 Adaptive: Content-aware environmental tinting"}),a.jsx("p",{children:"⚡ Performance: GPU-accelerated with CSS fallbacks"})]})]})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    ior: 1.45,
    thickness: 12,
    tint: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.1
    },
    variant: 'regular',
    quality: 'high',
    environmentAdaptation: true,
    motionResponsive: true,
    interactive: false,
    className: 'w-64 h-40 p-6',
    children: <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Liquid Glass</h3>
        <p className="glass-text-sm opacity-80">
          Experience Apple-quality liquid glass with physically accurate refraction and environmental adaptation.
        </p>
      </div>
  }
}`,...e.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    ior: 1.8,
    thickness: 20,
    tint: {
      r: 59,
      g: 130,
      b: 246,
      a: 0.15
    },
    children: <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">High IOR Glass</h3>
        <p className="glass-text-sm opacity-80">
          Enhanced refraction creates dramatic depth and crystal-like appearance.
        </p>
      </div>
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    ior: 1.33,
    thickness: 6,
    tint: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.02
    },
    variant: 'clear',
    quality: 'ultra',
    children: <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Ultra Clear</h3>
        <p className="glass-text-sm opacity-80">
          Minimal visual weight with water-like transparency.
        </p>
      </div>
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    interactive: true,
    thickness: 16,
    tint: {
      r: 34,
      g: 197,
      b: 94,
      a: 0.12
    },
    children: <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Interactive Surface</h3>
        <p className="glass-text-sm opacity-80">
          Hover and interact to see micro-refraction effects in action.
        </p>
      </div>
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-grid glass-glass-grid-cols-2 glass-gap-6 glass-p-6">
      {(['ultra', 'high', 'balanced', 'efficient'] as const).map(quality => <LiquidGlassMaterial key={quality} ior={1.48} thickness={12} tint={{
      r: 0,
      g: 0,
      b: 0,
      a: 0.1
    }} variant="regular" quality={quality} environmentAdaptation motionResponsive className="glass-w-48 glass-h-32 glass-p-4">
          <div className="glass-text-primary">
            <h4 className="glass-font-medium glass-mb-1 glass-capitalize">{quality} Quality</h4>
            <p className="glass-text-xs opacity-70">
              {quality === 'ultra' && 'Maximum fidelity'}
              {quality === 'high' && 'Balanced performance'}
              {quality === 'balanced' && 'Optimized rendering'}
              {quality === 'efficient' && 'Battery friendly'}
            </p>
          </div>
        </LiquidGlassMaterial>)}
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-grid glass-glass-grid-cols-2 glass-gap-6 glass-p-6">
      <LiquidGlassMaterial ior={1.45} thickness={12} tint={{
      r: 0,
      g: 0,
      b: 0,
      a: 0.1
    }} variant="regular" quality="high" environmentAdaptation motionResponsive className="glass-w-48 glass-h-32 glass-p-4">
        <div className="glass-text-primary">
          <h4 className="glass-font-medium glass-mb-1">Regular Variant</h4>
          <p className="glass-text-xs opacity-70">
            Standard liquid glass with subtle refraction and depth.
          </p>
        </div>
      </LiquidGlassMaterial>

      <LiquidGlassMaterial ior={1.33} thickness={8} tint={{
      r: 0,
      g: 0,
      b: 0,
      a: 0.05
    }} variant="clear" quality="high" environmentAdaptation motionResponsive className="glass-w-48 glass-h-32 glass-p-4">
        <div className="glass-text-primary">
          <h4 className="glass-font-medium glass-mb-1">Clear Variant</h4>
          <p className="glass-text-xs opacity-70">
            Ultra-transparent with minimal visual weight.
          </p>
        </div>
      </LiquidGlassMaterial>
    </div>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4 glass-p-6">
      {[{
      name: 'Blue',
      tint: {
        r: 59,
        g: 130,
        b: 246,
        a: 0.12
      }
    }, {
      name: 'Green',
      tint: {
        r: 34,
        g: 197,
        b: 94,
        a: 0.12
      }
    }, {
      name: 'Purple',
      tint: {
        r: 168,
        g: 85,
        b: 247,
        a: 0.12
      }
    }, {
      name: 'Orange',
      tint: {
        r: 249,
        g: 115,
        b: 22,
        a: 0.12
      }
    }, {
      name: 'Pink',
      tint: {
        r: 236,
        g: 72,
        b: 153,
        a: 0.12
      }
    }, {
      name: 'Red',
      tint: {
        r: 239,
        g: 68,
        b: 68,
        a: 0.12
      }
    }].map(({
      name,
      tint
    }) => <LiquidGlassMaterial key={name} ior={1.48} thickness={14} tint={tint} variant="regular" quality="high" environmentAdaptation motionResponsive className="glass-w-32 glass-h-24 glass-p-3">
          <div className="glass-text-primary glass-text-center">
            <h5 className="glass-text-sm glass-font-medium">{name}</h5>
          </div>
        </LiquidGlassMaterial>)}
    </div>
}`,...o.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="glass-grid glass-glass-grid-cols-4 glass-gap-4 glass-p-6">
      {[4, 8, 16, 32].map(thickness => <LiquidGlassMaterial key={thickness} ior={1.48} thickness={thickness} tint={{
      r: 0,
      g: 0,
      b: 0,
      a: 0.08
    }} variant="regular" quality="high" environmentAdaptation motionResponsive className="glass-w-32 glass-h-24 glass-p-3">
          <div className="glass-text-primary glass-text-center">
            <h5 className="glass-text-sm glass-font-medium">{thickness}px</h5>
            <p className="glass-text-xs opacity-70">thickness</p>
          </div>
        </LiquidGlassMaterial>)}
    </div>
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    className: 'w-96 h-64 p-8',
    children: <div className="glass-text-primary glass-h-full glass-flex glass-flex-col glass-justify-between">
        <div>
          <h2 className="glass-text-xl glass-font-bold glass-mb-3">Liquid Glass Playground</h2>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            Adjust the controls in the Storybook panel to experiment with different IOR values, 
            thickness, tints, and quality settings.
          </p>
        </div>
        <div className="glass-text-xs opacity-60">
          <p>🔬 Physics: Real-time IOR calculations</p>
          <p>🌍 Adaptive: Content-aware environmental tinting</p>
          <p>⚡ Performance: GPU-accelerated with CSS fallbacks</p>
        </div>
      </div>
  }
}`,...m.parameters?.docs?.source}}};const y=["Default","HighIOR","UltraClear","Interactive","QualityComparison","MaterialVariants","ColorfulTints","ThicknessVariations","Playground"];export{o as ColorfulTints,e as Default,i as HighIOR,r as Interactive,c as MaterialVariants,m as Playground,n as QualityComparison,g as ThicknessVariations,l as UltraClear,y as __namedExportsOrder,v as default};
