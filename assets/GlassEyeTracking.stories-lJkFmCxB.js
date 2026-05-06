import{j as s,r as y}from"./iframe-OZreUAtx.js";import{f as h}from"./index-CLSxArU-.js";import{G as r,a as p,b as g,c as z,u as G}from"./GlassEyeTracking-DEo0jGT7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ByImX2pa.js";const S={title:"Advanced/Consciousness Interface/Eye Tracking",component:r,parameters:{layout:"fullscreen",docs:{description:{component:`
# Glass Eye Tracking

Gaze-responsive glass effects using WebGazer.js for camera-based eye tracking.

## Features
- **Camera-Based Eye Tracking** - Uses device camera with WebGazer.js for gaze detection
- **Calibration System** - 9-point calibration with visual feedback and accuracy measurement
- **Gaze-Responsive Components** - Components that react to where users look
- **Real-time Visualization** - Debug overlay showing gaze regions and interactions
- **Spatial Interaction Regions** - Define areas that respond to user gaze with intensity levels

## Technical Details
- **WebGazer Integration** - Loads WebGazer.js dynamically for eye tracking
- **TensorFlow Face Mesh** - Uses TFFacemesh tracker for accurate gaze prediction
- **Ridge Regression** - Machine learning model for gaze point prediction
- **Fixation Detection** - Distinguishes between fixations, saccades, and pursuit movements
- **Session Persistence** - Saves calibration data across browser sessions

## Privacy & Security
- **Local Processing** - All eye tracking happens locally in the browser
- **No Data Transmission** - Gaze data never leaves the user's device
- **User Consent** - Requires explicit camera permission
- **Calibration Required** - Must calibrate before tracking begins

## Browser Support
- **Modern Browsers** - Chrome, Firefox, Edge, Safari with WebRTC support
- **Camera Access** - Requires getUserMedia API support
- **WebAssembly** - TensorFlow.js requires WASM support
        `}}},argTypes:{autoInitialize:{control:"boolean",description:"Automatically initialize eye tracking on load"}},args:{onGazeInteraction:h()},tags:["autodocs"]};function k(){const{isInitialized:a,isCalibrating:e,activeInteractions:l}=G(),[u,v]=y.useState(!0),[f,b]=y.useState(0),N=t=>{b(i=>i+1),console.log(`Gaze entered region: ${t}`)};return s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary",children:"👁️ Glass Eye Tracking"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"Gaze-responsive interface that reacts to where you look"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4",children:[s.jsxs("div",{className:"flex items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("div",{className:`w-2 h-2 glass-radius-full ${a?"bg-green-400":"bg-red-400"}`}),s.jsx("span",{className:"glass-text-sm glass-text-primary",children:a?"Eye Tracking Active":"Not Initialized"})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("div",{className:`w-2 h-2 glass-radius-full ${e?"bg-yellow-400":"bg-blue-400"}`}),s.jsx("span",{className:"glass-text-sm glass-text-primary",children:e?"Calibrating":"Ready"})]}),s.jsx("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:["👁️ Gaze Interactions: ",f]})})]}),s.jsx("div",{className:"glass-flex glass-justify-center glass-gap-4",children:s.jsx("button",{onClick:()=>v(!u),className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:u?"👁️ Hide Gaze Debug":"👁️ Show Gaze Debug"})})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-6",children:Array.from({length:8},(t,i)=>s.jsxs(p,{regionId:`gaze-card-${i}`,onGazeEnter:()=>N(`gaze-card-${i}`),onGazeLeave:()=>console.log(`Gaze left gaze-card-${i}`),onGazeIntensityChange:j=>console.log(`Gaze intensity: ${j}`),glassIntensity:!0,glassRadius:!0,glassBlur:!0,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 glass-cursor-pointer glass-min-glass-h-32",children:[s.jsx("div",{className:"glass-text-3xl",children:["👁️","🔍","👀","🎯","✨","💎","🌟","🔮"][i]}),s.jsxs("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:["Gaze Zone ",i+1]}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Look at me to see the gaze effect!"})]},`gaze-card-${i}`))}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsxs("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:["👁️ Active Gaze Interactions (",l.length,")"]}),l.length>0?s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-4",children:l.map(t=>s.jsxs("div",{className:"glass-surface-secondary glass-radius-md glass-p-4 glass-gap-2",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between",children:[s.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:t.region.id}),s.jsx("span",{className:"glass-text-xs glass-text-secondary glass-capitalize",children:t.type})]}),s.jsxs("div",{className:"glass-gap-1",children:[s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-tertiary",children:[s.jsx("span",{children:"Duration:"}),s.jsxs("span",{children:[t.duration,"ms"]})]}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-tertiary",children:[s.jsx("span",{children:"Intensity:"}),s.jsxs("span",{children:[(t.intensity*100).toFixed(0),"%"]})]}),s.jsx("div",{className:"glass-w-full glass-surface-primary glass-radius-sm glass-h-1 overflow-hidden",children:s.jsx("div",{className:"glass-h-full glass-surface-blue transition-all duration-300",style:{width:`${t.intensity*100}%`}})})]})]},t.region.id))}):s.jsx("div",{className:"glass-text-center glass-text-sm glass-text-secondary glass-py-8",children:"Look at the gaze-responsive elements above to see active interactions..."})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"📋 How to Use Eye Tracking"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Setup Steps:"}),s.jsxs("ol",{className:"list-decimal list-inside glass-gap-2 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"Grant camera permission when prompted"}),s.jsx("li",{children:"Complete the 9-point calibration process"}),s.jsx("li",{children:"Look at different elements to see gaze effects"}),s.jsx("li",{children:"Toggle visualization to see debug overlay"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Tips for Best Results:"}),s.jsxs("ul",{className:"list-disc list-inside glass-gap-2 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"Ensure good lighting on your face"}),s.jsx("li",{children:"Keep your head relatively still"}),s.jsx("li",{children:"Look directly at calibration points"}),s.jsx("li",{children:"Recalibrate if accuracy seems low"})]})]})]})]}),s.jsx(g,{show:u})]})}const c={render:a=>s.jsx(r,{...a,children:s.jsx(k,{})}),args:{autoInitialize:!1,onGazeInteraction:h()}},n={render:a=>s.jsx(r,{...a,children:s.jsx("div",{className:"glass-min-glass-h-screen glass-p-8",children:s.jsxs("div",{className:"glass-text-center space-y-6",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary",children:"Eye Tracking Calibration"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"Complete calibration to enable gaze-responsive effects"}),s.jsx(z,{onComplete:()=>{console.log("✅ Eye tracking calibration completed!"),alert("Calibration completed! You can now use gaze interactions.")}})]})})}),args:{autoInitialize:!0,onGazeInteraction:h()},parameters:{docs:{description:{story:"Shows the calibration flow required before eye tracking can be used."}}}},o={render:a=>s.jsxs(r,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Subtle Eye Tracking Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Gentle gaze effects with reduced intensity and minimal visual feedback"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:["Article Card","Product Info","Call to Action"].map((e,l)=>s.jsxs(p,{regionId:`subtle-${l}`,glassIntensity:!0,glassRadius:!1,glassBlur:!1,className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-gap-4",children:[s.jsx("div",{className:"glass-text-xl",children:"📄"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:e}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"This content subtly responds to your gaze with minimal effects."}),s.jsx("div",{className:"glass-text-xs glass-text-tertiary",children:"Look at this card to see subtle gaze responsiveness"})]},e))})]}),s.jsx(g,{show:!1})]}),parameters:{docs:{description:{story:"Subtle mode with gentle gaze effects and reduced visual feedback."}}}},d={render:a=>s.jsxs(r,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Dramatic Eye Tracking Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Intense gaze effects with maximum responsiveness and visual feedback"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:["Hero Section","Feature Highlight"].map((e,l)=>s.jsxs(p,{regionId:`dramatic-${l}`,glassIntensity:!0,glassRadius:!0,glassBlur:!0,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 space-y-6 glass-text-center glass-min-glass-h-64",children:[s.jsx("div",{className:"glass-text-4xl",children:"⭐"}),s.jsx("h3",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:e}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"This content dramatically responds to your gaze with intense glass effects."}),s.jsx("div",{className:"glass-text-sm glass-text-tertiary",children:"🎭 Look at this to see dramatic gaze responsiveness"})]},e))})]}),s.jsx(g,{show:!0})]}),parameters:{docs:{description:{story:"Dramatic mode with intense gaze effects and maximum visual feedback."}}}},m={render:a=>s.jsxs(r,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Accessibility Eye Tracking Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"High contrast gaze effects optimized for accessibility"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:["Accessible Content","High Contrast Card"].map((e,l)=>s.jsxs(p,{regionId:`accessibility-${l}`,glassIntensity:!0,glassRadius:!0,glassBlur:!1,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4 glass-border-2 glass-border-transparent hover:glass-border-blue",children:[s.jsx("div",{className:"glass-text-2xl",children:"♿"}),s.jsx("h3",{className:"glass-text-xl glass-font-bold glass-text-primary",children:e}),s.jsx("p",{className:"glass-text-base glass-text-secondary",children:"This content uses high contrast gaze effects for better accessibility."}),s.jsx("div",{className:"glass-text-sm glass-text-tertiary",children:"Designed for users with visual accessibility needs"})]},e))})]}),s.jsx(g,{show:!0})]}),parameters:{docs:{description:{story:"Accessibility mode with high contrast effects and clear visual feedback."}}}},x={render:()=>s.jsxs(r,{autoInitialize:!1,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Eye Tracking Visualization"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-8",children:"Debug overlay showing gaze regions and interaction states"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-3 glass-gap-4",children:Array.from({length:9},(a,e)=>s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center",children:[s.jsx("div",{className:"glass-text-lg glass-mb-2",children:"📍"}),s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:["Region ",e+1]})]},e))})]}),s.jsx(g,{show:!0})]}),parameters:{docs:{description:{story:"Shows the gaze visualization overlay for debugging gaze regions."}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <GlassEyeTrackingProvider {...args}>
      <EyeTrackingDemo />
    </GlassEyeTrackingProvider>,
  args: {
    autoInitialize: false,
    onGazeInteraction: fn()
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8">
        <div className="glass-text-center space-y-6">
          <h1 className="glass-text-3xl glass-font-bold glass-text-primary">
            Eye Tracking Calibration
          </h1>
          <p className="glass-text-lg glass-text-secondary">
            Complete calibration to enable gaze-responsive effects
          </p>
          
          <GlassEyeTrackingCalibration onComplete={() => {
          console.log('✅ Eye tracking calibration completed!');
          alert('Calibration completed! You can now use gaze interactions.');
        }} />
        </div>
      </div>
    </GlassEyeTrackingProvider>,
  args: {
    autoInitialize: true,
    onGazeInteraction: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the calibration flow required before eye tracking can be used.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Subtle Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Gentle gaze effects with reduced intensity and minimal visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Article Card', 'Product Info', 'Call to Action'].map((title, i) => <GlassGazeResponsive key={title} regionId={\`subtle-\${i}\`} glassIntensity={true} glassRadius={false} glassBlur={false} className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-gap-4">
              <div className="glass-text-xl">📄</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">{title}</h3>
              <p className="glass-text-sm glass-text-secondary">
                This content subtly responds to your gaze with minimal effects.
              </p>
              <div className="glass-text-xs glass-text-tertiary">
                Look at this card to see subtle gaze responsiveness
              </div>
            </GlassGazeResponsive>)}
        </div>
      </div>
      <GlassGazeVisualization show={false} />
    </GlassEyeTrackingProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Subtle mode with gentle gaze effects and reduced visual feedback.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Dramatic Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Intense gaze effects with maximum responsiveness and visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          {['Hero Section', 'Feature Highlight'].map((title, i) => <GlassGazeResponsive key={title} regionId={\`dramatic-\${i}\`} glassIntensity={true} glassRadius={true} glassBlur={true} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 space-y-6 glass-text-center glass-min-glass-h-64">
              <div className="glass-text-4xl">⭐</div>
              <h3 className="glass-text-2xl glass-font-bold glass-text-primary">{title}</h3>
              <p className="glass-text-lg glass-text-secondary">
                This content dramatically responds to your gaze with intense glass effects.
              </p>
              <div className="glass-text-sm glass-text-tertiary">
                🎭 Look at this to see dramatic gaze responsiveness
              </div>
            </GlassGazeResponsive>)}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Dramatic mode with intense gaze effects and maximum visual feedback.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <GlassEyeTrackingProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Accessibility Eye Tracking Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            High contrast gaze effects optimized for accessibility
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
          {['Accessible Content', 'High Contrast Card'].map((title, i) => <GlassGazeResponsive key={title} regionId={\`accessibility-\${i}\`} glassIntensity={true} glassRadius={true} glassBlur={false} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4 glass-border-2 glass-border-transparent hover:glass-border-blue">
              <div className="glass-text-2xl">♿</div>
              <h3 className="glass-text-xl glass-font-bold glass-text-primary">{title}</h3>
              <p className="glass-text-base glass-text-secondary">
                This content uses high contrast gaze effects for better accessibility.
              </p>
              <div className="glass-text-sm glass-text-tertiary">
                Designed for users with visual accessibility needs
              </div>
            </GlassGazeResponsive>)}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Accessibility mode with high contrast effects and clear visual feedback.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <GlassEyeTrackingProvider autoInitialize={false}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Eye Tracking Visualization
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-8">
            Debug overlay showing gaze regions and interaction states
          </p>
        </div>

        <div className="glass-grid glass-glass-grid-cols-3 glass-gap-4">
          {Array.from({
          length: 9
        }, (_, i) => <div key={i} className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center">
              <div className="glass-text-lg glass-mb-2">📍</div>
              <div className="glass-text-sm glass-text-primary">Region {i + 1}</div>
            </div>)}
        </div>
      </div>
      <GlassGazeVisualization show={true} />
    </GlassEyeTrackingProvider>,
  parameters: {
    docs: {
      description: {
        story: 'Shows the gaze visualization overlay for debugging gaze regions.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const R=["Interactive","WithCalibration","SubtleMode","DramaticMode","AccessibilityMode","VisualizationOnly"];export{m as AccessibilityMode,d as DramaticMode,c as Interactive,o as SubtleMode,x as VisualizationOnly,n as WithCalibration,R as __namedExportsOrder,S as default};
