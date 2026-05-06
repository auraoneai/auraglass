import{j as s,r as d}from"./iframe-BEVTBSqr.js";import{b as c,G as r,a as t,c as o,u as k}from"./GlassBiometricAdaptation-BLAoJQ8Y.js";import"./preload-helper-PPVm8Dsz.js";import"./MotionPreferenceContext-FWf-G1hj.js";import"./OptimizedGlassCore-BMFMzxVt.js";const P={title:"Advanced/Consciousness Interface/Biometric Adaptation",component:r,parameters:{layout:"fullscreen",docs:{description:{component:`
# Glass Biometric Adaptation System

Heart rate and stress-responsive UI with device sensors and behavioral analysis.

## Features
- **Device Sensor Integration** - Accelerometer, gyroscope, and ambient light sensors
- **Behavioral Stress Analysis** - Analyzes interaction patterns to detect stress
- **Heart Rate Monitoring** - Web Bluetooth API integration for heart rate monitors
- **Adaptive UI Responses** - Interface adapts colors, motion, layout based on stress levels
- **Real-time Dashboard** - Biometric monitoring with visualization and controls

## Biometric Detection Methods
- **Behavioral Analysis** - Rapid clicking, irregular movements, prolonged hover times
- **Device Motion** - Accelerometer and gyroscope for agitation detection
- **Environmental Context** - Ambient light, time of day patterns
- **Heart Rate Devices** - Bluetooth heart rate monitors (requires pairing)
- **Machine Learning** - Pattern recognition for stress indicators

## Adaptation Types
- **Color Adaptation** - Calming colors during stress, energizing colors when calm
- **Motion Adaptation** - Slower animations during stress to reduce overstimulation
- **Layout Adaptation** - Simplified layouts with increased spacing during stress
- **Audio Adaptation** - Reduced volume and calming frequencies during stress

## Privacy & Security
- **Local Processing** - All biometric analysis happens on-device
- **No Data Transmission** - Biometric data never leaves the user's browser
- **Behavioral Inference** - Uses interaction patterns, not raw biometric data
- **User Control** - Users can disable sensors and adaptations at any time

## Stress Levels
- **0.0 - 0.3** - Calm state (energizing adaptations)
- **0.3 - 0.7** - Normal state (standard interface)
- **0.7 - 1.0** - Stressed state (calming adaptations)
        `}}},argTypes:{settings:{control:"object",description:"Biometric adaptation configuration"},autoInitialize:{control:"boolean",description:"Automatically initialize biometric monitoring"}},tags:["autodocs"]};function C(){const{latestReading:e,currentStressLevel:n,connectHeartRateMonitor:i,engine:R}=k(),[u,g]=d.useState(0),[b,f]=d.useState(0),[y,j]=d.useState(0),[N,S]=d.useState(!0),A=a=>{switch(a){case"calm":g(.1);break;case"focused":g(.4);break;case"stressed":g(.8);break;case"overwhelmed":g(.95);break}},w=()=>{j(a=>a+1),f(a=>a+1),y>10&&g(Math.min(1,u+.1))};d.useEffect(()=>{const a=setInterval(()=>{j(B=>Math.max(0,B-1))},2e3);return()=>clearInterval(a)},[]);const l=Math.max(n,u);return s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary",children:"🌡️ Glass Biometric Adaptation"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"Interface that adapts to your physiological and behavioral state"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-items-center space-x-6",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("div",{className:"glass-w-3 glass-h-3 glass-radius-full",style:{backgroundColor:l>.7?"var(--glass-color-danger)":l>.4?"var(--glass-color-warning)":"var(--glass-color-success)"}}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["Stress: ",(l*100).toFixed(0),"%"]})]}),e?.heartRate&&s.jsx("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["❤️ ",e.heartRate," BPM"]})}),s.jsx("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["🖱️ Interactions: ",b]})})]}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4",children:[s.jsx("button",{onClick:()=>S(!N),className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:N?"📊 Hide Dashboard":"📊 Show Dashboard"}),s.jsx("button",{onClick:i,className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"❤️ Connect Heart Rate Monitor"})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"🎭 Stress Simulation"}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4",children:[{scenario:"calm",label:"Calm State",icon:"😌",stress:.1},{scenario:"focused",label:"Focused",icon:"🎯",stress:.4},{scenario:"stressed",label:"Stressed",icon:"😰",stress:.8},{scenario:"overwhelmed",label:"Overwhelmed",icon:"🤯",stress:.95}].map(a=>s.jsxs("button",{onClick:()=>A(a.scenario),className:`glass-surface-secondary glass-elev-2 glass-radius-lg glass-p-4 text-center glass-gap-2
                         hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard
                         ${u===a.stress?"ring-2 ring-blue-500":""}`,children:[s.jsx("div",{className:"glass-text-2xl",children:a.icon}),s.jsx("div",{className:"glass-text-sm glass-text-primary glass-font-medium",children:a.label}),s.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:[(a.stress*100).toFixed(0),"%"]})]},a.scenario))}),s.jsx("div",{className:"glass-mt-4 glass-text-center",children:s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click buttons above to simulate different stress states and see interface adaptations"})})]}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"🎨 Adaptive Interface Elements"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"These elements adapt their appearance based on your stress level"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsx(t,{adaptationType:"color",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"🎨"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Color Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Colors shift to calming blues when stressed"}),s.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["Current: ",l>.7?"Calming Mode":"Normal Mode"]})]})}),s.jsx(t,{adaptationType:"motion",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"🌊"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Motion Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Animations slow down during stress"}),s.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["Speed: ",l>.7?"Slower":"Normal"]})]})}),s.jsx(t,{adaptationType:"layout",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"📐"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Layout Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Spacing increases when stressed"}),s.jsxs("div",{className:"glass-text-xs glass-text-tertiary",children:["Density: ",l>.7?"Reduced":"Normal"]})]})})]}),s.jsx(t,{adaptationType:"all",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-text-center space-y-6",children:[s.jsx("div",{className:"glass-text-3xl",children:"🧘‍♀️"}),s.jsx("h3",{className:"glass-text-xl glass-font-bold glass-text-primary",children:"Full Biometric Adaptation"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"This element uses all adaptation types: color, motion, and layout"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsxs("div",{className:"glass-text-sm glass-text-tertiary",children:["Adaptation Status: ",l>.7?"🧘‍♀️ Calming Mode Active":"⚡ Normal Mode"]}),s.jsx("div",{className:"glass-text-sm glass-text-tertiary",children:"Interface responds to stress in real-time"})]})]})})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"🖱️ Behavioral Stress Detection"}),s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click rapidly on the button below to simulate stress behavior"}),s.jsx("button",{onClick:w,className:`glass-surface-secondary glass-elev-2 glass-radius-lg glass-px-8 glass-py-4 glass-text-lg glass-font-medium
                      hover:glass-elev-3 transition-all duration-300 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard`,children:"🖱️ Stress Test Button"}),s.jsxs("div",{className:"glass-gap-2",children:[s.jsxs("div",{className:"glass-text-sm glass-text-tertiary",children:["Rapid Clicks: ",y," | ",y>10?"🚨 Stress Detected!":"✅ Normal Behavior"]}),s.jsx("div",{className:"glass-text-xs glass-text-quaternary",children:"Click rapidly multiple times to trigger behavioral stress detection"})]})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"📊 Biometric Detection Methods"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Behavioral Analysis"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Rapid clicking patterns"}),s.jsx("li",{children:"• Irregular mouse movements"}),s.jsx("li",{children:"• Prolonged hover times"}),s.jsx("li",{children:"• Error frequency tracking"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Device Sensors"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Accelerometer (device shake)"}),s.jsx("li",{children:"• Gyroscope (rotation patterns)"}),s.jsx("li",{children:"• Ambient light sensor"}),s.jsx("li",{children:"• Time-based context"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"External Devices"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Bluetooth heart rate monitors"}),s.jsx("li",{children:"• Fitness trackers (via Web Bluetooth)"}),s.jsx("li",{children:"• Smartwatch integration"}),s.jsx("li",{children:"• Health device APIs"})]})]})]})]}),s.jsx(o,{show:N})]})}const m={render:e=>s.jsx(r,{...e,children:s.jsx(C,{})}),args:{settings:c.standard,autoInitialize:!0}},p={render:e=>s.jsxs(r,{...e,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Subtle Biometric Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Gentle adaptations with reduced sensitivity and slower response times"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsx(t,{adaptationType:"all",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"🌅"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Subtle Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Gentle changes that don't distract from the main experience"})]})}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-3",children:"Settings"}),s.jsxs("div",{className:"glass-gap-2 glass-text-sm glass-text-secondary",children:[s.jsx("div",{children:"• Sensitivity: 30% (Low)"}),s.jsx("div",{children:"• Response Speed: 2000ms (Slow)"}),s.jsx("div",{children:"• Stress Threshold: 80% (High)"}),s.jsx("div",{children:"• Calming Threshold: 20% (Low)"})]})]})]})]}),s.jsx(o,{show:!0})]}),args:{settings:c.subtle,autoInitialize:!0},parameters:{docs:{description:{story:"Subtle mode with gentle adaptations and reduced sensitivity."}}}},x={render:e=>s.jsxs(r,{...e,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Sensitive Biometric Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Highly responsive adaptations that react quickly to biometric changes"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:["Quick Response","High Sensitivity","Immediate Feedback"].map((n,i)=>s.jsx(t,{adaptationType:"all",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl",children:"⚡"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:n}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Responds immediately to even small changes in stress levels"})]})},n))}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-3",children:"Sensitive Mode Settings"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-secondary",children:[s.jsx("div",{children:"• Sensitivity: 90% (Very High)"}),s.jsx("div",{children:"• Response Speed: 500ms (Fast)"}),s.jsx("div",{children:"• Stress Threshold: 50% (Low)"}),s.jsx("div",{children:"• Calming Threshold: 40% (High)"})]})]})]}),s.jsx(o,{show:!0})]}),args:{settings:c.sensitive,autoInitialize:!0},parameters:{docs:{description:{story:"Sensitive mode with high responsiveness and quick adaptations."}}}},h={render:e=>s.jsxs(r,{...e,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Accessibility Biometric Adaptation"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Optimized for users with accessibility needs and clear visual feedback"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8",children:[s.jsx(t,{adaptationType:"all",children:s.jsxs("div",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-gap-4 glass-border-2 glass-border-blue/30",children:[s.jsx("div",{className:"glass-text-3xl",children:"♿"}),s.jsx("h3",{className:"glass-text-xl glass-font-bold glass-text-primary",children:"Accessible Adaptation"}),s.jsx("p",{className:"glass-text-base glass-text-secondary",children:"High contrast adaptations with clear visual feedback for users with accessibility needs"}),s.jsx("div",{className:"glass-text-sm glass-text-tertiary glass-p-3 glass-surface-blue/10 glass-radius-md",children:"ℹ️ This element provides clear visual indicators of adaptation state"})]})}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-3",children:"Accessibility Features"}),s.jsxs("ul",{className:"glass-gap-2 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• High contrast mode support"}),s.jsx("li",{children:"• Clear visual state indicators"}),s.jsx("li",{children:"• Reduced motion options"}),s.jsx("li",{children:"• Screen reader compatibility"}),s.jsx("li",{children:"• Keyboard navigation support"})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-3",children:"Settings"}),s.jsxs("div",{className:"glass-gap-2 glass-text-sm glass-text-secondary",children:[s.jsx("div",{children:"• All adaptations enabled"}),s.jsx("div",{children:"• Stress threshold: 60%"}),s.jsx("div",{children:"• High contrast mode"}),s.jsx("div",{children:"• Clear visual feedback"})]})]})]})]})]}),s.jsx(o,{show:!0})]}),args:{settings:c.accessibility,autoInitialize:!0},parameters:{docs:{description:{story:"Accessibility mode optimized for users with special needs and clear feedback."}}}},v={render:e=>s.jsxs(r,{...e,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4 mb-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:"Biometric Dashboard"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Real-time biometric monitoring and adaptation settings"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8",children:Array.from({length:8},(n,i)=>s.jsxs("button",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>console.log(`Interaction ${i+1}`),children:[s.jsx("div",{className:"glass-text-lg glass-mb-2",children:"🖱️"}),s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:["Action ",i+1]})]},i))})]}),s.jsx(o,{show:!0})]}),args:{settings:c.standard,autoInitialize:!0},parameters:{docs:{description:{story:"Shows the biometric dashboard with interactive elements for testing."}}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <GlassBiometricAdaptationProvider {...args}>
      <BiometricAdaptationDemo />
    </GlassBiometricAdaptationProvider>,
  args: {
    settings: biometricAdaptationPresets.standard,
    autoInitialize: true
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Subtle Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Gentle adaptations with reduced sensitivity and slower response times
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          <GlassStressResponsive adaptationType="all">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4">
              <div className="glass-text-2xl">🌅</div>
              <h3 className="glass-text-lg glass-font-medium glass-text-primary">Subtle Adaptation</h3>
              <p className="glass-text-sm glass-text-secondary">
                Gentle changes that don't distract from the main experience
              </p>
            </div>
          </GlassStressResponsive>
          
          <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
            <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Settings</h4>
            <div className="glass-gap-2 glass-text-sm glass-text-secondary">
              <div>• Sensitivity: 30% (Low)</div>
              <div>• Response Speed: 2000ms (Slow)</div>
              <div>• Stress Threshold: 80% (High)</div>
              <div>• Calming Threshold: 20% (Low)</div>
            </div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>,
  args: {
    settings: biometricAdaptationPresets.subtle,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle mode with gentle adaptations and reduced sensitivity.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Sensitive Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Highly responsive adaptations that react quickly to biometric changes
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Quick Response', 'High Sensitivity', 'Immediate Feedback'].map((title, i) => <GlassStressResponsive key={title} adaptationType="all">
              <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-gap-4">
                <div className="glass-text-2xl">⚡</div>
                <h3 className="glass-text-lg glass-font-medium glass-text-primary">{title}</h3>
                <p className="glass-text-sm glass-text-secondary">
                  Responds immediately to even small changes in stress levels
                </p>
              </div>
            </GlassStressResponsive>)}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
          <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Sensitive Mode Settings</h4>
          <div className="glass-grid glass-glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-secondary">
            <div>• Sensitivity: 90% (Very High)</div>
            <div>• Response Speed: 500ms (Fast)</div>
            <div>• Stress Threshold: 50% (Low)</div>
            <div>• Calming Threshold: 40% (High)</div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>,
  args: {
    settings: biometricAdaptationPresets.sensitive,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Sensitive mode with high responsiveness and quick adaptations.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Accessibility Biometric Adaptation
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Optimized for users with accessibility needs and clear visual feedback
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-8">
          <GlassStressResponsive adaptationType="all">
            <div className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-gap-4 glass-border-2 glass-border-blue/30">
              <div className="glass-text-3xl">♿</div>
              <h3 className="glass-text-xl glass-font-bold glass-text-primary">Accessible Adaptation</h3>
              <p className="glass-text-base glass-text-secondary">
                High contrast adaptations with clear visual feedback for users with accessibility needs
              </p>
              <div className="glass-text-sm glass-text-tertiary glass-p-3 glass-surface-blue/10 glass-radius-md">
                ℹ️ This element provides clear visual indicators of adaptation state
              </div>
            </div>
          </GlassStressResponsive>
          
          <div className="space-y-6">
            <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
              <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Accessibility Features</h4>
              <ul className="glass-gap-2 glass-text-sm glass-text-secondary">
                <li>• High contrast mode support</li>
                <li>• Clear visual state indicators</li>
                <li>• Reduced motion options</li>
                <li>• Screen reader compatibility</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            
            <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
              <h4 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-3">Settings</h4>
              <div className="glass-gap-2 glass-text-sm glass-text-secondary">
                <div>• All adaptations enabled</div>
                <div>• Stress threshold: 60%</div>
                <div>• High contrast mode</div>
                <div>• Clear visual feedback</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>,
  args: {
    settings: biometricAdaptationPresets.accessibility,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Accessibility mode optimized for users with special needs and clear feedback.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <GlassBiometricAdaptationProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8">
        <div className="glass-text-center glass-gap-4 mb-8">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary">
            Biometric Dashboard
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Real-time biometric monitoring and adaptation settings
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8">
          {Array.from({
          length: 8
        }, (_, i) => <button key={i} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-4 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => console.log(\`Interaction \${i + 1}\`)}>
              <div className="glass-text-lg glass-mb-2">🖱️</div>
              <div className="glass-text-sm glass-text-primary">Action {i + 1}</div>
            </button>)}
        </div>
      </div>
      <GlassBiometricDashboard show={true} />
    </GlassBiometricAdaptationProvider>,
  args: {
    settings: biometricAdaptationPresets.standard,
    autoInitialize: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the biometric dashboard with interactive elements for testing.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};const H=["Interactive","SubtleMode","SensitiveMode","AccessibilityMode","DashboardOnly"];export{h as AccessibilityMode,v as DashboardOnly,m as Interactive,x as SensitiveMode,p as SubtleMode,H as __namedExportsOrder,P as default};
