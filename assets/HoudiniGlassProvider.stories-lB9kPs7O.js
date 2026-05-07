import{j as s}from"./iframe-BJUPYBdj.js";import{H as r,a as e,b as c}from"./HoudiniGlassCard-Bjwex-GS.js";import"./preload-helper-PPVm8Dsz.js";import"./settings-BYyqZtJT.js";import"./createLucideIcon-BZQYpAY8.js";import"./eye-CTrLjdRc.js";import"./gauge-Cw2Ll_X3.js";import"./zap-yQwe-uVY.js";import"./droplets-CK6hGv4B.js";import"./layers-DiADD5wL.js";import"./sun-BI92iy7b.js";import"./sparkles-DwBXWgIJ.js";const C={title:"Effects + Advanced/Houdini Glass Provider",component:r,parameters:{layout:"fullscreen",docs:{description:{component:"Native CSS Houdini integration for browser-accelerated glass effects with Paint Worklets and Properties API."}}},argTypes:{defaultPreset:{control:{type:"select",options:["standard","frosted","minimal","heavy","crystal"]},description:"Initial glass preset"},performanceMode:{control:"boolean",description:"Enable performance optimizations"},debugMode:{control:"boolean",description:"Enable debug interface"}}},d=({children:a,maxWidth:n=1120})=>s.jsxs("div",{className:"houdini-story-frame",style:{width:"100%",height:"100vh",minHeight:0,padding:"clamp(20px, 4vw, 40px)",boxSizing:"border-box",overflowX:"hidden",overflowY:"auto",color:"inherit"},children:[s.jsx("div",{style:{width:"min(100%, "+n+"px)",margin:"0 auto"},children:a}),s.jsx("style",{children:`
      .houdini-story-frame .glass-foundation-complete {
        background-color: rgba(15, 23, 42, 0.78) !important;
      }

      [data-storybook-preview-mode="dark"] .houdini-story-frame,
      [data-storybook-preview-mode="high-contrast"] .houdini-story-frame {
        color: #f8fafc;
      }

      [data-storybook-preview-mode="dark"] .houdini-story-frame button,
      [data-storybook-preview-mode="high-contrast"] .houdini-story-frame button {
        background: rgba(31, 41, 55, 0.76) !important;
        background-color: rgba(31, 41, 55, 0.76) !important;
        color: #f8fafc !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame {
        color: #0f172a;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame h1,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h2,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h3,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h4,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame [class*="glass-text-primary"],
      [data-storybook-preview-mode="liquid"] .houdini-story-frame [class*="glass-text-secondary"] {
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame .glass-foundation-complete {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(226, 232, 240, 0.54)), rgba(255, 255, 255, 0.64) !important;
        background-color: rgba(255, 255, 255, 0.64) !important;
        border-color: rgba(15, 23, 42, 0.16) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame button {
        background: rgba(255, 255, 255, 0.66) !important;
        background-color: rgba(255, 255, 255, 0.66) !important;
        border-color: rgba(15, 23, 42, 0.18) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame button [class*="glass-text-secondary"] {
        color: #334155 !important;
      }
    `})]}),t={args:{defaultPreset:"standard",enabledEffects:["frost","caustics","border"],performanceMode:!1,debugMode:!0},render:a=>s.jsx(r,{...a,children:s.jsx(d,{children:s.jsx(c,{})})})},i={args:{defaultPreset:"frosted",enabledEffects:["frost","caustics"],performanceMode:!1,debugMode:!1},render:a=>s.jsx(r,{...a,children:s.jsx(d,{maxWidth:1180,children:s.jsxs("div",{children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12",style:{color:"#f8fafc",marginBottom:32},children:"Houdini Glass Card Gallery"}),s.jsxs("div",{className:"glass-grid glass-gap-6",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:24},children:[s.jsx(e,{title:"Standard Glass",description:"Clean, balanced glass effect",preset:"standard",effects:["frost"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"✨"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Standard glass with subtle frost effect and smooth interactions."})]})}),s.jsx(e,{title:"Frosted Glass",description:"Enhanced frost with caustics",preset:"frosted",effects:["frost","caustics"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"❄️"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Frosted glass with dynamic caustics and enhanced blur."})]})}),s.jsx(e,{title:"Crystal Clear",description:"Ultra-clear minimal glass",preset:"crystal",effects:["border"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"💎"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Crystal clear glass with minimal blur and elegant borders."})]})}),s.jsx(e,{title:"Heavy Glass",description:"Maximum glass intensity",preset:"heavy",effects:["frost","caustics","border"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🔮"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Heavy glass with maximum blur, multiple effects, and rich depth."})]})}),s.jsx(e,{title:"Minimal Glass",description:"Subtle, clean appearance",preset:"minimal",effects:["frost"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🌟"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Minimal glass with subtle effects and clean aesthetics."})]})}),s.jsx(e,{title:"Performance Mode",description:"Optimized for performance",preset:"standard",effects:["frost"],showControls:!0,interactive:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"⚡"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Performance-optimized glass with reduced effects for smooth rendering."})]})})]})]})})})},l={args:{defaultPreset:"minimal",enabledEffects:["frost"],performanceMode:!0,debugMode:!0},render:a=>s.jsx(r,{...a,children:s.jsx(d,{maxWidth:900,children:s.jsxs("div",{children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8",style:{color:"#f8fafc",marginBottom:28},children:"Performance Optimized Glass"}),s.jsxs("div",{className:"glass-grid glass-gap-6",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:24},children:[s.jsx(e,{title:"Optimized Card",description:"Performance-optimized effects",preset:"minimal",effects:["frost"],showControls:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-2",children:"🚀 Fast Rendering"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm glass-mb-4",children:"Reduced effects for maximum performance while maintaining visual appeal."}),s.jsx("div",{className:"glass-text-xs glass-text-primary glass-surface-green/10 glass-px-2 glass-py-1 glass-radius",children:"Performance Mode Active"})]})}),s.jsx(e,{title:"Debug Info",description:"Performance monitoring",preset:"minimal",effects:["border"],showControls:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-2",children:"📊 Performance Stats"}),s.jsxs("div",{className:"glass-space-y-2 glass-text-sm",children:[s.jsxs("div",{className:"glass-flex glass-justify-between",children:[s.jsx("span",{className:"glass-text-primary/60",children:"FPS:"}),s.jsx("span",{className:"glass-text-primary",children:"60"})]}),s.jsxs("div",{className:"glass-flex glass-justify-between",children:[s.jsx("span",{className:"glass-text-primary/60",children:"Memory:"}),s.jsx("span",{className:"glass-text-primary",children:"Low"})]}),s.jsxs("div",{className:"glass-flex glass-justify-between",children:[s.jsx("span",{className:"glass-text-primary/60",children:"Effects:"}),s.jsx("span",{className:"glass-text-primary",children:"Optimized"})]})]})]})})]})]})})})},o={args:{defaultPreset:"standard",enabledEffects:["frost","caustics"],performanceMode:!1,debugMode:!0,defaultProperties:{"--glass-background":"rgba(255, 20, 147, 0.1)","--glass-border":"rgba(255, 20, 147, 0.3)","--glass-blur":"25px"}},render:a=>s.jsx(r,{...a,children:s.jsx(d,{maxWidth:900,children:s.jsxs("div",{children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8",style:{color:"#f8fafc",marginBottom:28},children:"Custom Glass Properties"}),s.jsxs("div",{className:"glass-grid glass-gap-6",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:24},children:[s.jsx(e,{title:"Custom Colors",description:"Deep pink glass theme",preset:"standard",effects:["frost","caustics"],showControls:!0,customProperties:{"--glass-background":"rgba(255, 20, 147, 0.15)","--glass-border":"rgba(255, 20, 147, 0.4)","--glass-blur":"30px"},children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("div",{className:"glass-text-4xl glass-mb-4",children:"🌸"}),s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-2",children:"Custom Theme"}),s.jsx("p",{className:"glass-text-primary/80 glass-text-sm",children:"Custom CSS properties allow for completely personalized glass effects."})]})}),s.jsx(e,{title:"Property Inspector",description:"View custom properties",preset:"standard",effects:["border"],showControls:!0,children:s.jsxs("div",{className:"glass-p-4",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary glass-mb-2",children:"🎨 Active Properties"}),s.jsxs("div",{className:"space-y-1 glass-text-xs glass-text-primary/70",children:[s.jsx("div",{children:"--glass-background: rgba(255, 20, 147, 0.1)"}),s.jsx("div",{children:"--glass-border: rgba(255, 20, 147, 0.3)"}),s.jsx("div",{children:"--glass-blur: 25px"}),s.jsx("div",{children:"--glass-animation-speed: 1"})]})]})})]})]})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    defaultPreset: 'standard',
    enabledEffects: ['frost', 'caustics', 'border'],
    performanceMode: false,
    debugMode: true
  },
  render: args => <HoudiniGlassProvider {...args}>
      <HoudiniStoryFrame>
        <HoudiniGlassShowcase />
      </HoudiniStoryFrame>
    </HoudiniGlassProvider>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    defaultPreset: 'frosted',
    enabledEffects: ['frost', 'caustics'],
    performanceMode: false,
    debugMode: false
  },
  render: args => <HoudiniGlassProvider {...args}>
      <HoudiniStoryFrame maxWidth={1180}>
        <div>
          <h1 className="glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12" style={{
          color: '#f8fafc',
          marginBottom: 32
        }}>
            Houdini Glass Card Gallery
          </h1>

          <div className="glass-grid glass-gap-6" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
            <HoudiniGlassCard title="Standard Glass" description="Clean, balanced glass effect" preset="standard" effects={['frost']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">✨</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Standard glass with subtle frost effect and smooth interactions.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Frosted Glass" description="Enhanced frost with caustics" preset="frosted" effects={['frost', 'caustics']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">❄️</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Frosted glass with dynamic caustics and enhanced blur.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Crystal Clear" description="Ultra-clear minimal glass" preset="crystal" effects={['border']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">💎</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Crystal clear glass with minimal blur and elegant borders.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Heavy Glass" description="Maximum glass intensity" preset="heavy" effects={['frost', 'caustics', 'border']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🔮</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Heavy glass with maximum blur, multiple effects, and rich depth.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Minimal Glass" description="Subtle, clean appearance" preset="minimal" effects={['frost']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🌟</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Minimal glass with subtle effects and clean aesthetics.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Performance Mode" description="Optimized for performance" preset="standard" effects={['frost']} showControls={true} interactive={true}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">⚡</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Performance-optimized glass with reduced effects for smooth rendering.
                </p>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
    </HoudiniGlassProvider>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    defaultPreset: 'minimal',
    enabledEffects: ['frost'],
    performanceMode: true,
    debugMode: true
  },
  render: args => <HoudiniGlassProvider {...args}>
      <HoudiniStoryFrame maxWidth={900}>
        <div>
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8" style={{
          color: '#f8fafc',
          marginBottom: 28
        }}>
            Performance Optimized Glass
          </h1>

          <div className="glass-grid glass-gap-6" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24
        }}>
            <HoudiniGlassCard title="Optimized Card" description="Performance-optimized effects" preset="minimal" effects={['frost']} showControls={true}>
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">🚀 Fast Rendering</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Reduced effects for maximum performance while maintaining visual appeal.
                </p>
                <div className="glass-text-xs glass-text-primary glass-surface-green/10 glass-px-2 glass-py-1 glass-radius">
                  Performance Mode Active
                </div>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Debug Info" description="Performance monitoring" preset="minimal" effects={['border']} showControls={true}>
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">📊 Performance Stats</h3>
                <div className="glass-space-y-2 glass-text-sm">
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">FPS:</span>
                    <span className="glass-text-primary">60</span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">Memory:</span>
                    <span className="glass-text-primary">Low</span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">Effects:</span>
                    <span className="glass-text-primary">Optimized</span>
                  </div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
    </HoudiniGlassProvider>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    defaultPreset: 'standard',
    enabledEffects: ['frost', 'caustics'],
    performanceMode: false,
    debugMode: true,
    defaultProperties: {
      '--glass-background': 'rgba(255, 20, 147, 0.1)',
      '--glass-border': 'rgba(255, 20, 147, 0.3)',
      '--glass-blur': '25px'
    }
  },
  render: args => <HoudiniGlassProvider {...args}>
      <HoudiniStoryFrame maxWidth={900}>
        <div>
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8" style={{
          color: '#f8fafc',
          marginBottom: 28
        }}>
            Custom Glass Properties
          </h1>

          <div className="glass-grid glass-gap-6" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24
        }}>
            <HoudiniGlassCard title="Custom Colors" description="Deep pink glass theme" preset="standard" effects={['frost', 'caustics']} showControls={true} customProperties={{
            '--glass-background': 'rgba(255, 20, 147, 0.15)',
            '--glass-border': 'rgba(255, 20, 147, 0.4)',
            '--glass-blur': '30px'
          }}>
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🌸</div>
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">Custom Theme</h3>
                <p className="glass-text-primary/80 glass-text-sm">
                  Custom CSS properties allow for completely personalized glass effects.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard title="Property Inspector" description="View custom properties" preset="standard" effects={['border']} showControls={true}>
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">🎨 Active Properties</h3>
                <div className="space-y-1 glass-text-xs glass-text-primary/70">
                  <div>--glass-background: rgba(255, 20, 147, 0.1)</div>
                  <div>--glass-border: rgba(255, 20, 147, 0.3)</div>
                  <div>--glass-blur: 25px</div>
                  <div>--glass-animation-speed: 1</div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
    </HoudiniGlassProvider>
}`,...o.parameters?.docs?.source}}};const w=["Showcase","CardGallery","PerformanceMode","CustomProperties"];export{i as CardGallery,o as CustomProperties,l as PerformanceMode,t as Showcase,w as __namedExportsOrder,C as default};
